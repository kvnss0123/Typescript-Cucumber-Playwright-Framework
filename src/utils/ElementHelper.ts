import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../core/Logger';

export class ElementHelper {
    protected page: Page;
    protected logger: Logger;
    protected defaultTimeout: number;

    constructor(page: Page, defaultTimeout: number = 30000) {
        this.page = page;
        this.logger = new Logger();
        this.defaultTimeout = defaultTimeout;
    }

    /**
     * Waits for a selector to be present in the DOM.
     * @param selector - The selector to wait for.
     * @param timeout - Maximum time to wait in milliseconds.
     */
    async waitForSelector(selector: string, timeout: number = this.defaultTimeout): Promise<Locator> {
        this.logger.info(`Waiting for selector: ${selector}`);
        await this.page.waitForSelector(selector, { timeout });
        return this.page.locator(selector);
    }

    /**
     * Waits for the network to be idle.
     * @param timeout - Maximum time to wait in milliseconds.
     */
    async waitForNetworkIdle(timeout: number = this.defaultTimeout): Promise<void> {
        this.logger.info('Waiting for network idle');
        await this.page.waitForLoadState('networkidle', { timeout });
    }

    /**
     * Scrolls an element into view.
     * @param selector - The selector of the element to scroll into view.
     */
    async scrollIntoView(selector: string): Promise<void> {
        this.logger.info(`Scrolling ${selector} into view`);
        const element = this.page.locator(selector);
        await element.scrollIntoViewIfNeeded();
    }

    /**
     * Retrieves the text content of an element.
     * @param selector - The selector of the element.
     * @returns The text content of the element, or null if the element is not found.
     */
    async getElementText(selector: string): Promise<string | null> {
        const element = this.page.locator(selector);
        return await element.textContent();
    }

    /**
     * Checks if an element is visible.
     * @param selector - The selector of the element.
     * @returns True if the element is visible, false otherwise.
     */
    async isElementVisible(selector: string): Promise<boolean> {
        const element = this.page.locator(selector);
        return await element.isVisible();
    }

    /**
     * Retrieves the value of an attribute from an element.
     * @param selector - The selector of the element.
     * @param attribute - The attribute to retrieve.
     * @returns The attribute value, or null if the element or attribute is not found.
     */
    async getAttributeValue(selector: string, attribute: string): Promise<string | null> {
        const element = this.page.locator(selector);
        return await element.getAttribute(attribute);
    }

}
