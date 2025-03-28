import { Before, After, Status } from '@cucumber/cucumber';
import { PolicyCenterWorld as World } from '../supports/custom.world';

Before(async function (this: World) {
    await this.init();
});

After(async function (this: World, scenario) {
    // Take screenshot on failure
    if (scenario.result?.status === Status.FAILED) {
        const screenshot = await this.page.screenshot({
            path: `reports/screenshots/${scenario.pickle.name}.png`
        });
        this.attach(screenshot, 'image/png');
    }

    // Close browser
    await this.destroy();
});

// Global error handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
