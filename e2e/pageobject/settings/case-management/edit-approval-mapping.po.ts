import { $, $$, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityCommon from "../../../utils/utility.common";

class EditApprovalMapping {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editApprovalMappingHeading: '.modal-header h3',
        approvalMappingName: '[rx-view-component-id="e61d8b24-3856-4757-b331-6586df50d2fb"] .d-textfield__input',
        approvalMappingNameField: '[rx-view-component-id="e61d8b24-3856-4757-b331-6586df50d2fb"] input',
        approvalMappingNameGuid: 'e61d8b24-3856-4757-b331-6586df50d2fb',
        companyGuid: 'de24ae3b-7dff-44b6-8ad1-4753fb3e7317',
        flowsetGuid: 'e21aa42f-8382-4607-80eb-43fa0a729965',
        statusTriggerDropDownGuid: '4df61be6-76a3-415c-a019-326402c27320',
        statusMappingApproved: '5e2c3279-0fdc-457e-b7dd-613030158ea9',
        statusMappingNoApprovalFound: '36141aed-2601-46d4-ab38-57b7089000c1',
        statusMappingRejected: 'e02a5522-d4a3-4f69-b013-ed1ac509bf18',
        statusMappingError: 'e75c4fc5-e1ec-43c5-8b10-9eeff5414ba8',
        companyDropDown: '[rx-view-component-id="de24ae3b-7dff-44b6-8ad1-4753fb3e7317"] .ui-select-match-text',
        flowsetDropDown: '[rx-view-component-id="e21aa42f-8382-4607-80eb-43fa0a729965"] .ui-select-match-text',
        statusTriggerDropDownField: '[rx-view-component-id="4df61be6-76a3-415c-a019-326402c27320"] .ui-select-match-text',
        statusMappingApprovedDropDownField: '[rx-view-component-id="5e2c3279-0fdc-457e-b7dd-613030158ea9"] .ui-select-match-text',
        statusMappingNoApprovalFoundDropDownField: '[rx-view-component-id="36141aed-2601-46d4-ab38-57b7089000c1"] .ui-select-match-text',
        statusMappingRejectedDropDownField: '[rx-view-component-id="e02a5522-d4a3-4f69-b013-ed1ac509bf18"] .ui-select-match-text',
        statusMappingErrorDropDownField: '[rx-view-component-id="e75c4fc5-e1ec-43c5-8b10-9eeff5414ba8"] .ui-select-match-text',
        approvalTriggerProcessHelptext: '[rx-view-component-id="4d837936-df13-4d15-8c7f-d2b7f6991249"] span',
        approvalMappingFields: '1e161c6a-3b3d-42c3-8119-83207d9fbbc0',
        saveButton: '[rx-view-component-id="4d180221-3ec2-4cda-a122-afbc1380c156"] button',
        cancelButton: '[rx-view-component-id="da40842c-69c6-41ec-8871-0db58e48eb44"] button',
        caseTemplateSelectionHelpText: '[rx-view-component-id="4f699ae0-5f65-461d-b8d3-f2a247781674"] p',
        caseTemplateLabel: '[rx-view-component-id="64e986dc-0751-41f9-864a-7bf8c54fb0ad"] .bottom-margin',
        selectCaseTemplateInputField: '[rx-view-component-id="64e986dc-0751-41f9-864a-7bf8c54fb0ad"] input',
        selectCaseTemplateBtn: 'button.d-icon-arrow_right',
        deselectCaseTemplateBtn: 'button.d-icon-arrow_left',
        searchedCaseTemplateText: '.km-group-list-item__info .title span',
        selectCaseTemplate: 'div .d-icon-square_o',
        caseTemplateSelectionArea: '.list-container',
        searchedCaseTemplatesRecords: '.record-list-item',
        casesCreatedWithoutTemplateToggleBtnGuid: '3e737bb6-57aa-48e3-8a0c-993d9d2f6643',
        lobValue: '[rx-view-component-id="a8ef078e-4681-420b-acbb-2c4aaebcf5bc"] .pull-left'
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
            case "Flowset": {
                dropDownGuid = this.selectors.flowsetGuid;
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
        let locator = `[rx-view-component-id="${dropDownGuid}"] button`;
        return await $(locator).getAttribute("disabled") == "true" ? true : false;
    }

    async isCasesCreatedWithoutTemplateToggleDisabled(): Promise<boolean> {
        let locator: string = `[rx-view-component-id="${this.selectors.casesCreatedWithoutTemplateToggleBtnGuid}"] rx-boolean button`;
        return await $(locator).getAttribute("disabled") == "true" ? true : false;
    }

    async selectFlowset(flowset: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.flowsetGuid, flowset);
    }

    async getSelectedCompany(): Promise<string> {
        return await $(this.selectors.companyDropDown).getText();
    }

    async getSelectedFlowset(): Promise<string> {
        return await $(this.selectors.flowsetDropDown).getText();
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

    async isSelectFlowsetDropDownOptionsMatches(flowsetValues: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.flowsetGuid, flowsetValues);
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

    async isCaseCreatedUsingTemplateGoInApprovalToggleFalse(): Promise<boolean> {
        const togglebutton = await $(`[rx-view-component-id="${this.selectors.casesCreatedWithoutTemplateToggleBtnGuid}"]`);
        let enableButton = await togglebutton.$('.d-icon-check').getAttribute('aria-pressed');
        let disableButton = await togglebutton.$('.d-icon-circle_slash_o').getAttribute('aria-pressed');
        return enableButton == 'false' && disableButton == 'true';
    }

    async isCaseCreatedUsingTemplateGoInApprovalToggleDisplayed(): Promise<boolean> {
        return await $(`[rx-view-component-id="${this.selectors.casesCreatedWithoutTemplateToggleBtnGuid}"]`).isPresent().then(async (present) => {
            if (present) return await $(`[rx-view-component-id="${this.selectors.casesCreatedWithoutTemplateToggleBtnGuid}"]`).isDisplayed();
            else return false;
        });
    }

    async setCaseCreatedUsingTemplateGoInApprovalToggle(enable: boolean): Promise<void> {
        await utilityCommon.selectToggleButton(this.selectors.casesCreatedWithoutTemplateToggleBtnGuid, enable);
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new EditApprovalMapping();
