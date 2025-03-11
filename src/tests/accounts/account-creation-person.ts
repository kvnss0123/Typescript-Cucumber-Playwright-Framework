import { test } from '../../core/BaseTest';
import { FakerHelper } from '../../utils/FakerHelper';

test.describe('Account Creation-Person Tests', () => {
    test('Create a new account for a person', async ({ page, autoLogin, navPage, dataManager, logger }) => {
        //Start creating a new account
        logger.info('Starting account creation test');
        await page.click()
        await page.waitForSelector('text=Premium Summary');

        // Get the policy number from page
        const policyNumberText = await page.textContent('div.gw-PolicyNumber');
        logger.info(`Policy created with number: ${policyNumberText}`);

        // Additional verification
        const pageTitle = await page.title();
        test.expect(pageTitle).toContain('Quote');
    });
});
