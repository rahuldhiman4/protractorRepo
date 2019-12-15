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
        toogleButtonGuid:'d2fb228a-e6ca-4906-8b60-80537b45d75f',      
    }

    async clickOnSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnSaveButtonOfLocalizeValue(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(createMenuItems.selectors.saveButtonLocalizevalue)));
        await $(createMenuItems.selectors.saveButtonLocalizevalue).click();
        await utilCommon.waitUntilPopUpDisappear();
    }

    async valueTextBox(str:string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(createMenuItems.selectors.valueTextBox)));
        await $(createMenuItems.selectors.valueTextBox).sendKeys(str);
    }
    
    async clickOnLocalizeLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(createMenuItems.selectors.localizeLink)));
        await $(createMenuItems.selectors.localizeLink).click();
    }

    async selectStatusDropDown(value:string): Promise<void> {
        await utilCommon.selectDropDown(createMenuItems.selectors.statusDropDownGuid,value);
    }

    async selectAvailableOnUiToggleButton(booleanVal:boolean): Promise<void> {
        await utilCommon.selectToggleButton(createMenuItems.selectors.toggleButtonGuid,booleanVal);
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