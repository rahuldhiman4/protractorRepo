import { browser, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import taskTemplate from "../../pageobject/task/create-tasktemplate.po";
import selectTaskTemplate from "../../pageobject/task/console-tasktemplate.po"
import navigationPage from "../../pageobject/navigation.po";
import createCasePage from '../../pageobject/case/create-case.po';
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import editTask from "../../pageobject/task/edit-task.po";
import caseTaskTab from '../../pageobject/case/case-task-tab.po';
import utilCommon from '../../utils/ui/util.common';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po"
import activitytab from "../../pageobject/activity-tab.po"
import copyTemplate from "../../pageobject/task/copy-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/task/view-tasktemplate.po";
import viewCasePage from "../../pageobject/case/view-case.po"

describe('create Task template', () => {
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
    }, 180 * 1000);

    it('DRDMV-7148,DRDMV-7140: Automatic Task data validation once Task is created	', async () => {
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
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
    }, 360 * 1000);

    it('DRDMV-3820: Adhoc Task Create view (UI verification)	', async () => {
        await navigationPage.signOut();
        await loginPage.login('qtao');
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        await expect(await adhoctaskTemplate.getTaskSummaryRequiredText('required')).toBeTruthy();
        await expect(await adhoctaskTemplate.getPriorityRequiredText('required')).toBeTruthy();
        // await expect(await adhoctaskTemplate.getAssignedCompanyRequiredText('required')).toBeTruthy();
        // await expect(await adhoctaskTemplate.getAssignedGroupRequiredText('required')).toBeTruthy();

        await expect(await adhoctaskTemplate.getSaveButtonAttribute('ng-disabled')).toBeTruthy();
        await expect(adhoctaskTemplate.getStatusAttribute()).toBeTruthy();
        await expect(adhoctaskTemplate.getAssignCompanyAttribute()).toBeTruthy();
        await expect(adhoctaskTemplate.getBuisnessUnitAttribute()).toBeTruthy();
        await expect(adhoctaskTemplate.getAssigneeAttribute()).toBeTruthy();
        await expect(adhoctaskTemplate.getDepartmentAttribute()).toBeTruthy();
        await expect(adhoctaskTemplate.getAssignedGroupAttribute()).toBeTruthy();
        await expect(adhoctaskTemplate.getchangeAssignmentButtonText()).toBeTruthy();
        await expect(adhoctaskTemplate.isAssignToMeButtonDisplayd()).toBeTruthy();
        await expect(adhoctaskTemplate.ischangeAssignmentButtonDisplayed()).toBeTruthy();
        await adhoctaskTemplate.clickOnCancelAdhoctask();
        await utilCommon.clickOnWarningOk();
        await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    });

    it('DRDMV-3821: Adhoc Task details view (UI verification))	', async () => {
        await navigationPage.signOut();
        await loginPage.login('qtao');
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.selectPriority('High');
        await adhoctaskTemplate.selectCategoryTier1('Applications');
        await adhoctaskTemplate.selectCategoryTier2('Social');
        await adhoctaskTemplate.selectCategoryTier3('Chatter');
        //await adhoctaskTemplate.selectLabel('test');
        await adhoctaskTemplate.clickOnSaveAdhoctask();

        await manageTask.clickTaskLinkOnManageTask(summary);
        await expect(viewTask.isTaskSummaryDisplayed()).toBeTruthy();
        await expect(viewTask.isTaskIdTextDisplayed).toBeTruthy();
        await expect(viewTask.isTaskIconDisplayed).toBeTruthy();
        await expect(viewTask.isTaskPriorityDisplayed()).toBeTruthy();
        await expect(viewTask.isTaskTimeDetailsDisplayed()).toBeTruthy();
        await expect(viewTask.isCaseSummaryDisplayed()).toBeTruthy();
        await expect(viewTask.isRequesterNameDisplayed()).toBeTruthy();
        await expect(viewTask.isRequesterContactDisplayed()).toBeTruthy();
        await expect(viewTask.isRequesterMailDisplayed()).toBeTruthy();
        await expect(viewTask.isEditLinkDisplayed()).toBeTruthy();
        await expect(viewTask.isCategoryTier1ValueDisplayed()).toBeTruthy();
        await expect(viewTask.isCategoryTier2ValueDisplayed()).toBeTruthy();
        await expect(viewTask.isCategoryTier3ValueDisplayed()).toBeTruthy();
        await expect(viewTask.isAssigneeNameDisplayed()).toBeTruthy();
        await expect(viewTask.isAssignCompanyDisplayed()).toBeTruthy();
        await expect(viewTask.isAssignGroupTextDisplayed()).toBeTruthy();
        await expect(activitytab.isActivityTextPresent()).toBeTruthy();
        await expect(activitytab.isActivityTextPresent()).toBeTruthy();
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
    }, 150 * 1000);
});
