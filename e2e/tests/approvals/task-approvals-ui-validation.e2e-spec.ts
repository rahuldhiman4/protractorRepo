import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import approvalConfigurationPage from "../../pageobject/settings/approval/approval-configuration.po";
import activityTabPage from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import showApproversBladePo from "../../pageobject/common/show-approvers-list-tab.po";
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import approvalMappingConsolePage from "../../pageobject/settings/task-management/approval-mapping-console.po";
import createApprovalMappingPage from "../../pageobject/settings/task-management/create-approval-mapping.po";
import utilCommon from '../../utils/util.common';
import { default as manageTask } from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import editApprovalMappingPage from "../../pageobject/settings/task-management/edit-approval-mapping.po";
import approvalConsolePage from "../../pageobject/approval/approvals-console.po";


let userData1 = undefined;
describe("Case Self Approval Tests", () => {
    const taskApprovalRecordDefinition = 'com.bmc.dsm.task-lib:Task';
    const taskMappingGuid = '59ccc726-2512-43ae-9806-c838be2665c3';
    let taskModule = 'Task';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(taskModule);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[DRDMV-21583]:[Task Approval] - Case General Approval - One Must Sign', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Task One Must Approval Flow' + randomStr;
        let caseData = undefined;
        let manualTaskTemplateData, autoTaskTemplateData, caseId, caseId2, manualTaskId, automatedTaskId = "";

        beforeAll(async () => {
            manualTaskTemplateData = {
                "templateName": `manualTaskTemplateDraft ${randomStr}`,
                "templateSummary": `One must approval for task ${randomStr}`,
                "templateStatus": "Active",
                "category1": 'Phones',
                "taskCompany": "Petramco",
                "buisnessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            autoTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `Automated Approval for task  ${randomStr}`,
                "templateStatus": "Active",
                "category1": 'Phones',
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "buisnessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz"
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

        it('[DRDMV-21583]:Create Self Approval Flow Without Process', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', 'Approval Configuration - Administration - Business Workflows');
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(taskApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit Approval Flow');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Approval Flows');
            await approvalConfigurationPage.clickApprovalGroup('Task Group');
            await approvalConfigurationPage.clickAddNewFlowLinkButton();
            await approvalConfigurationPage.selectApprovalFlowOption('General Approval Flow');
            expect(await approvalConfigurationPage.getNewApprovalFlowDefaultTitle()).toBe('Flow:New General Flow');
            await approvalConfigurationPage.editNewApprovalFlowDefaultTitle(approvalFlowName);
            await approvalConfigurationPage.selectMultipleApproversDropDownOption('One Must Approve');
            await approvalConfigurationPage.clickExpressionLink();
            await browser.sleep(5000); // sleep added for expression builder loading time
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create New Approval Flow');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Category Tier 1');
            await approvalConfigurationPage.clickRecordOption('Record Definition');
            await approvalConfigurationPage.clickRecordOption('Task');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); // sleep added for expression builder loading time
            await approvalConfigurationPage.clickExpressionOperatorLinkToSelectExpressionValue();
            await approvalConfigurationPage.selectExpressionValuesOptions('Categorization', 'Operational');
            await approvalConfigurationPage.searchFoundationDataToApprovalExpression('Phones');
            await approvalConfigurationPage.clickSelectLink();
            await approvalConfigurationPage.clickFoundationDataSaveButton();
            await approvalConfigurationPage.clickNewApprovalFlowSaveButton();
            await approvalConfigurationPage.clickSelectApproversLink();
            await approvalConfigurationPage.selectApproversForApproverFlow('Person', 'Katawazi');
            await approvalConfigurationPage.selectApproverSectionForGeneralApprovalFlow('Person');
            await approvalConfigurationPage.selectApproversForApproverFlow('Person', 'qliu');
            await approvalConfigurationPage.clickNewApprovalFlowSaveButton();
            await approvalConfigurationPage.clickApprovalFlowSaveButton();
            await approvalConfigurationPage.closeEditApprovalFlowPopUpWindow('Close');
        });

        it('[DRDMV-21583]:Create task approval mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approvals', 'Task Approval Mappings - Business Workflows');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName('Task Mapping for one must flow');
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

        it('[DRDMV-21583]:Create case and assign tasks to it', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();

            //Add Manual task and Automation Task in Case
            await manageTask.addTaskFromTaskTemplate(manualTaskTemplateData.templateName);
            await manageTask.waitUntilNumberOfTaskLinkAppear(1);
            expect(await manageTask.isTaskLinkPresent(manualTaskTemplateData.templateSummary)).toBeTruthy(manualTaskTemplateData.templateSummary + ' Task is not added to case');
            manualTaskId = await manageTask.getTaskDisplayIdFromManageTaskBlade();
            await manageTask.clickCloseButton();
        });

        it('[DRDMV-21583]: Verify if task approved is triggered for manual task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            await manageTask.clickTaskLink(manualTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            await navigationPage.signOut();
        });

        it('[DRDMV-21583]: Verify the task approval details', async () => {
            await loginPage.login('fritz');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(manualTaskId);
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
            expect(await showApproversBladePo.getApproversName('Qadim Katawazi')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversName('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isApproverPersonIconDisplayed('RA3 Liu')).toBeTruthy('Approver Person Icon is not displayed');
            expect(await showApproversBladePo.isAwaitingApproverIconDisplayed()).toBeTruthy('Awaiting approver icon is not displayed');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompany('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovalStatusLabel()).toContain('Awaiting Approval');
            await showApproversBladePo.clickApproversTab('Approval Decision');
            expect(await showApproversBladePo.getApproversCount()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        })

        it('[DRDMV-21583]: Approve the task with approver', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToJSApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(manualTaskTemplateData.templateSummary, 'Approve');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(manualTaskId);
            expect(await viewTask.getTaskStatusValue()).toBe("In Progress");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
            expect(await activityTabPage.getApprovalActivityText('Task was approved')).toBeTruthy();
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(2);
            expect(await showApproversBladePo.getApproversNameFromActivity('Qadim Katawazi')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversNameFromActivity('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabelFromActivity()).toContain('Approved');
            expect(await showApproversBladePo.getClosedApprovalStatusLabelFromActivity('Closed')).toContain('Closed');
            expect(await showApproversBladePo.isClosedApproverIconDisplayedFromActivity()).toBeTruthy('Closed icon button on Approver List blade is not displayed');
            expect(await showApproversBladePo.isApprovedApproverIconDisplayedFromActivity()).toBeTruthy('Approved button on Approver List blade is not displayed');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(taskModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });




}); 