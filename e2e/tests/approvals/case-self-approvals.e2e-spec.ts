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

describe("Case Self Approval Tests", () => {
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
    describe('[DRDMV-10822]:[Approval] - Case Self Approval without Process', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary = '"' + "Automated Self Approval without process" + '"';
        let caseData = undefined;
        let caseData1 = undefined;
        let caseId: string;

        beforeAll(async () => {
            // Create Case Template through API
            let caseTemplateDataWithMatchingSummary = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated Self Approval without process',
                "categoryTier1": 'Applications',
                "categoryTier2": 'Social',
                "categoryTier3": 'Chatter',
                "casePriority": "Medium",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let caseTemplateWithMatchingSummaryResponse = await apiHelper.createCaseTemplate(caseTemplateDataWithMatchingSummary);
            let caseTemplateDisplayId = caseTemplateWithMatchingSummaryResponse.displayId;

            //Create Approval Mapping through API
            let approvalMappingData = {
                "triggerStatus": "Assigned",
                "errorStatus": "New",
                "approvedStatus": "InProgress",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
                "company": "Petramco",
                "mappingName": "Approval Mapping for Self Approval"
            }
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule,approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated Self Approval without process",
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }
            caseData1 = {
                "Requester": "qdu",
                "Summary": "Non Automated Self Approval without process",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
        });

        it('[DRDMV-10822]:Create Self Approval Flow Without Process', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', 'Approval Configuration - Administration - Business Workflows');
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(caseApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit Approval Flow');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Self Approval');
            await approvalConfigurationPage.clickNewSelfApprovalFlowButton();
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create Approval Flow');
            await browser.sleep(5000); //sleep added for expression builder loading
            await approvalConfigurationPage.searchExpressionFieldOption('Summary');
            await approvalConfigurationPage.clickRecordOption('Record Definition');
            await approvalConfigurationPage.clickRecordOption('Case');
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

        it('[DRDMV-10822]:Create case and verify self approval without process', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("In Progress");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was auto-approved');
        });

        it('[DRDMV-10822]:Create case with non mathching summary and verify self approval without process', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData1);
            caseId = response.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.isActivityBlank()).toBeTruthy('Case Approvals Activity is displayed.');
        });

        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //skhobrag
    describe('[DRDMV-10821]:[Approval] - Case Self Approval with Process', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData = undefined, caseData1 = undefined;
        let caseId: string;
        let approvalMappingData = undefined;

        beforeAll(async () => {
            // Create Case Template through API
            let caseTemplateDataWithMatchingCriteria = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated Self Approval without process',
                "categoryTier1": 'Applications',
                "categoryTier2": 'Social',
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
                "triggerStatus": "Assigned",
                "errorStatus": "New",
                "approvedStatus": "InProgress",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
                "company": "Petramco",
                "mappingName": "Approval Mapping for Self Approval"
            }
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule,approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule,caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);

            caseData = {
                "Requester": "qdu",
                "Summary": "Automated Self Approval with process",
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            };

            caseData1 = {
                "Requester": "qdu",
                "Summary": "Non Automated Self Approval",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
        });

        it('[DRDMV-10821]:Create Self Approval Flow Without Process', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', 'Approval Configuration - Administration - Business Workflows');
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(caseApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit Approval Flow');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Self Approval');
            await approvalConfigurationPage.clickNewSelfApprovalFlowButton();
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create Approval Flow');
            await browser.sleep(5000); //sleep added for expression builder loading
            await approvalConfigurationPage.searchExpressionFieldOption('Category Tier 1');
            await approvalConfigurationPage.clickRecordOption('Record Definition');
            await approvalConfigurationPage.clickRecordOption('Case');
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); //sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); //sleep added for expression builder loading
            await approvalConfigurationPage.clickExpressionOperatorLinkToSelectExpressionValue();
            await approvalConfigurationPage.selectExpressionValuesOptions('Categorization', 'Operational');
            await approvalConfigurationPage.searchFoundationDataToApprovalExpression('Applications');
            await approvalConfigurationPage.clickSelectLink();
            await approvalConfigurationPage.clickFoundationDataSaveButton();
            await approvalConfigurationPage.selectExpressionOperator('AND');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Category Tier 2');
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); //sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); //sleep added for expression builder loading
            await approvalConfigurationPage.clickExpressionOperatorLinkToSelectExpressionValue();
            await approvalConfigurationPage.selectExpressionValuesOptions('Categorization', 'Operational');
            await approvalConfigurationPage.selectFoundationDataToApprovalExpression('Applications');
            await approvalConfigurationPage.searchFoundationDataToApprovalExpression('Social');
            await approvalConfigurationPage.clickSelectLink();
            await approvalConfigurationPage.clickFoundationDataSaveButton();
            await approvalConfigurationPage.clickNextbuttonOnSelfApproval();
            await approvalConfigurationPage.setAuditInformationValue('test self approval');
            await approvalConfigurationPage.selectSelfApprovalProcess();
            await approvalConfigurationPage.clickNewApprovalFlowSaveButton();
            await approvalConfigurationPage.closeEditApprovalFlowPopUpWindow('Close');
        });

        it('[DRDMV-10821]:Create case and verify self approval without process', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData);
            caseId = response.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("In Progress");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.getFirstPostContent()).toContain('Case was self-approved');
        });

        it('[DRDMV-10821]:Create case with non matching summary and verify self approval without process', async () => {
            await apiHelper.apiLogin('qfeng');
            let response = await apiHelper.createCase(caseData1);
            caseId = response.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('Approvals');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.isActivityBlank()).toBeTruthy('Case Approvals Activity is displayed.');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
        });
    });
}); 