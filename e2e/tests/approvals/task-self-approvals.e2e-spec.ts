import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import approvalConfigurationPage from "../../pageobject/settings/approval/approval-configuration.po";
import activityTabPage from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import approvalMappingConsolePage from "../../pageobject/settings/task-management/approval-mapping-console.po";
import createApprovalMappingPage from "../../pageobject/settings/task-management/create-approval-mapping.po";
import utilCommon from '../../utils/util.common';
import { default as manageTask } from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import editApprovalMappingPage from "../../pageobject/settings/task-management/edit-approval-mapping.po";
import showApproversBladePo from "../../pageobject/common/show-approvers-list-tab.po";
import utilGrid from '../../utils/util.grid';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";


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

    describe('[DRDMV-21589]:[Task Approval] - Self Approval without Process', () => {
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
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            autoTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": 'Automated Approval without process for task',
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
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

        it('[DRDMV-21589]:Create Self Approval Flow Without Process', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', 'Approval Configuration - Administration - Business Workflows');
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(taskApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit Approval Flow');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Self Approval');
            await approvalConfigurationPage.clickNewSelfApprovalFlowButton();
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create Approval Flow');
            await browser.sleep(5000); //sleep added for expression builder loading
            await approvalConfigurationPage.searchExpressionFieldOption('Summary');
            await approvalConfigurationPage.clickRecordOption('Record Definition');
            await approvalConfigurationPage.clickRecordOption('Task');
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(1000); //sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); //sleep added for expression builder loading
            await approvalConfigurationPage.setExpressionValueForParameter(summary);
            await approvalConfigurationPage.clickNextbuttonOnSelfApproval();
            await approvalConfigurationPage.setAuditInformationValue('test self approval');
            await approvalConfigurationPage.clickNewApprovalFlowSaveButton();
            await approvalConfigurationPage.closeEditApprovalFlowPopUpWindow('Close');
        });

        it('[DRDMV-21589]:Create task approval mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approvals', 'Task Approval Mappings - Business Workflows');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName('Task Mapping');
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Approval Rejected');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Assigned');
            await createApprovalMappingPage.selectStatusMappingError('Canceled');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await editApprovalMappingPage.searchTaskTemplate(autoTaskTemplateData.templateName);
            await editApprovalMappingPage.selectTaskTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectTaskTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Case template can be associated');
            await editApprovalMappingPage.clickTaskTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.searchTaskTemplate(manualTaskTemplateData.templateName);
            await editApprovalMappingPage.selectTaskTemplateCheckbox();
            await editApprovalMappingPage.clickTaskTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });

        it('[DRDMV-21589]:Create case and assign tasks to it', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(manualTaskTemplateData.templateName);
            await manageTask.waitUntilNumberOfTaskLinkAppear(1);
            expect(await manageTask.isTaskLinkPresent(manualTaskTemplateData.templateSummary)).toBeTruthy(manualTaskTemplateData.templateSummary + ' Task is not added to case');
            await manageTask.clickCloseButton();
        });

        it('[DRDMV-21589]: Verify if task approved is triggered for manual task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            await manageTask.clickTaskLink(manualTaskTemplateData.templateSummary);
            let taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe("In Progress");
            expect(await activityTabPage.getApprovalActivityText('Task was auto-approved')).toBeTruthy();
        });

        it('[DRDMV-21589]: Verify if task approved is triggered for automated task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId2);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(autoTaskTemplateData.templateName);
            await manageTask.waitUntilNumberOfTaskLinkAppear(1);
            expect(await manageTask.isTaskLinkPresent(autoTaskTemplateData.templateSummary)).toBeTruthy(autoTaskTemplateData.templateSummary + ' Task is not added to case');
            await manageTask.clickCloseButton();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            await manageTask.clickTaskLink(autoTaskTemplateData.templateSummary);
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

    describe('[DRDMV-21588]:[Task Approval] - Self Approval with Process', () => {
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
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            autoTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": 'Automated Approval with process for task',
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
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

        it('[DRDMV-21588]:Create Self Approval Flow With Process', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', 'Approval Configuration - Administration - Business Workflows');
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(taskApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit Approval Flow');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Self Approval');
            await approvalConfigurationPage.clickNewSelfApprovalFlowButton();
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create Approval Flow');
            await browser.sleep(5000); //sleep added for expression builder loading
            await approvalConfigurationPage.searchExpressionFieldOption('Summary');
            await approvalConfigurationPage.clickRecordOption('Record Definition');
            await approvalConfigurationPage.clickRecordOption('Task');
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(1000); //sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); //sleep added for expression builder loading
            await approvalConfigurationPage.setExpressionValueForParameter(summary);
            await approvalConfigurationPage.clickNextbuttonOnSelfApproval();
            await approvalConfigurationPage.setAuditInformationValue('test self approval');
            await approvalConfigurationPage.selectSelfApprovalProcess();
            await approvalConfigurationPage.clickNewApprovalFlowSaveButton();
            await approvalConfigurationPage.closeEditApprovalFlowPopUpWindow('Close');
        });

        it('[DRDMV-21588]:Create task approval mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approvals', 'Task Approval Mappings - Business Workflows');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName('Task Mapping');
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Approval Rejected');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Assigned');
            await createApprovalMappingPage.selectStatusMappingError('Canceled');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await editApprovalMappingPage.searchTaskTemplate(autoTaskTemplateData.templateName);
            await editApprovalMappingPage.selectTaskTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectTaskTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Case template can be associated');
            await editApprovalMappingPage.clickTaskTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.searchTaskTemplate(manualTaskTemplateData.templateName);
            await editApprovalMappingPage.selectTaskTemplateCheckbox();
            await editApprovalMappingPage.clickTaskTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });

        it('[DRDMV-21588]:Create case and assign tasks to it', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(manualTaskTemplateData.templateName);
            await manageTask.waitUntilNumberOfTaskLinkAppear(1);
            expect(await manageTask.isTaskLinkPresent(manualTaskTemplateData.templateSummary)).toBeTruthy(manualTaskTemplateData.templateSummary + ' Task is not added to case');
            await manageTask.clickCloseButton();
        });

        it('[DRDMV-21588]: Verify if task approved is triggered for manual task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            await manageTask.clickTaskLink(manualTaskTemplateData.templateSummary);
            let taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe("In Progress");
            expect(await activityTabPage.getApprovalActivityText('Task was self-approved')).toBeTruthy();
        });

        it('[DRDMV-21588]: Verify if task approved is triggered for automated task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId2);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(autoTaskTemplateData.templateName);
            await manageTask.waitUntilNumberOfTaskLinkAppear(1);
            expect(await manageTask.isTaskLinkPresent(autoTaskTemplateData.templateSummary)).toBeTruthy(autoTaskTemplateData.templateSummary + ' Task is not added to case');
            await manageTask.clickCloseButton();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            await manageTask.clickTaskLink(autoTaskTemplateData.templateSummary);
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

    describe('[DRDMV-22951]:Different Approval Mapping Configurations for Task and the way it processes', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId, caseData, caseTemplateData1, manualTaskTemplateData1, approvalMappingResponse, approvalMappingData, manualTaskDisplayId;
        let caseTemplateData, manualTaskTemplateData, manualTaskTemplate, manualTaskTemplate1, caseTemplate, caseTemplate1;
        beforeAll(async () => {
            // Create Case Templates through API
            caseTemplateData = {
                "templateName": 'Case Template for Task Approvals' + randomStr,
                "templateSummary": 'Case Template Summary1',
                "categoryTier1": 'Facilities',
                "categoryTier2": 'Kitchen',
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
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            caseTemplateData1 = {
                "templateName": 'Case Template for Task Approvals Second' + randomStr,
                "templateSummary": 'Case Template Summary another',
                "categoryTier1": 'Facilities',
                "categoryTier2": 'Kitchen',
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
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            caseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(caseTemplate.displayId, manualTaskTemplate.displayId);

            await apiHelper.apiLogin('fritz');
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

        it('[DRDMV-22951]:Toggle False, task created using template which added in approval mapping, task should go in Approval', async () => {
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
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTask.getTaskDisplayIdFromManageTaskBlade();
            await manageTask.clickTaskLink(manualTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
        });

        it('[DRDMV-22951]:Toggle False, task created without template, task should NOT go in Approval', async () => {
            await apiHelper.apiLogin('fritz');
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTask.getTaskDisplayIdFromManageTaskBlade();
            await manageTask.clickTaskLink(taskData.taskName);
            expect(await viewTask.getTaskStatusValue()).toBe("Assigned");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
        });

        it('[DRDMV-22951]:Toggle False, task created using template which NOT added in approval mapping, task should NOT go in Approval', async () => {
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTask.getTaskDisplayIdFromManageTaskBlade();
            await manageTask.clickTaskLink(manualTaskTemplateData1.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Assigned");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
        });

        it('[DRDMV-22951]:Set toggle in approval mapping as True', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approvals', 'Task Approval Mappings - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(approvalMappingData.mappingName);
            await editApprovalMappingPage.setTaskCreatedUsingTemplateGoInApprovalToggle(true);
            await editApprovalMappingPage.clickSaveApprovalMappingBtn();
        });

        it('[DRDMV-22951]:Toggle True, task created using template which added in approval mapping, task should go in Approval', async () => {
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTask.getTaskDisplayIdFromManageTaskBlade();
            await manageTask.clickTaskLink(manualTaskTemplateData.templateSummary);
            let taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
        });

        it('[DRDMV-22951]:Toggle True, task created without template, task should go in Approval', async () => {
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(taskData.taskName);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectPriority('Low');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closeAllBlades();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTask.getTaskDisplayIdFromManageTaskBlade();
            await manageTask.clickTaskLink(taskData.taskName);
            let taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
        });

        it('[DRDMV-22951]:Toggle True, task created using template which NOT added in approval mapping, task should NOT go in Approval', async () => {
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            manualTaskDisplayId = await manageTask.getTaskDisplayIdFromManageTaskBlade();
            await manageTask.clickTaskLink(manualTaskTemplateData1.templateSummary);
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

    describe('[DRDMV-22396,DRDMV-22397]:Tiggered the Approval on Task and check Task View screen by Approver should show Approval component', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId, caseData, automatedTaskDisplayId, approvalMappingResponse, approvalMappingData;
        let caseTemplateData, manualTaskTemplateData, automatedTask, caseTemplate;
        beforeAll(async () => {
            // Create Case Templates through API
            caseTemplateData = {
                "templateName": 'ActiveToInactiveCaseTemplate_' + randomStr,
                "templateSummary": 'Case Template Summary1',
                "categoryTier1": 'Facilities',
                "categoryTier2": 'Kitchen',
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
                "category1": 'Facilities',
                "category2": 'Kitchen',
                "taskCompany": "Petramco",
                "buisnessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            await apiHelper.apiLogin('qkatawazi');
            caseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            automatedTask = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(caseTemplate.displayId, automatedTask.displayId);
            // Create Approval Flow through API
            let approvalFlows = {
                "flowName": 'Approval Flow1' + randomStr,
                "approver": "U:qliu;U:Fritz",
                "isLevelUp": false,
                "qualification": "'Category Tier 1' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.bccb0487dc2fab9e5052c16c67f647df8ce68a989fd53a4999763c5a336e5b79c83b8ba8108907851a28e035b87c73ae2f086df65912d77eff8e21299d90c32c.304405421} AND 'Category Tier 2' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.8c700e7edba91d3091aed763ab1c3c0bcf1c44c8c8776d53fa6bc76b6ff78bb48f106c210f41c330a2c42af0daab956847e9712a4a8822b8c571e5b97eec1bf5.304405421}",
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
            await apiHelper.associateTemplateWithApprovalMapping(taskModule, automatedTask.id, approvalMappingResponse.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated One must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplate.displayId
            }
            await apiHelper.apiLogin('fritz');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;

        });

        it('[DRDMV-22396,DRDMV-22397]:Create case and assign tasks to it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
        });

        it('[DRDMV-22396,DRDMV-22397]: Verify the task approval details', async () => {
            await viewCasePo.openTaskCard(1);
            automatedTaskDisplayId = await manageTask.getTaskDisplayIdFromManageTaskBlade();
            await manageTask.clickTaskLink(manualTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewTask.isApprovalButtonsPresent('Approve')).toBeFalsy('Show Approvers Banner is not displayed');
            expect(await viewTask.isApprovalButtonsPresent('Reject')).toBeFalsy('Show Approvers Banner is not displayed');
        })

        it('[DRDMV-22396,DRDMV-22397]: Approve the task with approver and check the approver details on task view', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewTask.isApprovalButtonsPresent('Approve')).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.isApprovalButtonsPresent('Reject')).toBeTruthy('Show Approvers Banner is not displayed');
            await viewTask.clickOnApproveLink();
        });

        it('[DRDMV-22396,DRDMV-22397]:Create case and assign tasks to it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
            await apiHelper.apiLogin('qfeng');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePo.openTaskCard(1);
            automatedTaskDisplayId = await manageTask.getTaskDisplayIdFromManageTaskBlade();
            await manageTask.clickTaskLink(manualTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewTask.isApprovalButtonsPresent('Approve')).toBeFalsy('Show Approvers Banner is not displayed');
            expect(await viewTask.isApprovalButtonsPresent('Reject')).toBeFalsy('Show Approvers Banner is not displayed');
        });

        it('[DRDMV-22396,DRDMV-22397]: Verify the task approver details on task view for the user who is submitter of task but not belongs to approval configs', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
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

    describe('[DRDMV-22264]:[Approval] Verify precedence will be given to company specific approval mapping if we have global approval mapping with Same name when task enters approval cycle', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId, caseData, automatedTaskDisplayId, approvalMappingResponse, approvalMappingData, globalApprovalMappingData;
        let caseTemplateData, manualTaskTemplateData, automatedTask, caseTemplate;
        beforeAll(async () => {
            // Create Case Templates through API
            caseTemplateData = {
                "templateName": 'ActiveToInactiveCaseTemplate_' + randomStr,
                "templateSummary": 'Case Template Summary1',
                "categoryTier1": 'Facilities',
                "categoryTier2": 'Kitchen',
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
                "category1": 'Facilities',
                "category2": 'Kitchen',
                "taskCompany": "Petramco",
                "buisnessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            await apiHelper.apiLogin('qkatawazi');
            caseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            automatedTask = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(caseTemplate.displayId, automatedTask.displayId);
            // Create Approval Flow through API
            let approvalFlows = {
                "flowName": 'Approval Flow1' + randomStr,
                "approver": "U:qliu;U:Fritz",
                "isLevelUp": false,
                "qualification": "'Category Tier 1' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.bccb0487dc2fab9e5052c16c67f647df8ce68a989fd53a4999763c5a336e5b79c83b8ba8108907851a28e035b87c73ae2f086df65912d77eff8e21299d90c32c.304405421} AND 'Category Tier 2' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.8c700e7edba91d3091aed763ab1c3c0bcf1c44c8c8776d53fa6bc76b6ff78bb48f106c210f41c330a2c42af0daab956847e9712a4a8822b8c571e5b97eec1bf5.304405421}",
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
            await apiHelper.apiLogin('fritz');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;

        });

        it('[DRDMV-22264]:Create case and assign tasks to it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePo.openTaskCard(1);
            automatedTaskDisplayId = await manageTask.getTaskDisplayIdFromManageTaskBlade();
            await manageTask.clickTaskLink(manualTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
        });

        it('[DRDMV-22264]: Verify the task approval details ', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
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
            expect(await showApproversBladePo.getApproversName('Fritz Schulz')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversName('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isApproverPersonIconDisplayed('Fritz Schulz')).toBeTruthy('Approver Person Icon is not displayed');
            expect(await showApproversBladePo.isAwaitingApproverIconDisplayed()).toBeTruthy('Awaiting approver icon is not displayed');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompany('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovalStatusLabel()).toContain('Awaiting Approval');
            await showApproversBladePo.clickApproversTab('Approval Decision');
            expect(await showApproversBladePo.getApproversCount()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        })

        it('[DRDMV-22264]: Verify task approval precedence given to company specific mapping', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
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
            expect(await showApproversBladePo.getApproversNameFromActivity('Fritz Schulz')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversNameFromActivity('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabelFromActivity()).toContain('Approved');
            expect(await showApproversBladePo.isApprovedApproverIconDisplayedFromActivity()).toBeTruthy('Approved button on Approver List blade is not displayed');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        it('[DRDMV-22264]:Create case and assign tasks to it and delete company specific mapping', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
            await apiHelper.apiLogin('fritz');
            await apiHelper.deleteApprovalMapping(taskModule, "Task Approval Mapping_" + randomStr);
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            automatedTaskDisplayId = await manageTask.getTaskDisplayIdFromManageTaskBlade();
            await manageTask.clickTaskLink(manualTaskTemplateData.templateSummary);
            let taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
        });

        it('[DRDMV-22264]: Verify task approval precedence given to global company mapping', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewTask.isApprovalButtonsPresent('Approve')).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.isApprovalButtonsPresent('Reject')).toBeTruthy('Show Approvers Banner is not displayed');
            await viewTask.clickOnApproveLink();
            await browser.sleep(1000); // Hardwait To Reflect Post Approval Status On UI.
            expect(await viewTask.getTaskStatusValue()).toBe("In Progress");
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.getApprovalActivityText('Task was approved')).toBeTruthy();
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(2);
            expect(await showApproversBladePo.getApproversNameFromActivity('Fritz Schulz')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversNameFromActivity('RA3 Liu')).toBeTruthy('Approver not present');
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
            expect(await viewTask.getTaskStatusValue()).toBe("In Progress");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
        });

        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(taskModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
}); 