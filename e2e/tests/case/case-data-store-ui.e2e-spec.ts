import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import createTaskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import utilCommon from '../../utils/util.common';
import dynamicFieldsPage from '../../pageobject/common/dynamic-fields.po';
import createCasePage from '../../pageobject/case/create-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";

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
    it('DRDMV-13168: [Dynamic Data] [UI] - Automated Task Template UI on create and on Edit', async () => {

        //Automation Task template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
        await expect(createTaskTemplate.isAddTaskTemplateTitleDisplayed('Add Task Template')).toBeTruthy('Add Task Template Title not displayed');
        await expect(createTaskTemplate.isTemplateMetadataTitleDisplayed('Template Metadata')).toBeTruthy('Template Metadata Title not displayed');
        await expect(createTaskTemplate.isTemplateNameRequiredText()).toBeTruthy("Template Name Required text Not Present");
        await expect(createTaskTemplate.isCreateNewProcessRequiredText()).toBeTruthy("CreateNewProcess Required text Not Present");
        await expect(createTaskTemplate.isNewProcessNameRequiredText()).toBeTruthy("NewProcessName Required text Not Present");
        await expect(createTaskTemplate.isProcessBundleIdRequiredText()).toBeTruthy("ProcessBundleId Required text Not Present");
        await expect(createTaskTemplate.isTaskSummaryRequiredText()).toBeTruthy("Task Summary Required text Not Present");
        await expect(createTaskTemplate.isTaskPriorityRequiredText()).toBeTruthy("Task Priority Required text Not Present");
        await expect(createTaskTemplate.isTemplateStatusRequiredText()).toBeTruthy('Template Status Required text Not Present');
        await expect(createTaskTemplate.isOwnerComapnyRequiredText()).toBeTruthy('Owner Company Required text Not Present');
        await expect(createTaskTemplate.isOwnerGroupRequiredText()).toBeTruthy('Owner Group Required text Not Present');
        await expect(createTaskTemplate.isTaskDescriptionTitlePresent('Task Description')).toBeTruthy('Task Description not present');
        await expect(createTaskTemplate.isTaskCategoryTier1TitlePresent('Task Category Tier 1')).toBeTruthy('Task Category Tier 1 not present');
        await expect(createTaskTemplate.isTaskCategoryTier2TitlePresent('Task Category Tier 2')).toBeTruthy('Task Category Tier 2 not present');
        await expect(createTaskTemplate.isTaskCategoryTier3TitlePresent('Task Category Tier 3')).toBeTruthy('Task Category Tier 3 not present');
        await expect(createTaskTemplate.isTaskCategoryTier4TitlePresent('Task Category Tier 4')).toBeTruthy('Task Category Tier 4 not present');
        await createTaskTemplate.setcreateNewProcess(false);
        await expect(createTaskTemplate.isProcessTitlePresent("New Process Name")).toBeFalsy("New Process Title Present");
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let automatedTaskTemplate1 = 'Automation Task1 ' + randomStr;
        let automatedTaskSummary1 = 'Automation Summary1 ' + randomStr;
        let processName = 'Process Name ' + randomStr;

        await createTaskTemplate.setTemplateName(automatedTaskTemplate1);
        await createTaskTemplate.setTaskSummary(automatedTaskSummary1);
        await createTaskTemplate.setTaskDescription('Description in manual task');
        await createTaskTemplate.selectCompanyByName('Petramco');
        await createTaskTemplate.setNewProcessName('Business Workflows', processName);
        await createTaskTemplate.selectTemplateStatus('Active');
        await createTaskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.setTaskSearchBoxValue(`AutomatedTaskTemplateActive ${randomStr}`);
        await selectTaskTemplate.clickFirstLinkInTaskTemplateSearchGrid();
        await expect(viewTaskTemplate.isEditProcessLinkDisplayed()).toBeTruthy();
        await expect(viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeTruthy();
        await viewTaskTemplate.clickOnEditLink();
        await expect(viewTaskTemplate.isEditProcessLinkDisplayed()).toBeFalsy();
        await expect(editTaskTemplate.getTaskTypeValueAttribute('disabled')).toBeTruthy();
        await expect(editTaskTemplate.isManageProcessLinkDisplayed()).toBeTruthy();
    });

});