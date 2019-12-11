import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import createQuickCasePage from '../../pageobject/case/create-case-quick.po';
import createCasePage from '../../pageobject/case/create-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";

describe('create case', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
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
        await createCasePage.selectRequester('adam');
        await createCasePage.setSummary('new case');
        await createCasePage.clickSaveCaseButton();
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
        await createCasePage.selectRequester('adam');
        await createCasePage.selectContact('adam');
        await createCasePage.setSummary('set summary');
        await createCasePage.setDescription('my desc');
        await createCasePage.selectCategoryTier1('Accounts Payable');
        await createCasePage.selectCategoryTier2('Invoices');
        await createCasePage.selectCategoryTier3('Payment');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await browser.wait(EC.visibilityOf($(createCasePage.selectors.gotoCaseButton__preview)));
    })
})
