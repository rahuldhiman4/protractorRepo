import { browser, protractor } from "protractor";
import createCasePage from '../../pageobject/case/create-case.po';
import caseEditPage from '../../pageobject/case/edit-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import serviceTargetConfig from '../../pageobject/settings/slm/service-target-blade.po';

describe('SLA progress bar testing', () => {
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
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
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
    })
})
