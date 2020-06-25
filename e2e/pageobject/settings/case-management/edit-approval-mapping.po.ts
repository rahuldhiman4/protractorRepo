import { $, protractor, ProtractorExpectedConditions, $$, browser, element, by } from 'protractor';
import utilCommon from "../../../utils/util.common";
import utilityCommon, { Utility } from '../../../utils/utility.common';

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
        caseTemplateSelectionArea : '.list-container',
        searchedCaseTemplatesRecords: '.record-list-item',
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

    async selectFlowset(flowset: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.flowsetGuid, flowset);
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

    async isSelectFlowsetDropDownOptionsMatches(flowsetValues: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.flowsetGuid, flowsetValues);
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
            if (result) {
                return await $(this.selectors.saveButton).getAttribute("disabled") == "disabled";
            } else return false;
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

    async searchCaseTemplate(caseTemplateTitle:string): Promise<void> {
        await $$(this.selectors.selectCaseTemplateInputField).first().clear();
        await $$(this.selectors.selectCaseTemplateInputField).first().sendKeys(caseTemplateTitle);
    }

    async searchAssociatedCaseTemplate(caseTemplateTitle:string): Promise<void> {
        await $$(this.selectors.selectCaseTemplateInputField).last().clear();
        await $$(this.selectors.selectCaseTemplateInputField).last().sendKeys(caseTemplateTitle);
    }

    async isSelectCaseTemplateforApprovalRightArrawBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.selectCaseTemplateBtn).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.selectCaseTemplateBtn).getAttribute("disabled") == "disabled";
            } else return false;
        });
    }

    async isSelectCaseTemplateforApprovalLeftArrawBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.deselectCaseTemplateBtn).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.deselectCaseTemplateBtn).getAttribute("disabled") == "disabled";
            } else return false;
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

    async isSearchedCaseTemplateDisplayed():Promise<boolean>{
        return await $$(this.selectors.caseTemplateSelectionArea).first().$(this.selectors.searchedCaseTemplateText).isPresent().then(async (result) => {
            if (result) {
                return await $$(this.selectors.caseTemplateSelectionArea).first().$(this.selectors.searchedCaseTemplateText).isDisplayed();
            } else return false;
        });
    }

    async isSearchedAssociatedCaseTemplateDisplayed():Promise<boolean>{
        return await $$(this.selectors.caseTemplateSelectionArea).last().$(this.selectors.searchedCaseTemplateText).isPresent().then(async (result) => {
            if (result) {
                return await $$(this.selectors.caseTemplateSelectionArea).last().$(this.selectors.searchedCaseTemplateText).isDisplayed();
            } else return false;
        });
    }


    async selectCaseTemplateCheckbox():Promise<void>{
        await $$(this.selectors.caseTemplateSelectionArea).first().$(this.selectors.selectCaseTemplate).click();
    }

    async selectMultipleCaseTemplateCheckbox():Promise<void>{
      let  noOfRecords = await $$(this.selectors.caseTemplateSelectionArea).first().$$(this.selectors.searchedCaseTemplatesRecords).count();
        for(let i=0;i<noOfRecords;i++){
            await $$(this.selectors.caseTemplateSelectionArea).first().$$(this.selectors.searchedCaseTemplatesRecords).get(i).$(this.selectors.selectCaseTemplate).click();
        }

    }


    async selectAssociatedCaseTemplateCheckbox():Promise<void>{
        await $$(this.selectors.caseTemplateSelectionArea).last().$(this.selectors.selectCaseTemplate).click();
    }

}

export default new EditApprovalMapping();
