// File: src/pages/businessowners/BOPPolicyInfoPage.ts
import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BOPPolicyInfoPage extends BasePage {
  private effectiveDateField = 'input[name*="EffectiveDate"]';
  private expirationDateField = 'input[name*="ExpirationDate"]';
  private organizationTypeDropdown = 'select[name*="OrganizationType"]';
  private annualRevenueField = 'input[name*="AnnualRevenue"]';
  private numEmployeesField = 'input[name*="NumEmployees"]';
  private yearsInBusinessField = 'input[name*="YearsInBusiness"]';

  constructor(page: Page) {
    super(page);
  }

  async fillPolicyInfo(policyData: any) {
    this.logger.info('Filling BOP policy information');

    await this.fillField(this.effectiveDateField, policyData.effectiveDate);

    if (policyData.expirationDate) {
      await this.fillField(this.expirationDateField, policyData.expirationDate);
    }

    await this.selectDropdownOption(this.organizationTypeDropdown, policyData.organizationType);
    await this.fillField(this.annualRevenueField, policyData.annualRevenue);
    await this.fillField(this.numEmployeesField, policyData.numEmployees);
    await this.fillField(this.yearsInBusinessField, policyData.yearsInBusiness);

    // Click Next to continue
    await this.clickButton(this.nextButton);
  }
}
