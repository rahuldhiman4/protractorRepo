import { $, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';
class CreateFlowset {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        companyGuid: '838b3d55-e82c-4d5e-859b-4144ad048254',
        searchIcon:'[rx-view-component-id="7fc0ca1d-6fa7-418c-826a-4a09c9dccf87"] .d-icon-search',
        searchProcessTxtbox: '[rx-view-component-id="7fc0ca1d-6fa7-418c-826a-4a09c9dccf87"] .d-textfield__input',
        selectProcess: '[rx-view-component-id="7fc0ca1d-6fa7-418c-826a-4a09c9dccf87"] .rx-definition-picker__instance-name',
        processName: '[rx-view-component-id="7fc0ca1d-6fa7-418c-826a-4a09c9dccf87"] .rx-definition-picker__fake-input',
        company: '[rx-view-component-id="838b3d55-e82c-4d5e-859b-4144ad048254"] .ui-select-toggle',
        ProcessNameGuid: '7fc0ca1d-6fa7-418c-826a-4a09c9dccf87',
        ApplicationServiceGuid: 'ec882563-a0bc-446a-ba86-12723ab22d2e',
        ApplicationService: '[rx-view-component-id="ec882563-a0bc-446a-ba86-12723ab22d2e"] .d-textfield__input',
        statusGuid: '45a46475-2f0b-403f-9cf4-0a6a69f60647',
        savebutton: '[rx-view-component-id="45fa1365-5971-459f-b22c-61de5e675745"] button',
        cancelButton: '[rx-view-component-id="4cf8efdd-2374-43fc-942c-2048c2f5f931"] button',
        status: '[rx-view-component-id="45a46475-2f0b-403f-9cf4-0a6a69f60647"] [class="ui-select-match-text pull-left"]',
        processAliasname: '[rx-view-component-id="ed363e9c-1814-4c7d-bc7e-1841ecb21c97"] input',
        processAliasGuid: 'ed363e9c-1814-4c7d-bc7e-1841ecb21c97',
        description: '[rx-view-component-id="920e06e9-5389-4e30-8c6c-74eefa0d19fb"] textarea',
        descriptionGuid: '920e06e9-5389-4e30-8c6c-74eefa0d19fb'
    }

    async isCompanyRequiredTextDisplayed(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isProcessRequiredTextDisplayed(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.ProcessNameGuid);
    }

    async isStatusRequiredTextDisplayed(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.statusGuid);
    }

    async isProcessAliasRequiredTextDisplayed(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.processAliasGuid);
    }

    async isDescriptionRequiredTextDisplayed(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.descriptionGuid);
    }

    async isCompanyTitleDisplayed(company: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.companyGuid, company);
    }

    async isProcessNameTitleDisplayed(process: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.ProcessNameGuid, process);
    }

    async isApplicationTitleDisplayed(Application: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.ApplicationServiceGuid, Application);
    }

    async isStatusTitleDisplayed(status: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.statusGuid, status);
    }

    async isProcessAliasTitleDisplayed(processAlias: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.processAliasGuid, processAlias);
    }

    async isDescriptionTitleDisplayed(description: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.descriptionGuid, description);
    }

    async selectCompany(company: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async selectProcessName(process: string): Promise<void> {
        await $(this.selectors.processName).click();
        await $(this.selectors.searchIcon).click();
        await $(this.selectors.searchProcessTxtbox).sendKeys(process);
        await element(by.cssContainingText(this.selectors.selectProcess, process)).click();
    }

    async selectApplicationService(application: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ApplicationServiceGuid, application);
    }

    async selectStatus(status: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async clickOnStatus(): Promise<void> {
        await ($(this.selectors.status)).click;
    }
    async clickSaveButton(): Promise<void> {
        await ($(this.selectors.savebutton)).click();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.savebutton).isEnabled();
    }

    async isErrorMsgPresent(): Promise<boolean> {
        return await utilCommon.isErrorMsgPresent();
    }

    async clickCancelButton(): Promise<void> {
        await ($(this.selectors.cancelButton)).click();
    }

    async statusDropDownValuesDisplayed(statusValues: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.statusGuid, statusValues);
    }

    async setDescription(description: string): Promise<void> {
        await ($(this.selectors.description)).clear();
        await ($(this.selectors.description)).sendKeys(description);
    }

    async setAliasName(alias: string): Promise<void> {
        await ($(this.selectors.processAliasname)).clear();
        await ($(this.selectors.processAliasname)).sendKeys(alias);
    }
}

export default new CreateFlowset();