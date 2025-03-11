// File: src/pages/BasePage.ts
import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../core/Logger';

export class BasePage {
  protected page: Page;
  protected logger: Logger;

  // Common selectors in PolicyCenter
  protected submitButton = 'button:has-text("Submit")';
  protected cancelButton = 'button:has-text("Cancel")';
  protected nextButton = 'button:has-text("Next")';
  protected backButton = 'button:has-text("Back")';
  protected updateButton = 'button:has-text("Update")';
  protected addButton = 'button:has-text("Add")';
  protected editButton = 'button:has-text("Edit")';
  protected deleteButton = 'button:has-text("Delete")';

  // Error message locators
  protected errorMessage = '.message.error';

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger();
  }

  async waitForPageLoad() {
    await this.page.waitForFunction(() => {
      return !document.querySelector('.gw-click-overlay') &&
             !document.querySelector('.gw-processing');
    }, { timeout: 30000 });
  }

  async getPageTitle() {
    await this.waitForPageLoad();
    return this.page.title();
  }

  async clickButton(locator: string, options = { waitForNavigation: true }) {
    this.logger.info(`Clicking button: ${locator}`);
    await this.page.click(locator);

    if (options.waitForNavigation) {
      await this.waitForPageLoad();
    }
  }

  async fillField(locator: string, value: string) {
    this.logger.info(`Filling field ${locator} with value: ${value}`);
    await this.page.fill(locator, value);
  }

  async selectDropdownOption(locator: string, option: string) {
    this.logger.info(`Selecting option ${option} from dropdown ${locator}`);
    await this.page.click(locator);
    await this.page.click(`text="${option}"`);
  }

  async checkCheckbox(locator: string, check: boolean = true) {
    this.logger.info(`Setting checkbox ${locator} to ${check}`);
    const checkbox = this.page.locator(locator);
    const isChecked = await checkbox.isChecked();

    if ((check && !isChecked) || (!check && isChecked)) {
      await checkbox.click();
    }
  }

  async verifyElementPresent(locator: string) {
    this.logger.info(`Verifying element present: ${locator}`);
    const element = this.page.locator(locator);
    await expect(element).toBeVisible();
  }

  async verifyText(locator: string, text: string) {
    this.logger.info(`Verifying text ${text} in ${locator}`);
    const element = this.page.locator(locator);
    await expect(element).toContainText(text);
  }

  async hasErrors() {
    const errorElements = this.page.locator(this.errorMessage);
    return await errorElements.count() > 0;
  }

  async getErrorMessages() {
    const errorElements = this.page.locator(this.errorMessage);
    const count = await errorElements.count();
    const messages = [];

    for (let i = 0; i < count; i++) {
      messages.push(await errorElements.nth(i).textContent());
    }

    return messages;
  }
}
