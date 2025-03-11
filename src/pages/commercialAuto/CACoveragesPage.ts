// File: src/pages/commercialAuto/CACoveragesPage.ts
import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CACoveragesPage extends BasePage {
  private liabilityLimitDropdown = 'select[name*="LiabilityLimit"]';
  private medicalPaymentsDropdown = 'select[name*="MedicalPayments"]';
  private uninsuredMotoristDropdown = 'select[name*="UninsuredMotorist"]';
  private comprehensiveDeductibleDropdown = 'select[name*="ComprehensiveDeductible"]';
  private collisionDeductibleDropdown = 'select[name*="CollisionDeductible"]';

  constructor(page: Page) {
    super(page);
  }

  async selectCoverages(coverageData: any) {
    this.logger.info('Selecting CA coverages');

    await this.selectDropdownOption(this.liabilityLimitDropdown, coverageData.liabilityLimit);
    await this.selectDropdownOption(this.medicalPaymentsDropdown, coverageData.medicalPayments);
    await this.selectDropdownOption(this.uninsuredMotoristDropdown, coverageData.uninsuredMotorist);
    await this.selectDropdownOption(this.comprehensiveDeductibleDropdown, coverageData.comprehensiveDeductible);
    await this.selectDropdownOption(this.collisionDeductibleDropdown, coverageData.collisionDeductible);

    // Click Next to continue
    await this.clickButton(this.nextButton);
  }
}
