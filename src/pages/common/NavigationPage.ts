import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class NavigationPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigates to the "New Submission" page.
     */
    async navigateToNewSubmission(): Promise<void> {
        this.logger.info('Navigating to new submission');
        await this.page.click('div[id*="DesktopMenuActions:DesktopMenuActions_Create:DesktopMenuActions_NewSubmission"]');
        await this.waitForPageLoad();
    }

    /**
     * Searches for and selects an account by its account number.
     * @param accountNumber - The account number to search for and select.
     */
    async selectAccountFromSearch(accountNumber: string): Promise<void> {
        this.logger.info(`Selecting account: ${accountNumber}`);

        // Fill the account number field and click the search button
        await this.page.fill('input[name*="AccountNumber"]', accountNumber);
        await this.page.click('button:has-text("Search")');
        await this.waitForPageLoad();

        // Click on the account in search results
        await this.page.click(`a:has-text("${accountNumber}")`);
        await this.waitForPageLoad();

        this.selectAccountFromSearch('Businessowners');
    }



    /**
     * Selects a business line from the available options.
     * @param businessLine - The business line to select (e.g., "Businessowners", "CommercialAuto").
     */
    async selectBusinessLine(businessLine: 'BOP' | 'CA' | 'CPP' | 'CU' | 'GL'): Promise<void> {
        this.logger.info(`Selecting business line: ${businessLine}`);

        // Map business lines to their corresponding selectors
        const businessLineSelectors = {
            BOP: 'div[id*="ProductSelection:ProductSelectionScreen:ProductSelectionLV-body"] >> text="ESB Businessowners"',
            CA: 'div[id*="ProductSelection:ProductSelectionScreen:ProductSelectionLV-body"] >> text="ESB Commercial Auto"',
            CPP: 'div[id*="ProductSelection:ProductSelectionScreen:ProductSelectionLV-body"] >> text="ESB Commercial Package"',
            CU: 'div[id*="ProductSelection:ProductSelectionScreen:ProductSelectionLV-body"] >> text="ESB Commercial Umbrella"',
            GL: 'div[id*="ProductSelection:ProductSelectionScreen:ProductSelectionLV-body"] >> text="ESB General Liability"'
        };


        // Check if the provided business line is valid
        if (!businessLineSelectors[businessLine]) {
            throw new Error(`Invalid business line: ${businessLine}. Valid options are: ${Object.keys(businessLineSelectors).join(', ')}`);
        }

        // Click the business line and select it
        await this.page.click(businessLineSelectors[businessLine]);
        await this.page.click('button:has-text("Select")');
        await this.waitForPageLoad();
    }

    /**
     * Navigates to a specific policy tab.
     * @param tabName - The name of the tab to navigate to.
     */
    async navigateToPolicyTab(tabName: string): Promise<void> {
        this.logger.info(`Navigating to policy tab: ${tabName}`);

        // Define selectors for the tab
        const primarySelector = `div[role="menuitem"][aria-label="${tabName}"]`;
        const alternativeSelector = `div.gw-label:text-is("${tabName}")`;

        try {
            // Try to find and click the tab using the primary selector
            await this.page.waitForSelector(primarySelector, { state: 'visible', timeout: 5000 });
            await this.page.click(primarySelector);
        } catch (error) {
            // If the primary selector fails, try the alternative selector
            this.logger.warn(`Failed to find tab "${tabName}" by aria-label. Trying alternative method.`);
            await this.page.click(alternativeSelector);
        }

        // Wait for navigation to complete
        await this.waitForPageLoad();
    }
}
