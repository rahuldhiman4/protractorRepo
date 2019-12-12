import { $, $$, browser, protractor, ProtractorExpectedConditions } from "protractor";

class MenuItemsConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        status: '[rx-view-component-id="42deb4bb-67da-4350-b92a-60b620d9d271"] .d-textfield__label .ui-select-match',
        saveButton: '[rx-view-component-id="0f58c8ab-46fe-4643-8c42-31409af17d05"] button',
        cancelButton: '[rx-view-component-id="3fbaa9bf-7a3d-42b5-8afe-bc2c0f982520"] button',
        defaultToggle: '[rx-view-component-id="d2fb228a-e6ca-4906-8b60-80537b45d75f"] button',
        MenuOptionLink: '[rx-view-component-id="306a51e0-cb89-45db-9270-c40b4ec3b149"] span',        
        menuNameDropDown: '[rx-view-component-id="da9b9818-7b4c-43ec-9c4b-41e0cda49b8d"] .ui-select-match .btn-default',
        menuOptionId: '[rx-view-component-id="d40aa6f2-090d-4641-9779-ae724673575c"]',
        menuOption: '.d-textfield__label .d-textfield__input[aria-label]',
        statusDropDown: '[rx-view-component-id="a548d907-8c6b-46ab-bc83-88a5310e04b7"] .ui-select-match-text',
        toggleButtonId: '[rx-view-component-id="39a7280b-4078-4f9a-8058-2b0ff972c151"]',
        toggleButtonCheckIcon: '.d-button-group__item .d-icon-check',
        toggleButtonCircleIcon: '.d-icon-circle_slash_o',
    }

    async isToggleButtonPresence(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.toggleButtonId)));
        let statusstr = $(this.selectors.toggleButtonId);
        return await (statusstr.$(this.selectors.toggleButtonCheckIcon)).isDisplayed();
    }

    async isStatusDropDownPresence(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusDropDown)));
        return await $(this.selectors.statusDropDown).isDisplayed();
    }

    async isMenuNameDropDownPresence(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.menuNameDropDown)));
        return await $(this.selectors.menuNameDropDown).isDisplayed();
    }

    async isMenuOptionTextBoxPresence(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.menuOptionId)));
        let menuOptionstr = $(this.selectors.menuOptionId);
        return await (menuOptionstr.$(this.selectors.menuOption)).isDisplayed();
    }

    async clickOnMenuOptionLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.MenuOptionLink)));
        await $(this.selectors.MenuOptionLink).click();
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