import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './src/tests',
    timeout: 120000,
    retries: 1,
    workers: 1,
    reporter: [
        ['list'],
        ['html', { open: 'always' }],
        ['./src/utils/Reporter.ts']
    ],
    use: {
        baseURL: process.env.BASE_URL || 'https://gwdemo.ey.com/pc/',
        headless: process.env.HEADLESS === 'false',
        launchOptions: {
            args: ["--start-maximized"],
        },
        viewport: { width: 1920, height: 1080 },
        screenshot: 'only-on-failure',
        trace: 'on-first-retry',
        video: 'on-first-retry',
        actionTimeout: 15000,
        navigationTimeout: 30000,
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
        {
            name: 'firefox',
            use: { browserName: 'firefox' },
        },
    ],
};

export default config;
