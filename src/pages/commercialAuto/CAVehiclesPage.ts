import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CAVehiclesPage extends BasePage {
    private addVehicleButton: Locator;
    private vinField: Locator;
    private yearField: Locator;
    private makeField: Locator;
    private modelField: Locator;
    private costNewField: Locator;
    private vehicleTypeDropdown: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize locators using page.locator()
        this.addVehicleButton = this.page.locator('button:has-text("Add Vehicle")');
        this.vinField = this.page.locator('input[name*="VIN"]');
        this.yearField = this.page.locator('input[name*="Year"]');
        this.makeField = this.page.locator('input[name*="Make"]');
        this.modelField = this.page.locator('input[name*="Model"]');
        this.costNewField = this.page.locator('input[name*="CostNew"]');
        this.vehicleTypeDropdown = this.page.locator('select[name*="VehicleType"]');
    }

    async addVehicle(vehicleData: any) {
        this.logger.info('Adding CA vehicle');

        await this.click(this.addVehicleButton, { waitForNavigation: true });

        await this.fillInputField(this.vinField, vehicleData.vin);
        await this.fillInputField(this.yearField, vehicleData.year);
        await this.fillInputField(this.makeField, vehicleData.make);
        await this.fillInputField(this.modelField, vehicleData.model);
        await this.fillInputField(this.costNewField, vehicleData.costNew);
        await this.selectOption(this.vehicleTypeDropdown, vehicleData.vehicleType);

        await this.click(this.okButton);

        // Verify vehicle was added
        await this.verifyText('div[id*="VehiclesLV-body"]', vehicleData.vin);

        // Click Next to continue
        await this.click(this.nextButton);
    }
}
