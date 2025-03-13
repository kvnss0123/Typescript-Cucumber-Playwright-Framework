import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CACoveragesPage extends BasePage {
    private liabilityLimitDropdown: Locator;
    private medicalPaymentsDropdown: Locator;
    private uninsuredMotoristDropdown: Locator;
    private comprehensiveDeductibleDropdown: Locator;
    private collisionDeductibleDropdown: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize locators using page.locator()
        this.liabilityLimitDropdown = this.page.locator('select[name*="LiabilityLimit"]');
        this.medicalPaymentsDropdown = this.page.locator('select[name*="MedicalPayments"]');
        this.uninsuredMotoristDropdown = this.page.locator('select[name*="UninsuredMotorist"]');
        this.comprehensiveDeductibleDropdown = this.page.locator('select[name*="ComprehensiveDeductible"]');
        this.collisionDeductibleDropdown = this.page.locator('select[name*="CollisionDeductible"]');
    }

    async selectCoverages(coverageData: any) {
        this.logger.info('Selecting CA coverages');

        await this.selectOption(this.liabilityLimitDropdown, coverageData.liabilityLimit);
        await this.selectOption(this.medicalPaymentsDropdown, coverageData.medicalPayments);
        await this.selectOption(this.uninsuredMotoristDropdown, coverageData.uninsuredMotorist);
        await this.selectOption(this.comprehensiveDeductibleDropdown, coverageData.comprehensiveDeductible);
        await this.selectOption(this.collisionDeductibleDropdown, coverageData.collisionDeductible);

        // Click Next to continue
        await this.click(this.nextButton);
    }
}
