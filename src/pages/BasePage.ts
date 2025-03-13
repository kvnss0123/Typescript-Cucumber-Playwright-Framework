import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../core/Logger';
import { ElementHelper } from '../utils/ElementHelper';

export class BasePage extends ElementHelper {
    // Common button locators
    protected submitButton: Locator;
    protected cancelButton: Locator;
    protected nextButton: Locator;
    protected backButton: Locator;
    protected updateButton: Locator;
    protected addButton: Locator;
    protected editButton: Locator;
    protected deleteButton: Locator;
    protected searchButton: Locator;
    protected createButton: Locator;
    protected saveButton: Locator;
    protected okButton: Locator;

    // Menu buttons
    protected actionsButton: Locator;
    protected newAccountButton: Locator;

    // Error message locator
    protected errorMessage: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize locators using page.locator()
        this.submitButton = page.locator('button:has-text("Submit")');
        this.cancelButton = page.locator('button:has-text("Cancel")');
        this.nextButton = page.locator('button:has-text("Next")');
        this.backButton = page.locator('button:has-text("Back")');
        this.updateButton = page.locator("div[id*='Update'] div[role=button]");
        this.addButton = page.locator('button:has-text("Add")');
        this.editButton = page.locator('button:has-text("Edit")');
        this.deleteButton = page.locator('button:has-text("Delete")');
        this.searchButton = page.locator("div[id*=SearchLinksInputSet-Search]");
        this.createButton = page.locator('button:has-text("Create")');
        this.saveButton = page.locator('button:has-text("Save")');
        this.okButton = this.page.locator('button:has-text("OK")');
        this.actionsButton = page.locator("#Desktop-DesktopMenuActions div[role=button]");
        this.newAccountButton = page.locator("div[id*=DesktopMenuActions_NewAccount] div[role=menuitem]");
        this.errorMessage = page.locator('.message.error');
    }

    /**
 * Waits for the Guidewire page to fully load by checking for `.gw-page-load-bar--inner` style changes.
 */
    async waitForPageLoad(): Promise<void> {
        this.logger.info('Waiting for Guidewire page to load');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');

        this.logger.info('Page has fully loaded.');
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
    // In BasePage.ts
    async fillInputField(locator: string | Locator, value: string): Promise<void> {
        this.logger.info(`Filling field ${locator} with value: ${value}`);

        let field = typeof locator === 'string' ? this.page.locator(locator) : locator;

        // Make sure to await this method!
        await this.waitFor(field, 30000);

        try {
            // Add retries for stability
            await field.fill(value, { timeout: 10000 });
        } catch (error) {
            this.logger.error(`Failed to fill field: ${locator}`);

            // Try a different approach as fallback
            await this.page.evaluate(
                ({ selector, val }) => {
                    const el = document.querySelector(selector);
                    if (el) {
                        (el as HTMLInputElement).value = val;
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                        el.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                },
                { selector: field.toString(), val: value }
            );
        }
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
        this.verifyElementPresent(dropdown);
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
        await this.verifyElementPresent(dropdown);
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
        // this.highlightElement(element);
    }

    /**
  * Highlights an element by modifying its style.
  * @param locator - The locator of the element to highlight.
  * @param duration - The duration (in milliseconds) to keep the highlight (default: 2000ms).
  * @param color - The highlight color (default: 'red').
  */
    async highlightElement(locator: string | Locator, duration: number = 2000, color: string = 'red'): Promise<void> {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;

        // Store the original border style
        const originalStyle = await element.evaluate((el) => {
            const style = (el as HTMLElement).style.border;
            (el as HTMLElement).style.border = `2px solid ${color}`;
            return style;
        });

        this.logger.info(`Highlighted element with locator: ${locator}`);

        // Wait for the specified duration
        await this.page.waitForTimeout(duration);

        // Restore the original border style
        await element.evaluate((el, originalStyle) => {
            (el as HTMLElement).style.border = originalStyle;
        }, originalStyle);
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
 * Retrieves all options from a <select> dropdown.
 * @param locator - The locator of the <select> dropdown.
 * @returns An array of all option texts.
 */
    async getDropdownOptions(locator: string | Locator): Promise<string[]> {
        const dropdown = typeof locator === 'string' ? this.page.locator(locator) : locator;
        const options = await dropdown.locator('option').allTextContents();
        this.logger.info(`Retrieved dropdown options: ${options.join(', ')}`);
        return options;
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
