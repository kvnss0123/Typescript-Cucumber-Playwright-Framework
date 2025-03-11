// File: src/pages/common/NavigationPage.ts

import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class NavigationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToNewSubmission() {
    this.logger.info('Navigating to new submission');
    await this.page.click('div[id*="DesktopMenuActions:DesktopMenuActions_Create:DesktopMenuActions_NewSubmission"]');
    await this.waitForPageLoad();
  }

  async selectAccountFromSearch(accountNumber: string) {
    this.logger.info(`Selecting account: ${accountNumber}`);
    await this.page.fill('input[name*="AccountNumber"]', accountNumber);
    await this.page.click('button:has-text("Search")');

    await this.waitForPageLoad();

    // Click on the account in search results
    await this.page.click(`a:has-text("${accountNumber}")`);
    await this.waitForPageLoad();
  }

  async selectBusinessLine(businessLine: string) {
    this.logger.info(`Selecting business line: ${businessLine}`);
    // For ESB Businessowners
    if (businessLine === 'Businessowners') {
      await this.page.click('div[id*="ProductSelection:ProductSelectionScreen:ProductSelectionLV-body"] >> text="ESB Businessowners"');
    }
    // For ESB Commercial Auto
    else if (businessLine === 'CommercialAuto') {
      await this.page.click('div[id*="ProductSelection:ProductSelectionScreen:ProductSelectionLV-body"] >> text="ESB Commercial Auto"');
    }

    await this.page.click('button:has-text("Select")');
    await this.waitForPageLoad();
  }

  async navigateToPolicyTab(tabName: string) {
    this.logger.info(`Navigating to policy tab: ${tabName}`);

    // First, try to find the element by its label
    const selector = `div[role="menuitem"][aria-label="${tabName}"]`;

    try {
      // Wait for the element to be visible
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });

      // Click the element
      await this.page.click(selector);
    } catch (error) {
      // If the first attempt fails, try an alternative selector
      this.logger.warn(`Failed to find tab "${tabName}" by aria-label. Trying alternative method.`);

      const alternativeSelector = `div.gw-label:text-is("${tabName}")`;
      await this.page.click(alternativeSelector);
    }

    // Wait for navigation to complete
    await this.waitForPageLoad();
  }
}
