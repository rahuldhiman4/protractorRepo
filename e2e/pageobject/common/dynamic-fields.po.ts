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
        allHeaders: '.rx-search-option-container .d-textfield__item',
        groupName: '[name="groupName"]',
        groupDescription: '[name="groupDescription"]',
        target: '[class="group-fields-area flex"]',
        src: '.column-pill-icon',
        downArrow: '.d-icon-right-angle_down',
        searchField:'.ac-input-search-fields'
    }

    async clickOnDynamicField(): Promise<void> {
        await $(this.selectors.dynamicField).click();
    }

    async clickOnAddDynamicGroup(): Promise<void> {
        await $(this.selectors.dynamicGroup).click();
    }

    async clickOnDownArrow(): Promise<void> {
        await $(this.selectors.downArrow).click();
    }

    async setFieldName(name: string): Promise<void> {
        await $$(this.selectors.fieldName).last().clear();
        await $$(this.selectors.fieldName).last().sendKeys(name);
    }

    async setGroupName(name: string): Promise<void> {
        await $(this.selectors.groupName).clear();
        await $(this.selectors.groupName).sendKeys(name);
    }

    async setGroupDescription(name: string): Promise<void> {
        await $(this.selectors.groupDescription).clear();
        await $(this.selectors.groupDescription).sendKeys(name);
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
        await $(`[aria-label=${fieldName}] .remove-button-text`).click();
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

    async searchField(value:string):Promise<void>{
        await $(this.selectors.searchField).clear();
        await $(this.selectors.searchField).sendKeys(value+Key.ENTER);
    }
}

export default new DynamicField();