import { Locator } from '@playwright/test';
import { LocatorManager } from './locator.manager';

/**
 * Parses and manages element information in the format "pageName.elementName".
 */
export class ElementInfo {
    private readonly pageName: string;
    private readonly elementName: string;

    /**
     * Constructor to parse the element string into page name and element name.
     * @param element The element string in the format "pageName.elementName".
     * @throws Error If the element string is not in the expected format.
     */
    constructor(element: string) {
        if (!element || element.trim().length === 0) {
            throw new Error("Element string cannot be null or empty.");
        }

        const parts = element.split('.');
        if (parts.length !== 2) {
            throw new Error(`Invalid element format. Expected 'pageName.elementName', but got: ${element}`);
        }

        this.pageName = parts[0];
        this.elementName = parts[1];
    }

    public getPageName(): string {
        return this.pageName;
    }

    public getElementName(): string {
        return this.elementName;
    }

    /**
     * Retrieves the locator for the element using the LocatorPageManager.
     * @returns The locator as a Playwright Locator object.
     * @throws Error If the locator cannot be retrieved.
     */
    public getLocator(): Locator {
        const locator = LocatorManager.getLocator(this.elementName);
        if (!locator) {
            throw new Error(`Locator not found for element: ${this.elementName} in page: ${this.pageName}`);
        }
        return locator;
    }
}
