import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class EditDynamicFieldLibrary {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        cancelButton: '[rx-view-component-id="c4189be2-69be-4138-8e04-1fddec50d12c"] button',
        fieldName: '[rx-view-component-id="ae00a9fd-9963-44b4-80ed-ea3311a41eaa"] .d-textfield__input',
        fieldNameGuid: 'ae00a9fd-9963-44b4-80ed-ea3311a41eaa',
        localizeButton: '[rx-view-component-id="f502e31f-69c2-4b63-aeb7-e6ee0be7dfd0"] button',
        fieldDescriptionGuid: 'f502e31f-69c2-4b63-aeb7-e6ee0be7dfd0',
        status: 'ab5addeb-3b2c-4f40-91f1-fd8121031e6b',
        fieldValueTypeGuid: '41cd2c04-a9ef-40ab-921b-3edde31e8c34',
        fieldValueType: '[rx-view-component-id="41cd2c04-a9ef-40ab-921b-3edde31e8c34"] .ui-select-container',
        informationSource: 'b4cc0f8f-36d8-4737-9cbf-845e417cfc23',
        saveButton: '[rx-view-component-id="cca7e4ea-99f5-4d56-9b21-ecf1a45b7ff3"] button',
        activeConfidentialsCheckbox: '[rx-view-component-id="cca7e4ea-99f5-4d56-9b21-ecf1a45b7ff3"] button[uib-btn-radio="trueValue"]',
        enabledRequiredRadioButton: '[rx-view-component-id="635e3839-5821-4960-9551-0f4843f5a666"] [uib-btn-radio="trueValue"]',
        lobValue: '[rx-view-component-id="ffd8033c-5dc5-4f97-82e4-ad62bf9cdd4c"] .pull-left'
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
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

    async isFieldNameAttribute(attribute:string): Promise<string> {
     return await $(this.selectors.fieldName).getAttribute(attribute);
    }

    async isFieldValueTypeAttribute(attribute:string): Promise<string> {
        return await $(this.selectors.fieldValueType).getAttribute(attribute);
       }

    async isFieldNameRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.fieldNameGuid);
    }

    async isFieldDescriptionRequiredText(): Promise<boolean> {
        let fieldDescriptionRequired = await $('[rx-view-component-id="f502e31f-69c2-4b63-aeb7-e6ee0be7dfd0"] .d-textfield__item');
        return await utilCommon.isRequiredTagToFieldElement(fieldDescriptionRequired);
    }

    async isStatusRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.status);
    }

    async isFieldValueTypeRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.fieldValueTypeGuid);
    }

    async isInformationSoucreRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.informationSource);
    }

    async clickOnLocalizeButton(): Promise<void> {
        await $(this.selectors.localizeButton).click();
    }

    async clickEnabledRequiredRadioButton(): Promise<void> {
        await $(this.selectors.enabledRequiredRadioButton).click();
    }

    async isFieldValueTypeDropDownPresent(value: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.fieldValueTypeGuid, value)
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

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new EditDynamicFieldLibrary();