import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import approvalConsolePage from "../../pageobject/approval/approvals-console.po";
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

describe("Case Level Up Approval Tests", () => {
    const caseApprovalRecordDefinition = 'com.bmc.dsm.case-lib:Case';
    const caseApprovalMappingRecordDefinition = 'com.bmc.dsm.case-lib:Case Approval Mapping';
    let caseModule = 'Case';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(caseModule);
        await apiHelper.apiLogin('tadmin');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //skhobrag
    describe('[DRDMV-16542]:Verify Manager Approval Flow - Approve Reject Approve', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Approval Flow' + randomStr;
        let caseSummary = "Automated Manager Level Approval" + randomStr;
        let caseData = undefined;
        let caseId: string;
        let approvalMappingData = undefined;
        let caseTemplateDataWithMatchingCriteria;
        beforeAll(async () => {
            // Create Case Template through API
            caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated Level Up Approval without process',
                "categoryTier1": 'Workforce Administration',
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
                "triggerStatus": "InProgress",
                "errorStatus": "New",
                "approvedStatus": "Resolved",
                "noApprovalFoundStatus": "Pending",
                "rejectStatus": "ApprovalRejected",
                "company": "Petramco",
                "mappingName": "Approval Mapping for Manager Level Approval"
            }
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule,approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated Manager Level Approval" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
        });

        it('[DRDMV-16542]:Create Level Up Approval Flow', async () => {
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
            await browser.sleep(5000); //Sleep added for expression builder loading
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create New Approval Flow');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Category Tier 1');
            await browser.sleep(1000); //Sleep added for expression builder loading
            await approvalConfigurationPage.clickRecordOption('Record Definition');
            await approvalConfigurationPage.clickRecordOption('Case');
            await browser.sleep(2000); //Sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); //Sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); //Sleep added for expression builder loading
            await approvalConfigurationPage.clickExpressionOperatorLinkToSelectExpressionValue();
            await approvalConfigurationPage.selectExpressionValuesOptions('Categorization', 'Operational');
            await approvalConfigurationPage.searchFoundationDataToApprovalExpression(caseTemplateDataWithMatchingCriteria.categoryTier1);
            await approvalConfigurationPage.clickSelectLink();
            await approvalConfigurationPage.clickFoundationDataSaveButton();
            await approvalConfigurationPage.clickNewApprovalFlowSaveButton();
            await approvalConfigurationPage.clickApprovalFlowSaveButton();
            await approvalConfigurationPage.closeEditApprovalFlowPopUpWindow('Close');
        });

        it('[DRDMV-16542]:Create a case and verify approval details on case', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
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
            expect(await showApproversBladePo.getApproversCount()).toBe(1);
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

        it('[DRDMV-16542]:approve the created case and verify the approval details on case', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToJSApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Approve');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Resolved");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was approved');
        });

        it('[DRDMV-16542]:Verify the approvals details on case activity after case approved', async () => {
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(1);
            expect(await showApproversBladePo.getApproversNameFromActivity('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabelFromActivity()).toContain('Approved');
            expect(await showApproversBladePo.isApprovedApproverIconDisplayedFromActivity()).toBeTruthy('Approved button on Approver List blade is not displayed');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        it('[DRDMV-16542]:update the case status to approval trigger status and see if approval is triggered', async () => {
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus('Assigned');
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToJSApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Reject');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePo.getTextOfStatus()).toBe("Approval Rejected");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was rejected');
        });

        it('[DRDMV-16542]:Verify the case details after the case is rejected', async () => {
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(1);
            expect(await showApproversBladePo.getApproversNameFromActivity('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getClosedApprovalStatusLabelFromActivity('Rejected')).toContain('Rejected');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        it('[DRDMV-16542]:update the case status to approval trigger status and see if approval is triggered', async () => {
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus('Assigned');
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToJSApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Approve');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Resolved");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was approved');
        });

        it('[DRDMV-16542]:Verify the approvals details on case activity', async () => {
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(1);
            expect(await showApproversBladePo.getApproversNameFromActivity('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabelFromActivity()).toContain('Approved');
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

    //skhobrag
    describe('[DRDMV-10833]:[Approval] - Case Re Approval by moving Case Status back to Trigger status', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Approval Flow' + randomStr;
        let caseSummary = "Automated General Level Approval" + randomStr;
        let caseData = undefined;
        let caseId: string;
        let approvalMappingData = undefined;
        let caseTemplateDataWithMatchingCriteria;
        beforeAll(async () => {
            // Create Case Template through API
            caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated General Approval without process',
                "categoryTier1": 'Talent Management',
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
                "triggerStatus": "InProgress",
                "errorStatus": "New",
                "approvedStatus": "Resolved",
                "noApprovalFoundStatus": "Pending",
                "rejectStatus": "ApprovalRejected",
                "company": "Petramco",
                "mappingName": "Approval Mapping for General Level Approval"
            }
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule,approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated General Level Approval" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
        });

        it('[DRDMV-10833]:Create General Approval Flow', async () => {
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
            await browser.sleep(5000); //Sleep added for expression builder loading
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create New Approval Flow');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Category Tier 1');
            await approvalConfigurationPage.clickRecordOption('Record Definition');
            await approvalConfigurationPage.clickRecordOption('Case');
            await browser.sleep(2000); //Sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); //Sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); //Sleep added for expression builder loading
            await approvalConfigurationPage.clickExpressionOperatorLinkToSelectExpressionValue();
            await approvalConfigurationPage.selectExpressionValuesOptions('Categorization', 'Operational');
            await approvalConfigurationPage.searchFoundationDataToApprovalExpression(caseTemplateDataWithMatchingCriteria.categoryTier1);
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

        it('[DRDMV-10833]:Create a case and verify approval details on case', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
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

        it('[DRDMV-10833]:approve the created case and verify the approval details on case', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToJSApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Approve');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Resolved");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was approved');
        });

        it('[DRDMV-10833]:Verify the approvals details on case activity after case approved', async () => {
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(2);
            expect(await showApproversBladePo.getApproversNameFromActivity('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabelFromActivity()).toContain('Approved');
            expect(await showApproversBladePo.isApprovedApproverIconDisplayedFromActivity()).toBeTruthy('Approved button on Approver List blade is not displayed');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        it('[DRDMV-10833]:update the case status to approval trigger status and see if approval is triggered', async () => {
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus('Assigned');
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToJSApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Reject');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Approval Rejected");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was rejected');
        });

        it('[DRDMV-10833]:Verify the case details after the case is rejected', async () => {
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(2);
            expect(await showApproversBladePo.getApproversNameFromActivity('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getClosedApprovalStatusLabelFromActivity('Rejected')).toContain('Rejected');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        it('[DRDMV-10833]:update the case status to approval trigger status and see if approval is triggered', async () => {
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus('Assigned');
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToJSApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Approve');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Resolved");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was approved');
        });

        it('[DRDMV-10833]:Verify the approvals details on case activity', async () => {
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(2);
            expect(await showApproversBladePo.getApproversNameFromActivity('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabelFromActivity()).toContain('Approved');
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

    //skhobrag
    describe('[DRDMV-1369,DRDMV-1368]:[Approval] Details of approvers in sequenced approval', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Approval Flow' + randomStr;
        let caseData = undefined;
        let caseId: string;
        let approvalMappingData = undefined;
        let approvalMappingData1 = undefined;
        let caseSummary = "Automated One must Approval Case" + randomStr;
        let caseTemplateDataWithMatchingCriteria
        beforeAll(async () => {
            // Create Case Template through API
            caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated One must Approval Case',
                "categoryTier1": 'Project Accounting',
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
                "mappingName": "Approval Mapping for Level Up Approval"
            }
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule,approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            //Create Approval Mapping through API
            approvalMappingData1 = {
                "triggerStatus": "InProgress",
                "errorStatus": "New",
                "approvedStatus": "Resolved",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
                "company": "Petramco",
                "mappingName": "Approval Mapping for Level Up Approval Another"
            }
            let approvalMappingId1 = await apiHelper.createApprovalMapping(caseModule,approvalMappingData1);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,caseTemplateWithMatchingSummaryResponse.id, approvalMappingId1.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated One must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
        });

        it('[DRDMV-1369,DRDMV-1368]:Create One must approval configuration', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', 'Approval Configuration - Administration - Business Workflows');
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(caseApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit Approval Flow');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Approval Flows');
            await approvalConfigurationPage.clickApprovalGroup('BWFA Group');
            await approvalConfigurationPage.clickAddNewFlowLinkButton();
            await approvalConfigurationPage.selectApprovalFlowOption('General Approval Flow');
            expect(await approvalConfigurationPage.getNewApprovalFlowDefaultTitle()).toBe('Flow:New General Flow');
            await approvalConfigurationPage.editNewApprovalFlowDefaultTitle(approvalFlowName);
            await approvalConfigurationPage.selectMultipleApproversDropDownOption('One Must Approve');
            await approvalConfigurationPage.clickExpressionLink();
            await browser.sleep(5000); //Sleep added for expression builder loading
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create New Approval Flow');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Category Tier 1');
            await approvalConfigurationPage.clickRecordOption('Record Definition');
            await approvalConfigurationPage.clickRecordOption('Case');
            await browser.sleep(2000); //Sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); //Sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); //Sleep added for expression builder loading
            await approvalConfigurationPage.clickExpressionOperatorLinkToSelectExpressionValue();
            await approvalConfigurationPage.selectExpressionValuesOptions('Categorization', 'Operational');
            await approvalConfigurationPage.searchFoundationDataToApprovalExpression(caseTemplateDataWithMatchingCriteria.categoryTier1);
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

        it('[DRDMV-1369,DRDMV-1368]:Create a case and verify Show Approvers Blade information', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
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

        it('[DRDMV-1369,DRDMV-1368]:Approve the case and verify the case details', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToJSApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Approve');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
        });

        it('[DRDMV-1369,DRDMV-1368]:Verify the approvals details on case activity', async () => {
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
            await browser.sleep(2000); // Hard wait added to load content on approval blade
            expect(await showApproversBladePo.getApproversCount()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        it('[DRDMV-1369,DRDMV-1368]:Approve the case and verify the case details', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToJSApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'On Hold');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            await viewCasePo.clickShowApproversLink();
            expect(await showApproversBladePo.isShowApproversBladeDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabel()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabel('Pending Approval')).toContain('Pending Approval (1)');
            expect(await showApproversBladePo.getApproversTabLabel('Approval Decision')).toContain('Approval Decision (0)');
            expect(await showApproversBladePo.getApprovalsHelpTextOnShowApproversBlade()).toContain('One of following people must approve this case:');
            expect(await showApproversBladePo.getOnHoldApprovalStatusLabel()).toContain('Hold');
            expect(await showApproversBladePo.isOnHoldIconDisplayed()).toBeTruthy('Approver Person Icon is not displayed');
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });
        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //skhobrag
    describe('[DRDMV-12182]:[Approval] Verify precedence will be given to company specific approval mapping if we have global approval mapping with Same name when case enters approval cycle', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Approval Flow' + randomStr;
        let caseSummary = "Automated One must Approval Case" + randomStr;
        let caseData = undefined;
        let caseId: string;
        let approvalMappingData = undefined;
        let approvalMappingData1 = undefined;
        let caseTemplateDataWithMatchingCriteria;
        beforeAll(async () => {
            // Create Case Template through API
            caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated One must Approval Case',
                "categoryTier1": 'Local Statutory Support',
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
                "company": "- Global -",
                "mappingName": "Approval Mapping for Self Approval"
            }
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule,approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            //Create Approval Mapping through API
            approvalMappingData1 = {
                "triggerStatus": "Assigned",
                "errorStatus": "New",
                "approvedStatus": "Resolved",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
                "company": "Petramco",
                "mappingName": "Approval Mapping for One Must Approval"
            }
            let approvalMappingId1 = await apiHelper.createApprovalMapping(caseModule,approvalMappingData1);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,caseTemplateWithMatchingSummaryResponse.id, approvalMappingId1.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated One must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
        });

        it('[DRDMV-12182]:Create One must approval configuration', async () => {
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
            await browser.sleep(5000); //Sleep added for expression builder loading
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create New Approval Flow');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Category Tier 1');
            await approvalConfigurationPage.clickRecordOption('Record Definition');
            await approvalConfigurationPage.clickRecordOption('Case');
            await browser.sleep(2000); //Sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); //Sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); //Sleep added for expression builder loading
            await approvalConfigurationPage.clickExpressionOperatorLinkToSelectExpressionValue();
            await approvalConfigurationPage.selectExpressionValuesOptions('Categorization', 'Operational');
            await approvalConfigurationPage.searchFoundationDataToApprovalExpression(caseTemplateDataWithMatchingCriteria.categoryTier1);
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

        it('[DRDMV-12182]:Create a case and verify approval mapping trigger preference', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
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

        it('[DRDMV-12182]:Approve the case and verify the case details', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToJSApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Approve');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Resolved");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was approved');
        });

        it('[DRDMV-12182]:Verify the approvals details on case activity', async () => {
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

    //skhobrag
    describe('[DRDMV-12181]:[Approval] Case enters approval cycle for global company', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Approval Flow' + randomStr;
        let caseSummary = "Automated One must Approval Case" + randomStr;
        let caseData = undefined;
        let caseId: string;
        let approvalMappingData = undefined;
        let caseTemplateDataWithMatchingCriteria;
        beforeAll(async () => {
            // Create Case Template through API
            caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated One must Approval Case',
                "categoryTier1": 'Accounts Receivable',
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
                "company": "- Global -",
                "mappingName": "Approval Mapping for Self Approval"
            }
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule,approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated One must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
        });

        it('[DRDMV-12181]:Create One must approval configuration', async () => {
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
            await browser.sleep(5000); //Sleep added for expression builder loading
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create New Approval Flow');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Category Tier 1');
            await approvalConfigurationPage.clickRecordOption('Record Definition');
            await approvalConfigurationPage.clickRecordOption('Case');
            await browser.sleep(2000); //Sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); //Sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); //Sleep added for expression builder loading
            await approvalConfigurationPage.clickExpressionOperatorLinkToSelectExpressionValue();
            await approvalConfigurationPage.selectExpressionValuesOptions('Categorization', 'Operational');
            await approvalConfigurationPage.searchFoundationDataToApprovalExpression(caseTemplateDataWithMatchingCriteria.categoryTier1);
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

        it('[DRDMV-12181]:Create a case and verify approval mapping triggered based on global company', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
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

        it('[DRDMV-12181]:Approve the case and verify the case details', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToJSApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Approve');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("In Progress");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was approved');
        });

        it('[DRDMV-12181]:Verify the approvals details on case activity', async () => {
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
        });
    });
});