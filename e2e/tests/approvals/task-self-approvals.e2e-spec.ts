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


describe("Case Self Approval Tests", () => {
    const taskApprovalRecordDefinition = 'com.bmc.dsm.task-lib:Task';
    const taskApprovalMappingRecordDefinition = 'com.bmc.dsm.task-lib:Task Approval Mapping';
    const taskMappingGuid = '59ccc726-2512-43ae-9806-c838be2665c3';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(taskApprovalMappingRecordDefinition);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[DRDMV-21589]:[Task Approval] - Self Approval without Process', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary = '"' + "Automated Approval without process for task" + '"';
        let caseData = undefined;
        let manualTaskTemplateData, autoTaskTemplateData, caseId,caseId2,manualTaskId,automatedTaskId = "";

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
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Assigned');
            await createApprovalMappingPage.selectStatusMappingRejected('Approval Rejected');
            await createApprovalMappingPage.selectStatusMappingError('Canceled');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await editApprovalMappingPage.searchCaseTemplate(autoTaskTemplateData.templateName);
            await editApprovalMappingPage.selectCaseTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectCaseTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Case template can be associated');
            await editApprovalMappingPage.clickCaseTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.searchCaseTemplate(manualTaskTemplateData.templateName);
            await editApprovalMappingPage.selectCaseTemplateCheckbox();
            await editApprovalMappingPage.clickCaseTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });

        it('[DRDMV-21589]:Create case and assign tasks to it', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();

            //Add Manual task and Automation Task in Case
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
            expect(await viewTask.getTaskStatusValue()).toBe("In Progress");
            expect(await activityTabPage.getApprovalActivityText('Task was auto-approved')).toBeTruthy();
        });

        it('[DRDMV-21589]: Verify if task approved is triggered for automated task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId2);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();

            //Add Manual task and Automation Task in Case
            await manageTask.addTaskFromTaskTemplate(autoTaskTemplateData.templateName);
            await manageTask.waitUntilNumberOfTaskLinkAppear(1);
            expect(await manageTask.isTaskLinkPresent(autoTaskTemplateData.templateSummary)).toBeTruthy(autoTaskTemplateData.templateSummary + ' Task is not added to case');
            await manageTask.clickCloseButton();            

            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            await manageTask.clickTaskLink(autoTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            expect(await activityTabPage.getApprovalActivityText('Task was auto-approved')).toBeTruthy();
        });

        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteApprovalMapping(taskApprovalMappingRecordDefinition);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-21588]:[Task Approval] - Self Approval with Process', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary = '"' + "Automated Approval with process for task" + '"';
        let caseData = undefined;
        let manualTaskTemplateData, autoTaskTemplateData, caseId,caseId2,manualTaskId,automatedTaskId = "";

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
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Assigned');
            await createApprovalMappingPage.selectStatusMappingRejected('Approval Rejected');
            await createApprovalMappingPage.selectStatusMappingError('Canceled');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await editApprovalMappingPage.searchCaseTemplate(autoTaskTemplateData.templateName);
            await editApprovalMappingPage.selectCaseTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectCaseTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Case template can be associated');
            await editApprovalMappingPage.clickCaseTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.searchCaseTemplate(manualTaskTemplateData.templateName);
            await editApprovalMappingPage.selectCaseTemplateCheckbox();
            await editApprovalMappingPage.clickCaseTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });

        it('[DRDMV-21588]:Create case and assign tasks to it', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();

            //Add Manual task and Automation Task in Case
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
            expect(await viewTask.getTaskStatusValue()).toBe("In Progress");
            expect(await activityTabPage.getApprovalActivityText('Task was self-approved')).toBeTruthy();
        });

        it('[DRDMV-21588]: Verify if task approved is triggered for automated task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId2);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();

            //Add Manual task and Automation Task in Case
            await manageTask.addTaskFromTaskTemplate(autoTaskTemplateData.templateName);
            await manageTask.waitUntilNumberOfTaskLinkAppear(1);
            expect(await manageTask.isTaskLinkPresent(autoTaskTemplateData.templateSummary)).toBeTruthy(autoTaskTemplateData.templateSummary + ' Task is not added to case');
            await manageTask.clickCloseButton();            

            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            await manageTask.clickTaskLink(autoTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            expect(await activityTabPage.getApprovalActivityText('Task was self-approved')).toBeTruthy();
        });

        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteApprovalMapping(taskApprovalMappingRecordDefinition);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

}); 