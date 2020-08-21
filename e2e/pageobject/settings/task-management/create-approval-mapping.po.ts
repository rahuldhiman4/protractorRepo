import { $, protractor, ProtractorExpectedConditions, $$, browser, element, by } from 'protractor';
import utilCommon from "../../../utils/util.common";
import utilityCommon, { Utility } from '../../../utils/utility.common';

class CreateApprovalMapping {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addApprovalMappingHeading: '.modal-header h3',
        approvalMappingName: '[rx-view-component-id="86933daf-d87a-48cf-8982-5690071e9520"] input',
        approvalMappingNameGuid: '86933daf-d87a-48cf-8982-5690071e9520',
        companyGuid: '2e61e83b-6c0d-4fc4-a1e3-0033e3b6b3f8',
        flowsetGuid: '4aa6b6a8-265a-4878-991e-17ddb5eb988d',
        statusTriggerDropDownGuid: 'ab9cc9a1-5378-4b87-9528-2ac335d96c5d',
        statusMappingApproved: '73b32621-443a-4a5d-85f8-24ddbb7b04cd',
        statusMappingNoApprovalFound: 'ef7ac4b8-4390-4592-a339-101589159723',
        statusMappingRejected: 'cb4738c5-5cd6-4c79-8e28-a218d99d5b3b',
        statusMappingError: '143bcfe5-e944-4f10-a8db-1963f1d6f33e',
        statusTriggerDropDownField: '[rx-view-component-id="ab9cc9a1-5378-4b87-9528-2ac335d96c5d"] .ui-select-match',
        statusMappingApprovedDropDownField: '[rx-view-component-id="73b32621-443a-4a5d-85f8-24ddbb7b04cd"] .ui-select-match',
        statusMappingNoApprovalFoundDropDownField: '[rx-view-component-id="ef7ac4b8-4390-4592-a339-101589159723"] .ui-select-match',
        statusMappingRejectedDropDownField: '[rx-view-component-id="cb4738c5-5cd6-4c79-8e28-a218d99d5b3b"] .ui-select-match',
        statusMappingErrorDropDownField: '[rx-view-component-id="143bcfe5-e944-4f10-a8db-1963f1d6f33e"] .ui-select-match',
        statusTriggerDefaultOption: '[rx-view-component-id="-2f9c4984-390f-4102-80a4-2eed61be6dd4"] .ui-select-match-text',
        approvalTriggerProcessHelptext: '[rx-view-component-id="10a63757-5a20-470f-aac5-431a85386cb8"] p',
        statusMappingHelptext: '[rx-view-component-id="9dbe82a9-9d21-4b9b-b0dc-372b96012da0"] p',
        statusMappingLabel: '[rx-view-component-id="51edb934-10a6-458a-80d4-7ed53bc97cb4"] p',
        approvalMappingFields: '9c37e30b-1bef-41f6-835f-b0d76cf29871',
        saveButton: '[rx-view-component-id="dcb1482a-6422-4987-b6d6-94f8db2e27b3"] button',
        cancelButton: '[rx-view-component-id="cd150abf-af19-4f16-9ad2-f28fc580a29e"] button'
    }

    async getCreateApprovalMappingHeaderText(): Promise<string> {
        return await $(this.selectors.addApprovalMappingHeading).getText();
    }

    async getApprovalMappingStatusTriggerMessage(): Promise<string> {
        return await $(this.selectors.approvalTriggerProcessHelptext).getText();
    }

    async getApprovalMappingStatusMappingLabelText(): Promise<string> {
        return await $(this.selectors.statusMappingLabel).getText();
    }

    async getApprovalMappingStatusMappingMessage(): Promise<string> {
        return await $(this.selectors.statusMappingHelptext).getText();
    }

    async setApprovalMappingName(approvalMappingName: string): Promise<void> {
        await $(this.selectors.approvalMappingName).clear();
        await $(this.selectors.approvalMappingName).sendKeys(approvalMappingName);
    }

    async isApprovalMappingFieldDisplayed(approvalMappingFieldLabel: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.approvalMappingFields, approvalMappingFieldLabel);
    }

    async isApprovalMappingStatusTriggerFieldDisplayed(approvalMappingFieldLabel: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.statusTriggerDropDownGuid, approvalMappingFieldLabel);
    }

    async isApprovalMappingNameFieldMandatory(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.approvalMappingNameGuid);
    }

    async isCompanyFieldMandatory(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isFlowsetFieldMandatory(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.flowsetGuid);
    }

    async isStatusTriggerFieldMandatory(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.statusTriggerDropDownGuid);
    }

    async isStatusMappingApprovedFieldMandatory(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.statusMappingApproved);
    }
    async isStatusMappingNoApproverFoundFieldMandatory(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.statusMappingNoApprovalFound);
    }
    async isStatusMappingRejectedFieldMandatory(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.statusMappingRejected);
    }
    async isStatusMappingErrorFieldMandatory(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.statusMappingError);
    }

    async getDefaultSelectedStatusTriggerOption():Promise<string>{
       return await $(this.selectors.statusTriggerDefaultOption).getText();
    }

    async selectCompany(company: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async selectFlowset(flowset: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.flowsetGuid, flowset);
    }

    async clickStatusTriggerDropDown(): Promise<void> {
        await $(this.selectors.statusTriggerDropDownField).click();
    }

    async clickStatusMappingApprovedDropDown(): Promise<void> {
        await $(this.selectors.statusMappingApprovedDropDownField).click();
    }

    async clickStatusMappingNoApprovalFoundDropDown(): Promise<void> {
        await $(this.selectors.statusMappingNoApprovalFoundDropDownField).click();
    }

    async clickStatusMappingRejectedDropDown(): Promise<void> {
        await $(this.selectors.statusMappingRejectedDropDownField).click();
    }

    async clickStatusMappingErrorDropDown(): Promise<void> {
        await $(this.selectors.statusMappingErrorDropDownField).click();
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

}

export default new CreateApprovalMapping();
