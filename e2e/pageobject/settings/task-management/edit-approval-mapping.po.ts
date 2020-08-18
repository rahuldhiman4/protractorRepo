import { $, $$, protractor, ProtractorExpectedConditions } from 'protractor';
import utilCommon from "../../../utils/util.common";

class EditApprovalMapping {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editApprovalMappingHeading: '.modal-header h3',
        approvalMappingName: '[rx-view-component-id="5c55018a-ee92-40bf-b501-0b165e12e6ea"] .d-textfield__input',
        approvalMappingNameField: '[rx-view-component-id="5c55018a-ee92-40bf-b501-0b165e12e6ea"] input',
        approvalMappingNameGuid: '5c55018a-ee92-40bf-b501-0b165e12e6ea',
        companyGuid: 'c890cbd8-561e-4299-afd4-6abc79bed924',
        statusTriggerDropDownGuid: 'a5f872e6-0382-46b9-bfb6-8c09dc584b80',
        statusMappingApproved: '5428d9e1-4fb8-475c-8139-1e604e3d3c8d',
        statusMappingNoApprovalFound: '13ca95fb-771f-43cd-8514-f2e2d6a4e236',
        statusMappingRejected: 'd-2f2513d-919f-4a15-851e-b75ff53797f1',
        statusMappingError: '581eeeb0-2bbb-4a16-91fd-e1babce7b121',
        companyDropDown: '[rx-view-component-id="c890cbd8-561e-4299-afd4-6abc79bed924"] .ui-select-match-text',
        statusTriggerDropDownField: '[rx-view-component-id="a5f872e6-0382-46b9-bfb6-8c09dc584b80"] .ui-select-match-text',
        statusMappingApprovedDropDownField: '[rx-view-component-id="5428d9e1-4fb8-475c-8139-1e604e3d3c8d"] .ui-select-match-text',
        statusMappingNoApprovalFoundDropDownField: '[rx-view-component-id="13ca95fb-771f-43cd-8514-f2e2d6a4e236"] .ui-select-match-text',
        statusMappingRejectedDropDownField: '[rx-view-component-id="d-2f2513d-919f-4a15-851e-b75ff53797f1"] .ui-select-match-text',
        statusMappingErrorDropDownField: '[rx-view-component-id="581eeeb0-2bbb-4a16-91fd-e1babce7b121"] .ui-select-match-text',
        approvalTriggerProcessHelptext: '[rx-view-component-id="b09113c8-aea8-4207-b5a9-20589fb7bf81"] span',
        saveButton: '[rx-view-component-id="e45457ac-b932-42f9-b44c-12c113234907"] button',
        cancelButton: '[rx-view-component-id="a18a6162-4769-4eba-b544-2cf7714193ec"] button',
        caseTemplateSelectionHelpText: '[rx-view-component-id="737a879c-2e55-40b4-adf1-54f1fcaab444"] p',
        caseTemplateLabel: '[rx-view-component-id="07719c40-1bd5-4bb3-bc0a-63df14893a90"] .bottom-margin',
        selectCaseTemplateInputField: '[rx-view-component-id="07719c40-1bd5-4bb3-bc0a-63df14893a90"] input',
        selectCaseTemplateBtn: 'button.d-icon-arrow_right',
        deselectCaseTemplateBtn: 'button.d-icon-arrow_left',
        searchedCaseTemplateText: '.km-group-list-item__info .title span',
        selectCaseTemplate: 'div .d-icon-square_o',
        caseTemplateSelectionArea: '.list-container',
        searchedCaseTemplatesRecords: '.record-list-item',
        casesCreatedWithoutTemplateToggleBtnGuid: '0a3df2cb-8645-4eac-8edf-4846c82c81e7'
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
        await utilCommon.selectDropDown(this.selectors.companyGuid, company);
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
            default: {
                console.log('Drop down values does not match');
                break;
            }
        }
        let locator = `[rx-view-component-id="${dropDownGuid}"] .ui-select-toggle`;
        return await $(locator).getAttribute("disabled") == "true" ? true : false;
    }

    async isCasesCreatedWithoutTemplateToggleDisabled(): Promise<boolean> {
        let locator: string = `[rx-view-component-id="${this.selectors.casesCreatedWithoutTemplateToggleBtnGuid}"] rx-boolean`;
        return await $(locator).getAttribute("disabled") == "true" ? true : false;
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
        await utilCommon.selectDropDown(this.selectors.statusTriggerDropDownGuid, approvalStatusTrigger);
    }

    async selectStatusMappingApproved(approvedStatusMapping: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusMappingApproved, approvedStatusMapping);
    }

    async selectStatusMappingNoApprovalFound(NoApprovalFoundStatusMapping: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusMappingNoApprovalFound, NoApprovalFoundStatusMapping);
    }

    async selectStatusMappingRejected(rejectedStatusMapping: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusMappingRejected, rejectedStatusMapping);
    }

    async selectStatusMappingError(errorStatusMapping: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusMappingError, errorStatusMapping);
    }

    async isStatusTriggerDropDownOptionsMatches(approvalStatusTrigger: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.statusTriggerDropDownGuid, approvalStatusTrigger);
    }

    async isStatusMappingApprovedDropDownOptionsMatches(approvedStatusMapping: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.statusMappingApproved, approvedStatusMapping);
    }

    async isStatusMappingNoApprovalFoundDropDownOptionsMatches(NoApprovalFoundStatusMapping: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.statusMappingNoApprovalFound, NoApprovalFoundStatusMapping);
    }

    async isStatusMappingRejectedDropDownOptionsMatches(rejectedStatusMapping: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.statusMappingRejected, rejectedStatusMapping);
    }

    async isStatusMappingErrorDropDownOptionsMatches(errorStatusMapping: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.statusMappingError, errorStatusMapping);
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

    async getCaseTemplateSelectionHelpText(): Promise<string> {
        return await $(this.selectors.caseTemplateSelectionHelpText).getText();
    }

    async getCaseTemplateLabel(): Promise<string> {
        return await $$(this.selectors.caseTemplateLabel).first().getText();
    }

    async getSelectedCaseTemplateLabel(): Promise<string> {
        return await $$(this.selectors.caseTemplateLabel).last().getText();
    }

    async searchCaseTemplate(caseTemplateTitle: string): Promise<void> {
        await $$(this.selectors.selectCaseTemplateInputField).first().clear();
        await $$(this.selectors.selectCaseTemplateInputField).first().sendKeys(caseTemplateTitle);
    }

    async searchAssociatedCaseTemplate(caseTemplateTitle: string): Promise<void> {
        await $$(this.selectors.selectCaseTemplateInputField).last().clear();
        await $$(this.selectors.selectCaseTemplateInputField).last().sendKeys(caseTemplateTitle);
    }

    async isSelectCaseTemplateforApprovalRightArrawBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.selectCaseTemplateBtn).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.selectCaseTemplateBtn).getAttribute("disabled") == "disabled";
            else return false;
        });
    }

    async isSelectCaseTemplateforApprovalLeftArrawBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.deselectCaseTemplateBtn).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.deselectCaseTemplateBtn).getAttribute("disabled") == "disabled";
            else return false;
        });
    }

    async clickCaseTemplateforApprovalRightArrawBtn(): Promise<void> {
        await $(this.selectors.selectCaseTemplateBtn).click();
    }

    async clickCaseTemplateforApprovalLeftArrawBtn(): Promise<void> {
        await $(this.selectors.deselectCaseTemplateBtn).click();
    }

    async getSearchedCaseTemplate(): Promise<string> {
        return await $$(this.selectors.caseTemplateSelectionArea).first().$(this.selectors.searchedCaseTemplateText).getText();
    }

    async getAssociatedCaseTemplate(): Promise<string> {
        return await $$(this.selectors.caseTemplateSelectionArea).last().$(this.selectors.searchedCaseTemplateText).getText();
    }

    async isSearchedCaseTemplateDisplayed(): Promise<boolean> {
        return await $$(this.selectors.caseTemplateSelectionArea).first().$(this.selectors.searchedCaseTemplateText).isPresent().then(async (result) => {
            if (result) return await $$(this.selectors.caseTemplateSelectionArea).first().$(this.selectors.searchedCaseTemplateText).isDisplayed();
            else return false;
        });
    }

    async isSearchedAssociatedCaseTemplateDisplayed(): Promise<boolean> {
        return await $$(this.selectors.caseTemplateSelectionArea).last().$(this.selectors.searchedCaseTemplateText).isPresent().then(async (result) => {
            if (result) return await $$(this.selectors.caseTemplateSelectionArea).last().$(this.selectors.searchedCaseTemplateText).isDisplayed();
            else return false;
        });
    }

    async selectCaseTemplateCheckbox(): Promise<void> {
        await $$(this.selectors.caseTemplateSelectionArea).first().$(this.selectors.selectCaseTemplate).click();
    }

    async selectMultipleCaseTemplateCheckbox(): Promise<void> {
        let noOfRecords = await $$(this.selectors.caseTemplateSelectionArea).first().$$(this.selectors.searchedCaseTemplatesRecords).count();
        for (let i = 0; i < noOfRecords; i++) {
            await $$(this.selectors.caseTemplateSelectionArea).first().$$(this.selectors.searchedCaseTemplatesRecords).get(i).$(this.selectors.selectCaseTemplate).click();
        }
    }

    async selectAssociatedCaseTemplateCheckbox(): Promise<void> {
        await $$(this.selectors.caseTemplateSelectionArea).last().$(this.selectors.selectCaseTemplate).click();
    }
}

export default new EditApprovalMapping();
