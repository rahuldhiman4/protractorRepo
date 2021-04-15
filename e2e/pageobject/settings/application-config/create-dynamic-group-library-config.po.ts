import utilityCommon from '../../../utils/utility.common';
import { $$, $, By, element, protractor, ProtractorExpectedConditions } from "protractor";

class CreateDynamicGroupLibrary {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        title: '[class="dp-title"]',
        addDynamicField: 'div[class="bwf-dynamic-field-group"] button[btn-type="tertiary"]',
        dynamicGroupName: '59bbcd1b-82ef-46ec-844b-277246baa5ea',
        displayLabel: '1e0ad22a-8692-48ca-b625-ac2ce600b8e8',
        lineOfBusiness: '41734528-2218-4e7c-8f98-2033f578d492',
        dynamicGroupNameInput: '[rx-view-component-id="59bbcd1b-82ef-46ec-844b-277246baa5ea"] input',
        displayLabelLink: '[rx-view-component-id="1e0ad22a-8692-48ca-b625-ac2ce600b8e8"] button',
        displayLabelField: '[rx-view-component-id="1e0ad22a-8692-48ca-b625-ac2ce600b8e8"] input',
        localizedValueInput: '.modal-content input[aria-label="Value for default locale"]',
        localizedValueSaveBtn: 'button[rx-id="save-button"]',
        localizedValueCancelBtn: 'button[rx-id="cancel-button"]',
        dynamicGroupWarningMsg: '.alert-warning',
        status: 'a3d16f46-16aa-4309-b376-f5807b0d4eb4',
        dynamicFieldNameInput: 'bwf-dynamic-field-data input.textfield-padding-transition',
        dynamicFieldDescriptionInput: 'bwf-dynamic-field-data input.textfield-padding-transition',
        dynamicGroupSaveBtn: '[rx-view-component-id="063a9878-3e83-4e00-84a8-793bde3fc704"] button',
        dynamicGroupCancelBtn: '[rx-view-component-id="eeaf8414-aa18-4217-889b-020c2e6b385d"] button',
        expandDynamicField: 'span.d-icon-angle_down'
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

    async isStatusRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.status);
    }

    async isDynamicGroupNameRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.dynamicGroupName);
    }

    async isDisplayLabelRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.displayLabel);
    }

    async isLineofBusinessRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.lineOfBusiness);
    }

    async setDynamicGroupName(dynamicGrpName: string): Promise<void> {
        await $(this.selectors.dynamicGroupNameInput).clear();
        await $(this.selectors.dynamicGroupNameInput).sendKeys(dynamicGrpName);
    }

    async setDynamicFieldName(dynamicFieldName: string): Promise<void> {
        await $$(this.selectors.dynamicFieldNameInput).first().clear();
        await $$(this.selectors.dynamicFieldNameInput).first().sendKeys(dynamicFieldName);
    }

    async setDynamicFieldDesc(dynamicFieldDesc: string): Promise<void> {
        await $$(this.selectors.dynamicFieldDescriptionInput).last().clear();
        await $$(this.selectors.dynamicFieldDescriptionInput).last().sendKeys(dynamicFieldDesc);
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

    async isSaveButtonDisabled(): Promise<string> {
       return await $(this.selectors.dynamicGroupSaveBtn).getAttribute("disabled");
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

    async expandDynamicField(position?: number): Promise<void> {
        if (position) {
            await $$(this.selectors.expandDynamicField).get(position - 1).click();
        }
        else {
            await $(this.selectors.expandDynamicField).click();
            }
    }
}

export default new CreateDynamicGroupLibrary();