import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import { DropDownType } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

class UpdateStatus {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        statusDropDown: '[aria-label="Status"]',
        statusReasonDropDown: '[aria-label*="Status Reason"]',
        caseStatusReasonDropDownGuid: 'c3fd187c-ecc8-4cab-a321-b73c381e4a0e',
        caseStatusReasonRequired: '[rx-view-component-id="e43fa7f2-66fc-4ac5-bf75-6b94da5e5318"] .form-control-label',
        resolutionCodeDropDownGuid: '113d5ef8-fee9-4a4e-b033-6cb9b44941f9',
        resolutionCodeRequiredTagGuid: '113d5ef8-fee9-4a4e-b033-6cb9b44941f9',
        saveUpdateStatus: '[rx-view-component-id="ee5dd503-a10e-4d22-9ac5-99c400892bb7"] button, [rx-view-component-id="6759ba60-df0d-4d5e-8eb9-5101490fd4d4"] button',
        cancelUpdateStatus: '[rx-view-component-id="7cffd3f8-5b84-4e7f-a4b3-6c0a3dd27855"] button, [rx-view-component-id="debcdc88-fb42-4003-96d6-1eeb807206b7"] button',
        statusChange: '.status-transition',
        searchInput: 'input[type="search"]',
        resolutionDescriptionTextBox: '.bwf-text-area-edit .bwf-description-textarea-edit',
        resolutionDescriptionGuid: '486a9101-526f-4058-a0e2-3c9e5fab1a36',
        validationMessage: '[rx-view-component-id="a1072f99-4036-4e2e-8e62-e72b2ba22344"] p',
    }

    async clearStatusReason(): Promise<void> {
        await $(`[rx-view-component-id="${this.selectors.caseStatusReasonDropDownGuid}"]` + " " + this.selectors.searchInput).clear();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelUpdateStatus).click();
    }

    async selectStatus(statusValue: string): Promise<void> {
        await utilityCommon.selectDropDown(await $(this.selectors.statusDropDown), statusValue, DropDownType.WebElement);
    }

    async selectStatusReason(statusReasonValue: string): Promise<void> {
        await utilityCommon.selectDropDown(await $(this.selectors.statusReasonDropDown), statusReasonValue, DropDownType.WebElement);
    }

    async changeStatus(statusValue: string): Promise<void> {
        await $(this.selectors.statusChange).click();
        await this.selectStatus(statusValue);
    }

    async isResolutionDescriptionTextBoxEmpty(): Promise<boolean> {
        return await $(this.selectors.resolutionDescriptionTextBox).getAttribute('value') == '' ? true : false;
    }

    async setResolutionDescription(description: string): Promise<void> {
        await $(this.selectors.resolutionDescriptionTextBox).sendKeys(description);
    }

    async selectResolutionCode(resolutionCode: string): Promise<void> {
        if (await $(`[rx-view-component-id="${this.selectors.resolutionCodeRequiredTagGuid}"] .form-control-label`).isPresent())
            await utilityCommon.selectDropDown(this.selectors.resolutionCodeRequiredTagGuid, resolutionCode);
        else await utilityCommon.selectDropDown(this.selectors.resolutionCodeDropDownGuid, resolutionCode);
    }

    async isResolutionoCodeDropDownValueDisplayed(value: string): Promise<boolean> {
        return await $(`[rx-view-component-id="${this.selectors.resolutionCodeRequiredTagGuid}"] .form-control-label`).isPresent().then(async (result) => {
            if (result) return await utilityCommon.isValuePresentInDropDown(this.selectors.resolutionCodeRequiredTagGuid, value);
            else return await utilityCommon.isValuePresentInDropDown(this.selectors.resolutionCodeDropDownGuid, value);
        })
    }

    async isStatusReasonRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.caseStatusReasonDropDownGuid);
    }

    async isChangeStatusFieldPresent(): Promise<boolean> {
        return await $(this.selectors.statusDropDown).isPresent().then(async (present) => {
            if (present) return await $(this.selectors.statusDropDown).isDisplayed();
            else return false;
        });
    }

    async isStatusReasonFieldPresent(): Promise<boolean> {
        return await $(this.selectors.statusReasonDropDown).isPresent().then(async (present) => {
            if (present) return await $(this.selectors.statusDropDown).isDisplayed();
            else return false;
        });
    }

    async isSaveUpdateStatusButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveUpdateStatus).isEnabled();
    }

    async isCancelUpdateStatusButtonPresent(): Promise<boolean> {
        return await $(this.selectors.cancelUpdateStatus).isPresent().then(async (present) => {
            if (present) return await $(this.selectors.cancelUpdateStatus).isDisplayed();
            else return false;
        });
    }

    async clickSaveStatus(expectedStatus?: string): Promise<void> {
        await $(this.selectors.saveUpdateStatus).click();
        if (expectedStatus) {
            await browser.wait(this.EC.visibilityOf(element(by.cssContainingText(this.selectors.statusChange, expectedStatus))), 3000);
        }
    }

    async allStatusValuesPresent(list: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(await $(this.selectors.statusDropDown), list, DropDownType.WebElement);
    }

    async allStatusReasonValuesPresent(list: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(await $(this.selectors.statusReasonDropDown), list, DropDownType.WebElement);
    }

    async isRequiredTagToResolutionCode(): Promise<boolean> {
        let loc = await $('[rx-view-component-id="113d5ef8-fee9-4a4e-b033-6cb9b44941f9"] .form-control-label');
        return await utilityCommon.isRequiredTagPresent(loc);
    }

    async isRequiredTagToResolutionDescription(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.resolutionDescriptionGuid);
    }

    async getValidationMessage(): Promise<string> {
        return (await $(this.selectors.validationMessage).getText()).trim();
    }
}

export default new UpdateStatus();