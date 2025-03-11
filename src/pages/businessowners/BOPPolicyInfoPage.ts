import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BOPPolicyInfoPage extends BasePage {
    // Locators for BOP PolicyInfo page
    private effectiveDateField = 'input[name*="EffectiveDate"]';
    private expirationDateField = 'input[name*="ExpirationDate"]';
    private organizationTypeDropdown = 'select[name*="OrganizationType"]';
    private annualRevenueField = 'input[name*="AnnualRevenue"]';
    private numEmployeesField = 'input[name*="NumEmployees"]';
    private yearsInBusinessField = 'input[name*="YearsInBusiness"]';

    constructor(page: Page) {
        super(page);
    }

    /**
   * Fills out the BOP policy information form.
   * @param policyData - An object containing the policy information to fill out.
   */
    async fillPolicyInfo(policyData: {
        effectiveDate?: string;
        expirationDate?: string;
        organizationType: string;
        annualRevenue?: string;
        numEmployees?: string;
        yearOfBusiness?: string;
    }): Promise<void> {
        this.logger.info('Filling BOP policy information');

        try {
            if (policyData.effectiveDate) {
                await this.fillInputField(this.effectiveDateField, policyData.effectiveDate);
            }

            if (policyData.expirationDate) {
                await this.fillInputField(this.expirationDateField, policyData.expirationDate);
            }

            if (policyData.yearOfBusiness) {
                await this.fillInputField(this.yearsInBusinessField, policyData.yearOfBusiness);
            }

            await this.selectOption(this.organizationTypeDropdown, policyData.organizationType);

            // Click Next to continue
            await this.click(this.nextButton);
            // Wait for the next page to load
            await this.waitForPageLoad();

            this.logger.info('BOP policy information filled successfully');
        } catch (error) {
            this.logger.error(`Failed to fill BOP policy information: ${error}`);
            throw error;
        }
    }
}
