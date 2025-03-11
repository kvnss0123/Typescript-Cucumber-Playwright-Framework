// File: src/pages/common/HeaderPage.ts
import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class HeaderPage extends BasePage {
  private settingsButton = 'button.gw-action--expand-button';
  private logoutOption = 'div[id*="TabBar:LogoutTabBarLink"]';
  private desktopOption = 'div[id*="TabBar:DesktopTab"]';
  private accountOption = 'div[id*="TabBar:AccountTab"]';
  private policyOption = 'div[id*="TabBar:PolicyTab"]';
  private searchOption = 'div[id*="TabBar:SearchTab"]';
  private administrationOption = 'div[id*="TabBar:AdminTab"]';

  constructor(page: Page) {
    super(page);
  }

  async logout() {
    this.logger.info('Logging out');
    await this.page.click(this.settingsButton);
    await this.page.click(this.logoutOption);
    await this.waitForPageLoad();

    // Verify logout successful
    await this.verifyElementPresent('input[name="Login:LoginScreen:LoginDV:username"]');
    this.logger.info('Logout successful');
  }

  async navigateToDesktop() {
    await this.page.click(this.desktopOption);
    await this.waitForPageLoad();
  }

  async navigateToAccounts() {
    await this.page.click(this.accountOption);
    await this.waitForPageLoad();
  }

  async navigateToPolicies() {
    await this.page.click(this.policyOption);
    await this.waitForPageLoad();
  }

  async navigateToSearch() {
    await this.page.click(this.searchOption);
    await this.waitForPageLoad();
  }

  async navigateToAdministration() {
    await this.page.click(this.administrationOption);
    await this.waitForPageLoad();
  }
}
