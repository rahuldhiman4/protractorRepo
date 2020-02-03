import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";

describe('Parallel task execution', () => {
    beforeAll(async () => {
        await browser.manage().window().maximize();
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('should login correctly', async () => {
        var loginCredentials = require('../../data/userdata.json');
        await loginPage.login('qkatawazi');
    });

})
