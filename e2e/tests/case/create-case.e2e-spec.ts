import { element, browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import createCasePage from '../../pageobject/case/create-case.po';
import createQuickCasePage from '../../pageobject/case/create-case-quick.po';

describe('create case', () => {
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
        await loginPage.login('qtao');
    });

    it('should create case without template', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester();
        await createCasePage.typeSummary();
        await createCasePage.saveCase();
        await browser.wait(EC.visibilityOf($(createCasePage.selectors.gotoCaseButton__preview)));
        await browser.actions().sendKeys(protractor.Key.ESCAPE);
        await browser.wait(EC.invisibilityOf($(createCasePage.selectors.gotoCaseButton__preview)));
    }, 120 * 1000)

    xit('should create quick case', async () => {
        await navigationPage.gotoQuickCase();
        await createQuickCasePage.selectRequester();
        await createQuickCasePage.enterSummary();
        await createQuickCasePage.saveCase();
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

