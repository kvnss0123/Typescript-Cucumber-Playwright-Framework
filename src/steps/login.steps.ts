import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PolicyCenterWorld as World } from '../supports/custom.world';

Given('I am on the PolicyCenter login page', async function (this: World) {
    await this.page.goto('/login');
});

When('I login with username {string} and password {string}', async function (this: World, username: string, password: string) {
    const loginPage = this.pageObjects.loginPage;
    await loginPage.login(username, password);
});

Then('I should be logged in successfully', async function (this: World) {
    const loginPage = this.pageObjects.loginPage;
    const isLoggedIn = await loginPage.isLoginSuccessful();
    expect(isLoggedIn).to.be.true;
});

Then('I should see a login error message', async function (this: World) {
    const loginPage = this.pageObjects.loginPage;
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).to.not.be.empty;
});
