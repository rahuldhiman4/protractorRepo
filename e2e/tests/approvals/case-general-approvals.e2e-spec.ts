import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { ICaseTemplate } from '../../data/interface/template.interface';
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
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
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
        // userData1 = {
        //     "firstName": "Petramco",
        //     "lastName": "SGUser1",
        //     "userId": "10843User1",
        //     "userPermission": ["Case Business Analyst", "Human Resource"]
        // }
        // await apiHelper.createNewUser(userData1);
        // await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
        // await apiHelper.associatePersonToSupportGroup(userData1.userId, "US Support 3");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //skhobrag
    describe('[5143]:[Approval] - Case Level Up Approval when Requester does not have Manager', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Levelup Flow' + randomStr;
        let caseData = undefined;
        let caseId: string;
        let approvalMappingData = undefined;

        beforeAll(async () => {
            // Create Case Template through API
            let caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated Level Up Approval without process',
                "categoryTier1": 'Talent Management',
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
            await apiHelper.associateTemplateWithApprovalMapping(caseModule, caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": 'zculloden',
                "Summary": "Automated Self Approval with process",
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
        });

        // #passed
        it('[5143]:Create Level Up Approval Flow Without Process', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', BWF_PAGE_TITLES.APPROVALS.APPROVAL_CONFIGURATION);
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(caseApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Approval configurations');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Approval flows');
            await approvalConfigurationPage.clickApprovalGroup('BWFA Group');
            await approvalConfigurationPage.clickAddLevelUpFlowButton();
            expect(await approvalConfigurationPage.getNewApprovalFlowDefaultTitle()).toBe('Level up flow');
            await approvalConfigurationPage.editNewApprovalFlowDefaultTitle(approvalFlowName);
            await approvalConfigurationPage.setNoOfLevels('1');
            await approvalConfigurationPage.clickExpressionLink();
            await browser.sleep(5000); // sleep added for expression builder loading time
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit expression');

            await approvalConfigurationPage.clickOnMenuItem('Record definition');
            await approvalConfigurationPage.clickOnMenuItem('Case');
            await approvalConfigurationPage.selectExpressionFieldOption('Category Tier 1');
            await approvalConfigurationPage.selectExpressionOperator('=');
            await approvalConfigurationPage.setExpressionValueForParameter('"Talent Management"');
            await approvalConfigurationPage.clickModelOkButton();

            await approvalConfigurationPage.clickNewApprovalFlowSaveButton();
            await approvalConfigurationPage.clickApprovalFlowCloseButton();
            await utilityCommon.closePopUpMessage();
        });

        // ??
        it('[5143]:Case Level Up Approval when Requester does not have Manager', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("New");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('An error occurred during approval');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //skhobrag #passing on cicd
    describe('[6216,3504]:[Approval] Approval details when case canceled not being approved', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalFlowName = 'Approval Flow' + randomStr;
        let approvalMappingData = undefined, caseData = undefined, caseId: string, caseTemplateDataWithMatchingCriteria: ICaseTemplate;

        beforeAll(async () => {
            // Create Case Template through API
            caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'Case Template Summary',
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

            await apiHelper.apiLogin('qkatawazi');
            let caseTemplateWithMatchingSummaryResponse = await apiHelper.createCaseTemplate(caseTemplateDataWithMatchingCriteria);

            let approvalFlowData = {
                "flowName": `Approval FLow ${randomStr}`,
                "approver": "qliu;qkatawazi",
                "qualification": `'Category Tier 1' = "Workforce Administration" AND 'Category Tier 2' = "HR Operations"`
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
            await apiHelper.associateTemplateWithApprovalMapping(caseModule, caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated One must Approval Case",
            }
        });

        // #passed
        it('[6216,3504]:Create a case and verify Show Approvers Blade information', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            // Edit case and select case template for 3504
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

        // wofking on cicd
        it('[6216,3504]:Cancel the case and verify the case details', async () => {
            await updateStatusBladePo.changeStatus('Canceled');
            await updateStatusBladePo.selectStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus('Canceled');
            expect(await viewCasePo.getTextOfStatus()).toBe('Canceled');
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was cancelled');
        });

        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //skhobrag #passed
    describe('[5150]:[Approval] - Case Re Approval after Rejection', async () => {
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
                "categoryTier1": 'Workforce Administration',
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
            await apiHelper.associateTemplateWithApprovalMapping(caseModule, caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated One must Approval Case" + randomStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
        });

        // passed
        it('[5150]:Create One must approval configuration', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', BWF_PAGE_TITLES.APPROVALS.APPROVAL_CONFIGURATION);
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(caseApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Approval configurations');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Approval flows');
            await approvalConfigurationPage.clickApprovalGroup('BWFA Group');
            // await approvalConfigurationPage.deleteApprovalConfiguration('Approval Flows');
            await approvalConfigurationPage.clickAddGeneralFlowButton();
            expect(await approvalConfigurationPage.getNewApprovalFlowDefaultTitle()).toBe('General flow');
            await approvalConfigurationPage.editNewApprovalFlowDefaultTitle(approvalFlowName);
            await approvalConfigurationPage.selectMultipleApproversDropDownOption('One must approve');
            await approvalConfigurationPage.clickExpressionLink();
            await browser.sleep(5000); // sleep added for expression builder loading time
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit expression');

            await approvalConfigurationPage.clickOnMenuItem('Record definition');
            await approvalConfigurationPage.clickOnMenuItem('Case');
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
            await utilityCommon.closePopUpMessage();
        });

        // passed
        it('[5150]:Create a case and verify Show Approvers Blade information', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
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
            expect(await showApproversBladePo.getApproversName('Qiwei Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isApproverPersonIconDisplayed('Qiwei Liu')).toBeTruthy('Approver Person Icon is not displayed');
            expect(await showApproversBladePo.isAwaitingApproverIconDisplayed()).toBeTruthy('Awaiting approver icon is not displayed');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompany('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovalStatusLabel()).toContain('Awaiting Approval');
            await showApproversBladePo.clickApproversTab('Approval Decision');
            expect(await showApproversBladePo.getApproversCount()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        //passed
        it('[5150]:Reject the case and verify the case details', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Reject');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was rejected');
        });

        // passed
        it('[5150]:Verify the case rejection details on case activity', async () => {
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
            expect(await showApproversBladePo.getClosedApprovalStatusLabelFromActivity('Closed')).toContain('Closed');
            expect(await showApproversBladePo.isClosedApproverIconDisplayedFromActivity()).toBeTruthy('Closed icon button on Approver List blade is not displayed');
            await showApproversBladePo.clickApproversTabFromActivity('Pending Approval');
            expect(await showApproversBladePo.getApproversCountFromActivity()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        // passed
        it('[5150]:Update the case status to retrigger the approval and verify the details', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
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
            expect(await showApproversBladePo.getApproversName('Qiwei Liu')).toBeTruthy('Approver not present');
            expect(await showApproversBladePo.isApproverPersonIconDisplayed('Qiwei Liu')).toBeTruthy('Approver Person Icon is not displayed');
            expect(await showApproversBladePo.isAwaitingApproverIconDisplayed()).toBeTruthy('Awaiting approver icon is not displayed');
            expect(await showApproversBladePo.isBackButtonOnApprovalBladeDisplayed()).toBeTruthy('Back button on Approver List blade is not displayed');
            expect(await showApproversBladePo.getApproversCompany('Petramco')).toBeTruthy('Approver Company is not displayed');
            expect(await showApproversBladePo.getApprovalStatusLabel()).toContain('Awaiting Approval');
            await showApproversBladePo.clickApproversTab('Approval Decision');
            expect(await showApproversBladePo.getApproversCount()).toBe(0);
            await showApproversBladePo.clickBackButtonOnApprovalBlade();
        });

        // passed
        it('[5150]:Approve the case and verify the case details', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.switchToApplication('Approval');
            await approvalConsolePage.searchCaseOnApprovalConsole(caseSummary, 'Approve');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Closed");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was approved');
        });

        // passed
        it('[5150]:Verify the approvals details on case activity', async () => {
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
            await apiHelper.deleteApprovalMapping(caseModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    // #passed
    describe('[3505]:Case Template inactivated/removed from Approval mapping', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseInfo1, caseInfo2, caseData1, caseData2, approvalMappingResponse, approvalMappingData;
        let activeToInactiveTemplateData, removeAssociationTemplateData, activeToInactiveTemplate, removeAssociationTemplate;
        beforeAll(async () => {
            // Create Case Templates through API
            activeToInactiveTemplateData = {
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
            };
            removeAssociationTemplateData = {
                "templateName": 'RemoveAfterApprovalCaseTemplate_' + randomStr,
                "templateSummary": 'Case Template Summary2',
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
            // Create case template which will be changed to Inactive status
            await apiHelper.apiLogin('qkatawazi');
            activeToInactiveTemplate = await apiHelper.createCaseTemplate(activeToInactiveTemplateData);
            // Create case template which will be removed from approval mappling after approval is triggered
            removeAssociationTemplate = await apiHelper.createCaseTemplate(removeAssociationTemplateData);
            //Create Approval Flow through API
            let approvalFlows = [
                {
                    "flowName": 'Approval Flow1' + randomStr,
                    "approvers": "qliu;qkatawazi",
                    "qualification": `'Category Tier 1' = "Workforce Administration" AND 'Category Tier 2' = "HR Operations"`,
                    "precedence": 1,
                    "signingCriteria": 0,
                    "approvalFlowOutcomeMappingList": [

                    ]
                },
                {
                    "flowName": 'Approval Flow2' + randomStr,
                    "approvers": "qliu;qkatawazi",
                    "qualification": `'Category Tier 1' = "Workforce Administration" AND 'Category Tier 2' = "HR Operations"`,
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
            await apiHelper.associateTemplateWithApprovalMapping(caseModule, activeToInactiveTemplate.id, approvalMappingResponse.id);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule, removeAssociationTemplate.id, approvalMappingResponse.id);
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
        it('[3505]:Verify Case1 and Case2 enters approval cycle', async () => {
            await apiHelper.apiLogin('qfeng');
            caseInfo1 = await apiHelper.createCase(caseData1);
            caseInfo2 = await apiHelper.createCase(caseData2);

            await navigationPage.signOut();
            await loginPage.login('qfeng');
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
        it('[3505]:Change case template1 to Inactive and remove case template2 from approval mapping', async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.updateCaseTemplateStatus(activeToInactiveTemplate.id, "Inactive");
            await apiHelper.disassociateCaseTemplateFromApprovalMapping(removeAssociationTemplate.id, approvalMappingResponse.id);
        });
        it('[3505]:Create cases with association removed case template', async () => {
            await apiHelper.apiLogin('qfeng');
            caseData2.Summary = "Remove association Case3 " + randomStr;
            let caseInfo3 = await apiHelper.createCase(caseData2);

            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseInfo3.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeFalsy('Approval is triggered');
        });
        it('[3505]:Approve Case1, Reject Case2', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
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
        });
    });
});
