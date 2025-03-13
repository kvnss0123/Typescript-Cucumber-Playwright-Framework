import { test } from '../../core/BaseTest';
import { FakerHelper } from '../../utils/FakerHelper';

test.describe('Account Creation-Person Tests', () => {
    test('Create a new account for a person', async ({ page }) => {
        // Test google seach
        await page.goto('https://www.google.com');
        await page.fill('textarea[name="q"]', 'Playwright');
        await page.press('textarea[name="q"]', 'Enter');
        // wait for results
        await page.waitForSelector('h3');
        // get the first result
        const firstResult = await page.locator('h3').first();
        // get the text of the first result
        const firstResultText = await firstResult.innerText();
    });
});
