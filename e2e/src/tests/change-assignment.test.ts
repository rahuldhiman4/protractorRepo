import { element, browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../po/login.po";
import navigationPage from "../po/navigation.po";
import createCasePage from '../po/create-case.po';
import caseEditPage from '../po/case-edit-po';

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
        let name = 'Qianru Tao';
        let supportGroup = 'Compensation and Benefits';
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester();
        await createCasePage.typeSummary();
        await createCasePage.saveCase();
        await createCasePage.clickGoToCase();
        await caseEditPage.clickEditCaseButton();
        await caseEditPage.clickChangeAssignmentButton();
        await caseEditPage.selectSupportGroup(supportGroup);
        await caseEditPage.selectAssignee(name);
        await caseEditPage.clickAssignButton();
        await caseEditPage.clickSaveCase();
        await caseEditPage.verifyCaseAssignee(name);
    },)
})
