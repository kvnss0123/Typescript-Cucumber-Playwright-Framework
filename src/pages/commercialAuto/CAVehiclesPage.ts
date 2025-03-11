// File: src/pages/commercialAuto/CAVehiclesPage.ts
import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CAVehiclesPage extends BasePage {
  private addVehicleButton = 'button:has-text("Add Vehicle")';
  private vinField = 'input[name*="VIN"]';
  private yearField = 'input[name*="Year"]';
  private makeField = 'input[name*="Make"]';
  private modelField = 'input[name*="Model"]';
  private costNewField = 'input[name*="CostNew"]';
  private vehicleTypeDropdown = 'select[name*="VehicleType"]';
  private okButton = 'button:has-text("OK")';

  constructor(page: Page) {
    super(page);
  }

  async addVehicle(vehicleData: any) {
    this.logger.info('Adding CA vehicle');

    await this.clickButton(this.addVehicleButton, { waitForNavigation: true });

    await this.fillField(this.vinField, vehicleData.vin);
    await this.fillField(this.yearField, vehicleData.year);
    await this.fillField(this.makeField, vehicleData.make);
    await this.fillField(this.modelField, vehicleData.model);
    await this.fillField(this.costNewField, vehicleData.costNew);
    await this.selectDropdownOption(this.vehicleTypeDropdown, vehicleData.vehicleType);

    await this.clickButton(this.okButton);

    // Verify vehicle was added
    await this.verifyText('div[id*="VehiclesLV-body"]', vehicleData.vin);

    // Click Next to continue
    await this.clickButton(this.nextButton);
  }
}
