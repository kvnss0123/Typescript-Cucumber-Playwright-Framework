import { test } from '../../core/BaseTest';
import { CAPolicyInfoPage } from '../../pages/commercialAuto/CAPolicyInfoPage';
import { CAVehiclesPage } from '../../pages/commercialAuto/CAVehiclesPage';
import { CACoveragesPage } from '../../pages/commercialAuto/CACoveragesPage';
import { FakerHelper } from '../../utils/FakerHelper';

test.describe('ESB Commercial Auto Policy Creation Tests', () => {
    test('Create a new CA policy', async ({ page, autoLogin, navPage, dataManager, logger }) => {
        // Load test data
        const testData = await dataManager.getTestData('commercialAuto', 'ca-testdata');

        // Initialize page objects
        const policyInfoPage = new CAPolicyInfoPage(page);
        const vehiclesPage = new CAVehiclesPage(page);
        const coveragesPage = new CACoveragesPage(page);

        // Start creating a new submission
        logger.info('Starting CA policy creation test');
        await navPage.navigateToNewSubmission();

        // Select the account (example account number, would come from test data)
        await navPage.selectAccountFromSearch('123456789');

        // Select Commercial Auto line
        await navPage.selectBusinessLine('CA');

        // Fill policy info
        await policyInfoPage.fillPolicyInfo(testData.policyInfo);

        // Add vehicle
        await vehiclesPage.addVehicle(testData.vehicles[0]);

        // Select coverages
        await coveragesPage.selectCoverages(testData.coverages);

        // Verify we reached the quote screen
        await page.waitForSelector('text=Premium Summary');

        // Get the policy number from page
        const policyNumberText = await page.textContent('div.gw-PolicyNumber');
        logger.info(`Policy created with number: ${policyNumberText}`);

        // Additional verification
        const pageTitle = await page.title();
        test.expect(pageTitle).toContain('Quote');
    });
});
