import { element, browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import createCasePage from '../../pageobject/case/create-case.po';
import createQuickCasePage from '../../pageobject/case/create-case-quick.po';

fdescribe('Parallel task execution', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        await browser.manage().window().maximize();
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('should login correctly', async () => {
        await loginPage.login();
    });

    it('should create quick case', async () => {
        await navigationPage.gotoQuickCase();
        await createQuickCasePage.createQuickCase();
        await createQuickCasePage.gotoCase();
    });

    it('should create task using template', async () => {
        await navigationPage.gotoQuickCase();
        await createQuickCasePage.createQuickCase();
        await createQuickCasePage.gotoCase();
    })
})

