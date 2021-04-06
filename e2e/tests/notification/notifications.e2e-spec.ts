import { browser, Key } from "protractor";
import apiHelper from '../../api/api.helper';
import editCasePage from '../../pageobject/case/edit-case.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import addFieldsPopup from '../../pageobject/common/add-fields-pop.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import notificationPo from '../../pageobject/notification/notification.po';
import statusConfig from '../../pageobject/settings/common/status-config.po';
import notificationTempGridPage from "../../pageobject/settings/notification-config/console-notification-template.po";
import copyNotificationTemplatePage from '../../pageobject/settings/notification-config/copy-notification-template.po';
import createNotificationTemplatePage from '../../pageobject/settings/notification-config/create-notification-template.po';
import editMessageTextBladePo from '../../pageobject/settings/notification-config/edit-Message-Text-Blade.po';
import editNotificationTemplatePage from '../../pageobject/settings/notification-config/edit-notification-template.po';
import { BWF_BASE_URL, operation, security, type, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import caseConsole from '../../pageobject/case/case-console.po';
import caseWatchlist from '../../pageobject/case/case-watchlist-blade.po';

describe("Notifications", () => {
    const caseModule = 'Case';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(caseModule);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    describe('[4355]: Verify that Case Agent is notified for status(Customized one) change in Case life cycle once Case Agent follow the case status change', () => {
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('mcarney');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfig.setCompanyDropdown('Phylum', 'case');
            await statusConfig.clickEditLifeCycleLink();
            await statusConfig.addCustomStatus('Resolved', 'Closed', 'AfterResolved');
        });

        it('[4355]: Verify that Case Agent is notified for status(Customized one) change in Case life cycle once Case Agent follow the case status change', async () => {
            await apiHelper.apiLogin('jmilano');
            let caseData = {
                "Description": "4355-Desc",
                "Requester": "jmilano",
                "Summary": "4355-Summary",
                "Assigned Company": "Phylum",
                "Business Unit": "Phylum Support Org1",
                "Support Group": "Phylum Support Group1",
                "Assignee": "mcarney",
                "Status": "2000",
                "Line of Business": "Finance"
            }
            let response = await apiHelper.createCase(caseData);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchRecord(response.displayId);
            await utilityGrid.clickCheckBoxOfValueInGrid(response.displayId);
            await caseConsole.clickOnAddToWatchlist();
            await caseWatchlist.addWatchlistEvent('Case Status Changes');
            await caseWatchlist.saveEvents();
            await apiHelper.apiLogin('jmilano');
            await apiHelper.updateCaseStatus(response.id, 'InProgress');
            await apiHelper.updateCaseStatus(response.id, 'Pending', 'Customer Response');
            await apiHelper.updateCaseStatus(response.id, 'Resolved', 'Auto Resolved');
            await apiHelper.updateCaseStatus(response.id, 'AfterResolved');
            await utilityCommon.refresh(); //Refreshing the page to reflect the notification
            await notificationPo.clickOnNotificationIcon();
            expect(await notificationPo.isAlertPresent(`Jeanne Milano changed the status of ${response.displayId} to AfterResolved`)).toBeTruthy();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //asahitya
    it('[5530]: [Alerts] Notification alerts on Case status update, for case with assignee', async () => {
        let caseData = {
            "Description": "5530 Desc",
            "Requester": "Elizabeth",
            "Summary": "5530 Summary",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qkatawazi",
            "Status": "2000"
        }

        let caseAccessDataFritz = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['witeAccess'],
            "username": 'Fritz'
        }
        await apiHelper.apiLogin('qtao');
        let response1 = await apiHelper.createCase(caseData);
        let response2 = await apiHelper.createCase(caseData);
        await apiHelper.updateCaseAccess(response1.id, caseAccessDataFritz);
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');
        await utilityCommon.refresh(); //Refreshing the page to reflect the notification
        await notificationPo.clickOnNotificationIcon();
        expect(await notificationPo.isAlertPresent(`Qianru Tao changed the status of ${response1.displayId} to In Progress`)).toBeTruthy('1');
        await apiHelper.apiLogin('fritz');
        await apiHelper.updateCaseStatus(response1.id, 'Pending', 'Customer Response');
        await apiHelper.updateCaseStatus(response1.id, 'Resolved', 'Auto Resolved');
        await apiHelper.updateCaseStatus(response1.id, 'Closed');

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.updateCaseStatus(response2.id, 'InProgress');
        await utilityCommon.refresh(); //Refreshing the page to reflect the notification
        await notificationPo.clickOnNotificationIcon();
        expect(await notificationPo.isAlertPresent(`Fritz Schulz changed the status of ${response1.displayId} to Pending`)).toBeTruthy('2');
        expect(await notificationPo.isAlertPresent(`Fritz Schulz changed the status of ${response1.displayId} to Resolved`)).toBeTruthy('3');
        expect(await notificationPo.isAlertPresent(`Fritz Schulz changed the status of ${response1.displayId} to Closed`)).toBeTruthy('4');
        expect(await notificationPo.isAlertPresent(`Qadim Katawazi changed the status of ${response2.displayId} to In Progress`)).toBeFalsy();
        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            expect(await notificationPo.isAlertPresent(`Qianru Tao changed the status of ${response1.displayId} to In Progress`)).toBeFalsy('5');
            expect(await notificationPo.isAlertPresent(`Fritz Schulz changed the status of ${response1.displayId} to Pending`)).toBeFalsy('6');
            expect(await notificationPo.isAlertPresent(`Fritz Schulz changed the status of ${response1.displayId} to Resolved`)).toBeFalsy('7');
            expect(await notificationPo.isAlertPresent(`Fritz Schulz changed the status of ${response1.displayId} to Closed`)).toBeFalsy('8');
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
    it('[3409]: [Notifications] Case created without Case Template that has assignee - Assignee', async () => {
        let caseData = {
            "Description": "Actionable Notification Desc",
            "Requester": "Elizabeth",
            "Summary": "Actionable Notification ",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('fritz');
        let caseCreateResponse = await apiHelper.createCase(caseData);
        await utilityCommon.refresh(); //Refreshing the page to reflect the notification
        await notificationPo.clickOnNotificationIcon();
        expect(await notificationPo.isAlertPresent(`${caseCreateResponse.displayId} has been assigned to you.`)).toBeTruthy();
        expect(await notificationPo.isAlertPresent(`${caseCreateResponse.displayId} has been assigned to your group.`)).toBeFalsy();
        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            expect(await notificationPo.isAlertPresent(`${caseCreateResponse.displayId} has been assigned to you.`)).toBeFalsy();
            expect(await notificationPo.isAlertPresent(`${caseCreateResponse.displayId} has been assigned to your group.`)).toBeFalsy();
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    describe('[59944]: Formatting for notifications-multi line data appearing in notification', () => {
        let caseData = {
            "Description": "Notification check",
            "Requester": "qkatawazi",
            "Summary": "DRDMV12111 Notification ",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 1",
            "Assignee": "qtao",
            "Status": "2000"
        }
        let emailConfig = {
            email: "bmctemptestemail@gmail.com",
            incomingMailBoxName: "IncomingMail",
        }
        let caseResponse = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let response1 = await apiHelper.createEmailBox('outgoing');
            await apiHelper.apiLogin('qtao');
            caseResponse = await apiHelper.createCase(caseData);
        });
        it('[59944]: Formatting for notifications-multi line data appearing in notification', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndSelectGridRecord("Case Agent Assignment");
            await notificationTempGridPage.clickCopyTemplate();
            await copyNotificationTemplatePage.setCompanyValue('Petramco');
            await copyNotificationTemplatePage.clickOnCreateCopyButton();
            await utilityCommon.closePopUpMessage();
            await editNotificationTemplatePage.clickOnCancelButton();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.addFilter('Company', 'Petramco', 'text');
            await utilityGrid.searchAndOpenHyperlinkWithoutRemovingFilter('Case Agent Assignment');
            await editNotificationTemplatePage.openAlertEditMessageText();
            await browser.sleep(2000); // required to load edit message tab completely
            await editNotificationTemplatePage.updateAlertEmailMsgs('Hi' + Key.ENTER + 'Hello' + Key.ENTER + 'Hey' + Key.ENTER);
            await editNotificationTemplatePage.clickOnInsertFieldOfAlert();
            await addFieldsPopup.clickOnGroupName('Case');
            await addFieldsPopup.selectDynamicField('Description');
            await addFieldsPopup.clickOnOkButtonOfEditor();
            await editNotificationTemplatePage.clickOnInsertFieldOfAlert();
            await addFieldsPopup.clickOnGroupName('Case');
            await addFieldsPopup.selectDynamicField('Resolution Description');
            await addFieldsPopup.clickOnOkButtonOfEditor();
            await editMessageTextBladePo.clickOnSaveButton();
            await editNotificationTemplatePage.clickOnEmailTab();
            await editNotificationTemplatePage.openEmailBodyEditMessageText();
            await editNotificationTemplatePage.clickOnInsertFieldOfAlert();
            await addFieldsPopup.clickOnGroupName('Case');
            await addFieldsPopup.selectDynamicField('Description');
            await addFieldsPopup.clickOnOkButtonOfEditor();
            await editNotificationTemplatePage.clickOnInsertFieldOfAlert();
            await addFieldsPopup.clickOnGroupName('Case');
            await addFieldsPopup.selectDynamicField('Resolution Description');
            await addFieldsPopup.clickOnOkButtonOfEditor();
            await editNotificationTemplatePage.clickOnInsertFieldOfAlert();
            await addFieldsPopup.clickOnGroupName('Case');
            await addFieldsPopup.selectDynamicField('Display ID');
            await addFieldsPopup.clickOnOkButtonOfEditor();
            await editMessageTextBladePo.clickOnSaveButton();
            await editNotificationTemplatePage.clickOnCancelButton();
            await utilityGrid.searchAndOpenHyperlinkWithoutRemovingFilter('Case Agent Assignment');
            await editNotificationTemplatePage.openAlertEditMessageText();
            expect(await editMessageTextBladePo.getMessageBody()).toContain('Hello');
            expect(await editMessageTextBladePo.getMessageBody()).toContain('Hey');
            await editMessageTextBladePo.clickOnSaveButton();
            await utilityCommon.closeAllBlades();
            await utilityGrid.clearFilter();
        });
        it('[59944]: Formatting for notifications-multi line data appearing in notification', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickEditCaseButton();
            await editCasePage.updateDescription('test abc' + Key.ENTER + '.' + Key.ENTER + '.' + Key.ENTER + 'test pqr');
            await editCasePage.updateResolutionCode('hfg' + Key.ENTER + 'lmn');
            await editCasePage.clickSaveCase();
            await viewCasePage.clickEditCaseButton();
            await changeAssignmentBladePo.setAssignee('US Support 3', 'Qiao Feng');
            await editCasePage.clickSaveCase();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            expect(await notificationPo.isAlertPresent('test abc\n.\n.\ntest pqr')).toBeTruthy();
            await browser.sleep(2000); // hardwait to appear email message in "AR System Email Messages"
            await apiHelper.apiLogin('tadmin');
            expect(await apiHelper.getHTMLBodyOfEmail(`${caseResponse.displayId} has been assigned to you.`, 'qfeng@petramco.com')).toContain('<p>test abc<br>.<br>.<br>test pqr');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteEmailOrNotificationTemplate('Case Agent Assignment', 'Petramco');
        });
    });
});