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
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

let userData1 = undefined;
describe("Case Approval UI Validations", () => {
    const caseApprovalRecordDefinition = 'com.bmc.dsm.case-lib:Case';
    let caseModule = 'Case';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(caseModule);
        userData1 = {
            "firstName": "Petramco",
            "lastName": "SGUser1",
            "userId": "10843User1",
            "userPermission": ["Case Business Analyst", "Human Resource"]
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
    describe('[6220,5159]:[Approval] Approval details in Case details - UI validation (One Must Sign)', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Approval Flow' + randomStr;
        let caseData = undefined;
        let caseId: string;
        let approvalMappingData = undefined;
        let caseTemplateDataWithMatchingCriteria;

        beforeAll(async () => {
            // Create Case Template through API
            caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated One must Approval Case',
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
                "triggerStatus": "Assigned",
                "errorStatus": "New",
                "approvedStatus": "InProgress",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
                "company": "Petramco",
                "mappingName": "Approval Mapping for Self Approval"
            }
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule, approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule, caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": "apavlik",
                "Summary": "Automated One must Approval Case",
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
        });

        it('[6220,5159]:Create One must approval configuration', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', BWF_PAGE_TITLES.APPROVALS.APPROVAL_CONFIGURATION);
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

        it('[6220,5159]:Create a case and verify Show Approvers Blade information', async () => {
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

        it('[6220,5159]:Approve the case and verify the case details', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole('Automated One must Approval Case', 'Approve');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("In Progress");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was approved');
        });

        it('[6220,5159]:Verify the approvals details on case activity', async () => {
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

        it('[6220,5159]:Verify the approvals details on case activity after case rejection', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole('Automated One must Approval Case', 'Reject');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Canceled");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was rejected');
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

        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //skhobrag
    describe('[4591,5158]:[Approval] Approval details in Case details - UI validation (All Must Sign)', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Approval Flow' + randomStr;
        let caseSummary1 = "Automated All must Approval Case" + randomStr;
        let caseSummary2 = "Automated All must Approval Case for cancel Approval" + randomStr;
        let caseData = undefined;
        let caseData1 = undefined;
        let caseId: string;
        let approvalMappingData = undefined;

        beforeAll(async () => {
            // Create Case Template through API
            let caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated All must Approval Case' + randomStr,
                "categoryTier1": 'Employee Relations',
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
                "mappingName": "Approval Mapping for All Must Approval"
            }
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule, approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule, caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated All must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }

            caseData1 = {
                "Requester": "qdu",
                "Summary": "Automated All must Approval Case for cancel Approval" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }

        });

        it('[4591,5158]:Create All must approval configuration', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', BWF_PAGE_TITLES.APPROVALS.APPROVAL_CONFIGURATION);
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
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectMultipleApproversDropDownOption('All Must Approve');
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
            await approvalConfigurationPage.searchFoundationDataToApprovalExpression('Employee Relations');
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

        it('[4591,5158]:Create a case and verify Show Approvers Blade information', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewCasePo.getShowPendingApproversInfo()).toContain('Pending Approval :2');
            await viewCasePo.clickShowApproversLink();
            expect(await showApproversBladePo.isShowApproversBladeDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabel()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabel('Pending Approval')).toContain('Pending Approval (2)');
            expect(await showApproversBladePo.getApproversTabLabel('Approval Decision')).toContain('Approval Decision (0)');
            expect(await showApproversBladePo.getApprovalsHelpTextOnShowApproversBlade()).toContain('All of the following people must approve this case:');
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

        it('[4591,5158]:Approve the case and verify the case details', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary1, 'Approve');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewCasePo.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewCasePo.getApprovedApproversInfo()).toContain('Approved :1');
            await viewCasePo.clickShowApproversLink();
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
            expect(await showApproversBladePo.getApproversName('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isApproverPersonIconDisplayed('RA3 Liu')).toBeTruthy('Approver Person Icon is not displayed');
            expect(await showApproversBladePo.isApprovedApproverIconDisplayed()).toBeTruthy('Approved icon is not displayed');
            expect(await showApproversBladePo.getApproversCompany('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabel()).toContain('Approved');
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        it('[4591,5158]:Verify the approvals details on case activity', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary1, 'Approve');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("In Progress");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was approved');
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (2)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(2);
            expect(await showApproversBladePo.getApproversNameFromActivity('Qadim Katawazi')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversNameFromActivity('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabelFromActivity()).toContain('Approved');
            expect(await showApproversBladePo.isApprovedApproverIconDisplayedFromActivity()).toBeTruthy('Approved button on Approver List blade is not displayed');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        it('[4591,5158]:Verify the approvals details on case activity after case rejection', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData1);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary2, 'Reject');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Canceled");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was rejected');
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (2)');
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
        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //skhobrag
    describe('[5154]:[Approval] Approval details in Case details - UI validation (One Must Sign)', async () => {
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
                "categoryTier1": 'Fixed Assets',
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
            await apiHelper.associateTemplateWithApprovalMapping(caseModule, caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated One must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
        });

        it('[5154]:Create One must approval configuration', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', BWF_PAGE_TITLES.APPROVALS.APPROVAL_CONFIGURATION);
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
            await approvalConfigurationPage.searchFoundationDataToApprovalExpression('Fixed Assets');
            await approvalConfigurationPage.clickSelectLink();
            await approvalConfigurationPage.clickFoundationDataSaveButton();
            await approvalConfigurationPage.clickNewApprovalFlowSaveButton();
            await approvalConfigurationPage.clickSelectApproversLink();
            await approvalConfigurationPage.selectApproversForApproverFlow('Support Group', 'Staffing');
            await approvalConfigurationPage.clickNewApprovalFlowSaveButton();
            await approvalConfigurationPage.clickApprovalFlowSaveButton();
            await approvalConfigurationPage.closeEditApprovalFlowPopUpWindow('Close');
        });

        it('[5154]:Create a case and verify Show Approvers Blade information', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
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
            expect(await showApproversBladePo.getApproversCount()).toBe(4);
            expect(await showApproversBladePo.getApproversName('Elizabeth Peters')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversName('Hannah Haas')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isApproverPersonIconDisplayed('Hannah Haas')).toBeTruthy('Approver Person Icon is not displayed');
            expect(await showApproversBladePo.isAwaitingApproverIconDisplayed()).toBeTruthy('Awaiting approver icon is not displayed');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompany('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovalStatusLabel()).toContain('Awaiting Approval');
            await showApproversBladePo.clickApproversTab('Approval Decision');
            expect(await showApproversBladePo.getApproversCount()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        it('[5154]:Approve the case and verify the case details', async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Approve');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("In Progress");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was approved');
        });

        it('[5154]:Verify the approvals details on case activity', async () => {
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(4);
            expect(await showApproversBladePo.getApproversNameFromActivity('Elizabeth Peters')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.getApproversNameFromActivity('Hannah Haas')).toBeTruthy('Approver not present');
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

    describe('[3472,3469]:Tiggered the Approval on Case and check Case View screen by Approver should show Approval component', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Approval Flow' + randomStr;
        let caseData = undefined;
        let caseId: string;
        let approvalMappingData = undefined;
        let caseTemplateDataWithMatchingCriteria;
        beforeAll(async () => {
            // Create Case Template through API
            caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated One must Approval Case',
                "categoryTier1": 'Projectors',
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
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
            await apiHelper.associateTemplateWithApprovalMapping(caseModule, caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);
            caseData = {
                "Requester": "qdu",
                "Summary": "Automated One must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
        });
        it('[3472,3469]:Tiggered the Approval on Case and check Case View screen by Approver should show Approval component', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', BWF_PAGE_TITLES.APPROVALS.APPROVAL_CONFIGURATION);
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
        it('[3472,3469]:Tiggered the Approval on Case and check Case View screen by Approver should show Approval component', async () => {
            await apiHelper.apiLogin('qstrong');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.isApprovalButtonsPresent("Approve")).toBeFalsy();
            expect(await viewCasePo.isApprovalButtonsPresent("Reject")).toBeFalsy();
            await viewCasePo.clickShowApproversLink();
            expect(await showApproversBladePo.getApproversTabLabel('Pending Approval')).toContain('Pending Approval (1)');
            expect(await showApproversBladePo.getApproversTabLabel('Approval Decision')).toContain('Approval Decision (0)');
            expect(await showApproversBladePo.getApprovalsHelpTextOnShowApproversBlade()).toContain('One of following people must approve this case:');
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
        it('[3472,3469]:Tiggered the Approval on Case and check Case View screen by Approver should show Approval component', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeTruthy('Show Approvers Banner is not displayed');
            expect(await viewCasePo.getShowPendingApproversInfo()).toContain('Pending Approval :1');
            expect(await viewCasePo.isApprovalButtonsPresent("Approve")).toBeTruthy();
            expect(await viewCasePo.isApprovalButtonsPresent("Reject")).toBeTruthy();
            await viewCasePo.clickOnApproveLink();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("In Progress");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was approved');
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversNameFromActivity('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovedApprovalStatusLabelFromActivity()).toContain('Approved');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });
        it('[3472,3469]:Tiggered the Approval on Case and check Case View screen by Approver should show Approval component', async () => {
            await apiHelper.apiLogin('qliu');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            await viewCasePo.clickOnRejectLink();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Canceled");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was rejected');
            await activityTabPage.clickShowApproversLink('Show Approvers');
            expect(await showApproversBladePo.isShowApproversBladeOnActivityDisplayed()).toBeTruthy('Approver List blade is not displayed');
            expect(await showApproversBladePo.getShowApproversBladeLabelFromActivity()).toEqual('Approver List');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Pending Approval')).toContain('Pending Approval (0)');
            expect(await showApproversBladePo.getApproversTabLabelFromActivity('Approval Decision')).toContain('Approval Decision (1)');
            expect(await showApproversBladePo.getApproversNameFromActivity('RA3 Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompanyFromActivity('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getClosedApprovalStatusLabelFromActivity('Rejected')).toContain('Rejected');
            expect(await showApproversBladePo.isClosedApproverIconDisplayedFromActivity()).toBeTruthy('Closed icon button on Approver List blade is not displayed');
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

    //ankagraw
    describe('[6395,6393]:[Case Status Reason] Transiting between the statuses that have Status Reason values', async () => {
        let caseData, caseId, caseData1, caseData2, caseData3, caseTemplateDataWithMatchingCriteria, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            // Create Case Template through API
            let caseTemplateData = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummary' + randomStr,
                "categoryTier1": 'Applications',
                "categoryTier2": 'Social',
                "categoryTier3": 'Chatter',
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
            let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplateData);
            let caseTemplateDisplayId = caseTemplateResponse.displayId;

            //Create Approval Mapping
            let approvalMappingData = {
                "triggerStatus": "Assigned",
                "errorStatus": "Canceled",
                "approvedStatus": "Resolved",
                "noApprovalFoundStatus": "Pending",
                "rejectStatus": "Canceled",
                "company": "Petramco",
                "mappingName": "Bulk Operation Mapping"
            }
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule, approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule, caseTemplateResponse.id, approvalMappingId.id);


            //Create Approval Flow. Category 1 = Applications, Category 2 = Social and Category 3 = Chatter
            let approvalFlowData = {
                "flowName": `Bulk Operation ${randomStr}`,
                "approver": "qkatawazi",
                "qualification": "'Category Tier 3' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.c2636a9ab1d4aa37cf23b2cf0dbd1f9ea3a5d6046a3ad0ad998c63411e41815d81709de7a5f6153e78fc47ebcc9c3f3f4db51dd0d9e44084eb3a345df03cb66d.304405421}"
            }
            await apiHelper.createApprovalFlow(approvalFlowData, caseModule);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated All must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
            caseData2 = {
                "Requester": "qdu",
                "Summary": "Automated All must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }

            caseData1 = {
                "Requester": "apavlik",
                "Summary": "Summary" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
            }

            caseData3 = {
                "Requester": "apavlik",
                "Summary": "Summary" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
            }

            await apiHelper.apiLogin('qkatawazi');
            caseId = await apiHelper.createCase(caseData1);
        });

        it('[6395,6393]:[Case Status Reason] Transiting between the statuses that have Status Reason values', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned"), 'status should be new of status';
            await updateStatusBladePo.changeStatus("Resolved");
            let resolvedStatusReasons: string[] = ['None', 'Auto Resolved', 'Customer Follow-Up Required', 'No Further Action Required'];
            await expect(await updateStatusBladePo.allStatusReasonValuesPresent(resolvedStatusReasons)).toBeTruthy('Resolved status reason options mismatch');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();

            await updateStatusBladePo.changeStatus("Pending");
            let pendingStatusReasons: string[] = ['None', 'Approval', 'Customer Response', 'Error', 'Required Fields Are Missing', 'Third Party'];
            expect(await updateStatusBladePo.allStatusReasonValuesPresent(pendingStatusReasons)).toBeTruthy('Pending status reason options mismatch');
            await updateStatusBladePo.selectStatusReason('Error');
            await updateStatusBladePo.clickSaveStatus();

            await updateStatusBladePo.changeStatus("Canceled");
            let cancelStatusReasons: string[] = ['None', 'Approval Rejected', 'Customer Canceled'];
            expect(await updateStatusBladePo.allStatusReasonValuesPresent(cancelStatusReasons)).toBeTruthy('Cancel status reason options mismatch');
            await updateStatusBladePo.selectStatusReason('Customer Canceled');
            await updateStatusBladePo.clickSaveStatus();
        });

        it('[6395,6393]:[Case Status Reason] Transiting between the statuses that have Status Reason values', async () => {
            await apiHelper.apiLogin('qkatawazi');
            caseId = await apiHelper.createCase(caseData3);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned"), 'status should be new of status';
            await updateStatusBladePo.changeStatus("Pending");
            expect(await updateStatusBladePo.isStatusReasonRequiredTextPresent()).toBeTruthy();
            await updateStatusBladePo.selectStatusReason('Error');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus("Assigned");
            expect(await updateStatusBladePo.isStatusReasonRequiredTextPresent()).toBeFalsy();
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus("Resolved");
            expect(await updateStatusBladePo.isStatusReasonRequiredTextPresent()).toBeTruthy();
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus("Closed");
            expect(await updateStatusBladePo.isStatusReasonRequiredTextPresent()).toBeFalsy();
            await updateStatusBladePo.clickSaveStatus();
        });

        it('[6395,6393]:[Case Status Reason] Transiting between the statuses that have Status Reason values', async () => {
            await apiHelper.apiLogin('qkatawazi');
            caseId = await apiHelper.createCase(caseData);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            expect(viewCasePo.getStatusReason("Approval")).toContain("Approval");
            await viewCasePo.clickOnApproveLink();
            expect(await viewCasePo.getTextOfStatus()).toBe("Resolved");
        });

        it('[6395,6393]:[Case Status Reason] Transiting between the statuses that have Status Reason values', async () => {
            await apiHelper.apiLogin('qkatawazi');
            caseId = await apiHelper.createCase(caseData2);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            expect(viewCasePo.getStatusReason("Approval")).toBe("Approval");
            await viewCasePo.clickOnRejectLink();
            expect(await viewCasePo.getTextOfStatus()).toBe("Canceled");
            expect(await viewCasePo.getStatusReason("Approval Rejected")).toBe("Approval Rejected");
        });
    });
});
