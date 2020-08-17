import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL, operation, security, type } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import apiHelper from '../../api/api.helper';
import notificationPo from '../../pageobject/notification/notification.po';
import statusConfig from '../../pageobject/settings/common/status-config.po';
import utilityGrid from '../../utils/utility.grid';

describe("Notifications", () => {
    const caseModule = 'Case';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(caseModule);

        const personDataFile = require('../../data/ui/foundation/person.ui.json');
        let personData1 = personDataFile['PhylumCaseAgent1'];
        await apiHelper.createNewUser(personData1);
        await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Phylum Support Group1');
        await apiHelper.associatePersonToCompany(personData1.userId, 'Phylum');

        let personData2 = personDataFile['PhylumCaseAgent2'];
        await apiHelper.createNewUser(personData2);
        await apiHelper.associatePersonToSupportGroup(personData2.userId, 'Phylum Support Group1');
        await apiHelper.associatePersonToCompany(personData2.userId, 'Phylum');

        await apiHelper.setDefaultNotificationForUser('qkatawazi', "Alert");
        await apiHelper.setDefaultNotificationForUser('Fritz', "Alert");
        await apiHelper.setDefaultNotificationForUser('qfeng', "Alert");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    it('[DRDMV-8319]: [Alerts] Notification alerts on Case status update, for case with assignee', async () => {
        let caseData = {
            "Description": "DRDMV-8319 Desc",
            "Requester": "Elizabeth",
            "Summary": "DRDMV-8319 Summary",
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
        await utilityCommon.refresh();
        await notificationPo.clickOnNotificationIcon();
        expect(await notificationPo.isAlertPresent(`Qianru Tao changed the status of ${response1.displayId} to In Progress`)).toBeTruthy('1');
        await apiHelper.apiLogin('fritz');
        await apiHelper.updateCaseStatus(response1.id, 'Pending', 'Customer Response');
        await apiHelper.updateCaseStatus(response1.id, 'Resolved', 'Auto Resolved');
        await apiHelper.updateCaseStatus(response1.id, 'Closed');

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.updateCaseStatus(response2.id, 'InProgress');
        await utilityCommon.refresh();
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

    it('[DRDMV-22964]: [Notifications] Case created without Case Template that has assignee - Assignee', async () => {
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
        let response = await apiHelper.createCase(caseData);
        await utilityCommon.refresh(); //Refreshing the page to reflect the notification
        await notificationPo.clickOnNotificationIcon();
        expect(await notificationPo.isAlertPresent(`${response.displayId} has been assigned to you.`)).toBeTruthy();
        expect(await notificationPo.isAlertPresent(`${response.displayId} has been assigned to your group.`)).toBeFalsy();
        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await notificationPo.clickOnNotificationIcon();
            expect(await notificationPo.isAlertPresent(`${response.displayId} has been assigned to you.`)).toBeFalsy();
            expect(await notificationPo.isAlertPresent(`${response.displayId} has been assigned to your group.`)).toBeFalsy();
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    describe('[DRDMV-16036]: Verify that Case Agent is notified for status(Customized one) change in Case life cycle once Case Agent follow the case status change', () => {
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('idphylum1@petramco.com', 'Password_1234');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.setDefaultNotificationForUser('idphylum1', "Alert");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
            await statusConfig.setCompanyDropdown('Phylum', 'case');
            await statusConfig.clickEditLifeCycleLink();
            await statusConfig.addCustomStatus('Resolved', 'Closed', 'AfterResolved');
        });

        it('[DRDMV-16036]: Verify that Case Agent is notified for status(Customized one) change in Case life cycle once Case Agent follow the case status change', async () => {
            await apiHelper.apiLoginWithCredential('idphylum2@petramco.com', "Password_1234");
            let caseData = {
                "Description": "DRDMV-16036-Desc",
                "Requester": "idphylum2",
                "Summary": "DRDMV-16036-Summary",
                "Assigned Company": "Phylum",
                "Business Unit": "Phylum Support Org1",
                "Support Group": "Phylum Support Group1",
                "Assignee": "idphylum1",
                "Status": "2000"
            }
            let response = await apiHelper.createCase(caseData);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', "Password_1234");
            await apiHelper.addCaseToWatchlistAllEvents(response.id);
            await apiHelper.apiLoginWithCredential('idphylum2@petramco.com', "Password_1234");
            await apiHelper.updateCaseStatus(response.id, 'InProgress');
            await apiHelper.updateCaseStatus(response.id, 'Pending', 'Customer Response');
            await apiHelper.updateCaseStatus(response.id, 'Resolved', 'Auto Resolved');
            await apiHelper.updateCaseStatus(response.id, 'AfterResolved');
            await utilityCommon.refresh(); //Refreshing the page to reflect the notification
            await notificationPo.clickOnNotificationIcon();
            expect(await notificationPo.isAlertPresent(`Watchlist Alert: ${response.displayId} Marked: AfterResolved by phylumfn2 phylumln2.`)).toBeTruthy();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

});