import { browser } from "protractor";
import loginPage from "../../pageobject/login.po";
import taskTemplate from "../../pageobject/task/create-tasktemplate.po";
import selectTaskTemplate from "../../pageobject/task/console-tasktemplate.po"
import navigationPage from "../../pageobject/navigation.po";
import createCasePage from '../../pageobject/case/create-case.po';
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import utilCommon from '../../utils/ui/util.common';
import copyTemplate from "../../pageobject/task/copy-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/task/view-tasktemplate.po";
import viewCasePage from "../../pageobject/case/view-case.po"

describe('Copy Task Template', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-14214: Create a Copy an Automated Task template by using existing Process for it, Check Execution', async () => {
        let manualTaskTemplate = 'Manual  task' + Math.floor(Math.random() * 1000000);
        let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let automationTaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
        let automationTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let processName = 'Process Name ' + Math.floor(Math.random() * 1000000);

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplate.setTemplateName(automationTaskTemplate);
        await taskTemplate.setTaskSummary(automationTaskSummary);
        await taskTemplate.setTaskDescription('Description in manual task');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.setNewProcessName('Business Workflows', processName);
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        await expect(await viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.bwfa:' + processName);
        await viewTaskTemplate.clickOnCopyTemplate();
        await expect(copyTemplate.unSelectCopyExistingProcess()).toBeTruthy();
        await expect(copyTemplate.getProcessName()).toBe(processName);
        await copyTemplate.setTemplateName(manualTaskSummary);
        await copyTemplate.selectTemplateStatus('Active');
        await copyTemplate.setTaskSummary(manualTaskSummary)
        await copyTemplate.clickSaveCopytemplate();
        await utilCommon.clickOnWarningOk();

        await navigationPage.signOut();
        await loginPage.login('qtao');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + manualTaskTemplate);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.clickAddTaskButton();

        //Add Automation Task templates in Case
        await viewCasePage.addTaskFromTaskTemplate(manualTaskSummary);
        await browser.sleep(2000);
        await manageTask.clickOnCloseButton();
        await viewCasePage.changeCaseStatus("In Progress");
        await viewCasePage.clickSaveStatus();
        await viewCasePage.goToManageTask();
        await manageTask.clickTaskLinkOnManageTask(manualTaskSummary);
        await expect(viewTask.getTaskStatusValue()).toBe('Completed');
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
    });

    xit('DRDMV-14218: The copy of Automated Task template is created across company and check the way to Edit the existing linked Process.', async () => {
        let automationTaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
        let automationTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

        let newAutomationTaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
        let newAutomationTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

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

        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(automationTaskTemplate);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await viewTaskTemplate.clickOnCopyTemplate();
        await copyTemplate.selectTaskCompany('Psilon')
        await copyTemplate.setTemplateName(newAutomationTaskTemplate);
        await copyTemplate.setNewProcessName(newAutomationTaskSummary);
        await copyTemplate.clickSaveCopytemplate();

        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(newAutomationTaskTemplate);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await expect(viewTaskTemplate.getTemplateName()).toBe(newAutomationTaskTemplate);
    });

    it('DRDMV-13540, DRDMV-13556: Case Business Analyst can create a copy of Task Template type= Manual, New template created is in draft status', async () => {
        let manualTaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
        let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

        let newManualTaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
        let newmanualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

        //Automation Task template
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

        await viewTaskTemplate.clickOnCopyTemplate();
        await copyTemplate.setTemplateName(newManualTaskTemplate);
        await copyTemplate.setTaskSummary(newmanualTaskSummary);

        await copyTemplate.clickSaveCopytemplate();
        await expect(viewTaskTemplate.getTemplateStatus()).toBe("Draft");
        await expect(viewTaskTemplate.getOwnerCompanyValue()).toBe("Petramco");
        await expect(viewTaskTemplate.getOwnerCompanyValue()).toBe("Compensation and Benefits");

        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(newManualTaskTemplate);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await expect(viewTaskTemplate.getTemplateName()).toBe(newManualTaskTemplate);
    });

    it('DRDMV-13573: Fields copied while creating copy of Automated Task template', async () => {
        let manualTaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
        let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let processName = 'Process ' + Math.floor(Math.random() * 1000000);
        let newProcessName = 'Process ' + Math.floor(Math.random() * 1000000);

        let newManualTaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
        let Description = 'Description' + Math.floor(Math.random() * 1000000);

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplate.setTemplateName(manualTaskTemplate);
        await taskTemplate.setTaskSummary(manualTaskSummary);
        await taskTemplate.setTaskDescription(Description);
        await taskTemplate.setNewProcessName('Business Workflows', processName);
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.selectTaskCategoryTier1('Applications');
        await taskTemplate.selectTaskCategoryTier2('Social');
        await taskTemplate.selectTaskCategoryTier3('Chatter');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(manualTaskTemplate);
        await selectTaskTemplate.clickFirstCheckBoxInTaskTemplateSearchGrid();
        await selectTaskTemplate.clickOnCopyTaskTemplateButton();
        await copyTemplate.setTemplateName(newManualTaskTemplate);
        await copyTemplate.setNewProcessName(newProcessName);
        await copyTemplate.clickSaveCopytemplate();
        await utilCommon.waitUntilPopUpDisappear();

        await expect(await viewTaskTemplate.getTemplateStatus()).toBe('Draft');
        await expect(await viewTaskTemplate.getSummaryValue()).toBe(manualTaskSummary);
        await expect(await viewTaskTemplate.getTaskTypeValue()).toBe('Automated');
        await expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('Petramco');
        await expect(await viewTaskTemplate.gettaskDescriptionNameValue()).toBe(Description);
        await expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Applications');
        await expect(await viewTaskTemplate.getCategoryTier2Value()).toBe('Social');
        await expect(await viewTaskTemplate.getCategoryTier3Value()).toBe('Chatter');

    });

    it('DRDMV-14215: Create a Copy of an automated Task Template where New Process is created and check its execution', async () => {
        let TaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
        let TaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let processName = 'Process ' + Math.floor(Math.random() * 1000000);
        let newProcessName = 'Process ' + Math.floor(Math.random() * 1000000);

        let UpdatedTaskTemplate = 'Updated task' + Math.floor(Math.random() * 1000000);
        let UpdatedTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let Description = 'Description' + Math.floor(Math.random() * 1000000);

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplate.setTemplateName(TaskTemplate);
        await taskTemplate.setTaskSummary(TaskSummary);
        await taskTemplate.setTaskDescription(Description);
        await taskTemplate.setNewProcessName('Business Workflows', processName);
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(TaskTemplate);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await viewTaskTemplate.clickOnCopyTemplate();
        await expect(copyTemplate.getSourceProcessName()).toBe('com.bmc.dsm.bwfa:' + processName);
        await copyTemplate.setTemplateName(UpdatedTaskTemplate);
        await copyTemplate.setTaskSummary(UpdatedTaskSummary);
        await copyTemplate.selectBundles("Case Management Service");
        await copyTemplate.setNewProcessName(newProcessName);
        await copyTemplate.selectTemplateStatus('Active');
        await copyTemplate.clickSaveCopytemplate();
        await utilCommon.waitUntilPopUpDisappear();

        //Create a Case
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
        await viewCasePage.addTaskFromTaskTemplate(UpdatedTaskTemplate);
        await browser.sleep(2000);
        await manageTask.clickOnCloseButton();
        await viewCasePage.changeCaseStatus("In Progress");
        await viewCasePage.clickSaveStatus();
        await viewCasePage.goToManageTask();
        await manageTask.clickTaskLinkOnManageTask(UpdatedTaskSummary);
        await expect(viewTask.getTaskStatusValue()).toBe('Completed');
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
    });

    it('DRDMV-13737: [Negative] Try to copy Automated template with same process Name and different field data', async () => {
        let TaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
        let TaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let processName = 'Process ' + Math.floor(Math.random() * 1000000);
        let UpdatedTaskTemplate = 'Updated task' + Math.floor(Math.random() * 1000000);
        let Description = 'Description' + Math.floor(Math.random() * 1000000);

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplate.setTemplateName(TaskTemplate);
        await taskTemplate.setTaskSummary(TaskSummary);
        await taskTemplate.setTaskDescription(Description);
        await taskTemplate.setNewProcessName('Business Workflows', processName);
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(TaskTemplate);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await viewTaskTemplate.clickOnCopyTemplate();
        await copyTemplate.setTemplateName(UpdatedTaskTemplate);
        await copyTemplate.setNewProcessName(processName);
        await copyTemplate.clickSaveCopytemplate();
        await expect(utilCommon.getPopUpMessage()).toBe('Saved successfully.');
        //  await expect(utilCommon.getPopUpMessages(1)).toBe('ERROR (902): Duplicate process name com.bmc.dsm.bwfa:'+processName); 

    });

    it('DRDMV-14221: Check Error Message when trying to edit a process, where process is linked to Active Automated Task template', async () => {
        let TaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
        let TaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let processName = 'Process ' + Math.floor(Math.random() * 1000000);
        let UpdatedTaskTemplate = 'Updated task' + Math.floor(Math.random() * 1000000);
        let Description = 'Description' + Math.floor(Math.random() * 1000000);

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await taskTemplate.setTemplateName(TaskTemplate);
        await taskTemplate.setTaskSummary(TaskSummary);
        await taskTemplate.setTaskDescription(Description);
        await taskTemplate.setNewProcessName('Business Workflows', processName);
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(TaskTemplate);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await viewTaskTemplate.clickOnCopyTemplate();
        await copyTemplate.setTemplateName(UpdatedTaskTemplate);
        await copyTemplate.setNewProcessName(processName);
        await copyTemplate.clickSaveCopytemplate();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(UpdatedTaskTemplate);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await viewTaskTemplate.clickOnEditProcessLink();
        await expect(utilCommon.getPopUpMessage()).toBe('WARNING (222062): Updates to dynamic fields or process affect the templates using the selected process :' + TaskTemplate);
    });

    it('DRDMV-13574,DRDMV-13553: Fields copied while creating copy of External Task template', async () => {
        let TaskTemplate = 'External task' + Math.floor(Math.random() * 1000000);
        let TaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let UpdatedTaskTemplate = 'Updated task' + Math.floor(Math.random() * 1000000);
        let Description = 'Description' + Math.floor(Math.random() * 1000000);

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnExtrnalTaskTemplateButton();
        await taskTemplate.setTemplateName(TaskTemplate);
        await taskTemplate.setTaskSummary(TaskSummary);
        await taskTemplate.setTaskDescription(Description);
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.selectTaskCategoryTier1('Applications');
        await taskTemplate.selectTaskCategoryTier2('Social');
        await taskTemplate.selectTaskCategoryTier3('Chatter');
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(TaskTemplate);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await viewTaskTemplate.clickOnCopyTemplate();
        await copyTemplate.setTemplateName(UpdatedTaskTemplate);
        await copyTemplate.clickSaveCopytemplate();
        await expect(await viewTaskTemplate.getTemplateStatus()).toBe('Draft');
        await expect(await viewTaskTemplate.getSummaryValue()).toBe(TaskSummary);
        await expect(await viewTaskTemplate.getTaskTypeValue()).toBe('External');
        await expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('Petramco');
        await expect(await viewTaskTemplate.gettaskDescriptionNameValue()).toBe(Description);
        await expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Applications');
        await expect(await viewTaskTemplate.getCategoryTier2Value()).toBe('Social');
        await expect(await viewTaskTemplate.getCategoryTier3Value()).toBe('Chatter');
        await expect(await viewTaskTemplate.getOwnerCompanyValue()).toBe("Petramco");
        await expect(await viewTaskTemplate.getOwnerGroupValue()).toBe("Compensation and Benefits");
    });

    it('DRDMV-13547: Create a Copy of Task template by Case Business Analyst that belongs to Support Group', async () => {
        let TaskTemplate = 'External task' + Math.floor(Math.random() * 1000000);
        let TaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let UpdatedTaskTemplate = 'Updated task' + Math.floor(Math.random() * 1000000);
        let Description = 'Description' + Math.floor(Math.random() * 1000000);

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnExtrnalTaskTemplateButton();
        await taskTemplate.setTemplateName(TaskTemplate);
        await taskTemplate.setTaskSummary(TaskSummary);
        await taskTemplate.setTaskDescription(Description);
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.selectTaskCategoryTier1('Applications');
        await taskTemplate.selectTaskCategoryTier2('Social');
        await taskTemplate.selectTaskCategoryTier3('Chatter');
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.signOut();
        await loginPage.login('elizabeth');
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(TaskTemplate);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await viewTaskTemplate.clickOnCopyTemplate();
        await copyTemplate.setTemplateName(UpdatedTaskTemplate);
        await copyTemplate.clickSaveCopytemplate();
        await expect(await viewTaskTemplate.getOwnerCompanyValue()).toBe("Petramco");
        await expect(await viewTaskTemplate.getOwnerGroupValue()).toBe("Staffing");
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
    });
});

