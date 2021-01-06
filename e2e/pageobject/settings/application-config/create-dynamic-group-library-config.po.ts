import { $, By, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class CreateDynamicGroupLibrary {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        title: 'fieldset .dp-header',
        addDynamicField: 'div[class="bwf-dynamic-field-group"] button[btn-type="tertiary"]',
        dynamicGroupName: '59bbcd1b-82ef-46ec-844b-277246baa5ea',
        displayLabel: '1e0ad22a-8692-48ca-b625-ac2ce600b8e8',
        lineOfBusiness: 'a07f69a6-9b62-446f-8e1c-c48b45e03a11',
        dynamicGroupNameInput: '[rx-view-component-id="59bbcd1b-82ef-46ec-844b-277246baa5ea"] input',
        displayLabelLink: '[rx-view-component-id="1e0ad22a-8692-48ca-b625-ac2ce600b8e8"] button',
        displayLabelField: '[rx-view-component-id="1e0ad22a-8692-48ca-b625-ac2ce600b8e8"] input',
        localizedValueInput: '.modal-content input[aria-label="Value for default locale"]',
        localizedValueSaveBtn: 'button[rx-id="save-button"]',
        localizedValueCancelBtn: 'button[rx-id="cancel-button"]',
        dynamicGroupWarningMsg: 'div.alert-warning div',
        status: 'd17e9d98-3760-4c7f-b0d9-9ae40a3cab72',
        dynamicFieldNameInput: '.d-textfield_required input[id="adapt-textfield-0_input"]',
        dynamicFieldDescriptionInput: '.d-textfield_required input[id="adapt-textfield-2_input"]',
        dynamicGroupSaveBtn: '[rx-view-component-id="063a9878-3e83-4e00-84a8-793bde3fc704"] button',
        dynamicGroupCancelBtn: '[rx-view-component-id="eeaf8414-aa18-4217-889b-020c2e6b385d"] button',
    }

    async verifyTitle(value: string): Promise<boolean> {
        return await element(By.cssContainingText(this.selectors.title, value)).isPresent();
    }

    async clickOnAddDynamicField(): Promise<void> {
        await $(this.selectors.addDynamicField).click();
    }

    async setStatusValue(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.status, value)
    }

    async isStatusRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.status);
    }

    async isDynamicGroupNameRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.dynamicGroupName);
    }

    async isDisplayLabelRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.displayLabel);
    }

    async isLineofBusinessRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.lineOfBusiness);
    }

    async setDynamicGroupName(dynamicGrpName: string): Promise<void> {
        await $(this.selectors.dynamicGroupNameInput).clear();
        await $(this.selectors.dynamicGroupNameInput).sendKeys(dynamicGrpName);
    }

    async setDynamicFieldName(dynamicFieldName: string): Promise<void> {
        await $(this.selectors.dynamicFieldNameInput).clear();
        await $(this.selectors.dynamicFieldNameInput).sendKeys(dynamicFieldName);
    }

    async setDynamicFieldDesc(dynamicFieldDesc: string): Promise<void> {
        await $(this.selectors.dynamicFieldDescriptionInput).clear();
        await $(this.selectors.dynamicFieldDescriptionInput).sendKeys(dynamicFieldDesc);
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

    async setLocalizedValue(localizedValue: string):Promise<void>{
        await $(this.selectors.localizedValueInput).clear();
        await $(this.selectors.localizedValueInput).sendKeys(localizedValue);
    }

    async getDynamicGroupDisplayLabelText(): Promise<string> {
        return await $(this.selectors.displayLabelField).getAttribute("value");
    }



}

export default new CreateDynamicGroupLibrary();