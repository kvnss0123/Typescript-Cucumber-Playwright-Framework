import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BOPClassificationsPage extends BasePage {
    // Locators for BOP Classifications page
    private addClassificationButton: Locator;
    private classificationNameField: Locator;
    private classificationCodeField: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize locators
        this.addClassificationButton = this.page.locator('button:has-text("Add Classification")');
        this.classificationNameField = this.page.locator('input[name*="ClassificationName"]');
        this.classificationCodeField = this.page.locator('input[name*="ClassificationCode"]');
    }

    /**
     * Adds a new classification.
     * @param classificationData - An object containing the classification details.
     */
    async addClassification(classificationData: {
        name: string;
        code: string;
    }): Promise<void> {
        this.logger.info('Adding a new classification');

        // Click the Add Classification button
        await this.addClassificationButton.click();

        // Fill out the classification form
        await this.fillInputField(this.classificationNameField, classificationData.name);
        await this.fillInputField(this.classificationCodeField, classificationData.code);

        // Save the classification
        await this.saveButton.click();

        // Wait for the classification to be added
        await this.waitForPageLoad();
    }

    /**
     * Verifies that a classification is present in the list.
     * @param classificationName - The name of the classification to verify.
     */
    async verifyClassificationInList(classificationName: string): Promise<void> {
        this.logger.info(`Verifying classification: ${classificationName}`);
        const classificationRow = this.page.locator(`tr:has-text("${classificationName}")`);
        await this.verifyElementPresent(classificationRow);
    }
}
