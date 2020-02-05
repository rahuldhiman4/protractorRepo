import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import createCasePage from '../../pageobject/case/create-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import dynamicField from "../../pageobject/common/dynamic-fields.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import copyTemplatePage from "../../pageobject/settings/task-management/copy-tasktemplate.po";
import taskTemplatePage from "../../pageobject/settings/task-management/create-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import utilCommon from '../../utils/util.common';

describe('Copy Task Template', () => {
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

    it('[DRDMV-14214]: Create a Copy an Automated Task template by using existing Process for it, Check Execution', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let automatedTaskTemplate1 = 'DRDMV14214AutomationTask' + randomStr;
        let automatedTaskSummary1 = 'DRDMV14214AutomationSummary1' + randomStr;
        let automatedTaskTemplate2 = 'DRDMV14214AutomationTask2' + randomStr;
        let automatedTaskSummary2 = 'DRDMV14214AutomationSummary2' + randomStr;
        let processName = 'DRDMV14214ProcessName' + randomStr;

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplatePage.setTemplateName(automatedTaskTemplate1);
        await taskTemplatePage.setTaskSummary(automatedTaskSummary1);
        await taskTemplatePage.setTaskDescription('Description in manual task');
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.setNewProcessName('Business Workflows', processName);
        await taskTemplatePage.selectTemplateStatus('Active');
        await taskTemplatePage.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        await expect(await viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.bwfa:' + processName);
        await viewTaskTemplate.clickOnCopyTemplate();
        await expect(copyTemplatePage.unSelectCopyExistingProcess()).toBeTruthy();
        await expect(copyTemplatePage.getProcessName()).toBe(processName);
        await copyTemplatePage.setTemplateName(automatedTaskSummary2);
        await copyTemplatePage.selectTemplateStatus('Active');
        await copyTemplatePage.setTaskSummary(automatedTaskSummary2)
        await copyTemplatePage.clickSaveCopytemplate();
        await utilCommon.clickOnWarningOk();

        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary' + automatedTaskTemplate2);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();

            //Add Automation Task templates in Case
            await manageTask.addTaskFromTaskTemplate(automatedTaskSummary2);
            await manageTask.clickOnCloseButton();
            await viewCasePage.changeCaseStatus("In Progress");
            await viewCasePage.clickSaveStatus();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLinkOnManageTask(automatedTaskSummary2);
            await expect(viewTask.getTaskStatusValue()).toBe('Completed');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 120 * 1000);

    it('[DRDMV-13548]: Create a Copy of Task template where Submitter do not belong to any Support Groups', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTaskTemplate = 'DRDMV13548ManualTask1' + randomStr;
        let manualTaskSummary = 'DRDMV13548Summary' + randomStr;
        let newManualTaskTemplate = 'NewManualtaskDRDMV13548' + randomStr;

        await apiHelper.apiLogin('tadmin');
        var userData = {
            "firstName": "Petramco",
            "lastName": "Psilon",
            "userId": "DRDMV-13548",
        }
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");

        //Manual Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplatePage.setTemplateName(manualTaskTemplate);
        await taskTemplatePage.setTaskSummary(manualTaskSummary);
        await taskTemplatePage.setTaskDescription('Description in manual task');
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.selectTemplateStatus('Active');
        await taskTemplatePage.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        try {
            await navigationPage.signOut();
            await loginPage.loginWithCredentials(userData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(manualTaskTemplate);
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTemplatePage.setTemplateName(newManualTaskTemplate);
            await expect(copyTemplatePage.isOwnerGroupEmpty()).toBeTruthy();
            await copyTemplatePage.clickSaveCopytemplate();
            await expect(utilCommon.getPopUpMessage()).toBe('Resolve the field validation errors and then try again.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 120 * 1000);

    it('[DRDMV-14218]: The copy of Automated Task template is created across company and check the way to Edit the existing linked Process.', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        var userData = {
            "firstName": "Petramco",
            "lastName": "Psilon",
            "userId": "DRDMV-14218",
        }
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData.userId, "Compensation and Benefits");

        let automationTaskTemplate = 'DRDMV14218AutomationTemplate' + randomStr;
        let automationTaskSummary = 'DRDMV14218Summary' + randomStr;
        let AutomationTaskProcess = 'DRDMV14218Process' + randomStr;

        let newAutomationTaskTemplate = 'NewAutomationTemplateDRDMV14218' + randomStr;
        let newAutomationTaskProcess = 'NewProcessDRDMV14218' + randomStr;

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplatePage.setTemplateName(automationTaskTemplate);
        await taskTemplatePage.setTaskSummary(automationTaskSummary);
        await taskTemplatePage.setTaskDescription('Description in manual task');
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.setNewProcessName('Business Workflows', AutomationTaskProcess);
        await taskTemplatePage.selectTemplateStatus('Active');
        await taskTemplatePage.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        //Login through both Petramco and Psilon User
        try {
            await navigationPage.signOut();
            await loginPage.loginWithCredentials(userData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(automationTaskTemplate);
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTemplatePage.selectTaskCompany('Psilon')
            await copyTemplatePage.setTemplateName(newAutomationTaskTemplate);
            await copyTemplatePage.setNewProcessName(newAutomationTaskProcess);
            await copyTemplatePage.clickSaveCopytemplate();
            //await utilCommon.waitUntilPopUpDisappear();
            await expect(viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.bwfa:' + newAutomationTaskProcess);

            //Login through only Petramco User
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(newAutomationTaskTemplate);
            await expect(viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.bwfa:' + newAutomationTaskProcess);

            //Login through only Psilon User
            //await browser.sleep(2000);
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(newAutomationTaskTemplate);
            await expect(viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.bwfa:' + newAutomationTaskProcess);
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 240 * 1000);

    it('[DRDMV-14217]: Copy of Automated task template created across company and no new Process is created', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        var userData = {
            "firstName": "Petramco",
            "lastName": "Psilon",
            "userId": "DRDMV-14217",
        }
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData.userId, "Compensation and Benefits");

        let automationTaskTemplate = 'DRDMV14217Automationtask' + randomStr;
        let automationTaskSummary = 'DRDMV14217Summary' + randomStr;

        let newAutomationTaskTemplate = 'NewAutomationtaskDRDMV14217' + randomStr;
        let newAutomationTaskProcess = 'NewProcessDRDMV14217' + randomStr;

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplatePage.setTemplateName(automationTaskTemplate);
        await taskTemplatePage.setTaskSummary(automationTaskSummary);
        await taskTemplatePage.setTaskDescription('Description in manual task');
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.setNewProcessName('Business Workflows', newAutomationTaskProcess);
        await taskTemplatePage.selectTemplateStatus('Active');
        await taskTemplatePage.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        try {
            await navigationPage.signOut();
            await loginPage.loginWithCredentials(userData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(automationTaskTemplate);
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTemplatePage.selectTaskCompany('Psilon')
            await copyTemplatePage.setTemplateName(newAutomationTaskTemplate);
            await copyTemplatePage.setNewProcessName(newAutomationTaskProcess);
            await copyTemplatePage.clickSaveCopytemplate();
            await browser.refresh();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.setTaskSearchBoxValue(automationTaskTemplate);
            await expect(viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.bwfa:' + newAutomationTaskProcess);
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 180 * 1000);

    it('[DRDMV-13540,DRDMV-13556]: Case Business Analyst can create a copy of Task Template type= Manual, New template created is in draft status', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTaskTemplate = 'DRDMV13540ManualTask' + randomStr;
        let manualTaskSummary = 'DRDMV13540Summary' + randomStr;

        let newManualTaskTemplate = 'NewManualTaskDRDMV13540' + randomStr;
        let newmanualTaskSummary = 'NewSummaryDRDMV13540' + randomStr;

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplatePage.setTemplateName(manualTaskTemplate);
        await taskTemplatePage.setTaskSummary(manualTaskSummary);
        await taskTemplatePage.setTaskDescription('Description in manual task');
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.selectTemplateStatus('Active');
        await taskTemplatePage.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        await viewTaskTemplate.clickOnCopyTemplate();
        await copyTemplatePage.setTemplateName(newManualTaskTemplate);
        await copyTemplatePage.setTaskSummary(newmanualTaskSummary);

        await copyTemplatePage.clickSaveCopytemplate();
        await expect(viewTaskTemplate.getTemplateStatus()).toBe("Draft");
        await expect(viewTaskTemplate.getOwnerCompanyValue()).toBe("Petramco");
        await expect(viewTaskTemplate.getOwnerGroupValue()).toBe("Compensation and Benefits");

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(newManualTaskTemplate);
        await expect(viewTaskTemplate.getTemplateName()).toBe(newManualTaskTemplate);
    });

    it('[DRDMV-13573]: Fields copied while creating copy of Automated Task template', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTaskTemplate = 'ManualTaskDRDMV13573' + randomStr;
        let manualTaskSummary = 'ManualSummaryDRDMV13573' + randomStr;
        let processName = 'ProcessDRDMV13573' + randomStr;
        let newProcessName = 'NewProcessDRDMV13573' + randomStr;

        let newManualTaskTemplate = 'NewManualTaskDRDMV13573' + randomStr;
        let Description = 'DescriptionDRDMV13573' + randomStr;

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplatePage.setTemplateName(manualTaskTemplate);
        await taskTemplatePage.setTaskSummary(manualTaskSummary);
        await taskTemplatePage.setTaskDescription(Description);
        await taskTemplatePage.setNewProcessName('Business Workflows', processName);
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.selectTemplateStatus('Active');
        await taskTemplatePage.selectTaskCategoryTier1('Applications');
        await taskTemplatePage.selectTaskCategoryTier2('Social');
        await taskTemplatePage.selectTaskCategoryTier3('Chatter');
        await taskTemplatePage.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndSelectTaskTemplate(manualTaskTemplate);
        await selectTaskTemplate.clickOnCopyTaskTemplateButton();
        await copyTemplatePage.setTemplateName(newManualTaskTemplate);
        await copyTemplatePage.setNewProcessName(newProcessName);
        await copyTemplatePage.clickSaveCopytemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        await expect(await viewTaskTemplate.getTemplateStatus()).toBe('Draft');
        await expect(await viewTaskTemplate.getSummaryValue()).toBe(manualTaskSummary);
        await expect(await viewTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('Petramco');
        await expect(await viewTaskTemplate.getTaskDescriptionNameValue()).toBe(Description);
        await expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Applications');
        await expect(await viewTaskTemplate.getCategoryTier2Value()).toBe('Social');
        await expect(await viewTaskTemplate.getCategoryTier3Value()).toBe('Chatter');

    });

    it('[DRDMV-14215]: Create a Copy of an automated Task Template where New Process is created and check its execution', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let TaskTemplate = 'DRDMV14215AutomationTask' + randomStr;
        let TaskSummary = 'DRDMV14215Summary' + randomStr;
        let processName = 'DRDMV14215Process' + randomStr;
        let newProcessName = 'NewProcessDRDMV14215' + randomStr;

        let UpdatedTaskTemplate = 'UpdatedTaskDRDMV14215' + randomStr;
        let UpdatedTaskSummary = 'NewSummaryDRDMV14215' + randomStr;
        let Description = 'DescriptionDRDMV14215' + randomStr;

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplatePage.setTemplateName(TaskTemplate);
        await taskTemplatePage.setTaskSummary(TaskSummary);
        await taskTemplatePage.setTaskDescription(Description);
        await taskTemplatePage.setNewProcessName('Business Workflows', processName);
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.selectTemplateStatus('Active');
        await taskTemplatePage.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(TaskTemplate);
        await viewTaskTemplate.clickOnCopyTemplate();
        await expect(copyTemplatePage.getSourceProcessName()).toBe('com.bmc.dsm.bwfa:' + processName);
        await copyTemplatePage.setTemplateName(UpdatedTaskTemplate);
        await copyTemplatePage.setTaskSummary(UpdatedTaskSummary);
        await copyTemplatePage.selectBundles("Case Management Service");
        await copyTemplatePage.setNewProcessName(newProcessName);
        await copyTemplatePage.selectTemplateStatus('Active');
        await copyTemplatePage.clickSaveCopytemplate();
        //await browser.sleep(2000);
        //await utilCommon.waitUntilPopUpDisappear();

        //Create a Case
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');

            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + TaskTemplate);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();

            //Add Automation Task templates in Case
            await manageTask.addTaskFromTaskTemplate(UpdatedTaskSummary);
            //await browser.sleep(2000);
            await manageTask.clickOnCloseButton();
            await viewCasePage.changeCaseStatus("In Progress");
            await viewCasePage.clickSaveStatus();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLinkOnManageTask(UpdatedTaskSummary);
            await expect(viewTask.getTaskStatusValue()).toBe('Completed');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 240 * 1000);

    it('[DRDMV-13737]: [Negative] Try to copy Automated template with same process Name and different field data', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplate = 'DRDMV13737Task' + randomStr;
        let taskSummary = 'DRDMV13737Summary' + randomStr;
        let processName = 'DRDMV13737Process' + randomStr;
        let updatedTaskTemplate = 'DRDMV13737UpdatedTask' + randomStr;
        let description = 'DRDMV13737Description' + randomStr;

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplatePage.setTemplateName(taskTemplate);
        await taskTemplatePage.setTaskSummary(taskSummary);
        await taskTemplatePage.setTaskDescription(description);
        await taskTemplatePage.setNewProcessName('Business Workflows', processName);
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.selectTemplateStatus('Active');
        await taskTemplatePage.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(taskTemplate);
        await viewTaskTemplate.clickOnCopyTemplate();
        await copyTemplatePage.setTemplateName(updatedTaskTemplate);
        await copyTemplatePage.setNewProcessName(processName);
        await copyTemplatePage.clickSaveCopytemplate();
        await expect(utilCommon.getPopUpMessage()).toBe('Saved successfully.');
        //  await expect(utilCommon.getPopUpMessages(1)).toBe('ERROR (902): Duplicate process name com.bmc.dsm.bwfa:'+processName); 

    });

    it('[DRDMV-14221]: Check Error Message when trying to edit a process, where process is linked to Active Automated Task template', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplate = 'DRDMV14221AutomationTask' + randomStr;
        let taskSummary = 'DRDMV14221Summary' + randomStr;
        let processName = 'DRDMV14221Process' + randomStr;
        let updatedTaskTemplate = 'DRDMV14221UpdatedTask' + randomStr;
        let description = 'DRDMV14221Description' + randomStr;

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplatePage.setTemplateName(taskTemplate);
        await taskTemplatePage.setTaskSummary(taskSummary);
        await taskTemplatePage.setTaskDescription(description);
        await taskTemplatePage.setNewProcessName('Business Workflows', processName);
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.selectTemplateStatus('Active');
        await taskTemplatePage.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(taskTemplate);
        await viewTaskTemplate.clickOnCopyTemplate();
        await copyTemplatePage.setTemplateName(updatedTaskTemplate);
        await copyTemplatePage.setNewProcessName(processName);
        await copyTemplatePage.clickSaveCopytemplate();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(updatedTaskTemplate);
        await viewTaskTemplate.clickOnEditProcessLink();
        await expect(utilCommon.getPopUpMessage()).toBe('WARNING (222062): Updates to dynamic fields or process affect the templates using the selected process :' + taskTemplate);
    });

    it('[DRDMV-13574,DRDMV-13553]: Fields copied while creating copy of External Task template', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplate = 'DRDMV13574External task' + randomStr;
        let taskSummary = 'DRDMV13574Summary' + randomStr;
        let updatedTaskTemplate = 'DRDMV13574UpdatedTask' + randomStr;
        let description = 'DRDMV13574Description' + randomStr;

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnExtrnalTaskTemplateButton();
        await taskTemplatePage.setTemplateName(taskTemplate);
        await taskTemplatePage.setTaskSummary(taskSummary);
        await taskTemplatePage.setTaskDescription(description);
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.selectTaskCategoryTier1('Applications');
        await taskTemplatePage.selectTaskCategoryTier2('Social');
        await taskTemplatePage.selectTaskCategoryTier3('Chatter');
        await taskTemplatePage.selectTemplateStatus('Active');
        await taskTemplatePage.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(taskTemplate);
        await viewTaskTemplate.clickOnCopyTemplate();
        await copyTemplatePage.setTemplateName(updatedTaskTemplate);
        await copyTemplatePage.clickSaveCopytemplate();
        await expect(await viewTaskTemplate.getTemplateStatus()).toBe('Draft');
        await expect(await viewTaskTemplate.getSummaryValue()).toBe(taskSummary);
        await expect(await viewTaskTemplate.getTaskTypeValue()).toBe('External');
        await expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('Petramco');
        await expect(await viewTaskTemplate.getTaskDescriptionNameValue()).toBe(description);
        await expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Applications');
        await expect(await viewTaskTemplate.getCategoryTier2Value()).toBe('Social');
        await expect(await viewTaskTemplate.getCategoryTier3Value()).toBe('Chatter');
        await expect(await viewTaskTemplate.getOwnerCompanyValue()).toBe("Petramco");
        await expect(await viewTaskTemplate.getOwnerGroupValue()).toBe("Compensation and Benefits");
    });

    it('[DRDMV-13547]: Create a Copy of Task template by Case Business Analyst that belongs to Support Group', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplate = 'DRDMV13547ExternalTask' + randomStr;
        let taskSummary = 'DRDMV13547Summary' + randomStr;
        let updatedTaskTemplate = 'DRDMV13547UpdatedTask' + randomStr;
        let description = 'DRDMV13547Description' + randomStr;

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnExtrnalTaskTemplateButton();
        await taskTemplatePage.setTemplateName(taskTemplate);
        await taskTemplatePage.setTaskSummary(taskSummary);
        await taskTemplatePage.setTaskDescription(description);
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.selectTaskCategoryTier1('Applications');
        await taskTemplatePage.selectTaskCategoryTier2('Social');
        await taskTemplatePage.selectTaskCategoryTier3('Chatter');
        await taskTemplatePage.selectTemplateStatus('Active');
        await taskTemplatePage.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        try {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(taskTemplate);
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTemplatePage.setTemplateName(updatedTaskTemplate);
            await copyTemplatePage.clickSaveCopytemplate();
            await expect(await viewTaskTemplate.getOwnerCompanyValue()).toBe("Petramco");
            await expect(await viewTaskTemplate.getOwnerGroupValue()).toBe("Staffing");
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    it('[DRDMV-13572]: Fields copied while creating copy of Manual Task template', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplate = 'DRDMV13572ManualTask' + randomStr;
        let taskSummary = 'DRDMV13572Summary' + randomStr;
        let updatedTaskTemplate = 'DRDMV13572UpdatedTask' + randomStr;
        let description = 'DRDMV13572Description' + randomStr;

        //manual Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplatePage.setTemplateName(taskTemplate);
        await taskTemplatePage.setTaskSummary(taskSummary);
        await taskTemplatePage.setTaskDescription(description);
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.selectTaskCategoryTier1('Applications');
        await taskTemplatePage.selectTaskCategoryTier2('Social');
        await taskTemplatePage.selectTaskCategoryTier3('Chatter');
        await taskTemplatePage.selectTemplateStatus('Active');
        await taskTemplatePage.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(taskTemplate);
        await viewTaskTemplate.clickOnCopyTemplate();
        await copyTemplatePage.setTemplateName(updatedTaskTemplate);
        await copyTemplatePage.clickSaveCopytemplate();
        await expect(await viewTaskTemplate.getTemplateStatus()).toBe('Draft');
        await expect(await viewTaskTemplate.getSummaryValue()).toBe(taskSummary);
        await expect(await viewTaskTemplate.getTaskTypeValue()).toBe('Manual');
        await expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('Petramco');
        await expect(await viewTaskTemplate.getTaskDescriptionNameValue()).toBe(description);
        await expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Applications');
        await expect(await viewTaskTemplate.getCategoryTier2Value()).toBe('Social');
        await expect(await viewTaskTemplate.getCategoryTier3Value()).toBe('Chatter');
        await expect(await viewTaskTemplate.getOwnerCompanyValue()).toBe("Petramco");
        await expect(await viewTaskTemplate.getOwnerGroupValue()).toBe("Compensation and Benefits");
    });

    it('[DRDMV-13569]: Dynamic Field get copied upon creating copy of Task Template', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let automationTaskTemplate = 'DRDMV13569AutomationTask' + randomStr;
        let automationTaskSummary = 'DRDMV13569Summary' + randomStr;
        let fieldDescription = 'DRDMV13569FieldDescription' + randomStr;
        let processName = 'DRDMV13569Process' + randomStr;

        let updatedTaskTemplate = 'UpdatedTaskDRDMV13569' + randomStr;
        let updatedTaskSummary = 'UpdatedSummaryDRDMV13569' + randomStr;
        let updateProcessName = 'UpdatedProcessDRDMV13569' + randomStr;

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplatePage.setTemplateName(automationTaskTemplate);
        await taskTemplatePage.setTaskSummary(automationTaskSummary);
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.setNewProcessName('Business Workflows', processName);
        await taskTemplatePage.clickOnSaveTaskTemplate();


        //Add Dynamic Field
        await viewTaskTemplate.clickOnManageDynamicFieldLink();
        await dynamicField.clickOnDynamicField();
        await dynamicField.setFieldName('fieldname');
        await dynamicField.setDescriptionName(fieldDescription);
        await dynamicField.clickSaveButton();
        //await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(automationTaskTemplate);
        await viewTaskTemplate.clickOnCopyTemplate();
        await copyTemplatePage.setTemplateName(updatedTaskTemplate);
        await copyTemplatePage.setTaskSummary(updatedTaskSummary);
        await copyTemplatePage.selectBundles("Case Management Service");
        await copyTemplatePage.setNewProcessName(updateProcessName);
        await copyTemplatePage.clickSaveCopytemplate();
        //await utilCommon.waitUntilPopUpDisappear();
        await expect(viewTaskTemplate.getDynamicFieldTitle()).toBe(fieldDescription);

    });

    it('[DRDMV-14220]: Verify Warning message when Dynamic fields are added to a Automated Task template', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let automationTaskTemplate = 'DRDMV14220AutomationTask' + randomStr;
        let automationTaskSummary = 'DRDMV14220Summary' + randomStr;
        let fieldDescription = 'DRDMV14220Field' + randomStr;
        let processName = 'DRDMV14220Process' + randomStr;

        let updatedTaskTemplate = 'DRDMV14220ManualTask' + randomStr;
        let updatedTaskSummary = 'DRDMV14220Summary' + randomStr;
        let updateProcessName = 'DRDMV14220Process' + randomStr;

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplatePage.setTemplateName(automationTaskTemplate);
        await taskTemplatePage.setTaskSummary(automationTaskSummary);
        await taskTemplatePage.selectCompanyByName('Petramco');
        await taskTemplatePage.setNewProcessName('Business Workflows', processName);
        await taskTemplatePage.clickOnSaveTaskTemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows')
        await selectTaskTemplate.searchAndOpenTaskTemplate(automationTaskTemplate);
        await viewTaskTemplate.clickOnCopyTemplate();
        await copyTemplatePage.setTemplateName(updatedTaskTemplate);
        await copyTemplatePage.setTaskSummary(updatedTaskSummary);
        await copyTemplatePage.selectBundles("Case Management Service");
        await copyTemplatePage.setNewProcessName(updateProcessName);
        await copyTemplatePage.clickSaveCopytemplate();
        //await utilCommon.waitUntilPopUpDisappear();

        //Add Dynamic Field
        await viewTaskTemplate.clickOnManageDynamicFieldLink();
        await dynamicField.clickOnDynamicField();
        await dynamicField.setFieldName('fieldname');
        await dynamicField.setDescriptionName(fieldDescription);
        await dynamicField.clickSaveButton();
        //await utilCommon.waitUntilPopUpDisappear();
        await expect(viewTaskTemplate.getDynamicFieldTitle()).toBe(fieldDescription);
    }, 120 * 1000);
});
