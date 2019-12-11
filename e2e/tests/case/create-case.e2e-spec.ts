import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import createCasePage from "../../pageobject/case/create-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";

describe("Quick Case", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const requester = "Requester";
    const contact = "Contact";

    beforeAll(async () => {
        browser.waitForAngularEnabled(false);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-15253: Verify Category Tier 4 Can be Populated After Tier 3 selection', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('adam');
        await createCasePage.setSummary('set summary');
        await createCasePage.selectCategoryTier1('Applications');
        await createCasePage.selectCategoryTier2('Social');
        await createCasePage.selectCategoryTier3('Chatter');
        await createCasePage.selectCategoryTier4('Failure');
        expect (await createCasePage.getTextOfCategoryTier4('Failure')).toBe('Failure'),'CategoryTier4 Value is missing';
        browser.sleep(3000);
    })

})