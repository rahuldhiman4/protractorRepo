import { $, $$,browser, By, element, protractor, ProtractorExpectedConditions } from "protractor";

class DynamicField {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dynamicField: '[ng-click="addEmptyField()"]',
        dynamicGroup: '[ng-click="addEmptyGroup()"]',
        fieldName: '.ac-input-field-name',
        fieldDescription: '.ac-input-description',
        saveButton: '.ac-button-save',
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
    }

    async clickOnDynamicField(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.dynamicField)));
        await $(this.selectors.dynamicField).click();
    }

    async clickOnAddDynamicGroup(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.dynamicField)));
        await $(this.selectors.dynamicGroup).click();
    }

    async clickOnDownArrow(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.dynamicField)));
        await $(this.selectors.downArrow).click();
    }

    async setFieldName(name: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.fieldName)));
        await $$(this.selectors.fieldName).last().clear();
        await $$(this.selectors.fieldName).last().sendKeys(name);
    }

    async setGroupName(name: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.fieldName)));
        await $(this.selectors.groupName).clear();
        await $(this.selectors.groupName).sendKeys(name);
    }

    async setGroupDescription(name: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.fieldName)));
        await $(this.selectors.groupDescription).clear();
        await $(this.selectors.groupDescription).sendKeys(name);
    }

    async setDescriptionName(name: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.fieldDescription)));
        await $$(this.selectors.fieldDescription).last().clear();
        await $$(this.selectors.fieldDescription).last().sendKeys(name);
    }

    async clickSaveButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
        //        await utilCommon.waitUntilPopUpDisappear();
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

}

export default new DynamicField();