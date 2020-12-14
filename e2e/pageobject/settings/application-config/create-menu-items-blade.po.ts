import { by, element, $$, $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';




class CreateNewMenuOptionPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        menuOptionLink: '[rx-view-component-id="306a51e0-cb89-45db-9270-c40b4ec3b149"] button',
        menuNameDropDown: '[rx-view-component-id="5ed046bf-8801-4f76-aa9b-017a944c62a2"] .ui-select-match .btn-default',
        menuNameDropDownGuid: "5ed046bf-8801-4f76-aa9b-017a944c62a2",
        menuOptionId: '[rx-view-component-id="d40aa6f2-090d-4641-9779-ae724673575c"]',
        menuOption: '.d-textfield__label .d-textfield__input[aria-label]',
        statusDropDown: '[rx-view-component-id="a548d907-8c6b-46ab-bc83-88a5310e04b7"] .ui-select-match-text',
        statusDropDownGuid: "a548d907-8c6b-46ab-bc83-88a5310e04b7",
        toggleButtonId: '[rx-view-component-id="39a7280b-4078-4f9a-8058-2b0ff972c151"]',
        toggleButtonGuid: '39a7280b-4078-4f9a-8058-2b0ff972c151',
        localizeLink: '[rx-view-component-id="d40aa6f2-090d-4641-9779-ae724673575c"] .d-icon-left-pencil',
        toggleButtonCheckIcon: '[rx-view-component-id="39a7280b-4078-4f9a-8058-2b0ff972c151"] .d-button-group__item .d-icon-check',
        toggleButtonCircleIcon: '.d-icon-circle_slash_o',
        saveButton: '[rx-view-component-id="010dbf48-bda5-495c-9cb7-6376a28f5c43"] .d-button_primary',
        cancelButton: '[rx-view-component-id="4d21900d-87ce-40b1-839b-01c72ff77014"] .d-button_secondary',
        createNewMenuOptionDialogueBox: 'a.modal-dialog .modal-contentsf',
        menuOptionGuid: 'd40aa6f2-090d-4641-9779-ae724673575c',
    }

    async isCreateNewMenuOptionBladeDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.createNewMenuOptionDialogueBox)));
        return await $(this.selectors.createNewMenuOptionDialogueBox).isEnabled();
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

    async selectMenuNameDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.menuNameDropDownGuid, value);
    }

    async selectStatusDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusDropDownGuid, value);
    }

    async isToggleButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.toggleButtonCheckIcon).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.toggleButtonCheckIcon).isDisplayed();
            else return false;
        });
    }

    async selectAvailableOnUiToggleButton(booleanVal: boolean): Promise<void> {
        await utilCommon.selectToggleButton(this.selectors.toggleButtonGuid, booleanVal);
    }

    async isStatusDropDownPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusDropDown)));
        return await $(this.selectors.statusDropDown).isDisplayed();
    }

    async isMenuNameDropDownPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.menuNameDropDown)));
        return await $(this.selectors.menuNameDropDown).isDisplayed();
    }

    async isMenuOptionTextBoxPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.menuOptionId)));
        let menuOptionstr = $(this.selectors.menuOptionId);
        return await (menuOptionstr.$(this.selectors.menuOption)).isDisplayed();
    }

    async clickOnMenuOptionLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.menuOptionLink)));
        await $(this.selectors.menuOptionLink).click();
    }

    async isMenuOptionLinkEnabled(): Promise<boolean> {
        return await $(this.selectors.menuOptionLink).isEnabled();
    }

    async isSaveButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.saveButton).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.saveButton).isDisplayed();
            else return false;
        });
    }

    async isCancelButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.cancelButton).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.cancelButton).isDisplayed();
            else return false;
        });
    }

    async isMenuNameDropDownValuesMatches(list: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.menuNameDropDownGuid, list);
    }

    async isStatusDropDownValuesMatches(list: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.statusDropDownGuid, list);
    }

    async isMenuNameFieldRequired(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.menuNameDropDownGuid);
    }

    async isMenuOptionFieldRequired(): Promise<boolean> {
        let menuOptionElementRequiredTag = await $('[rx-view-component-id="d40aa6f2-090d-4641-9779-ae724673575c"] span.d-textfield__item');
        return await utilCommon.isRequiredTagToFieldElement(menuOptionElementRequiredTag);
    }

    async isStatusFieldRequired(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.statusDropDownGuid);
    }


}

export default new CreateNewMenuOptionPage();
