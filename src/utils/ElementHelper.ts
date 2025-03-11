// File: src/utils/ElementHelper.ts
import { Page, Locator } from '@playwright/test';
import { Logger } from '../core/Logger';

export class ElementHelper {
  private page: Page;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger();
  }

  async waitForSelector(selector: string, timeout = 30000) {
    this.logger.info(`Waiting for selector: ${selector}`);
    return await this.page.waitForSelector(selector, { timeout });
  }

  async waitForNetworkIdle(timeout = 30000) {
    this.logger.info('Waiting for network idle');
    return await this.page.waitForLoadState('networkidle', { timeout });
  }

  async scrollIntoView(selector: string) {
    this.logger.info(`Scrolling ${selector} into view`);
    const element = await this.page.$(selector);
    if (element) {
      await element.scrollIntoViewIfNeeded();
    }
  }

  async getElementText(selector: string) {
    const element = await this.page.$(selector);
    if (element) {
      return await element.textContent();
    }
    return null;
  }

  async isElementVisible(selector: string) {
    const element = await this.page.$(selector);
    if (element) {
      return await element.isVisible();
    }
    return false;
  }

  async getAttributeValue(selector: string, attribute: string) {
    const element = await this.page.$(selector);
    if (element) {
      return await element.getAttribute(attribute);
    }
    return null;
  }
}
