import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsole from '../../pageobject/case/case-console.po';
import caseWatchlist from '../../pageobject/case/case-watchlist-blade.po';
import editCase from '../../pageobject/case/edit-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import changeAssignment from "../../pageobject/common/change-assignment-blade.po";
import loginPage from '../../pageobject/common/login.po';
import navigationPage from '../../pageobject/common/navigation.po';
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import notificationAlerts from '../../pageobject/notification/notification.po';
import { BWF_BASE_URL, operation, security, type } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Case Watchlist', () => {

    let caseAssignmentChangesStr: string = 'Case Assignment Changes';
    let caseGroupAssignmentChangesStr: string = 'Case Group Assignment Changes';
    let caseStatusChangesStr: string = 'Case Status Changes';
    let inProgressStr = 'In Progress';
    let pendingStr = "Pending";
    let petramcoStr = "Petramco";
    let compensationAndBenefitsStr = "Compensation and Benefits";
    let qannisStr = "qannis";
    let elizabethPetersStr = "Elizabeth Peters";
    let qianruTaoStr = "Qianru Tao";
    let assignmentNotificationStr = "Watchlist Alert: {0} assigned to {1} by {2}.";
    let statusNotificationStr = "Watchlist Alert: {0} Marked: {1} by {2}.";
    let groupAssignmentNotificationStr = "Watchlist Alert: {0} was assigned to group {1} by {2}";
    let qtaoStr = "qtao";
    let qfengStr = "qfeng";
    let customerResponseStr = "Customer Response";
    let resolvedStr = "Resolved";
    let qiaoFengStr = "Qiao Feng";
    let auSupport1Str = "AU Support 1";
    let kasiaOstlunStr = "Kasia Ostlun";
    let hrSupportStr = 'HR Support';
    let australiaSupportStr = 'Australia Support';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(qfengStr);
        await utilityGrid.clearFilter();
        await apiHelper.apiLogin("tadmin");
        await apiHelper.setDefaultNotificationForUser(qannisStr, "Alert");
        await apiHelper.setDefaultNotificationForUser(qfengStr, "Alert");
        await apiHelper.setDefaultNotificationForUser(qtaoStr, "Alert");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
        await navigationPage.gotoCaseConsole();
    });

    it('[DRDMV-15985]: Verify that all the selected Cases are available in Watchlist modal', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseData['caseWatchlist']);
            caseId[i] = response.displayId;
        }
        await utilityGrid.clearFilter();
        await utilityCommon.refresh();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        await utilityCommon.closePopUpMessage();
        await caseConsole.clickOnWatchlistIcon();
        for (let i: number = 0; i < 3; i++) {
            expect(await caseWatchlist.isCasePresent(caseId[i])).toBeTruthy(caseId[i] + ": Case is not present");
        }
    });

    it('[DRDMV-16015]: Verify that Case Agent can select, un-select and sort the cases in Watchlist modal', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseData['caseWatchlist']);
            caseId[i] = response.displayId;
        }
        await utilityGrid.clearFilter();
        await utilityCommon.refresh();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        await utilityCommon.closePopUpMessage();
        await caseConsole.clickOnWatchlistIcon();
        await caseWatchlist.selectAllCases();
        expect(await caseWatchlist.isAllCasesSelected()).toBeTruthy("All cases are not selected");
        await caseWatchlist.selectAllCases();
        expect(await caseWatchlist.isAllCasesUnSelected()).toBeTruthy("All cases are selected");
        expect(await caseWatchlist.isColumnSorted("Case ID")).toBeTruthy("Columns are not sorted");
    });

    it('[DRDMV-16017]: Verify that Case Agent can search the cases in modal', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseData['caseWatchlist']);
            caseId[i] = response.displayId;
        }
        await utilityGrid.clearFilter();
        await utilityCommon.refresh();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        await utilityCommon.closePopUpMessage();
        await caseConsole.clickOnWatchlistIcon();
        expect(await caseWatchlist.isCaseSearchGiveCorrectResult(caseId[0])).toBeTruthy('Unable to find the case');
    });

    it('[DRDMV-16018]: Verify the default columns and total columns available in Watchlist modal', async () => {
        await caseConsole.clickOnWatchlistIcon();
        let defaultAssignedCaseColumns: string[] = ["Case ID", "Priority", "Status", "Summary", "Assigned Group", "Assignee"];
        expect(await caseWatchlist.areWatchlistColumnMatches(defaultAssignedCaseColumns)).toBeTruthy("Default columns are not matching");
        let remainingColumns: string[] = ["Assigned Company", "ID"];
        await caseWatchlist.addWatchlistGridColumn(remainingColumns);
        let expectedColumns: string[] = ["Case ID", "Priority", "Status", "Summary", "Assigned Group", "Assignee", "Assigned Company", "ID"];
        expect(await caseWatchlist.areWatchlistColumnMatches(expectedColumns)).toBeTruthy("All columns are not matching");
        await caseWatchlist.removeWatchlistGridColumn(remainingColumns);
    });

    it('[DRDMV-16019]: Verify that Case Agent can filter the cases in Watchlist modal', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        let response = await apiHelper.createCase(caseData['caseWatchlist']);
        caseId[0] = response.displayId;
        for (let i: number = 1; i < 4; i++) {
            let response = await apiHelper.createCase(caseData['caseWatchlist_Resolved']);
            caseId[i] = response.displayId;
        }
        await utilityGrid.clearFilter();
        await utilityCommon.refresh();
        for (let i: number = 0; i < 4; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        await utilityCommon.closePopUpMessage();
        await caseConsole.clickOnWatchlistIcon();
        await caseWatchlist.addFilter("Status", "Resolved", 'searchbox');
        expect(await caseWatchlist.isEntireColumnContainsValue("Status", "Resolved")).toBeTruthy("Records are not filtered"); //Need to fix common method written by Ankush
    }, 380 * 1000);

    it('[DRDMV-16043]: Verify that Case Agent can remove the cases from Watchlist', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        for (let i: number = 0; i < 2; i++) {
            let response = await apiHelper.createCase(caseData['caseWatchlist_Resolved']);
            caseId[i] = response.displayId;
        }
        await utilityGrid.clearFilter();
        await utilityCommon.refresh();
        for (let i: number = 0; i < 2; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        await utilityCommon.closePopUpMessage();
        await caseConsole.clickOnWatchlistIcon();
        await caseWatchlist.selectTwoCases(caseId[0], caseId[1]);
        await caseWatchlist.clickOnRemoveBtn();
        await caseWatchlist.clearWatchlistFilter();
        expect(await caseWatchlist.isCasePresent(caseId[0])).toBeFalsy(caseId[0] + ": Case is not removed");
        expect(await caseWatchlist.isCasePresent(caseId[1])).toBeFalsy(caseId[1] + ": Case is not removed");
    });//, 200 * 1000);

    it('[DRDMV-16020]: Verify that all the Case Agents having read only access can follow/unfollow the cases', async () => {
        await apiHelper.apiLogin(qtaoStr);

        //Create case
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['caseWatchlist']);
        let caseId = response.displayId;
        let caseGuid = response.id;
        console.log(caseId);

        //Write access to qtao
        let caseAccessDataQtao = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['witeAccess'],
            "username": 'qtao'
        }
        await apiHelper.updateCaseAccess(caseGuid, caseAccessDataQtao);

        //Read access to qannis
        let caseAccessDataQannis = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['readAccess'],
            "username": qannisStr
        }
        await apiHelper.updateCaseAccess(caseGuid, caseAccessDataQannis);

        //login with qannis and Add the case to Watchlist
        try {
            await navigationPage.signOut();
            await loginPage.login(qannisStr);
            await utilityGrid.clearFilter();
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId);
            await caseConsole.clickOnAddToWatchlist();
            await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
            await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
            await caseWatchlist.saveEvents();
            expect(await utilityCommon.getAllPopupMsg()).toContain("Added 1 selected case(s) to the watchlist.");
            await utilityCommon.closePopUpMessage();

            //login with qtao and update the case assignment and case status
            await navigationPage.signOut();
            await loginPage.login(qtaoStr);
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeCaseStatus(inProgressStr);
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickEditCaseButton();
            await editCase.clickChangeAssignmentButton();
            await changeAssignment.setAssignee(petramcoStr, hrSupportStr, compensationAndBenefitsStr, elizabethPetersStr);
            await editCase.clickSaveCase();
            await utilityCommon.closePopUpMessage();

            //login with qannis, verify the notifications and remove the case from watchlist
            await navigationPage.signOut();
            await loginPage.login(qannisStr);
            await notificationAlerts.clickOnNotificationIcon();
            let assignmentNotification = utilityCommon.formatString(assignmentNotificationStr, caseId, elizabethPetersStr, qianruTaoStr);
            let statusNotification = utilityCommon.formatString(statusNotificationStr, caseId, inProgressStr, qianruTaoStr);
            expect(await notificationAlerts.isAlertPresent(assignmentNotification)).toBeTruthy(assignmentNotification + " is not present");
            expect(await notificationAlerts.isAlertPresent(statusNotification)).toBeTruthy(statusNotification + " is not present");
            await notificationAlerts.clickOnNotificationIcon();

            //Remove the case from watchlist
            await caseConsole.clickOnWatchlistIcon();
            await caseWatchlist.selectCase(caseId);
            await caseWatchlist.clickOnRemoveBtn();
            await caseWatchlist.clickOnBackBtn();

            //Login with qtao and update the case status and assignment
            await navigationPage.signOut();
            await loginPage.login("qtao");
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeCaseStatus(pendingStr);
            await updateStatusBladePo.setStatusReason(customerResponseStr);
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickEditCaseButton();
            await editCase.clickChangeAssignmentButton();
            await changeAssignment.setAssignee(petramcoStr, hrSupportStr, compensationAndBenefitsStr, "Peter Kahn");
            await editCase.clickSaveCase();

            //login with qannis, verify the notifications are not present
            await navigationPage.signOut();
            await loginPage.login(qannisStr);
            await notificationAlerts.clickOnNotificationIcon();
            let assignmentNotification1 = utilityCommon.formatString(assignmentNotificationStr, caseId, "Peter Kahn", qianruTaoStr);
            let statusNotification1 = utilityCommon.formatString(statusNotificationStr, caseId, pendingStr, qianruTaoStr);
            expect(await notificationAlerts.isAlertPresent(assignmentNotification1)).toBeFalsy(assignmentNotification1 + " is present");
            expect(await notificationAlerts.isAlertPresent(statusNotification1)).toBeFalsy(statusNotification1 + " is present");
            await notificationAlerts.clickOnNotificationIcon();
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(qfengStr);
        }
    }, 600 * 1000);

    it('[DRDMV-16033]: Verify that Case Agent is notified for OOB status changes in Case life cycle once Case Agent follow the case status change', async () => {
        await apiHelper.apiLogin(qtaoStr);

        //Create case
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['caseWatchlist']);
        let caseId = response.displayId;

        await utilityCommon.refresh();
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId);
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        expect(await utilityCommon.getAllPopupMsg()).toContain("Added 1 selected case(s) to the watchlist.");
        await utilityCommon.closePopUpMessage();

        await utilityGrid.searchAndOpenHyperlink(caseId);
        await updateStatusBladePo.changeCaseStatus(inProgressStr);
        await updateStatusBladePo.clickSaveStatus();
        await utilityCommon.closePopUpMessage();
        await updateStatusBladePo.changeCaseStatus(pendingStr);
        await updateStatusBladePo.setStatusReason(customerResponseStr);
        await updateStatusBladePo.clickSaveStatus();
        await utilityCommon.closePopUpMessage();
        await updateStatusBladePo.changeCaseStatus(resolvedStr);
        await updateStatusBladePo.setStatusReason("No Further Action Required");
        await updateStatusBladePo.clickSaveStatus();
        await utilityCommon.closePopUpMessage();
        await utilityCommon.refresh();
        await updateStatusBladePo.changeCaseStatus("Closed");
        await updateStatusBladePo.clickSaveStatus();
        await utilityCommon.closePopUpMessage();
        let statusNotification1 = utilityCommon.formatString(statusNotificationStr, caseId, inProgressStr, qiaoFengStr);
        let statusNotification2 = utilityCommon.formatString(statusNotificationStr, caseId, pendingStr, qiaoFengStr);
        let statusNotification3 = utilityCommon.formatString(statusNotificationStr, caseId, resolvedStr, qiaoFengStr);
        let statusNotification4 = utilityCommon.formatString(statusNotificationStr, caseId, "Closed", qiaoFengStr);

        await utilityCommon.refresh();
        await notificationAlerts.clickOnNotificationIcon();
        expect(await notificationAlerts.isAlertPresent(statusNotification1)).toBeTruthy(statusNotification1 + " is not present");
        expect(await notificationAlerts.isAlertPresent(statusNotification2)).toBeTruthy(statusNotification2 + " is not present");
        expect(await notificationAlerts.isAlertPresent(statusNotification3)).toBeTruthy(statusNotification3 + " is not present");
        expect(await notificationAlerts.isAlertPresent(statusNotification4)).toBeTruthy(statusNotification4 + " is not present");
        await notificationAlerts.clickOnNotificationIcon();
    });//, 220 * 1000);

    it('[DRDMV-16029]: Verify that all the Case Agents having write access can follow/unfollow the cases', async () => {
        await apiHelper.apiLogin(qfengStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseData['caseWatchlist']);
            caseId[i] = response.displayId;
        }
        // navigation to reflect Cases on console
        await navigationPage.gotoTaskConsole();
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchAndOpenHyperlink(caseId[1]);
        await viewCasePage.clickAddToWatchlistLink();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        await utilityCommon.closePopUpMessage();

        await updateStatusBladePo.changeCaseStatus(inProgressStr);
        await updateStatusBladePo.clickSaveStatus();
        await viewCasePage.clickEditCaseButton();
        await editCase.clickChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, hrSupportStr, compensationAndBenefitsStr, elizabethPetersStr);
        await editCase.clickSaveCase();
        await utilityCommon.closePopUpMessage();

        await navigationPage.gotoCaseConsole();
        await caseConsole.clickOnWatchlistIcon();
        await caseWatchlist.selectCase(caseId[1]);
        await caseWatchlist.clickOnRemoveBtn();
        await caseWatchlist.clickOnBackBtn();

        await utilityGrid.searchAndOpenHyperlink(caseId[1]);
        await updateStatusBladePo.changeCaseStatus(pendingStr);
        await updateStatusBladePo.setStatusReason(customerResponseStr);
        await updateStatusBladePo.clickSaveStatus();
        await utilityCommon.closePopUpMessage();
        await viewCasePage.clickEditCaseButton();
        await editCase.clickChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, australiaSupportStr, auSupport1Str, kasiaOstlunStr);
        await editCase.clickSaveCase();

        let assignmentNotification1 = utilityCommon.formatString(assignmentNotificationStr, caseId[1], elizabethPetersStr, qiaoFengStr);
        let statusNotification1 = utilityCommon.formatString(statusNotificationStr, caseId[1], inProgressStr, qiaoFengStr);
        let assignmentNotification2 = utilityCommon.formatString(assignmentNotificationStr, caseId[1], kasiaOstlunStr, qiaoFengStr);
        let statusNotification2 = utilityCommon.formatString(statusNotificationStr, caseId[1], pendingStr, qiaoFengStr);

        await utilityCommon.refresh();
        await notificationAlerts.clickOnNotificationIcon();
        expect(await notificationAlerts.isAlertPresent(assignmentNotification1)).toBeTruthy(assignmentNotification1 + " is not present");
        expect(await notificationAlerts.isAlertPresent(statusNotification1)).toBeTruthy(statusNotification1 + " is not present");
        expect(await notificationAlerts.isAlertPresent(assignmentNotification2)).toBeFalsy(assignmentNotification2 + " is present");
        expect(await notificationAlerts.isAlertPresent(statusNotification2)).toBeFalsy(statusNotification2 + " is present");
        await notificationAlerts.clickOnNotificationIcon();
    });//, 200 * 1000);

    it('[DRDMV-16044,DRDMV-16060]: Verify the position, Labels and * icon on Case console, Case and Watchlist modal', async () => {
        await apiHelper.apiLogin(qfengStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['caseWatchlist']);
        let caseId = response.displayId;
        await utilityCommon.refresh();
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId);
        expect(await caseConsole.getAddToWatchlistText()).toBe("Add to Watchlist", "Label is not matching");
        expect(await caseConsole.getWatchlistIconText()).toBe("Watchlist", "Label is not matching");
        await caseConsole.clickOnAddToWatchlist();
        expect(await caseWatchlist.getCaseAssignmentChangesLabel()).toBe("Case Assignment Changes", "Label is not matching");
        expect(await caseWatchlist.getCaseGroupAssignmentChangesLabel()).toBe("Case Group Assignment Changes", "Label is not matching");
        expect(await caseWatchlist.getCaseStatusChangesLabel()).toBe("Case Status Changes", "Label is not matching");
        expect(await caseWatchlist.getSaveButtonLabel()).toBe("Save", "Label is not matching");
        expect(await caseWatchlist.getCloseButtonLabel()).toBe("Close", "Label is not matching");
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        await utilityCommon.closePopUpMessage();
        await caseConsole.clickOnWatchlistIcon();
        await caseWatchlist.selectCase(caseId);
        expect(await caseWatchlist.getRemoveButtonLabel()).toBe("Remove", "Label is not matching");
        expect(await caseWatchlist.getUpdateWatchlistEventsButtonLabel()).toBe("Update Watchlist Events", "Label is not matching");
        await caseWatchlist.clickOnBackBtn();
        await caseConsole.clickOnWatchlistIcon();
        await caseWatchlist.openCase(caseId);
        expect(await viewCasePage.getCaseID()).toBe(caseId, "Case ID is not matching");
        expect(await viewCasePage.getStopWatchingLinkText()).toBe("Stop Watching", "Label is not matching");
        await viewCasePage.clickStopWatchingLink();
        expect(await viewCasePage.getAddToWatchlistLinkText()).toBe("Add to Watchlist", "Label is not matching");
    });

    it('[DRDMV-16554]: Verify that Agent can Follow and Unfollow the Case Group Assignment from Case Edit', async () => {
        await apiHelper.apiLogin(qfengStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['caseWatchlist']);
        let caseId = response.displayId;
        await utilityGrid.searchAndOpenHyperlink(caseId);
        await viewCasePage.clickAddToWatchlistLink();
        await caseWatchlist.addWatchlistEvent(caseGroupAssignmentChangesStr);
        await caseWatchlist.saveEvents();
        await utilityCommon.closePopUpMessage();

        //Assign the case to Au Suppport 1 Group
        await viewCasePage.clickEditCaseButton();
        await editCase.clickChangeAssignmentButton();
        await changeAssignment.selectBusinessUnit('Australia Support');
        await changeAssignment.selectSupportGroup(auSupport1Str);
        await changeAssignment.selectAssignToSupportGroup();
        await changeAssignment.clickOnAssignButton();
        await editCase.clickSaveCase();
        await utilityCommon.closePopUpMessage();

        //Stop watching and change the Group Assignee to Compensation and Benefits
        await viewCasePage.clickStopWatchingLink();
        await viewCasePage.clickEditCaseButton();
        await editCase.clickChangeAssignmentButton();
        await changeAssignment.selectBusinessUnit('HR Support');
        await changeAssignment.selectSupportGroup(compensationAndBenefitsStr);
        await changeAssignment.selectAssignToSupportGroup();
        await changeAssignment.clickOnAssignButton();
        await editCase.clickSaveCase();
        await utilityCommon.closePopUpMessage();

        await utilityCommon.refresh();
        await notificationAlerts.clickOnNotificationIcon();
        let groupAssignmentNotification1 = utilityCommon.formatString(groupAssignmentNotificationStr, caseId, auSupport1Str, qiaoFengStr);
        let groupAssignmentNotification2 = utilityCommon.formatString(groupAssignmentNotificationStr, caseId, compensationAndBenefitsStr, qiaoFengStr);

        expect(await notificationAlerts.isAlertPresent(groupAssignmentNotification1)).toBeTruthy(groupAssignmentNotification1 + " is not present");
        expect(await notificationAlerts.isAlertPresent(groupAssignmentNotification2)).toBeFalsy(groupAssignmentNotification2 + " is present");
        await notificationAlerts.clickOnNotificationIcon();
    });

    it('[DRDMV-16555]: Verify that Agent can Follow and Unfollow the Case Group Assignment from Case Console', async () => {
        await apiHelper.apiLogin(qfengStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['caseWatchlist']);
        let caseId = response.displayId;
        await utilityCommon.refresh();
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId);
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseGroupAssignmentChangesStr);
        await caseWatchlist.saveEvents();
        await utilityGrid.searchAndOpenHyperlink(caseId);

        //Assign the case to Au Suppport 1 Group
        await viewCasePage.clickEditCaseButton();
        await editCase.clickChangeAssignmentButton();
        await changeAssignment.selectBusinessUnit('Australia Support');
        await changeAssignment.selectSupportGroup(auSupport1Str);
        await changeAssignment.selectAssignToSupportGroup();
        await changeAssignment.clickOnAssignButton();
        await editCase.clickSaveCase();

        //Stop watching and change the Group Assignee to Compensation and Benefits
        await navigationPage.gotoCaseConsole();
        await caseConsole.clickOnWatchlistIcon();
        await caseWatchlist.selectCase(caseId);
        await caseWatchlist.clickOnRemoveBtn();
        await caseWatchlist.clickOnBackBtn();
        await utilityGrid.searchAndOpenHyperlink(caseId);

        //Assign the case to Compensation and Benefits Group
        await viewCasePage.clickEditCaseButton();
        await editCase.clickChangeAssignmentButton();
        await changeAssignment.selectBusinessUnit('HR Support');
        await changeAssignment.selectSupportGroup(compensationAndBenefitsStr);
        await changeAssignment.selectAssignToSupportGroup();
        await changeAssignment.clickOnAssignButton();
        await editCase.clickSaveCase();
        await utilityCommon.closePopUpMessage();

        await utilityCommon.refresh();
        await notificationAlerts.clickOnNotificationIcon();
        let groupAssignmentNotification1 = utilityCommon.formatString(groupAssignmentNotificationStr, caseId, auSupport1Str, qiaoFengStr);
        let groupAssignmentNotification2 = utilityCommon.formatString(groupAssignmentNotificationStr, caseId, compensationAndBenefitsStr, qiaoFengStr);

        expect(await notificationAlerts.isAlertPresent(groupAssignmentNotification1)).toBeTruthy(groupAssignmentNotification1 + " is not present");
        expect(await notificationAlerts.isAlertPresent(groupAssignmentNotification2)).toBeFalsy(groupAssignmentNotification2 + " is present");
        await notificationAlerts.clickOnNotificationIcon();
    });//, 180 * 1000);

    it('[DRDMV-16556]: Verify that Agent remove the Case Group Assignment and Status from Watchlist update event then only Assignment change notifications will be shown', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['caseWatchlist_2']);
        let caseId = response.displayId;
        let caseGuid = response.id;

        //Write access to qtao
        let caseAccessDataQtao = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['witeAccess'],
            "username": qtaoStr
        }
        await apiHelper.updateCaseAccess(caseGuid, caseAccessDataQtao);

        try {
            await navigationPage.signOut();
            await loginPage.login(qtaoStr);
            await utilityGrid.clearFilter();
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId);
            await caseConsole.clickOnAddToWatchlist();
            await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
            await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
            await caseWatchlist.addWatchlistEvent(caseGroupAssignmentChangesStr);
            await caseWatchlist.saveEvents();
            await utilityCommon.closePopUpMessage();
            await caseConsole.clickOnWatchlistIcon();
            await caseWatchlist.selectCase(caseId);
            await caseWatchlist.clickOnUpdateWatchlistEventsBtn();
            await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
            await caseWatchlist.saveEvents();
            await caseWatchlist.clickOnBackBtn();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeCaseStatus(inProgressStr);
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickEditCaseButton();
            await editCase.clickChangeAssignmentButton();
            await changeAssignment.setAssignee(petramcoStr, australiaSupportStr, auSupport1Str, kasiaOstlunStr);
            await editCase.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickEditCaseButton();
            await editCase.clickChangeAssignmentButton();
            await changeAssignment.selectBusinessUnit('HR Support');
            await changeAssignment.selectSupportGroup(compensationAndBenefitsStr);
            await changeAssignment.selectAssignToSupportGroup();
            await changeAssignment.clickOnAssignButton();
            await editCase.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.refresh();

            //Verify the notifications
            await notificationAlerts.clickOnNotificationIcon();
            let assignmentNotification = utilityCommon.formatString(assignmentNotificationStr, caseId, kasiaOstlunStr, qianruTaoStr);
            let statusNotification = utilityCommon.formatString(statusNotificationStr, caseId, inProgressStr, qianruTaoStr);
            let groupAssignmentNotification = utilityCommon.formatString(groupAssignmentNotificationStr, caseId, compensationAndBenefitsStr, qianruTaoStr);

            expect(await notificationAlerts.isAlertPresent(assignmentNotification)).toBeTruthy(assignmentNotification + " is not present");
            expect(await notificationAlerts.isAlertPresent(statusNotification)).toBeFalsy(statusNotification + " is present");
            expect(await notificationAlerts.isAlertPresent(groupAssignmentNotification)).toBeFalsy(groupAssignmentNotification + " is present");
            await notificationAlerts.clickOnNotificationIcon();
        }
        catch (ex) {
            throw ex;
        }
        finally {
            //Reset login
            await navigationPage.signOut();
            await loginPage.login(qfengStr);
        }
    });//, 220 * 1000);

    it('[DRDMV-16557]: Verify that Agent can update(add) Case group Assignment for any of the existing Watched case', async () => {
        await apiHelper.apiLogin(qfengStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['caseWatchlist_1']);
        let caseId = response.displayId;
        let caseGuid = response.id;

        //Write access to qtao
        let caseAccessDataQtao = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['witeAccess'],
            "username": 'qtao'
        }
        await apiHelper.updateCaseAccess(caseGuid, caseAccessDataQtao);

        try {
            //login with qtao
            await navigationPage.signOut();
            await loginPage.login(qtaoStr);

            //Add Case to Watchlist with events Case Status Change and Case Assignment change
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId);
            await caseConsole.clickOnAddToWatchlist();
            await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
            await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
            await caseWatchlist.saveEvents();
            await utilityCommon.closePopUpMessage();

            //Update case Watch with events Case Status Change and Case Group Assignment change
            await caseConsole.clickOnWatchlistIcon();
            await caseWatchlist.selectCase(caseId);
            await caseWatchlist.clickOnUpdateWatchlistEventsBtn();
            await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
            await caseWatchlist.addWatchlistEvent(caseGroupAssignmentChangesStr);
            await caseWatchlist.saveEvents();

            //Change case status, case assignment and case group assignment
            await caseWatchlist.clickOnBackBtn();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePage.clickEditCaseButton();
            await editCase.clickChangeAssignmentButton();
            await changeAssignment.selectBusinessUnit('HR Support');
            await changeAssignment.selectSupportGroup(compensationAndBenefitsStr);
            await changeAssignment.selectAssignToSupportGroup();
            await changeAssignment.clickOnAssignButton();
            await editCase.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await updateStatusBladePo.changeCaseStatus("Assigned");
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.refresh();
            await viewCasePage.clickEditCaseButton();
            await editCase.clickChangeAssignmentButton();
            await changeAssignment.setAssignee(petramcoStr, australiaSupportStr, auSupport1Str, kasiaOstlunStr);
            await editCase.clickSaveCase();

            //Verify the notifications
            await utilityCommon.refresh();
            await notificationAlerts.clickOnNotificationIcon();
            let assignmentNotification = utilityCommon.formatString(assignmentNotificationStr, caseId, kasiaOstlunStr, qianruTaoStr);
            let statusNotification = utilityCommon.formatString(statusNotificationStr, caseId, "Assigned", qianruTaoStr);
            let groupAssignmentNotification = utilityCommon.formatString(groupAssignmentNotificationStr, caseId, compensationAndBenefitsStr, qianruTaoStr);

            expect(await notificationAlerts.isAlertPresent(assignmentNotification)).toBeFalsy(assignmentNotification + " is present");
            expect(await notificationAlerts.isAlertPresent(statusNotification)).toBeTruthy(statusNotification + " is not present");
            expect(await notificationAlerts.isAlertPresent(groupAssignmentNotification)).toBeTruthy(groupAssignmentNotification + " is not present");
            await notificationAlerts.clickOnNotificationIcon();
        }
        catch (ex) {
            throw ex;
        }
        finally {
            //Reset login
            await navigationPage.signOut();
            await loginPage.login(qfengStr);
        }
    });//, 230 * 1000);

    it('[DRDMV-16062]: Verify that user add the watch from Case Console and remove the watch from Case then it should reflect', async () => {
        await apiHelper.apiLogin(qfengStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['caseWatchlist']);
        let caseId = response.displayId;

        //Add the case to watchlist
        await utilityCommon.refresh();
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId);
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        expect(await utilityCommon.getAllPopupMsg()).toContain("Added 1 selected case(s) to the watchlist.");

        //Update the case status and case assignment
        await utilityGrid.searchAndOpenHyperlink(caseId);
        await updateStatusBladePo.changeCaseStatus(inProgressStr);
        await updateStatusBladePo.clickSaveStatus();
        await viewCasePage.clickEditCaseButton();
        await editCase.clickChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, hrSupportStr, compensationAndBenefitsStr, elizabethPetersStr);
        await editCase.clickSaveCase();

        //Stop Watching the case from Case and update Case Status & Case Assignment
        await viewCasePage.clickStopWatchingLink();
        await updateStatusBladePo.changeCaseStatus(pendingStr);
        await updateStatusBladePo.setStatusReason(customerResponseStr);
        await updateStatusBladePo.clickSaveStatus();
        await viewCasePage.clickEditCaseButton();
        await editCase.clickChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, australiaSupportStr, auSupport1Str, kasiaOstlunStr);
        await editCase.clickSaveCase();
        await utilityCommon.closePopUpMessage();

        //Verification of notifications
        let assignmentNotification1 = utilityCommon.formatString(assignmentNotificationStr, caseId, elizabethPetersStr, qiaoFengStr);
        let statusNotification1 = utilityCommon.formatString(statusNotificationStr, caseId, inProgressStr, qiaoFengStr);
        let assignmentNotification2 = utilityCommon.formatString(assignmentNotificationStr, caseId, kasiaOstlunStr, qiaoFengStr);
        let statusNotification2 = utilityCommon.formatString(statusNotificationStr, caseId, pendingStr, qiaoFengStr);

        await utilityCommon.refresh();
        await notificationAlerts.clickOnNotificationIcon();
        expect(await notificationAlerts.isAlertPresent(assignmentNotification1)).toBeTruthy(assignmentNotification1 + " is not present");
        expect(await notificationAlerts.isAlertPresent(statusNotification1)).toBeTruthy(statusNotification1 + " is not present");
        expect(await notificationAlerts.isAlertPresent(assignmentNotification2)).toBeFalsy(assignmentNotification2 + " is present");
        expect(await notificationAlerts.isAlertPresent(statusNotification2)).toBeFalsy(statusNotification2 + " is present");
        await notificationAlerts.clickOnNotificationIcon();
    });//, 140 * 1000);

    it('[DRDMV-16061]: Verify that once user add the cases to watchlist from case console then they are still available in Case console and Agent could add them again without any error', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseData['caseWatchlist']);
            caseId[i] = response.displayId;
        }
        await utilityCommon.refresh();

        //Adding the cases to watchlist
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        expect(await utilityCommon.getAllPopupMsg()).toContain("Added 3 selected case(s) to the watchlist.");
        await utilityCommon.closePopUpMessage();

        //Adding the cases to watchlist again
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        expect(await utilityCommon.getAllPopupMsg()).toContain("Added 3 selected case(s) to the watchlist.");
        await utilityCommon.closePopUpMessage();
    }, 380 * 1000);

    it('[DRDMV-16059]: Verify that Save and Close buttons on Event Add are working correctly', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['caseWatchlist']);
        let caseId = response.displayId;
        await utilityCommon.refresh();
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId);
        await caseConsole.clickOnAddToWatchlist();
        expect(await caseWatchlist.isSaveEventsButtonEnabled()).toBeFalsy('Save button is enabled');
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        expect(await caseWatchlist.isSaveEventsButtonEnabled()).toBeTruthy('Save button is disabled');
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        expect(await caseWatchlist.isSaveEventsButtonEnabled()).toBeFalsy('Save button is enabled');
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        expect(await caseWatchlist.isSaveEventsButtonEnabled()).toBeTruthy('Save button is disabled');
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        expect(await caseWatchlist.isSaveEventsButtonEnabled()).toBeFalsy('Save button is enabled');
        await caseWatchlist.addWatchlistEvent(caseGroupAssignmentChangesStr);
        expect(await caseWatchlist.isSaveEventsButtonEnabled()).toBeTruthy('Save button is disabled');
        await caseWatchlist.addWatchlistEvent(caseGroupAssignmentChangesStr);
        expect(await caseWatchlist.isSaveEventsButtonEnabled()).toBeFalsy('Save button is enabled');
        await caseWatchlist.clickOnCloseButton();
    });

    it('[DRDMV-16058]: Verify if Agent is added to Watchlist and later his read access is removed', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['caseWatchlist']);
        let caseId = response.displayId;
        let caseGuid = response.id;

        //Write access to qyuan
        let caseAccessDataQyuan = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['witeAccess'],
            "username": qfengStr
        }
        await apiHelper.updateCaseAccess(caseGuid, caseAccessDataQyuan);

        //Read access to qannis
        let caseAccessDataQannis = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['readAccess'],
            "username": qannisStr
        }
        await apiHelper.updateCaseAccess(caseGuid, caseAccessDataQannis);

        try {
            await navigationPage.signOut();
            await loginPage.login(qannisStr);
            await utilityGrid.clearFilter();
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId);
            await caseConsole.clickOnAddToWatchlist();
            await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
            await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
            await caseWatchlist.saveEvents();
            expect(await utilityCommon.getAllPopupMsg()).toContain("Added 1 selected case(s) to the watchlist.");
            await utilityCommon.closePopUpMessage();

            await navigationPage.signOut();
            await loginPage.login(qfengStr);
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeCaseStatus(inProgressStr);
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickEditCaseButton();
            await editCase.clickChangeAssignmentButton();
            await changeAssignment.setAssignee(petramcoStr, hrSupportStr, compensationAndBenefitsStr, elizabethPetersStr);
            await editCase.clickSaveCase();

            await apiHelper.apiLogin(qfengStr);
            //Remove access of Qannis
            let caseAccessRemoveDataQannis = {
                "operation": operation['deleteAccess'],
                "type": type['user'],
                "security": security['readAccess'],
                "username": qannisStr
            }
            await apiHelper.updateCaseAccess(caseGuid, caseAccessRemoveDataQannis);

            await utilityCommon.closePopUpMessage();
            await updateStatusBladePo.changeCaseStatus(pendingStr);
            await updateStatusBladePo.setStatusReason(customerResponseStr);
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickEditCaseButton();
            await editCase.clickChangeAssignmentButton();
            await changeAssignment.setAssignee(petramcoStr, australiaSupportStr, auSupport1Str, kasiaOstlunStr);
            await editCase.clickSaveCase();
            await utilityCommon.closePopUpMessage();

            await navigationPage.signOut();
            await loginPage.login(qannisStr);

            //Verification of notifications
            let assignmentNotification1 = utilityCommon.formatString(assignmentNotificationStr, caseId, elizabethPetersStr, qiaoFengStr);
            let statusNotification1 = utilityCommon.formatString(statusNotificationStr, caseId, inProgressStr, qiaoFengStr);
            let assignmentNotification2 = utilityCommon.formatString(assignmentNotificationStr, caseId, kasiaOstlunStr, qiaoFengStr);
            let statusNotification2 = utilityCommon.formatString(statusNotificationStr, caseId, pendingStr, qiaoFengStr);

            await notificationAlerts.clickOnNotificationIcon();
            expect(await notificationAlerts.isAlertPresent(assignmentNotification1)).toBeTruthy(assignmentNotification1 + " is not present");
            expect(await notificationAlerts.isAlertPresent(statusNotification1)).toBeTruthy(statusNotification1 + " is not present");
            expect(await notificationAlerts.isAlertPresent(assignmentNotification2)).toBeFalsy(assignmentNotification2 + " is present");
            expect(await notificationAlerts.isAlertPresent(statusNotification2)).toBeFalsy(statusNotification2 + " is present");
            await notificationAlerts.clickOnNotificationIcon();
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(qfengStr);
        }
    }, 420 * 1000);

    it('[DRDMV-16055]: Verify that user can edit the access from watchlist and it reflects(Assignment only to Assignment and Status', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        let caseGuid: string[] = [];
        for (let i: number = 0; i < 2; i++) {
            let response = await apiHelper.createCase(caseData['caseWatchlist']);
            caseId[i] = response.displayId;
            caseGuid[i] = response.id;
        }
        await utilityCommon.refresh();

        //Write access to qyuan
        let caseAccessDataQyuan = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['witeAccess'],
            "username": qfengStr
        }
        await apiHelper.updateCaseAccess(caseGuid[0], caseAccessDataQyuan);
        await apiHelper.updateCaseAccess(caseGuid[1], caseAccessDataQyuan);

        //Adding the cases to watchlist
        for (let i: number = 0; i < 2; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.saveEvents();
        expect(await utilityCommon.getAllPopupMsg()).toContain("Added 2 selected case(s) to the watchlist.");

        //Update the events of first case from Console
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId[0]);
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        expect(await utilityCommon.getAllPopupMsg()).toContain("Added 1 selected case(s) to the watchlist.");

        //Change the case status and case assignment for first case
        await utilityGrid.searchAndOpenHyperlink(caseId[0]);
        await updateStatusBladePo.changeCaseStatus(inProgressStr);
        await updateStatusBladePo.clickSaveStatus();
        await utilityCommon.closePopUpMessage();
        await viewCasePage.clickEditCaseButton();
        await editCase.clickChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, australiaSupportStr, auSupport1Str, kasiaOstlunStr);
        await editCase.clickSaveCase();
        await utilityCommon.closePopUpMessage();

        //Update the events of second case from Watchlist blade
        await navigationPage.gotoCaseConsole();
        await caseConsole.clickOnWatchlistIcon();
        await caseWatchlist.selectCase(caseId[1]);
        await caseWatchlist.clickOnUpdateWatchlistEventsBtn();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        await utilityCommon.closePopUpMessage();

        //Change the case status and case assignment for second case
        await caseWatchlist.clickOnBackBtn();
        await utilityGrid.searchAndOpenHyperlink(caseId[1]);
        await updateStatusBladePo.changeCaseStatus(inProgressStr);
        await updateStatusBladePo.clickSaveStatus();
        await utilityCommon.closePopUpMessage();
        await viewCasePage.clickEditCaseButton();
        await editCase.clickChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, australiaSupportStr, auSupport1Str, kasiaOstlunStr);
        await editCase.clickSaveCase();
        await utilityCommon.closePopUpMessage();

        //Verification of notifications
        let assignmentNotification1 = utilityCommon.formatString(assignmentNotificationStr, caseId[0], kasiaOstlunStr, qiaoFengStr);
        let statusNotification1 = utilityCommon.formatString(statusNotificationStr, caseId[0], inProgressStr, qiaoFengStr);
        let assignmentNotification2 = utilityCommon.formatString(assignmentNotificationStr, caseId[1], kasiaOstlunStr, qiaoFengStr);
        let statusNotification2 = utilityCommon.formatString(statusNotificationStr, caseId[1], inProgressStr, qiaoFengStr);

        await utilityCommon.refresh();
        await notificationAlerts.clickOnNotificationIcon();
        expect(await notificationAlerts.isAlertPresent(assignmentNotification1)).toBeTruthy(assignmentNotification1 + " is not present");
        expect(await notificationAlerts.isAlertPresent(statusNotification1)).toBeTruthy(statusNotification1 + " is not present");
        expect(await notificationAlerts.isAlertPresent(assignmentNotification2)).toBeTruthy(assignmentNotification2 + " is not present");
        expect(await notificationAlerts.isAlertPresent(statusNotification2)).toBeTruthy(statusNotification2 + " is not present");
        await notificationAlerts.clickOnNotificationIcon();
    }, 420 * 1000);

    it('[DRDMV-16052]: Verify that user can edit the access from watchlist and it reflects(Status only to Assignment and Status', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        let caseGuid: string[] = [];
        for (let i: number = 0; i < 2; i++) {
            let response = await apiHelper.createCase(caseData['caseWatchlist']);
            caseId[i] = response.displayId;
            caseGuid[i] = response.id;
        }
        await utilityCommon.refresh();

        //Write access to qyuan
        let caseAccessDataQyuan = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['witeAccess'],
            "username": qfengStr
        }
        await apiHelper.updateCaseAccess(caseGuid[0], caseAccessDataQyuan);
        await apiHelper.updateCaseAccess(caseGuid[1], caseAccessDataQyuan);

        //Adding the cases to watchlist
        for (let i: number = 0; i < 2; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        expect(await utilityCommon.getAllPopupMsg()).toContain("Added 2 selected case(s) to the watchlist.");

        //Update the events of first case from Console
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId[0]);
        await caseConsole.clickOnAddToWatchlist();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        expect(await utilityCommon.getAllPopupMsg()).toContain("Added 1 selected case(s) to the watchlist.");

        //Change the case status and case assignment for first case
        await utilityGrid.searchAndOpenHyperlink(caseId[0]);
        await updateStatusBladePo.changeCaseStatus(inProgressStr);
        await updateStatusBladePo.clickSaveStatus();
        await viewCasePage.clickEditCaseButton();
        await editCase.clickChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, australiaSupportStr, auSupport1Str, kasiaOstlunStr);
        await editCase.clickSaveCase();
        await utilityCommon.closePopUpMessage();

        //Update the events of second case from Watchlist blade
        await navigationPage.gotoCaseConsole();
        await caseConsole.clickOnWatchlistIcon();
        await caseWatchlist.selectCase(caseId[1]);
        await caseWatchlist.clickOnUpdateWatchlistEventsBtn();
        await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
        await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
        await caseWatchlist.saveEvents();
        await utilityCommon.closePopUpMessage();

        //Change the case status and case assignment for second case
        await caseWatchlist.clickOnBackBtn();
        await utilityGrid.searchAndOpenHyperlink(caseId[1]);
        await updateStatusBladePo.changeCaseStatus(inProgressStr);
        await updateStatusBladePo.clickSaveStatus();
        await viewCasePage.clickEditCaseButton();
        await editCase.clickChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, australiaSupportStr, auSupport1Str, kasiaOstlunStr);
        await editCase.clickSaveCase();
        await utilityCommon.closePopUpMessage();

        //Verification of notifications
        let assignmentNotification1 = utilityCommon.formatString(assignmentNotificationStr, caseId[0], kasiaOstlunStr, qiaoFengStr);
        let statusNotification1 = utilityCommon.formatString(statusNotificationStr, caseId[0], inProgressStr, qiaoFengStr);
        let assignmentNotification2 = utilityCommon.formatString(assignmentNotificationStr, caseId[1], kasiaOstlunStr, qiaoFengStr);
        let statusNotification2 = utilityCommon.formatString(statusNotificationStr, caseId[1], inProgressStr, qiaoFengStr);

        await utilityCommon.refresh();
        await notificationAlerts.clickOnNotificationIcon();
        expect(await notificationAlerts.isAlertPresent(assignmentNotification1)).toBeTruthy(assignmentNotification1 + " is not present");
        expect(await notificationAlerts.isAlertPresent(statusNotification1)).toBeTruthy(statusNotification1 + " is not present");
        expect(await notificationAlerts.isAlertPresent(assignmentNotification2)).toBeTruthy(assignmentNotification2 + " is not present");
        expect(await notificationAlerts.isAlertPresent(statusNotification2)).toBeTruthy(statusNotification2 + " is not present");
        await notificationAlerts.clickOnNotificationIcon();
    }, 450 * 1000);

    it('[DRDMV-16050]: Verify that write access Agent can add the case to watchlist from Case', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['caseWatchlist']);
        let caseId = response.displayId;
        try {
            await navigationPage.signOut();
            await loginPage.login(qtaoStr);
            await utilityGrid.clearFilter();

            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePage.clickAddToWatchlistLink();
            await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
            await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
            await caseWatchlist.saveEvents();

            await updateStatusBladePo.changeCaseStatus(inProgressStr);
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickEditCaseButton();
            await editCase.clickChangeAssignmentButton();
            await changeAssignment.setAssignee(petramcoStr, hrSupportStr, compensationAndBenefitsStr, elizabethPetersStr);
            await editCase.clickSaveCase();

            await viewCasePage.clickStopWatchingLink();
            await updateStatusBladePo.changeCaseStatus(pendingStr);
            await updateStatusBladePo.setStatusReason(customerResponseStr);
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickEditCaseButton();
            await editCase.clickChangeAssignmentButton();
            await changeAssignment.setAssignee(petramcoStr, australiaSupportStr, auSupport1Str, kasiaOstlunStr);
            await editCase.clickSaveCase();
            await utilityCommon.closePopUpMessage();

            //Verification of notifications
            let assignmentNotification1 = utilityCommon.formatString(assignmentNotificationStr, caseId, elizabethPetersStr, qianruTaoStr);
            let statusNotification1 = utilityCommon.formatString(statusNotificationStr, caseId, inProgressStr, qianruTaoStr);
            let assignmentNotification2 = utilityCommon.formatString(assignmentNotificationStr, caseId, kasiaOstlunStr, qianruTaoStr);
            let statusNotification2 = utilityCommon.formatString(statusNotificationStr, caseId, pendingStr, qianruTaoStr);

            await utilityCommon.refresh();
            await notificationAlerts.clickOnNotificationIcon();
            expect(await notificationAlerts.isAlertPresent(assignmentNotification1)).toBeTruthy(assignmentNotification1 + " is not present");
            expect(await notificationAlerts.isAlertPresent(statusNotification1)).toBeTruthy(statusNotification1 + " is not present");
            expect(await notificationAlerts.isAlertPresent(assignmentNotification2)).toBeFalsy(assignmentNotification2 + " is present");
            expect(await notificationAlerts.isAlertPresent(statusNotification2)).toBeFalsy(statusNotification2 + " is present");
            await notificationAlerts.clickOnNotificationIcon();
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(qfengStr);
        }
    }, 360 * 1000);

    it('[DRDMV-16041]: Verify that Case Agent can follow/unfollow the cases from case itself - Read only user', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['caseWatchlist']);
        let caseId = response.displayId;
        let caseGuid = response.id;

        //Write access to qtao
        let caseAccessDataQtao = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['witeAccess'],
            "username": qfengStr
        }
        await apiHelper.updateCaseAccess(caseGuid, caseAccessDataQtao);

        //Read access to qannis
        let caseAccessDataQannis = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['readAccess'],
            "username": qannisStr
        }
        await apiHelper.updateCaseAccess(caseGuid, caseAccessDataQannis);
        try {
            await navigationPage.signOut();
            await loginPage.login(qannisStr);

            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePage.clickAddToWatchlistLink();

            await caseWatchlist.addWatchlistEvent(caseAssignmentChangesStr);
            await caseWatchlist.addWatchlistEvent(caseStatusChangesStr);
            await caseWatchlist.saveEvents();
            await utilityCommon.closePopUpMessage();

            await navigationPage.signOut();
            await loginPage.login(qtaoStr);

            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeCaseStatus(inProgressStr);
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickEditCaseButton();
            await editCase.clickChangeAssignmentButton();
            await changeAssignment.setAssignee(petramcoStr, hrSupportStr, compensationAndBenefitsStr, elizabethPetersStr);
            await editCase.clickSaveCase();
            await utilityCommon.closePopUpMessage();

            await navigationPage.signOut();
            await loginPage.login(qannisStr);

            await navigationPage.gotoCaseConsole();
            await caseConsole.clickOnWatchlistIcon();
            await caseWatchlist.selectCase(caseId);
            await caseWatchlist.clickOnRemoveBtn();
            await caseWatchlist.clickOnBackBtn();

            await navigationPage.signOut();
            await loginPage.login(qtaoStr);

            await utilityGrid.searchAndOpenHyperlink(caseId);
            await updateStatusBladePo.changeCaseStatus(pendingStr);
            await updateStatusBladePo.setStatusReason(customerResponseStr);
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickEditCaseButton();
            await editCase.clickChangeAssignmentButton();
            await changeAssignment.setAssignee(petramcoStr, hrSupportStr, compensationAndBenefitsStr, "Peter Kahn");
            await editCase.clickSaveCase();
            await utilityCommon.closePopUpMessage();

            await navigationPage.signOut();
            await loginPage.login(qannisStr);

            //Verification of notifications
            let assignmentNotification1 = utilityCommon.formatString(assignmentNotificationStr, caseId, elizabethPetersStr, qianruTaoStr);
            let statusNotification1 = utilityCommon.formatString(statusNotificationStr, caseId, inProgressStr, qianruTaoStr);
            let assignmentNotification2 = utilityCommon.formatString(assignmentNotificationStr, caseId, "Peter Kahn", qianruTaoStr);
            let statusNotification2 = utilityCommon.formatString(statusNotificationStr, caseId, pendingStr, qianruTaoStr);

            await utilityCommon.refresh();
            await notificationAlerts.clickOnNotificationIcon();
            expect(await notificationAlerts.isAlertPresent(assignmentNotification1)).toBeTruthy(assignmentNotification1 + " is not present");
            expect(await notificationAlerts.isAlertPresent(statusNotification1)).toBeTruthy(statusNotification1 + " is not present");
            expect(await notificationAlerts.isAlertPresent(assignmentNotification2)).toBeFalsy(assignmentNotification2 + " is present");
            expect(await notificationAlerts.isAlertPresent(statusNotification2)).toBeFalsy(statusNotification2 + " is present");
            await notificationAlerts.clickOnNotificationIcon();
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(qfengStr);
        }
    }, 600 * 1000);
});
