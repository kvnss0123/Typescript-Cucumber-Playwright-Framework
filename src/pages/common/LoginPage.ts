// File: src/pages/common/LoginPage.ts
import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class LoginPage extends BasePage {
  private usernameField = 'input[name="Login-LoginScreen-LoginDV-username"]';
  private passwordField = 'input[name="Login-LoginScreen-LoginDV-password"]';
  private loginButton = 'div[id="Login-LoginScreen-LoginDV-submit"]';

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string) {
    this.logger.info(`Logging in as ${username}`);

    await this.page.fill(this.usernameField, username);
    await this.page.fill(this.passwordField, password);
    await this.page.click(this.loginButton);

    await this.waitForPageLoad();

    // Verify successful login
    await this.verifyElementPresent('div.gw-action--expand-button');
    this.logger.info('Login successful');
  }
}
