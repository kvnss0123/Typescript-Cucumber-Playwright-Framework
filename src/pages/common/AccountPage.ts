import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class AccountPage extends BasePage {
    // Locators for account fields
    private createNewAccountButton: Locator;
    private personButton: Locator;
    private firstNameField: Locator;
    private lastNameField: Locator;
    private dateOfBirthField: Locator;
    private genderDropdown: Locator;
    private maritalStatusDropdown: Locator;
    private primaryPhoneDropdown: Locator;
    private mobilePhoneField: Locator;
    private primaryEmailField: Locator;
    private addressLine1Field: Locator;
    private cityField: Locator;
    private stateDropdown: Locator;
    private countryDropdown: Locator;
    private zipCodeField: Locator;
    private addressTypeDropdown: Locator;
    private organizationField: Locator;
    private producerCodeDropdwon: Locator;


    private accountNumberLabel: Locator;

    // Locators for search results
    private searchResultsTable: Locator;
    private searchResultRow: (accountNumber: string) => Locator;

    constructor(page: Page) {
        // Call the parent class constructor
        super(page);

        // Initialize locators using page.locator()
        this.createNewAccountButton = page.locator('div:has-text("Create New Account")');
        this.personButton = page.locator("getByText('Person', { exact: true })");
        this.accountNumberLabel = page.locator('input[name*="AccountNumber"]');
        this.firstNameField = page.locator('input[name*=InputSet-FirstName]');
        this.lastNameField = page.locator('input[name*=InputSet-LastName]');
        this.dateOfBirthField = page.locator("input[name*='DateOfBirth']");
        this.genderDropdown = page.locator('select[name*="-gender"]');
        this.maritalStatusDropdown = page.locator('select[name*="-MaritalStatus"]');
        this.primaryPhoneDropdown = page.locator('select[name*="-PrimaryPhone"]');
        this.mobilePhoneField = page.locator('input[name*="CellPhone"]');
        this.primaryEmailField = page.locator('input[name*="EmailAddress1"]');
        this.addressLine1Field = page.locator('input[name*="AddressLine1"]');
        this.cityField = page.locator('input[name*="City"]');
        this.stateDropdown = page.locator('select[name*="State"]');
        this.countryDropdown = page.locator('select[name*="Country"]');
        this.zipCodeField = page.locator('input[name*="PostalCode"]');
        this.addressTypeDropdown = page.locator('select[name*="AddressType"]');
        this.organizationField = page.locator('input[name="CreateAccount-CreateAccountScreen-CreateAccountDV-ProducerSelectionInputSet-Producer"]');
        this.producerCodeDropdwon = page.locator('select[name*="ProducerCode"]');

        this.searchResultsTable = page.locator('div[id*="AccountsLV-body"]');
        this.searchResultRow = (accountNumber: string) =>
            this.page.locator(`div[id*="AccountsLV-body"] >> tr:has-text("${accountNumber}")`);
    }
    /**
     * Searches for an account by account number.
     * @param accountNumber - The account number to search for.
     */
    async searchAccount(accountNumber: string): Promise<void> {
        this.logger.info(`Searching for account: ${accountNumber}`);

        await this.fillInputField(this.accountNumberLabel, accountNumber);
        await this.click(this.searchButton);

        // Wait for search results to load
        await this.waitForPageLoad();
    }

    /**
     * Verifies that the account is present in the search results.
     * @param accountNumber - The account number to verify.
     */
    async verifyAccountInSearchResults(accountNumber: string): Promise<void> {
        this.logger.info(`Verifying account ${accountNumber} in search results`);

        const accountRow = this.searchResultRow(accountNumber);
        await this.verifyElementPresent(accountRow);
    }

    /**
     * Creates a new account.
     * @param accountData - An object containing the account details.
     */
    async createAccount_Person(firstName: string, lastName: string): Promise<void> {
        this.logger.info('Creating a new account');

        await this.click(this.actionsButton);
        await this.verifyElementPresent(this.newAccountButton);
        await this.click(this.newAccountButton, { waitForNavigation: true });
        await this.waitForNetworkIdle();

        // Fill out the "Enter Account Information" form and search results
        await this.page.waitForLoadState('networkidle');
        // await this.page.waitForTimeout(5000); // Additional wait before element check
        await this.page.locator('//*[@id="NewAccount-NewAccountScreen-NewAccountSearchDV-GlobalPersonNameInputSet-FirstName"]/div/input').first().waitFor({ state: 'visible', timeout: 20000 });
        await this.page.fill('input[name*=InputSet-FirstName]', 'Sheldon');



        await this.fillInputField(this.firstNameField, firstName);
        await this.fillInputField(this.lastNameField, lastName);
        await this.click(this.searchButton);
        await this.waitForPageLoad();

        // Select the "Person" account type
        await this.click(this.createNewAccountButton);
        await this.click(this.personButton);
        await this.waitForPageLoad();

        // Fill out the "Create Account" form and submit the account

        await this.fillInputField(this.dateOfBirthField, "01/01/1999");
        await this.selectOptionByLabel(this.genderDropdown, "Male");
        await this.selectOptionByLabel(this.maritalStatusDropdown, "Single");
        await this.selectOptionByLabel(this.primaryPhoneDropdown, "Mobile");
        await this.fillInputField(this.mobilePhoneField, "2015550123");
        await this.fillInputField(this.primaryEmailField, "sheldon.cooper@email.com");

        await this.selectOptionByLabel(this.countryDropdown, "Canada");
        await this.fillInputField(this.addressLine1Field, "Big Bang Theory Street");
        await this.fillInputField(this.cityField, "Austin");
        await this.selectOption(this.stateDropdown, "Ontario");
        await this.fillInputField(this.zipCodeField, "123-456");

        await this.selectOptionByLabel(this.addressTypeDropdown, "Home");

        await this.fillInputField(this.organizationField, "Aon Org");
        await this.click(this.zipCodeField);
        await this.selectOptionByIndex(this.producerCodeDropdwon, 2);

        // Save the account
        await this.click(this.updateButton);

        // Wait for the account to be created
        await this.waitForPageLoad();
    }

    /**
     * Updates an existing account.
     * @param accountNumber - The account number to update.
     * @param updatedData - An object containing the updated account details.
     */
    async updateAccount(accountNumber: string, updatedData: {
        accountName?: string;
        primaryContact?: string;
        phoneNumber?: string;
        email?: string;
        addressLine1?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    }): Promise<void> {
        this.logger.info(`Updating account: ${accountNumber}`);

        // Search for the account
        await this.searchAccount(accountNumber);

        // Click on the account in search results
        const accountRow = this.searchResultRow(accountNumber);
        await this.click(accountRow);


        if (updatedData.primaryContact) {
            await this.fillInputField(this.genderDropdown, updatedData.primaryContact);
        }
        if (updatedData.phoneNumber) {
            await this.fillInputField(this.mobilePhoneField, updatedData.phoneNumber);
        }
        if (updatedData.email) {
            await this.fillInputField(this.primaryEmailField, updatedData.email);
        }
        if (updatedData.addressLine1) {
            await this.fillInputField(this.addressLine1Field, updatedData.addressLine1);
        }
        if (updatedData.city) {
            await this.fillInputField(this.cityField, updatedData.city);
        }
        if (updatedData.state) {
            await this.selectOption(this.stateDropdown, updatedData.state);
        }
        if (updatedData.zipCode) {
            await this.fillInputField(this.zipCodeField, updatedData.zipCode);
        }

        // Save the updated account
        await this.click(this.updateButton);

        // Wait for the account to be updated
        await this.waitForPageLoad();
    }

    /**
     * Deletes an account.
     * @param accountNumber - The account number to delete.
     */
    async deleteAccount(accountNumber: string): Promise<void> {
        this.logger.info(`Deleting account: ${accountNumber}`);

        // Search for the account
        await this.searchAccount(accountNumber);

        // Click on the account in search results
        const accountRow = this.searchResultRow(accountNumber);
        await this.click(accountRow);

        // Click the Delete button (assuming there's a delete button)
        await this.click('button:has-text("Delete")');

        // Confirm deletion (if a confirmation dialog appears)
        await this.click('button:has-text("Confirm")');

        // Wait for the account to be deleted
        await this.waitForPageLoad();
    }
}
