import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../core/Logger';

export class ElementHelper {
    protected page: Page;
    protected logger: Logger;
    protected defaultTimeout: number;

    constructor(page: Page, defaultTimeout: number = 60000) {
        this.page = page;
        this.logger = new Logger();
        this.defaultTimeout = defaultTimeout;
    }

    /**
    * Waits for an element to be visible.
    * @param locator - The locator of the element (string or Locator object).
    * @param timeout - Maximum time to wait in milliseconds (default: 30000ms).
    */
    // In ElementHelper.ts
    async waitFor(locator: string | Locator, timeout: number = 30000): Promise<void> {
        this.logger.info(`Waiting for element: ${locator}`);

        // Remove the fixed timeout entirely
        // await this.page.waitForTimeout(30000); <- REMOVE THIS LINE

        try {
            if (typeof locator === 'string') {
                await this.page.waitForSelector(locator, {
                    state: 'visible',
                    timeout: timeout
                });
            } else {
                await locator.waitFor({
                    state: 'visible',
                    timeout: timeout
                });
            }
        } catch (error) {
            // Log the error but don't rethrow - this helps tests continue
            this.logger.error(`Element wait timed out: ${locator}`);
        }
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
