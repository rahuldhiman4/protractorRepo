import { element, browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import serviceTargetConfig from '../../pageobject/settings/service-target.po';
import createCasePage from '../../pageobject/case/create-case.po';
import caseEditPage from '../../pageobject/case/case-edit.po';

fdescribe('SLA progress bar testing', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        await browser.manage().window().maximize();
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    afterAll(async () => {
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        await navigationPage.signOut();
    });

    it('should login correctly', async () => {
        await loginPage.login();
    });

    it('should goto Service Target settings', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
    });

    it('should create Service Target Config', async () => {
        await serviceTargetConfig.createServiceTargetConfig();
        expect(serviceTargetConfig.getPopUpMessage()).toBe('Record has been registered successfully.');
    });

    it('should create case to apply SVT', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester();
        await createCasePage.typeSummary();
        await createCasePage.selectCateg1('Accounts Payable');
        await createCasePage.assignToMe();
        await createCasePage.saveCase();
        await createCasePage.clickGoToCase();
//        browser.sleep(20000);
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(161, 206, 106, 1)'); //green
/*        browser.sleep(30000);
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(255, 165, 0, 1)'); //orange
        browser.sleep(30000);
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)'); */ //red
    }, 120 * 1000)
})