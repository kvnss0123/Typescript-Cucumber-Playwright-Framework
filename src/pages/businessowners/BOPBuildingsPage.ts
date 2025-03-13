import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BOPBuildingsPage extends BasePage {
    // Locators for BOP Buildings page
    private addBuildingButton: Locator;
    private buildingNameField: Locator;
    private buildingAddressField: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize locators
        this.addBuildingButton = this.page.locator('button:has-text("Add Building")');
        this.buildingNameField = this.page.locator('input[name*="BuildingName"]');
        this.buildingAddressField = this.page.locator('input[name*="BuildingAddress"]');
    }

    /**
     * Adds a new building.
     * @param buildingData - An object containing the building details.
     */
    async addBuilding(buildingData: {
        name: string;
        address: string;
    }): Promise<void> {
        this.logger.info('Adding a new building');

        // Click the Add Building button
        await this.addBuildingButton.click();

        // Fill out the building form
        await this.fillInputField(this.buildingNameField, buildingData.name);
        await this.fillInputField(this.buildingAddressField, buildingData.address);

        // Save the building
        await this.saveButton.click();

        // Wait for the building to be added
        await this.waitForPageLoad();
    }

    /**
     * Verifies that a building is present in the list.
     * @param buildingName - The name of the building to verify.
     */
    async verifyBuildingInList(buildingName: string): Promise<void> {
        this.logger.info(`Verifying building: ${buildingName}`);
        const buildingRow = this.page.locator(`tr:has-text("${buildingName}")`);
        await this.verifyElementPresent(buildingRow);
    }
}
