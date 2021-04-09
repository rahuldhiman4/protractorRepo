import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import approvalConsolePage from "../../pageobject/approval/approvals-console.po";
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import showApproversBladePo from "../../pageobject/common/show-approvers-list-tab.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import activityTabPage from '../../pageobject/social/activity-tab.po';
import manageTaskBladePo from "../../pageobject/task/manage-task-blade.po";
import manageTaskPo from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from "../../pageobject/task/view-task.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

let userData1 = undefined;
describe("Task Approval Tests", () => {
    const taskModule = 'Task';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(taskModule);
        userData1 = {
            "firstName": "Petramco",
            "lastName": "SGUser1",
            "userId": "21827user1",
            "userPermission": ["Case Business Analyst", "Human Resource"]
        }
        // await apiHelper.createNewUser(userData1);
        // await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
        // await apiHelper.associatePersonToSupportGroup(userData1.userId, "US Support 3");

    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    }); 

    describe('[3590]:[Task Approval] - Case General Approval - All Must Sign', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId, caseData, automatedTaskDisplayId, approvalMappingResponse, approvalMappingData;
        let caseTemplateData, autoTaskTemplateData, automatedTask, caseTemplate;
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
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }

            autoTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `Automated Approval for task  ${randomStr}`,
                "templateStatus": "Active",
                "category1": 'Workforce Administration',
                "category2": 'HR Operations',
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
            }

            // Create case template which will be changed to Inactive status
            await apiHelper.apiLogin('qkatawazi');
            caseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            // Create case template which will be removed from approval mappling after approval is triggered
            automatedTask = await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(caseTemplate.displayId, automatedTask.displayId);
            // Create Approval Flow through API
            let approvalFlows = {
                "flowName": 'Approval Flow1' + randomStr,
                "approver": "qliu;qkatawazi",
                "isLevelUp": false,
                "qualification": `'Category Tier 1' = "Workforce Administration" AND 'Category Tier 2' = "HR Operations"`,
                "precedence": 0,
                "signingCriteria": 1,
            }

            await apiHelper.createApprovalFlow(approvalFlows, taskModule);

            //Create Approval Mapping through API
            approvalMappingData = {
                "triggerStatus": "Assigned",
                "errorStatus": "Canceled",
                "approvedStatus": "InProgress",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
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

            await apiHelper.apiLogin('qtao');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
        });

        it('[3590]:Create case and assign tasks to it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(autoTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
        });

        it('[3590]: Verify the task approval details', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :2');
            await viewTask.clickShowApproversLink();
            expect(await showApproversBladePo.isShowApproversBladeDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabel()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabel('Pending Approval')).toContain('Pending Approval (2)');
            expect(await showApproversBladePo.getApproversTabLabel('Approval Decision')).toContain('Approval Decision (0)');
            expect(await showApproversBladePo.getApprovalsHelpTextOnShowApproversBlade()).toContain('All of the following people must approve this case:');
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
            await utilityCommon.closeAllBlades();
        })

        it('[3590]: Approve the task with approver and verify the details', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(autoTaskTemplateData.templateSummary, 'Approve');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewTask.getApprovedApproversInfo()).toContain('Approved :1');
            await viewTask.clickShowApproversLink();
            expect(await showApproversBladePo.isShowApproversBladeDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabel()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabel('Pending Approval')).toContain('Pending Approval (1)');
            expect(await showApproversBladePo.getApproversTabLabel('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApprovalsHelpTextOnShowApproversBlade()).toContain('All of the following people must approve this case:');
            expect(await showApproversBladePo.getApproversCount()).toBe(1);
            expect(await showApproversBladePo.getApproversName('Qadim Katawazi')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isApproverPersonIconDisplayed('Qadim Katawazi')).toBeTruthy('Approver Person Icon is not displayed');
            expect(await showApproversBladePo.isAwaitingApproverIconDisplayed()).toBeTruthy('Awaiting approver icon is not displayed');
            expect(await showApproversBladePo.getApproversCompany('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovalStatusLabel()).toContain('Awaiting Approval');
            await showApproversBladePo.clickApproversTab('Approval Decision');
            expect(await showApproversBladePo.getApproversCount()).toBe(1);
            expect(await showApproversBladePo.getApproversName('Qiwei Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isApproverPersonIconDisplayed('Qiwei Liu')).toBeTruthy('Approver Person Icon is not displayed');
            expect(await showApproversBladePo.isApprovedApproverIconDisplayed()).toBeTruthy('Approved icon is not displayed');
            expect(await showApproversBladePo.getApproversCompany('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabel()).toContain('Approved');
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
            await utilityCommon.closeAllBlades();
        });

        it('[3590]:Verify the approvals details on task activity', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(autoTaskTemplateData.templateSummary, 'Approve');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.getApprovalActivityText('Task was approved')).toBeTruthy();
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (2)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(2);
            expect(await showApproversBladePo.getApproversNameFromActivity('Qadim Katawazi')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversNameFromActivity('Qiwei Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabelFromActivity()).toContain('Approved');
            expect(await showApproversBladePo.isApprovedApproverIconDisplayedFromActivity()).toBeTruthy('Approved button on Approver List blade is not displayed');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
            await utilityCommon.closeAllBlades();
        });

        it('[3590]:Verify the approvals details on task activity after case rejection', async () => {
            await apiHelper.apiLogin('qtao');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.clickOnTaskLink(autoTaskTemplateData.templateSummary);
            automatedTaskDisplayId = await viewTask.getTaskID();
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(autoTaskTemplateData.templateSummary, 'Reject');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Approval Rejected");
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.getApprovalRejectionActivityText('Task was rejected')).toBeTruthy();
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (2)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(2);
            expect(await showApproversBladePo.getApproversNameFromActivity('Qadim Katawazi')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversNameFromActivity('Qiwei Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getClosedApprovalStatusLabelFromActivity('Rejected')).toContain('Rejected');
            expect(await showApproversBladePo.getClosedApprovalStatusLabelFromActivity('Closed')).toContain('Closed');
            expect(await showApproversBladePo.isClosedApproverIconDisplayedFromActivity()).toBeTruthy('Closed icon button on Approver List blade is not displayed');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(taskModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[3588]:[Task Approval] - Level Up Approval', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId, caseData, automatedTaskDisplayId, approvalMappingResponse, approvalMappingData;
        let caseTemplateData, autoTaskTemplateData, automatedTask, caseTemplate;
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

            autoTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `Automated Approval for task  ${randomStr}`,
                "templateStatus": "Active",
                "category1": 'Workforce Administration',
                "category2": 'HR Operations',
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }

            await apiHelper.apiLogin('qkatawazi');
            caseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            automatedTask = await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(caseTemplate.displayId, automatedTask.displayId);
            // Create Approval Flow through API
            let approvalFlows = {
                "flowName": 'Approval Flow1' + randomStr,
                "qualification": `'Category Tier 1' = "Workforce Administration" AND 'Category Tier 2' = "HR Operations"`,
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
                "rejectStatus": "Canceled",
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

            await apiHelper.apiLogin('qtao');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
        });

        it('[3588]:Create case and assign tasks to it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.clickOnTaskLink(autoTaskTemplateData.templateSummary);
            automatedTaskDisplayId = await viewTask.getTaskID();
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
        });

        it('[3588]: Verify the task approval details', async () => {
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
            expect(await showApproversBladePo.getApproversCount()).toBe(1);
            expect(await showApproversBladePo.getApproversName('Qiwei Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isApproverPersonIconDisplayed('Qiwei Liu')).toBeTruthy('Approver Person Icon is not displayed');
            expect(await showApproversBladePo.isAwaitingApproverIconDisplayed()).toBeTruthy('Awaiting approver icon is not displayed');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompany('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovalStatusLabel()).toContain('Awaiting Approval');
            await showApproversBladePo.clickApproversTab('Approval Decision');
            expect(await showApproversBladePo.getApproversCount()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
            await utilityCommon.closeAllBlades();
        })

        it('[3588]: Approve the task with approver', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(autoTaskTemplateData.templateSummary, 'Approve');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.getApprovalActivityText('Task was approved')).toBeTruthy();
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(1);
            expect(await showApproversBladePo.getApproversNameFromActivity('Qiwei Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabelFromActivity()).toContain('Approved');
            expect(await showApproversBladePo.isApprovedApproverIconDisplayedFromActivity()).toBeTruthy('Approved button on Approver List blade is not displayed');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
            await utilityCommon.closeAllBlades();
        });

        it('[3588]:Verify the approvals details on case activity after task rejection', async () => {
            await apiHelper.apiLogin('qtao');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.clickOnTaskLink(autoTaskTemplateData.templateSummary);
            automatedTaskDisplayId = await viewTask.getTaskID();
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(autoTaskTemplateData.templateSummary, 'Reject');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Approval Rejected");
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.getApprovalRejectionActivityText('Task was rejected')).toBeTruthy();
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(1);
            expect(await showApproversBladePo.getApproversNameFromActivity('Qiwei Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getClosedApprovalStatusLabelFromActivity('Rejected')).toContain('Rejected');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(taskModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[3475]:Trigger the Approval and Approve the Task from Task View', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId, caseData, automatedTaskDisplayId, approvalMappingResponse, approvalMappingData;
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
                "buisnessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }

            await apiHelper.apiLogin('qkatawazi');
            caseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            automatedTask = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(caseTemplate.displayId, automatedTask.displayId);
            // Create Approval Flow through API
            let approvalFlows = {
                "flowName": 'Approval Flow1' + randomStr,
                "approver": "qliu;qkatawazi",
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
                "approvedStatus": "InProgress",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
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
            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
        });

        it('[3475]:Create case and assign tasks to it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
        });

        it('[3475]: Verify the task approval details', async () => {
            await viewCasePo.clickOnTaskLink(manualTaskTemplateData.templateSummary);
            automatedTaskDisplayId = await viewTask.getTaskID();
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
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
            expect(await showApproversBladePo.getApproversName('Qadim Katawazi')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversName('Qiwei Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isApproverPersonIconDisplayed('Fritz Schulz')).toBeTruthy('Approver Person Icon is not displayed');
            expect(await showApproversBladePo.isAwaitingApproverIconDisplayed()).toBeTruthy('Awaiting approver icon is not displayed');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompany('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovalStatusLabel()).toContain('Awaiting Approval');
            await showApproversBladePo.clickApproversTab('Approval Decision');
            expect(await showApproversBladePo.getApproversCount()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
            await utilityCommon.closeAllBlades();
        })

        it('[3475]: Verify the task approval details on task view and Approve the task with approver', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewTask.isApprovalButtonsPresent('Approve')).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.isApprovalButtonsPresent('Reject')).toBeTruthy('Show Approvers Banner is not displayed');
            await viewTask.clickOnApproveLink();
            await viewTask.clickOnViewCase();
            await viewCasePo.clickOnTaskLink(manualTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("In Progress");
            await activityTabPage.clickOnRefreshButton();
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
            expect(await showApproversBladePo.isApprovedApproverIconDisplayedFromActivity()).toBeTruthy('Approved button on Approver List blade is not displayed');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
            await utilityCommon.closeAllBlades();
        });

        it('[3475]:Create case and assign tasks to it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("In Progress");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
            await apiHelper.apiLogin('qkatawazi');
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
            await viewCasePo.clickOnTaskLink(manualTaskTemplateData.templateSummary);
            automatedTaskDisplayId = await viewTask.getTaskID();
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
        });

        it('[3475]: Verify the task approval details on task approval rejection', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Pending");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewTask.isApprovalButtonsPresent('Approve')).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewTask.isApprovalButtonsPresent('Reject')).toBeTruthy('Show Approvers Banner is not displayed');
            await viewTask.clickOnRejectLink();
            await viewTask.clickOnViewCase();
            await viewCasePo.clickOnTaskLink(manualTaskTemplateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Canceled");
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.getApprovalRejectionActivityText('Task was rejected')).toBeTruthy();
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
            expect(await showApproversBladePo.getClosedApprovalStatusLabelFromActivity('Rejected')).toContain('Rejected');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(automatedTaskDisplayId);
            expect(await viewTask.getTaskStatusValue()).toBe("Canceled");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(taskModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[3548]:[-ve] [Task Approval] - Task Level Up Approval when Requester does not have Manager', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId, caseId1, caseData, caseData1, automatedTaskDisplayId, approvalMappingResponse, approvalMappingData, externaltemplateData;
        let caseTemplateData, caseTemplateData1, externalTaskTemplate, autoTaskTemplateData, automatedTask, caseTemplate, caseTemplate1;
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

            caseTemplateData1 = {
                "templateName": 'Case Template for Approval' + randomStr,
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

            autoTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `Automated Approval for task  ${randomStr}`,
                "templateStatus": "Active",
                "category1": 'Workforce Administration',
                "category2": 'HR Operations',
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
            }

            externaltemplateData = {
                "templateName": 'External task19011' + randomStr,
                "templateSummary": 'External task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "category1": 'Workforce Administration',
                "category2": 'HR Operations',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }

            // Create case template which will be changed to Inactive status
            await apiHelper.apiLogin('qkatawazi');
            caseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            automatedTask = await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);
            caseTemplate1 = await apiHelper.createCaseTemplate(caseTemplateData1);
            externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externaltemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(caseTemplate.displayId, automatedTask.displayId);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(caseTemplate1.displayId, externalTaskTemplate.displayId);

            // Create Approval Flow through API
            let approvalFlows = {
                "flowName": 'Approval Flow1' + randomStr,
                "qualification": `'Category Tier 1' = "Workforce Administration" AND 'Category Tier 2' = "HR Operations"`,
                "precedence": 0,
                "isLevelUp": true,
                "levels": 1,
            }

            await apiHelper.apiLogin('qkatawazi');
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
            await apiHelper.associateTemplateWithApprovalMapping(taskModule, automatedTask.id, approvalMappingResponse.id);
            await apiHelper.associateTemplateWithApprovalMapping(taskModule, externalTaskTemplate.id, approvalMappingResponse.id);

            caseData = {
                "Requester": "zculloden",
                "Summary": "Automated One must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplate.displayId
            }

            await apiHelper.apiLogin('qtao');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;

            caseData1 = {
                "Requester":"zculloden",
                "Summary": "Automated One must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplate1.displayId
            }
            newCase = await apiHelper.createCase(caseData1);
            caseId1 = newCase.displayId;
        });

        it('[3548]:Trigger task based approval for automated task and verify error status', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await viewCasePo.clickOnTaskLink(autoTaskTemplateData.templateSummary);
            automatedTaskDisplayId = await viewTask.getTaskID();
            let taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe("Approval Rejected");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
            expect(await activityTabPage.getApprovalErrorActivityText('An error occurred during approval')).toBeTruthy('Show Approvers Banner is not displayed');

        });

        it('[3548]: trigger task based approval for external / manual task and verify error status', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId1);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId1); // navigation requried to reflect updated task status
            await viewCasePo.clickOnTaskLink(externaltemplateData.templateSummary);
            automatedTaskDisplayId = await viewTask.getTaskID();
            expect(await viewTask.getTaskStatusValue()).toBe("Canceled");
            expect(await viewTask.isShowApproversBannerDisplayed()).toBeFalsy('Show Approvers Banner is not displayed');
            expect(await activityTabPage.getApprovalErrorActivityText('An error occurred during approval')).toBeTruthy('Show Approvers Banner is not displayed');
        })

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(taskModule);
        });
    });
}); 
