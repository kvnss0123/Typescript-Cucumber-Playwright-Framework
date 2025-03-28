import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    private locators: any;

    constructor(page: Page) {
        super(page);
        this.locators = this.loader.loadLocators('login');
    }

    async login(username: string, password: string): Promise<void> {
        await this.fillInput(this.locators.login_page.username_input, username);
        await this.fillInput(this.locators.login_page.password_input, password);
        await this.clickElement(this.locators.login_page.login_button);
    }

    async getErrorMessage(): Promise<string> {
        return this.getText(this.locators.login_page.error_message);
    }

    async isLoginSuccessful(): Promise<boolean> {
        return await this.page.isVisible(this.locators.dashboard.welcome_text);
    }
}
