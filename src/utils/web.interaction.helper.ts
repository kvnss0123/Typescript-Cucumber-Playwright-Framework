import { Page, Locator, Frame, FrameLocator } from '@playwright/test';
import { ElementInfo } from '../supports/element.info';
import { LocatorManager } from '../supports/locator.manager';
import * as path from 'path';

/**
 * Helper class for interacting with page elements.
 */
export class WebInteractionHelper extends LocatorManager {
    private static readonly logger = console;
    private static readonly DEFAULT_TIMEOUT = 30000;
    protected page: Page;

    /**
     * Creates a new WebInteractionHelper instance and initializes all pages and locators.
     * @param page Playwright Page instance
     */
    constructor(page: Page) {
        super();
        this.page = page;
        LocatorManager.initializeAllPages(page);
    }

    /**
     * Gets the Playwright Locator object for this element after waiting for it to be in a specific state.
     * @param element Element name to retrieve locator for.
     * @param state State to wait for (visible, hidden, attached, detached).
     * @param timeout Wait timeout in milliseconds.
     * @returns Promise resolving to Playwright Locator object.
     */
    protected async getLocator(element: string, state: 'visible' | 'hidden' | 'attached' | 'detached', timeout: number): Promise<Locator> {
        const elementInfo = new ElementInfo(element);
        WebInteractionHelper.logger.debug(`Getting locator for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);

        try {
            const locator = elementInfo.getLocator();
            await locator.waitFor({ state, timeout });
            await locator.scrollIntoViewIfNeeded();
            return locator;
        } catch (e) {
            const errorMessage = `Timeout waiting for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} to be in state: ${state}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Gets the Playwright Locator object for this element with default wait and scroll into view.
     * @param element Element name to retrieve locator for.
     * @returns Promise resolving to Playwright Locator object.
     */
    protected async getElementLocator(element: string): Promise<Locator> {
        return this.getLocator(element, 'visible', WebInteractionHelper.DEFAULT_TIMEOUT);
    }

    /**
     * Waits for an element to be visible on the page.
     * @param element Element to wait for
     * @param timeout Wait timeout in milliseconds
     */
    public async waitForElement(element: string, timeout: number = WebInteractionHelper.DEFAULT_TIMEOUT): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Waiting for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            await this.getLocator(element, 'visible', timeout);
        } catch (e) {
            const errorMessage = `Failed to wait for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Clicks on the specified element.
     * @param element Element to click on
     * @param timeout Wait timeout in milliseconds
     */
    public async click(element: string, timeout: number = WebInteractionHelper.DEFAULT_TIMEOUT): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Clicking on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getLocator(element, 'visible', timeout);
            await locator.click();
        } catch (e) {
            const errorMessage = `Failed to click on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Clears the text in an input field.
     * @param element Element to clear text from
     */
    public async clear(element: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Clearing text from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.clear();
        } catch (e) {
            const errorMessage = `Failed to clear text from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Focuses on the specified element.
     * @param element Element to focus on
     */
    public async focus(element: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Focusing on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.focus();
        } catch (e) {
            const errorMessage = `Failed to focus on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Hovers over the specified element.
     * @param element Element to hover over
     */
    public async hover(element: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Hovering over element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.hover();
        } catch (e) {
            const errorMessage = `Failed to hover over element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Verifies if an element is enabled.
     * @param element Element to check
     * @returns Promise resolving to true if the element is enabled, false otherwise
     */
    public async isEnabled(element: string): Promise<boolean> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Checking if element is enabled: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            return locator.isEnabled();
        } catch (e) {
            WebInteractionHelper.logger.error(`Error checking enabled state: ${(e as Error).message}`);
            return false;
        }
    }

    /**
     * Verifies if an element is checked (for checkboxes and radio buttons).
     * @param element Element to check
     * @returns Promise resolving to true if the element is checked, false otherwise
     */
    public async isChecked(element: string): Promise<boolean> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Checking if element is checked: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            return locator.isChecked();
        } catch (e) {
            WebInteractionHelper.logger.error(`Error checking checked state: ${(e as Error).message}`);
            return false;
        }
    }

    /**
     * Scrolls to the specified element.
     * @param element Element to scroll to
     */
    public async scrollToElement(element: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Scrolling to element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.scrollIntoViewIfNeeded();
        } catch (e) {
            const errorMessage = `Failed to scroll to element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Checks a checkbox or radio button.
     * @param element Element to check
     */
    public async check(element: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Checking element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.check();
        } catch (e) {
            const errorMessage = `Failed to check element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Unchecks a checkbox or radio button.
     * @param element Element to uncheck
     */
    public async uncheck(element: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Unchecking element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.uncheck();
        } catch (e) {
            const errorMessage = `Failed to uncheck element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Toggles a checkbox or radio button.
     * @param element Element to toggle
     */
    public async toggle(element: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Toggling element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            const isChecked = await locator.isChecked();
            if (isChecked) {
                await locator.uncheck();
            } else {
                await locator.check();
            }
        } catch (e) {
            const errorMessage = `Failed to toggle element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Verifies if an element is visible on the page.
     * @param element Element to verify visibility for
     * @returns Promise resolving to true if visible, false otherwise
     */
    public async isVisible(element: string): Promise<boolean> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Checking visibility of element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            return locator.isVisible();
        } catch (e) {
            WebInteractionHelper.logger.error(`Error checking visibility: ${(e as Error).message}`);
            return false;
        }
    }

    /**
     * Selects an option from a dropdown by visible text.
     * @param element Element to select option from
     * @param option Option to select (text)
     */
    public async selectByText(element: string, option: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Selecting option: ${option} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.selectOption({ label: option });
        } catch (e) {
            const errorMessage = `Failed to select option: ${option} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Selects an option from a dropdown by value.
     * @param element Element to select option from
     * @param value Value to select
     */
    public async selectByValue(element: string, value: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Selecting value: ${value} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.selectOption({ value });
        } catch (e) {
            const errorMessage = `Failed to select value: ${value} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Selects an option from a dropdown by index.
     * @param element Element to select option from
     * @param index Index to select
     */
    public async selectByIndex(element: string, index: number): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Selecting index: ${index} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.selectOption({ index });
        } catch (e) {
            const errorMessage = `Failed to select index: ${index} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Double clicks on the specified element.
     * @param element Element to double click on
     */
    public async doubleClick(element: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Double clicking on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.dblclick();
        } catch (e) {
            const errorMessage = `Failed to double click on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Right clicks on the specified element.
     * @param element Element to right click on
     */
    public async rightClick(element: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Right clicking on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.click({ button: 'right' });
        } catch (e) {
            const errorMessage = `Failed to right click on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Types text into the specified element.
     * @param element Element to type text into
     * @param text Text to type
     */
    public async type(element: string, text: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Typing text: ${text} into element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.fill(text);
        } catch (e) {
            const errorMessage = `Failed to type text into element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Gets the text content of the specified element.
     * @param element Element to get text from
     * @returns Promise resolving to text content of the element
     */
    public async getText(element: string): Promise<string> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Getting text from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            return (await locator.textContent()) || '';
        } catch (e) {
            const errorMessage = `Failed to get text from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Gets the value of the specified attribute of the element.
     * @param element Element to get attribute from
     * @param attribute Attribute name
     * @returns Promise resolving to attribute value
     */
    public async getAttribute(element: string, attribute: string): Promise<string | null> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Getting attribute: ${attribute} from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            return locator.getAttribute(attribute);
        } catch (e) {
            const errorMessage = `Failed to get attribute: ${attribute} from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Gets the value of the specified CSS property of the element.
     * @param element Element to get CSS value from
     * @param cssProperty CSS property name
     * @returns Promise resolving to CSS property value
     */
    public async getCssValue(element: string, cssProperty: string): Promise<string> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Getting CSS property: ${cssProperty} from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            return locator.evaluate((el, prop) => 
                window.getComputedStyle(el).getPropertyValue(prop), cssProperty) as Promise<string>;
        } catch (e) {
            const errorMessage = `Failed to get CSS property: ${cssProperty} from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Drags an element and drops it onto another element.
     * @param sourceElement Element to drag
     * @param targetElement Element to drop onto
     */
    public async dragAndDrop(sourceElement: string, targetElement: string): Promise<void> {
        const sourceElementInfo = new ElementInfo(sourceElement);
        const targetElementInfo = new ElementInfo(targetElement);
        try {
            WebInteractionHelper.logger.debug(`Dragging element: ${sourceElementInfo.getElementName()} and dropping onto element: ${targetElementInfo.getElementName()}`);
            const sourceLocator = await this.getElementLocator(sourceElement);
            const targetLocator = await this.getElementLocator(targetElement);
            await sourceLocator.dragTo(targetLocator);
        } catch (e) {
            const errorMessage = `Failed to drag and drop element: ${sourceElementInfo.getElementName()} onto element: ${targetElementInfo.getElementName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Uploads a file to the specified file input element.
     * @param element Element to upload file to
     * @param filePath Path to the file to upload
     */
    public async uploadFile(element: string, filePath: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Uploading file: ${filePath} to element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.setInputFiles(path.resolve(filePath));
        } catch (e) {
            const errorMessage = `Failed to upload file: ${filePath} to element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Clears the file input element.
     * @param element Element to clear file input from
     */
    public async clearFileInput(element: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Clearing file input for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            await locator.setInputFiles([]);
        } catch (e) {
            const errorMessage = `Failed to clear file input for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Gets the count of elements matching the locator.
     * @param element Element to count
     * @returns Promise resolving to number of elements matching the locator
     */
    public async getElementCount(element: string): Promise<number> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Getting count of elements: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = await this.getElementLocator(element);
            return locator.count();
        } catch (e) {
            const errorMessage = `Failed to get count of elements: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Simulates the press of a key or combination of keys.
     * @param element Element to focus on before pressing the key (optional)
     * @param keys Key or combination of keys to press
     */
    public async pressKey(element: string | null, keys: string): Promise<void> {
        try {
            if (element) {
                const elementInfo = new ElementInfo(element);
                WebInteractionHelper.logger.debug(`Pressing key(s): ${keys} on element: ${elementInfo.getElementName()}`);
                const locator = await this.getElementLocator(element);
                await locator.focus();
            } else {
                WebInteractionHelper.logger.debug(`Pressing key(s): ${keys} on the page`);
            }
            await this.page.keyboard.press(keys);
        } catch (e) {
            const errorMessage = `Failed to press key(s): ${keys}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Switches to a frame using its locator.
     * @param frameLocator Locator of the frame to switch to
     * @returns FrameLocator object
     */
    public switchToFrame(frameLocator: string): FrameLocator {
        try {
            WebInteractionHelper.logger.debug(`Switching to frame: ${frameLocator}`);
            return this.page.frameLocator(frameLocator);
        } catch (e) {
            const errorMessage = `Failed to switch to frame: ${frameLocator}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Switches to a frame by its name or URL and returns it.
     * @param frameNameOrUrl Name or URL of the frame to switch to
     * @returns Frame object
     */
    public switchToFrameByNameOrUrl(frameNameOrUrl: string): Frame {
        try {
            WebInteractionHelper.logger.debug(`Switching to frame by name or URL: ${frameNameOrUrl}`);
            const frame = this.page.frame(frameNameOrUrl);
            if (!frame) {
                throw new Error(`Frame not found: ${frameNameOrUrl}`);
            }
            return frame;
        } catch (e) {
            const errorMessage = `Failed to switch to frame by name or URL: ${frameNameOrUrl}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Switches back to the main page from a frame.
     */
    public switchToMainPage(): void {
        try {
            WebInteractionHelper.logger.debug('Switching back to the main page');
            this.page.mainFrame();
        } catch (e) {
            const errorMessage = 'Failed to switch back to the main page';
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Returns a list of all open tabs (pages).
     * @returns List of Page objects representing open tabs
     */
    public getAllTabs(): Page[] {
        try {
            WebInteractionHelper.logger.debug('Getting all open tabs');
            return this.page.context().pages();
        } catch (e) {
            const errorMessage = 'Failed to get all open tabs';
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Switches to a specific tab by its index.
     * @param index Index of the tab to switch to (starting from 0)
     */
    public switchToTab(index: number): void {
        try {
            WebInteractionHelper.logger.debug(`Switching to tab at index: ${index}`);
            const tabs = this.page.context().pages();
            if (index >= tabs.length) {
                throw new Error(`Tab index out of bounds: ${index}`);
            }
            this.page = tabs[index];
        } catch (e) {
            const errorMessage = `Failed to switch to tab at index: ${index}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Switches to a tab by its title.
     * @param title Title of the tab to switch to
     */
    public async switchToTabByTitle(title: string): Promise<void> {
        try {
            WebInteractionHelper.logger.debug(`Switching to tab with title: ${title}`);
            const tabs = this.page.context().pages();
            for (const tab of tabs) {
                const tabTitle = await tab.title();
                if (title === tabTitle) {
                    this.page = tab;
                    return;
                }
            }
            throw new Error(`No tab found with title: ${title}`);
        } catch (e) {
            const errorMessage = `Failed to switch to tab with title: ${title}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Returns a list of all open windows (pages).
     * @returns List of Page objects representing open windows
     */
    public getAllWindows(): Page[] {
        try {
            WebInteractionHelper.logger.debug('Getting all open windows');
            return this.page.context().pages();
        } catch (e) {
            const errorMessage = 'Failed to get all open windows';
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Switches to a specific window by its index.
     * @param index Index of the window to switch to (starting from 0)
     */
    public switchToWindow(index: number): void {
        try {
            WebInteractionHelper.logger.debug(`Switching to window at index: ${index}`);
            const windows = this.page.context().pages();
            if (index >= windows.length) {
                throw new Error(`Window index out of bounds: ${index}`);
            }
            this.page = windows[index];
        } catch (e) {
            const errorMessage = `Failed to switch to window at index: ${index}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Switches to a window by its URL.
     * @param url URL of the window to switch to
     */
    public async switchToWindowByUrl(url: string): Promise<void> {
        try {
            WebInteractionHelper.logger.debug(`Switching to window with URL: ${url}`);
            const windows = this.page.context().pages();
            for (const window of windows) {
                const windowUrl = window.url();
                if (url === windowUrl) {
                    this.page = window;
                    return;
                }
            }
            throw new Error(`No window found with URL: ${url}`);
        } catch (e) {
            const errorMessage = `Failed to switch to window with URL: ${url}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Checks if an element has a specific attribute.
     * @param element Element to check
     * @param attribute Attribute name
     * @returns Promise resolving to true if the attribute exists, false otherwise
     */
    public async hasAttribute(element: string, attribute: string): Promise<boolean> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Checking if element: ${elementInfo.getElementName()} has attribute: ${attribute}`);
            const locator = await this.getElementLocator(element);
            return (await locator.getAttribute(attribute)) !== null;
        } catch (e) {
            WebInteractionHelper.logger.error(`Error checking attribute: ${(e as Error).message}`);
            return false;
        }
    }

    /**
     * Checks if an element has a specific class.
     * @param element Element to check
     * @param className Class name to check
     * @returns Promise resolving to true if the class exists, false otherwise
     */
    public async hasClass(element: string, className: string): Promise<boolean> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Checking if element: ${elementInfo.getElementName()} has class: ${className}`);
            const locator = await this.getElementLocator(element);
            const classAttribute = await locator.getAttribute('class');
            return classAttribute ? classAttribute.includes(className) : false;
        } catch (e) {
            WebInteractionHelper.logger.error(`Error checking class: ${(e as Error).message}`);
            return false;
        }
    }

    /**
     * Types a value into a currency field.
     * @param element Element to type into
     * @param value Value to type
     */
    public async typeCurrencyField(element: string, value: string): Promise<void> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Typing currency value: ${value} into element: ${elementInfo.getElementName()}`);
            const locator = await this.getElementLocator(element);
            await locator.fill(value);
        } catch (e) {
            const errorMessage = `Failed to type currency value into element: ${elementInfo.getElementName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Retrieves all text contents of elements matching a locator.
     * @param locator Locator of the elements
     * @returns Promise resolving to list of text contents
     */
    public async getAllTextContents(locator: string): Promise<string[]> {
        try {
            WebInteractionHelper.logger.debug(`Getting all text contents for locator: ${locator}`);
            return this.page.locator(locator).allTextContents();
        } catch (e) {
            const errorMessage = `Failed to get all text contents for locator: ${locator}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }

    /**
     * Retrieves the value of an input field.
     * @param element Element to get value from
     * @returns Promise resolving to value of the input field
     */
    public async getInputValue(element: string): Promise<string> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Getting value from element: ${elementInfo.getElementName()}`);
            const locator = await this.getElementLocator(element);
            return locator.inputValue();
        } catch (e) {
            const errorMessage = `Failed to get value from element: ${elementInfo.getElementName()}`;
            WebInteractionHelper.logger.error(errorMessage);
            throw new Error(errorMessage, { cause: e });
        }
    }
}