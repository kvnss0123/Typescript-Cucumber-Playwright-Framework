import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../core/Logger';
import { ElementHelper } from '../utils/ElementHelper';

export class BasePage extends ElementHelper {
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
        // Call the parent class constructor
        super(page);
    }

    /**
       * Waits for the page to fully load by checking for specific overlays or processing indicators.
       * Guidewire-specific: Waits for `.gw-page-load-bar--inner` to disappear.
       */
    async waitForPageLoad(): Promise<void> {
        this.logger.info('Waiting for Guidewire page to load');
        await this.page.waitForSelector('.gw-page-load-bar--inner', { state: 'hidden', timeout: 30000 });
    }

    /**
     * Retrieves the page title.
     * @returns The page title.
     */
    async getPageTitle(): Promise<string> {
        await this.waitForPageLoad();
        return await this.page.title();
    }

    /**
     * Clicks a button and optionally waits for navigation.
     * @param locator - The locator of the button.
     * @param options - Options for the click action.
     */
    async click(locator: string | Locator, options: { waitForNavigation?: boolean } = { waitForNavigation: true }): Promise<void> {
        const button = typeof locator === 'string' ? this.page.locator(locator) : locator;
        this.logger.info(`Clicking: ${locator}`);
        await button.click();

        if (options.waitForNavigation) {
            await this.waitForPageLoad();
        }
    }

    /**
     * Fills a field with a value.
     * @param locator - The locator of the field.
     * @param value - The value to fill.
     */
    async fillInputField(locator: string | Locator, value: string): Promise<void> {
        const field = typeof locator === 'string' ? this.page.locator(locator) : locator;
        this.logger.info(`Filling field ${locator} with value: ${value}`);
        await field.fill(value);
    }

    /**
  * Clicks an option from a dropdown.
  * @param dropdownLocator - The locator of the dropdown.
  * @param option - The locator of the option to select.
  */
    async selectOption(dropdownLocator: string | Locator, optionLocator: string | Locator): Promise<void> {
        const dropdown = typeof dropdownLocator === 'string' ? this.page.locator(dropdownLocator) : dropdownLocator;
        const option = typeof optionLocator === 'string' ? this.page.locator(optionLocator) : optionLocator;
        this.logger.info(`Selecting option ${option} from dropdown ${dropdownLocator}`);
        dropdown.click();
        option.click();
        await this.waitForPageLoad();
    }

    /**
   * Selects an option from a dropdown by its label.
   * @param dropdownLocator - The locator of the dropdown.
   * @param label - The label of the option to select.
   */
    async selectOptionByLabel(dropdownLocator: string | Locator, label: string): Promise<void> {
        const dropdown = typeof dropdownLocator === 'string' ? this.page.locator(dropdownLocator) : dropdownLocator;
        this.logger.info(`Selecting option by label: ${label} from dropdown ${dropdownLocator}`);
        await dropdown.selectOption({ label });
        await this.waitForPageLoad();
    }

    /**
     * Selects an option from a dropdown by its value.
     * @param dropdownLocator - The locator of the dropdown.
     * @param value - The value of the option to select.
     */
    async selectOptionByValue(dropdownLocator: string | Locator, value: string): Promise<void> {
        const dropdown = typeof dropdownLocator === 'string' ? this.page.locator(dropdownLocator) : dropdownLocator;
        this.logger.info(`Selecting option by value: ${value} from dropdown ${dropdownLocator}`);
        await dropdown.selectOption({ value });
        await this.waitForPageLoad();
    }

    /**
     * Selects an option from a dropdown by its index.
     * @param dropdownLocator - The locator of the dropdown.
     * @param index - The index of the option to select (0-based).
     */
    async selectOptionByIndex(dropdownLocator: string | Locator, index: number): Promise<void> {
        const dropdown = typeof dropdownLocator === 'string' ? this.page.locator(dropdownLocator) : dropdownLocator;
        this.logger.info(`Selecting option by index: ${index} from dropdown ${dropdownLocator}`);
        await dropdown.selectOption({ index });
        await this.waitForPageLoad();
    }

    /**
     * Checks or unchecks a checkbox.
     * @param locator - The locator of the checkbox.
     * @param check - Whether to check or uncheck the checkbox.
     */
    async checkCheckbox(locator: string | Locator, check: boolean = true): Promise<void> {
        const checkbox = typeof locator === 'string' ? this.page.locator(locator) : locator;
        this.logger.info(`Setting checkbox ${locator} to ${check}`);
        const isChecked = await checkbox.isChecked();

        if ((check && !isChecked) || (!check && isChecked)) {
            await checkbox.click();
        }
    }

    /**
     * Verifies that an element is present and visible.
     * @param locator - The locator of the element.
     */
    async verifyElementPresent(locator: string | Locator): Promise<void> {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        this.logger.info(`Verifying element present: ${locator}`);
        await expect(element).toBeVisible();
    }

    /**
     * Verifies that an element contains specific text.
     * @param locator - The locator of the element.
     * @param text - The text to verify.
     */
    async verifyText(locator: string | Locator, text: string): Promise<void> {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        this.logger.info(`Verifying text ${text} in ${locator}`);
        await expect(element).toContainText(text);
    }

    /**
  * Retrieves the value of an input field.
  * @param locator - The locator of the input field.
  * @returns The value of the input field.
  */
    async getInputValue(locator: string | Locator): Promise<string> {
        const inputField = typeof locator === 'string' ? this.page.locator(locator) : locator;
        const value = await inputField.inputValue();
        this.logger.info(`Retrieved input value: ${value}`);
        return value;
    }

    /**
  * Retrieves the selected value from a <select> field.
  * @param locator - The locator of the <select> field.
  * @returns The value of the selected option.
  */
    async getSelectedDropdownValue(locator: string | Locator): Promise<string> {
        const dropdown = typeof locator === 'string' ? this.page.locator(locator) : locator;
        const selectedValue = await dropdown.evaluate((select) => (select as HTMLSelectElement).value);
        this.logger.info(`Retrieved selected dropdown value: ${selectedValue}`);
        return selectedValue;
    }

    /**
     * Retrieves the selected text from a <select> field.
     * @param locator - The locator of the <select> field.
     * @returns The text of the selected option.
     */
    async getSelectedDropdownText(locator: string | Locator): Promise<string> {
        const dropdown = typeof locator === 'string' ? this.page.locator(locator) : locator;
        const selectedText = await dropdown.locator('option:selected').textContent();
        this.logger.info(`Retrieved selected dropdown text: ${selectedText}`);
        return selectedText || '';
    }

    /**
       * Checks if there are any validation errors on the page.
       * Guidewire-specific: Looks for `.gw-validation-error` elements.
       * @returns True if errors are present, false otherwise.
       */
    async hasValidationErrors(): Promise<boolean> {
        const errorElements = this.page.locator('.gw-validation-error');
        return (await errorElements.count()) > 0;
    }

    /**
     * Retrieves all validation error messages on the page.
     * Guidewire-specific: Looks for `.gw-validation-error` elements.
     * @returns An array of error messages.
     */
    async getValidationErrorMessages(): Promise<string[]> {
        const errorElements = this.page.locator('.gw-validation-error');
        return await errorElements.allTextContents();
    }

    /**
     * Handles a Guidewire modal dialog.
     * @param action - The action to perform on the modal (e.g., "OK", "Cancel").
     */
    async handleGuidewireModal(action: 'OK' | 'Cancel'): Promise<void> {
        this.logger.info(`Handling Guidewire modal with action: ${action}`);
        const modalButton = this.page.locator(`.gw-modal button:has-text("${action}")`);
        await modalButton.click();
        await this.waitForPageLoad();
    }

    /**
     * Waits for a Guidewire success message.
     * Guidewire-specific: Looks for `.gw-message-success` elements.
     */
    async waitForSuccessMessage(): Promise<void> {
        this.logger.info('Waiting for Guidewire success message');
        await this.page.waitForSelector('.gw-message-success', { timeout: this.defaultTimeout });
    }
}
