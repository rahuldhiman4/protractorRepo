import { element, browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import createCasePage from '../../pageobject/case/create-case.po';
import caseEditPage from '../../pageobject/case/case-edit.po';

describe('Case Status Change', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        await browser.manage().window().maximize();
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    it('should login correctly', async () => {
        var loginCredentials = require('../../data/userdata.json');
        await loginPage.login(loginCredentials.qtao.userName,loginCredentials.qtao.userPassword);
    });

    it('should change case status to resolve', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester();
        await createCasePage.typeSummary();
        await createCasePage.assignToMe();
        await createCasePage.saveCase();
        await createCasePage.clickGoToCase();
        await caseEditPage.changeCaseStatus('In Progress');
        await caseEditPage.clickSaveStatus();
        expect(await $(caseEditPage.selectors.statusChange).getText()).toBe('In Progress');
        await caseEditPage.clickAddTaskButton();
        await caseEditPage.addTaskFromTaskTemplate("Review Invoice");
        await caseEditPage.clickTaskOnManageTasks("Review invoices and requisitions for payment approval.");
        await caseEditPage.changeTaskStatus('Completed');
        await caseEditPage.setTaskStatusReason('Successful');
        await caseEditPage.clickTaskSaveStatus();
        expect(await $(caseEditPage.selectors.taskStatusChange).getText()).toBe('Completed');
        await caseEditPage.clickViewCaseLink();
        expect(await $(caseEditPage.selectors.statusChange).getText()).toBe('Resolved');
    },)
})
