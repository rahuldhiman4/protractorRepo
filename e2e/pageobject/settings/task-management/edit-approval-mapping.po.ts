import { $, $$, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityCommon from "../../../utils/utility.common";

class EditApprovalMapping {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editApprovalMappingHeading: '.dp-header .dp-title',
        approvalMappingName: '[rx-view-component-id="5c55018a-ee92-40bf-b501-0b165e12e6ea"] input',
        approvalMappingNameField: '[rx-view-component-id="5c55018a-ee92-40bf-b501-0b165e12e6ea"] input',
        approvalMappingNameGuid: '5c55018a-ee92-40bf-b501-0b165e12e6ea',
        companyGuid: 'c890cbd8-561e-4299-afd4-6abc79bed924',
        statusTriggerDropDownGuid: 'a5f872e6-0382-46b9-bfb6-8c09dc584b80',
        statusMappingApproved: '5428d9e1-4fb8-475c-8139-1e604e3d3c8d',
        statusMappingNoApprovalFound: '13ca95fb-771f-43cd-8514-f2e2d6a4e236',
        statusMappingRejected: 'd8f2513d-919f-4a15-851e-b75ff53797f1',
        statusMappingError: '581eeeb0-2bbb-4a16-91fd-e1babce7b121',
        companyDropDown: '[rx-view-component-id="c890cbd8-561e-4299-afd4-6abc79bed924"] button',
        statusTriggerDropDownField: '[rx-view-component-id="a5f872e6-0382-46b9-bfb6-8c09dc584b80"] button',
        statusMappingApprovedDropDownField: '[rx-view-component-id="5428d9e1-4fb8-475c-8139-1e604e3d3c8d"] button',
        statusMappingNoApprovalFoundDropDownField: '[rx-view-component-id="13ca95fb-771f-43cd-8514-f2e2d6a4e236"] button',
        statusMappingRejectedDropDownField: '[rx-view-component-id="d8f2513d-919f-4a15-851e-b75ff53797f1"] button',
        statusMappingErrorDropDownField: '[rx-view-component-id="581eeeb0-2bbb-4a16-91fd-e1babce7b121"] button',
        approvalTriggerProcessHelptext: '[rx-view-component-id="b09113c8-aea8-4207-b5a9-20589fb7bf81"] span',
        saveButton: '[rx-view-component-id="e45457ac-b932-42f9-b44c-12c113234907"] button',
        cancelButton: '[rx-view-component-id="a18a6162-4769-4eba-b544-2cf7714193ec"] button',
        taskTemplateSelectionHelpText: '[rx-view-component-id="737a879c-2e55-40b4-adf1-54f1fcaab444"] p',
        taskTemplateLabel: '[rx-view-component-id="07719c40-1bd5-4bb3-bc0a-63df14893a90"] .bwf-label',
        selectTaskTemplateInputField: '[rx-view-component-id="07719c40-1bd5-4bb3-bc0a-63df14893a90"] .adapt-search-field-wrapper input',
        selectDeselectTaskTemplateBtn: '.bwf-association-actions .btn-secondary',
        searchedTaskTemplateText: '.list-item-active',
        selectTaskTemplate: 'input.checkbox__input',
        taskTemplateSelectionArea: 'div.bwf-association-list',
        searchedTaskTemplatesRecords: 'list-group-item',
        tasksCreatedWithoutTemplateToggleBtnGuid: '0a3df2cb-8645-4eac-8edf-4846c82c81e7',
        taskApprovalMappingToggleBtnHelpText: '[rx-view-component-id="7df649b3-ec1b-4a9d-af4e-4c8f426a036a"] p',
        selectCaseTemplateBtn: 'button .d-icon-arrow_right',
        deselectCaseTemplateBtn: 'button .d-icon-arrow_left',
    }

    async getEditApprovalMappingHeaderText(): Promise<string> {
        return await $(this.selectors.editApprovalMappingHeading).getText();
    }

    async getApprovalMappingName(): Promise<string> {
        return await $(this.selectors.approvalMappingName).getAttribute("value");
    }

    async setApprovalMappingName(approvalMappingNameValue: string): Promise<void> {
        await $(this.selectors.approvalMappingNameField).clear();
        await $(this.selectors.approvalMappingNameField).sendKeys(approvalMappingNameValue);
    }

    async selectCompany(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async isApprovalMappingNameDisabled(): Promise<boolean> {
        return await $(this.selectors.approvalMappingNameField).getAttribute("readonly") == "true" ? true : false;
    }

    async isDropdownDisabled(dropdownName: string): Promise<boolean> {
        let dropDownGuid: string;
        switch (dropdownName) {
            case "Company": {
                dropDownGuid = this.selectors.companyGuid;
                break;
            }
            case "StatusTrigger": {
                dropDownGuid = this.selectors.statusTriggerDropDownGuid;
                break;
            }
            case "StatusApproved": {
                dropDownGuid = this.selectors.statusMappingApproved;
                break;
            }
            case "StatusReject": {
                dropDownGuid = this.selectors.statusMappingRejected;
                break;
            }
            case "StatusNoApproverFound": {
                dropDownGuid = this.selectors.statusMappingNoApprovalFound;
                break;
            }
            case "StatusError": {
                dropDownGuid = this.selectors.statusMappingError;
                break;
            }
            default: {
                console.log('Drop down values does not match');
                break;
            }
        }
        let locator = `[rx-view-component-id="${dropDownGuid}"] .disabled, [rx-view-component-id="${dropDownGuid}"] button[disabled]`;
        return await $(locator).isPresent();
    }

    async isTasksCreatedWithoutTemplateToggleDisabled(): Promise<boolean> {
        let locator: string = `[rx-view-component-id="${this.selectors.tasksCreatedWithoutTemplateToggleBtnGuid}"] .disabled`;
        return await $(locator).isPresent();
    }

    async getSelectedCompany(): Promise<string> {
        return await $(this.selectors.companyDropDown).getText();
    }

    async getSelectedStatusTriggerOption(): Promise<string> {
        return await $(this.selectors.statusTriggerDropDownField).getText();
    }

    async getStatusMappingApprovedOption(): Promise<string> {
        return await $(this.selectors.statusMappingApprovedDropDownField).getText();
    }

    async getSatusMappingNoApprovalFoundOption(): Promise<string> {
        return await $(this.selectors.statusMappingNoApprovalFoundDropDownField).getText();
    }

    async getStatusMappingRejectedOption(): Promise<string> {
        return await $(this.selectors.statusMappingRejectedDropDownField).getText();
    }

    async getStatusMappingErrorOption(): Promise<string> {
        return await $(this.selectors.statusMappingErrorDropDownField).getText();
    }

    async selectStatusTrigger(approvalStatusTrigger: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusTriggerDropDownGuid, approvalStatusTrigger);
    }

    async selectStatusMappingApproved(approvedStatusMapping: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusMappingApproved, approvedStatusMapping);
    }

    async selectStatusMappingNoApprovalFound(NoApprovalFoundStatusMapping: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusMappingNoApprovalFound, NoApprovalFoundStatusMapping);
    }

    async selectStatusMappingRejected(rejectedStatusMapping: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusMappingRejected, rejectedStatusMapping);
    }

    async selectStatusMappingError(errorStatusMapping: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusMappingError, errorStatusMapping);
    }

    async isStatusTriggerDropDownOptionsMatches(approvalStatusTrigger: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.statusTriggerDropDownGuid, approvalStatusTrigger);
    }

    async isStatusMappingApprovedDropDownOptionsMatches(approvedStatusMapping: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.statusMappingApproved, approvedStatusMapping);
    }

    async isStatusMappingNoApprovalFoundDropDownOptionsMatches(NoApprovalFoundStatusMapping: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.statusMappingNoApprovalFound, NoApprovalFoundStatusMapping);
    }

    async isStatusMappingRejectedDropDownOptionsMatches(rejectedStatusMapping: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.statusMappingRejected, rejectedStatusMapping);
    }

    async isStatusMappingErrorDropDownOptionsMatches(errorStatusMapping: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.statusMappingError, errorStatusMapping);
    }

    async isSaveApprovalMappingBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.saveButton).getAttribute("disabled") == "disabled";
            else return false;
        });
    }

    async clickSaveApprovalMappingBtn(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickCancelApprovalMappingBtn(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async getTaskTemplateSelectionHelpText(): Promise<string> {
        return await $(this.selectors.taskTemplateSelectionHelpText).getText();
    }

    async getTaskTemplateLabel(): Promise<string> {
        return await $$(this.selectors.taskTemplateLabel).first().getText();
    }

    async getSelectedTaskTemplateLabel(): Promise<string> {
        return await $$(this.selectors.taskTemplateLabel).last().getText();
    }

    async searchTaskTemplate(taskTemplateTitle: string): Promise<void> {
        await $$(this.selectors.selectTaskTemplateInputField).first().clear();
        await $$(this.selectors.selectTaskTemplateInputField).first().sendKeys(taskTemplateTitle);
    }

    async searchAssociatedTaskTemplate(taskTemplateTitle: string): Promise<void> {
        await $$(this.selectors.selectTaskTemplateInputField).last().clear();
        await $$(this.selectors.selectTaskTemplateInputField).last().sendKeys(taskTemplateTitle);
    }

    async isSelectTaskTemplateforApprovalRightArrawBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.selectCaseTemplateBtn).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.selectCaseTemplateBtn).getAttribute("disabled") == "disabled";
            else return false;
        });
    }

    async isSelectTaskTemplateforApprovalLeftArrawBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.deselectCaseTemplateBtn).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.deselectCaseTemplateBtn).getAttribute("disabled") == "disabled";
            else return false;
        });
    }

    async clickTaskTemplateforApprovalRightArrawBtn(): Promise<void> {
        await $(this.selectors.selectCaseTemplateBtn).click();
    }

    async clickTaskTemplateforApprovalLeftArrawBtn(): Promise<void> {
        await $(this.selectors.deselectCaseTemplateBtn).click();
    }

    async getSearchedTaskTemplate(): Promise<string> {
        return await $$(this.selectors.taskTemplateSelectionArea).first().$(this.selectors.searchedTaskTemplateText).getText();
    }

    async getAssociatedTaskTemplate(): Promise<string> {
        return await $$(this.selectors.taskTemplateSelectionArea).last().$(this.selectors.searchedTaskTemplateText).getText();
    }

    async isSearchedTaskTemplateDisplayed(): Promise<boolean> {
        return await $$(this.selectors.taskTemplateSelectionArea).first().$(this.selectors.searchedTaskTemplateText).isPresent().then(async (result) => {
            if (result) return await $$(this.selectors.taskTemplateSelectionArea).first().$(this.selectors.searchedTaskTemplateText).isDisplayed();
            else return false;
        });
    }

    async isSearchedAssociatedTaskTemplateDisplayed(): Promise<boolean> {
        return await $$(this.selectors.taskTemplateSelectionArea).last().$(this.selectors.searchedTaskTemplateText).isPresent().then(async (result) => {
            if (result) return await $$(this.selectors.taskTemplateSelectionArea).last().$(this.selectors.searchedTaskTemplateText).isDisplayed();
            else return false;
        });
    }

    async selectTaskTemplateCheckbox(): Promise<void> {
        await $$(this.selectors.taskTemplateSelectionArea).first().$(this.selectors.selectTaskTemplate).click();
    }

    async selectMultipleTaskTemplateCheckbox(): Promise<void> {
        let noOfRecords = await $$(this.selectors.taskTemplateSelectionArea).first().$$(this.selectors.searchedTaskTemplatesRecords).count();
        for (let i = 0; i < noOfRecords; i++) {
            await $$(this.selectors.taskTemplateSelectionArea).first().$$(this.selectors.searchedTaskTemplatesRecords).get(i).$(this.selectors.selectTaskTemplate).click();
        }
    }

    async selectAssociatedTaskTemplateCheckbox(): Promise<void> {
        await $$(this.selectors.taskTemplateSelectionArea).last().$(this.selectors.selectTaskTemplate).click();
    }

    async getTaskApprovalMappingToggleBtnHelpText(): Promise<string> {
        return await $(this.selectors.taskApprovalMappingToggleBtnHelpText).getText();
    }

    async isTaskCreatedUsingTemplateGoInApprovalToggleFalse(): Promise<boolean> {
        let enableButton = await $$(`[rx-view-component-id="${this.selectors.tasksCreatedWithoutTemplateToggleBtnGuid}"] button`).first().getAttribute('aria-pressed');
        let disableButton = await $$(`[rx-view-component-id="${this.selectors.tasksCreatedWithoutTemplateToggleBtnGuid}"] button`).last().getAttribute('aria-pressed');
        return enableButton == 'false' && disableButton == 'true';
    }

    async isTaskCreatedUsingTemplateGoInApprovalToggleDisplayed(): Promise<boolean> {
        return await $(`[rx-view-component-id="${this.selectors.tasksCreatedWithoutTemplateToggleBtnGuid}"]`).isPresent().then(async (present) => {
            if (present) return await $(`[rx-view-component-id="${this.selectors.tasksCreatedWithoutTemplateToggleBtnGuid}"]`).isDisplayed();
            else return false;
        });
    }

    async setTaskCreatedUsingTemplateGoInApprovalToggle(enable: boolean): Promise<void> {
        await utilityCommon.selectToggleButton(this.selectors.tasksCreatedWithoutTemplateToggleBtnGuid, enable);
    }



}

export default new EditApprovalMapping();
