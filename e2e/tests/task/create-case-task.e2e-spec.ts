import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import caseTaskTab from '../../pageobject/case/case-task-tab.po';
import createCasePage from '../../pageobject/case/create-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import taskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTask from "../../pageobject/task/edit-task.po";
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import utilCommon from '../../utils/util.common';

describe('Create Case Task', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-7165,DRDMV-7147: Update Task Type field for any task	', async () => {
        let manualTaskTemplate = 'Manual  task' + Math.floor(Math.random() * 1000000);
        let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let automationTaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
        let automationTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

        //Manual task Template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
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
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplate.setTemplateName(automationTaskTemplate);
        await taskTemplate.setTaskSummary(automationTaskSummary);
        await taskTemplate.setTaskDescription('Description in manual task');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.setNewProcessName('Approval', 'Get Request Status Data 123');
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        //case create
        await navigationPage.signOut();
        await loginPage.login('qtao');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + manualTaskSummary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.clickAddTaskButton();

        //Add Manual task and Automation Task in Case
        await viewCasePage.addTaskFromTaskTemplate(manualTaskTemplate);
        await viewCasePage.addTaskFromTaskTemplate(automationTaskTemplate);

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
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
    }, 180 * 1000);

    it('DRDMV-7148,DRDMV-7140: Automatic Task data validation once Task is created	', async () => {
        let autmationTaskTemplateWithRequiredData = 'Automatic task With Required Field' + Math.floor(Math.random() * 1000000);
        let autmationTaskSummaryWithRequiredData = 'Automatic task Summary With Required Field' + Math.floor(Math.random() * 1000000);
        let automationTaskTemplateWithallField = 'Automation task with All field' + Math.floor(Math.random() * 1000000);
        let automationTaskSummaryWithallField = 'Automation task Summary with All field' + Math.floor(Math.random() * 1000000) + 1;

        //Automated task Template with Required Data
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
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
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
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
        await navigationPage.signOut();
        await loginPage.login('qtao');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + automationTaskSummaryWithallField);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.clickAddTaskButton();

        //Add Automation Task templates in Case
        await viewCasePage.addTaskFromTaskTemplate(autmationTaskTemplateWithRequiredData);
        await viewCasePage.addTaskFromTaskTemplate(automationTaskTemplateWithallField);

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
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
    }, 360 * 1000);

    it('DRDMV-7124: [Automatic Task] - Task Template UI in Edit mode: New fields validations ', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        var templateData = {
            "templateName": `manualTaskTemplateActive ${randomStr}`,
            "templateSummary": `manualTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
        }
        var templateData1 = {
            "templateName": `manualTaskTemplateInActive ${randomStr}`,
            "templateSummary": `manualTaskTemplateInActive ${randomStr}`,
            "templateStatus": "Inactive",
        }
        var templateData2 = {
            "templateName": `manualTaskTemplateDraft ${randomStr}`,
            "templateSummary": `manualTaskTemplateDraft ${randomStr}`,
            "templateStatus": "Draft",
        }

        var templateData4 = {
            "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
        }

        var templateData5 = {
            "templateName": `AutomatedTaskTemplateInActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateInActive ${randomStr}`,
            "templateStatus": "Inactive",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 2 ${randomStr}`,
        }

        var templateData6 = {
            "templateName": `AutomatedTaskTemplateDraft ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateDraft ${randomStr}`,
            "templateStatus": "Draft",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 3 ${randomStr}`,
        }

        await apiHelper.apiLogin('qkatawazi');
        let temp1 = await apiHelper.createAutomatedTaskTemplate(templateData4);
        let temp2 = await apiHelper.createAutomatedTaskTemplate(templateData5);
        let temp3 = await apiHelper.createAutomatedTaskTemplate(templateData6);
        let temp4 = await apiHelper.createManualTaskTemplate(templateData);
        let temp5 = await apiHelper.createManualTaskTemplate(templateData1);
        let temp6 = await apiHelper.createManualTaskTemplate(templateData2);

        console.log(
            temp1.displayId, "\n",
            temp2.displayId, "\n",
            temp3.displayId, "\n",
            temp4.displayId, "\n",
            temp5.displayId, "\n",
            temp6.displayId
        );
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(`manualTaskTemplateActive appt`);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await expect(viewTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await viewTaskTemplate.clickOnEditLink();
        await expect(editTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await expect(editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
        await expect(editTaskTemplate.isProcessNamePresentInTask()).toBeFalsy();

        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(`manualTaskTemplateInActive ${randomStr}`);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await expect(viewTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await viewTaskTemplate.clickOnEditLink();
        await expect(editTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await expect(editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
        await expect(editTaskTemplate.isProcessNamePresentInTask()).toBeFalsy();

        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(`manualTaskTemplateDraft ${randomStr}`);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await expect(viewTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await viewTaskTemplate.clickOnEditLink();
        await expect(editTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await expect(editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
        await expect(editTaskTemplate.isProcessNamePresentInTask()).toBeFalsy();

        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(`AutomatedTaskTemplateActive ${randomStr}`);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await expect(viewTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await viewTask.clickOnEditTask();
        await expect(editTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await expect(editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
        await expect(editTaskTemplate.isProcessNamePresentInTask()).toBeTruthy();

        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(`AutomatedTaskTemplateInActive ${randomStr}`);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await expect(viewTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await viewTask.clickOnEditTask();
        await expect(editTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await expect(editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
        await expect(editTaskTemplate.isProcessNamePresentInTask()).toBeTruthy();

        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(`AutomatedTaskTemplateDraft ${randomStr}`);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await expect(viewTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await viewTask.clickOnEditTask();
        await expect(editTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await expect(editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
        await expect(editTaskTemplate.isProcessNamePresentInTask()).toBeTruthy();
    });

    it('DRDMV-12039, DRDMV-12040: [ Task ] - Verify Associated menu for Task will show global configuration values as well	 ', async () => {
        // await apiHelper.apiLogin('tadmin');       
        // await apiHelper.associateCategoryToOrganization('Applications', '- Global -');

        let TaskTemplate = 'Manual task' + Math.floor(Math.random() * 1000000);
        let TaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

        //manual Task template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplate.setTemplateName(TaskTemplate);
        await taskTemplate.setTaskSummary(TaskSummary);
        await taskTemplate.setTaskDescription('Description');
        await taskTemplate.selectCompanyByName('Global');
        await taskTemplate.selectTaskCategoryTier1('Applications');
        await taskTemplate.selectTaskCategoryTier2('Social');
        await taskTemplate.selectTaskCategoryTier3('Chatter');
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();
        await expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Applications');
        await expect(viewTaskTemplate.getCategoryTier2Value()).toBe('Social');
        await expect(viewTaskTemplate.getCategoryTier3Value()).toBe('Chatter');
        await expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('- Global -');
    }, 120 * 1000);

	
});

