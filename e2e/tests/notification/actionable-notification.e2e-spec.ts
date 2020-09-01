import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import viewCasePage from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import notificationPo from '../../pageobject/notification/notification.po';
import notificationTemplateEditPage from '../../pageobject/settings/notification-config/edit-notification-template.po';
import viewTaskPage from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';

const caseData = require('../../data/ui/case/case.ui.json');
const manageNotificationTempNavigation = 'Notification Configuration--Manage Templates';
const notifTempGridPageTitle = 'Manage Notification Template - Business Workflows';
let displayIdStr: string = 'Display ID';

describe("Actionable Notifications", () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.addFilter('Company', '- Global -', 'text');
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        await apiHelper.apiLogin('tadmin');
        await apiHelper.setDefaultNotificationForUser('qtao', "Alert");
        await apiHelper.setDefaultNotificationForUser('Fritz', "Alert");
        await apiHelper.setDefaultNotificationForUser('qfeng', "Alert");
        await apiHelper.setDefaultNotificationForUser('qkatawazi', "Alert");
        await apiHelper.apiLogin('sasadmin');
        await apiHelper.enableActionableNotificationSetting();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    it('[DRDMV-16854]: Check out of the box notification-"Case Reopened" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qfeng');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await apiHelper.updateCaseStatus(response.id, 'Resolved', 'Customer Follow-Up Required');
        await apiHelper.reopenCase(response.id);

        await navigationPage.gotoSettingsPage();
        try {
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
            await utilGrid.searchAndOpenHyperlink('Case Reopened');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilCommon.clickOnWarningOk();
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');

            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.refresh(); // required to get alert notification
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Qiao Feng has reopened ${response.displayId}`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
    });

    //asahitya
    it('[DRDMV-16807]: Check out of the box notification-Case Agent "Assignment" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qfeng');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Case Agent Assignment');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(response.displayId + ' has been assigned to you.');
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[DRDMV-16695,DRDMV-8378]: Check out of the box notification-"Case group Assignment" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithoutAssignee']);
        await apiHelper.updateCaseStatus(response.id, 'Assigned');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Case Group Assignment');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            expect(await notificationPo.isAlertPresent(`Qianru Tao changed the status of ${response.displayId} to Assigned`)).toBeFalsy('Status Change notification is available');
            await notificationPo.clickActionableLink(response.displayId + ' has been assigned to your group.');
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[DRDMV-16833]: Check out of the box notification-"Case Status Change" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Case Status Change');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Qianru Tao changed the status of ${response.displayId} to In Progress`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[DRDMV-16849]: Check out of the box notification-"Case Watchlist - Assignment Change" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qfeng');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await apiHelper.addCaseToWatchlistAllEvents(response.id);
        await apiHelper.changeCaseAssignment(response.id, 'Facilities Support', 'Facilities', 'Fritz');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Case Watchlist - Assignment Change');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink('Watchlist Alert: ' + response.displayId + ' assigned to Fritz Schulz by Qiao Feng.');
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[DRDMV-16852]: Check out of the box notification-"Case Watchlist - Status Change" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qfeng');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await apiHelper.addCaseToWatchlistAllEvents(response.id);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Case Watchlist - Status Change');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Watchlist Alert: ${response.displayId} Marked: In Progress by Qiao Feng.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    it('[DRDMV-16850]: Check out of the box notification-"Case Watchlist - Group Assignment Change " is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        let caseId = response.displayId;
        await apiHelper.apiLogin('qfeng');
        await apiHelper.addCaseToWatchlistAllEvents(response.id);
        await apiHelper.apiLogin('qtao');
        await apiHelper.changeCaseAssignment(response.id, 'United States Support', 'US Support 2');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Case Watchlist - Group Assignment Change');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Watchlist Alert: ${response.displayId} was assigned to group US Support 2 by Qianru Tao`);

            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[DRDMV-16796]: Check out of the box notification-"Task Agent Assignment" is actionable for type Alert', async () => {
        let taskData = {
            "taskName": "DRDMV-16976",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 1",
            "assignee": "qtao",
        }

        await apiHelper.apiLogin('qfeng');
        let response1 = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData);
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Task Agent Assignment');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`${response2.displayId} has been assigned to you.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewTaskPage.getTaskID()).toBe(response2.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    it('[DRDMV-16835]: Check out of the box notification-Task Status Change is actionable for type Alert', async () => {
        let taskData = {
            "taskName": "DRDMV-16835",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 1",
            "assignee": "qtao",
        }

        await apiHelper.apiLogin('qfeng');
        let response1 = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData);
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');
        await apiHelper.updateTaskStatus(response2.id, 'InProgress');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Task Status Change');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Qiao Feng changed status of ${response2.displayId} to In Progress`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewTaskPage.getTaskID()).toBe(response2.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[DRDMV-16837]: Check out of the box notification-"Notes from Activity Feed in Case" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response1 = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await apiHelper.postActivityCommentsWithoutAttachments('Actionable Notifications', 'Case', response1.id);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Notes from Activity Feed in Case');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Qianru Tao added a note to ${response1.displayId}`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response1.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }

    });

    //asahitya
    it('[DRDMV-16841]: Check out of the box notification-"Notes from Activity Feed in Task" is actionable for type Alert', async () => {
        let taskData = {
            "taskName": "DRDMV-16841",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qfeng",
        }

        await apiHelper.apiLogin('qtao');
        let response1 = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData);
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');
        await browser.sleep(1000); //Hard wait to refelct the status change
        await apiHelper.postActivityCommentsWithoutAttachments('Actionable Notifications', 'Task', response2.id);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Notes from Activity Feed in Task');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Qianru Tao added a note to ${response2.displayId}`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewTaskPage.getTaskID()).toBe(response2.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[DRDMV-16801]: Check out of the box notification-"Task group Assignment" is actionable for type Alert', async () => {
        let taskData = {
            "taskName": "DRDMV-16976",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3"
        }

        await apiHelper.apiLogin('qkatawazi');
        let response1 = await apiHelper.createCase(caseData['actionableNotificationWithoutAssignee']);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData);
        await apiHelper.changeCaseAssignment(response1.id, 'United States Support', 'US Support 1', 'qtao');
        await apiHelper.apiLogin('qtao');
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Task Group Assignment');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`${response2.displayId} has been assigned to your group.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewTaskPage.getTaskID()).toBe(response2.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[DRDMV-16839]: Check out of the box notification-"Notes from Activity Feed in Case with attachment" is actionable for type Alert', async () => {
        const attachment = 'e2e/data/ui/attachment/articleStatus.png';
        await apiHelper.apiLogin('qtao');
        let response1 = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await apiHelper.postActivityCommentsWithAttachments('Attachment is Posted for Actionable Notifications', 'Case', response1.id, attachment);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Notes from Activity Feed in Case with attachment');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Qianru Tao added a note to ${response1.displayId}`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response1.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[DRDMV-16844]: Check out of the box notification-"Notes from Activity Feed in Task with attachment" is actionable for type Alert', async () => {
        let taskData = {
            "taskName": "DRDMV-16841",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qfeng",
        }
        const attachment = 'e2e/data/ui/attachment/articleStatus.png';

        await apiHelper.apiLogin('qtao');
        let response1 = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData);
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');
        await browser.sleep(1000); //Hard wait to update the status properly
        await apiHelper.postActivityCommentsWithAttachments('Actionable Notifications', 'Task', response2.id, attachment);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await utilGrid.searchAndOpenHyperlink('Notes from Activity Feed in Task with attachment');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilCommon.clickOnWarningOk();
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Qianru Tao added a note to ${response2.displayId}`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewTaskPage.getTaskID()).toBe(response2.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ptidke
    it('[DRDMV-22377]: Verify Alert at Requester On case submit , Case Pending-Customer Response Notification, Case Resolution and Case Canceled Notification', async () => {
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.updateNotificationEventStatus('Case Pending - Customer Response - Requester Notification', 'Enabled');
        await apiHelper.updateNotificationEventStatus('Case Canceled - Requester Notification', 'Enabled');
        await apiHelper.updateNotificationEventStatus('Case Submitted - Requester Notification', 'Enabled');
        await apiHelper.updateNotificationEventStatus('Case Resolved - Requester Notification', 'Enabled');
        await apiHelper.apiLogin('qtao');
        let response1 = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');
        await apiHelper.updateCaseStatus(response1.id, 'Pending', 'Customer Response');
        await apiHelper.updateCaseStatus(response1.id, 'Resolved', 'Customer Follow-Up Required');
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');
        await apiHelper.updateCaseStatus(response1.id, 'Canceled', 'Customer Canceled');
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
        await notificationPo.clickOnNotificationIcon();
        expect(await notificationPo.isAlertPresent("Your Request ID : " + response1.displayId + " is submitted.")).toBeTruthy();
        expect(await notificationPo.isAlertPresent("Your Request ID : " + response1.displayId + " is Resolved.")).toBeTruthy();
        expect(await notificationPo.isAlertPresent("Status of Request ID : " + response1.displayId + " is changed to Canceled.")).toBeTruthy();
        expect(await notificationPo.isAlertPresent("Status of Request ID : " + response1.displayId + " is changed to Pending.")).toBeTruthy();
        await utilCommon.closePopUpMessage();
    });

});