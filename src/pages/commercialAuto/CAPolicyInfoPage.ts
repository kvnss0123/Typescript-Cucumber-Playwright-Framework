import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CAPolicyInfoPage extends BasePage {
    private effectiveDateField: Locator;
    private expirationDateField: Locator;
    private businessTypeDropdown: Locator;
    private yearsInBusinessField: Locator;
    private numEmployeesField: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize locators using page.locator()
        this.effectiveDateField = this.page.locator('input[name*="EffectiveDate"]');
        this.expirationDateField = this.page.locator('input[name*="ExpirationDate"]');
        this.businessTypeDropdown = this.page.locator('select[name*="BusinessType"]');
        this.yearsInBusinessField = this.page.locator('input[name*="YearsInBusiness"]');
        this.numEmployeesField = this.page.locator('input[name*="NumEmployees"]');
    }

    async fillPolicyInfo(policyData: any) {
        this.logger.info('Filling CA policy information');

        await this.fillInputField(this.effectiveDateField, policyData.effectiveDate);

        if (policyData.expirationDate) {
            await this.fillInputField(this.expirationDateField, policyData.expirationDate);
        }

        await this.selectOption(this.businessTypeDropdown, policyData.businessType);
        await this.fillInputField(this.yearsInBusinessField, policyData.yearsInBusiness);
        await this.fillInputField(this.numEmployeesField, policyData.numEmployees);

        // Click Next to continue
        await this.click(this.nextButton);
    }
}
