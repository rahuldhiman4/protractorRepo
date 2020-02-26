import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import createCasePage from '../../pageobject/case/create-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import dynamicFieldsPage from '../../pageobject/common/dynamic-fields.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import createTaskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import taskConsole from "../../pageobject/task/console-task.po";
import utilCommon from '../../utils/util.common';
import viewTaskPo from '../../pageobject/task/view-task.po';

describe('Case Data Store', () => {
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
    it('[DRDMV-13168]: [Dynamic Data] [UI] - Automated Task Template UI on create and on Edit', async () => {

        try {
            //Automation Task template
            await navigationPage.gotoCaseConsole();
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
            // await createTaskTemplate.selectTemplateStatus('Active');
            await createTaskTemplate.clickOnSaveTaskTemplate();
            await utilCommon.waitUntilPopUpDisappear();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(automatedTaskTemplate1);
            await expect(viewTaskTemplate.isEditProcessLinkDisplayed()).toBeTruthy(" Edit link in not displayed");
            await expect(viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeTruthy(" Manage link not present");
            await viewTaskTemplate.clickOnEditLink();
            await expect(viewTaskTemplate.isEditProcessLinkDisplayed()).toBeFalsy(" Edit link is displayed");
            await expect(editTaskTemplate.getTaskTypeValueAttribute('disabled')).toBeTruthy(" Attribute value is disabled");
            await expect(editTaskTemplate.isManageProcessLinkDisplayed()).toBeTruthy(" Manage process link present");
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    },100*1000);

    //ankagraw
    it('[DRDMV-13169]: [Dynamic Data] [UI] - Automated Task UI on Edit view', async () => {
        try {
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
            let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let templateData4 = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Draft",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData4);

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field Name');
            await dynamicFieldsPage.setDescriptionName('Field Description');
            await dynamicFieldsPage.clickSaveButton();
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Active");
            await editTaskTemplate.clickOnSaveMetadata();

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
            await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`)
            await manageTask.clickTaskLinkOnManageTask(`AutomatedTaskTemplateActive ${randomStr}`);
            let taskvalue = await viewTaskPo.getTaskID();

            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
            await navigationPage.gotoTaskConsole();
            await taskConsole.clearFilter();
            await taskConsole.setTaskSearchBoxValue(taskvalue);
            await taskConsole.clickFirstLinkInTaskTemplateSearchGrid();
            await expect(viewTaskTemplate.isDynamicFieldPresent('Field Description')).toBeTruthy('Field Description');
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 150 * 1000);
});