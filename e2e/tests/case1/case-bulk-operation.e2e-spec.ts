import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import caseConsolePage from '../../pageobject/case/case-console.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import loginPage from '../../pageobject/common/login.po';
import navigationPage from '../../pageobject/common/navigation.po';
import notificationPo from '../../pageobject/notification/notification.po';
import activityPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL, operation, security, type } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Case Bulk Operation', () => {

    let qfengStr = 'qfeng';
    let petramcoStr = 'Petramco';
    let usSupportGroup3Str = 'US Support 3';
    let unitedStateSupportStr = 'United States Support'
    let businessData, departmentData, suppGrpData, personData, orgId;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(qfengStr);
        await utilityGrid.clearFilter();
        await testData();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    async function testData() {
        //Create Foundation data
        const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
        const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
        const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
        const personDataFile = require('../../data/ui/foundation/person.ui.json');

        businessData = businessDataFile['BusinessUnitData_BulkOperation'];
        departmentData = departmentDataFile['DepartmentData_BulkOperation'];
        suppGrpData = supportGrpDataFile['SuppGrpData_BulkOperation'];
        personData = personDataFile['PersonData_BulkOperation'];
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping('Bulk Operation Mapping');
        orgId = await apiCoreUtil.getOrganizationGuid(petramcoStr);
        businessData.relatedOrgId = orgId;
        await apiHelper.setDefaultNotificationForUser("qtao", "Alert");
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await apiHelper.createNewUser(personData);
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId, petramcoStr);
    }

    it('[DRDMV-15953]: Verify if Case Agent can select and change the assignee of multiple cases', async () => {
        await apiHelper.apiLogin(qfengStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        for (let i: number = 0; i < 3; i++) {
            let response = await apiHelper.createCase(caseData['bulkCaseAssignee_New']);
            caseId[i] = response.displayId;
        }
        await utilityGrid.clickRefreshIcon();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignmentBladePo.setAssignee(petramcoStr, 'United States Support', 'US Support 3', "Qiao Feng");
        expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.')).toBeTruthy();

        await utilityCommon.closePopUpMessage();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.searchAndOpenHyperlink(caseId[i]);
            expect(await viewCasePage.getAssigneeText()).toBe("Qiao Feng");
            await navigationPage.gotoCaseConsole();
        }
    });

    it('[DRDMV-15954]: Verify if Case Agent can select and un-select all the Cases using checkbox beside Case column', async () => {
        await caseConsolePage.selectAllCases();
        expect(await caseConsolePage.isAllCasesSelected()).toBeTruthy("All cases are not selected");
        await caseConsolePage.selectAllCases();
        expect(await caseConsolePage.isAllCasesUnSelected()).toBeTruthy("All cases are selected");
    });

    describe('[DRDMV-15984]: Verify that once Assignee is changed from Bulk operation then respective support groups get the notification', async () => {
        let caseId: string[] = [];
        beforeAll(async () => {
            await apiHelper.apiLogin(qfengStr);
            let caseData = require('../../data/ui/case/case.ui.json');
            for (let i: number = 0; i < 3; i++) {
                let response = await apiHelper.createCase(caseData['bulkCaseAssignee_New']);
                caseId[i] = response.displayId;
            }
        });
        it('[DRDMV-15984]: Verify that once Assignee is changed from Bulk operation then respective support groups get the notification', async () => {
            await utilityGrid.clickRefreshIcon();
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[0]);
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[1]);
            await caseConsolePage.clickOnChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee(petramcoStr, unitedStateSupportStr, 'US Support 1', "Qianru Tao");
            await utilityCommon.closePopUpMessage();
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[2]);
            await caseConsolePage.clickOnChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee(petramcoStr, unitedStateSupportStr, usSupportGroup3Str, "Qiao Feng");
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
            await navigationPage.signOut();
            await loginPage.login(qfengStr);
        });
    });

    it('[DRDMV-15978]: Verify user having case read access cannot change assignee of the case using bulk assignment', async () => {
        await apiHelper.apiLogin(qfengStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let newCase1 = await apiHelper.createCase(caseData['bulkCaseAssignee_New']);
        let newCase2 = await apiHelper.createCase(caseData['bulkCaseAssignee_New']);

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
            "security": security['writeAccess'],
            "username": 'qstrong'
        }
        await apiHelper.updateCaseAccess(newCase2.id, caseWriteAccessDataQstrong);
        try {
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await utilityGrid.clearFilter();
            await utilityGrid.clickCheckBoxOfValueInGrid(newCase1.displayId);
            await utilityGrid.clickCheckBoxOfValueInGrid(newCase2.displayId);
            await caseConsolePage.clickOnChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee(petramcoStr, unitedStateSupportStr, usSupportGroup3Str, 'Qiao Feng');
            expect(await utilityCommon.isPopUpMessagePresent('You do not have permission to perform this operation. Please contact your system administrator.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(qfengStr);
        }
    });

    describe('[DRDMV-15980]: Verify that Assignment change information is visible in Actvity section', async () => {
        let caseId: string[] = [], caseGuid: string[] = [];
        beforeAll(async () => {
            await apiHelper.apiLogin(qfengStr);
            let caseData = require('../../data/ui/case/case.ui.json');
            for (let i: number = 0; i < 3; i++) {
                let response = await apiHelper.createCase(caseData['bulkCaseAssignee_New'])
                caseId[i] = response.displayId;
                caseGuid[i] = response.id;
            }
        });
        it('[DRDMV-15980]: Verify that Assignment change information is visible in Actvity section', async () => {
            await utilityGrid.clickRefreshIcon();
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
            await changeAssignmentBladePo.setAssignee(petramcoStr, "Facilities Support", "Facilities", "Franz Schwarz");
            expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.')).toBeTruthy();
            for (let i: number = 0; i < 1; i++) {
                await utilityGrid.searchAndOpenHyperlink(caseId[i]);
                await browser.sleep(10000);
                expect(await activityPo.isTextPresentInActivityLog("Qiao Feng")).toBeTruthy("Text is not present in activiy tab1");
                expect(await activityPo.isTextPresentInActivityLog("changed the case assignment")).toBeTruthy("Text is not present in activiy tab2");
                expect(await activityPo.isTextPresentInActivityLog("Assignee")).toBeTruthy("Text is not present in activiy tab");
                expect(await activityPo.isTextPresentInActivityLog("Franz Schwarz")).toBeTruthy("Text is not present in activiy tab4");
                expect(await activityPo.isTextPresentInActivityLog("Assigned Group")).toBeTruthy("Text is not present in activiy tab5");
                expect(await activityPo.isTextPresentInActivityLog("Facilities")).toBeTruthy("Text is not present in activiy tab6");
                await navigationPage.gotoCaseConsole();
            }
        });
    });

    it('[DRDMV-15981]: Verify that Agent is able to change the Assignee if status is Assigned or In Progress or Resolved', async () => {
        await apiHelper.apiLogin(qfengStr);
        let caseData = require('../../data/ui/case/case.ui.json');
        let caseId: string[] = [];
        caseId[0] = (await apiHelper.createCase(caseData['bulkCaseAssignee_Assigned'])).displayId;
        caseId[1] = (await apiHelper.createCase(caseData['bulkCaseAssignee_InProgress'])).displayId;
        caseId[2] = (await apiHelper.createCase(caseData['bulkCaseAssignee_Resolved'])).displayId;
        await utilityGrid.clickRefreshIcon();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignmentBladePo.setAssignee(petramcoStr, unitedStateSupportStr, usSupportGroup3Str, "Qadim Katawazi");
        expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.')).toBeTruthy();

        await utilityCommon.closePopUpMessage();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.searchAndOpenHyperlink(caseId[i]);
            expect(await viewCasePage.getAssigneeText()).toBe("Qadim Katawazi");
            await navigationPage.gotoCaseConsole();
        }

    });

    describe('[DRDMV-16109]: Verify that Agent creates the Case with BU, Org, Support Group, Department and while Bulk Assignment select only Org and Support Group', async () => {
        let caseId: string[] = [], caseGuid: string[] = [];
        beforeAll(async () => {
            await apiHelper.apiLogin(qfengStr);
            let caseData = require('../../data/ui/case/case.ui.json');
            for (let i: number = 0; i < 3; i++) {
                let response = await apiHelper.createCase(caseData['bulkCaseAssignee_New']);
                caseId[i] = response.displayId;
                caseGuid[i] = response.id;
            }
        });
        it('[DRDMV-16109]: Verify that Agent creates the Case with BU, Org, Support Group, Department and while Bulk Assignment select only Org and Support Group', async () => {
            await utilityGrid.clickRefreshIcon();
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
        });
    });

    describe('[DRDMV-16110]: Verify that Agent creates the Case with Org, Support Group and while Bulk Assignment select BU, Org, Support Group, Department', async () => {
        let caseId: string[] = [];
        beforeAll(async () => {
            await apiHelper.apiLoginWithCredential(personData.userId + '@petramco.com', "Password_1234");
            let caseData = require('../../data/ui/case/case.ui.json');
            for (let i: number = 0; i < 3; i++) {
                let response = await apiHelper.createCase(caseData['bulkCaseAssigneeWithAllAssigneeFields']);
                caseId[i] = response.displayId;
            }
        });
        it('[DRDMV-16110]: Verify that Agent creates the Case with Org, Support Group and while Bulk Assignment select BU, Org, Support Group, Department', async () => {
            await navigationPage.signOut();
            await loginPage.login(personData.userId + '@petramco.com', "Password_1234");

            await utilityGrid.clearFilter();
            for (let i: number = 0; i < 3; i++) {
                await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
            }

            await caseConsolePage.clickOnChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee(petramcoStr, 'United States Support', "US Support 3", 'Qadim Katawazi');
            expect(await utilityCommon.isPopUpMessagePresent('The selected case(s) have been successfully assigned.')).toBeTruthy();

            for (let i: number = 0; i < 3; i++) {
                await utilityGrid.searchAndOpenHyperlink(caseId[i]);
                expect(await viewCasePage.isTextPresent('BulkOperationBusinessUnit')).toBeFalsy("BulkOperationBusinessUnit is present");
                expect(await viewCasePage.isTextPresent('BulkOperationDepartment')).toBeFalsy("BulkOperationDepartment is present");
                expect(await viewCasePage.getAssignedCompanyText()).toBe('Petramco');
                expect(await viewCasePage.getAssignedGroupText()).toBe(usSupportGroup3Str);
                expect(await viewCasePage.getAssigneeText()).toBe('Qadim Katawazi');
                await navigationPage.gotoCaseConsole();
            }
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(qfengStr);
        });
    });

    it('[DRDMV-16107]: Verify if Agent Bulk Assign the cases with at least one closed status then Agent should get the error', async () => {
        await apiHelper.apiLogin(qfengStr);
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

        await utilityGrid.clickRefreshIcon();
        for (let i: number = 0; i < 3; i++) {
            await utilityGrid.clickCheckBoxOfValueInGrid(caseId[i]);
        }

        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignmentBladePo.setAssignee(petramcoStr, 'United States Support', "US Support 3", 'Qadim Katawazi');
        expect(await utilityCommon.isPopUpMessagePresent('Cases in closed or canceled status cannot be modified. Please update the selected cases.')).toBeTruthy();
    });

    it('[DRDMV-15982]: Verify that Agent is unable to change the Assignee if status is Pending or Canceled', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData = {
            "templateName": 'caseTemplateName' + randomStr,
            "templateSummary": 'caseTemplateSummary' + randomStr,
            "categoryTier1": 'Applications',
            "categoryTier2": 'Social',
            "categoryTier3": 'Chatter',
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
        await apiHelper.apiLogin('qkatawazi');
        let approvalMappingId = await apiHelper.createCaseApprovalMapping(approvalMappingData);
        await apiHelper.associateCaseTemplateWithApprovalMapping(caseTemplateResponse.id, approvalMappingId.id);

        //Create Approval Flow. Category 1 = Applications, Category 2 = Social and Category 3 = Chatter
        let approvalFlowData = {
            "flowName": `Bulk Operation ${randomStr}`,
            "approver": "qkatawazi",
            "qualification": "'Category Tier 3' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.c2636a9ab1d4aa37cf23b2cf0dbd1f9ea3a5d6046a3ad0ad998c63411e41815d81709de7a5f6153e78fc47ebcc9c3f3f4db51dd0d9e44084eb3a345df03cb66d.304405421}"
        }
        await apiHelper.createCaseApprovalFlow(approvalFlowData);

        let caseData = {
            "Requester": "qkatawazi",
            "Summary": "All Categories selected",
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
        await utilityGrid.clickRefreshIcon();

        await utilityGrid.clickCheckBoxOfValueInGrid(caseId[0]);
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignmentBladePo.setAssignee(petramcoStr, 'United States Support', "US Support 3", 'Qadim Katawazi');
        expect(await utilityCommon.isPopUpMessagePresent('Cases that are pending approval can only be manually moved to canceled status.')).toBeTruthy();
        await utilityCommon.closePopUpMessage();

        await utilityGrid.clickCheckBoxOfValueInGrid(caseId[0]);
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId[1]);
        await caseConsolePage.clickOnChangeAssignmentButton();
        await changeAssignmentBladePo.setAssignee(petramcoStr, 'United States Support', "US Support 3", 'Qadim Katawazi');
        expect(await utilityCommon.isPopUpMessagePresent('Cases in closed or canceled status cannot be modified. Please update the selected cases.')).toBeTruthy();
    });

});
