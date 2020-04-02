import { $, protractor, ProtractorExpectedConditions, element,by } from "protractor";
import utilCommon from '../../utils/util.common';

class UpdateStatus {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        statusDropDown: '[rx-view-component-id="3c8d9278-fc1f-430c-b866-cdc9d217318b"], [rx-view-component-id="8b4cef48-0a4c-4ec1-bc4c-cce47179c964"]',
        statusReasonDropDown: '[rx-view-component-id="049c43a1-4cbd-482d-980d-5db4ed78f295"], [rx-view-component-id="baf69b56-c37b-4a0b-9e68-f18558738ebb"]',
        resolutionCodeDropDownGuid: 'fb07b5ff-3c9b-454a-8b0c-a1dfd9987856',
        statusReasonGuid: '049c43a1-4cbd-482d-980d-5db4ed78f295',
        saveUpdateStatus: '[rx-view-component-id="ee5dd503-a10e-4d22-9ac5-99c400892bb7"] button',
        cancelUpdateStatus: '[rx-view-component-id="7cffd3f8-5b84-4e7f-a4b3-6c0a3dd27855"] button',  
        statusChange: '[rx-view-component-id="48bbcbbf-564c-4d46-8dc2-1e7670c187ff"] .status-transition',
        statusChangeReason: '[rx-view-component-id="049c43a1-4cbd-482d-980d-5db4ed78f295"]',
        statusChangeReasonGuid: '049c43a1-4cbd-482d-980d-5db4ed78f295',
        statusList: '[rx-view-component-id="3c8d9278-fc1f-430c-b866-cdc9d217318b"] .ui-select__rx-choice',
        searchInput: 'input[type="search"]', 
        statusDropDownGuid: '3c8d9278-fc1f-430c-b866-cdc9d217318b',  
    }

    async allStatusReasonOptionsPresent(list: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.statusChangeReasonGuid, list);
    }

    async isStatusReasonOptionDisplayed(statusValue: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChangeReason)));
        await $(this.selectors.statusChangeReason).click();
        const statusReason = $(this.selectors.statusChangeReason);
        //        await browser.wait(this.EC.elementToBeClickable(statusReason.$(this.selectors.searchInput)));
        await (statusReason.$(this.selectors.searchInput)).sendKeys(statusValue);
        return await element(by.cssContainingText((this.selectors.statusChangeReason + ' .ui-select__rx-choice'), statusValue)).isDisplayed();
    }

    async clearStatusReason(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChangeReason)));
        await $(this.selectors.statusChangeReason + " " + this.selectors.searchInput).clear();
    }

    async clickOnCancelButtonOfUpdateStatus(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelUpdateStatus)));
        await $(this.selectors.cancelUpdateStatus).click();
    }

    async changeStatus(statusValue: string): Promise<void> {
        await utilCommon.selectDropDown2($(this.selectors.statusDropDown), statusValue);
    }

    async setStatusReason(statusReasonValue: string): Promise<void> {
        await utilCommon.selectDropDown2($(this.selectors.statusReasonDropDown), statusReasonValue);
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


    async selectResolutionCode(resolutionCode: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.resolutionCodeDropDownGuid, resolutionCode);
    }

    async isStatusReasonRequiredTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.summary)));
        return await utilCommon.isRequiredTagToField(this.selectors.statusReasonGuid);
    }

    async isChangeStatusFieldPresent(): Promise<boolean> {
        return await element(by.css(this.selectors.statusDropDown)).isPresent();
    }

    async isStatusReasonFieldPresent(): Promise<boolean> {
        return await element(by.css(this.selectors.statusReasonDropDown)).isPresent();
    }

    async isSaveUpdateStatusButtonPresent(): Promise<boolean> {
        return await element(by.css(this.selectors.saveUpdateStatus)).isEnabled();
    }

    async isCancelUpdateStatusButtonPresent(): Promise<boolean> {
        return await element(by.css(this.selectors.cancelUpdateStatus)).isPresent();
    }

    async clickSaveStatus(expectedStatus?: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveUpdateStatus)));
        await $(this.selectors.saveUpdateStatus).click();
        //        if (expectedStatus) {
        //            await browser.wait(this.EC.visibilityOf(element(by.cssContainingText(this.selectors.statusChange, expectedStatus))));
        //        }
        //        await utilCommon.waitUntilPopUpDisappear();
    }
    async allStatusOptionsPresent(list: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.statusDropDownGuid, list);
    }

}

export default new UpdateStatus();