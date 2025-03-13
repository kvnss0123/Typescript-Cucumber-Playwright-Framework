import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class LoginPage extends BasePage {
    // Locators for login elements
    private usernameField: Locator;
    private passwordField: Locator;
    private loginButton: Locator;
    private loginError: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize locators using page.locator()
        this.usernameField = this.page.locator('input[name="Login-LoginScreen-LoginDV-username"]');
        this.passwordField = this.page.locator('input[name="Login-LoginScreen-LoginDV-password"]');
        this.loginButton = this.page.locator('div[id="Login-LoginScreen-LoginDV-submit"]');
        this.loginError = this.page.locator('.gw-message-error'); // GW-specific error message locator

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

            // Verify successful login by checking for a post-login element
            await this.verifyElementPresent(this.actionsButton);
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
        const errorElement = this.loginError;
        return await errorElement.isVisible();
    }

    /**
     * Retrieves the login error message.
     * @returns The error message text, or null if no error is present.
     */
    async getLoginErrorMessage(): Promise<string | null> {
        const errorElement = this.loginError;
        if (await errorElement.isVisible()) {
            return await errorElement.textContent();
        }
        return null;
    }
}
