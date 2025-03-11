// File: src/core/BaseTest.ts
import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/common/LoginPage';
import { HeaderPage } from '../pages/common/HeaderPage';
import { NavigationPage } from '../pages/common/NavigationPage';
import { DataManager } from '../utils/DataManager';
import { Logger } from './Logger';

type CustomFixtures = {
    loginPage: LoginPage;
    headerPage: HeaderPage;
    navPage: NavigationPage;
    dataManager: DataManager;
    logger: Logger;
    autoLogin: Page;
    autoLogout: Page;
};

// Extend the test with custom fixtures
export const test = base.extend<CustomFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    headerPage: async ({ page }, use) => {
        const headerPage = new HeaderPage(page);
        await use(headerPage);
    },
    navPage: async ({ page }, use) => {
        const navPage = new NavigationPage(page);
        await use(navPage);
    },
    dataManager: async ({}, use) => {
        const dataManager = new DataManager();
        await use(dataManager);
    },
    logger: async ({}, use) => {
        const logger = new Logger();
        await use(logger);
    },
    autoLogin: async ({ page, loginPage }, use) => {
        const dataManager = new DataManager();
        const credentials = await dataManager.getBaseConfig();

        await page.goto("https://gwdemo.ey.com/pc/");
        await loginPage.login(credentials.username, credentials.password);
        await use(page);
    },
    autoLogout: async ({headerPage}) => {
        await headerPage.logout();
    }
});

export { expect } from '@playwright/test';
