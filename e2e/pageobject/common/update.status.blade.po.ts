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
        saveUpdateStatus: '[rx-view-component-id="ee5dd503-a10e-4d22-9ac5-99c400892bb7"] button',
        cancelUpdateStatus: '[rx-view-component-id="7cffd3f8-5b84-4e7f-a4b3-6c0a3dd27855"] button',
        statusChange: '[rx-view-component-id="48bbcbbf-564c-4d46-8dc2-1e7670c187ff"] .status-transition',
        statusChangeReason: '[rx-view-component-id="049c43a1-4cbd-482d-980d-5db4ed78f295"]',
        searchInput: 'input[type="search"]',
        resolutionDescriptionTextBoxId: '[rx-view-component-id="d98df37c-7a96-43c3-bf69-2e6e735031ae"] textarea',
    }

    async allStatusReasonOptionsPresent(list: string[]): Promise<boolean> {
        return await utilityCommon.isDropDownValueDisplayed(this.selectors.caseStatusReasonDropDownGuid, list);
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
        let statusstr = await $(this.selectors.resolutionDescriptionTextBoxId).getAttribute('value');
        if (statusstr == '') {
            return true
        }
        else return false;
    }

    async selectResolutionCode(resolutionCode: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.resolutionCodeDropDownGuid, resolutionCode);
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

    async isSaveUpdateStatusButtonPresent(): Promise<boolean> {
        return await element(by.css(this.selectors.saveUpdateStatus)).isEnabled();
    }

    async isCancelUpdateStatusButtonPresent(): Promise<boolean> {
        return await element(by.css(this.selectors.cancelUpdateStatus)).isPresent();
    }

    async clickSaveStatus(expectedStatus?: string): Promise<void> {
        await $(this.selectors.saveUpdateStatus).click();
        await browser.wait(this.EC.invisibilityOf($(this.selectors.saveUpdateStatus)), 3000);
        if (expectedStatus) {
            await browser.wait(this.EC.visibilityOf(element(by.cssContainingText(this.selectors.statusChange, expectedStatus))), 3000);
        }
    }

    async allStatusOptionsPresent(list: string[]): Promise<boolean> {
        return await utilityCommon.isDropDownValueDisplayed(this.selectors.caseStatusDropDownGuid, list);
    }

}

export default new UpdateStatus();