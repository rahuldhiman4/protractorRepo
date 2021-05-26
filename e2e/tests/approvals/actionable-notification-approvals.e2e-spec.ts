import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import viewCasePage from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import notificationPo from '../../pageobject/notification/notification.po';
import notificationTemplateEditPage from '../../pageobject/settings/notification-config/edit-notification-template.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

const manageNotificationTempNavigation = 'Notification Configuration--Manage Templates';
let requestSecondaryStr: string = 'Request Secondary';

describe("Actionable Notification Approval", () => {
    let caseData;
    let caseModule = 'Case';

    beforeAll(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(caseModule);
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        // await utilityGrid.clearFilter();
        // await utilityGrid.addFilter('Company', '- Global -', 'text');
        // await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        // await apiHelper.setDefaultNotificationForUser('qkatawazi', "Alert");
        // await apiHelper.setDefaultNotificationForUser('qdu', "Alert");
        // await apiHelper.setDefaultNotificationForUser('qfeng', "Alert");

        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData = {
            "templateName": 'caseTemplateName' + randomStr,
            "templateSummary": 'caseTemplateSummary' + randomStr,
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
        let approvalMappingId = await apiHelper.createApprovalMapping(caseModule, approvalMappingData);
        await apiHelper.associateTemplateWithApprovalMapping(caseModule, caseTemplateResponse.id, approvalMappingId.id);

        //Create Approval Flow. Category 1 = Applications, Category 2 = Social and Category 3 = Chatter
        let approvalFlowData = {
            "flowName": `Bulk Operation ${randomStr}`,
            "approver": "qkatawazi",
            "qualification": "'Priority' = \"Low\"",
        }
        await apiHelper.createApprovalFlow(approvalFlowData, caseModule);

        caseData = {
            "Requester": "apavlik",
            "Summary": "All Categories selected",
            "Origin": "Agent",
            "Case Template ID": caseTemplateDisplayId
        }

        // await apiHelper.apiLogin('tadmin');
        // await apiHelper.enableActionableNotificationSetting();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(caseModule);
        await navigationPage.signOut();
    });

    //asahitya
    it('[4164]: Check out of the box notification-"New Signature Template" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');

        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink('New Signature Template');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await utilityCommon.closeAllBlades();
            await navigationPage.gotoCaseConsole();
            await utilityCommon.refresh(); //After Refresh notifications are getting displayed
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(response.displayId + ' has been sent for approval.');
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });

    //asahitya
    it('[4159]: Check out of the box notification-"Approve Template " is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.approverAction(response.id, 'Approved');

        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink('Approve Template');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await utilityCommon.closeAllBlades();

            await navigationPage.gotoCaseConsole();
            await utilityCommon.refresh(); //After Refresh notifications are getting displayed
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(response.displayId + ' has been approved');
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });

    //asahitya
    it('[4156]: Check out of the box notification-"Cancel Template" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qfeng');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');
        await browser.sleep(3000); //Hard wait required to trigger the Approval
        await apiHelper.updateCaseStatus(response.id, 'Canceled', 'Customer Canceled');

        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink('Cancel Template');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await utilityCommon.closeAllBlades();
            await navigationPage.gotoCaseConsole();
            await utilityCommon.refresh(); //After Refresh notifications are getting displayed
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Approval for Case ${response.displayId} has been canceled.`)
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });

    //asahitya
    it('[4161]: Check out of the box notification-"Reject Template " is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.approverAction(response.id, 'Rejected');

        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink('Reject Template');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await utilityCommon.closeAllBlades();
            await navigationPage.gotoCaseConsole();
            await utilityCommon.refresh(); //After Refresh notifications are getting displayed
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(response.displayId + ' has been rejected.');
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });

    //asahitya
    it('[4158]: Check out of the box notification-"Reassign Template" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.approverAction(response.id, 'Reassign', 'qfeng');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Reassign Template');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
        await utilityCommon.closeAllBlades();

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink('Approval for Case ' + response.displayId + ' has been reassigned');
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
    it('[4152]: Check out of the box notification-"Hold Template" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.approverAction(response.id, 'OnHold');

        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink('Hold Template');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await utilityCommon.closeAllBlades();

            await navigationPage.gotoCaseConsole();
            await utilityCommon.refresh(); //After Refresh notifications are getting displayed
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Approval for Case ${response.displayId} has been put on hold.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });

    //asahitya
    it('[4150]: Check out of the box notification-"More Info Template" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qfeng');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.sendApprovalQuestions(response.id, 'qdu', 'Sample Question', response.displayId);

        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink('More Info Template');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await utilityCommon.closeAllBlades();
            await navigationPage.gotoCaseConsole();
            await utilityCommon.refresh(); //After Refresh notifications are getting displayed
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`An approver has requested for additional information about Case ${response.displayId}.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });

    //asahitya
    it('[4153]: Check out of the box notification-"More Info Return Template" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qfeng');
        let response = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.sendApprovalQuestions(response.id, 'qdu', 'Sample Question', response.displayId);
        await apiHelper.apiLogin('qdu');
        await apiHelper.moreInfoResponseOnApprovalAction(response.displayId, 'Reply');

        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink('More Info Return Template');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(requestSecondaryStr)).toBeTruthy(requestSecondaryStr + ' is not clickable');
            await utilityCommon.closeAllBlades();
            await navigationPage.gotoCaseConsole();
            await utilityCommon.refresh(); //After Refresh notifications are getting displayed
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Additional information about Case ${response.displayId} has been provided.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });
});
