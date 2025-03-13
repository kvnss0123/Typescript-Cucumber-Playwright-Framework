import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BOPLocationsPage extends BasePage {
    // Locators for BOP Locations page
    private addLocationButton: Locator;
    private addressLine1Field: Locator;
    private cityField: Locator;
    private stateDropdown: Locator;
    private zipCodeField: Locator;
    private okButton: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize locators using page.locator()
        this.addLocationButton = this.page.locator('button:has-text("Add")');
        this.addressLine1Field = this.page.locator('input[name*="AddressLine1"]');
        this.cityField = this.page.locator('input[name*="City"]');
        this.stateDropdown = this.page.locator('select[name*="State"]');
        this.zipCodeField = this.page.locator('input[name*="PostalCode"]');
        this.okButton = this.page.locator('button:has-text("OK")');
    }

    /**
   * Adds a new location to the BOP policy.
   * @param locationData - An object containing the location information to add.
   */
    async addLocation(locationData: {
        addressLine1: string;
        city: string;
        state: string;
        zipCode: string;
    }): Promise<void> {
        this.logger.info('Adding BOP location');

        try {
            await this.click(this.addLocationButton);

            await this.fillInputField(this.addressLine1Field, locationData.addressLine1);
            await this.fillInputField(this.cityField, locationData.city);
            await this.selectOption(this.stateDropdown, locationData.state);
            await this.fillInputField(this.zipCodeField, locationData.zipCode);

            await this.click(this.okButton);

            // Verify the location was added successfully
            await this.verifyText('div[id*="LocationsLV-body"]', locationData.addressLine1);

            // Click Next to continue
            await this.click(this.nextButton);
            // Wait for the next page to load
            await this.waitForPageLoad();

            this.logger.info('BOP location added successfully');
        } catch (error) {
            this.logger.error(`Failed to add BOP location: ${error}`);
            throw error;
        }
    }

}
