import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import caseTaskTab from '../../pageobject/case/case-task-tab.po';
import createCasePage from '../../pageobject/case/create-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import taskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import editTask from "../../pageobject/task/edit-task.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import utilCommon from '../../utils/util.common';

describe('Create Case Task', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    //ankagraw
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

    //ankagraw
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

    //ankagraw
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
        await selectTaskTemplate.setTaskSearchBoxValue(`manualTaskTemplateActive ${randomStr}`);
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

    //ankagraw
    it('DRDMV-12039,DRDMV-12040,DRDMV-12009: [ Task ] - Verify Associated menu for Task will show global configuration values as well	 ', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let globalCategName = 'DemoCateg1';
        let categName2 = 'DemoCateg2';
        let categName3 = 'DemoCateg3';
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createOperationalCategory(globalCategName, true);
        await apiHelper.createOperationalCategory(categName2);
        await apiHelper.createOperationalCategory(categName3);
        await apiHelper.associateCategoryToCategory(globalCategName, categName2);
        await apiHelper.associateCategoryToCategory(categName2, categName3);

        let TaskTemplate = 'Manual task' + randomStr;
        let TaskSummary = 'Summary' + randomStr;
        let manualSummary = 'Summary' + randomStr;

        //manual Task template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplate.setTemplateName(TaskTemplate);
        await taskTemplate.setTaskSummary(TaskSummary);
        await taskTemplate.setTaskDescription('Description');
        await taskTemplate.selectCompanyByName('Global');
        await taskTemplate.selectTaskCategoryTier1(globalCategName);
        await taskTemplate.selectTaskCategoryTier2(categName2);
        await taskTemplate.selectTaskCategoryTier3(categName3);
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();
        await expect(await viewTaskTemplate.getCategoryTier1Value()).toBe(globalCategName);
        await expect(viewTaskTemplate.getCategoryTier2Value()).toBe(categName2);
        await expect(viewTaskTemplate.getCategoryTier3Value()).toBe(categName3);
        await expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('- Global -')

        //Create a Case
        await navigationPage.signOut();
        await loginPage.login('qtao');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + manualSummary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.selectCategoryTier1(globalCategName);
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await expect(viewCasePage.getCategoryTier1Value()).toBe(globalCategName, "Global Category Not Present");

        //Got To Another Case
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary 123 ' + manualSummary);
        await createCasePage.selectCategoryTier1('Applications');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await expect(viewCasePage.getCategoryTier1Value()).toBe('Applications', "Applications Category Not Present");
    }, 180 * 1000);

    //ankagraw
    it('DRDMV-12558: Task Template submitter from different company of owner group can edit the template', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let TaskTemplate = 'Manual task' + randomStr;
        let TaskSummary = 'Summary' + randomStr;
        let description = 'description' + randomStr;
        await apiHelper.apiLogin('tadmin');
        var userData = {
            "firstName": "Petramco",
            "lastName": "Psilon",
            "userId": "DRDMV-12558",
        }
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData.userId, "Psilon Support Group2");
        await navigationPage.signOut();
        await loginPage.loginWithCredentials(userData.userId + "@petramco.com", 'Password_1234');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplate.setTemplateName(TaskTemplate);
        await taskTemplate.setTaskSummary(TaskSummary);
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.selectOwnerCompany('Psilon');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        //search above template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(TaskTemplate);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await viewTaskTemplate.clickOnEditLink();
        await editTaskTemplate.setDescription(description);
        await editTaskTemplate.selectTaskCategoryTier1('Applications');
        await editTaskTemplate.selectTaskCategoryTier2('Social');
        await editTaskTemplate.selectTaskCategoryTier3('Chatter');
        await editTaskTemplate.clickOnSaveButton();
        await expect(viewTaskTemplate.getTaskDescriptionNameValue()).toBe(description, 'description is not present');
        await expect(viewTaskTemplate.getCategoryTier1Value()).toBe('Applications', 'Applications is not present');
        await expect(viewTaskTemplate.getCategoryTier2Value()).toBe('Social', 'Social is not present');
        await expect(viewTaskTemplate.getCategoryTier3Value()).toBe('Chatter', 'Chatter is not present');
    });

    //ankagraw
    it('DRDMV-12582: Task Template access when owner group from different company is applied', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let TaskTemplate = 'Manual task' + randomStr;
        let TaskSummary = 'Summary' + randomStr;
        let description = 'description' + randomStr;
        await apiHelper.apiLogin('tadmin');
        var userData = {
            "firstName": "Petramco",
            "lastName": "Psilon",
            "userId": "DRDMV-12582",
        }
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData.userId, "Facilities");
        await apiHelper.associatePersonToSupportGroup(userData.userId, "Psilon Support Group2");

        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplate.setTemplateName(TaskTemplate);
        await taskTemplate.setTaskSummary(TaskSummary);
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.selectOwnerGroup('Facilities');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');

        //search above template
        await navigationPage.signOut();
        await loginPage.loginWithCredentials(userData.userId + "@petramco.com", 'Password_1234');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(TaskTemplate);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await editTaskTemplate.clickOnEditMetadataLink();
        await editTaskTemplate.selectTemplateStatus('Draft');
        await editTaskTemplate.clickOnSaveMetadataLink();
        await editTaskTemplate.clickOnEditMetadataLink();
        await editTaskTemplate.selectOwnerCompany('Psilon');
        await editTaskTemplate.selectOwnerGroup('Psilon Support Group2');
        await editTaskTemplate.clickOnSaveMetadataLink();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(TaskTemplate);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await viewTaskTemplate.clickOnEditLink();
        await editTaskTemplate.setDescription(description);
        await editTaskTemplate.clickOnSaveButton();
        await expect(viewTaskTemplate.getTaskDescriptionNameValue()).toBe(description, "Unable to find the description");
    });

    it('DRDMV-7149: [Automatic Task] - Automated Task Status transition validation', async () => {

        let automationTaskTemplate = 'Automatic task' + Math.floor(Math.random() * 1000000);
        let automationTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let createCase = 'Create Case task' + Math.floor(Math.random() * 1000000);
        let processName = 'process' + Math.floor(Math.random() * 1000000);
        let status:string []=["Completed","Canceled","Closed"];

        var templateData4 = {
            "templateName": automationTaskTemplate,
            "templateSummary": automationTaskSummary,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.bwfa",
            "processName": processName,
        }
        //Automation Task template
        await apiHelper.apiLogin('qkatawazi');
        let temp1 = await apiHelper.createAutomatedTaskTemplate(templateData4);

        //case create
        await navigationPage.signOut();
        await loginPage.login('qtao');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + createCase);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.clickAddTaskButton();
        await viewCasePage.addTaskFromTaskTemplate(automationTaskTemplate);
        await manageTask.clickTaskLinkOnManageTask(automationTaskSummary);
        await viewTask.clickOnChangeStatus();
        await viewTask.changeTaskStatus('Canceled');
        await viewTask.clickOnSaveStatus();
        await expect(utilCommon.getPopUpMessage()).toBe('ERROR (222103): The Task can be moved to next stage only when the case is not in the Pending  status.');
        await viewTask.clickOnCancelStatus();
        await utilCommon.clickOnWarningOk();
        await viewTask.clickOnViewCase();

        //validate Automation Template With Required Field
        await viewCasePage.changeCaseStatus("In Progress");
        await viewCasePage.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        await viewCasePage.goToManageTask();
        await manageTask.clickTaskLinkOnManageTask(automationTaskSummary);
        await viewTask.clickOnChangeStatus();
        await viewTask.clickOnUpdateStatusDrpdown();
        await expect(viewTask.allTaskOptionsPresent(status)).toBeTruthy("Staus Not Found");
        await viewTask.clickOnCancelStatus();
    }, 120 * 1000);
});
