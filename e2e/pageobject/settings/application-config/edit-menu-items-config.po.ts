import { $, $$, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class MenuItemsConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        status: '[rx-view-component-id="42deb4bb-67da-4350-b92a-60b620d9d271"] button',
        saveButton: '[rx-view-component-id="0f58c8ab-46fe-4643-8c42-31409af17d05"] button',
        cancelButton: '[rx-view-component-id="3fbaa9bf-7a3d-42b5-8afe-bc2c0f982520"] button',
        defaultToggle: '[rx-view-component-id="d2fb228a-e6ca-4906-8b60-80537b45d75f"] button',
        menuNameDropDown: '[rx-view-component-id="181d2e28-3cbe-4bcd-9489-2015adbb6e37"] button',
        localizeLink: '[rx-view-component-id="7db36dc7-3a4a-4be7-877a-cb44d4c39ecd"] .d-icon-left-pencil',
        statusDropDownGuid: '42deb4bb-67da-4350-b92a-60b620d9d271',
        toggleButtonGuid: 'd2fb228a-e6ca-4906-8b60-80537b45d75f',
        sourceDisableMessage: '[rx-view-component-id="ecfcd0c5-121a-47c0-ba8f-4e97c8c40483"] p',
        lobValue: '[rx-view-component-id="7878abb1-a138-4721-9717-14641148a87d"] .pull-left'
    }

    async isMenuNameDropDownEnabled(): Promise<boolean> {
        return await $(this.selectors.menuNameDropDown).getAttribute("disabled") == "false";
    }

    async clickOnSaveButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async clickOnLocalizeLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.localizeLink)));
        await $(this.selectors.localizeLink).click();
    }

    async isLocalizeLinkEnabled(): Promise<void> {
        await $(this.selectors.localizeLink).isEnabled();
    }

    async selectStatusDropDown(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusDropDownGuid, value);
    }

    async isStatusDropDownValuesMatch(value: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.statusDropDownGuid, value);
    }

    async selectAvailableOnUIToggleButton(booleanVal: boolean): Promise<void> {
        await utilityCommon.selectToggleButton(this.selectors.toggleButtonGuid, booleanVal);
    }

    async isMenuItemsStatusDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        return await $(this.selectors.status).getAttribute("aria-disabled") == "true";
    }

    async isSaveButtonDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

    async isDefaultToggleBtnDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.cancelButton)));
        let readProperty1: string = await $$(this.selectors.defaultToggle).get(0).getAttribute("disabled");
        let readProperty2: string = await $$(this.selectors.defaultToggle).get(1).getAttribute("disabled");
        return (readProperty1 == "true" && readProperty2 == "true");
    }

    async getSourceDisabledMessage(): Promise<string> {
        return await $(this.selectors.sourceDisableMessage).getText();;
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new MenuItemsConfigEditPage();