import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import viewCasePage from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import notificationPo from '../../pageobject/notification/notification.po';
import notificationTemplateEditPage from '../../pageobject/settings/notification-config/edit-notification-template.po';
import viewTaskPage from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityGrid from '../../utils/utility.grid';
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
import assignmentBladePO from '../../pageobject/common/change-assignment.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import addFieldsPopPo from '../../pageobject/common/add-fields-pop.po';
import caseConsole from '../../pageobject/case/case-console.po';
import caseWatchlist from '../../pageobject/case/case-watchlist-blade.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import viewTasktemplatePo from "../../pageobject/settings/task-management/view-tasktemplate.po";

const caseData = require('../../data/ui/case/case.ui.json');
const manageNotificationTempNavigation = 'Notification Configuration--Manage Templates';
let displayIdStr: string = 'Display ID';

describe("Actionable Notifications", () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        //await utilityGrid.addFilter('Company', '- Global -', 'text');
        // await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        // await apiHelper.apiLogin('tadmin');
        // await apiHelper.setDefaultNotificationForUser('qtao', "Alert");
        // await apiHelper.setDefaultNotificationForUser('Fritz', "Alert");
        // await apiHelper.setDefaultNotificationForUser('qfeng', "Alert");
        // await apiHelper.setDefaultNotificationForUser('qkatawazi', "Alert");
        // await apiHelper.setDefaultNotificationForUser('khardison', 'Alert');
        // await apiHelper.apiLogin('tadmin');
        //await apiHelper.enableActionableNotificationSetting();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    it('[4166]: Check out of the box notification-"Case Reopened" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qfeng');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await apiHelper.updateCaseStatus(response.id, 'Resolved', 'Customer Follow-Up Required');
        await apiHelper.reopenCase(response.id);

        //await navigationPage.gotoSettingsPage();
        try {
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink('Case Reopened');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
            await utilityCommon.closeAllBlades();
            await navigationPage.gotoCaseConsole();
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
    it('[4200]: Check out of the box notification-Case Agent "Assignment" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qfeng');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await apiHelper.changeCaseAssignment(response.id, 'United States Support', 'US Support 1', 'qtao');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Case Agent Assignment');
        try {
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
            await utilityCommon.closeAllBlades();

            await navigationPage.signOut();
            await loginPage.login('qtao');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(response.displayId + ' has been assigned to you.');
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await utilityCommon.closeAllBlades();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[4242,5514]: Check out of the box notification-"Case group Assignment" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithoutAssignee']);
        await apiHelper.updateCaseStatus(response.id, 'Assigned');
        await apiHelper.changeCaseAssignment(response.id, 'United States Support', 'US Support 1');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Case Group Assignment');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await utilityCommon.closeAllBlades();

        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
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
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[4186]: Check out of the box notification-"Case Status Change" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await apiHelper.updateCaseStatus(response.id, 'InProgress');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Case Status Change');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await utilityCommon.closeAllBlades();

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
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[4171]: Check out of the box notification-"Case Watchlist - Assignment Change" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qfeng');
        caseData['actionableNotificationWithAssignee'].Summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await navigationPage.signOut();
        await loginPage.login('qfeng');
        await utilityGrid.searchRecord(caseData['actionableNotificationWithAssignee'].Summary);
        await utilityGrid.clickCheckBoxOfValueInGrid(response.displayId);
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent('Case Assignment Changes');
        await caseWatchlist.saveEvents();
        await utilityGrid.searchAndOpenHyperlink(caseData['actionableNotificationWithAssignee'].Summary);
        await viewCasePage.clickEditCaseButton();
        await assignmentBladePO.setAssignee('US Support 3', 'Nisha Sharma');
        await editCasePo.clickSaveCase();
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Case Watchlist - Assignment Change');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await utilityCommon.closeAllBlades();

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Watchlist Alert: ${response.displayId} assigned to Nisha Sharma by Qiao Feng.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[4168]: Check out of the box notification-"Case Watchlist - Status Change" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qfeng');
        caseData['actionableNotificationWithAssignee'].Summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await navigationPage.signOut();
        await loginPage.login('qfeng');
        await utilityGrid.searchRecord(caseData['actionableNotificationWithAssignee'].Summary);
        await utilityGrid.clickCheckBoxOfValueInGrid(response.displayId);
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent('Case Status Changes');
        await caseWatchlist.saveEvents();
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
        await apiHelper.updateCaseStatus(response.id, 'InProgress');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Case Watchlist - Status Change');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await utilityCommon.closeAllBlades();

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
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    it('[4170]: Check out of the box notification-"Case Watchlist - Group Assignment Change " is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        caseData['actionableNotificationWithAssignee'].Summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let response = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await navigationPage.signOut();
        await loginPage.login('qfeng');
        await utilityGrid.searchRecord(caseData['actionableNotificationWithAssignee'].Summary);
        await utilityGrid.clickCheckBoxOfValueInGrid(response.displayId);
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent('Case Group Assignment Changes');
        await caseWatchlist.saveEvents();
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.changeCaseAssignment(response.id, 'United States Support', 'US Support 2');
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Case Watchlist - Group Assignment Change');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await utilityCommon.closeAllBlades();

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(response.displayId + ' has been assigned to you');
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(response.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[4208]: Check out of the box notification-"Task Agent Assignment" is actionable for type Alert', async () => {
        let taskData = {
            "taskName": "DRDMV-16976",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qkatawazi",
        }
        try {
            await apiHelper.apiLogin('qfeng');
            let response1 = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
            let response2 = await apiHelper.createAdhocTask(response1.id, taskData);
            await apiHelper.updateCaseStatus(response1.id, 'InProgress');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink('Task Agent Assignment');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
            await utilityCommon.closeAllBlades();

            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await utilityCommon.closePopUpMessage();
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`${response2.displayId} has been assigned to you.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewTaskPage.getTaskID()).toBe(response2.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    it('[4184]: Check out of the box notification-Task Status Change is actionable for type Alert', async () => {
        let taskData = {
            "taskName": "4184",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qkatawazi",
        }

        await apiHelper.apiLogin('qfeng');
        let response1 = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData);
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');
        await apiHelper.updateTaskStatus(response2.id, 'InProgress');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Task Status Change');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await utilityCommon.closeAllBlades();

        try {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Qiao Feng changed status of ${response2.displayId} to In Progress`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewTaskPage.getTaskID()).toBe(response2.displayId);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[4182]: Check out of the box notification-"Notes from Activity Feed in Case" is actionable for type Alert', async () => {
        await apiHelper.apiLogin('qtao');
        let response1 = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await apiHelper.postActivityCommentsWithoutAttachments('Actionable Notifications', 'Case', response1.id);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Notes from Activity Feed in Case');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');
        await utilityCommon.closeAllBlades();

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
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }

    });

    //asahitya
    it('[4178]: Check out of the box notification-"Notes from Activity Feed in Task" is actionable for type Alert', async () => {
        let taskData = {
            "taskName": "4178",
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
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Notes from Activity Feed in Task');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');
        await utilityCommon.closeAllBlades();

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
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[4204]: Check out of the box notification-"Task group Assignment" is actionable for type Alert', async () => {
        let taskData = {
            "taskName": "DRDMV-16976",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3"
        }

        await apiHelper.apiLogin('qfeng');
        let response1 = await apiHelper.createCase(caseData['actionableNotificationWithoutAssignee']);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData);
        await apiHelper.changeCaseAssignment(response1.id, 'United States Support', 'US Support 1', 'qtao');
        await apiHelper.apiLogin('qtao');
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Task Group Assignment');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable(displayIdStr)).toBeTruthy(displayIdStr + ' is not clickable');
        await utilityCommon.closeAllBlades();

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
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[4180]: Check out of the box notification-"Notes from Activity Feed in Case with attachment" is actionable for type Alert', async () => {
        const attachment = 'e2e/data/ui/attachment/articleStatus.png';
        await apiHelper.apiLogin('qtao');
        let response1 = await apiHelper.createCase(caseData['actionableNotificationWithAssignee']);
        await apiHelper.postActivityCommentsWithAttachments('Attachment is Posted for Actionable Notifications', 'Case', response1.id, attachment);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Notes from Activity Feed in Case with attachment');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');
        await utilityCommon.closeAllBlades();

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
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //asahitya
    it('[4175]: Check out of the box notification-"Notes from Activity Feed in Task with attachment" is actionable for type Alert', async () => {
        let taskData = {
            "taskName": "4178",
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
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Notes from Activity Feed in Task with attachment');
        await notificationTemplateEditPage.openAlertEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');
        await notificationTemplateEditPage.cancelAlertMessageText();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await notificationTemplateEditPage.clickOnEmailTab();
        await notificationTemplateEditPage.openEmailBodyEditMessageText();
        expect(await notificationTemplateEditPage.isFieldClickable('Parent_DisplayID')).toBeTruthy('Parent_DisplayID is not clickable');
        await utilityCommon.closeAllBlades();

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
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ptidke
    it('[3483]: Verify Alert at Requester On case submit , Case Pending-Customer Response Notification, Case Resolution and Case Canceled Notification', async () => {
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.updateNotificationEventStatus('Case Pending - Customer Response - Requester Notification', 'Human Resource', 'Enabled');
        await apiHelper.updateNotificationEventStatus('Case Canceled - Requester Notification', 'Human Resource', 'Enabled');
        await apiHelper.updateNotificationEventStatus('Case Submitted - Requester Notification', 'Human Resource', 'Enabled');
        await apiHelper.updateNotificationEventStatus('Case Resolved - Requester Notification', 'Human Resource', 'Enabled');
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
        await utilityCommon.closePopUpMessage();
    });

    //asahitya
    describe('[4191,4187,4189]: Check out of the box notification-"Article Reviewer assignment" is actionable for type Alert', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let articleResponse = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('demo');
            await apiHelper.updateReviewDueDateRule();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.addCommonConfig('NEXT_REVIEW_PERIOD', '1_MINUTE');
            await apiHelper.deleteApprovalMapping('Knowledge');
        });

        it('[4191,4187,4189]: Check out of the box notification-"Article Reviewer assignment" is actionable for type Alert', async () => {
            //Create Article
            let articleData = {
                "knowledgeSet": "HR",
                "title": `4191 ${randomStr}`,
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
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink('Article Reviewer Assignment');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Content ID')).toBeTruthy('Content ID is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Content ID')).toBeTruthy('Content ID is not clickable');
            await notificationTemplateEditPage.cancelEmailBodyBlade();

            //await utilCommon.closeBladeOnSettings();
            await utilityCommon.closeAllBlades();
            await utilityGrid.searchAndOpenHyperlink('Article Review due');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Content ID')).toBeTruthy('Content ID is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Content ID')).toBeTruthy('Content ID is not clickable');
            await notificationTemplateEditPage.cancelEmailBodyBlade();

            await utilityCommon.closeAllBlades();
            await utilityGrid.searchAndOpenHyperlink('Article Review Overdue');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Content ID')).toBeTruthy('Content ID is not clickable');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Content ID')).toBeTruthy('Content ID is not clickable');
            await notificationTemplateEditPage.cancelEmailBodyBlade();
            await utilityCommon.closeAllBlades();
        });

        it('[4191,4187,4189]: Check out of the box notification-"Article Reviewer assignment" is actionable for type Alert', async () => {
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
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[4193]: Check out of the box notification-"Case SLA missed" is actionable for type Alert', () => {
        let caseResponse = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            let svtCreateData = {
                "terms": "'1000000337'=\"IDGAA5V0HI5R3ANATPP8SX6Q8CB988\" AND '1000000164'=\"1000\"",
                "readableTerms": "'Company'=\"Petramco\"",
                "startWhen": "'450000021'=\"2000\"",
                "readableStartWhen": "'Status'=\"Assigned\"",
                "stopWhen": "'450000021'=\"7000\"",
                "readableStopWhen": "'Status'=\"Closed\"",
                "goalTimeMinutes": "2",
                "dataSource": "Case Management",
                "company": "Petramco",
                "svtName": '4193'
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

        it('[4193]: Check out of the box notification-"Case SLA missed" is actionable for type Alert', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink('Case SLA Missed');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Display ID')).toBeTruthy('Display ID is not clickable on Alert');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Display ID')).toBeTruthy('Display ID is not clickable on Email');
            await utilityCommon.closeAllBlades();
            await browser.sleep(120000); //Wait to miss the SLM Goals
        });

        it('[4193]: Check out of the box notification-"Case SLA missed" is actionable for type Alert', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Service target associated with ${caseResponse.displayId} is missed.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(caseResponse.displayId);
        });

        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets('4193');
        });
    });

    describe('[4173]: Check out of the box notification-"Task SLA Missed" is actionable for type Alert', () => {
        let caseResponse, taskResponse = undefined;
        const svtName = '4173' + [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            let svtCreateData = {
                "terms": "'1000000164'=\"1000\" AND '1000000063'=\"Total Rewards\"",
                "readableTerms": "'Priority'=\"Critical\" AND 'Category Tier 1'=\"Accounts Payable\"",
                "startWhen": "'450000021'=\"2000\"",
                "readableStartWhen": "'Status'=\"Assigned\"",
                "stopWhen": "'450000021'=\"5000\"",
                "readableStopWhen": "'Status'=\"Completed\"",
                "goalTimeMinutes": "1",
                "dataSource": "Task Management",
                "company": "Petramco",
                "svtName": svtName
            }
            let svtResponse = await apiHelper.createSVT(svtCreateData);
            await apiHelper.attachMilestone(svtResponse.id, 'TASK');

            let caseData = {
                "Company": "Petramco",
                "Requester": "tcruise",
                "Priority": "1000",
                "Summary": "Case SLM Actionable Notification 4173",
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
                "category1": "Total Rewards"
            }
            taskResponse = await apiHelper.createAdhocTask(caseResponse.id, taskData)
            await apiHelper.updateCaseStatus(caseResponse.id, 'InProgress')
        });

        it('[4173]: Check out of the box notification-"Task SLA Missed" is actionable for type Alert', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink('Task SLA Missed');
            await notificationTemplateEditPage.openAlertEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Display ID')).toBeTruthy('Display ID is not clickable on Alert');
            await notificationTemplateEditPage.cancelAlertMessageText();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await notificationTemplateEditPage.clickOnEmailTab();
            await notificationTemplateEditPage.openEmailBodyEditMessageText();
            expect(await notificationTemplateEditPage.isFieldClickable('Display ID')).toBeTruthy('Display ID is not clickable on Email');
            await utilityCommon.closeAllBlades();
            await browser.sleep(90000); //Wait to miss the SLM Goals
        });

        it('[4173]: Check out of the box notification-"Task SLA Missed" is actionable for type Alert', async () => {
            await browser.sleep(30000); //Wait to miss the SLM Goals
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(`Service target associated with ${taskResponse.displayId} is missed.`);
            await utilityCommon.switchToNewTab(1);
            expect(await viewTaskPage.getTaskID()).toBe(taskResponse.displayId);
        });

        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets('4173');
        });
    });

    describe('[4133]: Check newly created notification template is actionable', () => {
        let caseDisplayId: string = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createDocumentAndProcessForActionableNotifications();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
        });
        it('[4133]: Check newly created notification template is actionable', async () => {
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
            await viewTasktemplatePo.clickBackArrowBtn();

            //Create Notification Event
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Events', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_EVENTS);
            await browser.sleep(3000); //Manage Ebvents page to load completely
            await notificationEventConsolePage.clickAddNotificationEventBtn();
            await createNotificationEventPage.setEventName('Actionable Notification Event');
            await createNotificationEventPage.setCompanyValue('- Global -');
            await createNotificationEventPage.setDescription('NotificationEvent for Actionable Notification');
            await createNotificationEventPage.saveEventConfig();
        });
        it('[4133]: Check newly created notification template is actionable', async () => {
            //Create NotificationTemplate
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await notificationTemplateConsolePage.clickOnCreateNotificationTemplate();
            await createNotificationTemplatePage.setTemplateName('Actionable Notification');
            await createNotificationTemplatePage.selectModuleName('Cases');
            await createNotificationTemplatePage.setDescription('Actionable Notification Template'),
            await createNotificationTemplatePage.selectEvent('Actionable Notification Event');
            await editNotificationTemplatePage.clickRecipientsCheckbox('Assignee', 'TO');
            await createNotificationTemplatePage.setAlertMessage('Actionable Alert check for Case ID: ');
            await createNotificationTemplatePage.clickOnInsertFieldOfAlert();
            await addFieldsPopPo.clickOnGroupName('Case');
            await addFieldsPopPo.selectDynamicField('Display ID');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createNotificationTemplatePage.clickOnGenerateClickableLinkIconOnAlert();
            await createNotificationTemplatePage.clickOnEmailTab();
            await createNotificationTemplatePage.setSubject('Notification Template Email Subject ');
            await createNotificationTemplatePage.setEmailBody('Notification Template Email Body Actionable Link: ');
            await createNotificationTemplatePage.clickOnInsertFieldOfEmail();
            await addFieldsPopPo.clickOnGroupName('Case');
            await addFieldsPopPo.selectDynamicField('Display ID');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createNotificationTemplatePage.clickOnGenerateClickableLinkIconOnEmail();
            await createNotificationTemplatePage.clickOnSaveButton();
            await editNotificationTemplatePage.clickOnCancelButton();

            //Create new case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("Allen");
            await createCasePage.setSummary("4285");
            await assignmentBladePO.setDropDownValue('AssignedGroup', 'US Support 3');
            await assignmentBladePO.setDropDownValue('Assignee', 'Qiao Feng');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseDisplayId = await viewCasePage.getCaseID();
        });
        it('[4133]: Check newly created notification template is actionable', async () => {
            //Attach the Automated Task from Task Template as created above
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate('Actionable Notification template');
            await manageTaskBladePo.clickCloseButton();

            //Update the status of Case to In Progress
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();

            //Verify that Notification generated is Actionable
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            await notificationPo.clickActionableLink(caseDisplayId + ' has been assigned to you');
            await utilityCommon.switchToNewTab(1);
            expect(await viewCasePage.getCaseID()).toBe(caseDisplayId);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteEmailOrNotificationTemplate('Actionable Notification', '- Global -');
            await apiHelper.deleteNotificationEvent('Actionable Notification Event', 'Human Resource');
            await apiHelper.deleteTaskTemplate('Actionable Notification template');
            await apiHelper.deleteDocumentAndProcessForActionableNotifications();
        });
    });

});