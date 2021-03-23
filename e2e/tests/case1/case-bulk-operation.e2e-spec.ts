import { random } from "lodash";
import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import caseConsolePage from '../../pageobject/case/case-console.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import loginPage from '../../pageobject/common/login.po';
import navigationPage from '../../pageobject/common/navigation.po';
import notificationPo from '../../pageobject/notification/notification.po';
import activityPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL, operation, security, type } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Case Bulk Operation', () => {
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    const caseData = require('../../data/ui/case/case.ui.json');
    let qfengStr = 'qfeng';
    let petramcoStr = 'Petramco';
    let usSupportGroup3Str = 'US Support 3';
    let unitedStateSupportStr = 'United States Support'
    let businessData, departmentData, suppGrpData, personData, orgId;
    let caseModule = 'Case';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(qfengStr);
        await utilityGrid.clearFilter();
        await utilityGrid.sortGridColumn('Case ID', 'descending');
        //await foundationData();
    });

    afterAll(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(caseModule);
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    async function foundationData() {
        //Create Foundation data
        businessData = businessDataFile['BusinessUnitData_BulkOperation'];
        departmentData = departmentDataFile['DepartmentData_BulkOperation'];
        suppGrpData = supportGrpDataFile['SuppGrpData_BulkOperation'];
        personData = personDataFile['PersonData_BulkOperation'];
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createNewUser(personData);
        await apiHelper.deleteApprovalMapping(caseModule, 'Bulk Operation Mapping');
        await apiHelper.associatePersonToCompany(personData.userId, petramcoStr);
        businessData.relatedOrgId = petramcoStr;
        await apiHelper.setDefaultNotificationForUser("qtao", "Alert");
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        await browser.sleep(3000); // timeout requried to reflect data on UI
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        await browser.sleep(3000); //sleep to reflect data on UI
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await browser.sleep(3000); // timeout requried to reflect data on UI
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
    }

    it('[4398]: Verify if Case Agent can select and change the assignee of multiple cases', async () => {
        await apiHelper.apiLogin(qfengStr);
        let caseId: string[] = [];
        let caseDataForTest = caseData['bulkCaseAssignee_New'];
        caseDataForTest.Summary = [...Array(6)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseDataForTest);
            caseId[i] = response.displayId;
        }
        await utilityGrid.searchRecord(caseDataForTest.Summary);
        for (let j: number = 0; j < 3; j++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[j]);//if fails click checkbox in reverse order [latest case appear first in console]
        }
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignmentBladePo.setAssignee('US Support 3', "Qiao Feng");
        await changeAssignmentBladePo.clickOnAssignButton();
        expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.', 1)).toBeTruthy();
        await utilityCommon.closePopUpMessage();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.searchAndOpenHyperlink(caseId[i]);
            expect(await viewCasePage.getAssigneeText()).toBe("Qiao Feng");
            await navigationPage.gotoCaseConsole();
        }
    });

    it('[4397]: Verify if Case Agent can select and un-select all the Cases using checkbox beside Case column', async () => {
        await navigationPage.gotoQuickCase(); // navigation requried if above test failes
        await navigationPage.gotoCaseConsole(); // navigation requried if above test failes
        await utilityGrid.clearFilter();
        await caseConsolePage.selectAllCases();
        expect(await caseConsolePage.isAllCasesSelected()).toBeTruthy("All cases are not selected");
        await caseConsolePage.selectAllCases();
        expect(await caseConsolePage.isAllCasesUnSelected()).toBeTruthy("All cases are selected");
    });

    describe('[4383]: Verify that once Assignee is changed from Bulk operation then respective support groups get the notification', async () => {
        let caseId: string[] = [];
        let caseDataForTest;
        beforeAll(async () => {
            caseDataForTest = caseData['bulkCaseAssignee_New'];
            caseDataForTest.Summary = [...Array(6)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            await apiHelper.apiLogin(qfengStr);
            // caseDataForTest.Summary = "4383 Bulk Case Assignee";
            for (let k: number = 0; k < 3; k++) {
                let response = await apiHelper.createCase(caseDataForTest);
                caseId[k] = response.displayId;
            }
            await utilityGrid.clickRefreshIcon();
        });
        it('[4383]: Verify that once Assignee is changed from Bulk operation then respective support groups get the notification', async () => {
            await utilityGrid.searchRecord(caseDataForTest.Summary);
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[0]);
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[1]);
            await caseConsolePage.clickOnChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('US Support 1', "Qianru Tao");
            await changeAssignmentBladePo.clickOnAssignButton();
            await utilityCommon.closePopUpMessage();
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[2]);
            await caseConsolePage.clickOnChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee(usSupportGroup3Str, "Qiao Feng");
            await changeAssignmentBladePo.clickOnAssignButton();
            await utilityCommon.closePopUpMessage();
            await navigationPage.signOut();
            await loginPage.login("qtao");
            await notificationPo.clickOnNotificationIcon();
            expect(await notificationPo.isAlertPresent(caseId[0] + " has been assigned to you.")).toBeTruthy();
            expect(await notificationPo.isAlertPresent(caseId[1] + " has been assigned to you.")).toBeTruthy();
            expect(await notificationPo.isAlertPresent(caseId[2] + " has been assigned to you.")).toBeFalsy();
            await notificationPo.clickOnNotificationIcon();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(qfengStr);
        });
    });

    it('[4389]: Verify user having case read access cannot change assignee of the case using bulk assignment', async () => {
        await apiHelper.apiLogin(qfengStr);
        let caseDataForTest = caseData['bulkCaseAssignee_New'];
        caseDataForTest.Summary = "4389 Bulk Case Assignee";
        let newCase1 = await apiHelper.createCase(caseDataForTest);
        let newCase2 = await apiHelper.createCase(caseDataForTest);

        //Providing Read access of Case 1 to qstrong
        let caseReadAccessDataQstrong = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['readAccess'],
            "username": 'qstrong'
        }
        await apiHelper.updateCaseAccess(newCase1.id, caseReadAccessDataQstrong);

        //Providing Write access of Case 2 to qstrong
        let caseWriteAccessDataQstrong = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['witeAccess'],
            "username": 'qstrong'
        }
        await apiHelper.updateCaseAccess(newCase2.id, caseWriteAccessDataQstrong);
        try {
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await utilityGrid.searchRecord(caseDataForTest.Summary);
            await utilityGrid.clickCheckBoxOfValueInGrid(newCase1.displayId);
            await utilityGrid.clickCheckBoxOfValueInGrid(newCase2.displayId);
            await caseConsolePage.clickOnChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee(usSupportGroup3Str, 'Qiao Feng');
            await changeAssignmentBladePo.clickOnAssignButton();
            expect(await utilityCommon.isPopUpMessagePresent('You do not have permission to perform this operation. Please contact your system administrator.', 1)).toBeTruthy();
            await utilityCommon.closePopUpMessage();
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(qfengStr);
        }
    });

    describe('[4387]: Verify that Assignment change information is visible in Actvity section', async () => {
        let caseId: string[] = [], caseGuid: string[] = [];
        let caseDataForTest;
        beforeAll(async () => {
            await apiHelper.apiLogin(qfengStr);
            caseDataForTest = caseData['bulkCaseAssignee_New'];
            caseDataForTest.Summary = [...Array(6)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            for (let i: number = 0; i < 3; i++) {
                let response = await apiHelper.createCase(caseDataForTest)
                caseId[i] = response.displayId;
                caseGuid[i] = response.id;
            }
        });
        it('[4387]: Verify that Assignment change information is visible in Actvity section', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchRecord(caseDataForTest.Summary);
            for (let i: number = 0; i < 1; i++) {
                await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
            }
            //Providing Read access of Case 1 to qstrong
            let caseReadAccessDataFeng = {
                "operation": operation['addAccess'],
                "type": type['user'],
                "security": security['readAccess'],
                "username": qfengStr
            }
            for (let i: number = 0; i < 1; i++) {
                await apiHelper.updateCaseAccess(caseGuid[i], caseReadAccessDataFeng);
            }
            await caseConsolePage.clickOnChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('US Support 1', "Qianru Tao");
            await changeAssignmentBladePo.clickOnAssignButton();
            expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.', 3)).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            for (let i: number = 0; i < 1; i++) {
                await utilityGrid.searchAndOpenHyperlink(caseId[i]);
                expect(await activityPo.isTextPresentInActivityLog("Qiao Feng")).toBeTruthy("Text is not present in activiy tab1");
                expect(await activityPo.isTextPresentInActivityLog("changed the case assignment")).toBeTruthy("Text is not present in activiy tab2");
                expect(await activityPo.isTextPresentInActivityLog("Assignee")).toBeTruthy("Text is not present in activiy tab");
                expect(await activityPo.isTextPresentInActivityLog("Qianru Tao")).toBeTruthy("Text is not present in activiy tab4");
                await activityPo.applyActivityFilter("Assignment Change");
                await activityPo.clickShowMoreLinkInActivity(1);
                expect(await activityPo.isTextPresentInActivityLog("Assigned Group")).toBeTruthy("Text is not present in activiy tab5");
                expect(await activityPo.isTextPresentInActivityLog('US Support 1')).toBeTruthy("Text is not present in activiy tab6");
                await navigationPage.gotoCaseConsole();
            }
        });
    });

    it('[4386]: Verify that Agent is able to change the Assignee if status is Assigned or In Progress or Resolved', async () => {
        await apiHelper.apiLogin(qfengStr);
        let caseDataForTest = caseData['bulkCaseAssignee_New'];
        caseDataForTest.Summary = "4386 Bulk Case Assignee";
        let caseId: string[] = [];
        caseId[0] = (await apiHelper.createCase(caseDataForTest)).displayId;
        caseId[1] = (await apiHelper.createCase(caseDataForTest)).displayId;
        caseId[2] = (await apiHelper.createCase(caseDataForTest)).displayId;
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchRecord(caseDataForTest.Summary);
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignmentBladePo.setAssignee(usSupportGroup3Str, "Qadim Katawazi");
        await changeAssignmentBladePo.clickOnAssignButton();
        expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.', 1)).toBeTruthy();

        await utilityCommon.closePopUpMessage();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.searchAndOpenHyperlink(caseId[i]);
            expect(await viewCasePage.getAssigneeText()).toBe("Qadim Katawazi");
            await navigationPage.gotoCaseConsole();
        }

    });

    describe('[4301]: Verify that Agent creates the Case with BU, Org, Support Group, Department and while Bulk Assignment select only Org and Support Group', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId: string[] = [], caseGuid: string[] = [];
        let caseDataForTest;
        beforeAll(async () => {
            await apiHelper.apiLogin(qfengStr);
            caseDataForTest = caseData['bulkCaseAssignee_New'];
            caseDataForTest.Summary = "4301BulkCaseAssignee"+randomStr;
            for (let i: number = 0; i < 3; i++) {
                let response = await apiHelper.createCase(caseDataForTest);
                caseId[i] = response.displayId;
                caseGuid[i] = response.id;
            }
        });
        it('[4301]: Verify that Agent creates the Case with BU, Org, Support Group, Department and while Bulk Assignment select only Org and Support Group', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchRecord(caseDataForTest.Summary);
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
            await changeAssignmentBladePo.setAssignee('CA Support 3', 'Qiang Du');
            await changeAssignmentBladePo.clickOnAssignButton();
            expect(await utilityCommon.isPopUpMessagePresent(`New Assignee 'Qiang Du' has been added to the Case Access List.`)).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            for (let i: number = 0; i < 3; i++) {
                await utilityGrid.searchAndOpenHyperlink(caseId[i]);
                expect(await viewCasePage.getAssignedCompanyValue()).toBe('Petramco');
                expect(await viewCasePage.getBusinessUnitText()).toBe('Canada Support', `Business unit details are not matching for ${caseId[i]}`);
                expect(await viewCasePage.getAssignedGroupValue()).toBe('CA Support 3', `Assigned Group details are not matching for ${caseId[i]}`);
                expect(await viewCasePage.getAssigneeText()).toBe('Qiang Du', `Assignee details are not matching for ${caseId[i]}`);
                await navigationPage.gotoCaseConsole();
            }
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    describe('[4300]: Verify that Agent creates the Case with Org, Support Group and while Bulk Assignment select BU, Org, Support Group, Department', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId: string[] = [];
        let caseDataForTest;
        beforeAll(async () => {
            // caseDataForTest = caseData['bulkCaseAssigneeWithAllAssigneeFields'];
            caseDataForTest = {
                "Description": "My Bulk Case Assignee",
                "Requester": "apavlik",
                "Priority": "4000",
                "Summary": "Bulk Case Assignee",
                "Assigned Company": "Petramco",
                "Business Unit": "HR Support",
                "Support Group": "Compensation and Benefits",
                "Assignee": "Elizabeth Peters",
                "Status": "2000"
            },
            caseDataForTest.Summary = "4300 Bulk Case Assignee"+randomStr;
            await apiHelper.apiLogin('elizabeth');
            for (let i: number = 0; i < 3; i++) {
                let response = await apiHelper.createCase(caseDataForTest);
                caseId[i] = response.displayId;
            }
        });
        it('[4300]: Verify that Agent creates the Case with Org, Support Group and while Bulk Assignment select BU, Org, Support Group, Department', async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchRecord(caseDataForTest.Summary);
            for (let i: number = 0; i < 3; i++) {
                await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
            }

            await caseConsolePage.clickOnChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee("US Support 3", 'Qadim Katawazi');
            await changeAssignmentBladePo.clickOnAssignButton();
            expect(await utilityCommon.isPopUpMessagePresent(`The selected case(s) have been successfully assigned.`)).toBeTruthy();
            for (let i: number = 0; i < 3; i++) {
                await utilityGrid.searchAndOpenHyperlink(caseId[i]);
                expect(await viewCasePage.isTextPresent('HR Support')).toBeFalsy("HR Support is present");
                expect(await viewCasePage.isTextPresent('Compensation and Benefits')).toBeFalsy("Compensation and Benefits is present");
                expect(await viewCasePage.getAssignedCompanyValue()).toBe('Petramco');
                expect(await viewCasePage.getAssignedGroupValue()).toBe('US Support 3');
                expect(await viewCasePage.getAssigneeText()).toBe('Qadim Katawazi');
                await navigationPage.gotoCaseConsole();
            }
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(qfengStr);
        });
    });

    it('[4303]: Verify if Agent Bulk Assign the cases with at least one closed status then Agent should get the error', async () => {
        await apiHelper.apiLogin(qfengStr);
        let caseId: string[] = [];

        let caseDataForTest = caseData['bulkCaseAssignee_New'];
        caseDataForTest.Summary = [...Array(6)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        for (let i = 0; i < 2; i++) {
            let response = await apiHelper.createCase(caseDataForTest);
            caseId[i] = response.displayId;
        }
        let response1 = await apiHelper.createCase(caseDataForTest);
        let caseGuid = response1.id;
        caseId[2] = response1.displayId;

        await apiHelper.updateCaseStatus(caseGuid, "Resolved", "Customer Follow-Up Required");
        await apiHelper.updateCaseStatus(caseGuid, "Closed");
        await utilityGrid.sortGridColumn('Case ID', 'desc');
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchRecord(caseDataForTest.Summary);
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }

        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignmentBladePo.setAssignee("US Support 3", 'Qadim Katawazi');
        await changeAssignmentBladePo.clickOnAssignButton();
        expect(await utilityCommon.isPopUpMessagePresent('Cases in closed or canceled status cannot be modified. Please update the selected cases.', 1)).toBeTruthy();
        await caseConsolePage.selectAllCases();
    });

    it('[4385]: Verify that Agent is unable to change the Assignee if status is Pending or Canceled', async () => {
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

        let caseData = {
            "Requester": "qkatawazi",
            "Summary": "All Categories selected 4385",
            "Origin": "Agent",
            "Case Template ID": caseTemplateDisplayId
        }

        await apiHelper.apiLogin(qfengStr);
        let caseId: string[] = []
        let caseGuid: string[] = []
        for (let i: number = 0; i < 2; i++) {
            let response = await apiHelper.createCase(caseData);
            caseId[i] = response.displayId;
            caseGuid[i] = response.id;
        }

        await apiHelper.updateCaseStatus(caseGuid[0], 'InProgress');
        await apiHelper.updateCaseStatus(caseGuid[1], 'Canceled', 'Customer Canceled');
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchRecord(caseId[0]);
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId[0]);
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignmentBladePo.setAssignee("US Support 3", 'Qadim Katawazi');
        await changeAssignmentBladePo.clickOnAssignButton();
        expect(await utilityCommon.isPopUpMessagePresent('Cases that are pending approval can only be manually moved to canceled status.', 1)).toBeTruthy();
        await utilityCommon.closePopUpMessage();

        await caseConsolePage.selectAllCases();
        await utilityGrid.searchRecord(caseId[1]);
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId[1]);
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignmentBladePo.setAssignee("US Support 3", 'Qadim Katawazi');
        await changeAssignmentBladePo.clickOnAssignButton();
        expect(await utilityCommon.isPopUpMessagePresent('Cases in closed or canceled status cannot be modified. Please update the selected cases.', 1)).toBeTruthy();
    });
});