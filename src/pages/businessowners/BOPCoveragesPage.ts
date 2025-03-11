import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BOPCoveragesPage extends BasePage {
  private liabilityLimitDropdown = 'select[name*="LiabilityLimit"]';
  private medicalPaymentsLimitDropdown = 'select[name*="MedicalPaymentsLimit"]';
  private deductibleDropdown = 'select[name*="Deductible"]';

  constructor(page: Page) {
    super(page);
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
