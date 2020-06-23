import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import apiHelper from '../../api/api.helper';
import { BWF_BASE_URL } from '../../utils/constants';
import notificationTemplateEditPage from '../../pageobject/settings/notification-config/edit-notification-template.po';
import utilGrid from '../../utils/util.grid';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import notificationPo from '../../pageobject/notification/notification.po';
import viewCasePage from '../../pageobject/case/view-case.po';

const manageNotificationTempNavigation = 'Notification Configuration--Manage Templates';
const notifTempGridPageTitle = 'Manage Notification Template - Business Workflows';
let requestSecondaryStr: string = 'Request Secondary';

describe("Actionable Notification Approval", () => {
    let caseData;

    beforeAll(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping();
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.addFilter('Company', '- Global -', 'text');
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        await apiHelper.setDefaultNotificationForUser('qkatawazi', "Alert");
        await apiHelper.setDefaultNotificationForUser('qdu', "Alert");
        await apiHelper.setDefaultNotificationForUser('qfeng', "Alert");

        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
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
            "triggerStatus": "InProgress",
            "errorStatus": "Canceled",
            "approvedStatus": "Resolved",
            "noApprovalFoundStatus": "Pending",
            "rejectStatus": "Canceled",
            "company": "Petramco",
            "mappingName": "Bulk Operation Mapping"
        }
        await apiHelper.apiLogin('qkatawazi');
        let approvalMappingId = await apiHelper.createCaseApprovalMapping(approvalMappingData);
        await apiHelper.associateCaseTemplateWithApprovalMapping(caseTemplateResponse.id, approvalMappingId.id);

        //Create Approval Flow. Category 1 = Applications, Category 2 = Social and Category 3 = Chatter
        let approvalFlowData = {
            "flowName": `Bulk Operation ${randomStr}`,
            "approver": "qkatawazi",
            "qualification": "'Category Tier 3' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.c2636a9ab1d4aa37cf23b2cf0dbd1f9ea3a5d6046a3ad0ad998c63411e41815d81709de7a5f6153e78fc47ebcc9c3f3f4db51dd0d9e44084eb3a345df03cb66d.304405421}"
        }
        await apiHelper.createCaseApprovalFlow(approvalFlowData);

        caseData = {
            "Requester": "qkatawazi",
            "Summary": "All Categories selected",
            "Origin": "Agent",
            "Case Template ID": caseTemplateDisplayId
        }

        await apiHelper.apiLogin('sasadmin');
        await apiHelper.enableActionableNotificationSetting();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //asahitya
    it('[DRDMV-16856]: Check out of the box notification-"New Signature Template" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');

        await navigationPage.gotoSettingsPage();
        try {
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
            await utilGrid.searchAndOpenHyperlink('New Signature Template');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilCommon.clickOnWarningOk();
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh(); //After Refresh notifications are getting displayed
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(response.displayId + ' has been sent for approval.');
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });

    //asahitya
    it('[DRDMV-16863]: Check out of the box notification-"Approve Template " is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.approverAction(response.id, 'Approved');

        await navigationPage.gotoSettingsPage();
        try {
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
            await utilGrid.searchAndOpenHyperlink('Approve Template');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilCommon.clickOnWarningOk();
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');

            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh(); //After Refresh notifications are getting displayed
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(response.displayId + ' has been approved. Resolved');
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });

    //asahitya
    it('[DRDMV-16869]: Check out of the box notification-"Cancel Template" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qfeng');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');
        await apiHelper.updateCaseStatus(response.id, 'Canceled', 'Customer Canceled');

        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
            await utilGrid.searchAndOpenHyperlink('Cancel Template');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilCommon.clickOnWarningOk();
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');

            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh(); //After Refresh notifications are getting displayed
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Approval for Case ${response.displayId} has been canceled.`)
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });

    //asahitya
    it('[DRDMV-16859]: Check out of the box notification-"Reject Template " is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.approverAction(response.id, 'Rejected');

        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
            await utilGrid.searchAndOpenHyperlink('Reject Template');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilCommon.clickOnWarningOk();
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');

            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh(); //After Refresh notifications are getting displayed
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(response.displayId + ' has been rejected.');
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });

    //asahitya
    it('[DRDMV-16864]: Check out of the box notification-"Reassign Template" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.approverAction(response.id, 'Reassign', 'qfeng');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Reassign Template');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink('Approval for Case ' + response.displayId + ' has been reassigned to another approver.');
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[DRDMV-16873]: Check out of the box notification-"Hold Template" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.approverAction(response.id, 'OnHold');

        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
            await utilGrid.searchAndOpenHyperlink('Hold Template');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilCommon.clickOnWarningOk();
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');

            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh(); //After Refresh notifications are getting displayed
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Approval for Case ${response.displayId} has been put on hold.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });

    //asahitya
    it('[DRDMV-16875]: Check out of the box notification-"More Info Template" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qfeng');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.sendApprovalQuestions(response.id, 'qdu', 'Sample Question', response.displayId);

        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
            await utilGrid.searchAndOpenHyperlink('More Info Template');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilCommon.clickOnWarningOk();
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh(); //After Refresh notifications are getting displayed
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`An approver has requested for additional information about Case ${response.displayId}.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });
})