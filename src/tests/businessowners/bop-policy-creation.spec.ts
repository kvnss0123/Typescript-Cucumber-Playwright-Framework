// File: src/tests/businessowners/bop-policy-creation.spec.ts
import { test } from '../../core/BaseTest';
import { BOPPolicyInfoPage } from '../../pages/businessowners/BOPPolicyInfoPage';
import { BOPLocationsPage } from '../../pages/businessowners/BOPLocationsPage';
import { BOPCoveragesPage } from '../../pages/businessowners/BOPCoveragesPage';
import { FakerHelper } from '../../utils/FakerHelper';

test.describe('ESB Businessowners Policy Creation Tests', () => {
  test('Create a new BOP policy', async ({ page, autoLogin, navPage, dataManager, logger }) => {
    // Load test data
    const testData = await dataManager.getTestData('businessowners', 'bop-testdata');

    // Initialize page objects
    const policyInfoPage = new BOPPolicyInfoPage(page);
    const locationsPage = new BOPLocationsPage(page);
    const coveragesPage = new BOPCoveragesPage(page);

    // Start creating a new submission
    logger.info('Starting BOP policy creation test');
    await navPage.navigateToNewSubmission();

    // Select the account (example account number, would come from test data)
    await navPage.selectAccountFromSearch('123456789');

    // Select Businessowners line
    await navPage.selectBusinessLine('Businessowners');

    // Fill policy info
    await policyInfoPage.fillPolicyInfo(testData.policyInfo);

    // Add location
    await locationsPage.addLocation(testData.locations[0]);

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
