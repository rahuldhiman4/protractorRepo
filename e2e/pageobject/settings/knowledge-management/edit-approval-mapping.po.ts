import { $, protractor, ProtractorExpectedConditions } from 'protractor';
import utilCommon from "../../../utils/util.common";

class CreateApprovalMapping {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addApprovalMappingHeading: '.modal-header h3',
        approvalMappingName: '[rx-view-component-id="e8dba551-c9d2-4ef3-b807-e62ed7bea43b"] input',
        approvalMappingNameGuid: 'e8dba551-c9d2-4ef3-b807-e62ed7bea43b',
        companyGuid: '3977b1a0-245f-44a8-9c25-c2dc55f50daf',
        statusTriggerDropDownGuid: '5641bfb3-d68b-40dd-a0e0-3f1f6521aa8a',
        statusTriggerDropDown: '[rx-view-component-id="5641bfb3-d68b-40dd-a0e0-3f1f6521aa8a"]',
        statusTriggerDropDownField: '.rx-multiselect__trigger',
        statusTriggerInputBox: 'input.d-textfield__input',
        statusTriggerCheckBox: '.d-checkbox__item',
        approvalTriggerProcessHelptext: '[rx-view-component-id="4d837936-df13-4d15-8c7f-d2b7f6991249"] span',
        statusMappingHelptext: '[rx-view-component-id="8cb76e4f-cbe1-4eb8-8f42-2e5e94cd70e5"] p',
        statusMappingLabel: '[rx-view-component-id="b782b185-a19a-45ad-b5b3-13bf50c89e3c"] span',
        saveButton: '[rx-view-component-id="186c361c-6f73-4382-9313-90596e00d821"] button',
        cancelButton: '[rx-view-component-id="6b11932f-40d7-4843-af52-a2ede371c470"] button',
        lobValue: '[rx-view-component-id="61db57c7-292e-40f9-a577-c7f90d2d5bb1"] .pull-left'
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
        return await utilCommon.isRequiredTagToField(this.selectors.approvalMappingNameGuid);
    }

    async isCompanyFieldMandatory(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isStatusTriggerFieldMandatory(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.statusTriggerDropDownGuid);
    }

    async selectCompany(company: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyGuid, company);
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