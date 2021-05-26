import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class EditDynamicFieldLibrary {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        cancelButton: '[rx-view-component-id="c4189be2-69be-4138-8e04-1fddec50d12c"] button',
        fieldName: '[rx-view-component-id="ae00a9fd-9963-44b4-80ed-ea3311a41eaa"] input',
        fieldNameGuid: 'ae00a9fd-9963-44b4-80ed-ea3311a41eaa',
        localizeButton: '[rx-view-component-id="f502e31f-69c2-4b63-aeb7-e6ee0be7dfd0"] button',
        fieldDescriptionGuid: 'f502e31f-69c2-4b63-aeb7-e6ee0be7dfd0',
        status: 'ab5addeb-3b2c-4f40-91f1-fd8121031e6b',
        fieldValueTypeGuid: '41cd2c04-a9ef-40ab-921b-3edde31e8c34',
        fieldValueType: '[rx-view-component-id="41cd2c04-a9ef-40ab-921b-3edde31e8c34"] button',
        informationSource: 'b4cc0f8f-36d8-4737-9cbf-845e417cfc23',
        saveButton: '[rx-view-component-id="cca7e4ea-99f5-4d56-9b21-ecf1a45b7ff3"] button',
        activeConfidentialsCheckbox: '[rx-view-component-id="f89c29d3-56a2-4c8b-95c8-a03b0f5d1e52"] button[rx-id="true-button"]',
        enabledRequiredRadioButton: '[rx-view-component-id="635e3839-5821-4960-9551-0f4843f5a666"] button[rx-id="true-button"]',
        lobValue: '[rx-view-component-id="e2959678-db85-488e-9d1c-b325965acedd"]'
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

    async isFieldNameAttribute(attribute: string): Promise<string> {
        return await $(this.selectors.fieldName).getAttribute(attribute);
    }

    async isFieldValueTypeAttribute(attribute: string): Promise<string> {
        return await $(this.selectors.fieldValueType).getAttribute(attribute);
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
        return await utilityCommon.isRequiredTagToField(this.selectors.fieldValueTypeGuid);
    }

    async isInformationSoucreRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.informationSource);
    }

    async clickOnLocalizeButton(): Promise<void> {
        await $(this.selectors.localizeButton).click();
    }

    async clickEnabledRequiredRadioButton(): Promise<void> {
        await $(this.selectors.enabledRequiredRadioButton).click();
    }

    async setInformationSourceValueType(value: string) {
        await utilityCommon.selectDropDown(this.selectors.informationSource, value);
    }

    async setStatusValue(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.status, value)
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

export default new EditDynamicFieldLibrary();