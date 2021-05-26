import { $, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityCommon from "../../../utils/utility.common";

class CreateApprovalMapping {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addApprovalMappingHeading: '.dp-title',
        approvalMappingName: '[rx-view-component-id="a518014f-011a-4baa-ad95-6c5a3ac14f61"] input',
        approvalMappingNameGuid: 'a518014f-011a-4baa-ad95-6c5a3ac14f61',
        companyGuid: '926e74ae-fa14-4571-b823-bc2b55c22827',
        flowsetGuid: '4def2dc9-074b-4465-8e20-2f2d2324338f',
        statusTriggerDropDownGuid: '9f9c4984-390f-4102-80a4-2eed61be6dd4',
        statusMappingApproved: 'ddb86311-7b72-4a20-bd3c-847eaf89f8d3',
        statusMappingNoApprovalFound: '241dd4a2-76fd-420e-a7c9-ecfa300a33af',
        statusMappingRejected: '932b8c5d-1799-4745-ba31-dc617d55469c',
        statusMappingError: 'a6b301f9-1363-4243-b2d1-6fea650dfe83',
        statusTriggerDropDownField: '[rx-view-component-id="9f9c4984-390f-4102-80a4-2eed61be6dd4"] .dropdown-toggle',
        statusMappingApprovedDropDownField: '[rx-view-component-id="ddb86311-7b72-4a20-bd3c-847eaf89f8d3"] .dropdown-toggle',
        statusMappingNoApprovalFoundDropDownField: '[rx-view-component-id="241dd4a2-76fd-420e-a7c9-ecfa300a33af"] .dropdown-toggle',
        statusMappingRejectedDropDownField: '[rx-view-component-id="932b8c5d-1799-4745-ba31-dc617d55469c"] .dropdown-toggle',
        statusMappingErrorDropDownField: '[rx-view-component-id="a6b301f9-1363-4243-b2d1-6fea650dfe83"] .dropdown-toggle',
        statusTriggerDefaultOption: '[rx-view-component-id="-2f9c4984-390f-4102-80a4-2eed61be6dd4"] .dropdown-toggle-text',
        approvalTriggerProcessHelptext: '[rx-view-component-id="4d837936-df13-4d15-8c7f-d2b7f6991249"] span',
        statusMappingHelptext: '[rx-view-component-id="77e22859-d059-4940-bd97-775b50362b56"] p',
        statusMappingLabel: '[rx-view-component-id="df2b908d-1a52-456b-81bb-ec47d0446994"] span',
        approvalMappingFields: '1e161c6a-3b3d-42c3-8119-83207d9fbbc0',
        saveButton: '[rx-view-component-id="c86fc373-e406-4e48-9001-5571ffc1772e"] button',
        cancelButton: '[rx-view-component-id="937e9d73-4012-4b1f-bab7-a9e49e63a520"] button',
        lobValue: '[rx-view-component-id="4081af82-0528-4edf-91fc-6e966c8f4bbe"] div'
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
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.approvalMappingFields, approvalMappingFieldLabel);
    }

    async isApprovalMappingStatusTriggerFieldDisplayed(approvalMappingFieldLabel: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.statusTriggerDropDownGuid, approvalMappingFieldLabel);
    }

    async isApprovalMappingNameFieldMandatory(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.approvalMappingNameGuid);
    }

    async isCompanyFieldMandatory(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isFlowsetFieldMandatory(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.flowsetGuid);
    }

    async isStatusTriggerFieldMandatory(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.statusTriggerDropDownGuid);
    }

    async isStatusMappingApprovedFieldMandatory(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.statusMappingApproved);
    }
    async isStatusMappingNoApproverFoundFieldMandatory(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.statusMappingNoApprovalFound);
    }
    async isStatusMappingRejectedFieldMandatory(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.statusMappingRejected);
    }
    async isStatusMappingErrorFieldMandatory(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.statusMappingError);
    }

    async getDefaultSelectedStatusTriggerOption(): Promise<string> {
        return await $(this.selectors.statusTriggerDefaultOption).getText();
    }

    async selectCompany(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async selectFlowset(flowset: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.flowsetGuid, flowset);
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

    async isSelectFlowsetDropDownOptionsMatches(flowsetValues: string): Promise<boolean> {
        return await utilityCommon.isValuePresentInDropDown(this.selectors.flowsetGuid, flowsetValues);
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

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new CreateApprovalMapping();
