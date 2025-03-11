import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './src/tests',
  timeout: 60000,
  retries: 1,
  workers: 2,
  reporter: [
    ['list'],
    ['html', { open: 'always' }],
    ['./src/utils/Reporter.ts']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://gwdemo.ey.com/pc/',
    headless: process.env.HEADLESS === 'false',
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 30000,
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
