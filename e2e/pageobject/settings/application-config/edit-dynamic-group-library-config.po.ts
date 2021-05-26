import utilityCommon from '../../../utils/utility.common';
import {$$ , $, By, element, protractor, ProtractorExpectedConditions } from "protractor";

class CreateDynamicGroupLibrary {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        title: '[class="dp-title"]',
        addDynamicField: '[rx-view-component-id="8de11ae4-d229-4815-9d60-4841a847e816"] button[btn-type="tertiary"]',
        dynamicGroupName: '2eb48e70-e559-4394-b551-e204a3c67f77',
        displayLabel: 'e56f279b-9e7b-4fc6-b855-bf2628689d3c',
        lineOfBusiness: 'e5ab571f-f66e-47e6-b5bf-eb9fc333c58e',
        dynamicGroupNameInput: '[rx-view-component-id="2eb48e70-e559-4394-b551-e204a3c67f77"] input',
        displayLabelLink: '[rx-view-component-id="e56f279b-9e7b-4fc6-b855-bf2628689d3c"] button',
        displayLabelField: '[rx-view-component-id="e56f279b-9e7b-4fc6-b855-bf2628689d3c"] input',
        localizedValueInput: '.modal-content input[aria-label="Value for default locale"]',
        localizedValueSaveBtn: 'button[rx-id="save-button"]',
        localizedValueCancelBtn: 'button[rx-id="cancel-button"]',
        dynamicGroupWarningMsg: 'div.alert-warning div',
        status: '76eaa168-a4fb-4687-a838-280983d01700',
        dynamicFieldNameInput: '.bwf-dynamic-field-data input',
        dynamicFieldDescriptionInput: '.bwf-dynamic-field-data input',
        dynamicGroupSaveBtn: '[rx-view-component-id="1dd1a2a9-28fb-47b5-9941-f73063e860d7"] button',
        dynamicGroupCancelBtn: '[rx-view-component-id="c0d7ec27-1a72-4943-b487-87f7559fff95"] button',
        lineOfBusinessInput: '[rx-view-component-id="ba22c840-211a-46e9-9d22-b87c2f45a64d"] input',
        statusValue: '[rx-view-component-id="76eaa168-a4fb-4687-a838-280983d01700"] button',
        dynamicFields: 'bwf-dynamic-field-simple .left-block',
    }

    async verifyTitle(value: string): Promise<boolean> {
        return await element(By.cssContainingText(this.selectors.title, value)).isPresent();
    }

    async clickOnAddDynamicField(): Promise<void> {
        await $(this.selectors.addDynamicField).click();
    }

    async setStatusValue(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.status, value)
    }


    async isLineofBusinessRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.lineOfBusiness);
    }

    async setDynamicGroupName(dynamicGrpName: string): Promise<void> {
        await $(this.selectors.dynamicGroupNameInput).clear();
        await $(this.selectors.dynamicGroupNameInput).sendKeys(dynamicGrpName);
    }

    async setDynamicFieldName(dynamicFieldName: string): Promise<void> {
        let size = await $$(this.selectors.dynamicFieldNameInput).count();
        await $$(this.selectors.dynamicFieldNameInput).get(size - 2).clear();
        await $$(this.selectors.dynamicFieldNameInput).get(size - 2).sendKeys(dynamicFieldName);
    }

    async setDynamicFieldDesc(dynamicFieldDesc: string): Promise<void> {
        await $$(this.selectors.dynamicFieldNameInput).last().clear();
        await $$(this.selectors.dynamicFieldNameInput).last().sendKeys(dynamicFieldDesc);
    }

    async clickOnDisplayLabelocalizedLink(): Promise<void> {
        await $(this.selectors.displayLabelLink).click();
    }

    async setDynamicGroupDisplayLabel(dynamicGrpDisplayLabel: string): Promise<void> {
        await $(this.selectors.displayLabelField).clear();
        await $(this.selectors.displayLabelField).sendKeys(dynamicGrpDisplayLabel);
    }

    async clickOnDynamicGroupSaveButton(): Promise<void> {
        await $(this.selectors.dynamicGroupSaveBtn).click();
    }

    async clickOnDynamicGroupCancelButton(): Promise<void> {
        await $(this.selectors.dynamicGroupCancelBtn).click();
    }

    async clickOnDynamicGroupLocalizedVaueSaveButton(): Promise<void> {
        await $(this.selectors.localizedValueSaveBtn).click();
    }

    async clickOnDynamicGroupLocalizedVaueCancelButton(): Promise<void> {
        await $(this.selectors.localizedValueCancelBtn).click();
    }

    async isDynamicGroupWarningMessageDisplayed(): Promise<boolean> {
        return await $(this.selectors.dynamicGroupWarningMsg).isPresent().then(async (link) => {
            if (link) {
                return await $(this.selectors.dynamicGroupWarningMsg).isDisplayed();
            } else return false;
        });
    }

    async getDynamicGroupWarningMessage(): Promise<string> {
        return await $(this.selectors.dynamicGroupWarningMsg).getText();
    }

    async getDynamicGroupName(): Promise<string> {
        return await $(this.selectors.dynamicGroupNameInput).getAttribute("value");
    }

    async getDynamicGroupDisplayLabel(): Promise<string> {
        return await $(this.selectors.displayLabelField).getAttribute("value");
    }

    async getDynamicGroupLineOfBusiness(): Promise<string> {
        return await $(this.selectors.lineOfBusinessInput).getAttribute("placeholder");
    }

    async getDynamicGroupStatusValue(): Promise<string> {
        return await $(this.selectors.statusValue).getText();
    }


    async isDynamicFieldsDisplayed(): Promise<boolean> {
        return await $(this.selectors.dynamicFields).isPresent().then(async (link) => {
            if (link) {
                return await $(this.selectors.dynamicFields).isDisplayed();
            } else return false;
        });
    }

}

export default new CreateDynamicGroupLibrary();