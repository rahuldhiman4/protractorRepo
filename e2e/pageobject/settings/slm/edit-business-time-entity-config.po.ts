import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from "../../../utils/utility.common";

class BusinessTimeEntityConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        statusGuid: 'e6580e6c-ad80-4c7b-95b6-6eeb49a7c1b4',
        cancelButton: '[rx-view-component-id="a7b0e590-1510-4699-876f-abb7d4a48501"] button',
        saveButton: '[rx-view-component-id="30231146-89f7-4b2f-ba67-f9c82cc6be5c"] button',
        addBusinessSegmentButton: '[rx-view-component-id="1c0ba5ae-eb9d-4ee5-930f-e7ce1d64eaa5"] button',
        shortDescriptionSelectAll: '[rx-view-component-id="12f7ba30-ac36-42eb-8093-13350432ccc0"] div.checkbox__label',
        removeShortDecriptionButton: '[rx-view-component-id="12f7ba30-ac36-42eb-8093-13350432ccc0"] div.checkbox__label'
    }

    async updateStatus(status: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async isSaveBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

    async isAddBusinessSegmentBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.addBusinessSegmentButton).getAttribute("disabled") == "true";
    }

    async selectAllShortDescription(): Promise<void> {
        await $(this.selectors.shortDescriptionSelectAll).click();
    }

    async isRemoveBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.removeShortDecriptionButton).getAttribute("disabled") == "true";
    }

}

export default new BusinessTimeEntityConfigEditPage();