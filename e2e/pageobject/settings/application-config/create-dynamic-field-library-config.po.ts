import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../../utils/util.grid';
import utilCommon from '../../../utils/util.common';

class CreateDynamicFieldLibrary {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        title: '.rx-search-option-container .d-textfield__item',
        cancelButton: '[rx-view-component-id="39134e3e-3a8c-40cd-8a20-b4c90ca7fce9"] button',
        fieldName: '[rx-view-component-id="3f126998-430d-4d80-9061-e6bb90ddcef5"] .d-textfield__input',
        fieldNameGuid: '3f126998-430d-4d80-9061-e6bb90ddcef5',
        localizeButton: '[rx-view-component-id="827cea0b-82d6-4741-8051-1cc52b83b770"] button',
        fieldDescriptionGuid: '827cea0b-82d6-4741-8051-1cc52b83b770',
        status: '83773352-ff5c-4143-9b2d-116dc64c03cd',
        fieldValueType: 'bfcc7610-2202-45aa-87b7-bc37af6e8954',
        informationSource: 'b9b14785-4b48-4fde-83ac-dc012eb36858',
        saveButton: '[rx-view-component-id="2f8db2c3-2352-4732-81b9-fdaf46ccbde7"] button',
        activeConfidentialsCheckbox: '[rx-view-component-id="067cbf9a-a1db-4268-8f6b-3132270f6356"] button[uib-btn-radio="trueValue"]',
        requiredWarningmessage: '.localized-character-field-design div',
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
        return await utilCommon.isRequiredTagToField(this.selectors.fieldNameGuid);
    }

    async isFieldDescriptionRequiredText(): Promise<boolean> {
        let fieldDescriptionRequired = await $('[rx-view-component-id="827cea0b-82d6-4741-8051-1cc52b83b770"] .d-textfield__item');
        return await utilCommon.isRequiredTagToFieldElement(fieldDescriptionRequired);
    }

    async isStatusRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.status);
    }

    async isFieldValueTypeRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.fieldValueType);
    }

    async isInformationSoucreRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.informationSource);
    }

    async clickOnLocalizeButton(): Promise<void> {
        await $(this.selectors.localizeButton).click();
    }

    async setFieldValueType(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.fieldValueType, value)
    }

    async isFieldValueTypeDropDownPresent(value: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.fieldValueType, value)
    }

    async isStatusDropDownPresent(value: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.status, value)
    }

    async isInformationSourceDropDownPresent(value: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.informationSource, value)
    }

    async setInformationSourceValueType(value: string) {
        await utilCommon.selectDropDown(this.selectors.informationSource, value);
    }

    async setStatusValue(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.status, value)
    }

    async isHiddenFieldPresent(value: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.title, value)).isPresent();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }
}

export default new CreateDynamicFieldLibrary();