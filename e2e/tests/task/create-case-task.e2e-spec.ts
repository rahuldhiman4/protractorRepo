import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import createCasePage from '../../pageobject/case/create-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/common/login.po";
import { SOCIAL_SERVICE_PROCESS } from '../../data/ui/flowset/process-for-flowset.data.ui';
import navigationPage from "../../pageobject/common/navigation.po";
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import taskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import consoleTask from "../../pageobject/task/console-task.po";
import editTask from "../../pageobject/task/edit-task.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import utilCommon from '../../utils/util.common';
import caseConsolePage from '../../pageobject/case/case-console.po';
import utilGrid from '../../utils/util.grid';
import quickCase from "../../pageobject/case/quick-case.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import { CASE_MANAGEMENT_LIB_PROCESS } from '../../data/ui/flowset/process-for-flowset.data.ui';
import apiCoreUtil from '../../api/api.core.util';
import viewTasktemplatePage from '../../pageobject/settings/task-management/view-tasktemplate.po';
let menuItemDataFile = require('../../data/ui/ticketing/menuItem.ui.json');

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
    });

    //ankagraw
    it('[DRDMV-7165,DRDMV-7147]: Update Task Type field for any task', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let manualTaskTemplateData = {
            "templateName": `manualTaskTemplateDraft ${randomStr}`,
            "templateSummary": `manualTaskTemplateDraft ${randomStr}`,
            "templateStatus": "Active",
        }

        let autoTaskTemplateData = {
            "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);
        await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
        try {
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
            await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await manageTask.addTaskFromTaskTemplate(`manualTaskTemplateDraft ${randomStr}`)
            await expect(await manageTask.isTaskLinkOnManageTask(manualTaskTemplateData.templateSummary)).toBeTruthy(manualTaskTemplateData.templateSummary + ' Task is not added to case');
            await expect(await manageTask.isTaskLinkOnManageTask(autoTaskTemplateData.templateSummary)).toBeTruthy(autoTaskTemplateData.templateSummary + ' Task is not added to case');

            //validate Manual Template
            await manageTask.clickTaskLinkOnManageTask(manualTaskTemplateData.templateSummary);
            await viewTask.clickOnEditTask();
            await expect(await editTask.getTaskTypeValue()).toBe('Manual');
            await expect(await editTask.getTaskTypeValueAttribute('disabled')).toBeTruthy();
            await expect(await editTask.processNamePresentInTask()).toBeFalsy();

            //validate Automation Template
            await editTask.clickOnCancelButton();
            await viewTask.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLinkOnManageTask(autoTaskTemplateData.templateSummary);
            await viewTask.clickOnEditTask();
            await expect(await editTask.getTaskTypeValue()).toBe('Automated');
            await expect(await editTask.getTaskTypeValueAttribute('disabled')).toBeTruthy();
            await expect(await editTask.waitProcessNamePresentInTask()).toBeTruthy();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 170 * 1000);

    //ankagraw
    it('[DRDMV-7148,DRDMV-7140,DRDMV-745,DRDMV-793]: Automatic Task data validation once Task is created	', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let menuItemName: string = await menuItemDataFile['sampleMenuItem'].menuItemName + randomStr;
        menuItemDataFile['sampleMenuItem'].menuItemName = menuItemName;
        await apiHelper.apiLogin('tadmin');
        await apiHelper.associateCategoryToCategory('Chatter', 'Failure');
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createNewMenuItem(menuItemDataFile['sampleMenuItem']);
        let autmationTaskTemplateWithRequiredData = 'Automatic task With Required Field' + Math.floor(Math.random() * 1000000);
        let autmationTaskSummaryWithRequiredData = 'Automatic task Summary With Required Field' + Math.floor(Math.random() * 1000000);
        let automationTaskTemplateWithallField = 'Automation task with All field' + Math.floor(Math.random() * 1000000);
        let automationTaskSummaryWithallField = 'Automation task Summary with All field' + Math.floor(Math.random() * 1000000) + 1;

        //Automated task Template with Required Data
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplate.setTemplateName(autmationTaskTemplateWithRequiredData);
        await taskTemplate.setTaskSummary(autmationTaskSummaryWithRequiredData);
        await taskTemplate.selectCompanyByName('Petramco')
        await taskTemplate.setNewProcessName('Business Workflows', `Get Request Status Data1 ${randomStr}`);
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplate.setTemplateName(automationTaskTemplateWithallField);
        await taskTemplate.setTaskSummary(automationTaskSummaryWithallField);
        await taskTemplate.setTaskDescription('All field get added in this task template');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.setNewProcessName('Business Workflows', `Get Request Status Data2 ${randomStr}`);
        await taskTemplate.selectLabel(menuItemName);
        await taskTemplate.selectTaskCategoryTier1('Applications');
        await taskTemplate.selectTaskCategoryTier2('Social');
        await taskTemplate.selectTaskCategoryTier3('Chatter');
        await taskTemplate.selectTaskCategoryTier4('Failure');
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await expect(viewTasktemplatePage.getTaskCompanyNameValue()).toBe("Petramco");
        //await utilCommon.waitUntilPopUpDisappear();

        //case create
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + automationTaskSummaryWithallField);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(autmationTaskTemplateWithRequiredData);
            await manageTask.addTaskFromTaskTemplate(automationTaskTemplateWithallField);

            //Add Automation Task templates in Case
            await expect(await manageTask.isTaskLinkOnManageTask(autmationTaskSummaryWithRequiredData)).toBeTruthy(autmationTaskTemplateWithRequiredData + ' Task is not added to case');
            await expect(await manageTask.isTaskLinkOnManageTask(automationTaskSummaryWithallField)).toBeTruthy(automationTaskTemplateWithallField + ' Task is not added to case');

            //validate Automation Template With Required Field
            await manageTask.clickTaskLinkOnManageTask(automationTaskSummaryWithallField);
            await expect(await viewTask.getTaskTypeValue()).toBe('Automated');
            await expect(await viewTask.getProcessNameValue()).toBe(`com.bmc.dsm.bwfa:Get Request Status Data2 ${randomStr}`);
            await expect(await viewTask.getDescriptionValue()).toBe('All field get added in this task template');
            await expect(await viewTask.getLabelValue()).toBe(menuItemName);
            await expect(await viewTask.getCategoryTier1Value()).toBe('Applications');
            await expect(await viewTask.getCategoryTier2Value()).toBe('Social');
            await expect(await viewTask.getCategoryTier3Value()).toBe('Chatter');
            await expect(await viewTask.getCategoryTier4Value()).toBe('Failure');

            //validate Automation Template
            await viewTask.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLinkOnManageTask(autmationTaskSummaryWithRequiredData);
            await expect(await viewTask.getTaskTypeValue()).toBe('Automated');
            await expect(await viewTask.getProcessNameValue()).toBe(`com.bmc.dsm.bwfa:Get Request Status Data1 ${randomStr}`);
            await expect(await viewTask.getDescriptionValue()).toBe('');
            await expect(await viewTask.getLabelValue()).toBe('');
            await expect(await viewTask.getCategoryTier1Value()).toBe('');
            await expect(await viewTask.getCategoryTier2Value()).toBe('');
            await expect(await viewTask.getCategoryTier3Value()).toBe('');
            await expect(await viewTask.getCategoryTier4Value()).toBe('');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 300 * 1000);

    //ankagraw
    it('[DRDMV-7124]: [Automatic Task] - Task Template UI in Edit mode: New fields validations ', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        let templateData = {
            "templateName": `manualTaskTemplateActive ${randomStr}`,
            "templateSummary": `manualTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
        }
        let templateData1 = {
            "templateName": `manualTaskTemplateInActive ${randomStr}`,
            "templateSummary": `manualTaskTemplateInActive ${randomStr}`,
            "templateStatus": "Inactive",
        }
        let templateData2 = {
            "templateName": `manualTaskTemplateDraft ${randomStr}`,
            "templateSummary": `manualTaskTemplateDraft ${randomStr}`,
            "templateStatus": "Draft",
        }

        let templateData4 = {
            "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
        }

        let templateData5 = {
            "templateName": `AutomatedTaskTemplateInActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateInActive ${randomStr}`,
            "templateStatus": "Inactive",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 2 ${randomStr}`,
        }

        let templateData6 = {
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
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplateActive ${randomStr}`);
        await expect(viewTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await viewTaskTemplate.clickOnEditLink();
        await expect(editTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await expect(editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
        await expect(editTaskTemplate.isProcessNamePresentInTask()).toBeFalsy();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplateInActive ${randomStr}`);
        await expect(viewTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await viewTaskTemplate.clickOnEditLink();
        await expect(editTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await expect(editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
        await expect(editTaskTemplate.isProcessNamePresentInTask()).toBeFalsy();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplateDraft ${randomStr}`);
        await expect(viewTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await viewTaskTemplate.clickOnEditLink();
        await expect(editTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await expect(editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
        await expect(editTaskTemplate.isProcessNamePresentInTask()).toBeFalsy();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
        await expect(viewTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await viewTask.clickOnEditTask();
        await expect(editTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await expect(editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
        await expect(editTaskTemplate.isProcessNamePresentInTask()).toBeTruthy();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(`AutomatedTaskTemplateInActive ${randomStr}`);
        await expect(viewTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await viewTask.clickOnEditTask();
        await expect(editTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await expect(editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
        await expect(editTaskTemplate.isProcessNamePresentInTask()).toBeTruthy();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(`AutomatedTaskTemplateDraft ${randomStr}`);
        await expect(viewTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await viewTask.clickOnEditTask();
        await expect(editTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await expect(editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
        await expect(editTaskTemplate.isProcessNamePresentInTask()).toBeTruthy();
    }, 160 * 1000);

    //ankagraw
    it('[DRDMV-12039,DRDMV-12040,DRDMV-12009,DRDMV-12084]: [ Task ] - Verify Associated menu for Task will show global configuration values as well	 ', async () => {
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
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
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
        //await utilCommon.waitUntilPopUpDisappear();
        await expect(await viewTaskTemplate.getCategoryTier1Value()).toBe(globalCategName);
        await expect(viewTaskTemplate.getCategoryTier2Value()).toBe(categName2);
        await expect(viewTaskTemplate.getCategoryTier3Value()).toBe(categName3);
        await expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('- Global -')

        //Create a Case
        try {
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
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 180 * 1000);

    //ankagraw
    it('[DRDMV-12558]: Task Template submitter from different company of owner group can edit the template', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let TaskTemplate = 'Manual task' + randomStr;
        let TaskSummary = 'Summary' + randomStr;
        let description = 'description' + randomStr;
        await apiHelper.apiLogin('tadmin');
        let userData = {
            "firstName": "Petramco",
            "lastName": "Psilon",
            "userId": "DRDMV-12558",
        }
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData.userId, "Psilon Support Group2");
        try {
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
            //await utilCommon.waitUntilPopUpDisappear();

            //search above template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(TaskTemplate);
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
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 140 * 1000);

    //ankagraw
    it('[DRDMV-12582]: Task Template access when owner group from different company is applied', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let TaskTemplate = 'Manual task' + randomStr;
        let TaskSummary = 'Summary' + randomStr;
        let description = 'description' + randomStr;
        await apiHelper.apiLogin('tadmin');
        let userData = {
            "firstName": "Petramco",
            "lastName": "Psilon",
            "userId": "DRDMV-12582",
        }
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData.userId, "Facilities");
        await apiHelper.associatePersonToSupportGroup(userData.userId, "Psilon Support Group2");

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplate.setTemplateName(TaskTemplate);
        await taskTemplate.setTaskSummary(TaskSummary);
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.selectOwnerGroup('Facilities');
        await taskTemplate.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');

        //search above template
        try {
            await navigationPage.signOut();
            await loginPage.loginWithCredentials(userData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(TaskTemplate);
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus('Draft');
            await editTaskTemplate.clickOnSaveMetadata();
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectOwnerCompany('Psilon');
            await editTaskTemplate.selectOwnerGroup('Psilon Support Group2');
            await editTaskTemplate.clickOnSaveMetadata();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(TaskTemplate);
            await viewTaskTemplate.clickOnEditLink();
            await editTaskTemplate.setDescription(description);
            await editTaskTemplate.clickOnSaveButton();
            await expect(viewTaskTemplate.getTaskDescriptionNameValue()).toBe(description, "Unable to find the description");
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 190 * 1000);

    //ankagraw
    it('[DRDMV-7149]: [Automatic Task] - Automated Task Status transition validation', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        let social_Service = SOCIAL_SERVICE_PROCESS;
        let social_Service_Process = social_Service.name + randomStr;
        social_Service.name = social_Service_Process;
        await apiCoreUtil.createProcess(social_Service);
        let automationTaskTemplate = 'Automatic task' + Math.floor(Math.random() * 1000000);
        let automationTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let createCase = 'Create Case task' + Math.floor(Math.random() * 1000000);
        let processName = 'process' + Math.floor(Math.random() * 1000000);
        let status: string[] = ["Completed", "Canceled", "Closed"];

        let templateData = {
            "templateName": automationTaskTemplate,
            "templateSummary": automationTaskSummary,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.social-lib",
            "processName": social_Service_Process,
        }
        //Automation Task template
        await apiHelper.apiLogin('qkatawazi');
        let temp1 = await apiHelper.createAutomatedTaskTemplate(templateData);

        //case create
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + createCase);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(templateData.templateName);
            await manageTask.clickOnCloseButton();

            //validate Automation Template With Required Field
            await viewCasePage.changeCaseStatus("In Progress");
            await viewCasePage.clickSaveStatus();
            // await utilCommon.waitUntilPopUpDisappear();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLinkOnManageTask(templateData.templateSummary);
            await viewTask.clickOnChangeStatus();
            await viewTask.clickOnUpdateStatusDrpdown();
            await expect(viewTask.allTaskOptionsPresent(status)).toBeTruthy("Staus Not Found");
            await viewTask.clickOnCancelStatus();
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Closed');
            await viewTask.clickOnSaveStatus();
            await expect(viewTask.getTaskStatusValue()).toBe('Closed');

        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 180 * 1000);

    //ankagraw
    it('[DRDMV-7121]: [Automatic Task] - Task Template Console: Verify Task Type column, filter ', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData1 = {
            "templateName": `manualTaskTemplateActive ${randomStr}`,
            "templateSummary": `manualTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
        }
        let templateData2 = {
            "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
        }

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createAutomatedTaskTemplate(templateData2);
        await apiHelper.createManualTaskTemplate(templateData1);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.clearFilter();
        expect(await selectTaskTemplate.clickOnColumnAndIsColumnSortedAsending('Task Type')).toBeTruthy();
        expect(await selectTaskTemplate.clickOnColumnAndIsColumnSortedDescending('Task Type')).toBeTruthy();
        await selectTaskTemplate.clickOnApplyFilter('Task Type', 'Manual');
        await expect(await selectTaskTemplate.isTaskTypeFilterValue('Manual')).toBeTruthy();
        await utilGrid.clearFilter();
        await selectTaskTemplate.clickOnApplyFilter('Task Type', 'Automated');
        //await utilCommon.waitUntilSpinnerToHide();
        await expect(await selectTaskTemplate.isTaskTypeFilterValue('Automated')).toBeTruthy();
        await utilGrid.clearFilter();
        await utilCommon.waitUntilSpinnerToHide();
    });

    //ankagraw
    it('[DRDMV-3766]: [Task Template Console] Task Template Console verification', async () => {
        await apiHelper.apiLogin('qkatawazi');
        let addColoumn: string[] = ['Label'];
        let allColoumn: string[] = ['Template Name', 'Template Status', 'Task Type', 'Task Category Tier 1', 'Task Category Tier 2', 'Assignee', 'Support Group', 'Modified Date', 'Task Company'];
        let updateAllColoumn: string[] = ['Template Name', 'Template Status', 'Task Type', 'Task Category Tier 1', 'Task Category Tier 2', 'Assignee', 'Support Group', 'Modified Date', 'Task Company', 'Label'];
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await expect(selectTaskTemplate.isAllColumnTitleDisplayed(allColoumn)).toBeTruthy("All Coloumn is not present");
        await selectTaskTemplate.addColumn(addColoumn);
        await expect(selectTaskTemplate.isAllColumnTitleDisplayed(updateAllColoumn)).toBeTruthy("Updated All Coloumn is not present");
        await selectTaskTemplate.removeColumn(addColoumn);
    });

    //ankagraw
    it('[DRDMV-7201]: [Automatic Task] - Task Console: Task Type column and filter validation', async () => {

        await navigationPage.gotoTaskConsole();

        await utilGrid.clearFilter();
        expect(await consoleTask.clickOnColumnAndIsColumnSortedAsending('Task Type')).toBeTruthy();
        expect(await consoleTask.clickOnColumnAndIsColumnSortedDescending('Task Type')).toBeTruthy();
        await selectTaskTemplate.clickOnApplyFilter('Task Type', 'Manual');
        await expect(await consoleTask.isTaskTypeFilterValue('Manual')).toBeTruthy();
        await utilGrid.clearFilter();
        await selectTaskTemplate.clickOnApplyFilter('Task Type', 'Automated');
        //await utilCommon.waitUntilSpinnerToHide();
        await expect(await consoleTask.isTaskTypeFilterValue('Automated')).toBeTruthy();
        await utilGrid.clearFilter();
        await utilCommon.waitUntilSpinnerToHide();
    });

    //ankagraw
    it('[DRDMV-7141,DRDMV-7122]: [Automatic Task] - Task template selection Console: Verify Task Type column, filter', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData1 = {
            "templateName": `manualTaskTemplateActive ${randomStr}`,
            "templateSummary": `manualTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
        }
        let templateData2 = {
            "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
        }

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createAutomatedTaskTemplate(templateData2);
        await apiHelper.createManualTaskTemplate(templateData1);

        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('adam');
        await createCasePage.setSummary('set summary');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddTaskFromTemplateButton();
        await utilGrid.clearFilter();
        await expect(manageTask.getSortedValuesFromColumn('Task Type')).toBeTruthy();
        await manageTask.clickonColumnHeader('Task Type');
        await expect(manageTask.getSortedValuesFromColumn('Task Type')).toBeTruthy();
        await selectTaskTemplate.clickOnApplyFilter('Task Type', 'Manual');
        await expect(await manageTask.getFilterValue('Manual')).toBeTruthy();
        await utilGrid.clearFilter();
        await selectTaskTemplate.clickOnApplyFilter('Task Type', 'Automated');
        //await utilCommon.waitUntilSpinnerToHide();
        await expect(await manageTask.getFilterValue('Automated')).toBeTruthy();
        await utilGrid.clearFilter();
        await utilCommon.waitUntilSpinnerToHide();
    });

    //ankagraw
    it('[DRDMV-2475]: [Permissions] Settings menu for Case Functional Roles', async () => {
        let caseManagementList: string[] = ['', 'Case Management', 'Approvals', 'Assignment', 'Automated Status Transition', 'Notes Template', 'Read Access', 'Status Configuration', 'Templates'];
        let manageFlowsetList: string[] = ['', 'Manage Flowsets', 'Define Flowsets', 'Process Library'];
        let serviceLevelManagementList: string[] = ['', 'Service Level Management', 'Business Time Segment', 'Business Time Shared Entity', 'Configure Data Source', 'Goal Type', 'Service Target', 'Service Target Group'];
        let taskManagementList: string[] = ['', 'Task Management', 'Notes Template', 'Status Configuration', 'Templates'];
        let emailtList: string[] = ['', 'Email', 'Acknowledgment Templates', 'Configuration', 'Templates'];
        let notificationConfigurationList: string[] = ['', 'Notification Configuration', 'Manage Events', 'Manage Templates'];

        await navigationPage.gotoSettingsPage();
        await navigationPage.isSettingsSubMenu("Case Management", caseManagementList);
        await navigationPage.isSettingsSubMenu("Manage Flowsets", manageFlowsetList);
        await navigationPage.isSettingsSubMenu("Service Level Management", serviceLevelManagementList);
        await navigationPage.isSettingsSubMenu("Task Management", taskManagementList);
        await navigationPage.isSettingsSubMenu("Email", emailtList);
        await navigationPage.isSettingsSubMenu("Notification Configuration", notificationConfigurationList);

        try {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.isSettingsSubMenu("Case Management", caseManagementList);
            await navigationPage.isSettingsSubMenu("Manage Flowsets", manageFlowsetList);
            await navigationPage.isSettingsSubMenu("Service Level Management", serviceLevelManagementList);
            await navigationPage.isSettingsSubMenu("Task Management", taskManagementList);

            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoSettingsPage();
            await expect(navigationPage.isSettingMenuPresent('Case Management')).toBeFalsy();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ankagraw
    it('[DRDMV-3795]: [Task Template] Task Template Status changes', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        let templateDataDraft1 = {
            "templateName": `manualTaskTemplateDraft1 ${randomStr}`,
            "templateSummary": `manualTaskTemplateDraft1 ${randomStr}`,
            "templateStatus": "Draft",
        }
        let templateDataActive = {
            "templateName": `manualTaskTemplateActive ${randomStr}`,
            "templateSummary": `manualTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
        }

        await apiHelper.apiLogin('qkatawazi');
        let temp1 = await apiHelper.createManualTaskTemplate(templateDataDraft1);
        let temp2 = await apiHelper.createManualTaskTemplate(templateDataActive);



        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplateDraft1 ${randomStr}`);
        await expect(viewTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await editTaskTemplate.clickOnEditMetadataLink();
        await editTaskTemplate.selectTemplateStatus("Active");
        await editTaskTemplate.clickOnSaveMetadata();
        await expect(viewTaskTemplate.getTemplateStatus()).toBe('Active');
        await editTaskTemplate.clickOnEditMetadataLink();
        await editTaskTemplate.selectTemplateStatus("Inactive");
        await editTaskTemplate.clickOnSaveMetadata();
        await expect(viewTaskTemplate.getTemplateStatus()).toBe('Inactive');
        await editTaskTemplate.clickOnEditMetadataLink();
        await editTaskTemplate.selectTemplateStatus("Draft");
        await editTaskTemplate.clickOnSaveMetadata();
        await expect(viewTaskTemplate.getTemplateStatus()).toBe('Draft');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplateActive ${randomStr}`);
        await editTaskTemplate.clickOnEditMetadataLink();
        await editTaskTemplate.selectTemplateStatus("Inactive");
        await editTaskTemplate.clickOnSaveMetadata();
        await expect(viewTaskTemplate.getTemplateStatus()).toBe('Inactive');
        await editTaskTemplate.clickOnEditMetadataLink();
        await editTaskTemplate.selectTemplateStatus("Draft");
        await editTaskTemplate.clickOnSaveMetadata();
        await expect(viewTaskTemplate.getTemplateStatus()).toBe('Draft');
    });

    //ankagraw
    it('[DRDMV-7254]: Automated Task] - Automated Task Activation behavior when Case is created in In Progress status via Case template having Task templates in it', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        let templateData = {
            "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
        }

        await apiHelper.apiLogin('fritz');
        let automationTaskTemplate = await apiHelper.createAutomatedTaskTemplate(templateData);

        let caseTemplateName = randomStr + 'caseTemplateName';
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let CaseTemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(CaseTemplateData);
        console.log("active case Template is created===", newCaseTemplate.id);
        console.log("active case Template is created===", newCaseTemplate.displayId);
        await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, automationTaskTemplate.displayId);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('SummaryAnkush');
        await createCasePage.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.clickOnTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Completed");

        //Quick Case 
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('adam');
        await quickCase.selectCaseTemplate('new case');
        await quickCase.createCaseButton();
        await quickCase.gotoCaseButton();
        await viewCasePage.clickOnTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Completed");

    });

    //ankagraw
    it('[DRDMV-7158]: Automated Task] - Automated Task Activation behavior when Case is created in In Progress status via Case template having Task templates in it', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        let templateData = {
            "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
        }

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createAutomatedTaskTemplate(templateData);

        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
        await manageTask.clickOnCloseButton();
        await viewCasePage.changeCaseStatus('Pending');
        await viewCasePage.setStatusReason('Customer Response');
        await viewCasePage.clickSaveStatus();
        await viewCasePage.changeCaseStatus('Canceled');
        await viewCasePage.setStatusReason('Customer Canceled');
        await viewCasePage.clickSaveStatus();
        await viewCasePage.clickOnTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Canceled");
    });

    //ankagraw
    it('[DRDMV-7154,DRDMV-7153]: [Automatic Task] - Task Activation when multiple Tasks are on same sequence', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        await apiHelper.apiLogin('tadmin');
        let case_management = CASE_MANAGEMENT_LIB_PROCESS;
        let case_Management_Process = case_management.name + randomStr;
        case_management.name = case_Management_Process;
        await apiCoreUtil.createProcess(case_management);
        let templateData = {
            "templateName": `FirstAutomatedTaskTemplateActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateSummaryActive ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": case_Management_Process,
        }

        let templateData1 = {
            "templateName": `SecondAutomatedTaskTemplateActive1 ${randomStr}`,
            "templateSummary": `SecondAutomatedTaskTemplateSummaryActive1 ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": case_Management_Process,
        }

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createAutomatedTaskTemplate(templateData);
        await apiHelper.createAutomatedTaskTemplate(templateData1);

        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate(`FirstAutomatedTaskTemplateActive ${randomStr}`);
        await manageTask.addTaskFromTaskTemplate(`SecondAutomatedTaskTemplateActive1 ${randomStr}`);
        await manageTask.clickOnCloseButton();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`AutomatedTaskTemplateSummaryActive ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Staged");
        await viewTask.clickOnViewCase();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`SecondAutomatedTaskTemplateSummaryActive1 ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Staged");
        await viewTask.clickOnViewCase();
        await viewCasePage.changeCaseStatus('In Progress');
        await viewCasePage.clickSaveStatus();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`AutomatedTaskTemplateSummaryActive ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Completed");
        await expect(viewTask.getStatusReason()).toBe("Successful")
        await viewTask.clickOnViewCase();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`SecondAutomatedTaskTemplateSummaryActive1 ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Completed");
    }, 240 * 1000);

    it('[DRDMV-7145]: [Automatic task] - Task Activation based on its sequence no.', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        let templateData1 = {
            "templateName": `manualTaskTemplate1 ${randomStr}`,
            "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
            "templateStatus": "Active",
        }

        let templateData2 = {
            "templateName": `manualTaskTemplate2 ${randomStr}`,
            "templateSummary": `manualTaskTemplateSummary2 ${randomStr}`,
            "templateStatus": "Active",
        }

        let templateData3 = {
            "templateName": `manualTaskTemplate3 ${randomStr}`,
            "templateSummary": `manualTaskTemplateSummary3 ${randomStr}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createManualTaskTemplate(templateData1);
        await apiHelper.createManualTaskTemplate(templateData2);
        await apiHelper.createManualTaskTemplate(templateData3);

        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate(`manualTaskTemplate1 ${randomStr}`);
        await manageTask.addTaskFromTaskTemplate(`manualTaskTemplate2 ${randomStr}`);
        await manageTask.addTaskFromTaskTemplate(`manualTaskTemplate3 ${randomStr}`);
        await manageTask.clickOnCloseButton();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`manualTaskTemplateSummary1 ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Staged");
        await viewTask.clickOnViewCase();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`manualTaskTemplateSummary2 ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Staged");
        await viewTask.clickOnViewCase();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`manualTaskTemplateSummary3 ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Staged");
        await viewTask.clickOnViewCase();
        await viewCasePage.changeCaseStatus('In Progress');
        await viewCasePage.clickSaveStatus();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`manualTaskTemplateSummary1 ${randomStr}`);
        await viewTask.clickOnChangeStatus();
        await expect(viewTask.getTaskStatusValue()).toBe("Assigned");
        await viewTask.changeTaskStatus('Completed');
        await updateStatusBladePo.setStatusReason('Successful');
        await viewTask.clickOnSaveStatus();
        await viewTask.clickOnViewCase();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`manualTaskTemplateSummary2 ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Assigned");
        await viewTask.clickOnViewCase();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`manualTaskTemplateSummary3 ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Staged");
    }, 240 * 1000);

    it('[DRDMV-7143,DRDMV-7144]: [Automatic Task] - Task Activation behaviour immediately after creation when Task is at seq 1', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        let case_management = CASE_MANAGEMENT_LIB_PROCESS;
        let case_Management_Process = case_management.name + randomStr;
        case_management.name = case_Management_Process;
        await apiCoreUtil.createProcess(case_management);
        let templateData = {
            "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": case_Management_Process,
        }
        await apiHelper.apiLogin('fritz');
        await apiHelper.createAutomatedTaskTemplate(templateData);

        var caseWithInprogressStatus = {
            "Status": "3000",
            "Company": "Petramco",
            "Description": "This case was created by java integration tests",
            "Requester": "qkatawazi",
            "Summary": "create case is inProgress Status" + randomStr,
            "Support Group": "Compensation and Benefits",
            "Assignee": "Elizabeth"
        }

        var caseWithPendingStatus = {
            "Status": "4000",
            "Company": "Petramco",
            "Description": "This case was created by java integration tests",
            "Requester": "qkatawazi",
            "Summary": "create case is in Pending Status" + randomStr,
            "Support Group": "Compensation and Benefits",
            "Assignee": "Elizabeth"
        }

        var caseWithResolvedStatus = {
            "Status": "5000",
            "Company": "Petramco",
            "Description": "This case was created by java integration tests",
            "Requester": "qkatawazi",
            "Summary": "create case is in Resolved Status" + randomStr,
            "Support Group": "Compensation and Benefits",
            "Assignee": "Elizabeth"
        }

        var caseWithClosedStatus = {
            "Status": "7000",
            "Company": "Petramco",
            "Description": "This case was created by java integration tests",
            "Requester": "qkatawazi",
            "Summary": "create case is in Closed Status" + randomStr,
            "Support Group": "Compensation and Benefits",
            "Assignee": "Elizabeth"
        }

        var caseWithCanceledStatus = {
            "Status": "6000",
            "Company": "Petramco",
            "Description": "This case was created by java integration tests",
            "Requester": "qkatawazi",
            "Summary": "create case is in Canceled Status" + randomStr,
            "Support Group": "Compensation and Benefits",
            "Assignee": "Elizabeth"
        }
        await apiHelper.apiLogin('qtao');
        var inProgressCase = await apiHelper.createCase(caseWithInprogressStatus);
        var PendingCase = await apiHelper.createCase(caseWithPendingStatus);
        var resolvedCase = await apiHelper.createCase(caseWithResolvedStatus);
        var closedCase = await apiHelper.createCase(caseWithClosedStatus);
        var CanceledCase = await apiHelper.createCase(caseWithCanceledStatus);

        var inProgress: string = inProgressCase.displayId;
        var pending: string = PendingCase.displayId;
        var resolved: string = resolvedCase.displayId;
        var closed: string = closedCase.displayId;
        var canceled: string = CanceledCase.displayId;

        //Verify New Case
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary("New case" + randomStr);
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await expect(viewCasePage.isAddtaskButtonDisplayed()).toBeTruthy("Add task button not Visible")
        await viewCasePage.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
        await manageTask.clickOnCloseButton();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`AutomatedTaskTemplateActive ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Staged");

        //Verify Assigned Case
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary("Assigned case" + randomStr);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await expect(viewCasePage.isAddtaskButtonDisplayed()).toBeTruthy("Add task button not Visible")
        await viewCasePage.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
        await manageTask.clickOnCloseButton();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`AutomatedTaskTemplateActive ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Staged");

        //Verify In_progress Case
        await navigationPage.gotoCaseConsole();
        await utilGrid.clearFilter();
        await caseConsolePage.searchAndOpenCase(inProgress);
        await expect(viewCasePage.isAddtaskButtonDisplayed()).toBeTruthy("Add task button not Visible")
        await viewCasePage.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
        await manageTask.clickOnCloseButton();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`AutomatedTaskTemplateActive ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Completed");

        //Verify Pending Case
        await navigationPage.gotoCaseConsole();
        await utilGrid.clearFilter();
        await caseConsolePage.searchAndOpenCase(pending);
        await expect(viewCasePage.isAddtaskButtonDisplayed()).toBeTruthy("Add task button not Visible")
        await viewCasePage.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
        await manageTask.clickOnCloseButton();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`AutomatedTaskTemplateActive ${randomStr}`);
        await expect(viewTask.getTaskStatusValue()).toBe("Staged");

        //Verify Resolved Case
        await navigationPage.gotoCaseConsole();
        await utilGrid.clearFilter();
        await caseConsolePage.searchAndOpenCase(resolved);
        await expect(viewCasePage.isAddtaskButtonDisplayed()).toBeFalsy("Add task button Visible");

        //Verify Closed Case
        await navigationPage.gotoCaseConsole();
        await utilGrid.clearFilter();
        await caseConsolePage.searchAndOpenCase(closed);
        await expect(viewCasePage.isAddtaskButtonDisplayed()).toBeFalsy("Add task button Visible");

        //Verify Canceled Case
        await navigationPage.gotoCaseConsole();
        await utilGrid.clearFilter();
        await caseConsolePage.searchAndOpenCase(canceled);
        await expect(viewCasePage.isAddtaskButtonDisplayed()).toBeFalsy("Add task button Visible");

    }, 320 * 1000);

});