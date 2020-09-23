import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { ICaseTemplate } from '../../data/api/interface/case.template.interface.api';
import approvalConsolePage from "../../pageobject/approval/approvals-console.po";
import editCasePo from '../../pageobject/case/edit-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import showApproversBladePo from "../../pageobject/common/show-approvers-list-tab.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import approvalConfigurationPage from "../../pageobject/settings/approval/approval-configuration.po";
import activityTabPage from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

let userData1 = undefined;
const caseApprovalRecordDefinition = 'com.bmc.dsm.case-lib:Case';
let caseModule = 'Case';

describe("Case General Approval Tests", () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(caseModule);
        userData1 = {
            "firstName": "Petramco",
            "lastName": "SGUser1",
            "userId": "10843User1",
            "userPermission": "Case Business Analyst",
        }
        await apiHelper.createNewUser(userData1);
        await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(userData1.userId, "US Support 3");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //skhobrag
    describe('[DRDMV-10843]:[Approval] - Case Level Up Approval when Requester does not have Manager', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Approval Flow' + randomStr;
        let caseData = undefined;
        let caseId: string;
        let approvalMappingData = undefined;

        beforeAll(async () => {
            // Create Case Template through API
            let caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated Level Up Approval without process',
                "categoryTier1": 'Applications',
                "casePriority": "Critical",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }

            await apiHelper.apiLogin('qkatawazi');
            let caseTemplateWithMatchingSummaryResponse = await apiHelper.createCaseTemplate(caseTemplateDataWithMatchingCriteria);
            let caseTemplateDisplayId = caseTemplateWithMatchingSummaryResponse.displayId;

            //Create Approval Mapping through API
            approvalMappingData = {
                "triggerStatus": "Assigned",
                "errorStatus": "New",
                "approvedStatus": "InProgress",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
                "company": "Petramco",
                "mappingName": "Approval Mapping for Self Approval"
            }
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule, approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": userData1.userId,
                "Summary": "Automated Self Approval with process",
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
        });

        it('[DRDMV-10843]:Create Level Up Approval Flow Without Process', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', 'Approval Configuration - Administration - Business Workflows');
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(caseApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit Approval Flow');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Approval Flows');
            await approvalConfigurationPage.clickApprovalGroup('BWFA Group');
            await approvalConfigurationPage.clickAddNewFlowLinkButton();
            await approvalConfigurationPage.selectApprovalFlowOption('Level Up Approval Flow');
            expect(await approvalConfigurationPage.getNewApprovalFlowDefaultTitle()).toBe('Flow:New Level Flow');
            await approvalConfigurationPage.editNewApprovalFlowDefaultTitle(approvalFlowName);
            await approvalConfigurationPage.setNoOfLevels('1');
            await approvalConfigurationPage.clickExpressionLink();
            await browser.sleep(5000); // sleep added for expression builder loading time
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create New Approval Flow');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Category Tier 1');
            await approvalConfigurationPage.clickRecordOption('Record Definition');
            await approvalConfigurationPage.clickRecordOption('Case');
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); // sleep added for expression builder loading time
            await approvalConfigurationPage.clickExpressionOperatorLinkToSelectExpressionValue();
            await approvalConfigurationPage.selectExpressionValuesOptions('Categorization', 'Operational');
            await approvalConfigurationPage.searchFoundationDataToApprovalExpression('Applications');
            await approvalConfigurationPage.clickSelectLink();
            await approvalConfigurationPage.clickFoundationDataSaveButton();
            await approvalConfigurationPage.clickNewApprovalFlowSaveButton();
            await approvalConfigurationPage.clickApprovalFlowSaveButton();
            await approvalConfigurationPage.closeEditApprovalFlowPopUpWindow('Close');
        });

        it('[DRDMV-10843]:Case Level Up Approval when Requester does not have Manager', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("New");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('An error occurred during approval');
        });

        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //skhobrag
    describe('[DRDMV-1371,DRDMV-22257]:[Approval] Approval details when case canceled not being approved', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Approval Flow' + randomStr;
        let approvalMappingData = undefined, caseData = undefined, caseId: string, caseTemplateDataWithMatchingCriteria: ICaseTemplate;

        beforeAll(async () => {
            // Create Case Template through API
            caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'Case Template Summary',
                "categoryTier1": 'Phones',
                "categoryTier2": 'Infrastructure',
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }

            await apiHelper.apiLogin('qkatawazi');
            let caseTemplateWithMatchingSummaryResponse = await apiHelper.createCaseTemplate(caseTemplateDataWithMatchingCriteria);

            let approvalFlowData = {
                "flowName": `Approval FLow ${randomStr}`,
                "approver": "qliu;qkatawazi",
                "qualification": "'Category Tier 1' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.d05a0ef4c11d0ecd132117631142e79341b678f18b3dc1b569544d6f09b085960cd750cef35ce6b4393d6900184a519f9233807bb6187d3961f0fff43adc553f.304405421} AND 'Category Tier 2' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.a98e71fb172dbf594abbfae7cfe2114dded55c95efbfe6e2594137d94af12686911bed8da886fadca5c821fea4f942efa89f3aa072ee088232336bad5f4f8f06.304405421}"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createApprovalFlow(approvalFlowData, caseModule);

            //Create Approval Mapping through API
            approvalMappingData = {
                "triggerStatus": "Assigned",
                "errorStatus": "New",
                "approvedStatus": "InProgress",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
                "company": "Petramco",
                "mappingName": "Approval Mapping for One Must Approval"
            }
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule, approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated One must Approval Case",
            }
        });

        it('[DRDMV-1371,DRDMV-22257]:Create a case and verify Show Approvers Blade information', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            // Edit case and select case template for DRDMV-22257
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("New");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeFalsy('Approval is triggerd');
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataWithMatchingCriteria.templateName);
            await editCasePo.clickSaveCase();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewCasePo.getShowPendingApproversInfo()).toContain('Pending Approval :1');
        });

        it('[DRDMV-1371,DRDMV-22257]:Cancel the case and verify the case details', async () => {
            await updateStatusBladePo.changeCaseStatus('Canceled');
            await updateStatusBladePo.setStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus('Canceled');
            expect(await viewCasePo.getTextOfStatus()).toBe('Canceled');
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was cancelled');
        });

        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //skhobrag
    describe('[DRDMV-10832]:[Approval] - Case Re Approval after Rejection', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Approval Flow' + randomStr;
        let caseSummary = "Automated One must Approval Case" + randomStr;
        let caseData = undefined;
        let caseId: string;
        let approvalMappingData = undefined;

        beforeAll(async () => {

            // Create Case Template through API
            let caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated One must Approval Case' + randomStr,
                "categoryTier1": 'General Ledger',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }

            await apiHelper.apiLogin('qkatawazi');
            let caseTemplateWithMatchingSummaryResponse = await apiHelper.createCaseTemplate(caseTemplateDataWithMatchingCriteria);
            let caseTemplateDisplayId = caseTemplateWithMatchingSummaryResponse.displayId;

            //Create Approval Mapping through API
            approvalMappingData = {
                "triggerStatus": "Resolved",
                "errorStatus": "New",
                "approvedStatus": "Closed",
                "noApprovalFoundStatus": "Pending",
                "rejectStatus": "Assigned",
                "company": "Petramco",
                "mappingName": "Approval Mapping for One Must Approval"
            }
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule, approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated One must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
        });

        it('[DRDMV-10832]:Create One must approval configuration', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', 'Approval Configuration - Administration - Business Workflows');
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(caseApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit Approval Flow');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Approval Flows');
            await approvalConfigurationPage.clickApprovalGroup('BWFA Group');
            // await approvalConfigurationPage.deleteApprovalConfiguration('Approval Flows');
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
            await approvalConfigurationPage.clickRecordOption('Case');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); // sleep added for expression builder loading time
            await approvalConfigurationPage.clickExpressionOperatorLinkToSelectExpressionValue();
            await approvalConfigurationPage.selectExpressionValuesOptions('Categorization', 'Operational');
            await approvalConfigurationPage.searchFoundationDataToApprovalExpression('General Ledger');
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

        it('[DRDMV-10832]:Create a case and verify Show Approvers Blade information', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus('Resolved');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewCasePo.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            await viewCasePo.clickShowApproversLink();
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
        });

        it('[DRDMV-10832]:Reject the case and verify the case details', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToJSApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Reject');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was rejected');
        });

        it('[DRDMV-10832]:Verify the case rejection details on case activity', async () => {
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
            expect(await showApproversBladePo.getClosedApprovalStatusLabelFromActivity('Rejected')).toContain('Rejected');
            expect(await showApproversBladePo.getClosedApprovalStatusLabelFromActivity('Closed')).toContain('Closed');
            expect(await showApproversBladePo.isClosedApproverIconDisplayedFromActivity()).toBeTruthy('Closed icon button on Approver List blade is not displayed');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        it('[DRDMV-10832]:Update the case status to retrigger the approval and verify the details', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus('Resolved');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewCasePo.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            await viewCasePo.clickShowApproversLink();
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
        });

        it('[DRDMV-10832]:Approve the case and verify the case details', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToJSApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Approve');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Closed");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was approved');
        });

        it('[DRDMV-10832]:Verify the approvals details on case activity', async () => {
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
            await apiHelper.deleteApprovalMapping(caseModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    describe('[DRDMV-22256]:Case Template inactivated/removed from Approval mapping', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseInfo1, caseInfo2, caseData1, caseData2, approvalMappingResponse, approvalMappingData;
        let activeToInactiveTemplateData, removeAssociationTemplateData, activeToInactiveTemplate, removeAssociationTemplate;
        beforeAll(async () => {
            // Create Case Templates through API
            activeToInactiveTemplateData = {
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
            };
            removeAssociationTemplateData = {
                "templateName": 'RemoveAfterApprovalCaseTemplate_' + randomStr,
                "templateSummary": 'Case Template Summary2',
                "categoryTier1": 'Facilities',
                "categoryTier2": 'Restroom',
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            // Create case template which will be changed to Inactive status
            await apiHelper.apiLogin('qkatawazi');
            activeToInactiveTemplate = await apiHelper.createCaseTemplate(activeToInactiveTemplateData);
            // Create case template which will be removed from approval mappling after approval is triggered
            removeAssociationTemplate = await apiHelper.createCaseTemplate(removeAssociationTemplateData);
            //Create Approval Flow through API
            let approvalFlows = [
                {
                    "flowName": 'Approval Flow1' + randomStr,
                    "approvers": "U:qliu;qkatawazi",
                    "qualification": "'Category Tier 1' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.bccb0487dc2fab9e5052c16c67f647df8ce68a989fd53a4999763c5a336e5b79c83b8ba8108907851a28e035b87c73ae2f086df65912d77eff8e21299d90c32c.304405421} AND 'Category Tier 2' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.8c700e7edba91d3091aed763ab1c3c0bcf1c44c8c8776d53fa6bc76b6ff78bb48f106c210f41c330a2c42af0daab956847e9712a4a8822b8c571e5b97eec1bf5.304405421}",
                    "precedence": 1,
                    "signingCriteria": 0,
                    "approvalFlowOutcomeMappingList": [

                    ]
                },
                {
                    "flowName": 'Approval Flow2' + randomStr,
                    "approvers": "U:qliu;qkatawazi",
                    "qualification": "'Category Tier 1' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.bccb0487dc2fab9e5052c16c67f647df8ce68a989fd53a4999763c5a336e5b79c83b8ba8108907851a28e035b87c73ae2f086df65912d77eff8e21299d90c32c.304405421} AND 'Category Tier 2' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.5210cb25d5359c0d18bbedf989946c0c825d93b842ada3b854efca277e78b52c951fdc5ded083e9b854fe570df6441ec3616f81c783cd7450871c9c8f66c5a2b.304405421}",
                    "precedence": 2,
                    "signingCriteria": 0,
                    "approvalFlowOutcomeMappingList": [

                    ]
                }
            ]
            await apiHelper.createApprovalFlow(approvalFlows, caseModule, true);

            //Create Approval Mapping through API
            approvalMappingData = {
                "triggerStatus": "Assigned",
                "errorStatus": "New",
                "approvedStatus": "InProgress",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
                "company": "Petramco",
                "mappingName": "Approval Mapping for One Must Approval"
            }
            approvalMappingResponse = await apiHelper.createApprovalMapping(caseModule, approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,activeToInactiveTemplate.id, approvalMappingResponse.id);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,removeAssociationTemplate.id, approvalMappingResponse.id);
            caseData1 = {
                "Requester": "qdu",
                "Summary": "Active to Inactive Case1 " + randomStr,
                "Origin": "Agent",
                "Case Template ID": activeToInactiveTemplate.displayId
            }
            caseData2 = {
                "Requester": "qdu",
                "Summary": "Remove association Case2 " + randomStr,
                "Origin": "Agent",
                "Case Template ID": removeAssociationTemplate.displayId
            }
        });
        it('[DRDMV-22256]:Verify Case1 and Case2 enters approval cycle', async () => {
            await apiHelper.apiLogin('qfeng');
            caseInfo1 = await apiHelper.createCase(caseData1);
            caseInfo2 = await apiHelper.createCase(caseData2);

            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseInfo1.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewCasePo.getShowPendingApproversInfo()).toContain('Pending Approval :1');

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseInfo2.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewCasePo.getShowPendingApproversInfo()).toContain('Pending Approval :1');
        });
        it('[DRDMV-22256]:Change case template1 to Inactive and remove case template2 from approval mapping', async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.updateCaseTemplateStatus(activeToInactiveTemplate.id, "Inactive");
            await apiHelper.disassociateCaseTemplateFromApprovalMapping(removeAssociationTemplate.id, approvalMappingResponse.id);
        });
        it('[DRDMV-22256]:Create cases with association removed case template', async () => {
            await apiHelper.apiLogin('qfeng');
            caseData2.Summary = "Remove association Case3 " + randomStr;
            let caseInfo3 = await apiHelper.createCase(caseData2);

            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseInfo3.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeFalsy('Approval is triggered');
        });
        it('[DRDMV-22256]:Approve Case1, Reject Case2', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseInfo1.displayId);
            await viewCasePo.clickOnApproveLink();
            await navigationPage.gotoCaseConsole(); // navigation to reflect post approve changes
            await utilityGrid.searchAndOpenHyperlink(caseInfo1.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("In Progress");

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseInfo2.displayId);
            await viewCasePo.clickOnRejectLink();
            await navigationPage.gotoCaseConsole(); // navigation to reflect post reject changes
            await utilityGrid.searchAndOpenHyperlink(caseInfo2.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Canceled");
        });
        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});