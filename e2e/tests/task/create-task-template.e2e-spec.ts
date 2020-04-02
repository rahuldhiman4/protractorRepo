import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import caseAccessTabPo from '../../pageobject/common/case-access-tab.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import consoleCasetemplatePage from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCaseTemplate from '../../pageobject/settings/case-management/create-casetemplate.po';
import viewCaseTemplate from '../../pageobject/settings/case-management/view-casetemplate.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import taskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import activityTabPo from '../../pageobject/social/activity-tab.po';
import taskConsole from "../../pageobject/task/console-task.po";
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
let filePath = '../../data/ui/attachment/bwfPdf.pdf';

describe('Create Task Template', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
    });

    //ankagraw
    it('[DRDMV-3817,DRDMV-3819]: [Task Template] Task Template Create view (UI verification)', async () => {
        try {
            let manualTaskTemplate = 'Manual  task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

            //Manual task Template
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await expect(taskTemplate.isTemplateNameRequiredText()).toBeTruthy("Template Name Required text Not Present");
            await expect(taskTemplate.isTaskSummaryRequiredText()).toBeTruthy("Task Summary Required text Not Present");
            await expect(taskTemplate.isTaskPriorityRequiredText()).toBeTruthy("Task Priority Required text Not Present");
            await expect(taskTemplate.isTemplateStatusRequiredText()).toBeTruthy('Template Status Required text Not Present');
            await expect(taskTemplate.isOwnerComapnyRequiredText()).toBeTruthy('Owner Company Required text Not Present');
            await expect(taskTemplate.isOwnerGroupRequiredText()).toBeTruthy('Owner Group Required text Not Present');
            await expect(taskTemplate.isTaskDescriptionTitlePresent('Task Description')).toBeTruthy('Task Description not present');
            await expect(taskTemplate.isTaskCategoryTier1TitlePresent('Task Category Tier 1')).toBeTruthy('Task Category Tier 1 not present');
            await expect(taskTemplate.isTaskCategoryTier2TitlePresent('Task Category Tier 2')).toBeTruthy('Task Category Tier 2 not present');
            await expect(taskTemplate.isTaskCategoryTier3TitlePresent('Task Category Tier 3')).toBeTruthy('Task Category Tier 3 not present');
            await expect(taskTemplate.isTaskCategoryTier4TitlePresent('Task Category Tier 4')).toBeTruthy('Task Category Tier 4 not present');
            await taskTemplate.setTemplateName(manualTaskTemplate);
            await taskTemplate.setTaskSummary(manualTaskSummary);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.selectTemplateStatus('Active');
            await taskTemplate.clickOnSaveTaskTemplate();
            //await utilCommon.waitUntilPopUpDisappear();
            await expect(viewTaskTemplate.isTaskSummaryTitlePresent('Task Summary')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskTypeTitlePresent('Task Type')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskCompanyTitlePresent('Task Company')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskCategoryTier1TitlePresent('Task Category Tier 1')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskCategoryTier2TitlePresent('Task Category Tier 2')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskCategoryTier3TitlePresent('Task Category Tier 3')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskCategoryTier4TitlePresent('Task Category Tier 4')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskLabelTitlePresent('Label')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskDescriptionTitlePresent('Task Description')).toBeTruthy();
            await expect(viewTaskTemplate.isTemplateStatusTitlePresent('Status')).toBeTruthy();
            await expect(viewTaskTemplate.isOwnerCompanyTitlePresent('Owner Company')).toBeTruthy();
            await expect(viewTaskTemplate.isOwnerGroupTitlePresent('Owner Group')).toBeTruthy();
            await expect(viewTaskTemplate.isAssigneeTitlePresent('Assignee')).toBeTruthy();
            await expect(viewTaskTemplate.isSupportGuidTitlePresent('Support Group')).toBeTruthy();
            await expect(viewTaskTemplate.isEditButtonPresent()).toBeTruthy();
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });

    //ankagraw
    it('[DRDMV-12087]: [Global Task Template] Update Task company to Global', async () => {
        try {
            let manualTaskTemplate = 'Manual  task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

            //Manual task Template
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName(manualTaskTemplate);
            await taskTemplate.setTaskSummary(manualTaskSummary);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.clickOnSaveTaskTemplate();
            //await utilCommon.waitUntilPopUpDisappear();
            await viewTaskTemplate.clickOnEditLink();
            await editTaskTemplate.selectTaskCompany('Global');
            await editTaskTemplate.clickOnSaveButton();
            await expect(viewTaskTemplate.getTaskCompanyNameValue()).toBe('- Global -');
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });

    //ankagraw
    it('[DRDMV-12086]: [Global Task Template] Update Task company from Global to Any', async () => {
        try {
            let manualTaskTemplate = 'Manual  task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

            //Manual task Template
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName(manualTaskTemplate);
            await taskTemplate.setTaskSummary(manualTaskSummary);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Global');
            await taskTemplate.clickOnSaveTaskTemplate();
            //await utilCommon.waitUntilPopUpDisappear();
            await expect(viewTaskTemplate.getTaskCompanyNameValue()).toBe('- Global -');
            await viewTaskTemplate.clickOnEditLink();
            await editTaskTemplate.selectTaskCompany('Petramco');
            await editTaskTemplate.clickOnSaveButtonWithoutWait();
            await expect(utilCommon.getPopUpMessage()).toBe('ERROR (222121): Company marked for Global usage cannot be modified.')
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });

    //ankagraw
    it('[DRDMV-12577]: Case BA other than task template owner group can NOT update the template', async () => {
        try {
            let manualTaskTemplate = 'Manual task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

            //Manual task Template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName(manualTaskTemplate);
            await taskTemplate.setTaskSummary(manualTaskSummary);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.selectTemplateStatus('Active');
            await taskTemplate.clickOnSaveTaskTemplate();
            await expect(viewTaskTemplate.getTemplateName()).toBe(manualTaskTemplate);
            //await utilCommon.waitUntilPopUpDisappear();

            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(manualTaskTemplate);
            await editTaskTemplate.clickOnEditMetadataLink();
            await expect(editTaskTemplate.isTemplateStatusDisabled()).toBeTruthy("Template status is enabled");
            await editTaskTemplate.clickOnCancelMetadataButton();
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 180 * 1000);

    //ankagraw
    it('[DRDMV-12567]: Case BA from task template owner group can update the template', async () => {
        try {
            let manualTaskTemplate = 'Manual task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
            let updateSummary = 'update Summary' + Math.floor(Math.random() * 1000000);
            let Description = 'Description' + Math.floor(Math.random() * 1000000);

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
            //await utilCommon.waitUntilPopUpDisappear();

            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(manualTaskTemplate);
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Draft");
            await editTaskTemplate.clickOnSaveMetadata();
            await utilCommon.waitUntilPopUpDisappear();
            await viewTaskTemplate.clickOnEditLink();
            await editTaskTemplate.setSummary(updateSummary);
            await editTaskTemplate.setDescription(Description);
            await editTaskTemplate.selectTaskCategoryTier1('Applications');
            await editTaskTemplate.selectTaskCategoryTier2('Social');
            await editTaskTemplate.clickOnSaveButton();

            //verify the updated Field
            await expect(viewTaskTemplate.getSummaryValue()).toBe(updateSummary);
            await expect(viewTaskTemplate.getTaskDescriptionNameValue()).toBe(Description);
            await expect(viewTaskTemplate.getCategoryTier1Value()).toBe("Applications");
            await expect(viewTaskTemplate.getCategoryTier2Value()).toBe("Social");
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 150 * 1000);

    //ankagraw
    it('[DRDMV-12555]: Task template submitter from same company of owner group can edit the task template', async () => {
        try {
            let manualTaskTemplate = 'Manual task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
            let updateSummary = 'update Summary' + Math.floor(Math.random() * 1000000);
            let Description = 'Description' + Math.floor(Math.random() * 1000000);

            //Manual task Template
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName(manualTaskTemplate);
            await taskTemplate.setTaskSummary(manualTaskSummary);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.selectOwnerGroup("Facilities")
            await taskTemplate.clickOnSaveTaskTemplate();
            //await utilCommon.waitUntilPopUpDisappear();

            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(manualTaskTemplate);
            await viewTaskTemplate.clickOnEditLink();
            await editTaskTemplate.setSummary(updateSummary);
            await editTaskTemplate.setDescription(Description);
            await editTaskTemplate.selectTaskCategoryTier1('Applications');
            await editTaskTemplate.selectTaskCategoryTier2('Social');
            await editTaskTemplate.clickOnSaveButton();

            //verify the updated Field
            await expect(viewTaskTemplate.getSummaryValue()).toBe(updateSummary);
            await expect(viewTaskTemplate.getTaskDescriptionNameValue()).toBe(Description);
            await expect(viewTaskTemplate.getCategoryTier1Value()).toBe("Applications");
            await expect(viewTaskTemplate.getCategoryTier2Value()).toBe("Social");
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 180 * 1000);

    async function foundationData(company: string) {
        const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
        const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
        const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
        const personDataFile = require('../../data/ui/foundation/person.ui.json');
        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile['BusinessUnitData12111'];
        let departmentData = departmentDataFile['DepartmentData12111'];
        let suppGrpData = supportGrpDataFile['SuppGrpData12111'];
        let personData = personDataFile['PersonData12111'];
        let orgId = await apiCoreUtil.getOrganizationGuid(company);
        businessData.relatedOrgId = orgId;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await apiHelper.createNewUser(personData);
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId, company)
    }

    it('[DRDMV-12111,DRDMV-12110,DRDMV-12109]: Verify Company, Business Unit, Department and Support Group selection hierarchy in Change Owner.', async () => {
        await foundationData("Petramco");
        const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
        const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
        const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
        let randomStr = 'Manual  task' + Math.floor(Math.random() * 1000000);
        let businessData = businessDataFile['BusinessUnitData12111'];
        let departmentData = departmentDataFile['DepartmentData12111'];
        let suppGrpData = supportGrpDataFile['SuppGrpData12111'];

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await consoleCasetemplatePage.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName("caseTemplateName" + randomStr);
        await createCaseTemplate.setCompanyName("Petramco");
        await createCaseTemplate.setCaseSummary("caseTemplateSummary1" + randomStr);
        await createCaseTemplate.setOwnerCompanyValue("Petramco");
        await createCaseTemplate.setBusinessUnitDropdownValue(businessData.orgName);
        await createCaseTemplate.setDepartmentDropdownValue(departmentData.orgName);
        await createCaseTemplate.setOwnerGroupDropdownValue(suppGrpData.orgName);
        await createCaseTemplate.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getOwnerCompanyValue()).toBe("Petramco");
        expect(await viewCaseTemplate.getOwnerGroupValue()).toBe(suppGrpData.orgName);
        expect(await viewCaseTemplate.getBuisnessUnitValue()).toBe(businessData.orgName);
        expect(await viewCaseTemplate.getDepartmentValue()).toBe(departmentData.orgName);

        //Manual task Template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplate.setTemplateName('manualTaskTemplate' + randomStr);
        await taskTemplate.setTaskSummary('manualTaskSummary' + randomStr);
        await taskTemplate.setTaskDescription('Description in manual task');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.selectBuisnessUnit(businessData.orgName);
        await taskTemplate.selectDepartment(departmentData.orgName);
        await taskTemplate.selectOwnerGroup(suppGrpData.orgName)
        await taskTemplate.clickOnSaveTaskTemplate();
        await expect(viewTaskTemplate.getOwnerCompanyValue()).toBe('Petramco');
        await expect(viewTaskTemplate.getOwnerGroupValue()).toBe(suppGrpData.orgName);
        await expect(viewTaskTemplate.getBuisnessunitValue()).toBe(businessData.orgName);
        await expect(viewTaskTemplate.getDepartmentValue()).toBe(departmentData.orgName);
    }, 180 * 1000);

    it('[DRDMV-7151]: [Automatic Task] - Automatic Task: Social: System Comments', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        var templateData4 = {
            "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
        }

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createAutomatedTaskTemplate(templateData4);

        //Create a Case
        await navigationPage.signOut();
        await loginPage.login('qtao');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + randomStr);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePage.clickAddTaskButton();

        //Add Automation Task templates in Case
        await manageTask.addTaskFromTaskTemplate(templateData4.templateSummary);
        await manageTask.clickTaskLinkOnManageTask(templateData4.templateSummary);
        await expect(viewTask.isTaskIdTextDisplayed()).toBeTruthy("Task Id Not Displayed")
        await viewTask.clickOnViewCase();
        await updateStatusBladePo.changeCaseStatus('In Progress');
        await updateStatusBladePo.clickSaveStatus();
        await updateStatusBladePo.changeCaseStatus('Resolved');
        await updateStatusBladePo.setStatusReason('Auto Resolved');
        await updateStatusBladePo.clickSaveStatus();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(templateData4.templateSummary);
        await activityTabPo.getFirstPostContent();
        await expect(viewTask.getTaskStatusValue()).toBe("Completed");
        await expect(activityTabPo.getTaskActivity('Assigned')).toBe('Assigned');
        await expect(activityTabPo.getTaskActivity('In Progress')).toBe('In Progress');
        await expect(activityTabPo.getTaskActivity('Completed')).toBe('Completed');
    });

    it('[DRDMV-5326]: [Permission] [Task Template] Access to Activity Feed records of the Task created using template', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        let taskTemplateName = 'taskTemplateWithYesResolve' + randomStr;
        let taskTemplateSummary = 'taskSummaryYesResolved' + randomStr;
        let taskTemplateDataSet = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${taskTemplateSummary}`,
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
        //Create a Case
        await navigationPage.signOut();
        await loginPage.login('qtao');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary DRDMV-5326' + randomStr);
        await createCasePage.clickChangeAssignmentButton();
        await changeAssignmentBladePo.selectCompany('Petramco');
        await changeAssignmentBladePo.selectSupportGroup('Employee Relations');
        await changeAssignmentBladePo.selectAssigneeAsSupportGroup('Employee Relations');
        await changeAssignmentBladePo.clickOnAssignButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        let caseId = await viewCasePage.getCaseID();
        //await viewCasePage.clickAddTaskButton();

        //Add Automation Task templates in Case
        await viewCasePage.clickOnTab('Case Access');
        await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
        await caseAccessTabPo.selectCompany('Petramco');
        await caseAccessTabPo.selectSupportGroup('Staffing');
        await viewCasePage.clickOnTab('Tasks');
        await viewCasePage.clickAddTaskButton();

        //Add Automation Task templates in Case
        await manageTask.clickTaskLinkOnManageTask(`${taskTemplateSummary}`);
        await expect(viewTask.isTaskIdTextDisplayed()).toBeTruthy("Task Id Not Displayed")
        await viewTask.clickOnViewCase();
        await updateStatusBladePo.changeCaseStatus('In Progress');
        await updateStatusBladePo.clickSaveStatus();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`${taskTemplateSummary}`);
        await activityTabPo.getFirstPostContent();
        await viewTask.clickOnEditTask();
        await editTaskPo.clickOnChangeAssignementButton();
        await changeAssignmentBladePo.selectCompany('Petramco');
        await changeAssignmentBladePo.selectSupportGroup('Risk Management');
        await changeAssignmentBladePo.clickOnAssignButton();
        await expect(activityTabPo.getTaskActivity('Risk Management')).toBe('Risk Management');
        await activityTabPo.addActivityNote("abcde");
        await activityTabPo.clickOnPostButton();
        await expect(activityTabPo.getTaskActivity('abcde')).toBe('abcde');
        await activityTabPo.addActivityNote("attachment");
        await activityTabPo.addAttachment(filePath);
        await activityTabPo.clickOnPostButton();
        await expect(activityTabPo.getTaskActivity('attachment')).toBe('attachment');
        await navigationPage.signOut();
        await loginPage.login('qcolumbcille');
        await navigationPage.gotoTaskConsole();
        await utilGrid.clearFilter();
        await taskConsole.setTaskSearchBoxValue(taskTemplateName);
        await expect(taskConsole.isCaseIdLinkIsPresent()).toBeFalsy(" Case Id Displayed in Task console");
        await taskConsole.clickFirstLinkInTaskTemplateSearchGrid();
        await expect(activityTabPo.getTaskActivity('attachment')).toBe('attachment');
        await expect(activityTabPo.getTaskActivity('abcde')).toBe('abcde');
        await navigationPage.signOut();
        await loginPage.login('qliu');
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(caseId);
        await viewCasePage.clickEditCaseButton();
        await editCasePo.clickChangeAssignmentButton();
        await changeAssignmentBladePo.selectCompany('Petramco');
        await changeAssignmentBladePo.selectSupportGroup('Facilities');
        await changeAssignmentBladePo.selectAssigneeAsSupportGroup('Facilities');
        await changeAssignmentBladePo.clickOnAssignButton();
        await editCasePo.clickSaveCase();
        await viewCasePage.openTaskCard(1);
        await manageTask.clickTaskLinkOnManageTask(`${taskTemplateSummary}`);
        await expect(activityTabPo.getTaskActivity('attachment')).toBe('attachment');
        await expect(activityTabPo.getTaskActivity('abcde')).toBe('abcde');
    }, 240 * 1000);

    //ankagraw
    it('[DRDMV-3768]: [Task Template Console] Filter menu verification', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateName = 'taskTemplateWithYesResolve' + randomStr;
        let taskTemplateSummary = 'taskSummaryYesResolved' + randomStr;
        let createdDate = new Date();
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        var dateFormate = month[createdDate.getMonth()] + " " + createdDate.getDate() + ", " + createdDate.getFullYear() + " " + createdDate.toLocaleTimeString();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplate.setTemplateName(taskTemplateName);
        await taskTemplate.setTaskSummary(taskTemplateSummary);
        await taskTemplate.setTaskDescription('Description in manual task');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.clickOnSaveTaskTemplate();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(taskTemplateName);
        let taskTemplateId = await viewTaskTemplate.getTaskTemplateId();
        await editTaskTemplate.clickOnEditMetadataLink();
        await editTaskTemplate.selectTemplateStatus('Draft');
        await editTaskTemplate.clickOnSaveMetadata();
        let modifiedDate = new Date();
        let modifiedDateFormate = month[modifiedDate.getMonth()] + " " + modifiedDate.getDate() + ", " + modifiedDate.getFullYear() + " " + modifiedDate.toLocaleTimeString();

        let addColoumn: string[] = ['Display ID'];
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.clearFilter();
        await selectTaskTemplate.addColumn(addColoumn);
        await utilGrid.addFilter("Support Group", 'Compensation and Benefits', 'text');
        expect(await utilGrid.isGridRecordPresent('Compensation and Benefits')).toBeTruthy('Compensation and Benefits not present');
        await utilGrid.clearFilter();
        await utilGrid.addFilter("Modified Date", dateFormate + ":" + modifiedDateFormate, 'date');
        expect(await utilGrid.isGridRecordPresent(`${taskTemplateName}`)).toBeTruthy(`${taskTemplateName}`);
        await utilGrid.clearFilter();
        await utilGrid.addFilter("Template Name", 'Code of Conduct', 'text');
        expect(await utilGrid.isGridRecordPresent('Code of Conduct')).toBeTruthy('Code of Conduct not present');
        await utilGrid.clearFilter();
        await utilGrid.addFilter("Task Category Tier 1", 'Total Rewards', 'text');
        expect(await utilGrid.isGridRecordPresent('Total Rewards')).toBeTruthy('Total Rewards not present');
        await utilGrid.clearFilter();
        await utilGrid.addFilter("Template Status", 'Active', 'checkbox');
        expect(await utilGrid.isGridRecordPresent('Active')).toBeTruthy('Active not present');
        await utilGrid.clearFilter();
        await utilGrid.addFilter("Template Status", 'Draft', 'checkbox');
        expect(await utilGrid.isGridRecordPresent('Draft')).toBeTruthy('Draft not present');
        await utilGrid.clearFilter();
        await utilGrid.addFilter("Template Status", 'Inactive', 'checkbox');
        expect(await utilGrid.isGridRecordPresent('Inactive')).toBeTruthy('Active not present');
        await utilGrid.clearFilter();
        await utilGrid.addFilter("Display ID", taskTemplateId, 'text');
        expect(await utilGrid.isGridRecordPresent(taskTemplateId)).toBeTruthy(taskTemplateId + '  not present');
        await utilGrid.clearFilter();
    }, 150 * 1000);
});