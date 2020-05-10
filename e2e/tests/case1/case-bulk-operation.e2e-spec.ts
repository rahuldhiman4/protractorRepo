import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import caseConsolePage from '../../pageobject/case/case-console.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import { default as changeAssignment, default as changeAssignmentBladePo } from '../../pageobject/common/change-assignment-blade.po';
import loginPage from '../../pageobject/common/login.po';
import navigationPage from '../../pageobject/common/navigation.po';
import notificationPo from '../../pageobject/notification/notification.po';
import activityPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL, operation, security, type } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Case Bulk Operation', () => {

    let qtaoStr = 'qtao';
    let petramcoStr = 'Petramco';
    let compensationAndBenefitsStr = 'Compensation and Benefits';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(qtaoStr);
        await utilityGrid.clearFilter();
        await apiHelper.apiLogin("tadmin");
        await apiHelper.updateNotificationEmailListForSupportGroup(compensationAndBenefitsStr, "");
        await apiHelper.setDefaultNotificationForUser('qfeng', "Alert");

        //Create Foundation data
        const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
        const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
        const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
        const personDataFile = require('../../data/ui/foundation/person.ui.json');

        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile['BusinessUnitData_BulkOperation'];
        let departmentData = departmentDataFile['DepartmentData_BulkOperation'];
        let suppGrpData = supportGrpDataFile['SuppGrpData_BulkOperation'];
        let personData = personDataFile['PersonData_BulkOperation'];
        let orgId = await apiCoreUtil.getOrganizationGuid(petramcoStr);
        businessData.relatedOrgId = orgId;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await apiHelper.createNewUser(personData);
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId, petramcoStr);

    });

    afterAll(async () => {
        await apiHelper.apiLogin("tadmin");
        await apiHelper.updateNotificationEmailListForSupportGroup(compensationAndBenefitsStr, "hr_cb@petramco.com");
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
        await navigationPage.gotoCaseConsole();
    });

    it('[DRDMV-15953]: Verify if Case Agent can select and change the assignee of multiple cases', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseData['bulkCaseAssignee_New']);
            caseId[i] = response.displayId;
        }
        await utilityCommon.refresh();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, compensationAndBenefitsStr, "Qing Yuan");
        expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.')).toBeTruthy();

        await utilityCommon.closePopUpMessage();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.searchAndOpenHyperlink(caseId[i]);
            expect(await viewCasePage.getAssigneeText()).toBe("Qing Yuan");
            await navigationPage.gotoCaseConsole();
        }
    });//, 150 * 1000);

    it('[DRDMV-15954]: Verify if Case Agent can select and un-select all the Cases using checkbox beside Case column', async () => {
        await caseConsolePage.selectAllCases();
        expect(await caseConsolePage.isAllCasesSelected()).toBeTruthy("All cases are not selected");
        await caseConsolePage.selectAllCases();
        expect(await caseConsolePage.isAllCasesUnSelected()).toBeTruthy("All cases are selected");
    });

    it('[DRDMV-15984]: Verify that once Assignee is changed from Bulk operation then respective support groups get the notification', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseData['bulkCaseAssignee_New']);
            caseId[i] = response.displayId;
        }
        await utilityCommon.refresh();
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId[0]);
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId[1]);
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, compensationAndBenefitsStr, "Qiao Feng");
        expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.')).toBeTruthy();
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId[2]);
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, compensationAndBenefitsStr, "Qing Yuan");
        expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.')).toBeTruthy();
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
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(qtaoStr);
        }
    }, 750 * 1000);

    it('[DRDMV-15978]: Verify user having case read access cannot change assignee of the case using bulk assignment', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let response1 = await apiHelper.createCase(caseData['bulkCaseAssignee_New']);
        let caseId1 = await response1.displayId;
        let caseGuid1 = await response1.id;
        let response2 = await apiHelper.createCase(caseData['bulkCaseAssignee_New']);
        let caseId2 = await response2.displayId;
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

        try {
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await utilityGrid.clearFilter();
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId1);
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId2);
            await caseConsolePage.clickOnChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee(petramcoStr, compensationAndBenefitsStr, "Qianru Tao");
            expect(await utilityCommon.isPopUpMessagePresent('You do not have permission to perform this operation. Please contact your system administrator.')).toBeTruthy();

        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(qtaoStr);
        }
    });//, 170 * 1000);

    it('[DRDMV-15980]: Verify that Assignment change information is visible in Actvity section', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        let caseGuid: string[] = [];
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseData['bulkCaseAssignee_New'])
            caseId[i] = response.displayId;
            caseGuid[i] = response.id;
        }
        await utilityCommon.refresh();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }

        //Providing Read access of Case 1 to qstrong
        let caseReadAccessDataQtao = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['readAccess'],
            "username": 'qtao'
        }

        for (let i: number = 0; i < 3; i++) {
            await apiHelper.updateCaseAccess(caseGuid[i], caseReadAccessDataQtao);
        }

        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, "Risk Management", "Quenton Annis");
        expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.')).toBeTruthy();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.searchAndOpenHyperlink(caseId[i]);
            expect(await activityPo.isTextPresentInActivityLog("Qianru Tao")).toBeTruthy("Text is not present in activiy tab1");
            expect(await activityPo.isTextPresentInActivityLog("changed the case assignment")).toBeTruthy("Text is not present in activiy tab2");
            expect(await activityPo.isTextPresentInActivityLog("Assignee")).toBeTruthy("Text is not present in activiy tab");
            expect(await activityPo.isTextPresentInActivityLog("Quenton Annis")).toBeTruthy("Text is not present in activiy tab4");
            expect(await activityPo.isTextPresentInActivityLog("Assigned Group")).toBeTruthy("Text is not present in activiy tab5");
            expect(await activityPo.isTextPresentInActivityLog("Risk Management")).toBeTruthy("Text is not present in activiy tab6");
            await navigationPage.gotoCaseConsole();
        }
    }, 280 * 1000 );

    it('[DRDMV-15981]: Verify that Agent is able to change the Assignee if status is Assigned or In Progress or Resolved', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        caseId[0] = (await apiHelper.createCase(caseData['bulkCaseAssignee_Assigned'])).displayId;
        caseId[1] = (await apiHelper.createCase(caseData['bulkCaseAssignee_InProgress'])).displayId;
        caseId[2] = (await apiHelper.createCase(caseData['bulkCaseAssignee_Resolved'])).displayId;
        await utilityCommon.refresh();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignment.setAssignee(petramcoStr, compensationAndBenefitsStr, "Qing Yuan");
        expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.')).toBeTruthy();

        await utilityCommon.closePopUpMessage();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.searchAndOpenHyperlink(caseId[i]);
            expect(await viewCasePage.getAssigneeText()).toBe("Qing Yuan");
            await navigationPage.gotoCaseConsole();
        }

    });//, 160 * 1000);

    it('[DRDMV-16109]: Verify that Agent creates the Case with BU, Org, Support Group, Department and while Bulk Assignment select only Org and Support Group', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        let caseGuid: string[] = [];
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseData['bulkCaseAssignee_New']);
            caseId[i] = response.displayId;
            caseGuid[i] = response.id;
        }
        await utilityCommon.refresh();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }

        let caseReadAccessDataQtao = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['writeAccess'],
            "username": 'qtao'
        }

        for (let i: number = 0; i < 3; i++) {
            await apiHelper.updateCaseAccess(caseGuid[i], caseReadAccessDataQtao);
        }

        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignmentBladePo.selectCompany(petramcoStr);
        await changeAssignmentBladePo.selectBusinessUnit("BulkOperationBusinessUnit");
        await changeAssignmentBladePo.selectDepartment("BulkOperationDepartment");
        await changeAssignmentBladePo.selectSupportGroup("BulkOperationSupportGroup");
        await changeAssignmentBladePo.selectAssignee("BOPerson lnPerson");
        await changeAssignmentBladePo.clickOnAssignButton();
        expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.')).toBeTruthy();

        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.searchAndOpenHyperlink(caseId[i]);
            expect(await viewCasePage.getBusinessUnitText()).toBe("BulkOperationBusinessUnit");
            expect(await viewCasePage.getDepartmentText()).toBe("BulkOperationDepartment");
            expect(await viewCasePage.getAssignedCompanyText()).toBe("Petramco");
            expect(await viewCasePage.getAssignedGroupText()).toBe("BulkOperationSupportGroup");
            expect(await viewCasePage.getAssigneeText()).toBe("BOPerson lnPerson");
            await navigationPage.gotoCaseConsole();
        }
    }, 310 * 1000);

    it('[DRDMV-16110]: Verify that Agent creates the Case with Org, Support Group and while Bulk Assignment select BU, Org, Support Group, Department', async () => {
        try {
            await apiHelper.apiLoginWithCredential('idPersonBO@petramco.com', "Password_1234");
            let caseData = require('../../data/ui/case/case.ui.json');
            let caseId: string[] = [];
            for (let i: number = 0; i < 3; i++) {
                let response = await apiHelper.createCase(caseData['bulkCaseAssigneeWithAllAssigneeFields']);
                caseId[i] = response.displayId;
            }

            await navigationPage.signOut();
            await loginPage.loginWithCredentials('idPersonBO@petramco.com', "Password_1234");

            await utilityGrid.clearFilter();
            await utilityCommon.refresh();
            for (let i: number = 0; i < 3; i++) {
                await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
            }

            await caseConsolePage.clickOnChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee(petramcoStr, compensationAndBenefitsStr, 'Qadim Katawazi');
            expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.')).toBeTruthy();

            for (let i: number = 0; i < 3; i++) {
                await utilityGrid.searchAndOpenHyperlink(caseId[i]);
                expect(await viewCasePage.isTextPresent('BulkOperationBusinessUnit')).toBeFalsy("BulkOperationBusinessUnit is present");
                expect(await viewCasePage.isTextPresent('BulkOperationDepartment')).toBeFalsy("BulkOperationDepartment is present");
                expect(await viewCasePage.getAssignedCompanyText()).toBe('Petramco');
                expect(await viewCasePage.getAssignedGroupText()).toBe(compensationAndBenefitsStr);
                expect(await viewCasePage.getAssigneeText()).toBe('Qadim Katawazi');
                await navigationPage.gotoCaseConsole();
            }
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(qtaoStr);
        }
    }, 300 * 1000);

    it('[DRDMV-16107]: Verify if Agent Bulk Assign the cases with at least one closed status then Agent should get the error', async () => {
        await apiHelper.apiLogin(qtaoStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = []
        for (let i = 0; i < 2; i++) {
            let response = await apiHelper.createCase(caseData['bulkCaseAssignee_New']);
            caseId[i] = response.displayId;
        }
        let response1 = await apiHelper.createCase(caseData['bulkCaseAssignee_New']);
        let caseGuid = response1.id;
        caseId[2] = response1.displayId;

        await apiHelper.updateCaseStatus(caseGuid, "Resolved", "Customer Follow-Up Required");
        await apiHelper.updateCaseStatus(caseGuid, "Closed");

        await utilityCommon.refresh();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }

        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignmentBladePo.setAssignee(petramcoStr, compensationAndBenefitsStr, 'Qadim Katawazi');
        expect(await utilityCommon.isPopUpMessagePresent('Cases in closed or canceled status cannot be modified. Please update the selected cases.')).toBeTruthy();
    });
})