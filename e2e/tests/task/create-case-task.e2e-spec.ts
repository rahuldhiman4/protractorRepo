import { browser, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import taskTemplate from "../../pageobject/task/create-tasktemplate.po";
import selecttaskTemplate from "../../pageobject/task/console-tasktemplate.po"
import navigationPage from "../../pageobject/navigation.po";
import createCasePage from '../../pageobject/case/create-case.po';
import caseEditPage from '../../pageobject/case/edit-case.po';
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import editTask from "../../pageobject/task/edit-task.po";
import caseTaskTab from '../../pageobject/case/case-task-tab.po';
import utilCommon from '../../utils/util.common';

describe('create Task template', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        await navigationPage.signOut();
    });

    it('DRDMV-7165,DRDMV-7147: Update Task Type field for any task	', async () => {
        await loginPage.resetLogin('qkatawazi');

        let manualTaskTemplate = 'Manual  task' + Math.floor(Math.random() * 1000000);
        let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let automationTaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
        let automationTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000) + 1;

        //Manual task Template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selecttaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplate.setTemplateName(manualTaskTemplate);
        await taskTemplate.setTaskSummary(manualTaskSummary);
        await taskTemplate.setTaskDescription('Description in manual task');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selecttaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplate.setTemplateName(automationTaskTemplate);
        await taskTemplate.setTaskSummary(automationTaskSummary);
        await taskTemplate.setTaskDescription('Description in manual task');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.setNewProcessName('Approval', 'Get Request Status Data 123');
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        //case create
        await loginPage.resetLogin('qtao');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + manualTaskSummary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await caseEditPage.clickAddTaskButton();

        //Add Manual task and Automation Task in Case
        await caseEditPage.addTaskFromTaskTemplate(manualTaskTemplate);
        await caseEditPage.addTaskFromTaskTemplate(automationTaskTemplate);

        //validate Manual Template
        browser.sleep(2000);
        await manageTask.clickTaskLinkOnManageTask(manualTaskSummary);
        await viewTask.clickOnEditTask();
        var manual: string = await editTask.getTaskTypeValue();
        await expect(manual).toBe('Manual');
        var attribute: string = await editTask.getTaskTypeValueAttribute('disabled');
        await expect(attribute).toBeTruthy();
        var returnvalue = await editTask.processNamePresentInTask();
        await expect(returnvalue).toBeFalsy();

        //validate Automation Template
        await editTask.clickOnCancelButton();
        await viewTask.clickOnViewCase();
        await caseTaskTab.clickoncasetaskArrowtab();
        await manageTask.clickTaskLinkOnManageTask(automationTaskSummary);
        await viewTask.clickOnEditTask();
        var automated: string = await editTask.getTaskTypeValue();
        await expect(automated).toBe('Automated');
        var attribute1: string = await editTask.getTaskTypeValueAttribute('disabled');
        await expect(attribute1).toBeTruthy();
        var returnvalue1 = await editTask.waitProcessNamePresentInTask();
        await expect(returnvalue1).toBeTruthy();
    }, 180 * 1000);

    it('DRDMV-7148,DRDMV-7140: Automatic Task data validation once Task is created	', async () => {
        await loginPage.resetLogin('qkatawazi');
        let autmationTaskTemplateWithRequiredData = 'Automatic task With Required Field' + Math.floor(Math.random() * 1000000);
        let autmationTaskSummaryWithRequiredData = 'Automatic task Summary With Required Field' + Math.floor(Math.random() * 1000000);
        let automationTaskTemplateWithallField = 'Automation task with All field' + Math.floor(Math.random() * 1000000);
        let automationTaskSummaryWithallField = 'Automation task Summary with All field' + Math.floor(Math.random() * 1000000) + 1;

        //Automated task Template with Required Data
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selecttaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplate.setTemplateName(autmationTaskTemplateWithRequiredData);
        await taskTemplate.setTaskSummary(autmationTaskSummaryWithRequiredData);
        await taskTemplate.selectCompanyByName('Petramco')
        await taskTemplate.setNewProcessName('Approval', 'Get Request Status Data ');;
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selecttaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplate.setTemplateName(automationTaskTemplateWithallField);
        await taskTemplate.setTaskSummary(automationTaskSummaryWithallField);
        await taskTemplate.setTaskDescription('All field get added in this task template');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.setNewProcessName('Approval', 'Get Request Status Data Store');
        await taskTemplate.selectLabel('test');
        await taskTemplate.selectTaskCategoryTier1('Applications');
        await taskTemplate.selectTaskCategoryTier2('Social');
        await taskTemplate.selectTaskCategoryTier3('Chatter');
        await taskTemplate.selectTaskCategoryTier4('Failure');
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        //case create
        await loginPage.resetLogin('qtao');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + automationTaskSummaryWithallField);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await caseEditPage.clickAddTaskButton();

        //Add Automation Task templates in Case
        await caseEditPage.addTaskFromTaskTemplate(autmationTaskTemplateWithRequiredData);
        await caseEditPage.addTaskFromTaskTemplate(automationTaskTemplateWithallField);

        //validate Automation Template With Required Field
        browser.sleep(3000);
        await manageTask.clickTaskLinkOnManageTask(automationTaskSummaryWithallField);
        var tasktypeWithAllData: string = await viewTask.getTaskTypeValue();
        await expect(tasktypeWithAllData).toBe('Automated');
        var processNameWithAllData: string = await viewTask.getProcessNameValue();
        await expect(processNameWithAllData).toBe('com.bmc.arsys.rx.approval:Get Request Status Data Store');
        var description: string = await viewTask.getDescriptionValue();
        await expect(description).toBe('All field get added in this task template');
        var label: string = await viewTask.getLabelValue();
        await expect(label).toBe('test');
        var categorytier1: string = await viewTask.getCategoryTier1Value();
        await expect(categorytier1).toBe('Applications');
        var categorytier2: string = await viewTask.getCategoryTier2Value();
        await expect(categorytier2).toBe('Social');
        var categorytier3: string = await viewTask.getCategoryTier3Value();
        await expect(categorytier3).toBe('Chatter');
        var categorytier4: string = await viewTask.getCategoryTier4Value();
        await expect(categorytier4).toBe('Failure');

        //validate Automation Template
        await viewTask.clickOnViewCase();
        await caseTaskTab.clickoncasetaskArrowtab();
        await manageTask.clickTaskLinkOnManageTask(autmationTaskSummaryWithRequiredData);
        var tasktypeWithRequiredData: string = await viewTask.getTaskTypeValue();
        await expect(tasktypeWithRequiredData).toBe('Automated');
        var processNameWithRequiredData: string = await viewTask.getProcessNameValue();
        await expect(processNameWithRequiredData).toBe('com.bmc.arsys.rx.approval:Get Request Status Data');
        var description: string = await viewTask.getDescriptionValue();

        await expect(description).toBe('');
        var labelValue: string = await viewTask.getLabelValue();
        await expect(labelValue).toBe('');
        var CategoryTier1Value: string = await viewTask.getCategoryTier1Value();
        await expect(CategoryTier1Value).toBe('');
        var CategoryTier2Value: string = await viewTask.getCategoryTier2Value();
        await expect(CategoryTier2Value).toBe('');
        var CategoryTier3Value: string = await viewTask.getCategoryTier3Value();
        await expect(CategoryTier3Value).toBe('');
        var CategoryTier4Value: string = await viewTask.getCategoryTier4Value();
        await expect(CategoryTier4Value).toBe('');
    }, 360 * 1000);
});