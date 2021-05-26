import { element, by, $, protractor, ProtractorExpectedConditions, browser, $$ } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class FieldAssociationMappingConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        saveButton: '[rx-view-component-id="536283a9-5337-4fd9-84cc-a5ceda1ddb62"] button',
        fieldNameGuid: '934607ab-0ea0-40d0-a549-ae650bdf8904',
        recordDefinitionNameguid: 'fddfd3ee-4efb-4345-bae6-5d70a63388e4',
        statusDropDownGuid: 'b5ce5d43-92d0-4673-8342-ba61e300a386',
        getrecordDefinitionNameValue: '[rx-view-component-id="fddfd3ee-4efb-4345-bae6-5d70a63388e4"] .ui-select-match-text',
        getApplicationOrBundleNameValue: '[rx-view-component-id="ae2367ee-2519-4c50-96e7-b05a5dfa68c1"] .ui-select-match-text',
        getFieldNameValue: '[rx-view-component-id="934607ab-0ea0-40d0-a549-ae650bdf8904"] .rx-definition-picker__fake-input-value',
        getAssociationToUseValue: '[rx-view-component-id="aaa3637f-ea6b-4844-9813-2fd68d3a549b"] .rx-definition-picker__fake-input-value',
        getStatusValue: '[rx-view-component-id="b5ce5d43-92d0-4673-8342-ba61e300a386"] .ui-select-match-text',
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }

    async getApplicationOrBundleNameValue(): Promise<string> {
        return await $(this.selectors.getApplicationOrBundleNameValue).getText();
    }

    async getRecordDefinitionNameDropDownValue(): Promise<string> {
        return await $(this.selectors.getrecordDefinitionNameValue).getText();
    }

    async getFieldNameValue(): Promise<string> {
        return await $(this.selectors.getFieldNameValue).getText();
    }

    async getAssociationToUseValue(): Promise<string> {
        return await $(this.selectors.getAssociationToUseValue).getText();
    }

    async getStatusValue(): Promise<string> {
        return await $(this.selectors.getStatusValue).getText();
    }

    async updateRecordDefinitionNameDropDown(value: string): Promise<void> {
        return await utilityCommon.selectDropDown(this.selectors.recordDefinitionNameguid, value);
    }

    async updateFieldNameValue(dropDownSearchValue: string): Promise<void> {
        await $$('[rx-view-component-id="934607ab-0ea0-40d0-a549-ae650bdf8904"] .rx-definition-picker__fake-input').get(0).click();
        await $$('.d-textfield__input').get(0).sendKeys(dropDownSearchValue);
        await $$(`.d-icon-plus_circle[aria-label="Add ${dropDownSearchValue}"]`).click();
    }

    async updateAssociationToUseValue(dropDownSearchValue: string, folderName:string): Promise<void> {
        await $$('[rx-view-component-id="aaa3637f-ea6b-4844-9813-2fd68d3a549b"] .rx-definition-picker__input-container').get(0).click();
        await $$('.d-textfield__input').get(1).sendKeys(dropDownSearchValue);
        await element(by.cssContainingText('.rx-record-grid-column-editor__collapsible-item span',folderName)).click();
        await $$(`.d-icon-plus_circle[aria-label="Add ${dropDownSearchValue}"]`).get(1).click();
    }
    

    async updateStatusDropDown(value: string): Promise<void> {
        return await utilityCommon.selectDropDown(this.selectors.statusDropDownGuid, value);
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }
}
export default new FieldAssociationMappingConsole();