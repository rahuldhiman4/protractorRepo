import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import showApproversBladePo from "../../pageobject/common/show-approvers-list-tab.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import approvalConfigurationPage from "../../pageobject/settings/approval/approval-configuration.po";
import approvalMappingConsolePage from "../../pageobject/settings/task-management/approval-mapping-console.po";
import createApprovalMappingPage from "../../pageobject/settings/task-management/create-approval-mapping.po";
import editApprovalMappingPage from "../../pageobject/settings/task-management/edit-approval-mapping.po";
import activityTabPage from '../../pageobject/social/activity-tab.po';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import manageTaskPo from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe("Task Self Approval Tests", () => {
    const taskApprovalRecordDefinition = 'com.bmc.dsm.task-lib:Task';
    let taskModule = 'Task';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.deleteApprovalMapping(taskModule);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[3586]:[Task Approval] - Self Approval without Process', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary = '"' + "Automated Approval without process for task" + '"';
        let caseData = undefined;
        let manualTaskTemplateData, autoTaskTemplateData, caseId, caseId2;

        beforeAll(async () => {
            manualTaskTemplateData = {
                "templateName": `manualTaskTemplateDraft ${randomStr}`,
                "templateSummary": 'Automated Approval without process for task',
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            autoTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": 'Automated Approval without process for task',
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            caseData = {
                "Requester": "Fritz",
                "Summary": "Test case for inProgress task",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            let newCase1 = await apiHelper.createCase(caseData);
            caseId2 = newCase1.displayId;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
        })

        it('[3586]:Create Self Approval Flow Without Process', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', BWF_PAGE_TITLES.APPROVALS.APPROVAL_CONFIGURATION);
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(taskApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Approval configurations');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Self approval');
            await approvalConfigurationPage.clickSelfApprovalQualificationLink();
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit expression');
            await approvalConfigurationPage.clickOnMenuItem('Record definition');
            await approvalConfigurationPage.clickOnMenuItem('Task');
            await approvalConfigurationPage.selectExpressionFieldOption('Summary');
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); //sleep added for expression builder loading
            await approvalConfigurationPage.setExpressionValueForParameter(summary);
            await approvalConfigurationPage.clickModelOkButton();
            await approvalConfigurationPage.setSelfApprovalPrecendenceValue('1');
            await approvalConfigurationPage.setAuditInformationValue('test self approval');
            await approvalConfigurationPage.clickSelfApprovalAddButton();
            await approvalConfigurationPage.clickApprovalFlowCloseButton();
        });

        it('[3586]:Create task approval mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approval Mappings', BWF_PAGE_TITLES.TASK_MANAGEMENT.APPROVALS);
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Create Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName('Task Mapping');
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Approval Rejected');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Assigned');
            await createApprovalMappingPage.selectStatusMappingError('Canceled');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await editApprovalMappingPage.searchTaskTemplate(autoTaskTemplateData.templateName);
            await editApprovalMappingPage.selectTaskTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectTaskTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Case template can be associated');
            await editApprovalMappingPage.clickTaskTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.searchTaskTemplate(manualTaskTemplateData.templateName);
            await editApprovalMappingPage.selectTaskTemplateCheckbox();
            await editApprovalMappingPage.clickTaskTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });

        it('[3586]:Create case and assign tasks to it', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();
            await manageTaskPo.addTaskFromTaskTemplate(manualTaskTemplateData.templateName);
            await manageTaskPo.waitUntilNumberOfTaskLinkAppear(1);
            expect(await manageTaskPo.isTaskLinkPresent(manualTaskTemplateData.templateSummary)).toBeTruthy(manualTaskTemplateData.templateSummary + ' Task is not added to case');
            await manageTaskPo.clickCloseButton();
        });

        it('[3586]: Verify if task approved is triggered for manual task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            await manageTaskPo.clickTaskLink(manualTaskTemplateData.templateSummary);
            let taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe("In Progress");
            expect(await activityTabPage.getApprovalActivityText('Task was auto-approved')).toBeTruthy();
        });

        it('[3586]: Verify if task approved is triggered for automated task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId2);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();
            await manageTaskPo.addTaskFromTaskTemplate(autoTaskTemplateData.templateName);
            await manageTaskPo.waitUntilNumberOfTaskLinkAppear(1);
            expect(await manageTaskPo.isTaskLinkPresent(autoTaskTemplateData.templateSummary)).toBeTruthy(autoTaskTemplateData.templateSummary + ' Task is not added to case');
            await manageTaskPo.clickCloseButton();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            await manageTaskPo.clickTaskLink(autoTaskTemplateData.templateSummary);
            let taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            expect(await activityTabPage.getApprovalActivityText('Task was auto-approved')).toBeTruthy();
        });

        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(taskModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[3587]:[Task Approval] - Self Approval with Process', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary = '"' + "Automated Approval with process for task" + '"';
        let caseData = undefined;
        let manualTaskTemplateData, autoTaskTemplateData, caseId, caseId2;

        beforeAll(async () => {
            manualTaskTemplateData = {
                "templateName": `manualTaskTemplateDraft ${randomStr}`,
                "templateSummary": 'Automated Approval with process for task',
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            autoTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": 'Automated Approval with process for task',
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            caseData = {
                "Requester": "Fritz",
                "Summary": "Test case for inProgress task",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            let newCase1 = await apiHelper.createCase(caseData);
            caseId2 = newCase1.displayId;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
        })

        it('[3587]:Create Self Approval Flow With Process', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', BWF_PAGE_TITLES.APPROVALS.APPROVAL_CONFIGURATION);
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(taskApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Approval configurations');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Self approval');
            await approvalConfigurationPage.clickSelfApprovalQualificationLink();
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit expression');
            await approvalConfigurationPage.clickOnMenuItem('Record definition');
            await approvalConfigurationPage.clickOnMenuItem('Task');
            await approvalConfigurationPage.selectExpressionFieldOption('Summary');
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); //sleep added for expression builder loading
            await approvalConfigurationPage.setExpressionValueForParameter(summary);
            await approvalConfigurationPage.clickModelOkButton();
            await approvalConfigurationPage.setSelfApprovalPrecendenceValue('1');
            await approvalConfigurationPage.setAuditInformationValue('test self approval');
            await approvalConfigurationPage.selectSelfApprovalProcess('Task - Sample Self Approval');
            await approvalConfigurationPage.clickSelfApprovalAddButton();
            await approvalConfigurationPage.clickApprovalFlowCloseButton();
        });

        it('[3587]:Create task approval mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approval Mappings', BWF_PAGE_TITLES.TASK_MANAGEMENT.APPROVALS);
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Create Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName('Task Mapping');
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Approval Rejected');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Assigned');
            await createApprovalMappingPage.selectStatusMappingError('Canceled');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await editApprovalMappingPage.searchTaskTemplate(autoTaskTemplateData.templateName);
            await editApprovalMappingPage.selectTaskTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectTaskTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Case template can be associated');
            await editApprovalMappingPage.clickTaskTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.searchTaskTemplate(manualTaskTemplateData.templateName);
            await editApprovalMappingPage.selectTaskTemplateCheckbox();
            await editApprovalMappingPage.clickTaskTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });

        it('[3587]:Create case and assign tasks to it', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();
            await manageTaskPo.addTaskFromTaskTemplate(manualTaskTemplateData.templateName);
            await manageTaskPo.waitUntilNumberOfTaskLinkAppear(1);
            expect(await manageTaskPo.isTaskLinkPresent(manualTaskTemplateData.templateSummary)).toBeTruthy(manualTaskTemplateData.templateSummary + ' Task is not added to case');
            await manageTaskPo.clickCloseButton();
        });

        it('[3587]: Verify if task approved is triggered for manual task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            await manageTaskPo.clickTaskLink(manualTaskTemplateData.templateSummary);
            let taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe("In Progress");
            expect(await activityTabPage.getApprovalActivityText('Task was self-approved')).toBeTruthy();
        });

        it('[3587]: Verify if task approved is triggered for automated task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId2);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();
            await manageTaskPo.addTaskFromTaskTemplate(autoTaskTemplateData.templateName);
            await manageTaskPo.waitUntilNumberOfTaskLinkAppear(1);
            expect(await manageTaskPo.isTaskLinkPresent(autoTaskTemplateData.templateSummary)).toBeTruthy(autoTaskTemplateData.templateSummary + ' Task is not added to case');
            await manageTaskPo.clickCloseButton();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            await manageTaskPo.clickTaskLink(autoTaskTemplateData.templateSummary);
            let taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            expect(await activityTabPage.getApprovalActivityText('Task was self-approved')).toBeTruthy();
        });

        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(taskModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[3410]:Different Approval Mapping Configurations for Task and the way it processes', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId, caseData, caseTemplateData1, manualTaskTemplateData1, approvalMappingResponse, approvalMappingData, manualTaskDisplayId;
        let caseTemplateData, manualTaskTemplateData, manualTaskTemplate, manualTaskTemplate1, caseTemplate, caseTemplate1;
        beforeAll(async () => {
            // Create Case Templates through API
            caseTemplateData = {
                "templateName": 'Case Template for Task Approvals' + randomStr,
                "templateSummary": 'Case Template Summary1',
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }

            manualTaskTemplateData = {
                "templateName": `manualTaskTemplate first ${randomStr}`,
                "templateSummary": 'Automated Approval for task first',
                "templateStatus": "Active",
                "priority": "Low",
                "taskCompany": 'Petramco',
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }

            caseTemplateData1 = {
                "templateName": 'Case Template for Task Approvals Second' + randomStr,
                "templateSummary": 'Case Template Summary another',
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }

            manualTaskTemplateData1 = {
                "templateName": `manualTaskTemplate second ${randomStr}`,
                "templateSummary": 'Automated Approval for task second',
                "templateStatus": "Active",
                "priority": "Low",
                "taskCompany": 'Petramco',
                "businessUnit": "Australia Support",
                "supportGroup": "AU Support 1",
                "assignee": "qliu",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Australia Support",
                "ownerGroup": "AU Support 1"
            }
            await apiHelper.apiLogin('qkatawazi');
            caseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(caseTemplate.displayId, manualTaskTemplate.displayId);

            await apiHelper.apiLogin('qliu');
            caseTemplate1 = await apiHelper.createCaseTemplate(caseTemplateData1);
            manualTaskTemplate1 = await apiHelper.createManualTaskTemplate(manualTaskTemplateData1);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(caseTemplate1.displayId, manualTaskTemplate1.displayId);

            await apiHelper.apiLogin('qkatawazi');
            // Create Approval Flow through API
            let approvalFlows = {
                "flowName": 'Approval Flow' + randomStr,
                "qualification": "'Priority' = \"Low\"",
                "precedence": 0,
                "isLevelUp": true,
                "levels": 1,
            }

            await apiHelper.createApprovalFlow(approvalFlows, taskModule);

            //Create Approval Mapping through API
            approvalMappingData = {
                "triggerStatus": "Assigned",
                "errorStatus": "Canceled",
                "approvedStatus": "InProgress",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "ApprovalRejected",
                "company": "Petramco",
                "mappingName": "Task Approval Mapping_" + randomStr
            }
            approvalMappingResponse = await apiHelper.createApprovalMapping(taskModule, approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(taskModule, manualTaskTemplate.id, approvalMappingResponse.id);
        });

        it('[3410]:Toggle False, task created using template which added in approval mapping, task should go in Approval', async () => {
            await apiHelper.apiLogin('qtao');
            caseData = {
                "Requester": "qdu",
                "Summary": "Toggle False, case template added in approval mapping" + "_" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplate.displayId
            }

            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTaskPo.getTaskDisplayId();
            await manageTaskPo.clickTaskLink(manualTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
        });

        it('[3410]:Toggle False, task created without template, task should NOT go in Approval', async () => {
            await apiHelper.apiLogin('qliu');
            let caseData = {
                "Requester": "qdu",
                "Summary": "Toggle False, case without template" + "_" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng",
            }

            let taskData = {
                "taskName": "Toggle False, task created without template" + "_" + randomStr,
                "company": "Petramco",
                "priority": "Low",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "assignee": "qtao",
            }
            let newCase1 = await apiHelper.createCase(caseData);
            caseId = newCase1.displayId;
            await apiHelper.createAdhocTask(newCase1.id, taskData);

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTaskPo.getTaskDisplayId();
            await manageTaskPo.clickTaskLink(taskData.taskName);
            expect(await viewTask.getTaskStatusValue()).toBe("Assigned");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
        });

        it('[3410]:Toggle False, task created using template which NOT added in approval mapping, task should NOT go in Approval', async () => {
            await apiHelper.apiLogin('qtao');
            caseData = {
                "Requester": "qdu",
                "Summary": "Toggle False, case template added in approval mapping" + "_" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplate1.displayId
            }

            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTaskPo.getTaskDisplayId();
            await manageTaskPo.clickTaskLink(manualTaskTemplateData1.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Assigned");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
        });

        it('[3410]:Set toggle in approval mapping as True', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approval Mappings', BWF_PAGE_TITLES.TASK_MANAGEMENT.APPROVALS);
            await utilityGrid.searchAndOpenHyperlink(approvalMappingData.mappingName);
            await editApprovalMappingPage.setTaskCreatedUsingTemplateGoInApprovalToggle(true);
            await editApprovalMappingPage.clickSaveApprovalMappingBtn();
        });

        it('[3410]:Toggle True, task created using template which added in approval mapping, task should go in Approval', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await apiHelper.apiLogin('qtao');
            caseData = {
                "Requester": "qdu",
                "Summary": "Toggle False, case template added in approval mapping" + "_" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplate.displayId
            }

            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTaskPo.getTaskDisplayId();
            await manageTaskPo.clickTaskLink(manualTaskTemplateData.templateSummary);
            let taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
        });

        it('[3410]:Toggle True, task created without template, task should go in Approval', async () => {
            await apiHelper.apiLogin('qtao');
            let caseData = {
                "Requester": "qdu",
                "Summary": "Toggle true, case without template" + "_" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng",
            }

            let taskData = {
                "taskName": "Toggle true, task created without template" + "_" + randomStr,
                "company": "Petramco",
                "priority": "Low",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "assignee": "qtao",
            }
            let newCase2 = await apiHelper.createCase(caseData);
            caseId = newCase2.displayId;

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();
            await manageTaskPo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(taskData.taskName);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectPriority('Low');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closeAllBlades();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTaskPo.getTaskDisplayId();
            await manageTaskPo.clickTaskLink(taskData.taskName);
            let taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
        });

        it('[3410]:Toggle True, task created using template which NOT added in approval mapping, task should NOT go in Approval', async () => {
            await apiHelper.apiLogin('qtao');
            caseData = {
                "Requester": "qdu",
                "Summary": "Toggle True, task template added in approval mapping" + "_" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplate1.displayId
            }

            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTaskPo.getTaskDisplayId();
            await manageTaskPo.clickTaskLink(manualTaskTemplateData1.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Assigned");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
        });

        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(taskModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[3471,3470]:Tiggered the Approval on Task and check Task View screen by Approver should show Approval component', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId, caseData, manualTaskDisplayId, approvalMappingResponse, approvalMappingData;
        let caseTemplateData, manualTaskTemplateData, manualTask, caseTemplate;
        beforeAll(async () => {
            // Create Case Templates through API
            caseTemplateData = {
                "templateName": 'ActiveToInactiveCaseTemplate_' + randomStr,
                "templateSummary": 'Case Template Summary1',
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            manualTaskTemplateData = {
                "templateName": `manualTaskTemplateDraft ${randomStr}`,
                "templateSummary": `One must approval for task ${randomStr}`,
                "templateStatus": "Active",
                "category1": 'Workforce Administration',
                "category2": 'HR Operations',
                "taskCompany": "Petramco",
                "buisnessUnit": "United Kingdom Support",
                "supportGroup": "GB Support 2",
                "assignee": "qstrong",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United Kingdom Support",
                "ownerGroup": "GB Support 2"
            }
            await apiHelper.apiLogin('qkatawazi');
            caseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            manualTask = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(caseTemplate.displayId, manualTask.displayId);
            // Create Approval Flow through API
            let approvalFlows = {
                "flowName": 'Approval Flow1' + randomStr,
                "approver": "qliu;qstrong",
                "isLevelUp": false,
                "qualification": `'Category Tier 1' = "Workforce Administration" AND 'Category Tier 2' = "HR Operations"`,
                "precedence": 0,
                "signingCriteria": 0,
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createApprovalFlow(approvalFlows, taskModule);

            //Create Approval Mapping through API
            approvalMappingData = {
                "triggerStatus": "Assigned",
                "errorStatus": "Canceled",
                "approvedStatus": "Completed",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "ApprovalRejected",
                "company": "Petramco",
                "mappingName": "Task Approval Mapping_" + randomStr
            }

            approvalMappingResponse = await apiHelper.createApprovalMapping(taskModule, approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(taskModule, manualTask.id, approvalMappingResponse.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated One must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplate.displayId
            }
            await apiHelper.apiLogin('qstrong');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
        });
        it('[3471,3470]:Create case and assign tasks to it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
        });
        it('[3471,3470]: Verify the task approval details', async () => {
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTaskPo.getTaskDisplayId();
            await manageTaskPo.clickTaskLink(manualTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(manualTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewTask.isApprovalButtonsPresent('Approve')).toBeFalsy('Show Approvers Banner is not displayed');
            expect(await viewTask.isApprovalButtonsPresent('Reject')).toBeFalsy('Show Approvers Banner is not displayed');
        });
        it('[3471,3470]: Approve the task with approver and check the approver details on task view', async () => {
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(manualTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewTask.isApprovalButtonsPresent('Approve')).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.isApprovalButtonsPresent('Reject')).toBeTruthy('Show Approvers Banner is not displayed');
            await viewTask.clickOnApproveLink();
        });
        it('[3471,3470]:Create case and assign tasks to it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(manualTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
            await apiHelper.apiLogin('qfeng');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTaskPo.getTaskDisplayId();
            await manageTaskPo.clickTaskLink(manualTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(manualTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewTask.isApprovalButtonsPresent('Approve')).toBeFalsy('Show Approvers Banner is not displayed');
            expect(await viewTask.isApprovalButtonsPresent('Reject')).toBeFalsy('Show Approvers Banner is not displayed');
        });
        it('[3471,3470]: Verify the task approver details on task view for the user who is submitter of task but not belongs to approval configs', async () => {
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(manualTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewTask.isApprovalButtonsPresent('Approve')).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.isApprovalButtonsPresent('Reject')).toBeTruthy('Show Approvers Banner is not displayed');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(taskModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[3502]:[Approval] Verify precedence will be given to company specific approval mapping if we have global approval mapping with Same name when task enters approval cycle', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId, caseData, automatedTaskDisplayId, approvalMappingResponse, approvalMappingData, globalApprovalMappingData;
        let caseTemplateData, manualTaskTemplateData, automatedTask, caseTemplate;
        beforeAll(async () => {
            // Create Case Templates through API
            caseTemplateData = {
                "templateName": 'ActiveToInactiveCaseTemplate_' + randomStr,
                "templateSummary": 'Case Template Summary1',
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }

            manualTaskTemplateData = {
                "templateName": `manualTaskTemplateDraft ${randomStr}`,
                "templateSummary": `One must approval for task ${randomStr}`,
                "templateStatus": "Active",
                "category1": 'Workforce Administration',
                "category2": 'HR Operations',
                "taskCompany": "Petramco",
                "buisnessUnit": "United Kingdom Support",
                "supportGroup": "GB Support 2",
                "assignee": "qstrong",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United Kingdom Support",
                "ownerGroup": "GB Support 2"
            }

            await apiHelper.apiLogin('qkatawazi');
            caseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            automatedTask = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(caseTemplate.displayId, automatedTask.displayId);
            // Create Approval Flow through API
            let approvalFlows = {
                "flowName": 'Approval Flow1' + randomStr,
                "approver": "qliu;qstrong",
                "isLevelUp": false,
                "qualification": `'Category Tier 1' = "Workforce Administration" AND 'Category Tier 2' = "HR Operations"`,
                "precedence": 0,
                "signingCriteria": 0,
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createApprovalFlow(approvalFlows, taskModule);

            //Create Approval Mapping through API
            approvalMappingData = {
                "triggerStatus": "Assigned",
                "errorStatus": "Canceled",
                "approvedStatus": "Completed",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "ApprovalRejected",
                "company": "Petramco",
                "mappingName": "Task Approval Mapping_" + randomStr
            }

            globalApprovalMappingData = {
                "triggerStatus": "Assigned",
                "errorStatus": "Canceled",
                "approvedStatus": "InProgress",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
                "company": "- Global -",
                "mappingName": "GlobalTask Approval Mapping_" + randomStr
            }

            approvalMappingResponse = await apiHelper.createApprovalMapping(taskModule, approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(taskModule, automatedTask.id, approvalMappingResponse.id);

            approvalMappingResponse = await apiHelper.createApprovalMapping(taskModule, globalApprovalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(taskModule, automatedTask.id, approvalMappingResponse.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated One must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplate.displayId
            }
            await apiHelper.apiLogin('qstrong');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;

        });

        it('[3502]:Create case and assign tasks to it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePo.openTaskCard(1);
            automatedTaskDisplayId = await manageTaskPo.getTaskDisplayId();
            await manageTaskPo.clickTaskLink(manualTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
        });

        it('[3502]: Verify the task approval details ', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            await viewTask.clickShowApproversLink();
            expect(await showApproversBladePo.isShowApproversBladeDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabel()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabel('Pending Approval')).toContain('Pending Approval (1)');
            expect(await showApproversBladePo.getApproversTabLabel('Approval Decision')).toContain('Approval Decision (0)');
            expect(await showApproversBladePo.getApprovalsHelpTextOnShowApproversBlade()).toContain('One of following people must approve this case:');
            expect(await showApproversBladePo.getApproversCount()).toBe(2);
            expect(await showApproversBladePo.getApproversName('Quin Strong')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversName('Qiwei Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isApproverPersonIconDisplayed('Quin Strong')).toBeTruthy('Approver Person Icon is not displayed');
            expect(await showApproversBladePo.isAwaitingApproverIconDisplayed()).toBeTruthy('Awaiting approver icon is not displayed');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompany('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovalStatusLabel()).toContain('Awaiting Approval');
            await showApproversBladePo.clickApproversTab('Approval Decision');
            expect(await showApproversBladePo.getApproversCount()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        })

        it('[3502]: Verify task approval precedence given to company specific mapping', async () => {
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewTask.isApprovalButtonsPresent('Approve')).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.isApprovalButtonsPresent('Reject')).toBeTruthy('Show Approvers Banner is not displayed');
            await viewTask.clickOnApproveLink();
            await browser.sleep(1000); // Hardwait To Reflect Post Approval Status On UI.
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.getApprovalActivityText('Task was approved')).toBeTruthy();
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(2);
            expect(await showApproversBladePo.getApproversNameFromActivity('Quin Strong')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversNameFromActivity('Qiwei Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabelFromActivity()).toContain('Approved');
            expect(await showApproversBladePo.isApprovedApproverIconDisplayedFromActivity()).toBeTruthy('Approved button on Approver List blade is not displayed');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        it('[3502]:Create case and assign tasks to it and delete company specific mapping', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
            await apiHelper.apiLogin('qstrong');
            await apiHelper.deleteApprovalMapping(taskModule, "Task Approval Mapping_" + randomStr);
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            automatedTaskDisplayId = await manageTaskPo.getTaskDisplayId();
            await manageTaskPo.clickTaskLink(manualTaskTemplateData.templateSummary);
            let taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
        });

        it('[3502]: Verify task approval precedence given to global company mapping', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewTask.isApprovalButtonsPresent('Approve')).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.isApprovalButtonsPresent('Reject')).toBeTruthy('Show Approvers Banner is not displayed');
            await viewTask.clickOnApproveLink();
            await browser.sleep(1000); // Hardwait To Reflect Post Approval Status On UI.
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.getApprovalActivityText('Task was approved')).toBeTruthy();
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(2);
            expect(await showApproversBladePo.getApproversNameFromActivity('Quin Strong')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversNameFromActivity('Qiwei Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabelFromActivity()).toContain('Approved');
            expect(await showApproversBladePo.isApprovedApproverIconDisplayedFromActivity()).toBeTruthy('Approved button on Approver List blade is not displayed');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
        });

        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(taskModule);
        });
    });
});
