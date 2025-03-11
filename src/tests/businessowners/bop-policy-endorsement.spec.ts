import { test } from '../../core/BaseTest';
import { BOPLocationsPage } from '../../pages/businessowners/BOPLocationsPage';
import { FakerHelper } from '../../utils/FakerHelper';

test.describe('ESB Businessowners Policy Endorsement Tests', () => {
  test('Add location to existing BOP policy', async ({ page, autoLogin, navPage, dataManager, logger }) => {
    // Load test data
    const testData = await dataManager.getTestData('businessowners', 'bop-testdata');

    // Initialize page objects
    const locationsPage = new BOPLocationsPage(page);

    // Navigate to an existing policy
    // In a real-world scenario, we would first create a policy or use an existing one
    const policyNumber = 'BOP-12345678'; // Example policy number

    logger.info(`Starting endorsement test for policy ${policyNumber}`);

    // Search for the policy
    await navPage.navigateToPolicies();
    await page.fill('input[name*="PolicyNumberSearchItem"]', policyNumber);
    await page.click('button:has-text("Search")');

    // Open the policy
    await page.click(`a:has-text("${policyNumber}")`);

    // Start an endorsement
    await page.click('button:has-text("Start Endorsement")');

    // Fill out the endorsement information
    await page.fill('input[name*="EndorsementDate"]', FakerHelper.getRandomDate(2023, 2024));
    await page.click('button:has-text("Next")');

    // Navigate to Locations tab
    await navPage.navigateToPolicyTab('Locations');

    // Add a new location
    await locationsPage.addLocation(testData.locations[1]);

    // Navigate to Quote screen
    await navPage.navigateToPolicyTab('Quote');

    // Verify we reached the quote screen
    await page.waitForSelector('text=Premium Summary');

    // Additional verification - endorsement should show a premium change
    const premiumText = await page.textContent('div.gw-PolicyTotalCost');
    logger.info(`Endorsement premium: ${premiumText}`);

    // Complete the endorsement
    await page.click('button:has-text("Quote")');
    await page.click('button:has-text("Bind Endorsement")');

    // Verify endorsement is completed
    await page.waitForSelector('text=Endorsement successfully issued');

    // Get the transaction number
    const transactionNumber = await page.textContent('div.gw-TransactionNumber');
    logger.info(`Endorsement completed with transaction number: ${transactionNumber}`);
  });
});
