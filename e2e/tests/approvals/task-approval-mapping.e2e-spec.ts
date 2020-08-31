import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import approvalMappingConsolePage from "../../pageobject/settings/task-management/approval-mapping-console.po";
import createApprovalMappingPage from "../../pageobject/settings/task-management/create-approval-mapping.po";
import editApprovalMappingPage from "../../pageobject/settings/task-management/edit-approval-mapping.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';

describe("Task Approval Mapping Tests", () => {
    const approvalMappingNameStr = "Approval Mapping Name";
    const companyStr = "Company";
    const statusTriggerStr = "Status Trigger";
    const statusMappingApprovedStr = "Approved";
    const statusMappingNoApproverFoundStr = "No Approval Found";
    const statusMappingRejectedStr = "Rejected";
    const statusMappingErrorStr = "Error";
    const approvalTriggerMsg = "Approval process starts when the case has above status.";
    const approvalMappingMsg = "Mapping the result of the approval process to the task status.";
    const approvalStatusMappingLabel = "Status mapping:";
    let taskModule = 'Task';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.deleteApprovalMapping(taskModule);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[DRDMV-21582,DRDMV-22120]:[Task Approval] - Create/Update Approval Mapping', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskApprovalMappingStr = `Task Mapping ${randomStr}`;
        let manualTaskTemplateData, autoTaskTemplateData, manualTaskGlobalTemplateData, manualTaskTemplateDraftData, manualTaskTemplateInactiveData, psilonManualTaskTemplateData, manualTaskId, automatedTaskId = "";
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
                "templateName": `manualTaskTemplate ${randomStr}`,
                "templateSummary": 'Automated Approval without process for task',
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            psilonManualTaskTemplateData = {
                "templateName": `manualTaskTemplatePsilon ${randomStr}`,
                "templateSummary": 'Automated Approval without process for task',
                "templateStatus": "Active",
                "taskCompany": 'Psilon',
                "ownerCompany": "Psilon",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }

            manualTaskGlobalTemplateData = {
                "templateName": `manualTaskTemplateGlobal ${randomStr}`,
                "templateSummary": 'Automated Approval without process for task',
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            manualTaskTemplateDraftData = {
                "templateName": `manualTaskTemplateDraft ${randomStr}`,
                "templateSummary": 'Automated Approval without process for task',
                "templateStatus": "Draft",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            manualTaskTemplateInactiveData = {
                "templateName": `manualTaskTemplateInactive ${randomStr}`,
                "templateSummary": 'Automated Approval without process for task',
                "templateStatus": "Inactive",
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
            await apiHelper.createManualTaskTemplate(manualTaskGlobalTemplateData);
            await apiHelper.createManualTaskTemplate(manualTaskTemplateDraftData);
            await apiHelper.createManualTaskTemplate(manualTaskTemplateInactiveData);

            await apiHelper.apiLogin('gderuno');
            await apiHelper.createManualTaskTemplate(psilonManualTaskTemplateData);
        })

        it('[DRDMV-21582,DRDMV-22120]: Create Task Approval Mapping UI Validation', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approvals', 'Task Approval Mappings - Business Workflows');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
            await createApprovalMappingPage.setApprovalMappingName(taskApprovalMappingStr);
            await createApprovalMappingPage.selectCompany('Petramco');

            //Verify no. of fields displayed on Add Approval Mapping screen
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(approvalMappingNameStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(companyStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingStatusTriggerFieldDisplayed(statusTriggerStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(statusMappingApprovedStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(statusMappingNoApproverFoundStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(statusMappingRejectedStr)).toBeTruthy();
            expect(await createApprovalMappingPage.isApprovalMappingFieldDisplayed(statusMappingErrorStr)).toBeTruthy();

            //Verify the mandatory and optionals fields on Add Approval Mapping screen
            expect(await createApprovalMappingPage.isApprovalMappingNameFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isCompanyFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isStatusTriggerFieldMandatory()).toBeTruthy();
            expect(await createApprovalMappingPage.isStatusMappingApprovedFieldMandatory()).toBeFalsy();
            expect(await createApprovalMappingPage.isStatusMappingRejectedFieldMandatory()).toBeFalsy();
            expect(await createApprovalMappingPage.isStatusMappingNoApproverFoundFieldMandatory()).toBeFalsy();
            expect(await createApprovalMappingPage.isStatusMappingErrorFieldMandatory()).toBeFalsy();
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
        it('[DRDMV-21582,DRDMV-22120]: Create Task Approval Mapping', async () => {
            await createApprovalMappingPage.setApprovalMappingName(taskApprovalMappingStr);
            await createApprovalMappingPage.selectCompany('Petramco');
            await createApprovalMappingPage.selectStatusTrigger('Assigned');
            await createApprovalMappingPage.selectStatusMappingApproved('In Progress');
            await createApprovalMappingPage.selectStatusMappingRejected('Approval Rejected');
            await createApprovalMappingPage.selectStatusMappingNoApprovalFound('Assigned');
            await createApprovalMappingPage.selectStatusMappingError('Canceled');
            expect(await createApprovalMappingPage.isSaveApprovalMappingBtnEnabled()).toBeFalsy();
            await createApprovalMappingPage.clickSaveApprovalMappingBtn();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await editApprovalMappingPage.getApprovalMappingName()).toBe(taskApprovalMappingStr);
            expect(await editApprovalMappingPage.getSelectedCompany()).toBe('Petramco');
            expect(await editApprovalMappingPage.getSelectedStatusTriggerOption()).toBe('Assigned');
            expect(await editApprovalMappingPage.getStatusMappingApprovedOption()).toBe('In Progress');
            expect(await editApprovalMappingPage.getSatusMappingNoApprovalFoundOption()).toBe('Assigned');
            expect(await editApprovalMappingPage.getStatusMappingRejectedOption()).toBe('Approval Rejected');
            expect(await editApprovalMappingPage.getStatusMappingErrorOption()).toBe('Canceled');
        });
        it('[DRDMV-21582,DRDMV-22120]: Create Task Approval Mapping Task Template Selection Validation', async () => {
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
            await editApprovalMappingPage.clickCancelApprovalMappingBtn();
        });

        afterAll(async () => {
            await utilCommon.closeBladeOnSettings();
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteApprovalMapping(taskModule);
        });
    });

    describe('[DRDMV-22950]:[Task] Approval Mapping to configure such as Approvals to be triggered on Case created without template', () => {
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

        it('[DRDMV-22950]: Task approval mapping creation with case Business analyst permission', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approvals', 'Task Approval Mappings - Business Workflows');
            await approvalMappingConsolePage.clickCreateApprovalMappingBtn();
            expect(await createApprovalMappingPage.getCreateApprovalMappingHeaderText()).toBe('Add Approval Mapping');
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
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
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
        });

        it('[DRDMV-22950]: Verify task approval mapping details with respect to case manager permission', async () => {
            await navigationPage.signOut();
            await loginPage.login("qdu");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Approvals', 'Task Approval Mappings - Business Workflows');
            expect(await approvalMappingConsolePage.isCreateApprovalMappingButtonDisplayed()).toBeFalsy('Create Approval Mapping Button is displayed.');
            await utilGrid.searchAndOpenHyperlink(taskApprovalMappingStr);
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
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
}); 