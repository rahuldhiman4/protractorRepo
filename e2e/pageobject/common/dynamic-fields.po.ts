import { resolve } from "path";
import { $, $$, Key, By, element, protractor, ProtractorExpectedConditions } from "protractor";

class DynamicField {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dynamicField: '[ng-click="addEmptyField()"]',
        dynamicGroup: '[ng-click="addEmptyGroup()"]',
        fieldName: '.ac-input-field-name',
        fieldDescription: '.ac-input-description',
        saveButton: '.ac-button-save',
        cancelButton: '.ac-button-cancel',
        fieldValueType: 'div[aria-label="Field Value Type"]',
        informationSource: '.ui-select-container',
        enabledHiddenField: '[ng-model="field.hidden"] button[aria-label="True"]',
        disabledhiddenField: '[ng-model="field.hidden"] button[aria-label="False"]',
        enabledRequiredField: '[ng-model="field.required"] button[aria-label="True"]',
        disabledRequiredField: '[ng-model="field.required"] button[aria-label="False"]',
        enabledConfidentialsField: '[ng-model="field.confidential"] button[aria-label="True"]',
        disabledConfidentialsField: '[ng-model="field.confidential"] button[aria-label="False"]',
        enabledPublishInLibrary: '[ng-if="!group.published"] button[aria-label="True"]',
        allHeaders: '.rx-search-option-container .d-textfield__item',
        groupName: '[name="groupName"]',
        groupDescription: '[name="groupDescription"]',
        target: '[class="group-fields-area flex"]',
        src: '.column-pill-icon',
        downArrow: '.d-icon-right-angle_down',
        searchField: '.ac-input-search-fields',
        deleteButton: '[class="d-icon-left-cross header-icon"]',
        attachmentField: 'input[type="file"]'
    }

    async clickOnDynamicField(): Promise<void> {
        await $(this.selectors.dynamicField).click();
    }

    async clickOnDeleteField(): Promise<void> {
        await $(this.selectors.deleteButton).click();
    }

    async isDynamicFieldDisplayed(): Promise<boolean> {
        return await $(this.selectors.dynamicField).isDisplayed();
    }

    async clickOnAddDynamicGroup(): Promise<void> {
        await $(this.selectors.dynamicGroup).click();
    }

    async isAddDynamicGroupDisplayed(): Promise<boolean> {
        return await $(this.selectors.dynamicGroup).isDisplayed();
    }

    async clickOnDownArrow(): Promise<void> {
        await $(this.selectors.downArrow).click();
    }

    async setFieldName(name: string): Promise<void> {
        await $$(this.selectors.fieldName).last().clear();
        await $$(this.selectors.fieldName).last().sendKeys(name);
    }

    async getFieldNameAttribute(name: string): Promise<string> {
        return await $$(this.selectors.fieldName).last().getAttribute(name);
    }

    async getDescriptionName(name: string): Promise<string> {
        return await $$(this.selectors.fieldDescription).last().getAttribute(name);
    }

    async getFieldValueType(dataType: string): Promise<string> {
        return await $$(this.selectors.fieldValueType).last().getAttribute(dataType);
    }

    async setGroupName(name: string): Promise<void> {
        await $(this.selectors.groupName).clear();
        await $(this.selectors.groupName).sendKeys(name);
    }

    async isGroupNameDisplayed(): Promise<boolean> {
        return await $(this.selectors.groupName).isDisplayed();
    }

    async setGroupDescription(name: string): Promise<void> {
        await $(this.selectors.groupDescription).clear();
        await $(this.selectors.groupDescription).sendKeys(name);
    }

    async isGroupDescriptionDisplay(): Promise<boolean> {
        return await $(this.selectors.groupDescription).isDisplayed();
    }

    async setDescriptionName(name: string): Promise<void> {
        await $$(this.selectors.fieldDescription).last().clear();
        await $$(this.selectors.fieldDescription).last().sendKeys(name);
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async isFieldDisplayedInFieldSection(fieldName: string): Promise<boolean> {
        return await $(`.column-pill span[title=${fieldName}]`).isDisplayed();
    }

    async removeField(fieldName: string): Promise<void> {
        await $(`[aria-label=${fieldName}] [class="d-icon-left-cross header-icon"]`).click();
    }

    async selectFieldValueType(dataType: string): Promise<void> {
        await $$(this.selectors.fieldValueType).last().click();
        await $(`div[title=${dataType}]`).click();
    }

    async selectInfromationSource(sourceValue: string): Promise<void> {
        await $$(this.selectors.informationSource).last().click();
        let tempLoc = `div[title="${sourceValue}"]`;
        await $(tempLoc).click();
    }

    async clickEnabledRequiredRadioButton(): Promise<void> {
        await $(this.selectors.enabledRequiredField).click();
    }

    async clickDisabledRequiredRadioButton(): Promise<void> {
        await $(this.selectors.disabledRequiredField).click();
    }

    async clickEnabledConfidentialsRadioButton(): Promise<void> {
        await $(this.selectors.enabledConfidentialsField).click();
    }


    async isConfidentialsRadioButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.enabledConfidentialsField).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.enabledConfidentialsField).isDisplayed();
            else return false;
        });
    }

    async clickEnabledPublishInLibraryButton(): Promise<void> {
        await $(this.selectors.enabledPublishInLibrary).click();
    }

    async isEnabledPublishInLibraryButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.enabledPublishInLibrary).isDisplayed();
    }

    async clickDisabledConfidentialsRadioButton(): Promise<void> {
        await $(this.selectors.disabledConfidentialsField).click();
    }

    async isEnabledTextPresent(value: string): Promise<boolean> {
        return await element(By.cssContainingText(this.selectors.allHeaders, value)).isDisplayed();
    }

    async clickEnabledHiddenRadioButton(): Promise<void> {
        await $(this.selectors.enabledHiddenField).click();
    }

    async clickDisabledHiddenRadioButton(): Promise<void> {
        await $(this.selectors.disabledhiddenField).click();
    }

    async isDynamicFieldPresentInDynamicSection(value: string): Promise<boolean> {
        return await $(`.rx-record-grid-column-editor__available-list-inner span[title=${value}]`).isPresent().then(async (result) => {
            if (result) return await $(`.rx-record-grid-column-editor__available-list-inner span[title=${value}]`).isDisplayed();
            else return false;
        });
    }

    async searchField(value: string): Promise<void> {
        await $(this.selectors.searchField).clear();
        await $(this.selectors.searchField).sendKeys(value + Key.ENTER);
    }

    async addAttachment(fileToUpload: string[], attachmentNumber:number): Promise<void> {
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        console.log(absPathArray);
        await $$(this.selectors.attachmentField).get(attachmentNumber -1).sendKeys(absPathArray.join('\n'));
    }
}

export default new DynamicField();