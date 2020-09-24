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
import knowledgeArticleViewPage from '../../pageobject/knowledge/view-knowledge-article.po';
import taskTemplateConsolePage from '../../pageobject/settings/task-management/console-tasktemplate.po';
import createTaskTemplatePage from '../../pageobject/settings/task-management/create-tasktemplate.po';
import notificationEventConsolePage from '../../pageobject/settings/notification-config/console-notification-event.po';
import createNotificationEventPage from '../../pageobject/settings/notification-config/create-notification-event.po';
import createNotificationTemplatePage from '../../pageobject/settings/notification-config/create-notification-template.po';
import notificationTemplateConsolePage from "../../pageobject/settings/notification-config/console-notification-template.po";
import editNotificationTemplatePage from '../../pageobject/settings/notification-config/edit-notification-template.po';
import createCasePage from '../../pageobject/case/create-case.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import assignmentBladePO from '../../pageobject/common/change-assignment-blade.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import addFieldsPopPo from '../../pageobject/common/add-fields-pop.po';

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
        await apiHelper.setDefaultNotificationForUser('khardison', 'Alert');
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

    //asahitya
    describe('[DRDMV-16828,DRDMV-16832,DRDMV-16830]: Check out of the box notification-"Article Reviewer assignment" is actionable for type Alert', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let articleResponse = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('sasadmin');
            await apiHelper.updateReviewDueDateRule();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.addCommonConfig('NEXT_REVIEW_PERIOD', ['1_MINUTE'], 'Petramco');
            await apiHelper.deleteApprovalMapping('Knowledge');
        });

        it('[DRDMV-16828,DRDMV-16832,DRDMV-16830]: Check out of the box notification-"Article Reviewer assignment" is actionable for type Alert', async () => {
            //Create Article
            let articleData = {
                "knowledgeSet": "HR",
                "title": `DRDMV-16828 ${randomStr}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco"
            }
            await apiHelper.apiLogin('khardison');
            articleResponse = await apiHelper.createKnowledgeArticle(articleData);

            //Update the Article to Published status
            await apiHelper.updateKnowledgeArticleStatus(articleResponse.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(articleResponse.id, 'SMEReview', 'khardison', 'CA Support 3', 'Petramco');
            await apiHelper.updateKnowledgeArticleStatus(articleResponse.id, 'PublishApproval', 'khardison', 'CA Support 3', 'Petramco');

            //Verify all the Notification Templates of Knowledge Module
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
            await utilGrid.searchAndOpenHyperlink('Article Reviewer Assignment');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Content ID')).toBeTruthy('Content ID is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilCommon.clickOnWarningOk();
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Content ID')).toBeTruthy('Content ID is not clickable');
            await notificationTemplateEditPage.cancelEmailBodyBlade();

            await utilCommon.closeBladeOnSettings();
            await utilGrid.searchAndOpenHyperlink('Article Review due');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Content ID')).toBeTruthy('Content ID is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilCommon.clickOnWarningOk();
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Content ID')).toBeTruthy('Content ID is not clickable');
            await notificationTemplateEditPage.cancelEmailBodyBlade();

            await utilCommon.closeBladeOnSettings();
            await utilGrid.searchAndOpenHyperlink('Article Review Overdue');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Content ID')).toBeTruthy('Content ID is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilCommon.clickOnWarningOk();
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Content ID')).toBeTruthy('Content ID is not clickable');
            await notificationTemplateEditPage.cancelEmailBodyBlade();
        });

        it('[DRDMV-16828,DRDMV-16832,DRDMV-16830]: Check out of the box notification-"Article Reviewer assignment" is actionable for type Alert', async () => {
            await browser.sleep(60000); //Wait till due date and overdue dates are passed

            //Login with khardison and verify notifications are actionable
            await navigationPage.signOut();
            await loginPage.login('khardison');
            await navigationPage.switchToApplication('Knowledge Management');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Knowledge article ${articleResponse.displayId} is assigned to you for Review.`);
            await utilityCommon.switchToNewTab(2);
            expect(await knowledgeArticleViewPage.getKnowledgeArticleId()).toBe(articleResponse.displayId);

            await utilityCommon.switchToNewTab(1);
            await notificationPo.clickActionableLink(`Knowledge article ${articleResponse.displayId} is due for review`);
            await utilityCommon.switchToNewTab(2);
            expect(await knowledgeArticleViewPage.getKnowledgeArticleId()).toBe(articleResponse.displayId);

            await utilityCommon.switchToNewTab(1);
            await notificationPo.clickActionableLink(`Knowledge article ${articleResponse.displayId} is overdue for review.`);
            await utilityCommon.switchToNewTab(2);
            expect(await knowledgeArticleViewPage.getKnowledgeArticleId()).toBe(articleResponse.displayId);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfig('NEXT_REVIEW_PERIOD', 'Petramco');
        });
    });

    describe('[DRDMV-16826]: Check out of the box notification-"Case SLA missed" is actionable for type Alert', () => {
        let caseResponse = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            let svtCreateData = {
                "terms": "'1000000337'=\"e7c60fdad2002d4c199935a94b253ad99d9a68b555f60a08a8de2c9feb2c5c4384b4342bc1571d45eb31b96696b3c309e6b007f0469d329dfffbee32c5139e34\" AND '1000000164'=\"1000\"",
                "readableTerms": "'Company'=\"Petramco\"",
                "startWhen": "'450000021'=\"2000\"",
                "readableStartWhen": "'Status'=\"Assigned\"",
                "stopWhen": "'450000021'=\"7000\"",
                "readableStopWhen": "'Status'=\"Closed\"",
                "goalTimeMinutes": "2",
                "dataSource": "Case Management",
                "company": "Petramco",
                "svtName": 'DRDMV-16826'
            }
            let svtResponse = await apiHelper.createSVT(svtCreateData);
            await apiHelper.attachMilestone(svtResponse.id, 'CASE');

            let caseData = {
                "Company": "Petramco",
                "Requester": "tcruise",
                "Priority": "1000",
                "Summary": "Case SLM Actionable Notification",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng"
            }
            await apiHelper.apiLogin('qdu');
            caseResponse = await apiHelper.createCase(caseData);
        });

        it('[DRDMV-16826]: Check out of the box notification-"Case SLA missed" is actionable for type Alert', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
            await utilGrid.searchAndOpenHyperlink('Case SLA Missed');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Display ID')).toBeTruthy('Display ID is not clickable on Alert');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilCommon.clickOnWarningOk();
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Display ID')).toBeTruthy('Display ID is not clickable on Email');
            await browser.sleep(120000); //Wait to miss the SLM Goals
        });

        it('[DRDMV-16826]: Check out of the box notification-"Case SLA missed" is actionable for type Alert', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Service target associated with ${caseResponse.displayId} is missed.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(caseResponse.displayId);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets('DRDMV-16826');
        });
    });

    describe('[DRDMV-16846]: Check out of the box notification-"Task SLA Missed" is actionable for type Alert', () => {
        let caseResponse, taskResponse = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            let svtCreateData = {
                "terms": "'1000000164'=\"1000\" AND '1000000063'=\"4bae23c056ea5678c965c0ac99a0d42129fac36dad17734f4cccf72ed0728970484abbb531b3257310f5218d372e9f858c4dab28b02703e23a18a069d7cc079c\"",
                "readableTerms": "'Priority'=\"Critical\" AND 'Category Tier 1'=\"Accounts Payable\"",
                "startWhen": "'450000021'=\"2000\"",
                "readableStartWhen": "'Status'=\"Assigned\"",
                "stopWhen": "'450000021'=\"5000\"",
                "readableStopWhen": "'Status'=\"Completed\"",
                "goalTimeMinutes": "1",
                "dataSource": "Task Management",
                "company": "Petramco",
                "svtName": 'DRDMV-16846'
            }
            let svtResponse = await apiHelper.createSVT(svtCreateData);
            await apiHelper.attachMilestone(svtResponse.id, 'TASK');

            let caseData = {
                "Company": "Petramco",
                "Requester": "tcruise",
                "Priority": "1000",
                "Summary": "Case SLM Actionable Notification DRDMV-16846",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng"
            }
            await apiHelper.apiLogin('qdu');
            caseResponse = await apiHelper.createCase(caseData);

            let taskData = {
                "taskName": "Task SLM Actionable Notification",
                "company": "Petramco",
                "priority": "Critical",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "category1": "Accounts Payable"
            }
            taskResponse = await apiHelper.createAdhocTask(caseResponse.id, taskData)
            await apiHelper.updateCaseStatus(caseResponse.id, 'InProgress')
        });

        it('[DRDMV-16846]: Check out of the box notification-"Task SLA Missed" is actionable for type Alert', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
            await utilGrid.searchAndOpenHyperlink('Task SLA Missed');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Display ID')).toBeTruthy('Display ID is not clickable on Alert');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilCommon.clickOnWarningOk();
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Display ID')).toBeTruthy('Display ID is not clickable on Email');
            await browser.sleep(90000); //Wait to miss the SLM Goals
        });

        it('[DRDMV-16846]: Check out of the box notification-"Task SLA Missed" is actionable for type Alert', async () => {
            await browser.sleep(30000); //Wait to miss the SLM Goals
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Service target associated with ${taskResponse.displayId} is missed.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewTaskPage.getTaskID()).toBe(taskResponse.displayId);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets('DRDMV-16846');
        });
    });

    describe('[DRDMV-17006]: Check newly created notification template is actionable', () => {
        let caseDisplayId: string = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createDocumentAndProcessForActionableNotifications();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        });

        it('[DRDMV-17006]: Check newly created notification template is actionable', async () => {
            //Create Automated Task Template
            await taskTemplateConsolePage.clickOnAutomationTaskTemplateButton();
            await createTaskTemplatePage.setTemplateName('Actionable Notification template');
            await createTaskTemplatePage.selectCompanyByName('Petramco');
            await createTaskTemplatePage.setExistingProcessName('Actionable Notification Process');
            await createTaskTemplatePage.setTaskSummary('Desc Actionable Notification template');
            await createTaskTemplatePage.selectOwnerCompany('Petramco');
            await createTaskTemplatePage.selectBuisnessUnit('Canada Support');
            await createTaskTemplatePage.selectOwnerGroup('CA Support 3');
            await createTaskTemplatePage.selectTaskPriority('Critical');
            await createTaskTemplatePage.selectTemplateStatus('Active');
            await createTaskTemplatePage.clickOnSaveTaskTemplate();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');

            //Create Notification Event
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Events', 'Manage Notification Event - Business Workflows');
            await notificationEventConsolePage.clickAddNotificationEventBtn();
            await createNotificationEventPage.setEventName('Actionable Notification Event');
            await createNotificationEventPage.setCompanyValue('- Global -');
            await createNotificationEventPage.setDescription('NotificationEvent for Actionable Notification');
            await createNotificationEventPage.saveEventConfig();
        });

        it('[DRDMV-17006]: Check newly created notification template is actionable', async () => {
            //Create NotificationTemplate
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', 'Manage Notification Template - Business Workflows');
            await notificationTemplateConsolePage.clickOnCreateNotificationTemplate();
            await createNotificationTemplatePage.setTemplateName('Actionable Notification');
            await createNotificationTemplatePage.selectModuleName('Cases');
            await createNotificationTemplatePage.setDescription('Actionable Notification Template'),
            await createNotificationTemplatePage.selectEvent('Actionable Notification Event');
            await editNotificationTemplatePage.clickRecipientsCheckbox('Assignee', 'TO');
            await createNotificationTemplatePage.setAlertMessage('Actionable Alert check for Case ID: ');
            await createNotificationTemplatePage.clickOnInsertFieldOfAlert();
            await addFieldsPopPo.clickOnCase();
            await addFieldsPopPo.selectDynamicField('Display ID');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createNotificationTemplatePage.clickOnGenerateClickableLinkIconOnAlert();
            await createNotificationTemplatePage.clickOnTab();
            await createNotificationTemplatePage.setSubject('Notification Template Email Subject ');
            await createNotificationTemplatePage.setEmailBody('Notification Template Email Body Actionable Link: ');
            await createNotificationTemplatePage.clickOnInsertFieldOfEmail();
            await addFieldsPopPo.clickOnCase();
            await addFieldsPopPo.selectDynamicField('Display ID');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createNotificationTemplatePage.clickOnGenerateClickableLinkIconOnEmail();
            await createNotificationTemplatePage.clickOnSaveButton();

            //Create new case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("Allen");
            await createCasePage.setSummary("DRDMV-16241");
            await createCasePage.clickChangeAssignmentButton();
            await assignmentBladePO.selectCompany('Petramco');
            await assignmentBladePO.selectBusinessUnit('United States Support');
            await assignmentBladePO.selectSupportGroup('US Support 3');
            await assignmentBladePO.selectAssignee('Qiao Feng');
            await assignmentBladePO.clickOnAssignButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseDisplayId = await viewCasePage.getCaseID();
        });

        it('[DRDMV-17006]: Check newly created notification template is actionable', async () => {
            //Attach the Automated Task from Task Template as created above
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate('Actionable Notification template');
            await manageTaskBladePo.clickCloseButton();

            //Update the status of Case to In Progress
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();

            //Verify that Notification generated is Actionable
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Actionable Alert check for Case ID: ${caseDisplayId}`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(caseDisplayId);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteEmailOrNotificationTemplate('Actionable Notification', '- Global -');
            await apiHelper.deleteNotificationEvent('Actionable Notification Event');
            await apiHelper.deleteTaskTemplate('Actionable Notification template');
            await apiHelper.deleteDocumentAndProcessForActionableNotifications();
        });
    });

});