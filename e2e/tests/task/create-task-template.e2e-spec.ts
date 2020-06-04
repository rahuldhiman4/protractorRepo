import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import attachDocumentBladePo from '../../pageobject/common/attach-document-blade.po';
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
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Create Task Template', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    async function foundationData12111(company: string) {
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

    //ankagraw
    describe('[DRDMV-3817,DRDMV-3819]: [Task Template] Task Template Create view (UI verification)', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        it('Create Manual Task template', async () => {
            //Manual task Template
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            expect(await taskTemplate.isTemplateNameRequiredText()).toBeTruthy("Template Name Required text Not Present");
            expect(await taskTemplate.isTaskSummaryRequiredText()).toBeTruthy("Task Summary Required text Not Present");
            expect(await taskTemplate.isTaskPriorityRequiredText()).toBeTruthy("Task Priority Required text Not Present");
            expect(await taskTemplate.isTemplateStatusRequiredText()).toBeTruthy('Template Status Required text Not Present');
            expect(await taskTemplate.isOwnerComapnyRequiredText()).toBeTruthy('Owner Company Required text Not Present');
            expect(await taskTemplate.isOwnerGroupRequiredText()).toBeTruthy('Owner Group Required text Not Present');
            expect(await taskTemplate.isTaskDescriptionTitlePresent('Task Description')).toBeTruthy('Task Description not present');
            expect(await taskTemplate.isTaskCategoryTier1TitlePresent('Task Category Tier 1')).toBeTruthy('Task Category Tier 1 not present');
            expect(await taskTemplate.isTaskCategoryTier2TitlePresent('Task Category Tier 2')).toBeTruthy('Task Category Tier 2 not present');
            expect(await taskTemplate.isTaskCategoryTier3TitlePresent('Task Category Tier 3')).toBeTruthy('Task Category Tier 3 not present');
            expect(await taskTemplate.isTaskCategoryTier4TitlePresent('Task Category Tier 4')).toBeTruthy('Task Category Tier 4 not present');
            await taskTemplate.setTemplateName("manualTaskTemplate" + randomStr);
            await taskTemplate.setTaskSummary("manualTaskSummary" + randomStr);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.selectTemplateStatus('Active');
            await taskTemplate.clickOnSaveTaskTemplate();
        });
        it('[DRDMV-3817,DRDMV-3819]: [Task Template] Task Template Create view (UI verification)', async () => {
            //await utilCommon.waitUntilPopUpDisappear();
            expect(await viewTaskTemplate.isTaskSummaryTitlePresent('Task Summary')).toBeTruthy();
            expect(await viewTaskTemplate.isTaskTypeTitlePresent('Task Type')).toBeTruthy();
            expect(await viewTaskTemplate.isTaskCompanyTitlePresent('Task Company')).toBeTruthy();
            expect(await viewTaskTemplate.isTaskCategoryTier1TitlePresent('Task Category Tier 1')).toBeTruthy();
            expect(await viewTaskTemplate.isTaskCategoryTier2TitlePresent('Task Category Tier 2')).toBeTruthy();
            expect(await viewTaskTemplate.isTaskCategoryTier3TitlePresent('Task Category Tier 3')).toBeTruthy();
            expect(await viewTaskTemplate.isTaskCategoryTier4TitlePresent('Task Category Tier 4')).toBeTruthy();
            expect(await viewTaskTemplate.isTaskLabelTitlePresent('Label')).toBeTruthy();
            expect(await viewTaskTemplate.isTaskDescriptionTitlePresent('Task Description')).toBeTruthy();
            expect(await viewTaskTemplate.isTemplateStatusTitlePresent('Status')).toBeTruthy();
            expect(await viewTaskTemplate.isOwnerCompanyTitlePresent('Owner Company')).toBeTruthy();
            expect(await viewTaskTemplate.isOwnerGroupTitlePresent('Owner Group')).toBeTruthy();
            expect(await viewTaskTemplate.isAssigneeTitlePresent('Assignee')).toBeTruthy();
            expect(await viewTaskTemplate.isSupportGuidTitlePresent('Support Group')).toBeTruthy();
            expect(await viewTaskTemplate.isEditButtonPresent()).toBeTruthy();
        });
    });

    //ankagraw
    it('[DRDMV-12087,DRDMV-12086]: [Global Task Template] Update Task company to Global', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        //Manual task Template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplate.setTemplateName('manualTaskTemplate' + randomStr);
        await taskTemplate.setTaskSummary("manualTaskSummary" + randomStr);
        await taskTemplate.setTaskDescription('Description in manual task');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.clickOnSaveTaskTemplate();
        await viewTaskTemplate.clickOnEditLink();
        await editTaskTemplate.selectTaskCompany('Global');
        await editTaskTemplate.clickOnSaveButton();
        expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('- Global -');
        await viewTaskTemplate.clickOnEditLink();
        await editTaskTemplate.selectTaskCompany('Petramco');
        await editTaskTemplate.clickOnSaveButton();
        expect(await utilCommon.isPopUpMessagePresent('ERROR (222121): Company marked for Global usage cannot be modified.')).toBeTruthy();
    });

    //ankagraw
    it('[DRDMV-12577]: Case BA other than task template owner group can NOT update the template', async () => {
        try {
            let randomStr = Math.floor(Math.random() * 1000000);
            let templateData1 = {
                "templateName": 'manualTaskTemplate' + randomStr,
                "templateSummary": 'manualTaskSummary' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData1);

            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate('manualTaskTemplate' + randomStr);
            await editTaskTemplate.clickOnEditMetadataLink();
            expect(await editTaskTemplate.isTemplateStatusDisabled()).toBeTruthy("Template status is enabled");
            await editTaskTemplate.clickOnCancelMetadataButton();
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });

    //ankagraw
    describe('[DRDMV-12567]: Case BA from task template owner group can update the template', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        beforeAll(async () => {
            //Manual task Template
            let templateData1 = {
                "templateName": 'manualTaskTemplate' + randomStr,
                "templateSummary": 'manualTaskSummary' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData1);
        });
        it('Create Manual Task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate('manualTaskTemplate' + randomStr);
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Draft");
            await editTaskTemplate.clickOnSaveMetadata();
        });
        it('[DRDMV-12567]: Create Manual Task template', async () => {
            await viewTaskTemplate.clickOnEditLink();
            await editTaskTemplate.setSummary('updateSummary' + randomStr);
            await editTaskTemplate.setDescription('Description' + randomStr);
            await editTaskTemplate.selectTaskCategoryTier1('Applications');
            await editTaskTemplate.selectTaskCategoryTier2('Social');
            await editTaskTemplate.clickOnSaveButton();
            //verify the updated Field
            expect(await viewTaskTemplate.getSummaryValue()).toBe('updateSummary' + randomStr);
            expect(await viewTaskTemplate.getTaskDescriptionNameValue()).toBe('Description' + randomStr);
            expect(await viewTaskTemplate.getCategoryTier1Value()).toBe("Applications");
            expect(await viewTaskTemplate.getCategoryTier2Value()).toBe("Social");
        });
    });

    //ankagraw
    it('[DRDMV-12555]: Task template submitter from same company of owner group can edit the task template', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        //Manual task Template
        let templateData1 = {
            "templateName": 'manualTaskTemplate' + randomStr,
            "templateSummary": 'manualTaskSummary' + randomStr,
            "templateStatus": "Draft",
            "taskCompany": 'Petramco',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "United States Support",
            "ownerGroup": "US Support 3"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createManualTaskTemplate(templateData1);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate('manualTaskTemplate' + randomStr)
        await viewTaskTemplate.clickOnEditLink();
        await editTaskTemplate.setSummary('updateSummary' + randomStr);
        await editTaskTemplate.setDescription('Description' + randomStr);
        await editTaskTemplate.selectTaskCategoryTier1('Applications');
        await editTaskTemplate.selectTaskCategoryTier2('Social');
        await editTaskTemplate.clickOnSaveButton();
        //verify the updated Field
        expect(await viewTaskTemplate.getSummaryValue()).toBe('updateSummary' + randomStr);
        expect(await viewTaskTemplate.getTaskDescriptionNameValue()).toBe('Description' + randomStr);
        expect(await viewTaskTemplate.getCategoryTier1Value()).toBe("Applications");
        expect(await viewTaskTemplate.getCategoryTier2Value()).toBe("Social");
    });//, 220 * 1000);

    describe('[DRDMV-12111,DRDMV-12110,DRDMV-12109]: Verify Company, Business Unit, Department and Support Group selection hierarchy in Change Owner.', async () => {
        const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
        const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
        const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
        let randomStr = 'Manual  task' + Math.floor(Math.random() * 1000000);
        let businessData = businessDataFile['BusinessUnitData12111'];
        let departmentData = departmentDataFile['DepartmentData12111'];
        let suppGrpData = supportGrpDataFile['SuppGrpData12111'];
        beforeAll(async () => {
            await foundationData12111("Petramco");
        });
        it('Create Case tempate template', async () => {
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
        });
        it('[DRDMV-12111,DRDMV-12110,DRDMV-12109]:Create Manual Task template', async () => {
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
            expect(await viewTaskTemplate.getOwnerCompanyValue()).toBe('Petramco');
            expect(await viewTaskTemplate.getOwnerGroupValue()).toBe(suppGrpData.orgName);
            expect(await viewTaskTemplate.getBuisnessunitValue()).toBe(businessData.orgName);
            expect(await viewTaskTemplate.getDepartmentValue()).toBe(departmentData.orgName);
        });
    });

    describe('[DRDMV-7151]: [Automatic Task] - Automatic Task: Social: System Comments', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData = {
            "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateSummary": `SummaryAutomatedTaskTemplate ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
        });
        //Create a Case
        it('Assign task on case', async () => {
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
            await manageTask.addTaskFromTaskTemplate(templateData.templateSummary);
            await manageTask.clickTaskLink(templateData.templateSummary);
            expect(await viewTask.isTaskIdTextDisplayed()).toBeTruthy("Task Id Not Displayed")
            await viewTask.clickOnViewCase();
        });
        it('[DRDMV-7151]: Assign task on case', async () => {
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.waitUntilPopUpDisappear();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLink(templateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toContain('Completed');
            expect(await activityTabPo.getAllTaskActivity('Completed')).toContain('Completed');
            expect(await activityTabPo.getTaskActivity('Assigned')).toContain('Assigned');
            expect(await activityTabPo.getTaskActivity('In Progress')).toContain('In Progress');
            await viewTask.clickOnViewCase();
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.waitUntilPopUpDisappear();
            expect(await viewTaskTemplate.isEditButtonPresent()).toBeTruthy();

        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ankagraw
    describe('[DRDMV-3768]: [Task Template Console] Filter menu verification', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateName = 'taskTemplateWithYesResolve' + randomStr;
        let taskTemplateSummary = 'taskSummaryYesResolved' + randomStr;
        let createdDate = new Date();
        let month = new Array();
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
        let dateFormateValue: string = month[createdDate.getMonth()];
        let dateFormateNew: string = dateFormateValue.substring(0, 3);
        let dateFormate: string = dateFormateNew + " " + createdDate.getDate() + ", " + createdDate.getFullYear() + " " + createdDate.toLocaleTimeString();
        let taskTemplateId = '';
        it('Create task template ', async () => {
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
        });
        it('Created task template and change the status of it', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(taskTemplateName);
            let taskTemplateId = await viewTaskTemplate.getTaskTemplateId();
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus('Draft');
            await editTaskTemplate.clickOnSaveMetadata();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(taskTemplateName);
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus('Inactive');
            await editTaskTemplate.clickOnSaveMetadata();
        });
        let modifiedDate = new Date();
        let monthValue: string = month[modifiedDate.getMonth()];
        let modifiedMonthValue = monthValue.substring(0, 3);
        let modifiedDateFormate = modifiedMonthValue + " " + modifiedDate.getDate() + ", " + modifiedDate.getFullYear() + " " + modifiedDate.toLocaleTimeString();
        it('Apply Filter Options', async () => {
            let addColoumn: string[] = ['Display ID'];
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await utilGrid.clearFilter();
            await selectTaskTemplate.addColumn(addColoumn);
            await utilGrid.addFilter("Support Group", 'Compensation and Benefits', 'text');
            expect(await utilGrid.isGridRecordPresent('Compensation and Benefits')).toBeTruthy('Compensation and Benefits not present');
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Modified Date", dateFormate + "-" + modifiedDateFormate, 'date');
            expect(await utilGrid.isGridRecordPresent(taskTemplateName)).toBeTruthy(taskTemplateName);
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Template Name", 'Code of Conduct', 'text');
            expect(await utilGrid.isGridRecordPresent('Code of Conduct')).toBeTruthy('Code of Conduct not present');
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Task Category Tier 1", 'Total Rewards', 'text');
            expect(await utilGrid.isGridRecordPresent('Total Rewards')).toBeTruthy('Total Rewards not present');
        });
        it('[DRDMV-3768]: Apply Filter Options and verify remaining fields', async () => {
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Template Status", 'Active', 'checkbox');
            expect(await utilGrid.isGridRecordPresent('Active')).toBeTruthy('Active not present');
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Template Status", 'Draft', 'checkbox');
            expect(await utilGrid.isGridRecordPresent('Draft')).toBeTruthy('Draft not present');
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Template Status", 'Inactive', 'checkbox');
            expect(await utilGrid.isGridRecordPresent('Inactive')).toBeTruthy('Inactive not present');
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Display ID", taskTemplateId, 'text');
            expect(await utilGrid.isGridRecordPresent(taskTemplateId)).toBeTruthy(taskTemplateId + '  not present');
            await utilGrid.clearFilter();
        });
    });

    //ankagraw
    describe('[DRDMV-5326]: [Permission] [Task Template] Access to Activity Feed records of the Task created using template	', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateName = 'taskTemplateWithYesResolve' + randomStr;
        let taskTemplateSummary = 'taskSummaryYesResolved' + randomStr;
        let taskID, CaseId = '';
        beforeAll(async () => {
            let manualTaskTemplateData = {
                "templateName": taskTemplateName,
                "templateSummary": taskTemplateSummary,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            let publishDocData = {
                docLibTitle: 'drdmv3768_document',
                company: 'Petramco',
                businessUnit: 'United States Support',
                ownerGroup: 'US Support 3',
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib = await apiHelper.createDocumentLibrary(publishDocData, 'e2e/data/ui/attachment/bwfJpg.jpg');
            await apiHelper.publishDocumentLibrary(docLib);
        });
        it('Create case with different Assignment', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + randomStr);
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectCompany('Petramco');
            await changeAssignmentBladePo.selectBusinessUnit('HR Support');
            await changeAssignmentBladePo.selectSupportGroup('Workforce Administration');
            await changeAssignmentBladePo.selectAssignee('Peter Kahn');
            await changeAssignmentBladePo.clickOnAssignButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            CaseId = await viewCasePage.getCaseID();
            await viewCasePage.clickOnTab('Case Access');
            await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
            await caseAccessTabPo.selectCompany('Petramco', 'Select Company');
            await caseAccessTabPo.selectBusinessUnit('United States Support', 'Select Business Unit');
            await caseAccessTabPo.selectSupportGroup('US Support 1', 'Select Support Group');
            await caseAccessTabPo.selectSupportGroupWriteAccess();
            await caseAccessTabPo.clickOnReadAccessAddButton('Add Support Group');
        });
        it('Create case with different Assignment and added task on it', async () => {
            await viewCasePage.clickOnTab('Tasks');
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(taskTemplateName);
            await manageTask.clickCloseButton();
            await updateStatusBladePo.changeCaseStatus("In Progress");
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(taskTemplateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe('Assigned');
            taskID = await viewTask.getTaskID();
            await activityTabPo.getTaskActivity('Assigned');
            await viewTask.clickOnEditTask();
            await editTaskPo.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectCompany('Petramco');
            await changeAssignmentBladePo.selectBusinessUnit('HR Support');
            await changeAssignmentBladePo.selectSupportGroup('Workforce Administration');
            await changeAssignmentBladePo.selectAssignee("Peter Kahn");
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTaskPo.clickOnSaveButton();
        });
        it('verify the task in task console', async () => {
            activityTabPo.getTaskActivity('Assigned');
            await activityTabPo.addActivityNote("testing123");
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.clickOnAdvanceSearchButton();
            await attachDocumentBladePo.searchRecord('drdmv3768_document');
            await attachDocumentBladePo.selectDocument();
            await attachDocumentBladePo.clickOnAttachButton();
            await activityTabPo.clickOnPostButton();
            await navigationPage.signOut();
            await loginPage.login("peter");
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter()
            await utilityGrid.searchAndOpenHyperlink(taskID);
            expect(await viewTask.getTaskStatusValue()).toBe('Assigned');
        });
        it('verify the task with different support group', async () => {
            await navigationPage.signOut();
            await loginPage.login("qtao");
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(taskID);
            expect(await viewTask.getTaskStatusValue()).toBe('Assigned');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(CaseId);
            expect(await viewCasePage.getCaseStatusValue()).toBe('In Progress');
        });
        it('[DRDMV-5326]: Verify the case with different support group', async () => {
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('United States Support');
            await changeAssignmentBladePo.selectSupportGroup('US Support 2');
            await changeAssignmentBladePo.selectAssignee('Qiao Feng');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ankagraw
    describe('[DRDMV-3872,DRDMV-3870,DRDMV-3878,DRDMV-4178,DRDMV-4087]: [Task Status] Task Status change from Assigned', async () => {
        let randomStr = 'Manual task' + Math.floor(Math.random() * 1000000);
        //Manual task Template
        let templateData = {
            "taskName": 'manualTaskTemplateAssigned' + randomStr,
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qkatawazi",
        };
        let caseData1 = {
            "Requester": "Fritz",
            "Summary": "Test case for inProgress task",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qkatawazi"
        }
        let displayId, taskName1, taskName2, taskName3, taskName4, taskName5;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            let newCase1 = await apiHelper.createCase(caseData1);
            let tasktemp = await apiHelper.createAdhocTask(newCase1.id, templateData);
            taskName1 = templateData.taskName = 'manualTaskTemplateInProgress' + randomStr;
            let tasktemp1 = await apiHelper.createAdhocTask(newCase1.id, templateData);
            taskName2 = templateData.taskName = 'manualTaskTemplatePending' + randomStr;
            let tasktemp2 = await apiHelper.createAdhocTask(newCase1.id, templateData);
            taskName3 = templateData.taskName = 'manualTaskTemplateCompleted' + randomStr
            let tasktemp3 = await apiHelper.createAdhocTask(newCase1.id, templateData);
            taskName4 = templateData.taskName = 'manualTaskTemplateCancelled' + randomStr
            let tasktemp4 = await apiHelper.createAdhocTask(newCase1.id, templateData);
            taskName5 = templateData.taskName = 'manualTaskTemplateClosed' + randomStr
            let tasktemp5 = await apiHelper.createAdhocTask(newCase1.id, templateData);


            await apiHelper.updateCaseStatus(newCase1.id, 'InProgress');
            await apiHelper.updateTaskStatus(tasktemp.id, 'Assigned');
            await apiHelper.updateTaskStatus(tasktemp1.id, 'InProgress');
            await apiHelper.updateTaskStatus(tasktemp2.id, 'Pending');
            await apiHelper.updateTaskStatus(tasktemp3.id, 'Completed', 'Successful');
            await apiHelper.updateTaskStatus(tasktemp4.id, 'Canceled');
            await apiHelper.updateTaskStatus(tasktemp5.id, 'Closed');
            displayId = newCase1.displayId;
        });
        it('Open the case verify the Assigned Status ', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchAndOpenCase(displayId);
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink('manualTaskTemplateAssigned' + randomStr);
            expect(await viewTask.getTaskStatusValue()).toBe('Assigned');
            await viewTask.clickOnChangeStatus();
            let allStatusatAssignedState: string[] = ["Assigned", "In Progress", "Pending", "Completed", "Canceled", "Closed"];
            await updateStatusBladePo.allStatusOptionsPresent(allStatusatAssignedState);
            await viewTask.clickOnCancelStatus();
            await viewTask.clickOnChangeStatus();
            await updateStatusBladePo.changeStatus("In Progress");
            await viewTask.clickOnSaveStatus();
            expect(await viewTask.getTaskStatusValue()).toBe('In Progress');
            await viewTask.clickOnViewCase();
        });
        it('Open the case verify the In Progress Status ', async () => {
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(taskName1);
            expect(await viewTask.getTaskStatusValue()).toBe('In Progress');
            await viewTask.clickOnChangeStatus();
            let allStatusatinProgressState: string[] = ["In Progress", "Assigned", "Pending", "Completed", "Failed", "Canceled", "Closed"];
            await updateStatusBladePo.allStatusOptionsPresent(allStatusatinProgressState);
            await viewTask.clickOnCancelStatus();
            await viewTask.clickOnChangeStatus();
            await updateStatusBladePo.changeStatus("Pending");
            await viewTask.clickOnSaveStatus();
            expect(await viewTask.getTaskStatusValue()).toBe('Pending');
            await viewTask.clickOnViewCase();
        });
        it('Open the case verify the Pending Status ', async () => {
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(taskName2);
            expect(await viewTask.getTaskStatusValue()).toBe('Pending');
            await viewTask.clickOnChangeStatus();
            let allStatusatinProgressState: string[] = ["Pending", "Assigned", "In Progress", "Completed", "Canceled", "Closed"];
            await updateStatusBladePo.allStatusOptionsPresent(allStatusatinProgressState);
            await viewTask.clickOnCancelStatus();
            await viewTask.clickOnChangeStatus();
            await updateStatusBladePo.changeStatus("Assigned");
            await viewTask.clickOnSaveStatus();
            await viewTask.clickOnChangeStatus();
            await updateStatusBladePo.changeStatus("Completed");
            await updateStatusBladePo.setStatusReason("Successful");
            await viewTask.clickOnSaveStatus();
            expect(await viewTask.getTaskStatusValue()).toBe('Completed');
            await viewTask.clickOnViewCase();
        });
        it('Open the case verify the Completed Status ', async () => {
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(taskName3);
            expect(await viewTask.getTaskStatusValue()).toBe('Completed');
            await viewTask.clickOnChangeStatus();
            await updateStatusBladePo.changeStatus("Canceled");
            await viewTask.clickOnSaveStatus();
            expect(await viewTask.getTaskStatusValue()).toBe('Canceled');
            await viewTask.clickOnViewCase();
        });
        it('Open the case verify the Canceled Status ', async () => {
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(taskName4);
            expect(await viewTask.getTaskStatusValue()).toBe('Canceled');
            expect(await updateStatusBladePo.isCancelUpdateStatusButtonPresent()).toBeFalsy("update field is disabled");
            await viewTask.clickOnViewCase();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");

            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(taskName5);
            expect(await viewTask.getTaskStatusValue()).toBe('Closed');
            expect(await updateStatusBladePo.isCancelUpdateStatusButtonPresent()).toBeFalsy("update field is disabled");
        });
        it('[DRDMV-3872,DRDMV-3870,DRDMV-3878,DRDMV-4178,DRDMV-4087]:Open the task verify the all Status ', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('Assigned')).toBeTruthy('Assigned not present');
            expect(await utilityGrid.isGridRecordPresent('In Progress')).toBeTruthy('In Progress not present');
            expect(await utilityGrid.isGridRecordPresent('Pending')).toBeTruthy('Pending not present');
            expect(await utilityGrid.isGridRecordPresent('Completed')).toBeTruthy('Completed not present');
            expect(await utilityGrid.isGridRecordPresent('Canceled')).toBeFalsy('Canceled not present');
            expect(await utilityGrid.isGridRecordPresent('Closed')).toBeFalsy('Closed not present');
        });
    });
});