// File: src/pages/commercialAuto/CAPolicyInfoPage.ts
import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CAPolicyInfoPage extends BasePage {
  private effectiveDateField = 'input[name*="EffectiveDate"]';
  private expirationDateField = 'input[name*="ExpirationDate"]';
  private businessTypeDropdown = 'select[name*="BusinessType"]';
  private yearsInBusinessField = 'input[name*="YearsInBusiness"]';
  private numEmployeesField = 'input[name*="NumEmployees"]';

  constructor(page: Page) {
    super(page);
  }

  async fillPolicyInfo(policyData: any) {
    this.logger.info('Filling CA policy information');

    await this.fillField(this.effectiveDateField, policyData.effectiveDate);

    if (policyData.expirationDate) {
      await this.fillField(this.expirationDateField, policyData.expirationDate);
    }

    await this.selectDropdownOption(this.businessTypeDropdown, policyData.businessType);
    await this.fillField(this.yearsInBusinessField, policyData.yearsInBusiness);
    await this.fillField(this.numEmployeesField, policyData.numEmployees);

    // Click Next to continue
    await this.clickButton(this.nextButton);
  }
}
