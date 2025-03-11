import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class HeaderPage extends BasePage {
  // Locators for header elements
  private settingsButton: Locator;
  private logoutOption: Locator;
  private desktopOption: Locator;
  private accountOption: Locator;
  private policyOption: Locator;
  private searchOption: Locator;
  private administrationOption: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.settingsButton = this.page.locator('button.gw-action--expand-button');
    this.logoutOption = this.page.locator('div[id*="TabBar:LogoutTabBarLink"]');
    this.desktopOption = this.page.locator('div[id*="TabBar:DesktopTab"]');
    this.accountOption = this.page.locator('div[id*="TabBar:AccountTab"]');
    this.policyOption = this.page.locator('div[id*="TabBar:PolicyTab"]');
    this.searchOption = this.page.locator('div[id*="TabBar:SearchTab"]');
    this.administrationOption = this.page.locator('div[id*="TabBar:AdminTab"]');
  }

  /**
   * Logs out of the application.
   */
  async logout(): Promise<void> {
    this.logger.info('Logging out');
    try {
      await this.settingsButton.click();
      await this.logoutOption.click();
      await this.waitForPageLoad();

      // Verify logout is successful by checking for the login screen
      await this.verifyElementPresent('input[name="Login:LoginScreen:LoginDV:username"]');
      this.logger.info('Logout successful');
    } catch (error) {
      this.logger.error(`Logout failed: ${error}`);
      throw error;
    }
  }

  /**
   * Navigates to the Desktop section.
   */
  async navigateToDesktop(): Promise<void> {
    await this.navigateToSection(this.desktopOption, 'Desktop');
  }

  /**
   * Navigates to the Accounts section.
   */
  async navigateToAccounts(): Promise<void> {
    await this.navigateToSection(this.accountOption, 'Accounts');
  }

  /**
   * Navigates to the Policies section.
   */
  async navigateToPolicies(): Promise<void> {
    await this.navigateToSection(this.policyOption, 'Policies');
  }

  /**
   * Navigates to the Search section.
   */
  async navigateToSearch(): Promise<void> {
    await this.navigateToSection(this.searchOption, 'Search');
  }

  /**
   * Navigates to the Administration section.
   */
  async navigateToAdministration(): Promise<void> {
    await this.navigateToSection(this.administrationOption, 'Administration');
  }

  /**
   * Helper method to navigate to a specific section.
   * @param locator - The locator of the section button.
   * @param sectionName - The name of the section for logging purposes.
   */
  private async navigateToSection(locator: Locator, sectionName: string): Promise<void> {
    this.logger.info(`Navigating to ${sectionName} section`);
    try {
      await locator.click();
      await this.waitForPageLoad();

      // Verify the section has loaded
      await this.verifyElementPresent(`h1:has-text("${sectionName}")`);
      this.logger.info(`Successfully navigated to ${sectionName} section`);
    } catch (error) {
      this.logger.error(`Failed to navigate to ${sectionName} section: ${error}`);
      throw error;
    }
  }
}
