import { element, by, $, protractor, ProtractorExpectedConditions, browser, $$ } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class FieldAssociationMappingConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        saveButton: '[rx-view-component-id="9e795ee2-e808-4d7e-b4e8-a31f9d753409"]  button',
        ApplicationOrBundleNameguid: '5a8a44a0-f226-4670-ba6d-3d6c16f94c15',
        RecordDefinitionNameguid: '4f4bdb53-01cb-49a3-9ebf-b5170a7a4b05',
        statusDropDownGuid: '2f5f88e7-fd76-42b0-b3d3-19cd261606b3'
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }

    async selectApplicationOrBundleNameDropDown(value: string): Promise<void> {
        return await utilityCommon.selectDropDown(this.selectors.ApplicationOrBundleNameguid, value);
    }

    async selectRecordDefinitionNameDropDown(value: string): Promise<void> {
        return await utilityCommon.selectDropDown(this.selectors.RecordDefinitionNameguid, value);
    }

    async selectFieldNameValue(dropDownSearchValue: string): Promise<void> {
        await $$('[rx-view-component-id="ce4ecb78-4ea8-4d7b-970d-2b2e69113c0d"] .rx-definition-picker__fake-input').get(0).click();
        await $$('.d-textfield__input').get(0).sendKeys(dropDownSearchValue);
        await $$('.d-icon-plus_circle').get(0).click();
    }

    async selectAssociationToUseValue(dropDownSearchValue: string, folderName:string): Promise<void> {
        await $$('[rx-view-component-id="d674c7cd-01e6-4597-8bec-35a8eb201b29"] .rx-definition-picker__fake-input').get(0).click();
        await element(by.cssContainingText('.rx-record-grid-column-editor__collapsible-item span',folderName)).click();
        await $$('.d-textfield__input').get(1).sendKeys(dropDownSearchValue);
        await $$(`.d-icon-plus_circle[aria-label="Add ${dropDownSearchValue}"]`).click();
    }

    async getStatusDropDownValue(): Promise<string> {
        return await $('[rx-view-component-id="2f5f88e7-fd76-42b0-b3d3-19cd261606b3"] .ui-select-match-text').getText();
    }

    async selectStatusDropDown(value: string): Promise<void> {
        return await utilityCommon.selectDropDown(this.selectors.statusDropDownGuid, value);
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }
}
export default new FieldAssociationMappingConsole();