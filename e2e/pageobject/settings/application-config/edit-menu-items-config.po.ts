import { $, $$, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';
import createMenuItems from '../../../pageobject/settings/application-config/create-menu-items-blade.po';

class MenuItemsConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        status: '[rx-view-component-id="42deb4bb-67da-4350-b92a-60b620d9d271"] .d-textfield__label .ui-select-match',
        saveButton: '[rx-view-component-id="0f58c8ab-46fe-4643-8c42-31409af17d05"] button',
        cancelButton: '[rx-view-component-id="3fbaa9bf-7a3d`-42b5-8afe-bc2c0f982520"] button',
        defaultToggle: '[rx-view-component-id="d2fb228a-e6ca-4906-8b60-80537b45d75f"] button',
        menuNameDropDown: '[rx-view-component-id="181d2e28-3cbe-4bcd-9489-2015adbb6e37"] .btn-default',
        saveButtonLocalizevalue: '.d-button_primary[rx-id="save-button"]',
        valueTextBox: '.d-textfield__input[aria-label="Value for default locale"]',
        localizeLink: '[rx-view-component-id="7db36dc7-3a4a-4be7-877a-cb44d4c39ecd"] .d-icon-left-pencil',
        statusDropDownGuid: '42deb4bb-67da-4350-b92a-60b620d9d271',
        toggleButtonGuid: 'd2fb228a-e6ca-4906-8b60-80537b45d75f',
    }

    async isMenuNameDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.menuNameDropDown)));
        return await $(this.selectors.menuNameDropDown).getAttribute('aria-disabled')=='true';
    }

    async clickOnSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async clickOnSaveButtonOfLocalizeValue(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButtonLocalizevalue)));
        await $(this.selectors.saveButtonLocalizevalue).click();
        await utilCommon.waitUntilPopUpDisappear();
    }

    async valueTextBox(str:string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.valueTextBox)));
        await $(this.selectors.valueTextBox).sendKeys(str);
    }
    
    async clearValueTextBox(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.valueTextBox)));
        await $(this.selectors.valueTextBox).clear();
    }

    async clickOnLocalizeLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.localizeLink)));
        await $(this.selectors.localizeLink).click();
    }

    async selectStatusDropDown(value:string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusDropDownGuid,value);
    }

    async selectAvailableOnUiToggleButton(booleanVal:boolean): Promise<void> {
        await utilCommon.selectToggleButton(this.selectors.toggleButtonGuid,booleanVal);
    }

    async isMenuItemsStatusDisabled(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        return await $(this.selectors.status).getAttribute("readonly") == "true";
    }

    async isSaveButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

    async isDefaultToggleBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.cancelButton)));
        let readProperty1: string = await $$(this.selectors.defaultToggle).get(0).getAttribute("disabled");
        let readProperty2: string = await $$(this.selectors.defaultToggle).get(1).getAttribute("disabled");
        return (readProperty1 == "true" && readProperty2 == "true");
    }
    

}

export default new MenuItemsConfigEditPage();