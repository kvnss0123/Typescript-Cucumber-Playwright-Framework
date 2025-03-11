import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class LoginPage extends BasePage {
  // Locators for login elements
  private usernameField = 'input[name="Login-LoginScreen-LoginDV-username"]';
  private passwordField = 'input[name="Login-LoginScreen-LoginDV-password"]';
  private loginButton = 'div[id="Login-LoginScreen-LoginDV-submit"]';
  private loginError = '.gw-message-error'; // GW-specific error message locator

  constructor(page: Page) {
    super(page);
  }

  /**
   * Logs into the application.
   * @param username - The username to log in with.
   * @param password - The password to log in with.
   */
  async login(username: string, password: string): Promise<void> {
    this.logger.info(`Logging in as ${username}`);

    try {
      // Fill username and password fields
      await this.fillInputField(this.usernameField, username);
      await this.fillInputField(this.passwordField, password);

      // Click the login button
      await this.click(this.loginButton);

      // Wait for the page to load
      await this.waitForPageLoad();

      // Verify successful login by checking for a post-login element
      await this.verifyElementPresent('div.gw-action--expand-button');
      this.logger.info('Login successful');
    } catch (error) {
      this.logger.error(`Login failed: ${error}`);
      throw error;
    }
  }

  /**
   * Verifies if a login error message is displayed.
   * @returns True if an error message is present, false otherwise.
   */
  async hasLoginError(): Promise<boolean> {
    const errorElement = this.page.locator(this.loginError);
    return await errorElement.isVisible();
  }

  /**
   * Retrieves the login error message.
   * @returns The error message text, or null if no error is present.
   */
  async getLoginErrorMessage(): Promise<string | null> {
    const errorElement = this.page.locator(this.loginError);
    if (await errorElement.isVisible()) {
      return await errorElement.textContent();
    }
    return null;
  }
}
