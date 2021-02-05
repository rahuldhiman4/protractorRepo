import { resolve } from "path";
import { $, $$, By, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";
class DynamicField {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dynamicField: 'button.d-icon-left-plus_circle',
        fieldName: '.textfield__wrapper .textfield-padding-transition',
        fieldDescription: '.textfield-padding-transition',
        saveButton: 'button[btn-type="primary"]',
        cancelButton: '.modal-footer button[btn-type="secondary"]',
        fieldValueType: '[aria-haspopup="listbox"]',
        informationSource: '[aria-haspopup="listbox"]',
        enabledHiddenField: '[class="ng-untouched ng-valid ng-dirty"] button[aria-label="True"]',
        disabledhiddenField: '[class="ng-untouched ng-valid ng-dirty"] button[aria-label="False"]',
        enabledRequiredField: '[class="ng-untouched ng-pristine ng-valid"] button[aria-label="True"]',
        disabledRequiredField: '[class="ng-untouched ng-pristine ng-valid"] button[aria-label="False"]',
        enabledConfidentialsField: '[class="ng-untouched ng-pristine ng-valid"] button[aria-label="True"]',
        disabledConfidentialsField: '[class="ng-untouched ng-pristine ng-valid"] button[aria-label="False"]',
        enabledPublishInLibrary: '[class="d-textfield_required ng-star-inserted"] button[aria-label="True"]',
        allHeaders: 'div[id="selected-field-group-list"] .form-control-label',
        groupName: '.textfield-padding-transition',
        groupDescription: 'textarea.form-control',
        target: '[class="group-fields-area flex"]',
        src: '.column-pill-icon',
        downArrow: '.d-icon-angle_down',
        upArrow: '.right-header-block .d-icon-angle_up',
        searchField: '.bwf-dynamic-field-group .adapt-search-field',
        deleteButton: '.d-icon-right-cross',
        attachmentField: 'input[type="file"]',
        columnValue: '.left-header-block span.pl-2',
        dropdownvalue: 'button[role="option"] span',
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
        await $$(this.selectors.dynamicField).get(2).click();
    }

    async isAddDynamicGroupDisplayed(): Promise<boolean> {
        return await $$(this.selectors.dynamicField).get(2).isDisplayed();
    }

    async clickOnDownArrow(): Promise<void> {
        await $(this.selectors.enabledConfidentialsField).isPresent().then(async (result) => {
            await $$(this.selectors.downArrow).last().click();
        });
    }

    async clickOnUpArrow(): Promise<void> {
        await $(this.selectors.enabledConfidentialsField).isPresent().then(async (result) => {
            await $(this.selectors.upArrow).click();
        });
    }

    async setFieldName(name: string): Promise<void> {
        let size = await $$(this.selectors.fieldName).count();
        await $$(this.selectors.fieldName).get(size - 2).clear();
        await $$(this.selectors.fieldName).get(size - 2).sendKeys(name);
    }

    async getFieldNameAttribute(name: string): Promise<string> {
        let size = await $$(this.selectors.fieldName).count();
       return await $$(this.selectors.fieldName).get(size - 2).getAttribute(name);
    }

    async getDescriptionName(name: string): Promise<string> {
        return await $$(this.selectors.fieldDescription).last().getAttribute(name);
    }

    async getFieldValueType(dataType: string): Promise<string> {
        let size = await $$(this.selectors.fieldValueType).count();
       return await $$(this.selectors.fieldValueType).get(size - 2).getAttribute(dataType);
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
        return await element(By.cssContainingText(this.selectors.columnValue, fieldName)).isDisplayed();
    }

    async removeField(fieldName: string): Promise<void> {
        await $(`[aria-label=${fieldName}] [class="d-icon-left-cross header-icon"]`).click();
    }

    async selectFieldValueType(dataType: string): Promise<void> {
        let size = await $$(this.selectors.fieldValueType).count();
        await $$(this.selectors.fieldValueType).get(size - 2).click();
        await element(by.cssContainingText(this.selectors.dropdownvalue, dataType)).click();
    }

    async selectInfromationSource(sourceValue: string): Promise<void> {
        await $$(this.selectors.informationSource).last().click();
        await element(by.cssContainingText(this.selectors.dropdownvalue, sourceValue)).click();
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

    async addAttachment(fileToUpload: string[], attachmentNumber: number): Promise<void> {
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        await $$(this.selectors.attachmentField).get(attachmentNumber - 1).sendKeys(absPathArray.join('\n'));
    }
}

export default new DynamicField();