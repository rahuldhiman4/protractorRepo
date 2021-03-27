import { resolve } from "path";
import { $, $$, By, by, element, Key, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilityCommon from '../../utils/utility.common';
import { DropDownType } from '../../utils/constants';
class DynamicField {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        fieldName: '.textfield__wrapper .textfield-padding-transition',
        fieldDescription: '.textfield-padding-transition',
        saveButton: 'button[btn-type="primary"]',
        cancelButton: '.modal-footer button[btn-type="secondary"]',
        fieldValueType: '.col-md-6 .dropdown button',
        informationSource: '.col-md-6 .dropdown button',
        enabledHiddenField: '[class="mt-4 ng-star-inserted"] button[aria-label="True"]',
        disabledhiddenField: '[class="mt-4 ng-star-inserted"] button[aria-label="False"]',
        enabledRequiredField: '[class="ng-untouched ng-pristine ng-valid"] button[aria-label="True"]',
        disabledRequiredField: '[class="ng-untouched ng-pristine ng-valid"] button[aria-label="False"]',
        enabledConfidentialsField: '[class="ng-untouched ng-pristine ng-valid"] button[aria-label="True"]',
        disabledConfidentialsField: '[class="ng-untouched ng-pristine ng-valid"] button[aria-label="False"]',
        enabledPublishInLibrary: '[class="d-textfield_required ng-star-inserted"] button[aria-label="True"]',
        allHeaders: 'div[id="selected-field-group-list"] .form-control-label',
        groupName: 'bwf-add-dynamic-group-data .textfield-padding-transition',
        groupDescription: 'textarea.form-control',
        target: '[class="group-fields-area flex"]',
        src: '.column-pill-icon',
        downArrow: 'span.d-icon-angle_down',
        upArrow: '.right-header-block .d-icon-angle_up',
        searchField: '.bwf-dynamic-field-group .adapt-search-field',
        deleteButton: '.d-icon-right-cross',
        attachmentField: 'input[type="file"]',
        columnValue: '[class="bwf-dynamic-field-simple"] .pl-1',
        dropdownvalue: '.rx-select__option-content div',
        globalFieldHeader: '[id="field-list"] span[class="ml-1"]'
    }

    async clickOnDynamicField(): Promise<void> {
        await element(by.buttonText('Dynamic Field')).click();
    }

    async clickOnDeleteField(): Promise<void> {
        await $(this.selectors.deleteButton).click();
    }

    async isDynamicFieldDisplayed(): Promise<boolean> {
        return await element(by.buttonText('Dynamic Field')).isDisplayed();
    }

    async clickOnAddDynamicGroup(): Promise<void> {
        await element(by.buttonText('Dynamic Group')).click();
    }

    async isAddDynamicGroupDisplayed(): Promise<boolean> {
        return await element(by.buttonText('Dynamic Group')).isDisplayed();
    }

    async clickOnDownArrow(): Promise<void> {
        await $$(this.selectors.downArrow).first().click();
    }

    async clickOnUpArrow(): Promise<void> {
        await $(this.selectors.upArrow).click();
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
        await $$(this.selectors.groupDescription).last().clear();
        await $$(this.selectors.groupDescription).last().sendKeys(name);
    }

    async isGroupDescriptionDisplay(): Promise<boolean> {
        return await $$(this.selectors.groupName).last().isDisplayed();
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

    async removeField(): Promise<void> {
        await $(this.selectors.deleteButton).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.deleteButton).click();
            else return console.log("delete button not present");
        });
    }

    async selectFieldValueType(dataType: string): Promise<void> {
        let size = await $$(this.selectors.fieldValueType).count();
        // await $$(this.selectors.fieldValueType).get(size - 2).click();
        // await element(by.cssContainingText(this.selectors.dropdownvalue, dataType)).click();
        await utilityCommon.selectDropDown($$(this.selectors.fieldValueType).get(size - 2), dataType, DropDownType.WebElement);
    }

    async selectInfromationSource(sourceValue: string): Promise<void> {
        await utilityCommon.selectDropDown($$(this.selectors.informationSource).last(), sourceValue, DropDownType.WebElement);
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
        return await element(By.cssContainingText(this.selectors.globalFieldHeader, value)).isPresent().then(async (result) => {
            if (result) return await element(By.cssContainingText(this.selectors.globalFieldHeader, value)).isDisplayed();
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