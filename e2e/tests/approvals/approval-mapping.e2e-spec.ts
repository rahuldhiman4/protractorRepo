import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import approvalMappingConsolePage from "../../pageobject/settings/case-management/approval-mapping-console.po";
import createApprovalMappingPage from "../../pageobject/settings/case-management/create-approval-mapping.po";
import editApprovalMappingPage from "../../pageobject/settings/case-management/edit-approval-mapping.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';

describe("Approval Mapping Tests", () => {
    const approvalMappingNameStr = "Approval Mapping Name";
    const companyStr = "Company";
    const flowsetStr = "Flowset";
    const statusTriggerStr = "Status Trigger";
    const statusMappingApprovedStr = "Approved";
    const statusMappingNoApproverFoundStr = "No Approval Found";
    const statusMappingRejectedStr = "Rejected";
    const statusMappingErrorStr = "Error";
    const approvalTriggerMsg = "Approval process starts when the case has above status.";
    const approvalMappingMsg = "Mapping the result of the approval process to the case status.";
    const approvalStatusMappingLabel = "Status mapping:";


    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //skhobrag
    describe('[DRDMV-10698,DRDMV-10710,DRDMV-10700,DRDMV-10701]:[Approval Mapping] - Create a new Approval Mapping with all fields', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalMappingName = 'Approval Mapping' + randomStr;
        let statusTriggerDropDownOptions: string[] = ["Assigned", "In Progress", "Resolved", "Canceled"];
        let statusMappingApprovedWhenStatusTriggerAssigned: string[] = ["Assigned", "In Progress", "Pending", "Resolved", "Canceled"];
        let statusMappingNoApprovalFoundWhenStatusTriggerAssigned: string[] = ["Assigned", "In Progress", "Pending", "Resolved", "Canceled"];
        let statusMappingRejectedWhenStatusTriggerAssigned: string[] = ["New", "Canceled", "Approval Rejected"];
        let statusMappingErrorWhenStatusTriggerAssigned: string[] = ["New", "Canceled"];

        let statusMappingApprovedWhenStatusTriggerInProgress: string[] = ["In Progress", "Pending", "Resolved", "Canceled"];
        let statusMappingNoApprovalFoundWhenStatusTriggerInProgress: string[] = ["In Progress", "Pending", "Resolved", "Canceled"];
        let statusMappingRejectedWhenStatusTriggerInProgress: string[] = ["New", "Assigned", "Canceled", "Approval Rejected"];
        let statusMappingErrorWhenStatusTriggerInProgress: string[] = ["New", "Assigned", "Canceled"];

        let statusMappingApprovedWhenStatusTriggerResolved: string[] = ["Resolved", "Assigned", "In Progress", "Pending", "Closed"];
        let statusMappingNoApprovalFoundWhenStatusTriggerResolved: string[] = ["Resolved", "Assigned", "In Progress", "Pending", "Closed"];
        let statusMappingRejectedWhenStatusTriggerResolved: string[] = ["New", "Assigned", "In Progress", "Pending", "Canceled", "Approval Rejected"];
        let statusMappingErrorWhenStatusTriggerResolved: string[] = ["New", "Assigned", "In Progress", "Canceled"];

        let statusMappingApprovedWhenStatusTriggerCanceled: string[] = ["Canceled", "Pending"];
        let statusMappingNoApprovalFoundWhenStatusTriggerCanceled: string[] = ["Canceled", "Pending"];
        let statusMappingRejectedWhenStatusTriggerCanceled: string[] = ["New", "Assigned", "In Progress", "Pending", "Resolved", "Canceled", "Approval Rejected"];
        let statusMappingErrorWhenStatusTriggerCanceled: string[] = ["New", "Assigned", "In Progress", "Resolved", "Canceled"];
        let flowsetValues: string[] = ["Human Resources", "Facilities Management"]

        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteApprovalMapping();
        });
        it('[DRDMV-10698,DRDMV-10710,DRDMV-10700,DRDMV-10701]: Create Approval Mapping UI Validation', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');

            //Verify no. of fields displayed on Add Approval Mapping screen
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(approvalMappingNameStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(companyStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(flowsetStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingStatusTriggerFieldDisplayed(statusTriggerStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(statusMappingApprovedStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(statusMappingNoApproverFoundStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(statusMappingRejectedStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(statusMappingErrorStr)).toBeTruthy();

            //Verify the mandatory and optionals fields on Add Approval Mapping screen
            expect(await createApprovalMappingPage.isApprovalMappingNameFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isCompanyFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isFlowsetFieldMandatory()).toBeFalsy();
            expect(await createApprovalMappingPage.isStatusTriggerFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isStatusMappingApprovedFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isStatusMappingNoApproverFoundFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isStatusMappingRejectedFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isStatusMappingErrorFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            expect(await createApprovalMappingPage.getApprovalMappingStatusTriggerMessage()).toBe(approvalTriggerMsg);
            expect(await createApprovalMappingPage.getApprovalMappingStatusMappingLabelText()).toBe(approvalStatusMappingLabel);
            expect(await createApprovalMappingPage.getApprovalMappingStatusMappingMessage()).toBe(approvalMappingMsg);
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('Petramco');

            //Verify status Mapping drop down options when status trigger is Assigned
            await createApprovalMappingPage.isStatusTriggerDropDownOptionsMatches(statusTriggerDropDownOptions);
            await createApprovalMappingPage.isStatusMappingApprovedDropDownOptionsMatches(statusMappingApprovedWhenStatusTriggerAssigned);
            await createApprovalMappingPage.isStatusMappingNoApprovalFoundDropDownOptionsMatches(statusMappingNoApprovalFoundWhenStatusTriggerAssigned);
            await createApprovalMappingPage.isStatusMappingRejectedDropDownOptionsMatches(statusMappingRejectedWhenStatusTriggerAssigned);
            await createApprovalMappingPage.isStatusMappingErrorDropDownOptionsMatches(statusMappingErrorWhenStatusTriggerAssigned);

            //Verify status Mapping drop down options when status trigger is In Progress
            await createApprovalMappingPage.selectStatusTrigger('In Progress');
            await createApprovalMappingPage.isStatusMappingApprovedDropDownOptionsMatches(statusMappingApprovedWhenStatusTriggerInProgress);
            await createApprovalMappingPage.isStatusMappingNoApprovalFoundDropDownOptionsMatches(statusMappingNoApprovalFoundWhenStatusTriggerInProgress);
            await createApprovalMappingPage.isStatusMappingRejectedDropDownOptionsMatches(statusMappingRejectedWhenStatusTriggerInProgress);
            await createApprovalMappingPage.isStatusMappingErrorDropDownOptionsMatches(statusMappingErrorWhenStatusTriggerInProgress);

            //Verify status Mapping drop down options when status trigger is Resolved
            await createApprovalMappingPage.selectStatusTrigger('Resolved');
            await createApprovalMappingPage.isStatusMappingApprovedDropDownOptionsMatches(statusMappingApprovedWhenStatusTriggerResolved);
            await createApprovalMappingPage.isStatusMappingNoApprovalFoundDropDownOptionsMatches(statusMappingNoApprovalFoundWhenStatusTriggerResolved);
            await createApprovalMappingPage.isStatusMappingRejectedDropDownOptionsMatches(statusMappingRejectedWhenStatusTriggerResolved);
            await createApprovalMappingPage.isStatusMappingErrorDropDownOptionsMatches(statusMappingErrorWhenStatusTriggerResolved);

            //Verify status Mapping drop down options when status trigger is Canceled
            await createApprovalMappingPage.selectStatusTrigger('Canceled');
            await createApprovalMappingPage.isStatusMappingApprovedDropDownOptionsMatches(statusMappingApprovedWhenStatusTriggerCanceled);
            await createApprovalMappingPage.isStatusMappingNoApprovalFoundDropDownOptionsMatches(statusMappingNoApprovalFoundWhenStatusTriggerCanceled);
            await createApprovalMappingPage.isStatusMappingRejectedDropDownOptionsMatches(statusMappingRejectedWhenStatusTriggerCanceled);
            await createApprovalMappingPage.isStatusMappingErrorDropDownOptionsMatches(statusMappingErrorWhenStatusTriggerCanceled);
        });
        it('[DRDMV-10698,DRDMV-10710,DRDMV-10700,DRDMV-10701]: Create Approval Mapping with Mandatory Fields', async () => {
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingError('New');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(approvalMappingName);
            expect(await editApprovalMappingPage.getSelectedCompany()).toBe('Petramco');
            expect(await editApprovalMappingPage.getSelectedStatusTriggerOption()).toBe('Assigned');
            expect(await editApprovalMappingPage.getStatusMappingApprovedOption()).toBe('In Progress');
            expect(await editApprovalMappingPage.getSatusMappingNoApprovalFoundOption()).toBe('Pending');
            expect(await editApprovalMappingPage.getStatusMappingRejectedOption()).toBe('Canceled');
            expect(await editApprovalMappingPage.getStatusMappingErrorOption()).toBe('New');
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });
        it('[DRDMV-10698,DRDMV-10710,DRDMV-10700,DRDMV-10701]: [Approval Mapping] - Create a new Approval Mapping with all fields', async () => {
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.isSelectFlowsetDropDownOptionsMatches(flowsetValues);
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectFlowset('Facilities Management');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingError('New');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(approvalMappingName);
            expect(await editApprovalMappingPage.getSelectedCompany()).toBe('Petramco');
            expect(await editApprovalMappingPage.getSelectedFlowset()).toBe('Facilities Management');
            expect(await editApprovalMappingPage.getSelectedStatusTriggerOption()).toBe('Assigned');
            expect(await editApprovalMappingPage.getStatusMappingApprovedOption()).toBe('In Progress');
            expect(await editApprovalMappingPage.getSatusMappingNoApprovalFoundOption()).toBe('Pending');
            expect(await editApprovalMappingPage.getStatusMappingRejectedOption()).toBe('Canceled');
            expect(await editApprovalMappingPage.getStatusMappingErrorOption()).toBe('New');
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteApprovalMapping();
        });
    });

    //skhobrag
    describe('[DRDMV-10703]:[Approval Mapping] - Create/Update another mapping record with Same Name / Mappings and same trigger status', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalMappingName = 'Approval Mapping' + randomStr;

        it('[DRDMV-10703]: Create Apporval Mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingError('New');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(approvalMappingName);
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });
        it('[DRDMV-10703]: Verify Duplicate Approval Mapping', async () => {
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingError('New');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (222099): The combination of Company, Flowset and Status to trigger already exists for this record definition. Please enter unique values for these fields.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
        it('[DRDMV-10703]: [Approval Mapping] - Create/Update another mapping record with Same Name / Mappings and same trigger status', async () => {
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName("Test " + approvalMappingName);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('In Progress');
            await createApprovalMappingPage.selectStatusMappingApproved('Resolved');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingError('New');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe("Test " + approvalMappingName);
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
            await utilGrid.searchAndOpenHyperlink("Test " + approvalMappingName);
            await editApprovalMappingPage.setApprovalMappingName("Test " + approvalMappingName);
            await editApprovalMappingPage.selectStatusTrigger('Assigned');
            await editApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await editApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await editApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await editApprovalMappingPage.selectStatusMappingError('New');
            await editApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (222099): The combination of Company, Flowset and Status to trigger already exists for this record definition. Please enter unique values for these fields.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
            await utilCommon.clickOnWarningOk();
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteApprovalMapping();
        })
    });

    //skhobrag
    describe('[DRDMV-11881]:[Approval Mapping] - Create Global Approval Mapping with all fields', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalMappingName = 'Approval Mapping' + randomStr;
        let flowsetValues: string[] = ["Facilities Management"];

        it('[DRDMV-11881]: Create Global Approval Mapping with all fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('- Global -');
            await createApprovalMappingPage.isSelectFlowsetDropDownOptionsMatches(flowsetValues);
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectFlowset('Facilities Management');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingError('New');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getSelectedCompany()).toBe('- Global -');
        });
        it('[DRDMV-11881]: Verify global approval mapping with different company user', async () => {
            await navigationPage.signOut();
            await loginPage.login('gderuno');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(approvalMappingName);
            expect(await editApprovalMappingPage.getSelectedCompany()).toBe('- Global -');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(approvalMappingName);
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteApprovalMapping();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //skhobrag
    describe('[DRDMV-10702,DRDMV-11882,DRDMV-16524]:[Approval Mapping] - Update existing Approval Mapping record', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalMappingName = 'Approval Mapping' + randomStr;

        it('[DRDMV-10702,DRDMV-11882,DRDMV-16524]: Create Apporval Mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectFlowset('Facilities Management');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingError('New');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(approvalMappingName);
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });
        it('[DRDMV-10702,DRDMV-11882,DRDMV-16524]: Update existing approval mapping', async () => {
            await utilGrid.searchAndOpenHyperlink(approvalMappingName);
            expect(await editApprovalMappingPage.getEditApprovalMappingHeaderText()).toBe('Edit Approval Mapping');
            await editApprovalMappingPage.setApprovalMappingName("Test " + approvalMappingName);
            await editApprovalMappingPage.selectStatusTrigger('In Progress');
            await editApprovalMappingPage.selectStatusMappingApproved('Resolved');
            await editApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await editApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await editApprovalMappingPage.selectStatusMappingError('New');
            await editApprovalMappingPage.clickSaveApprovalMappingBtn();
        });
        it('[DRDMV-10702,DRDMV-11882,DRDMV-16524]: [Approval Mapping] - Update existing Approval Mapping record', async () => {
            await utilGrid.searchAndOpenHyperlink("Test " + approvalMappingName);
            await editApprovalMappingPage.selectStatusMappingRejected('Approval Rejected');
            await editApprovalMappingPage.selectStatusMappingError('Canceled');
            await editApprovalMappingPage.clickSaveApprovalMappingBtn();
            await utilGrid.searchAndOpenHyperlink("Test " + approvalMappingName);
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });

        it('[DRDMV-10702,DRDMV-11882,DRDMV-16524]: Delete approval mapping', async () => {
            await utilGrid.searchAndSelectGridRecord("Test " + approvalMappingName);
            await approvalMappingConsolePage.clickDeleteApprovalMapping();
            await utilCommon.clickOnWarningOk();
            await utilGrid.searchRecord("Test " + approvalMappingName);
            await expect(utilGrid.isGridRecordPresent("Test " + approvalMappingName)).toBeFalsy('Grid record displayed on grid console after deletion.');
        });

        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteApprovalMapping();
        });
    });
});
