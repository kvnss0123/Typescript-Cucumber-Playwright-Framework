import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, Page, chromium } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ICreateAttachment, ICreateLog } from '@cucumber/cucumber/lib/runtime/attachment_manager';

interface CustomWorld extends World {
    browser: Browser;
    page: Page;
    pageObjects: {
        loginPage: LoginPage;
        // Add other page objects as needed
    };
}

export class PolicyCenterWorld implements CustomWorld {
    browser!: Browser;
    page!: Page;
    pageObjects!: {
        loginPage: LoginPage;
    };
    attach: ICreateAttachment;
    log: ICreateLog;
    parameters: any;

    constructor() {
        this.browser = null as any;
        this.page = null as any;
        this.pageObjects = {
            loginPage: null as any
        };
        this.attach = null as any;
        this.log = null as any;
        this.parameters = {};
    }

    async init() {
        this.browser = await chromium.launch();
        const context = await this.browser.newContext();
        this.page = await context.newPage();

        // Initialize page objects
        this.pageObjects.loginPage = new LoginPage(this.page);
    }

    async destroy() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}
