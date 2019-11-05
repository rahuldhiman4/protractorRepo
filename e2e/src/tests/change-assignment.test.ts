import { element, browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../po/login.po";
import navigationPage from "../po/navigation.po";
import createCasePage from '../po/create-case.po';

fdescribe('Case Assignment', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        await browser.manage().window().maximize();
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    it('should login correctly', async () => {
        await loginPage.login();
    });

    it('should change the Assignment when editing the case', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester();
        await createCasePage.typeSummary();
        await createCasePage.saveCase();
        await browser.wait(EC.visibilityOf($(createCasePage.selectors.gotoCaseButton__preview)));
        await createCasePage.clickGoToCase();
    },)
})
