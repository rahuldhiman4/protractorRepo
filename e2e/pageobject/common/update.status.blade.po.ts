import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../utils/utility.common';

class UpdateStatus {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        caseStatusDropDownGuid: '3c8d9278-fc1f-430c-b866-cdc9d217318b',
        taskStatusDropDownGuid: '8b4cef48-0a4c-4ec1-bc4c-cce47179c964',
        caseStatusReasonDropDownGuid: '049c43a1-4cbd-482d-980d-5db4ed78f295',
        taskStatusReasonDropDownGuid: 'baf69b56-c37b-4a0b-9e68-f18558738ebb',
        caseStatusDropDown: '[rx-view-component-id="3c8d9278-fc1f-430c-b866-cdc9d217318b"] button',
        caseStatusReasonDropDown: '[rx-view-component-id="7128b36c-5d4f-4333-8ee4-2a5163258a45"] button',
        resolutionCodeDropDownGuid: 'fb07b5ff-3c9b-454a-8b0c-a1dfd9987856',
        resolutionCodeRequiredTagGuid: 'f9779ced-7b19-4c6d-ad3a-dfb0acb355d0',
        saveUpdateStatus: '[rx-view-component-id="ee5dd503-a10e-4d22-9ac5-99c400892bb7"] button, [rx-view-component-id="6759ba60-df0d-4d5e-8eb9-5101490fd4d4"] button',
        cancelUpdateStatus: '[rx-view-component-id="7cffd3f8-5b84-4e7f-a4b3-6c0a3dd27855"] button, [rx-view-component-id="debcdc88-fb42-4003-96d6-1eeb807206b7"] button',
        statusChange: '.status-transition',
        statusChangeReason: '[rx-view-component-id="049c43a1-4cbd-482d-980d-5db4ed78f295"]',
        searchInput: 'input[type="search"]',
        resolutionDescriptionTextBox: '.bwf-text-area-edit .bwf-description-textarea-edit',
        resolutionDescriptionGuid: '486a9101-526f-4058-a0e2-3c9e5fab1a36',
        validationMessage: '[rx-view-component-id="a1072f99-4036-4e2e-8e62-e72b2ba22344"] p'
    }

    async allStatusReasonOptionsPresent(list: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.caseStatusReasonDropDownGuid, list);
    }

    async clearStatusReason(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChangeReason)));
        await $(this.selectors.statusChangeReason + " " + this.selectors.searchInput).clear();
    }

    async clickCancelButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelUpdateStatus)));
        await $(this.selectors.cancelUpdateStatus).click();
    }

    async changeStatus(statusValue: string): Promise<void> {
        let isCaseStatusBlade: boolean = await element(by.css(this.selectors.caseStatusDropDown)).isPresent();
        if (isCaseStatusBlade) await utilityCommon.selectDropDown(this.selectors.caseStatusDropDownGuid, statusValue);
        else await utilityCommon.selectDropDown(this.selectors.taskStatusDropDownGuid, statusValue);
    }

    async setStatusReason(statusReasonValue: string): Promise<void> {
        let isCaseStatusBlade: boolean = await element(by.css(this.selectors.caseStatusDropDown)).isPresent();
        if (isCaseStatusBlade) await utilityCommon.selectDropDown(this.selectors.caseStatusReasonDropDownGuid, statusReasonValue);
        else await utilityCommon.selectDropDown(this.selectors.taskStatusReasonDropDownGuid, statusReasonValue);
    }

    async clickOnstatusReason(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChangeReason)));
        await $(this.selectors.statusChangeReason).click();
    }

    async changeCaseStatus(statusValue: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        await this.changeStatus(statusValue);
    }

    async isResolutionDescriptionTextBoxEmpty(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.resolutionDescriptionTextBoxId)));
        let statusstr = await $(this.selectors.resolutionDescriptionTextBox).getAttribute('value');
        if (statusstr == '') {
            return true
        }
        else return false;
    }


    async setResolutionDescription(description: string): Promise<void> {
        await $(this.selectors.resolutionDescriptionTextBox).sendKeys(description);
    }

    async selectResolutionCode(resolutionCode: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.resolutionCodeRequiredTagGuid, resolutionCode);
    }

    async isStatusReasonRequiredTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.summary)));
        return await utilityCommon.isRequiredTagToField(this.selectors.caseStatusReasonDropDownGuid);
    }

    async isChangeStatusFieldPresent(): Promise<boolean> {
        return await element(by.css(this.selectors.caseStatusDropDown)).isPresent();
    }

    async isStatusReasonFieldPresent(): Promise<boolean> {
        return await element(by.css(this.selectors.caseStatusReasonDropDown)).isPresent();
    }

    async isSaveUpdateStatusButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveUpdateStatus).isEnabled();
    }

    async isCancelUpdateStatusButtonPresent(): Promise<boolean> {
        return await element(by.css(this.selectors.cancelUpdateStatus)).isPresent();
    }

    async clickSaveStatus(expectedStatus?: string): Promise<void> {
        await $(this.selectors.saveUpdateStatus).click();
        // await browser.wait(this.EC.invisibilityOf($(this.selectors.saveUpdateStatus)), 3000);
        if (expectedStatus) {
            await browser.wait(this.EC.visibilityOf(element(by.cssContainingText(this.selectors.statusChange, expectedStatus))), 3000);
        }
    }

    async allStatusOptionsPresent(list: string[]): Promise<boolean> {
        let isCaseStatusdropDownGid: boolean = await element(by.css(this.selectors.caseStatusDropDown)).isPresent();
        if (isCaseStatusdropDownGid) return await utilityCommon.isAllDropDownValuesMatches(this.selectors.caseStatusDropDownGuid, list);
        else return await utilityCommon.isAllDropDownValuesMatches(this.selectors.taskStatusDropDownGuid, list);
    }

    async isRequiredTagToResolutionCode(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.resolutionCodeRequiredTagGuid);
    }

    async isRequiredTagToResolutionDescription(): Promise<boolean> {
        let resolutionDescriptionrequired = await $('[rx-view-component-id="486a9101-526f-4058-a0e2-3c9e5fab1a36"] label span');
        return await utilityCommon.isRequiredTagToFieldElement(resolutionDescriptionrequired);
    }

    async getValidationMessage(): Promise<string> {
        return (await $(this.selectors.validationMessage).getText()).trim();
    }
}

export default new UpdateStatus();