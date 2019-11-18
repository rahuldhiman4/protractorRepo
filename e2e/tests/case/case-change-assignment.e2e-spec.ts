import { element, browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import createCasePage from '../../pageobject/case/create-case.po';
import caseEditPage from '../../pageobject/case/case-edit.po';

describe('Case Assignment', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        await browser.manage().window().maximize();
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    it('should login correctly', async () => {
        await loginPage.login('qtao');
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
