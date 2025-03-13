const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class PolicyCenterLocatorExtractor {
  constructor(baseUrl, outputDir) {
    this.baseUrl = baseUrl;
    this.outputDir = outputDir;
    this.visitedUrls = new Set();
    this.pageObjects = {};
    this.currentPage = null;
  }

  async initialize() {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Launch browser
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: { dir: path.join(this.outputDir, 'videos') }
    });
    this.page = await this.context.newPage();

    // Add event listeners for AJAX navigation
    this.page.on('load', () => this.detectPageChange());
    this.page.on('framenavigated', () => this.detectPageChange());
    // For AJAX-based applications, we need to monitor DOM changes
    await this.page.addInitScript(() => {
      const observer = new MutationObserver((mutations) => {
        window.ajaxNavigationDetected = true;
      });
      observer.observe(document.body, { childList: true, subtree: true });
      window.ajaxNavigationDetected = false;
    });
  }

  async detectPageChange() {
    // Determine the current page/screen based on visible elements
    // For AJAX-based apps, look for specific indicators in the DOM
    await this.page.waitForLoadState('networkidle');

    const currentPageTitle = await this.page.title();
    // Get the visible screen identifier - specific to PolicyCenter's structure
    const screenIdentifier = await this.page.evaluate(() => {
      // Look for screen identifiers based on PolicyCenter's DOM structure
      // This is a simplified example; you'd need to customize this based on the actual app
      const breadcrumbElement = document.querySelector('.gw-breadcrumb, .breadcrumb');
      const titleElement = document.querySelector('.gw-screen-title, .screen-title');

      if (breadcrumbElement) {
        return breadcrumbElement.textContent.trim();
      } else if (titleElement) {
        return titleElement.textContent.trim();
      } else {
        return document.title;
      }
    });

    if (screenIdentifier && this.currentPage !== screenIdentifier) {
      this.currentPage = screenIdentifier;
      console.log(`Detected screen change: ${screenIdentifier}`);
      await this.extractLocators(screenIdentifier);
    }
  }

  async extractLocators(screenName) {
    // Normalize screen name for file naming
    const normalizedScreenName = screenName
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .toLowerCase();

    // Wait for the page to stabilize
    await this.page.waitForLoadState('networkidle');

    // Extract form fields
    const formFields = await this.extractFormFields();

    // Extract buttons
    const buttons = await this.extractButtons();

    // Extract tables and grid elements
    const tables = await this.extractTables();

    // Extract navigation elements
    const navElements = await this.extractNavigationElements();

    // Combine all locators
    const locators = {
      ...formFields,
      ...buttons,
      ...tables,
      ...navElements
    };

    // Store in pageObjects
    this.pageObjects[normalizedScreenName] = locators;

    // Save to YAML file
    this.saveToYaml(normalizedScreenName, locators);

    console.log(`Extracted ${Object.keys(locators).length} locators for screen: ${screenName}`);
  }

  async extractFormFields() {
    return this.page.evaluate(() => {
      const fields = {};

      // Get input fields
      document.querySelectorAll('input, select, textarea').forEach((element, index) => {
        // Skip hidden fields
        if (element.type === 'hidden' || !element.offsetParent) return;

        // Try to find a good name for this element
        let fieldName = '';

        // Look for label
        const labelElement = element.labels && element.labels.length > 0
          ? element.labels[0]
          : document.querySelector(`label[for="${element.id}"]`);

        if (labelElement) {
          fieldName = labelElement.textContent.trim();
        }

        // If no label, try placeholder, name, or id
        if (!fieldName) {
          fieldName = element.placeholder || element.name || element.id;
        }

        // If still no name, use element type with index
        if (!fieldName) {
          fieldName = `${element.tagName.toLowerCase()}_${index}`;
        }

        // Normalize the field name
        const normalizedFieldName = fieldName
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_+/g, '_')
          .toLowerCase();

        // Generate a CSS selector that's specific enough
        let selector = '';

        // Try using ID (most specific)
        if (element.id) {
          selector = `#${element.id}`;
        }
        // Try using name attribute
        else if (element.name) {
          selector = `${element.tagName.toLowerCase()}[name="${element.name}"]`;
        }
        // Try using class
        else if (element.className) {
          const classes = Array.from(element.classList).join('.');
          selector = `${element.tagName.toLowerCase()}.${classes}`;
        }
        // Fallback to a position-based selector
        else {
          // Building an nth-child selector path
          let currentElement = element;
          const path = [];

          while (currentElement !== document.body && currentElement !== document.documentElement && currentElement.parentElement) {
            const index = Array.from(currentElement.parentElement.children).indexOf(currentElement) + 1;
            path.unshift(`${currentElement.tagName.toLowerCase()}:nth-child(${index})`);
            currentElement = currentElement.parentElement;
          }

          selector = path.join(' > ');
        }

        // Store both the field name and selector
        fields[normalizedFieldName] = {
          type: element.tagName.toLowerCase(),
          selector: selector,
          original_label: fieldName
        };
      });

      return fields;
    });
  }

  async extractButtons() {
    return this.page.evaluate(() => {
      const buttons = {};

      // Get buttons and links that act as buttons
      document.querySelectorAll('button, input[type="button"], input[type="submit"], a.button, .gw-button, .gw-action--outer').forEach((element, index) => {
        // Skip hidden elements
        if (!element.offsetParent) return;

        // Try to find a good name
        let buttonName = element.textContent.trim() ||
                         element.value ||
                         element.title ||
                         element.ariaLabel ||
                         element.name ||
                         element.id;

        // If no name found, use a generic name
        if (!buttonName) {
          buttonName = `button_${index}`;
        }

        // Normalize button name
        const normalizedButtonName = buttonName
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_+/g, '_')
          .toLowerCase();

        // Generate selector
        let selector = '';

        if (element.id) {
          selector = `#${element.id}`;
        } else if (element.name) {
          selector = `${element.tagName.toLowerCase()}[name="${element.name}"]`;
        } else if (element.textContent.trim()) {
          // Text-based selector for buttons - useful in Playwright
          selector = `text="${element.textContent.trim()}"`;
        } else {
          // Class-based selector as fallback
          const classes = Array.from(element.classList).join('.');
          if (classes) {
            selector = `${element.tagName.toLowerCase()}.${classes}`;
          } else {
            // Position-based selector as last resort
            let currentElement = element;
            const path = [];

            while (currentElement !== document.body && currentElement !== document.documentElement && currentElement.parentElement) {
              const index = Array.from(currentElement.parentElement.children).indexOf(currentElement) + 1;
              path.unshift(`${currentElement.tagName.toLowerCase()}:nth-child(${index})`);
              currentElement = currentElement.parentElement;
            }

            selector = path.join(' > ');
          }
        }

        buttons[`btn_${normalizedButtonName}`] = {
          type: 'button',
          selector: selector,
          original_text: buttonName
        };
      });

      return buttons;
    });
  }

  async extractTables() {
    return this.page.evaluate(() => {
      const tables = {};

      // Get tables and grid structures
      document.querySelectorAll('table, .gw-grid, div[role="grid"], .gw-ListView--UI').forEach((element, index) => {
        // Skip hidden elements
        if (!element.offsetParent) return;

        // Try to find a good name
        let tableName = '';

        // Look for caption or nearby heading
        const caption = element.querySelector('caption');
        if (caption) {
          tableName = caption.textContent.trim();
        } else {
          // Try to find a heading above the table
          let prevElement = element.previousElementSibling;
          while (prevElement && !tableName) {
            if (prevElement.tagName.match(/^H\d$/)) {
              tableName = prevElement.textContent.trim();
              break;
            }
            prevElement = prevElement.previousElementSibling;
          }
        }

        // If no name found, use a generic name
        if (!tableName) {
          tableName = `table_${index}`;
        }

        // Normalize table name
        const normalizedTableName = tableName
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_+/g, '_')
          .toLowerCase();

        // Generate selector
        let selector = '';

        if (element.id) {
          selector = `#${element.id}`;
        } else {
          // Class-based selector
          const classes = Array.from(element.classList).join('.');
          if (classes) {
            selector = `${element.tagName.toLowerCase()}.${classes}`;
          } else {
            // Position-based selector as last resort
            let currentElement = element;
            const path = [];

            while (currentElement !== document.body && currentElement !== document.documentElement && currentElement.parentElement) {
              const index = Array.from(currentElement.parentElement.children).indexOf(currentElement) + 1;
              path.unshift(`${currentElement.tagName.toLowerCase()}:nth-child(${index})`);
              currentElement = currentElement.parentElement;
            }

            selector = path.join(' > ');
          }
        }

        tables[`table_${normalizedTableName}`] = {
          type: 'table',
          selector: selector,
          original_name: tableName,
          // Add common operations for tables
          row_selector: `${selector} tr, ${selector} div[role="row"], ${selector} .gw-ListView--row`,
          cell_selector: `${selector} td, ${selector} div[role="cell"], ${selector} .gw-ListView--cell`
        };

        // Attempt to extract column headers
        const headerRow = element.querySelector('tr:first-child, div[role="row"]:first-child, .gw-ListView--headerRow');
        if (headerRow) {
          const headers = {};
          let headerCells = headerRow.querySelectorAll('th, td, div[role="columnheader"], .gw-ListView--cell');

          headerCells.forEach((cell, idx) => {
            const headerText = cell.textContent.trim();
            if (headerText) {
              const normalizedHeader = headerText
                .replace(/[^a-zA-Z0-9]/g, '_')
                .replace(/_+/g, '_')
                .toLowerCase();

              headers[normalizedHeader] = {
                selector: `${selector} th:nth-child(${idx + 1}), ${selector} div[role="columnheader"]:nth-child(${idx + 1}), ${selector} .gw-ListView--headerRow .gw-ListView--cell:nth-child(${idx + 1})`,
                index: idx,
                original_text: headerText
              };
            }
          });

          tables[`table_${normalizedTableName}`].columns = headers;
        }
      });

      return tables;
    });
  }

  async extractNavigationElements() {
    return this.page.evaluate(() => {
      const navElements = {};

      // Get navigation elements
      document.querySelectorAll('nav, .gw-navigation, .gw-TabBar, .gw-Tab, ul.menu, div[role="tablist"]').forEach((element, index) => {
        // Skip hidden elements
        if (!element.offsetParent) return;

        // Try to find a good name
        let navName = element.getAttribute('aria-label') ||
                      element.title ||
                      element.id ||
                      `navigation_${index}`;

        // Normalize nav name
        const normalizedNavName = navName
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_+/g, '_')
          .toLowerCase();

        // Generate selector
        let selector = '';

        if (element.id) {
          selector = `#${element.id}`;
        } else {
          // Class-based selector
          const classes = Array.from(element.classList).join('.');
          if (classes) {
            selector = `${element.tagName.toLowerCase()}.${classes}`;
          } else {
            // Position-based selector as last resort
            let currentElement = element;
            const path = [];

            while (currentElement !== document.body && currentElement !== document.documentElement && currentElement.parentElement) {
              const index = Array.from(currentElement.parentElement.children).indexOf(currentElement) + 1;
              path.unshift(`${currentElement.tagName.toLowerCase()}:nth-child(${index})`);
              currentElement = currentElement.parentElement;
            }

            selector = path.join(' > ');
          }
        }

        navElements[`nav_${normalizedNavName}`] = {
          type: 'navigation',
          selector: selector,
          original_name: navName,
          // Add common navigation item selectors
          item_selector: `${selector} a, ${selector} button, ${selector} li, ${selector} .gw-Tab, ${selector} [role="tab"]`
        };

        // Extract navigation items
        const items = {};
        const navItems = element.querySelectorAll('a, button, li:not(:has(> ul)), .gw-Tab, [role="tab"]');

        navItems.forEach((item, idx) => {
          const itemText = item.textContent.trim();
          if (itemText) {
            const normalizedItem = itemText
              .replace(/[^a-zA-Z0-9]/g, '_')
              .replace(/_+/g, '_')
              .toLowerCase();

            // For items, text-based selectors can be very efficient in Playwright
            items[normalizedItem] = {
              selector: `${selector} :text("${itemText}")`,
              text_selector: `text="${itemText}"`,
              original_text: itemText
            };
          }
        });

        navElements[`nav_${normalizedNavName}`].items = items;
      });

      return navElements;
    });
  }

  async navigate(url) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
    await this.detectPageChange();
  }

  async clickAndWait(selector) {
    await this.page.click(selector);
    await this.page.waitForLoadState('networkidle');

    // For AJAX navigation, wait for a moment to detect changes
    await this.page.waitForTimeout(1000);

    // Check if AJAX navigation occurred
    const ajaxNavigated = await this.page.evaluate(() => {
      const result = window.ajaxNavigationDetected;
      window.ajaxNavigationDetected = false;
      return result;
    });

    if (ajaxNavigated) {
      await this.detectPageChange();
    }
  }

  saveToYaml(screenName, locators) {
    const yamlContent = yaml.dump({
      name: screenName,
      description: `Page object for ${screenName} screen in PolicyCenter`,
      locators: locators
    });

    const filePath = path.join(this.outputDir, `${screenName}.yaml`);
    fs.writeFileSync(filePath, yamlContent, 'utf8');
    console.log(`Saved locators to ${filePath}`);
  }

  async crawl(maxPages = 10) {
    // Start from the base URL
    await this.navigate(this.baseUrl);

    // Process login first if needed
    await this.handleLogin();

    let pageCount = 1;
    const pagesToVisit = [];

    // Find and collect clickable elements that might navigate to new pages
    const clickableElements = await this.page.$$eval('a, button, input[type="button"], input[type="submit"], .gw-action--outer', elements => {
      return elements
        .filter(el => el.offsetParent !== null) // Filter out hidden elements
        .map(el => {
          // For each element, collect information we need to interact with it
          return {
            text: el.textContent.trim() || el.value || el.title || 'Unnamed element',
            // Generate a selector for this element
            selector: el.id ? `#${el.id}` :
                     el.textContent.trim() ? `text="${el.textContent.trim()}"` :
                     el.className ? `.${el.className.replace(/\s+/g, '.')}` : null
          };
        })
        .filter(info => info.selector !== null); // Filter out elements we couldn't generate selectors for
    });

    // Add to pages to visit
    pagesToVisit.push(...clickableElements);

    // Continue crawling until we hit max pages or run out of elements to click
    while (pageCount < maxPages && pagesToVisit.length > 0) {
      const nextElement = pagesToVisit.shift();

      try {
        console.log(`Clicking on element: ${nextElement.text}`);
        await this.clickAndWait(nextElement.selector);

        // Increment page count if this led to a new page
        if (this.currentPage) {
          pageCount++;
          console.log(`Visited ${pageCount} pages out of ${maxPages}`);
        }

        // Find new clickable elements on this page
        const newElements = await this.page.$$eval('a, button, input[type="button"], input[type="submit"], .gw-action--outer', elements => {
          return elements
            .filter(el => el.offsetParent !== null)
            .map(el => {
              return {
                text: el.textContent.trim() || el.value || el.title || 'Unnamed element',
                selector: el.id ? `#${el.id}` :
                         el.textContent.trim() ? `text="${el.textContent.trim()}"` :
                         el.className ? `.${el.className.replace(/\s+/g, '.')}` : null
              };
            })
            .filter(info => info.selector !== null);
        });

        // Add new elements to visit
        pagesToVisit.push(...newElements);

        // Go back to enable exploration of other elements
        await this.page.goBack();
        await this.page.waitForLoadState('networkidle');
        await this.detectPageChange();
      } catch (error) {
        console.error(`Error clicking element "${nextElement.text}": ${error.message}`);
        continue; // Skip this element and continue with the next one
      }
    }

    console.log(`Crawl complete. Visited ${pageCount} pages.`);
  }

  async handleLogin() {
      console.log('Login page detected. Please provide login credentials:');

      // In a real implementation, you might want to get these from environment variables
      // or a config file instead of hardcoding
      const username = 'su'; // Default super user for PolicyCenter demos
      const password = 'gw';

      // Find username and password fields
      await this.page.fill('input[name="Login-LoginScreen-LoginDV-username"]', username);
      await this.page.fill('input[name="Login-LoginScreen-LoginDV-password"]', password);

      // Click login button
      // await this.page.click('div[id="Login-LoginScreen-LoginDV-submit"]');

      // Wait for login to complete
      await this.page.waitForLoadState('networkidle');
      await this.detectPageChange();
      console.log('Logged in successfully');
  }

  async generatePageObjectFiles() {
    console.log('Generating finalized page object files...');

    // For each page we've visited, create a well-structured YAML file
    for (const [screenName, locators] of Object.entries(this.pageObjects)) {
      const pageObject = {
        name: screenName,
        description: `Page object for ${screenName} screen in PolicyCenter`,
        base_url: this.baseUrl,
        locators: locators
      };

      const yamlContent = yaml.dump(pageObject);
      const filePath = path.join(this.outputDir, `${screenName}_po.yaml`);
      fs.writeFileSync(filePath, yamlContent, 'utf8');
      console.log(`Generated page object file: ${filePath}`);
    }

    // Generate an index file that references all page objects
    const index = {
      application: 'Guidewire PolicyCenter',
      base_url: this.baseUrl,
      pages: Object.keys(this.pageObjects).map(screenName => ({
        name: screenName,
        file: `${screenName}_po.yaml`
      }))
    };

    const indexYaml = yaml.dump(index);
    const indexPath = path.join(this.outputDir, 'index.yaml');
    fs.writeFileSync(indexPath, indexYaml, 'utf8');
    console.log(`Generated index file: ${indexPath}`);
  }

  async close() {
    await this.generatePageObjectFiles();

    // Close browser
    if (this.browser) {
      await this.browser.close();
    }
    console.log('Browser closed. Locator extraction complete.');
  }
}

// Example usage
async function main() {
  const extractor = new PolicyCenterLocatorExtractor(
    'https://gwdemo.ey.com/pc/PolicyCenter.do',
    './policycenter_page_objects'
  );

  try {
    await extractor.initialize();
    await extractor.crawl(20); // Crawl up to 20 pages
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await extractor.close();
  }
}

main();
