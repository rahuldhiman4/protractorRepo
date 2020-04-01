import { $, browser, protractor, ProtractorExpectedConditions, $$ } from "protractor";
import utilCommon from '../../utils/util.common';


class DynamicField {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dynamicField: '[ng-click="addEmptyField()"]',
        fieldName: '.ac-input-field-name',
        fieldDescription: '.ac-input-description',
        saveButton: '.ac-button-save',
        fieldValueType:'div[aria-label="Field Value Type"]',
        informationSource:'.ui-select-container',
        
    }

    async clickOnDynamicField(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.dynamicField)));
        await $(this.selectors.dynamicField).click();
    }

    async setFieldName(name: string): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.fieldName)));
        await $$(this.selectors.fieldName).last().clear();
        await $$(this.selectors.fieldName).last().sendKeys(name);
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

    async isFieldDisplayedInFieldSection(fieldName:string):Promise<boolean>{
        return await $(`.column-pill span[title=${fieldName}]`).isDisplayed();
    }

    async removeField(fieldName:string):Promise<void>{
        await $(`[aria-label=${fieldName}] .remove-button-text`).click();
    }

    async selectFieldValueType(dataType:string):Promise<void>{
        await $$(this.selectors.fieldValueType).last().click();
        await $(`div[title=${dataType}]`).click();
    }

    async selectInfromationSource(sourceValue:string):Promise<void>{
        await $$(this.selectors.informationSource).last().click();
        await $(`div[title=${sourceValue}]`).click();
    }
    
   }

export default new DynamicField();