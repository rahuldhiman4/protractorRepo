import { element, browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../po/login.po";
import navigationPage from "../po/navigation.po";
import createCasePage from '../po/create-case.po';

describe('create case with all inputs', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        await browser.manage().window().maximize();
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    it('should login correctly', async () => {
        await loginPage.login();
    });
    
    it('should create case without template', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester();
        await createCasePage.selectContact();
        await createCasePage.typeSummary();
        await createCasePage.typeDescription();
        await createCasePage.selectCateg1('Accounts Payable');
        await createCasePage.selectCateg2('Invoices');
        await createCasePage.selectCateg3('Payment');
        await createCasePage.assignToMe();
        await createCasePage.saveCase();
        await browser.wait(EC.visibilityOf($(createCasePage.selectors.gotoCaseButton__preview)));
    },)
})

