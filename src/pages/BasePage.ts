import { Page, Browser, BrowserContext } from '@playwright/test';
import { YAMLLoader } from '../supports/yaml.parser';

export abstract class BasePage {
    protected page: Page;
    protected context: BrowserContext;
    protected loader: YAMLLoader;

    constructor(page: Page) {
        this.page = page;
        this.context = page.context();
        this.loader = YAMLLoader.getInstance();
    }

    protected async waitForElementVisible(selector: string, timeout: number = 10000): Promise<void> {
        await this.page.waitForSelector(selector, {
            state: 'visible',
            timeout: timeout
        });
    }

    protected async fillInput(selector: string, value: string): Promise<void> {
        await this.waitForElementVisible(selector);
        await this.page.fill(selector, value);
    }

    protected async clickElement(selector: string): Promise<void> {
        await this.waitForElementVisible(selector);
        await this.page.click(selector);
    }

    protected async selectDropdownByValue(selector: string, value: string): Promise<void> {
        await this.waitForElementVisible(selector);
        await this.page.selectOption(selector, { value });
    }

    protected async getText(selector: string): Promise<string> {
        await this.waitForElementVisible(selector);
        return await this.page.textContent(selector) || '';
    }
}
