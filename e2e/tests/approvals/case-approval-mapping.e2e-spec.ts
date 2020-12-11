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
import utilityGrid from '../../utils/utility.grid';
import viewCasePo from '../../pageobject/case/view-case.po';

describe("Case Approval Mapping Tests", () => {
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
    let caseModule = 'Case';

    let twoCompanyUser;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        // Petramco and Psilon user
        twoCompanyUser = {
            "firstName": "CopyTask",
            "lastName": "Psilon",
            "userId": "copytask",
            "emailId": "copytask@petramco.com",
            "userPermission": ["Case Business Analyst", "Human Resource"]
        }
        await apiHelper.apiLogin("tadmin");
        await apiHelper.createNewUser(twoCompanyUser);
        await apiHelper.associatePersonToCompany(twoCompanyUser.userId, "Petramco");
        await apiHelper.associatePersonToCompany(twoCompanyUser.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(twoCompanyUser.userId, "US Support 3");
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
        let flowsetValues: string[] = ["Human Resources"]

        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
        });
        it('[DRDMV-10698,DRDMV-10710,DRDMV-10700,DRDMV-10701]: Create Approval Mapping UI Validation', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
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
            await createApprovalMappingPage.selectCompany('Petramco');

            //Verify status Mapping drop down options when status trigger is Assigned
            await createApprovalMappingPage.isStatusTriggerDropDownOptionsMatches(statusTriggerDropDownOptions);
            await createApprovalMappingPage.isStatusMappingApprovedDropDownOptionsMatches(statusMappingApprovedWhenStatusTriggerAssigned);
            await createApprovalMappingPage.isStatusMappingRejectedDropDownOptionsMatches(statusMappingRejectedWhenStatusTriggerAssigned);
            await createApprovalMappingPage.isStatusMappingNoApprovalFoundDropDownOptionsMatches(statusMappingNoApprovalFoundWhenStatusTriggerAssigned);
            await createApprovalMappingPage.isStatusMappingErrorDropDownOptionsMatches(statusMappingErrorWhenStatusTriggerAssigned);

            //Verify status Mapping drop down options when status trigger is In Progress
            await createApprovalMappingPage.selectStatusTrigger('In Progress');
            await createApprovalMappingPage.isStatusMappingApprovedDropDownOptionsMatches(statusMappingApprovedWhenStatusTriggerInProgress);
            await createApprovalMappingPage.isStatusMappingRejectedDropDownOptionsMatches(statusMappingRejectedWhenStatusTriggerInProgress);
            await createApprovalMappingPage.isStatusMappingNoApprovalFoundDropDownOptionsMatches(statusMappingNoApprovalFoundWhenStatusTriggerInProgress);
            await createApprovalMappingPage.isStatusMappingErrorDropDownOptionsMatches(statusMappingErrorWhenStatusTriggerInProgress);

            //Verify status Mapping drop down options when status trigger is Resolved
            await createApprovalMappingPage.selectStatusTrigger('Resolved');
            await createApprovalMappingPage.isStatusMappingApprovedDropDownOptionsMatches(statusMappingApprovedWhenStatusTriggerResolved);
            await createApprovalMappingPage.isStatusMappingRejectedDropDownOptionsMatches(statusMappingRejectedWhenStatusTriggerResolved);
            await createApprovalMappingPage.isStatusMappingNoApprovalFoundDropDownOptionsMatches(statusMappingNoApprovalFoundWhenStatusTriggerResolved);
            await createApprovalMappingPage.isStatusMappingErrorDropDownOptionsMatches(statusMappingErrorWhenStatusTriggerResolved);

            //Verify status Mapping drop down options when status trigger is Canceled
            await createApprovalMappingPage.selectStatusTrigger('Canceled');
            await createApprovalMappingPage.isStatusMappingApprovedDropDownOptionsMatches(statusMappingApprovedWhenStatusTriggerCanceled);
            await createApprovalMappingPage.isStatusMappingRejectedDropDownOptionsMatches(statusMappingRejectedWhenStatusTriggerCanceled);
            await createApprovalMappingPage.isStatusMappingNoApprovalFoundDropDownOptionsMatches(statusMappingNoApprovalFoundWhenStatusTriggerCanceled);
            await createApprovalMappingPage.isStatusMappingErrorDropDownOptionsMatches(statusMappingErrorWhenStatusTriggerCanceled);
        });
        it('[DRDMV-10698,DRDMV-10710,DRDMV-10700,DRDMV-10701]: Create Approval Mapping with Mandatory Fields', async () => {
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
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
            let approvalMappingName2 = 'Approval Mapping2' + randomStr;
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName2);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.isSelectFlowsetDropDownOptionsMatches(flowsetValues);
            await createApprovalMappingPage.selectStatusTrigger('In Progress');
            await createApprovalMappingPage.selectFlowset('Human Resources');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingError('New');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(approvalMappingName2);
            expect(await editApprovalMappingPage.getSelectedCompany()).toBe('Petramco');
            expect(await editApprovalMappingPage.getSelectedFlowset()).toBe('Human Resources');
            expect(await editApprovalMappingPage.getSelectedStatusTriggerOption()).toBe('In Progress');
            expect(await editApprovalMappingPage.getStatusMappingApprovedOption()).toBe('In Progress');
            expect(await editApprovalMappingPage.getSatusMappingNoApprovalFoundOption()).toBe('Pending');
            expect(await editApprovalMappingPage.getStatusMappingRejectedOption()).toBe('Canceled');
            expect(await editApprovalMappingPage.getStatusMappingErrorOption()).toBe('New');
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
            //Below are the validation for [DRDMV-10704]
            await approvalMappingConsolePage.addColumnOnGrid(['ID', 'Flowset']);
            await approvalMappingConsolePage.searchValueOnGrid('Human Resources');
            expect(await approvalMappingConsolePage.isRecordPresent('Human Resources')).toBeTruthy();
            await approvalMappingConsolePage.removeColumnFromGrid(['ID', 'Flowset']);
        });
        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
        });
    });

    //skhobrag
    describe('[DRDMV-10703,DRDMV-1303]:[Approval Mapping] - Create/Update another mapping record with Same Name / Mappings and same trigger status, Approval Mapping access', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalMappingName = 'Approval Mapping' + randomStr;
        let globalCaseTemplateStr = 'GlobalTemplate_' + randomStr;
        let petramcoCaseTemplateStr = 'PetramcoTemplate_' + randomStr;

        beforeAll(async () => {
            let caseTemplate = {
                "templateName": 'CaseTemplateName',
                "templateSummary": 'Case Template Summary',
                "categoryTier1": 'Purchasing Card',
                "casePriority": "Critical",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            // create global case template
            caseTemplate.templateName = globalCaseTemplateStr;
            caseTemplate.templateSummary = 'Case Summary for global case template';
            caseTemplate.company = '- Global -';
            await apiHelper.createCaseTemplate(caseTemplate);

            // create Petramco Active case template
            caseTemplate.templateName = petramcoCaseTemplateStr;
            caseTemplate.templateSummary = 'Case Summary for petramco case template';
            await apiHelper.createCaseTemplate(caseTemplate);
        });

        it('[DRDMV-10703,DRDMV-1303]: Create Apporval Mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingError('New');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(approvalMappingName);
            await editApprovalMappingPage.searchCaseTemplate(globalCaseTemplateStr);
            await editApprovalMappingPage.selectCaseTemplateCheckbox();
            await editApprovalMappingPage.clickCaseTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });
        it('[DRDMV-10703,DRDMV-1303]: Verify Duplicate Approval Mapping', async () => {
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingError('New');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (222099): The combination of Company, Line of Business, Flowset and Status to trigger already exists for this record definition. Please enter unique values for these fields.')).toBeTruthy('Invalid error message');
        });
        it('[DRDMV-10703,DRDMV-1303]: [Approval Mapping] - Create/Update another mapping record with Same Name / Mappings and same trigger status', async () => {
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName("Test " + approvalMappingName);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('In Progress');
            await createApprovalMappingPage.selectStatusMappingApproved('Resolved');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
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
            expect(await utilCommon.isPopUpMessagePresent('ERROR (222099): The combination of Company, Line of Business, Flowset and Status to trigger already exists for this record definition. Please enter unique values for these fields.')).toBeTruthy('Invalid error message');
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-10703,DRDMV-1303]: Case approval mapping access for Psilon user, Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login("gwixillian");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            expect(await utilGrid.isGridRecordPresent(approvalMappingName)).toBeTruthy('Human Resources LOB approval mapping is not visible in Psilon-Human Resources');
            await navigationPage.signOut();
            await loginPage.login("qdu");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(approvalMappingName);
            expect(await editApprovalMappingPage.isApprovalMappingNameDisabled()).toBeTruthy('Approval Mapping Name is editable');
            expect(await editApprovalMappingPage.isDropdownDisabled('Company')).toBeTruthy('Company dropdown is editable');
            expect(await editApprovalMappingPage.isDropdownDisabled('Flowset')).toBeTruthy('Flowset dropdown is editable');
            expect(await editApprovalMappingPage.isDropdownDisabled('StatusTrigger')).toBeTruthy('StatusTrigger dropdown is editable');
            expect(await editApprovalMappingPage.isDropdownDisabled('StatusApproved')).toBeTruthy('StatusApproved dropdown is editable');
            expect(await editApprovalMappingPage.isCasesCreatedWithoutTemplateToggleDisabled()).toBeTruthy('CasesCreatedWithoutTemplateToggleButton is editable');
            await editApprovalMappingPage.searchCaseTemplate(petramcoCaseTemplateStr);
            await editApprovalMappingPage.selectCaseTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectCaseTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Case template can be associated');
            await editApprovalMappingPage.searchAssociatedCaseTemplate(globalCaseTemplateStr);
            await editApprovalMappingPage.selectAssociatedCaseTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectCaseTemplateforApprovalLeftArrawBtnEnabled()).toBeFalsy('Case template can be dissociated');
            // case agent access already verified in different JiraIDs DRDMV-10479
        });
        it('[DRDMV-10703,DRDMV-1303]: Case approval mapping access Case BA', async () => {
            let newApprovalName = "Test2 " + approvalMappingName;
            await navigationPage.signOut();
            await loginPage.login(twoCompanyUser.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(approvalMappingName);
            await editApprovalMappingPage.setApprovalMappingName(newApprovalName);
            await editApprovalMappingPage.clickSaveApprovalMappingBtn();
            await utilCommon.closePopUpMessage();
            await utilGrid.searchAndSelectGridRecord(newApprovalName);
            await approvalMappingConsolePage.clickDeleteApprovalMapping();
            await utilCommon.clickOnWarningOk();
            await utilGrid.searchRecord(newApprovalName);
            await expect(utilGrid.isGridRecordPresent(newApprovalName)).toBeFalsy('Grid record displayed on grid console after deletion.');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //skhobrag
    describe('[DRDMV-11881,DRDMV-22947]:[Approval Mapping] - Create Global Approval Mapping with all fields, Toggle button status', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalMappingName = 'Approval Mapping' + randomStr;
        let flowsetValues: string[] = ["Benefits"];

        it('[DRDMV-11881,DRDMV-22947]: Create Global Approval Mapping with all fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('- Global -');
            await createApprovalMappingPage.isSelectFlowsetDropDownOptionsMatches(flowsetValues);
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectFlowset("Benefits");
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingError('New');
            expect(await editApprovalMappingPage.isCaseCreatedUsingTemplateGoInApprovalToggleDisplayed()).toBeFalsy('Cases created without using any template should go through approval displayed.');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy("Save button Enabling");
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getSelectedCompany()).toBe('- Global -');
        });
        it('[DRDMV-11881,DRDMV-22947]: Verify global approval mapping with different company user', async () => {
            await navigationPage.signOut();
            await loginPage.login('gderuno');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(approvalMappingName);
            expect(await editApprovalMappingPage.getSelectedCompany()).toBe('- Global -');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(approvalMappingName);
            expect(await editApprovalMappingPage.isCaseCreatedUsingTemplateGoInApprovalToggleFalse()).toBeTruthy('Cases created without using any template is toggle values is true.');
        });
        it('[DRDMV-11881,DRDMV-22947]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await utilGrid.selectLineOfBusiness('Human Resource');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('- Global -');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingError('New');
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            //uncomment after QCert Dec 20
            //expect(await utilCommon.isPopUpMessagePresent('ERROR (222099): The combination of Company, Line of Business, Flowset and Status to trigger already exists for this record definition. Please enter unique values for these fields.')).toBeTruthy("Error message absent");
            await createApprovalMappingPage.clickCancelApprovalMappingBtn();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-11881,DRDMV-22947]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilGrid.selectLineOfBusiness('Facilities');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('- Global -');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingError('New');
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
            await utilGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
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
            await createApprovalMappingPage.selectFlowset('Human Resources');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
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
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
        });
    });

    //skhobrag
    describe('[DRDMV-22195]:Case Global Approval Mapping behavior', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let approvalMappingName = 'Approval Mapping' + randomStr;
        let globalCaseTemplateStr = 'Case Template for Global company_' + randomStr;
        let petramcoCaseTemplateStr = 'Case Template for Petramco company_' + randomStr;
        let psilonCaseTemplateStr = 'Case Template for Psilon company_' + randomStr;
        let draftCaseTemplateStr = 'Case Template for Petramco company for draft status_' + randomStr;
        let inactiveCaseTemplateStr = 'Case Template for Petramco company for inactive status_' + randomStr;

        beforeAll(async () => {

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);

            let caseTemplate = {
                "templateName": 'CaseTemplateName',
                "templateSummary": 'Case Template Summary',
                "categoryTier1": 'Purchasing Card',
                "casePriority": "Critical",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            // create global case template
            caseTemplate.templateName = globalCaseTemplateStr;
            caseTemplate.templateSummary = 'Case Summary for global case template';
            caseTemplate.company = '- Global -';
            await apiHelper.createCaseTemplate(caseTemplate);

            // create Petramco Active case template
            caseTemplate.templateName = petramcoCaseTemplateStr;
            caseTemplate.templateSummary = 'Case Summary for petramco case template';
            await apiHelper.createCaseTemplate(caseTemplate);

            // create Petramco Draft case template
            caseTemplate.templateName = draftCaseTemplateStr;
            caseTemplate.templateSummary = 'Case Summary for petramco case template draft status';
            caseTemplate.templateStatus = 'Draft';
            await apiHelper.createCaseTemplate(caseTemplate);

            // create Petramco Inactive case template
            caseTemplate.templateName = inactiveCaseTemplateStr;
            caseTemplate.templateSummary = 'Case Summary for petramco case template inactive status';
            caseTemplate.templateStatus = 'Inactive';
            await apiHelper.createCaseTemplate(caseTemplate);

            let psilonCaseTemplate = {
                "templateName": `${psilonCaseTemplateStr}`,
                "templateSummary": 'Case Summary for psilon case template',
                "categoryTier1": 'Purchasing Card',
                "casePriority": "Critical",
                "templateStatus": "Active",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.apiLogin('gderuno');
            await apiHelper.createCaseTemplate(psilonCaseTemplate);
        });

        it('[DRDMV-22195]: Create Apporval Mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingError('New');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(approvalMappingName);
        });

        it('[DRDMV-22195]: Verify case template selection for approval mapping with petramco organization', async () => {
            await editApprovalMappingPage.searchCaseTemplate(globalCaseTemplateStr);
            expect(await editApprovalMappingPage.getSearchedCaseTemplate()).toBe(globalCaseTemplateStr);
            await editApprovalMappingPage.searchCaseTemplate(petramcoCaseTemplateStr);
            expect(await editApprovalMappingPage.getSearchedCaseTemplate()).toBe(petramcoCaseTemplateStr);
            await editApprovalMappingPage.searchCaseTemplate(psilonCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedCaseTemplateDisplayed()).toBeFalsy('Searched case template for different company is displayed.');
            await editApprovalMappingPage.searchCaseTemplate(draftCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedCaseTemplateDisplayed()).toBeFalsy('Searched draft case template for different company is displayed.');
            await editApprovalMappingPage.searchCaseTemplate(inactiveCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedCaseTemplateDisplayed()).toBeFalsy('Searched inactive case template for different company is displayed.');
            await editApprovalMappingPage.searchAssociatedCaseTemplate(globalCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedAssociatedCaseTemplateDisplayed()).toBeFalsy('Searched case template is not displayed.');
            await editApprovalMappingPage.searchAssociatedCaseTemplate(petramcoCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedAssociatedCaseTemplateDisplayed()).toBeFalsy('Searched case template is not displayed.');
            expect(await editApprovalMappingPage.isSelectCaseTemplateforApprovalLeftArrawBtnEnabled()).toBeFalsy('Left Arrow button to select case template is enabled');
            expect(await editApprovalMappingPage.isSelectCaseTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Right Arrow button to select case template is enabled');
            await editApprovalMappingPage.searchCaseTemplate(globalCaseTemplateStr);
            await editApprovalMappingPage.selectCaseTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectCaseTemplateforApprovalLeftArrawBtnEnabled()).toBeFalsy('Left Arrow button to select case template is disabled');
            expect(await editApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy('Save button is enabled');
            await editApprovalMappingPage.clickCaseTemplateforApprovalRightArrawBtn();
            expect(await editApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy('Save button is enabled');
            await editApprovalMappingPage.searchCaseTemplate(petramcoCaseTemplateStr);
            await editApprovalMappingPage.selectCaseTemplateCheckbox();
            await editApprovalMappingPage.clickCaseTemplateforApprovalRightArrawBtn();
            //search the already selected case template
            await editApprovalMappingPage.searchCaseTemplate(globalCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedCaseTemplateDisplayed()).toBeFalsy('Searched case template is not displayed.');
            await editApprovalMappingPage.searchCaseTemplate(petramcoCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedCaseTemplateDisplayed()).toBeFalsy('Searched case template is not displayed.');
            await editApprovalMappingPage.searchAssociatedCaseTemplate(globalCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedAssociatedCaseTemplateDisplayed()).toBeTruthy('Searched case template is not displayed.');
            await editApprovalMappingPage.searchAssociatedCaseTemplate(petramcoCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedAssociatedCaseTemplateDisplayed()).toBeTruthy('Searched case template is not displayed.');

            await editApprovalMappingPage.searchAssociatedCaseTemplate(petramcoCaseTemplateStr);
            await editApprovalMappingPage.selectAssociatedCaseTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectCaseTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Right Arrow button to select case template is disabled');
            await editApprovalMappingPage.clickCaseTemplateforApprovalLeftArrawBtn();
            await editApprovalMappingPage.searchAssociatedCaseTemplate(petramcoCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedAssociatedCaseTemplateDisplayed()).toBeFalsy('Searched case template is not displayed.');
            await editApprovalMappingPage.searchCaseTemplate(petramcoCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedCaseTemplateDisplayed()).toBeTruthy('Searched case template is not displayed.');
        });

        it('[DRDMV-22195]: verify updated details on approval mapping', async () => {
            await editApprovalMappingPage.searchCaseTemplate('Case Template for ');
            await editApprovalMappingPage.selectMultipleCaseTemplateCheckbox();
            await editApprovalMappingPage.clickCaseTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
            await utilGrid.searchAndOpenHyperlink(approvalMappingName);
            await editApprovalMappingPage.searchAssociatedCaseTemplate(globalCaseTemplateStr);
            expect(await editApprovalMappingPage.getAssociatedCaseTemplate()).toBe(globalCaseTemplateStr, `${globalCaseTemplateStr} Associated template doesn't match`);
            await editApprovalMappingPage.searchAssociatedCaseTemplate(petramcoCaseTemplateStr);
            expect(await editApprovalMappingPage.getAssociatedCaseTemplate()).toBe(petramcoCaseTemplateStr, `${petramcoCaseTemplateStr} Associated template doesn't match`);
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });

        it('[DRDMV-22195]: Create Apporval Mapping for Global Company', async () => {
            let approvalMappingName2 = 'Approval Mapping2' + randomStr;
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName(approvalMappingName2);
            await createApprovalMappingPage.selectCompany('Global');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Canceled');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Pending');
            await createApprovalMappingPage.selectStatusMappingError('New');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(approvalMappingName2);
        });

        it('[DRDMV-22195]: Verify case template selection for approval mapping with global organization', async () => {
            await editApprovalMappingPage.searchCaseTemplate(globalCaseTemplateStr);
            expect(await editApprovalMappingPage.getSearchedCaseTemplate()).toBe(globalCaseTemplateStr);
            await editApprovalMappingPage.searchCaseTemplate(petramcoCaseTemplateStr);
            expect(await editApprovalMappingPage.getSearchedCaseTemplate()).toBe(petramcoCaseTemplateStr);
            await editApprovalMappingPage.searchCaseTemplate(psilonCaseTemplateStr);
            expect(await editApprovalMappingPage.getSearchedCaseTemplate()).toBe(psilonCaseTemplateStr);
            expect(await editApprovalMappingPage.isSelectCaseTemplateforApprovalLeftArrawBtnEnabled()).toBeFalsy('Left Arrow button to select case template is enabled');
            expect(await editApprovalMappingPage.isSelectCaseTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Right Arrow button to select case template is enabled');
            await editApprovalMappingPage.searchCaseTemplate(globalCaseTemplateStr);
            await editApprovalMappingPage.selectCaseTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectCaseTemplateforApprovalLeftArrawBtnEnabled()).toBeFalsy('Left Arrow button to select case template is enabled');
            expect(await editApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy('Save button is enabled');
            await editApprovalMappingPage.clickCaseTemplateforApprovalRightArrawBtn();
            expect(await editApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy('Save button is enabled');
            await editApprovalMappingPage.searchCaseTemplate(petramcoCaseTemplateStr);
            await editApprovalMappingPage.selectCaseTemplateCheckbox();
            await editApprovalMappingPage.clickCaseTemplateforApprovalRightArrawBtn();
            expect(await editApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy('Save button is enabled');
            await editApprovalMappingPage.searchCaseTemplate(psilonCaseTemplateStr);
            await editApprovalMappingPage.selectCaseTemplateCheckbox();
            await editApprovalMappingPage.clickCaseTemplateforApprovalRightArrawBtn();

            //search the already selected case template
            await editApprovalMappingPage.searchCaseTemplate(globalCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedCaseTemplateDisplayed()).toBeFalsy('Searched case template is not displayed.');
            await editApprovalMappingPage.searchCaseTemplate(petramcoCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedCaseTemplateDisplayed()).toBeFalsy('Searched case template is not displayed.');
            await editApprovalMappingPage.searchAssociatedCaseTemplate(globalCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedAssociatedCaseTemplateDisplayed()).toBeTruthy('Searched case template is not displayed.');
            await editApprovalMappingPage.searchAssociatedCaseTemplate(petramcoCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedAssociatedCaseTemplateDisplayed()).toBeTruthy('Searched case template is not displayed.');

            await editApprovalMappingPage.searchAssociatedCaseTemplate(petramcoCaseTemplateStr);
            await editApprovalMappingPage.selectAssociatedCaseTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectCaseTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Right Arrow button to select case template is disabled');
            await editApprovalMappingPage.clickCaseTemplateforApprovalLeftArrawBtn();
            await editApprovalMappingPage.searchAssociatedCaseTemplate(petramcoCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedAssociatedCaseTemplateDisplayed()).toBeFalsy('Searched case template is not displayed.');
            await editApprovalMappingPage.searchCaseTemplate(petramcoCaseTemplateStr);
            expect(await editApprovalMappingPage.isSearchedCaseTemplateDisplayed()).toBeTruthy('Searched case template is not displayed.');
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });

        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
        });
    });

    describe('[DRDMV-22949]:Different Approval Mapping Configurations for Case and the way it processes', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName1 = 'CaseTemplate1_' + randomStr;
        let caseTemplateName2 = 'CaseTemplate2_' + randomStr;
        let caseTemplate1, caseTemplate2, approvalMappingData;
        beforeAll(async () => {
            //Create Approval Flow. Category 1 = Workforce Administration, Category 2 = HR Operations
            let approvalFlowData = {
                "flowName": `Approval FLow ${randomStr}`,
                "approver": "qliu;qkatawazi",
                "qualification": "'Category Tier 1' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.662dc43aa1b2ada8eefe9dfb6aec1413d9d6b92f119132f2f8fbe01d771768f4c674c03062fa2ce190b9b6889e7a73c5b94501a79b2f50b4a488d63252c05920.304405421} AND 'Category Tier 2' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.5264bb516ca8f271f6740d23ef297f8ad20245a7ab732f732c86f72180b26473dae7afcaa103d196e9a5c2d948a9a2d42a74200859284322111b7ded9666eae9.304405421}"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createApprovalFlow(approvalFlowData, caseModule);

            // Create Case Templates through API
            let caseTemplateData = {
                "templateName": caseTemplateName1,
                "templateSummary": 'Case Template Summary',
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            };
            // Create case template which will be changed to Inactive status
            caseTemplate1 = await apiHelper.createCaseTemplate(caseTemplateData);
            caseTemplateData.templateName = caseTemplateName2;
            caseTemplate2 = await apiHelper.createCaseTemplate(caseTemplateData);

            //Create Approval Mapping through API
            approvalMappingData = {
                "triggerStatus": "Assigned",
                "errorStatus": "New",
                "approvedStatus": "InProgress",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
                "company": "Petramco",
                "mappingName": "Approval Mapping for One Must Approval"
            }
            let approvalMappingResponse = await apiHelper.createApprovalMapping(caseModule, approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule, caseTemplate1.id, approvalMappingResponse.id);
        });
        it('[DRDMV-22949]:Toggle False, case created using template which added in approval mapping, case should go in Approval', async () => {
            await apiHelper.apiLogin('qkatawazi');
            let caseData = {
                "Requester": "qdu",
                "Summary": "Toggle False, case template added in approval mapping" + "_" + randomStr,
                "Case Template ID": caseTemplate1.id
            }
            let caseInfo = await apiHelper.createCase(caseData);
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseInfo.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeTruthy('Approval is not triggered');
        });
        it('[DRDMV-22949]:Toggle False, case created without template, case should NOT go in Approval', async () => {
            await apiHelper.apiLogin('qkatawazi');
            let caseData = {
                "Requester": "qdu",
                "Summary": "Toggle False, case without template" + "_" + randomStr,
                "Category Tier 1": "Workforce Administration",
                "Category Tier 2": "HR Operations",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng",
            }
            let caseInfo = await apiHelper.createCase(caseData);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseInfo.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeFalsy('Approval is triggered');
        });
        it('[DRDMV-22949]:Toggle False, case created using template which NOT added in approval mapping, case should NOT go in Approval', async () => {
            await apiHelper.apiLogin('qkatawazi');
            let caseData = {
                "Requester": "qdu",
                "Summary": "Toggle False, case created using template which NOT added in approval mapping, case should NOT go in Approval" + "_" + randomStr,
                "Case Template ID": caseTemplate2.id
            }
            let caseInfo = await apiHelper.createCase(caseData);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseInfo.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeFalsy('Approval is triggered');
        });
        it('[DRDMV-22949]:Set toggle in approval mapping as True', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(approvalMappingData.mappingName);
            await editApprovalMappingPage.setCaseCreatedUsingTemplateGoInApprovalToggle(true);
            await editApprovalMappingPage.clickSaveApprovalMappingBtn();
        });
        it('[DRDMV-22949]:Toggle True, case created using template which added in approval mapping, case should go in Approval', async () => {
            await apiHelper.apiLogin('qkatawazi');
            let caseData = {
                "Requester": "qdu",
                "Summary": "Toggle True, case template added in approval mapping" + "_" + randomStr,
                "Case Template ID": caseTemplate1.id
            }
            let caseInfo = await apiHelper.createCase(caseData);
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseInfo.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeTruthy('Approval is not triggered');
        });
        it('[DRDMV-22949]:Toggle True, case created without template, case should go in Approval', async () => {
            await apiHelper.apiLogin('qkatawazi');
            let caseData = {
                "Requester": "qdu",
                "Summary": "Toggle True, case without template" + "_" + randomStr,
                "Category Tier 1": "Workforce Administration",
                "Category Tier 2": "HR Operations",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng",
            }
            let caseInfo = await apiHelper.createCase(caseData);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseInfo.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Pending");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeTruthy('Approval is not triggered');
        });
        it('[DRDMV-22949]:Toggle True, case created using template which NOT added in approval mapping, case should NOT go in Approval', async () => {
            await apiHelper.apiLogin('qkatawazi');
            let caseData = {
                "Requester": "qdu",
                "Summary": "Toggle True, case template NOT added in approval mapping" + "_" + randomStr,
                "Case Template ID": caseTemplate2.id
            }
            let caseInfo = await apiHelper.createCase(caseData);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseInfo.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            expect(await viewCasePo.isShowApproversBannerDisplayed()).toBeFalsy('Approval is triggered');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(caseModule);
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    describe('[DRDMV-10704]:Approval Mapping - Console', async () => {
        beforeAll(async () => {
            //Create Approval Mapping through API
            let approvalMappingData = undefined;
            approvalMappingData = {
                "triggerStatus": "Assigned",
                "errorStatus": "New",
                "approvedStatus": "InProgress",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
                "company": "Petramco",
                "mappingName": "Approval Mapping for Petramco - Automated",
                "flowset": "Human Resources"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createApprovalMapping(caseModule, approvalMappingData);
        });
        it('[DRDMV-10704]: Approval Mapping - Console', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');

            //Verify Column Labels
            await approvalMappingConsolePage.addColumnOnGrid(['ID', 'Flowset']);
            expect(await approvalMappingConsolePage.areGridColumnMatches(['Approval Name', 'ID', 'Status Trigger', 'Company', 'Flowset']));

            //Verify remove column
            await approvalMappingConsolePage.removeColumnFromGrid(['ID']);
            expect(await approvalMappingConsolePage.areGridColumnMatches(['Approval Name', 'Status Trigger', 'Company', 'Flowset']));

            //Verify Edit Approval mapping record
            await utilGrid.searchAndOpenHyperlink('Approval Mapping for Petramco - Automated');
            await editApprovalMappingPage.selectStatusTrigger('In Progress');
            await editApprovalMappingPage.setApprovalMappingName('Update Aprroval Mapping-Petramco');
            await editApprovalMappingPage.selectCaseTemplateCheckbox();
            await editApprovalMappingPage.selectStatusMappingNoApprovalFound('In Progress');
            await editApprovalMappingPage.clickSaveApprovalMappingBtn();

            //Verify sorting on column
            await approvalMappingConsolePage.addColumnOnGrid(['ID']);
            expect(await approvalMappingConsolePage.isColumnSorted("Approval Name", "asc")).toBeTruthy();
            expect(await approvalMappingConsolePage.isColumnSorted("Approval Name", "desc")).toBeTruthy();
            expect(await approvalMappingConsolePage.isColumnSorted("Status Trigger", "asc")).toBeTruthy();
            expect(await approvalMappingConsolePage.isColumnSorted("Status Trigger", "desc")).toBeTruthy();
            expect(await approvalMappingConsolePage.isColumnSorted("Company", "asc")).toBeTruthy();
            expect(await approvalMappingConsolePage.isColumnSorted("Company", "desc")).toBeTruthy();
            expect(await approvalMappingConsolePage.isColumnSorted("Flowset", "asc")).toBeTruthy();
            expect(await approvalMappingConsolePage.isColumnSorted("Flowset", "desc")).toBeTruthy();

        });
        it('[DRDMV-10704]: Approval Mapping - Console', async () => {
            //Verify search Field
            await approvalMappingConsolePage.searchValueOnGrid('Update Aprroval Mapping-Petramco');
            expect(await approvalMappingConsolePage.isRecordPresent('Update Aprroval Mapping-Petramco')).toBeTruthy();
            await approvalMappingConsolePage.searchValueOnGrid('Petramco');
            expect(await approvalMappingConsolePage.isRecordPresent('Petramco')).toBeTruthy();
            await approvalMappingConsolePage.searchValueOnGrid('Human Resources');
            await approvalMappingConsolePage.searchValueOnGrid('In Progress');
            expect(await approvalMappingConsolePage.isRecordPresent('In Progress')).toBeTruthy();
        });
        it('[DRDMV-10704]: Approval Mapping - Console', async () => {
            //Verify records after applying filter
            await approvalMappingConsolePage.addFilter('Company', 'Petramco', 'text');
            expect(await approvalMappingConsolePage.isRecordPresent('Petramco')).toBeTruthy();
            await utilGrid.clearFilter();
            await approvalMappingConsolePage.addFilter('Approval Name', 'Update Aprroval Mapping-Petramco', 'text');
            expect(await approvalMappingConsolePage.isRecordPresent('Update Aprroval Mapping-Petramco')).toBeTruthy();
            await utilGrid.clearFilter();
            await approvalMappingConsolePage.addFilter('Status Trigger', 'In Progress', 'text');
            expect(await approvalMappingConsolePage.isRecordPresent('In Progress')).toBeTruthy();
            await utilGrid.clearFilter();
            await approvalMappingConsolePage.addFilter('Flowset', 'Human Resources', 'text');
            await utilGrid.clearFilter();
        });
        afterAll(async () => {
            await apiHelper.deleteApprovalMapping(caseModule);
        });
    });
});
