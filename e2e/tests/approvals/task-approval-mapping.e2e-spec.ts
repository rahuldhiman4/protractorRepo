import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import approvalMappingConsolePage from "../../pageobject/settings/task-management/approval-mapping-console.po";
import createApprovalMappingPage from "../../pageobject/settings/task-management/create-approval-mapping.po";
import editApprovalMappingPage from "../../pageobject/settings/task-management/edit-approval-mapping.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe("Task Approval Mapping Tests", () => {
    const approvalMappingNameStr = "Approval Mapping Name";
    const companyStr = "Company";
    const statusTriggerStr = "Status Trigger";
    const statusMappingApprovedStr = "Approved";
    const statusMappingNoApproverFoundStr = "No Approval Found";
    const statusMappingRejectedStr = "Rejected";
    const statusMappingErrorStr = "Error";
    const approvalTriggerMsg = "Approval process starts when the task has above status.";
    const approvalMappingMsg = "Mapping the result of the approval process to the task status.";
    const approvalStatusMappingLabel = "Status mapping:";
    let taskModule = 'Task';
    let userData, userData2 = undefined;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(taskModule);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[3592,3514]:[Task Approval] - Create/Update Approval Mapping', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskApprovalMappingStr = `Task Mapping ${randomStr}`;
        let manualTaskTemplateData, autoTaskTemplateData, manualTaskGlobalTemplateData, manualTaskTemplateDraftData, manualTaskTemplateInactiveData, psilonManualTaskTemplateData, autoTaskTemplateFacilitiesGlobalData, manualTaskId, automatedTaskId = "";
        let globalHRManualTaskTemplateData, petramcoHRManualTaskTemplateData, manualHRTaskTemplateDataDraft, manualHRTaskTemplateDataInactive, autoTaskTemplateDataHRGlobal, autoTaskTemplateDataHRPetramco, externaltemplateDataHRGlobal, externaltemplateDataHRPetramco, externaltemplateDataFacilitiesGlobal, externaltemplateDataFacilitiesPetramco;
        let statusTriggerDropDownOptions: string[] = ["Assigned", "In Progress", "Completed", "Canceled"];
        let statusMappingApprovedWhenStatusTriggerAssigned: string[] = ["Assigned", "In Progress", "Completed", "Canceled", "Closed"];
        let statusMappingNoApprovalFoundWhenStatusTriggerAssigned: string[] = ["Assigned", "In Progress", "Completed", "Canceled", "Closed"];
        let statusMappingRejectedWhenStatusTriggerAssigned: string[] = ["Canceled", "Approval Rejected"];
        let statusMappingErrorWhenStatusTriggerAssigned: string[] = ["Canceled"];

        let statusMappingApprovedWhenStatusTriggerInProgress: string[] = ["In Progress", "Assigned", "Completed", "Failed", "Canceled", "Closed"];
        let statusMappingNoApprovalFoundWhenStatusTriggerInProgress: string[] = ["In Progress", "Assigned", "Completed", "Failed", "Canceled", "Closed"];
        let statusMappingRejectedWhenStatusTriggerInProgress: string[] = ["Assigned", "Canceled", "Approval Rejected"];
        let statusMappingErrorWhenStatusTriggerInProgress: string[] = ["Assigned", "Canceled"];

        let statusMappingApprovedWhenStatusTriggerCompleted: string[] = ["Completed", "Canceled", "Closed"];
        let statusMappingNoApprovalFoundWhenStatusTriggerCompleted: string[] = ["Completed", "Canceled", "Closed"];
        let statusMappingRejectedWhenStatusTriggerCompleted: string[] = ["Assigned", "In Progress", "Pending", "Canceled", "Approval Rejected"];
        let statusMappingErrorWhenStatusTriggerCompleted: string[] = ["Assigned", "In Progress", "Pending", "Canceled"];

        let statusMappingApprovedWhenStatusTriggerCanceled: string[] = ["Canceled"];
        let statusMappingNoApprovalFoundWhenStatusTriggerCanceled: string[] = ["Canceled"];
        let statusMappingRejectedWhenStatusTriggerCanceled: string[] = ["Assigned", "In Progress", "Pending", "Completed", "Canceled", "Failed", "Approval Rejected"];
        let statusMappingErrorWhenStatusTriggerCanceled: string[] = ["Assigned", "In Progress", "Pending", "Completed", "Canceled", "Failed"];

        // let statusMappingApprovedWhenStatusTriggerApprovalRejected: string[] = ["Approval Rejected", "Assigned", "In Progress", "Canceled"];
        // let statusMappingNoApprovalFoundWhenStatusTriggerApprovalRejected: string[] = ["Approval Rejected", "Assigned", "In Progress", "Canceled"];
        // let statusMappingRejectedWhenStatusTriggerApprovalRejected: string[] = ["Canceled"];
        // let statusMappingErrorWhenStatusTriggerApprovalRejected: string[] = ["Canceled"];

        beforeAll(async () => {
            manualTaskTemplateData = {
                "templateName": `manualTaskTemplatePetramcoFacilitiesActive ${randomStr}`,
                "templateSummary": 'Manual task petramco Facilities Active',
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "lineOfBusiness": "Facilities"
            }

            psilonManualTaskTemplateData = {
                "templateName": `manualTaskTemplatePsilon ${randomStr}`,
                "templateSummary": 'Manual task psilon HR Active',
                "templateStatus": "Active",
                "taskCompany": 'Psilon',
                "ownerCompany": "Psilon",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1",
                "lineOfBusiness": "Human Resource"
            }

            manualTaskGlobalTemplateData = {
                "templateName": `manualTaskTemplateGlobalFacilitiesActive ${randomStr}`,
                "templateSummary": 'Manual task global Facilities Active',
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "lineOfBusiness": "Facilities"
            }

            manualTaskTemplateDraftData = {
                "templateName": `manualTaskTemplatePetramcoFacilitiesDraft ${randomStr}`,
                "templateSummary": 'Manual task petramco Facilities draft',
                "templateStatus": "Draft",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "lineOfBusiness": "Facilities"
            }

            manualTaskTemplateInactiveData = {
                "templateName": `manualTaskTemplatePetramcoFacilitiesInactive ${randomStr}`,
                "templateSummary": 'Manual task petramco Facilities inactive',
                "templateStatus": "Inactive",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "lineOfBusiness": "Facilities"
            }

            autoTaskTemplateData = {
                "templateName": `automatedTaskTemplatePetramcoFacilitiesActive ${randomStr}`,
                "templateSummary": 'automated task petramco Facilities Active',
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process facilities petramco ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "lineOfBusiness": "Facilities"
            }

            autoTaskTemplateFacilitiesGlobalData = {
                "templateName": `automatedTaskTemplateGlobalFacilitiesActive ${randomStr}`,
                "templateSummary": 'automated task global Active',
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process facilities global ${randomStr}`,
                "taskCompany": "- Global -",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "lineOfBusiness": "Facilities"
            }

            petramcoHRManualTaskTemplateData = {
                "templateName": `manualTaskTemplatePetramcoHumanResourceActive ${randomStr}`,
                "templateSummary": 'Manual task petramco HR Active',
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "lineOfBusiness": "Human Resource"
            }

            globalHRManualTaskTemplateData = {
                "templateName": `manualTaskTemplateGlobalHumanResourceActive ${randomStr}`,
                "templateSummary": 'Manual task global HR Active',
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "lineOfBusiness": "Human Resource"
            }

            manualHRTaskTemplateDataDraft = {
                "templateName": `manualTaskTemplatePetramcoHumanResourceDraft ${randomStr}`,
                "templateSummary": 'Manual task petramco HR Draft',
                "templateStatus": "Draft",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "lineOfBusiness": "Human Resource"
            }

            manualHRTaskTemplateDataInactive = {
                "templateName": `manualTaskTemplatePetramcoHumanResourceInactive ${randomStr}`,
                "templateSummary": 'Manual task petramco HR inactive',
                "templateStatus": "Inactive",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "lineOfBusiness": "Human Resource"
            }

            autoTaskTemplateDataHRPetramco = {
                "templateName": `automatedTaskTemplatePetramcoHumanResourceActive ${randomStr}`,
                "templateSummary": 'Automated task petramco HR Active',
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process petramco ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "lineOfBusiness": "Human Resource"
            }

            autoTaskTemplateDataHRGlobal = {
                "templateName": `automatedTaskTemplateGlobalHumanResourceActive ${randomStr}`,
                "templateSummary": 'Automated task global HR Active',
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process global ${randomStr}`,
                "taskCompany": "- Global -",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "lineOfBusiness": "Human Resource"
            }

            externaltemplateDataHRPetramco = {
                "templateName": 'externalTaskTemplatePetramcoHumanResourceActive' + randomStr,
                "templateSummary": 'External task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "category1": 'Workforce Administration',
                "category2": 'HR Operations',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "lineOfBusiness": "Human Resource"

            }

            externaltemplateDataHRGlobal = {
                "templateName": 'externalTaskTemplateGlobalHumanResourceActive' + randomStr,
                "templateSummary": 'externalTaskTemplateGlobalHumanResourceActive' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "- Global -",
                "category1": 'Workforce Administration',
                "category2": 'HR Operations',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "lineOfBusiness": "Human Resource"
            }

            externaltemplateDataFacilitiesPetramco = {
                "templateName": 'externalTaskTemplatePetramcoFacilitiesActive' + randomStr,
                "templateSummary": 'externalTaskTemplatePetramcoFacilitiesActive' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "category1": 'Workforce Administration',
                "category2": 'HR Operations',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Franz",
                "lineOfBusiness": "Facilities"

            }

            externaltemplateDataFacilitiesGlobal = {
                "templateName": 'externalTaskTemplateGlobalFacilitiesActive' + randomStr,
                "templateSummary": 'externalTaskTemplateGlobalFacilitiesActive' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "- Global -",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Franz",
                "lineOfBusiness": "Facilities"
            }

            await apiHelper.apiLogin('fritz');
            await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);
            await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateFacilitiesGlobalData);
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            await apiHelper.createManualTaskTemplate(manualTaskGlobalTemplateData);
            await apiHelper.createManualTaskTemplate(manualTaskTemplateDraftData);
            await apiHelper.createManualTaskTemplate(manualTaskTemplateInactiveData);
            await apiHelper.createExternalTaskTemplate(externaltemplateDataFacilitiesPetramco);
            await apiHelper.createExternalTaskTemplate(externaltemplateDataFacilitiesGlobal);

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateDataHRPetramco);
            await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateDataHRGlobal);
            await apiHelper.createManualTaskTemplate(globalHRManualTaskTemplateData);
            await apiHelper.createManualTaskTemplate(petramcoHRManualTaskTemplateData);
            await apiHelper.createManualTaskTemplate(manualHRTaskTemplateDataDraft);
            await apiHelper.createManualTaskTemplate(manualHRTaskTemplateDataInactive);
            await apiHelper.createExternalTaskTemplate(externaltemplateDataHRPetramco);
            await apiHelper.createExternalTaskTemplate(externaltemplateDataHRGlobal);

            await apiHelper.apiLogin('gderuno');
            await apiHelper.createManualTaskTemplate(psilonManualTaskTemplateData);
        })

        it('[3592,3514]: Create Task Approval Mapping UI Validation', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approval Mappings', BWF_PAGE_TITLES.TASK_MANAGEMENT.APPROVALS);
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Create Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName(taskApprovalMappingStr);
            await createApprovalMappingPage.selectCompany('Petramco');

            //Verify no. of fields displayed on Create Approval Mapping screen
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(approvalMappingNameStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(companyStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingStatusTriggerFieldDisplayed(statusTriggerStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(statusMappingApprovedStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(statusMappingNoApproverFoundStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(statusMappingRejectedStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(statusMappingErrorStr)).toBeTruthy();

            //Verify the mandatory and optionals fields on Create Approval Mapping screen
            expect(await createApprovalMappingPage.isApprovalMappingNameFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isCompanyFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isStatusTriggerFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isStatusMappingApprovedFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isStatusMappingRejectedFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isStatusMappingNoApproverFoundFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isStatusMappingErrorFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            expect(await createApprovalMappingPage.getApprovalMappingStatusTriggerMessage()).toBe(approvalTriggerMsg);
            expect(await createApprovalMappingPage.getApprovalMappingStatusMappingLabelText()).toBe(approvalStatusMappingLabel);
            expect(await createApprovalMappingPage.getApprovalMappingStatusMappingMessage()).toBe(approvalMappingMsg);

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
            await createApprovalMappingPage.selectStatusTrigger('Completed');
            await createApprovalMappingPage.isStatusMappingApprovedDropDownOptionsMatches(statusMappingApprovedWhenStatusTriggerCompleted);
            await createApprovalMappingPage.isStatusMappingRejectedDropDownOptionsMatches(statusMappingRejectedWhenStatusTriggerCompleted);
            await createApprovalMappingPage.isStatusMappingNoApprovalFoundDropDownOptionsMatches(statusMappingNoApprovalFoundWhenStatusTriggerCompleted);
            await createApprovalMappingPage.isStatusMappingErrorDropDownOptionsMatches(statusMappingErrorWhenStatusTriggerCompleted);

            //Verify status Mapping drop down options when status trigger is Canceled
            await createApprovalMappingPage.selectStatusTrigger('Canceled');
            await createApprovalMappingPage.isStatusMappingApprovedDropDownOptionsMatches(statusMappingApprovedWhenStatusTriggerCanceled);
            await createApprovalMappingPage.isStatusMappingRejectedDropDownOptionsMatches(statusMappingRejectedWhenStatusTriggerCanceled);
            await createApprovalMappingPage.isStatusMappingNoApprovalFoundDropDownOptionsMatches(statusMappingNoApprovalFoundWhenStatusTriggerCanceled);
            await createApprovalMappingPage.isStatusMappingErrorDropDownOptionsMatches(statusMappingErrorWhenStatusTriggerCanceled);

            //Verify status Mapping drop down options when status trigger is Approval Rejected
            // await createApprovalMappingPage.selectStatusTrigger('Approval Rejected');
            // await createApprovalMappingPage.isStatusMappingApprovedDropDownOptionsMatches(statusMappingApprovedWhenStatusTriggerApprovalRejected);
            // await createApprovalMappingPage.isStatusMappingNoApprovalFoundDropDownOptionsMatches(statusMappingNoApprovalFoundWhenStatusTriggerApprovalRejected);
            // await createApprovalMappingPage.isStatusMappingRejectedDropDownOptionsMatches(statusMappingRejectedWhenStatusTriggerApprovalRejected);
            // await createApprovalMappingPage.isStatusMappingErrorDropDownOptionsMatches(statusMappingErrorWhenStatusTriggerApprovalRejected);

        });

        it('[3592,3514]: Create Task Approval Mapping', async () => {
            await createApprovalMappingPage.setApprovalMappingName(taskApprovalMappingStr);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Approval Rejected');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Assigned');
            await createApprovalMappingPage.selectStatusMappingError('Canceled');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(taskApprovalMappingStr);
            expect(await editApprovalMappingPage.getSelectedCompany()).toBe('Petramco');
            expect(await editApprovalMappingPage.getSelectedStatusTriggerOption()).toBe('Assigned');
            expect(await editApprovalMappingPage.getStatusMappingApprovedOption()).toBe('In Progress');
            expect(await editApprovalMappingPage.getSatusMappingNoApprovalFoundOption()).toBe('Assigned');
            expect(await editApprovalMappingPage.getStatusMappingRejectedOption()).toBe('Approval Rejected');
            expect(await editApprovalMappingPage.getStatusMappingErrorOption()).toBe('Canceled');
        });

        it('[3592,3514]: Create Task Approval Mapping Task Template Selection Validation', async () => {
            await editApprovalMappingPage.searchTaskTemplate(manualTaskGlobalTemplateData.templateName);
            expect(await editApprovalMappingPage.getSearchedTaskTemplate()).toBe(manualTaskGlobalTemplateData.templateName);
            await editApprovalMappingPage.searchTaskTemplate(manualTaskTemplateData.templateName);
            expect(await editApprovalMappingPage.getSearchedTaskTemplate()).toBe(manualTaskTemplateData.templateName);
            await editApprovalMappingPage.searchTaskTemplate(psilonManualTaskTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeFalsy('Searched task template for different company is displayed.');
            await editApprovalMappingPage.searchTaskTemplate(manualTaskTemplateDraftData.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeFalsy('Searched draft task template for different company is displayed.');
            await editApprovalMappingPage.searchTaskTemplate(manualTaskTemplateInactiveData.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeFalsy('Searched inactive task template for different company is displayed.');
            await editApprovalMappingPage.searchAssociatedTaskTemplate(manualTaskTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedAssociatedTaskTemplateDisplayed()).toBeFalsy('Searched task template is not displayed.');
            await editApprovalMappingPage.searchAssociatedTaskTemplate(manualTaskGlobalTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedAssociatedTaskTemplateDisplayed()).toBeFalsy('Searched task template is not displayed.');
            expect(await editApprovalMappingPage.isSelectTaskTemplateforApprovalLeftArrawBtnEnabled()).toBeFalsy('Left Arrow button to select task template is enabled');
            expect(await editApprovalMappingPage.isSelectTaskTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Right Arrow button to select task template is enabled');
            await editApprovalMappingPage.searchTaskTemplate(manualTaskTemplateData.templateName);
            await editApprovalMappingPage.selectTaskTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectTaskTemplateforApprovalLeftArrawBtnEnabled()).toBeFalsy('Left Arrow button to select task template is disabled');
            expect(await editApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy('Save button is enabled');
            await editApprovalMappingPage.clickTaskTemplateforApprovalRightArrawBtn();
            expect(await editApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy('Save button is enabled');
            await editApprovalMappingPage.searchTaskTemplate(manualTaskGlobalTemplateData.templateName);
            await editApprovalMappingPage.selectTaskTemplateCheckbox();
            await editApprovalMappingPage.clickTaskTemplateforApprovalRightArrawBtn();
            //search the already selected case template
            await editApprovalMappingPage.searchTaskTemplate(manualTaskTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeFalsy('Searched case template is not displayed.');
            await editApprovalMappingPage.searchTaskTemplate(manualTaskGlobalTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeFalsy('Searched case template is not displayed.');
            await editApprovalMappingPage.searchAssociatedTaskTemplate(manualTaskGlobalTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedAssociatedTaskTemplateDisplayed()).toBeTruthy('Searched case template is not displayed.');
            await editApprovalMappingPage.searchAssociatedTaskTemplate(manualTaskTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedAssociatedTaskTemplateDisplayed()).toBeTruthy('Searched case template is not displayed.');

            await editApprovalMappingPage.searchAssociatedTaskTemplate(manualTaskTemplateData.templateName);
            await editApprovalMappingPage.selectAssociatedTaskTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectTaskTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Right Arrow button to select case template is disabled');
            await editApprovalMappingPage.clickTaskTemplateforApprovalLeftArrawBtn();
            await editApprovalMappingPage.searchAssociatedTaskTemplate(manualTaskGlobalTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedAssociatedTaskTemplateDisplayed()).toBeTruthy('Searched case template is not displayed.');
            await editApprovalMappingPage.searchTaskTemplate(manualTaskTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeTruthy('Searched case template is not displayed.');
        });

        it('[3592,3514]: Task template filteration validation on task approval mapping', async () => {
            //Validations for different LOB task templates not displayed on task approval mapping of Facilities LOB
            await editApprovalMappingPage.searchTaskTemplate(autoTaskTemplateDataHRPetramco.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeFalsy('Petramco Automated task template for Facilities LOB is displayed on Human Resource task approval mapping.');
            await editApprovalMappingPage.searchTaskTemplate(autoTaskTemplateDataHRGlobal.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeFalsy('Global Automated task template for Facilities LOB is displayed on Human Resource task approval mapping.');

            await editApprovalMappingPage.searchTaskTemplate(externaltemplateDataHRPetramco.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeFalsy('Petramco external task template for Facilities LOB is displayed on Human Resource task approval mapping.');
            await editApprovalMappingPage.searchTaskTemplate(externaltemplateDataHRGlobal.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeFalsy('Global external task template for Facilities LOB is displayed on Human Resource task approval mapping.');

            await editApprovalMappingPage.searchTaskTemplate(globalHRManualTaskTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeFalsy('Global Manual task template for Facilities LOB is displayed on Human Resource task approval mapping.');
            await editApprovalMappingPage.searchTaskTemplate(petramcoHRManualTaskTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeFalsy('Petramco Manual task template for Facilities LOB is displayed on Human Resource task approval mapping.');

            await editApprovalMappingPage.searchTaskTemplate(manualHRTaskTemplateDataDraft.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeFalsy('Draft manual task template for Facilities LOB is displayed on Human Resource task approval mapping.');
            await editApprovalMappingPage.searchTaskTemplate(manualHRTaskTemplateDataInactive.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeFalsy('Inactive manual task template for Facilities LOB is displayed on Human Resource task approval mapping.');

            await editApprovalMappingPage.searchAssociatedTaskTemplate(autoTaskTemplateDataHRPetramco.templateName);
            expect(await editApprovalMappingPage.isSearchedAssociatedTaskTemplateDisplayed()).toBeFalsy('Petramco Automated task template for Facilities LOB is displayed on Human Resource task approval mapping.');
            await editApprovalMappingPage.searchAssociatedTaskTemplate(autoTaskTemplateDataHRGlobal.templateName);
            expect(await editApprovalMappingPage.isSearchedAssociatedTaskTemplateDisplayed()).toBeFalsy('Global Automated task template for Facilities LOB is displayed on Human Resource task approval mapping.');

            await editApprovalMappingPage.searchAssociatedTaskTemplate(externaltemplateDataHRPetramco.templateName);
            expect(await editApprovalMappingPage.isSearchedAssociatedTaskTemplateDisplayed()).toBeFalsy('Petramco external task template for Facilities LOB is displayed on Human Resource task approval mapping.');
            await editApprovalMappingPage.searchAssociatedTaskTemplate(externaltemplateDataHRGlobal.templateName);
            expect(await editApprovalMappingPage.isSearchedAssociatedTaskTemplateDisplayed()).toBeFalsy('Global external task template for Facilities LOB is displayed on Human Resource task approval mapping.');

            await editApprovalMappingPage.searchAssociatedTaskTemplate(globalHRManualTaskTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedAssociatedTaskTemplateDisplayed()).toBeFalsy('Global Manual task template for Facilities LOB is displayed on Human Resource task approval mapping.');
            await editApprovalMappingPage.searchAssociatedTaskTemplate(petramcoHRManualTaskTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedAssociatedTaskTemplateDisplayed()).toBeFalsy('Petramco Manual task template for Facilities LOB is displayed on Human Resource task approval mapping.');

            await editApprovalMappingPage.searchAssociatedTaskTemplate(manualHRTaskTemplateDataDraft.templateName);
            expect(await editApprovalMappingPage.isSearchedAssociatedTaskTemplateDisplayed()).toBeFalsy('Draft manual task template for Facilities LOB is displayed on Human Resource task approval mapping.');
            await editApprovalMappingPage.searchAssociatedTaskTemplate(manualHRTaskTemplateDataInactive.templateName);
            expect(await editApprovalMappingPage.isSearchedAssociatedTaskTemplateDisplayed()).toBeFalsy('Inactive manual task template for Facilities LOB is displayed on Human Resource task approval mapping.');

            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });

        it('[3592,3514]: Verify Task Approval Mapping is accessible to Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approval Mappings', BWF_PAGE_TITLES.TASK_MANAGEMENT.APPROVALS);
            expect(await utilityGrid.isGridRecordPresent(taskApprovalMappingStr)).toBeTruthy('Task Approval Mapping for Facilities LOB are displayed to the Case Manager of same LOB');
        });

        it('[3592,3514]: Verify Task Approval Mapping is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approval Mappings', BWF_PAGE_TITLES.TASK_MANAGEMENT.APPROVALS);
            expect(await utilityGrid.isGridRecordPresent(taskApprovalMappingStr)).toBeFalsy('Task Approval Mapping for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[3592,3514]: Verify Task Approval Mapping is accessible to other Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approval Mappings', BWF_PAGE_TITLES.TASK_MANAGEMENT.APPROVALS);
            expect(await utilityGrid.isGridRecordPresent(taskApprovalMappingStr)).toBeFalsy('Task Approval Mapping for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[3592,3514]: Verify Task Approval Mapping are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            // HR and Facilities CaseManager
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approval Mappings', BWF_PAGE_TITLES.TASK_MANAGEMENT.APPROVALS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(taskApprovalMappingStr)).toBeFalsy('Task Approval Mapping for Facilities LOB are displayed to Human Resource LOB User.');

            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(taskApprovalMappingStr)).toBeTruthy('Task Approval Mapping for Facilities LOB are not displayed to Human Resource LOB User.');
        });

        it('[3592,3514]: Verify Task Approval Mapping are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approval Mappings', BWF_PAGE_TITLES.TASK_MANAGEMENT.APPROVALS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(taskApprovalMappingStr)).toBeFalsy('Task Approval Mapping for Facilities LOB are displayed to Human Resource LOB User.');

            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(taskApprovalMappingStr)).toBeTruthy('Task Approval Mapping for Facilities LOB are not displayed to Human Resource LOB User.');
            await utilityGrid.searchAndOpenHyperlink(taskApprovalMappingStr);
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(taskApprovalMappingStr);
            expect(await editApprovalMappingPage.getSelectedCompany()).toBe('Petramco');
            expect(await editApprovalMappingPage.getSelectedStatusTriggerOption()).toBe('Assigned');
            expect(await editApprovalMappingPage.getStatusMappingApprovedOption()).toBe('In Progress');
            expect(await editApprovalMappingPage.getSatusMappingNoApprovalFoundOption()).toBe('Assigned');
            expect(await editApprovalMappingPage.getStatusMappingRejectedOption()).toBe('Approval Rejected');
            expect(await editApprovalMappingPage.getStatusMappingErrorOption()).toBe('Canceled');

            await editApprovalMappingPage.setApprovalMappingName(taskApprovalMappingStr + '_update');
            await editApprovalMappingPage.selectStatusMappingApproved('Completed');
            await editApprovalMappingPage.searchAssociatedTaskTemplate(manualTaskGlobalTemplateData.templateName);
            await editApprovalMappingPage.selectAssociatedTaskTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectTaskTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Right Arrow button to select task template is disabled');
            await editApprovalMappingPage.clickTaskTemplateforApprovalLeftArrawBtn();
            await editApprovalMappingPage.searchTaskTemplate(manualTaskGlobalTemplateData.templateName);
            expect(await editApprovalMappingPage.isSearchedTaskTemplateDisplayed()).toBeTruthy('Searched task template is not displayed.');
            await editApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[3592,3514]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            await createApprovalMappingPage.setApprovalMappingName(taskApprovalMappingStr + "_update");
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('In Progress');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Approval Rejected');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Assigned');
            await createApprovalMappingPage.selectStatusMappingError('Canceled');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('The Approval Mapping Name already exists. Please select a different name.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await createApprovalMappingPage.clickCancelApprovalMappingBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");

            //create new record and verify it on update
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            await createApprovalMappingPage.setApprovalMappingName(taskApprovalMappingStr + "_changed");
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('In Progress');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Approval Rejected');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Assigned');
            await createApprovalMappingPage.selectStatusMappingError('Canceled');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();

            expect(await utilityGrid.isGridRecordPresent(taskApprovalMappingStr + "_changed")).toBeTruthy('Task Approval Mapping for Facilities LOB are not displayed to Human Resource LOB User.');
            await utilityGrid.searchAndOpenHyperlink(taskApprovalMappingStr + "_changed");
            await editApprovalMappingPage.setApprovalMappingName(taskApprovalMappingStr + "_update");
            await editApprovalMappingPage.selectStatusMappingApproved('Completed');
            await editApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('The Approval Mapping Name already exists. Please select a different name.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await utilityCommon.closePopUpMessage();
        });

        it('[3592,3514]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(taskApprovalMappingStr + "_update")).toBeFalsy('Task Approval Mapping for Facilities LOB are displayed to Human Resource LOB User.');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            await createApprovalMappingPage.setApprovalMappingName(taskApprovalMappingStr + "_update");
            await createApprovalMappingPage.selectCompany('- Global -');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Approval Rejected');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Assigned');
            await createApprovalMappingPage.selectStatusMappingError('Canceled');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
            expect(await utilityGrid.isGridRecordPresent(taskApprovalMappingStr + "_update")).toBeTruthy('Task Approval Mapping for Facilities LOB are not displayed to Human Resource LOB User.');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteApprovalMapping(taskModule);
        });
    });

    describe('[3411]:[Task] Approval Mapping to configure such as Approvals to be triggered on Case created without template', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskApprovalMappingStr = `Task Mapping ${randomStr}`;
        let manualTaskTemplateData, autoTaskTemplateData;

        beforeAll(async () => {
            manualTaskTemplateData = {
                "templateName": `manualTaskTemplate ${randomStr}`,
                "templateSummary": 'Automated Approval without process for task',
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            autoTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": 'Automated Approval without process for task',
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
        })

        it('[3411]: Task approval mapping creation with case Business analyst permission', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approval Mappings', BWF_PAGE_TITLES.TASK_MANAGEMENT.APPROVALS);
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Create Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName(taskApprovalMappingStr);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Approval Rejected');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Assigned');
            await createApprovalMappingPage.selectStatusMappingError('Canceled');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            expect(await editApprovalMappingPage.isTaskCreatedUsingTemplateGoInApprovalToggleDisplayed()).toBeFalsy('Approval Without Task Templates toggle btn displayed.');
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(taskApprovalMappingStr);
            expect(await editApprovalMappingPage.getSelectedCompany()).toBe('Petramco');
            expect(await editApprovalMappingPage.getSelectedStatusTriggerOption()).toBe('Assigned');
            expect(await editApprovalMappingPage.getStatusMappingApprovedOption()).toBe('In Progress');
            expect(await editApprovalMappingPage.getSatusMappingNoApprovalFoundOption()).toBe('Assigned');
            expect(await editApprovalMappingPage.getStatusMappingRejectedOption()).toBe('Approval Rejected');
            expect(await editApprovalMappingPage.getStatusMappingErrorOption()).toBe('Canceled');
            expect(await editApprovalMappingPage.isTaskCreatedUsingTemplateGoInApprovalToggleDisplayed()).toBeTruthy('Approval Without Task Templates toggle btn not displayed.');
            expect(await editApprovalMappingPage.isTaskCreatedUsingTemplateGoInApprovalToggleFalse()).toBeTruthy('Approval Without Task Templates toggle default option is not set to false.');
            await editApprovalMappingPage.searchTaskTemplate(manualTaskTemplateData.templateName);
            await editApprovalMappingPage.selectTaskTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectTaskTemplateforApprovalLeftArrawBtnEnabled()).toBeFalsy('Left Arrow button to select task template is disabled');
            await editApprovalMappingPage.clickTaskTemplateforApprovalRightArrawBtn();
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });

        it('[3411]: Verify task approval mapping details with respect to case manager permission', async () => {
            await navigationPage.signOut();
            await loginPage.login("qdu");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approval Mappings', BWF_PAGE_TITLES.TASK_MANAGEMENT.APPROVALS);
            expect(await approvalMappingConsolePage.isCreateApprovalMappingButtonDisplayed()).toBeFalsy('Create Approval Mapping Button is displayed.');
            await utilityGrid.searchAndOpenHyperlink(taskApprovalMappingStr);
            expect(await editApprovalMappingPage.isApprovalMappingNameDisabled()).toBeTruthy('Approval Mapping Name is editable');
            expect(await editApprovalMappingPage.isDropdownDisabled('Company')).toBeTruthy('Company dropdown is editable');
            expect(await editApprovalMappingPage.isDropdownDisabled('StatusTrigger')).toBeTruthy('StatusTrigger dropdown is editable');
            expect(await editApprovalMappingPage.isDropdownDisabled('StatusApproved')).toBeTruthy('StatusApproved dropdown is editable');
            expect(await editApprovalMappingPage.isDropdownDisabled('StatusNoApproverFound')).toBeTruthy('StatusNoApproverFound dropdown is editable');
            expect(await editApprovalMappingPage.isDropdownDisabled('StatusReject')).toBeTruthy('StatusReject dropdown is editable');
            expect(await editApprovalMappingPage.isDropdownDisabled('StatusError')).toBeTruthy('StatusError dropdown is editable');
            expect(await editApprovalMappingPage.isTasksCreatedWithoutTemplateToggleDisabled()).toBeTruthy('TasksCreatedWithoutTemplateToggleButton is editable');
            await editApprovalMappingPage.searchTaskTemplate(autoTaskTemplateData.templateName);
            await editApprovalMappingPage.selectTaskTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectTaskTemplateforApprovalRightArrawBtnEnabled()).toBeFalsy('Task template can be associated');
            await editApprovalMappingPage.searchAssociatedTaskTemplate(manualTaskTemplateData.templateName);
            await editApprovalMappingPage.selectAssociatedTaskTemplateCheckbox();
            expect(await editApprovalMappingPage.isSelectTaskTemplateforApprovalLeftArrawBtnEnabled()).toBeFalsy('Task template can be dissociated');
            expect(await editApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy('Save button is enabled');
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });

        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(taskModule);
        });
    });
}); 
