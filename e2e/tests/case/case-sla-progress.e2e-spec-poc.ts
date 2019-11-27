import { element, browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import serviceTargetConfig from '../../pageobject/settings/service-target-blade.po';
import createCasePage from '../../pageobject/case/create-case.po';
import caseEditPage from '../../pageobject/case/edit-case.po';

fdescribe('SLA progress bar testing', () => {
    beforeAll(async () => {
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    afterAll(async () => {
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        await navigationPage.signOut();
    });

    it('should login correctly', async () => {
        await loginPage.login('qkatawazi');
    });

    it('should goto Service Target settings', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
    });

    it('should create Service Target Config', async () => {
        await serviceTargetConfig.createServiceTargetConfig("a", "b", "c");
        expect(serviceTargetConfig.getPopUpMessage()).toBe('Record has been registered successfully.');
    });

    it('should create case to apply SVT', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('Mary');
        await createCasePage.setSummary('Case for SVT creation');
        await createCasePage.selectCategoryTier1('Accounts Payable');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
//        browser.sleep(20000);
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(161, 206, 106, 1)'); //green
/*        browser.sleep(30000);
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(255, 165, 0, 1)'); //orange
        browser.sleep(30000);
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)'); */ //red
    }, 120 * 1000)
})
