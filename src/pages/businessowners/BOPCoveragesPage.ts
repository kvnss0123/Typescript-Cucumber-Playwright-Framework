import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BOPCoveragesPage extends BasePage {
    private liabilityLimitDropdown: Locator;
    private medicalPaymentsLimitDropdown: Locator;
    private deductibleDropdown: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize locators using page.locator()
        this.liabilityLimitDropdown = this.page.locator('select[name*="LiabilityLimit"]');
        this.medicalPaymentsLimitDropdown = this.page.locator('select[name*="MedicalPaymentsLimit"]');
        this.deductibleDropdown = this.page.locator('select[name*="Deductible"]');
    }

    async selectCoverages(coverageData: any) {
        this.logger.info('Selecting BOP coverages');

        await this.selectOption(this.liabilityLimitDropdown, coverageData.liabilityLimit);
        await this.selectOption(this.medicalPaymentsLimitDropdown, coverageData.medicalPaymentsLimit);
        await this.selectOption(this.deductibleDropdown, coverageData.deductible);

        // Click Next to continue
        await this.click(this.nextButton);
    }
}
