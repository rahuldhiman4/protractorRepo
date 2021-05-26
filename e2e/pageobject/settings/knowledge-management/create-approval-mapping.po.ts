import utilityCommon from '../../../utils/utility.common';
import { $, protractor, ProtractorExpectedConditions } from 'protractor';

class CreateApprovalMapping {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addApprovalMappingHeading: '.dp-header span',
        approvalMappingName: '[rx-view-component-id="8784e67e-20af-40e2-8ad7-5b388eed3449"] input',
        approvalMappingNameGuid: '8784e67e-20af-40e2-8ad7-5b388eed3449',
        companyGuid: '3f98d4b4-da85-48f6-a5d5-2c4e03d35739',
        statusTriggerDropDownGuid: '225a010c-17d7-41f8-aed4-edaa8bfda3c7',
        statusTriggerDropDown: '[rx-view-component-id="225a010c-17d7-41f8-aed4-edaa8bfda3c7"]',
        statusTriggerDropDownField: '[rx-view-component-id="225a010c-17d7-41f8-aed4-edaa8bfda3c7"] button',
        statusTriggerInputBox: '[placeholder="Filter options"]',
        statusTriggerCheckBox: '.rx-select__option-marker div.checkbox__item',
        approvalTriggerProcessHelptext: '[rx-view-component-id="4d837936-df13-4d15-8c7f-d2b7f6991249"] span',
        statusMappingHelptext: '[rx-view-component-id="9147f71b-8519-4467-8d33-535ef0d3c6cc"] p',
        statusMappingLabel: '[rx-view-component-id="04f8d9f3-c646-4c6c-b0c6-37f9ab74cc1c"] span',
        saveButton: '[rx-view-component-id="bd10b318-6a78-4ba2-9004-4f1e043b2b3c"] button',
        cancelButton: '[rx-view-component-id="feaabaa2-352c-4b2f-8e51-7c8b02bf0047"] button',
        lobValue: '[rx-view-component-id="468139c0-e0f8-4a3d-aa6d-c4c5bcb592d5"] div'
    }

    async getCreateApprovalMappingHeaderText(): Promise<string> {
        return await $(this.selectors.addApprovalMappingHeading).getText();
    }

    async getApprovalMappingStatusMappingMessage(): Promise<string> {
        return await $(this.selectors.statusMappingHelptext).getText();
    }

    async setApprovalMappingName(approvalMappingName: string): Promise<void> {
        await $(this.selectors.approvalMappingName).clear();
        await $(this.selectors.approvalMappingName).sendKeys(approvalMappingName);
    }


    async isApprovalMappingNameFieldMandatory(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.approvalMappingNameGuid);
    }

    async isCompanyFieldMandatory(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isStatusTriggerFieldMandatory(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.statusTriggerDropDownGuid);
    }

    async selectCompany(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async clickStatusTriggerDropDown(): Promise<void> {
        await $(this.selectors.statusTriggerDropDownField).click();
    }

    async selectStatusTrigger(approvalStatusTrigger: string): Promise<void> {
        const dropDown = await $(this.selectors.statusTriggerDropDown);
        const dropDownBoxElement = await dropDown.$(this.selectors.statusTriggerDropDownField);
        const dropDownInputElement = await dropDown.$(this.selectors.statusTriggerInputBox);
        const dropDownCheckboxElement = await dropDown.$(this.selectors.statusTriggerCheckBox);
        await dropDownBoxElement.click();
        await dropDownInputElement.sendKeys(approvalStatusTrigger);
        await dropDownCheckboxElement.click();
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