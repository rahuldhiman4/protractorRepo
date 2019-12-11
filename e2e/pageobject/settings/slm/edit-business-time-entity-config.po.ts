import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from "../../../utils/util.common";

class BusinessTimeEntityConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        statusGuid: 'e6580e6c-ad80-4c7b-95b6-6eeb49a7c1b4',
        cancelButton: '[rx-view-component-id="a7b0e590-1510-4699-876f-abb7d4a48501"] button',
        saveButton: '[rx-view-component-id="30231146-89f7-4b2f-ba67-f9c82cc6be5c"] button',
        addBusinessSegmentButton: '[rx-view-component-id="1c0ba5ae-eb9d-4ee5-930f-e7ce1d64eaa5"] button',
        shortDescriptionSelectAll: '[rx-view-component-id="12f7ba30-ac36-42eb-8093-13350432ccc0"] div[aria-label="Select all rows"]',
        removeShortDecriptionButton: '[rx-view-component-id="e0c76495-ac85-475d-8161-bd5abce6d72e"] button'
    }

    async updateStatus(status: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await utilCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async isSaveBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

    async isAddBusinessSegmentBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        return await $(this.selectors.addBusinessSegmentButton).getAttribute("disabled") == "true";
    }

    async selectAllShortDescription(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.shortDescriptionSelectAll).click();
    }

    async isRemoveBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.removeShortDecriptionButton)));
        return await $(this.selectors.removeShortDecriptionButton).getAttribute("disabled") == "true";
    }

}

export default new BusinessTimeEntityConfigEditPage();