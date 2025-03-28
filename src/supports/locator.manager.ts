import { Page, Locator } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { YamlParser } from './yaml.parser';

/**
 * Manages locators initialization and element retrieval.
 */
export class LocatorManager {
    private static locators: Map<string, Locator> = new Map<string, Locator>();
    private static page: Page;

    /**
     * Initializes all page objects from YAML files in the resources/locators directory.
     * @param page Playwright Page instance
     */
    public static initializeAllPages(page: Page): void {
        try {
            LocatorManager.page = page;
            // Get all YAML files from the locatorpages directory
            const locatorsDir = path.join(__dirname, '..', 'locatorpages');

            if (fs.existsSync(locatorsDir) && fs.statSync(locatorsDir).isDirectory()) {
                const yamlFiles = fs.readdirSync(locatorsDir)
                    .filter(file => file.toLowerCase().endsWith('.yaml'));

                for (const yamlFile of yamlFiles) {
                    const pageName = yamlFile.replace('.yaml', '');
                    this.initializePage(pageName);
                }
            }
        } catch (e) {
            throw new Error(`Failed to initialize page objects: ${(e as Error).message}`);
        }
    }

    /**
     * Initializes a specific page by loading its locator data from a YAML file.
     * @param pageName Name of the page to initialize.
     */
    public static initializePage(pageName: string): void {
        const locatorStrings = YamlParser.parseYamlFile(pageName);

        for (const [elementName, locatorValue] of locatorStrings.entries()) {
            this.locators.set(elementName, this.page.locator(locatorValue));
        }
    }

    /**
     * Retrieves the pre-configured Playwright Locator object for the specified element.
     * @param element The name of the element whose locator is to be fetched.
     * @returns Playwright Locator object.
     * @throws Error If the element is not found.
     */
    public static getLocator(element: string): Locator {
        const locator = this.locators.get(element);
        if (!locator) {
            throw new Error(`Locator not found for element: ${element}`);
        }
        return locator;
    }
}
