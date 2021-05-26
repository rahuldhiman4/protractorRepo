import { $, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class CreateDynamicFieldLibrary {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        title: '.rx-search-option-container .d-textfield__item',
        cancelButton: '[rx-view-component-id="39134e3e-3a8c-40cd-8a20-b4c90ca7fce9"] button',
        fieldName: '[rx-view-component-id="3f126998-430d-4d80-9061-e6bb90ddcef5"] input',
        fieldNameGuid: '3f126998-430d-4d80-9061-e6bb90ddcef5',
        localizeButton: '[rx-view-component-id="827cea0b-82d6-4741-8051-1cc52b83b770"] button',
        fieldDescriptionGuid: '827cea0b-82d6-4741-8051-1cc52b83b770',
        status: '83773352-ff5c-4143-9b2d-116dc64c03cd',
        fieldValueType: 'bfcc7610-2202-45aa-87b7-bc37af6e8954',
        informationSource: 'b9b14785-4b48-4fde-83ac-dc012eb36858',
        saveButton: '[rx-view-component-id="2f8db2c3-2352-4732-81b9-fdaf46ccbde7"] button',
        activeConfidentialsCheckbox: '[rx-view-component-id="067cbf9a-a1db-4268-8f6b-3132270f6356"] button[aria-label="True"]',
        requiredWarningmessage: 'div.field-validation-error',
        lobValue: '[rx-view-component-id="4d6a9c5f-623a-4cc1-9a80-22e07ab55c40"]',
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async getRequiredWarningMessage(): Promise<string> {
        return await $(this.selectors.requiredWarningmessage).getText();
    }

    async clickOnActiveConfidentialsCheckbox(): Promise<void> {
        await $(this.selectors.activeConfidentialsCheckbox).click();
    }

    async isConfidentialsRadioButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.activeConfidentialsCheckbox).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.activeConfidentialsCheckbox).isDisplayed();
            else return false;
        });
    }

    async setFieldName(value: string): Promise<void> {
        await $(this.selectors.fieldName).sendKeys(value);
    }

    async isFieldNameRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.fieldNameGuid);
    }

    async isFieldDescriptionRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.fieldDescriptionGuid);
    }

    async isStatusRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.status);
    }

    async isFieldValueTypeRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.fieldValueType);
    }

    async isInformationSoucreRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.informationSource);
    }

    async clickOnLocalizeButton(): Promise<void> {
        await $(this.selectors.localizeButton).click();
    }

    async setFieldValueType(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.fieldValueType, value)
    }

    async isFieldValueTypeDropDownPresent(value: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.fieldValueType, value)
    }

    async isStatusDropDownPresent(value: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.status, value)
    }

    async isInformationSourceDropDownPresent(value: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.informationSource, value)
    }

    async setInformationSourceValueType(value: string) {
        await utilityCommon.selectDropDown(this.selectors.informationSource, value);
    }

    async setStatusValue(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.status, value)
    }

    async isHiddenFieldPresent(value: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.title, value)).isPresent();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async getLobValue(): Promise<string> {
        return await $(`${this.selectors.lobValue} button`).isPresent().then(async (buttonLob) => {
            if (buttonLob) return await $(`${this.selectors.lobValue} button`).getText();
            else return await $(`${this.selectors.lobValue} input`).getAttribute("placeholder");
        });
    }
}

export default new CreateDynamicFieldLibrary();