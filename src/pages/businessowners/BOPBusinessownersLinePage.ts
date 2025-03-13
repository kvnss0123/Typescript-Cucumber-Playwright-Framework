import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BusinessownersLinePage extends BasePage {
    // Locators for tabs
    private lineStandardCoveragesTab: Locator;
    private lineAdditionalLiabilityCoveragesTab: Locator;
    private lineAdditionalPropertyCoveragesTab: Locator;
    private lineExclusionsTab: Locator;

    // Locators for fields in Line Standard Coverages tab
    private buildingCoverageLimitField: Locator;
    private businessIncomeCoverageCheckbox: Locator;
    private coinsurancePercentageField: Locator; // Non-editable
    private deductibleDropdown: Locator; // Default options

    // Locators for fields in Line Additional Liability Coverages tab
    private employeeBenefitsLiabilityCheckbox: Locator;
    private personalAndAdvertisingInjuryLimitField: Locator;

    // Locators for fields in Line Additional Property Coverages tab
    private equipmentBreakdownCoverageCheckbox: Locator;
    private outdoorSignsCoverageLimitField: Locator;

    // Locators for fields in Line Exclusions tab
    private earthquakeExclusionCheckbox: Locator;
    private floodExclusionCheckbox: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize locators using page.locator()
        this.lineStandardCoveragesTab = page.locator('div[aria-label="Line Standard Coverages"]');
        this.lineAdditionalLiabilityCoveragesTab = page.locator('div[aria-label="Line Additional Liability Coverages"]');
        this.lineAdditionalPropertyCoveragesTab = page.locator('div[aria-label="Line Additional Property Coverages"]');
        this.lineExclusionsTab = page.locator('div[aria-label="Line Exclusions"]');

        this.buildingCoverageLimitField = page.locator('input[name*="BuildingCoverageLimit"]');
        this.businessIncomeCoverageCheckbox = page.locator('input[name*="BusinessIncomeCoverage"]');
        this.coinsurancePercentageField = page.locator('input[name*="CoinsurancePercentage"]');
        this.deductibleDropdown = page.locator('select[name*="Deductible"]');

        this.employeeBenefitsLiabilityCheckbox = page.locator('input[name*="EmployeeBenefitsLiability"]');
        this.personalAndAdvertisingInjuryLimitField = page.locator('input[name*="PersonalAndAdvertisingInjuryLimit"]');

        this.equipmentBreakdownCoverageCheckbox = page.locator('input[name*="EquipmentBreakdownCoverage"]');
        this.outdoorSignsCoverageLimitField = page.locator('input[name*="OutdoorSignsCoverageLimit"]');

        this.earthquakeExclusionCheckbox = page.locator('input[name*="EarthquakeExclusion"]');
        this.floodExclusionCheckbox = page.locator('input[name*="FloodExclusion"]');
    }

    /**
     * Navigates to the specified tab.
     * @param tabName - The name of the tab to navigate to.
     */
    async navigateToTab(tabName: string): Promise<void> {
        this.logger.info(`Navigating to tab: ${tabName}`);

        switch (tabName) {
            case 'Line Standard Coverages':
                await this.click(this.lineStandardCoveragesTab);
                break;
            case 'Line Additional Liability Coverages':
                await this.click(this.lineAdditionalLiabilityCoveragesTab);
                break;
            case 'Line Additional Property Coverages':
                await this.click(this.lineAdditionalPropertyCoveragesTab);
                break;
            case 'Line Exclusions':
                await this.click(this.lineExclusionsTab);
                break;
            default:
                throw new Error(`Invalid tab name: ${tabName}`);
        }

        // Wait for the tab content to load
        await this.waitForPageLoad();
    }

    /**
     * Fills out the Line Standard Coverages tab.
     * @param coverageData - An object containing the coverage data to fill out.
     */
    async fillLineStandardCoverages(coverageData: {
        buildingCoverageLimit: string;
        businessIncomeCoverage: boolean;
        deductible: string;
    }): Promise<void> {
        this.logger.info('Filling Line Standard Coverages');

        // Fill mandatory fields
        await this.fillInputField(this.buildingCoverageLimitField, coverageData.buildingCoverageLimit);

        // Handle electable fields
        if (coverageData.businessIncomeCoverage) {
            await this.checkCheckbox(this.businessIncomeCoverageCheckbox, true);
        }

        // Select deductible from dropdown (default options)
        await this.selectOption(this.deductibleDropdown, coverageData.deductible);

        // Verify non-editable field (coinsurance percentage)
        const coinsurancePercentage = await this.getInputValue(this.coinsurancePercentageField);
        this.logger.info(`Coinsurance Percentage (Non-Editable): ${coinsurancePercentage}`);
    }

    /**
     * Fills out the Line Additional Liability Coverages tab.
     * @param coverageData - An object containing the coverage data to fill out.
     */
    async fillLineAdditionalLiabilityCoverages(coverageData: {
        employeeBenefitsLiability: boolean;
        personalAndAdvertisingInjuryLimit: string;
    }): Promise<void> {
        this.logger.info('Filling Line Additional Liability Coverages');

        // Handle electable fields
        if (coverageData.employeeBenefitsLiability) {
            await this.checkCheckbox(this.employeeBenefitsLiabilityCheckbox, true);
        }

        // Fill mandatory fields
        await this.fillInputField(this.personalAndAdvertisingInjuryLimitField, coverageData.personalAndAdvertisingInjuryLimit);
    }

    /**
     * Fills out the Line Additional Property Coverages tab.
     * @param coverageData - An object containing the coverage data to fill out.
     */
    async fillLineAdditionalPropertyCoverages(coverageData: {
        equipmentBreakdownCoverage: boolean;
        outdoorSignsCoverageLimit: string;
    }): Promise<void> {
        this.logger.info('Filling Line Additional Property Coverages');

        // Handle electable fields
        if (coverageData.equipmentBreakdownCoverage) {
            await this.checkCheckbox(this.equipmentBreakdownCoverageCheckbox, true);
        }

        // Fill mandatory fields
        await this.fillInputField(this.outdoorSignsCoverageLimitField, coverageData.outdoorSignsCoverageLimit);
    }

    /**
     * Fills out the Line Exclusions tab.
     * @param coverageData - An object containing the coverage data to fill out.
     */
    async fillLineExclusions(coverageData: {
        earthquakeExclusion: boolean;
        floodExclusion: boolean;
    }): Promise<void> {
        this.logger.info('Filling Line Exclusions');

        // Handle electable fields
        if (coverageData.earthquakeExclusion) {
            await this.checkCheckbox(this.earthquakeExclusionCheckbox, true);
        }
        if (coverageData.floodExclusion) {
            await this.checkCheckbox(this.floodExclusionCheckbox, true);
        }
    }

    /**
     * Verifies the state of fields in the Line Standard Coverages tab.
     */
    async verifyLineStandardCoverages(): Promise<void> {
        this.logger.info('Verifying Line Standard Coverages');

        // Verify mandatory fields
        await this.verifyElementPresent(this.buildingCoverageLimitField);

        // Verify electable fields
        await this.verifyElementPresent(this.businessIncomeCoverageCheckbox);

        // Verify non-editable fields
        const coinsurancePercentage = await this.getInputValue(this.coinsurancePercentageField);
        this.logger.info(`Coinsurance Percentage (Non-Editable): ${coinsurancePercentage}`);

        // Verify default options in dropdown
        const deductibleOptions = await this.getDropdownOptions(this.deductibleDropdown);
        this.logger.info(`Deductible Options: ${deductibleOptions.join(', ')}`);
    }
}
