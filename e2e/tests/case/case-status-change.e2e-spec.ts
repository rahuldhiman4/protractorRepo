import { browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import createCasePage from '../../pageobject/case/create-case.po';
import caseEditPage from '../../pageobject/case/edit-case.po';
import caseViewPage from '../../pageobject/case/view-case.po';
import manageTaskPage from '../../pageobject/task/manage-task-blade.po';

describe('Case Status Change', () => {
    beforeAll(async () => {
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    it('should login correctly', async () => {
        await loginPage.login('qtao');
    });

    it('should change case status to resolve', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary("new case");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await caseViewPage.changeCaseStatus('In Progress');
        await caseViewPage.clickSaveStatus();
        expect(await $(caseEditPage.selectors.statusChange).getText()).toBe('In Progress');
        await caseViewPage.clickAddTaskButton();
        await caseViewPage.addTaskFromTaskTemplate("Review Invoice");
        await manageTaskPage.clickTaskLinkOnManageTask("Review invoices and requisitions for payment approval.");
        await caseEditPage.changeTaskStatus('Completed');
        await caseEditPage.setTaskStatusReason('Successful');
        await caseEditPage.clickTaskSaveStatus();
        expect(await $(caseEditPage.selectors.taskStatusChange).getText()).toBe('Completed');
        expect(await $(caseEditPage.selectors.statusChange).getText()).toBe('Resolved');
    },)
})
