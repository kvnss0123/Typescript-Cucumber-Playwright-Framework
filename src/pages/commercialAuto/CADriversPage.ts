import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CADriversPage extends BasePage {
    // Locators for CA Drivers page
    private addDriverButton: Locator;
    private firstNameField: Locator;
    private lastNameField: Locator;
    private licenseNumberField: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize locators
        this.addDriverButton = this.page.locator('button:has-text("Add Driver")');
        this.firstNameField = this.page.locator('input[name*="FirstName"]');
        this.lastNameField = this.page.locator('input[name*="LastName"]');
        this.licenseNumberField = this.page.locator('input[name*="LicenseNumber"]');
    }

    /**
     * Adds a new driver.
     * @param driverData - An object containing the driver details.
     */
    async addDriver(driverData: {
        firstName: string;
        lastName: string;
        licenseNumber: string;
    }): Promise<void> {
        this.logger.info('Adding a new driver');

        // Click the Add Driver button
        await this.addDriverButton.click();

        // Fill out the driver form
        await this.fillInputField(this.firstNameField, driverData.firstName);
        await this.fillInputField(this.lastNameField, driverData.lastName);
        await this.fillInputField(this.licenseNumberField, driverData.licenseNumber);

        // Save the driver
        await this.saveButton.click();

        // Wait for the driver to be added
        await this.waitForPageLoad();
    }

    /**
     * Verifies that a driver is present in the list.
     * @param driverName - The full name of the driver to verify.
     */
    async verifyDriverInList(driverName: string): Promise<void> {
        this.logger.info(`Verifying driver: ${driverName}`);
        const driverRow = this.page.locator(`tr:has-text("${driverName}")`);
        await this.verifyElementPresent(driverRow);
    }
}
