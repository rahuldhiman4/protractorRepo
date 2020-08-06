import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL, operation, security, type } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import apiHelper from '../../api/api.helper';
import notificationPo from '../../pageobject/notification/notification.po';

describe("Notification Template", () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await apiHelper.apiLogin('tadmin');
        await apiHelper.setDefaultNotificationForUser('qkatawazi', "Alert");
        await apiHelper.setDefaultNotificationForUser('Fritz', "Alert");
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

});