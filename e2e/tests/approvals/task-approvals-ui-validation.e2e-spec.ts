import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import approvalConsolePage from "../../pageobject/approval/approvals-console.po";
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
import manageTaskPo from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe("Task Approval UI Validations", () => {
    const taskApprovalRecordDefinition = 'com.bmc.dsm.task-lib:Task';
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

    describe('[3591]:[Task Approval] - Case General Approval - One Must Sign', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Task One Must Approval Flow' + randomStr;
        let caseData = undefined;
        let manualTaskTemplateData, autoTaskTemplateData, caseId, manualTaskId;

        beforeAll(async () => {
            manualTaskTemplateData = {
                "templateName": `manualTaskTemplateDraft ${randomStr}`,
                "templateSummary": `One must approval for task ${randomStr}`,
                "templateStatus": "Active",
                "category1": 'Workforce Administration',
                "taskCompany": "Petramco",
                "buisnessUnit": "United Kingdom Support",
                "supportGroup": "GB Support 2",
                "assignee": "qstrong",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United Kingdom Support",
                "ownerGroup": "GB Support 2"
            }
            autoTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `Automated Approval for task  ${randomStr}`,
                "templateStatus": "Active",
                "category1": 'Workforce Administration',
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "buisnessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi"
            }
            caseData = {
                "Requester": "Fritz",
                "Summary": "Test case for inProgress task",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
        })

        it('[3591]:Create One Must Approval Flow For Task', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', BWF_PAGE_TITLES.APPROVALS.APPROVAL_CONFIGURATION);
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(taskApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Approval configurations');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Approval flows ');
            await approvalConfigurationPage.clickApprovalGroup('Task Group');
            await approvalConfigurationPage.clickAddGeneralFlowButton();
            expect(await approvalConfigurationPage.getNewApprovalFlowDefaultTitle()).toBe('General flow');
            await approvalConfigurationPage.editNewApprovalFlowDefaultTitle(approvalFlowName);
            await approvalConfigurationPage.selectMultipleApproversDropDownOption('One must approve');
            await approvalConfigurationPage.clickExpressionLink();
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit expression');
            await approvalConfigurationPage.clickOnMenuItem('Record definition');
            await approvalConfigurationPage.clickOnMenuItem('Task');        
            await approvalConfigurationPage.selectExpressionFieldOption('Category Tier 1');
            await approvalConfigurationPage.selectExpressionOperator('=');
            await approvalConfigurationPage.setExpressionValueForParameter('"Workforce Administration"');
            await approvalConfigurationPage.clickModelOkButton();
            await approvalConfigurationPage.clickSelectApproversLink();
            await approvalConfigurationPage.selectApproverSectionForGeneralApprovalFlow('People');
            await approvalConfigurationPage.selectApproversForApproverFlow('People', 'Katawazi');
            await approvalConfigurationPage.clickSelectApproversLink();
            await approvalConfigurationPage.selectApproverSectionForGeneralApprovalFlow('People');
            await approvalConfigurationPage.selectApproversForApproverFlow('People', 'qliu');
            await approvalConfigurationPage.clickNewApprovalFlowSaveButton();
            await approvalConfigurationPage.clickApprovalFlowCloseButton();
        });

        it('[3591]:Create task approval mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approval Mappings', BWF_PAGE_TITLES.TASK_MANAGEMENT.APPROVALS);
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Create Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName('Task Mapping for one must flow');
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

        it('[3591]:Create case and assign tasks to it', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await viewCasePo.clickAddTaskButton();
            await manageTaskPo.addTaskFromTaskTemplate(manualTaskTemplateData.templateName);
            await manageTaskPo.waitUntilNumberOfTaskLinkAppear(1);
            expect(await manageTaskPo.isTaskLinkPresent(manualTaskTemplateData.templateSummary)).toBeTruthy(manualTaskTemplateData.templateSummary + ' Task is not added to case');
            manualTaskId = await manageTaskPo.getTaskDisplayId();
            await manageTaskPo.clickCloseButton();
        });

        it('[3591]: Verify if task approved is triggered for manual task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.openTaskCard(1);
            await manageTaskPo.clickTaskLink(manualTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            await navigationPage.signOut();
        });

        it('[3591]: Verify the task approval details', async () => {
            await loginPage.login('qstrong');
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
            expect(await showApproversBladePo.getApproversName('Qiwei Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isApproverPersonIconDisplayed('Qiwei Liu')).toBeTruthy('Approver Person Icon is not displayed');
            expect(await showApproversBladePo.isAwaitingApproverIconDisplayed()).toBeTruthy('Awaiting approver icon is not displayed');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompany('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovalStatusLabel()).toContain('Awaiting Approval');
            await showApproversBladePo.clickApproversTab('Approval Decision');
            expect(await showApproversBladePo.getApproversCount()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        })

        it('[3591]: Approve the task with approver', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(manualTaskTemplateData.templateSummary, 'Approve');
            await navigationPage.signOut();
            await loginPage.login('qstrong');
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
            expect(await showApproversBladePo.getApproversNameFromActivity('Qiwei Liu')).toBeTruthy('Approver not present');
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
        });
    });
});
