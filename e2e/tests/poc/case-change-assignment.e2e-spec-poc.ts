import { browser } from "protractor";
import createCasePage from '../../pageobject/case/create-case.po';
import caseEditPage from '../../pageobject/case/edit-case.po';
import caseViewPage from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";

describe('Case Assignment', () => {
    beforeAll(async () => {
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
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary("my new case");
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await caseViewPage.clickEditCaseButton();
        await caseEditPage.clickChangeAssignmentButton();
        await caseEditPage.selectSupportGroup(supportGroup);
        await caseEditPage.selectAssignee(name);
        await caseEditPage.clickAssignButton();
        await caseEditPage.clickSaveCase();
        await caseEditPage.verifyCaseAssignee(name);
    });
});
