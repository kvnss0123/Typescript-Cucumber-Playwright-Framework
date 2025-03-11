import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BOPLocationsPage extends BasePage {
    // Locators for BOP Locations page
    private addLocationButton = 'button:has-text("Add")';
    private addressLine1Field = 'input[name*="AddressLine1"]';
    private cityField = 'input[name*="City"]';
    private stateDropdown = 'select[name*="State"]';
    private zipCodeField = 'input[name*="PostalCode"]';
    private okButton = 'button:has-text("OK")';

    constructor(page: Page) {
        super(page);
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
