import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../utils/utility.common';

class UpdateStatus {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        caseStatusDropDownGuid: '3c8d9278-fc1f-430c-b866-cdc9d217318b',
        taskStatusDropDownGuid: '8b4cef48-0a4c-4ec1-bc4c-cce47179c964',
        caseStatusReasonDropDownGuid: 'c3fd187c-ecc8-4cab-a321-b73c381e4a0e',
        caseStatusReasonRequired: '[rx-view-component-id="e43fa7f2-66fc-4ac5-bf75-6b94da5e5318"] .form-control-label',
        taskStatusReasonDropDownGuid: 'baf69b56-c37b-4a0b-9e68-f18558738ebb',
        caseStatusReasonDropDown: '[rx-view-component-id="7128b36c-5d4f-4333-8ee4-2a5163258a45"] button',
        resolutionCodeDropDownGuid: 'b3daf229-5921-4863-ba22-8f5240f006a5',
        resolutionCodeRequiredTagGuid: '9bf39167-6499-49b6-b9e1-a3c869ae5696',
        saveUpdateStatus: '[rx-view-component-id="ee5dd503-a10e-4d22-9ac5-99c400892bb7"] button, [rx-view-component-id="6759ba60-df0d-4d5e-8eb9-5101490fd4d4"] button',
        cancelUpdateStatus: '[rx-view-component-id="7cffd3f8-5b84-4e7f-a4b3-6c0a3dd27855"] button, [rx-view-component-id="debcdc88-fb42-4003-96d6-1eeb807206b7"] button',
        statusChange: '.status-transition',
        searchInput: 'input[type="search"]',
        resolutionDescriptionTextBox: '.bwf-text-area-edit .bwf-description-textarea-edit',
        resolutionDescriptionGuid: '486a9101-526f-4058-a0e2-3c9e5fab1a36',
        validationMessage: '[rx-view-component-id="a1072f99-4036-4e2e-8e62-e72b2ba22344"] p',
    }

    async allStatusReasonOptionsPresent(list: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.caseStatusReasonDropDownGuid, list);
    }

    async clearStatusReason(): Promise<void> {
        await $(`[rx-view-component-id="${this.selectors.caseStatusReasonDropDownGuid}"]` + " " + this.selectors.searchInput).clear();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelUpdateStatus).click();
    }

    async changeStatus(statusValue: string): Promise<void> {
        await $(`[rx-view-component-id="${this.selectors.caseStatusDropDownGuid}"] button`).isPresent().then(async (present) => {
            if (present) await utilityCommon.selectDropDown(this.selectors.caseStatusDropDownGuid, statusValue);
            else await utilityCommon.selectDropDown(this.selectors.taskStatusDropDownGuid, statusValue);
        });
    }

    async setStatusReason(statusReasonValue: string): Promise<void> {
        await $(`[rx-view-component-id="${this.selectors.caseStatusDropDownGuid}"] button`).isPresent().then(async (present) => {
            if (present) await utilityCommon.selectDropDown(this.selectors.caseStatusReasonDropDownGuid, statusReasonValue);
            else await utilityCommon.selectDropDown(this.selectors.taskStatusReasonDropDownGuid, statusReasonValue);
        });
    }

    async clickOnstatusReason(): Promise<void> {
        await $(`[rx-view-component-id="${this.selectors.caseStatusReasonDropDownGuid}"]`).click();
    }

    async changeCaseStatus(statusValue: string): Promise<void> {
        await $(this.selectors.statusChange).click();
        await this.changeStatus(statusValue);
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
        return await $(`[rx-view-component-id="${this.selectors.caseStatusDropDownGuid}"] button`).isPresent().then(async (present) => {
            if (present) return await $(`[rx-view-component-id="${this.selectors.caseStatusDropDownGuid}"] button`).isDisplayed();
            else return false;
        });
    }

    async isStatusReasonFieldPresent(): Promise<boolean> {
        return await $(this.selectors.caseStatusReasonDropDown).isPresent().then(async (present) => {
            if (present) return await $(this.selectors.caseStatusReasonDropDown).isDisplayed();
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
            await browser.sleep(5000);
            // await utilityCommon.closePopUpMessage(); // Defect: status is changed its not automatically reflected on view
            await utilityCommon.refresh(); // Defect: status is changed its not automatically reflected on view
            await browser.sleep(8000); //for page to load
            //await browser.wait(this.EC.visibilityOf(element(by.cssContainingText(this.selectors.statusChange, expectedStatus))), 3000);
        }
    }

    async allStatusOptionsPresent(list: string[]): Promise<boolean> {
        return await $(`[rx-view-component-id="${this.selectors.caseStatusDropDownGuid}"] button`).isPresent().then(async (present) => {
            if (present) return await utilityCommon.isAllDropDownValuesMatches(this.selectors.caseStatusDropDownGuid, list);
            else return await utilityCommon.isAllDropDownValuesMatches(this.selectors.taskStatusDropDownGuid, list);
        });
    }

    async isRequiredTagToResolutionCode(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.resolutionCodeRequiredTagGuid);
    }

    async isRequiredTagToResolutionDescription(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.resolutionDescriptionGuid);
    }

    async getValidationMessage(): Promise<string> {
        return (await $(this.selectors.validationMessage).getText()).trim();
    }
}

export default new UpdateStatus();