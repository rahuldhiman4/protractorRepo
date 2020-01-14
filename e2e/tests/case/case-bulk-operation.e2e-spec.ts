import { browser } from "protractor";
import loginPage from '../../pageobject/common/login.po';
import navigationPage from '../../pageobject/common/navigation.po';
import apiHelper from '../../api/api.helper';
import caseConsolePage from '../../pageobject/case/case-console.po';
import utilGrid from '../../utils/util.grid';
import changeAssignment from '../../pageobject/common/change-assignment-blade.po';
import utilCommon from '../../utils/util.common';
import viewCasePage from '../../pageobject/case/view-case.po';
import notificationPo from '../../pageobject/notification/notification.po';
import { security, operation, type } from '../../utils/constants';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import activityPo from '../../pageobject/social/activity-tab.po';

describe('Case Watchlist', () => {

    let qtaoStr = 'qtao';
    let petramcoStr = 'Petramco'; 
    let compensationAndBenefitsStr = 'Compensation and Benefits';

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login(qtaoStr);
        await utilGrid.clearFilter();
        await apiHelper.apiLogin("tadmin");
        await apiHelper.updateNotificationEmailListForSupportGroup(compensationAndBenefitsStr, "");
        await apiHelper.setDefaultNotificationForUser('qfeng', "Alert");

    });

    afterAll(async () => {
        await apiHelper.apiLogin("tadmin");
        await apiHelper.updateNotificationEmailListForSupportGroup(compensationAndBenefitsStr, "hr_cb@petramco.com");
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await navigationPage.gotoCaseConsole();
    });

    it('DRDMV-15953: Verify if Case Agent can select and change the assignee of multiple cases', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseData['bulkCaseAssignee']);
            caseId[i] = response.displayId;
        }
        await browser.refresh();
        for (let i: number = 0; i < 3; i++) {
            await utilGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, compensationAndBenefitsStr, "Qing Yuan");
        expect(await utilCommon.getPopUpMessage()).toBe("INFO (222156): The selected case(s) have been successfully assigned.");
        await utilCommon.closePopUpMessage();
        for (let i: number = 0; i < 3; i++) {
            await utilGrid.searchAndOpenHyperlink(caseId[i]);
            expect(await viewCasePage.getAssigneeText()).toBe("Qing Yuan");
            await navigationPage.gotoCaseConsole();
        }
    });

    it('DRDMV-15954: Verify if Case Agent can select and un-select all the Cases using checkbox beside Case column', async () => {
        await caseConsolePage.selectAllCases();
        expect(await caseConsolePage.isAllCasesSelected()).toBeTruthy("All cases are not selected");
        await caseConsolePage.selectAllCases();
        expect(await caseConsolePage.isAllCasesUnSelected()).toBeTruthy("All cases are selected");
    });

    it('DRDMV-15984: Verify that once Assignee is changed from Bulk operation then respective support groups get the notification', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseData['bulkCaseAssignee']);
            caseId[i] = response.displayId;
        }
        await browser.refresh();
        await utilGrid.clickCheckBoxOfValueInGrid(caseId[0]);
        await utilGrid.clickCheckBoxOfValueInGrid(caseId[1]);
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, compensationAndBenefitsStr, "Qiao Feng");
        expect(await utilCommon.getPopUpMessage()).toBe("INFO (222156): The selected case(s) have been successfully assigned.");
        await utilCommon.closePopUpMessage();
        await utilGrid.clickCheckBoxOfValueInGrid(caseId[2]);
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, compensationAndBenefitsStr, "Qing Yuan");
        expect(await utilCommon.getPopUpMessage()).toBe("INFO (222156): The selected case(s) have been successfully assigned.");
        try {
            await navigationPage.signOut();
            await loginPage.login("qfeng");
            await notificationPo.clickOnNotificationIcon();
            expect(await notificationPo.isAlertPresent(caseId[0] + " has been assigned to you.")).toBeTruthy("");
            expect(await notificationPo.isAlertPresent(caseId[1] + " has been assigned to you.")).toBeTruthy("");
            expect(await notificationPo.isAlertPresent(caseId[2] + " has been assigned to you.")).toBeFalsy("");
            await notificationPo.clickOnNotificationIcon();
        }
        catch (ex) {
            expect(false).toBeTruthy("Failed in try catch block: " + ex);
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(qtaoStr);
        }
    });

    it('DRDMV-15978: Verify user having case read access cannot change assignee of the case using bulk assignment', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let response1 = await apiHelper.createCase(caseData['bulkCaseAssignee']);
        let caseId1 = await response1.displayId;
        let caseGuid1 = await response1.id;
        let response2 = await apiHelper.createCase(caseData['bulkCaseAssignee']);
        let caseId2= await response2.displayId;
        let caseGuid2 = await response2.id;

        //Providing Read access of Case 1 to qstrong
        let caseReadAccessDataQstrong = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['readAccess'],
            "username": 'qstrong'
        }
        await apiHelper.updateCaseAccess(caseGuid1, caseReadAccessDataQstrong);
        
        //Providing Write access of Case 2 to qstrong
        let caseWriteAccessDataQstrong = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['writeAccess'],
            "username": 'qstrong'
        }
        await apiHelper.updateCaseAccess(caseGuid2, caseWriteAccessDataQstrong);

        try{
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await utilGrid.clearFilter();
            await utilGrid.clickCheckBoxOfValueInGrid(caseId1);
            await utilGrid.clickCheckBoxOfValueInGrid(caseId2);
            await caseConsolePage.clickOnChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee(petramcoStr, compensationAndBenefitsStr, "Qianru Tao");
            expect(await utilCommon.getPopUpMessage()).toBe("ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.");
        }
        catch(ex){
            expect(false).toBeTruthy("Failed in try catch block "+ex);
        }
        finally{
            await navigationPage.signOut();
            await loginPage.login(qtaoStr);
        }
    });

    it('DRDMV-15980: Verify that Assignment change information is visible in Actvity section', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseData['bulkCaseAssignee'])
            caseId[i] = response.displayId;
        }
        await browser.refresh();
        for (let i: number = 0; i < 3; i++) {
            await utilGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, "Risk Management", "Quenton Annis");
        expect(await utilCommon.getPopUpMessage()).toBe("INFO (222156): The selected case(s) have been successfully assigned.");
        await utilCommon.closePopUpMessage();
        for (let i: number = 0; i < 3; i++) {
            await utilGrid.searchAndOpenHyperlink(caseId[i]);
            expect(await activityPo.isTextPresentInActivityLog("Qianru Tao")).toBeTruthy("Text is not present in activiy tab1");
            expect(await activityPo.isTextPresentInActivityLog("changed the case assignment")).toBeTruthy("Text is not present in activiy tab2");
            expect(await activityPo.isTextPresentInActivityLog("Assignee")).toBeTruthy("Text is not present in activiy tab");
            expect(await activityPo.isTextPresentInActivityLog("Quenton Annis")).toBeTruthy("Text is not present in activiy tab4");
            expect(await activityPo.isTextPresentInActivityLog("Assigned Group")).toBeTruthy("Text is not present in activiy tab5");
            expect(await activityPo.isTextPresentInActivityLog("Risk Management")).toBeTruthy("Text is not present in activiy tab6");
            await navigationPage.gotoCaseConsole();
        }
    });

    it('DRDMV-15981: Verify that Agent is able to change the Assignee if status is Assigned or In Progress or Resolved', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        caseId[0] = (await apiHelper.createCase(caseData['bulkCaseAssignee_Assigned'])).displayId;
        caseId[1] = (await apiHelper.createCase(caseData['bulkCaseAssignee_InProgress'])).displayId;
        caseId[2] = (await apiHelper.createCase(caseData['bulkCaseAssignee_Resolved'])).displayId;
        await browser.refresh();
        for (let i: number = 0; i < 3; i++) {
            await utilGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, compensationAndBenefitsStr, "Qing Yuan");
        expect(await utilCommon.getPopUpMessage()).toBe("INFO (222156): The selected case(s) have been successfully assigned.");
        await utilCommon.closePopUpMessage();
        for (let i: number = 0; i < 3; i++) {
            await utilGrid.searchAndOpenHyperlink(caseId[i]);
            expect(await viewCasePage.getAssigneeText()).toBe("Qing Yuan");
            await navigationPage.gotoCaseConsole();
        }
    });

})

