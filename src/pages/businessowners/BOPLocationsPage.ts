// File: src/pages/businessowners/BOPLocationsPage.ts
import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BOPLocationsPage extends BasePage {
  private addLocationButton = 'button:has-text("Add")';
  private addressLine1Field = 'input[name*="AddressLine1"]';
  private cityField = 'input[name*="City"]';
  private stateDropdown = 'select[name*="State"]';
  private zipCodeField = 'input[name*="PostalCode"]';
  private okButton = 'button:has-text("OK")';

  constructor(page: Page) {
    super(page);
  }

  async addLocation(locationData: any) {
    this.logger.info('Adding BOP location');

    await this.clickButton(this.addLocationButton, { waitForNavigation: true });

    await this.fillField(this.addressLine1Field, locationData.addressLine1);
    await this.fillField(this.cityField, locationData.city);
    await this.selectDropdownOption(this.stateDropdown, locationData.state);
    await this.fillField(this.zipCodeField, locationData.zipCode);

    await this.clickButton(this.okButton);

    // Verify location was added
    await this.verifyText('div[id*="LocationsLV-body"]', locationData.addressLine1);

    // Click Next to continue
    await this.clickButton(this.nextButton);
  }
}
