import { element, browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../po/login.po";
import navigationPage from "../po/navigation.po";
import createCasePage from '../po/create-case.po';
import createQuickCasePage from '../po/create-case-quick.po';

describe('create case', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        await browser.manage().window().maximize();
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    it('should login correctly', async () => {
        await loginPage.login();
    });
    
    fit('should create case without template', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester();
        await createCasePage.typeSummary();
        await createCasePage.saveCase();
        await browser.wait(EC.visibilityOf($(createCasePage.selectors.gotoCaseButton__preview)));
    }, 120 * 1000)

    xit('should create quick case', async () => {
        await navigationPage.gotoQuickCase();
        await createQuickCasePage.selectRequester();
        await createQuickCasePage.enterSummary();
        await createQuickCasePage.saveCase();
    },)
})

