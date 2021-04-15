import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class CreateNewMenuOptionPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        menuOptionLink: '[rx-view-component-id="306a51e0-cb89-45db-9270-c40b4ec3b149"] button',
        menuNameDropDown: '[rx-view-component-id="56199a5a-344f-4b2a-85ac-2a60c6ab1882"] button',
        menuNameDropDownGuid: "56199a5a-344f-4b2a-85ac-2a60c6ab1882",
        menuOptionId: '[rx-view-component-id="d40aa6f2-090d-4641-9779-ae724673575c"]',
        menuOption: 'input',
        statusDropDown: '[rx-view-component-id="a548d907-8c6b-46ab-bc83-88a5310e04b7"] button',
        statusDropDownGuid: "a548d907-8c6b-46ab-bc83-88a5310e04b7",
        toggleButtonId: '[rx-view-component-id="39a7280b-4078-4f9a-8058-2b0ff972c151"]',
        toggleButtonGuid: '39a7280b-4078-4f9a-8058-2b0ff972c151',
        localizeLink: '[rx-view-component-id="d40aa6f2-090d-4641-9779-ae724673575c"] .d-icon-left-pencil',
        toggleButtonCheckIcon: '[rx-view-component-id="39a7280b-4078-4f9a-8058-2b0ff972c151"] button[rx-id="true-button"]',
        toggleButtonCircleIcon: '[rx-view-component-id="39a7280b-4078-4f9a-8058-2b0ff972c151"] button[rx-id="false-button"]',
        saveButton: '[rx-view-component-id="010dbf48-bda5-495c-9cb7-6376a28f5c43"] button',
        cancelButton: '[rx-view-component-id="4d21900d-87ce-40b1-839b-01c72ff77014"] button',
        createNewMenuOptionDialogueBox: 'a.modal-dialog .modal-contentsf',
        menuOptionGuid: 'd40aa6f2-090d-4641-9779-ae724673575c',
        lob: '[rx-view-component-id="4f8a0a84-a222-45d2-93b2-19889499860b"] button div',
        lobValue: '[rx-view-component-id="21ec7b66-2f5f-4c92-baa1-ce5721dafa4d"] .pull-left',
    }

    async isCreateNewMenuOptionBladeDisplayed(): Promise<boolean> {
        return await $(this.selectors.createNewMenuOptionDialogueBox).isEnabled();
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async clickOnLocalizeLink(): Promise<void> {
        await $(this.selectors.localizeLink).click();
    }

    async selectMenuNameDropDown(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.menuNameDropDownGuid, value);
    }

    async selectStatusDropDown(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusDropDownGuid, value);
    }

    async isToggleButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.toggleButtonCheckIcon).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.toggleButtonCheckIcon).isDisplayed();
            else return false;
        });
    }

    async selectAvailableOnUiToggleButton(booleanVal: boolean): Promise<void> {
        await utilityCommon.selectToggleButton(this.selectors.toggleButtonGuid, booleanVal);
    }

    async isStatusDropDownPresent(): Promise<boolean> {
        return await $(this.selectors.statusDropDown).isDisplayed();
    }

    async isLineOfBusinessEnabled(): Promise<boolean> {
        return await $(this.selectors.lob).isEnabled();
    }

    async isMenuNameDropDownPresent(): Promise<boolean> {
        return await $(this.selectors.menuNameDropDown).isDisplayed();
    }

    async isMenuOptionTextBoxPresent(): Promise<boolean> {
        let menuOptionstr = $(this.selectors.menuOptionId);
        return await (menuOptionstr.$(this.selectors.menuOption)).isDisplayed();
    }

    async clickOnMenuOptionLink(): Promise<void> {
        await $(this.selectors.menuOptionLink).click();
    }

    async isMenuOptionLinkEnabled(): Promise<boolean> {
        return await $(this.selectors.menuOptionLink).isEnabled();
    }

    async isMenuOptionLinkPresent(): Promise<boolean> {
        return await $(this.selectors.menuOptionLink).isPresent();
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
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.menuNameDropDownGuid, list);
    }

    async isStatusDropDownValuesMatches(list: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.statusDropDownGuid, list);
    }

    async isMenuNameFieldRequired(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.menuNameDropDownGuid);
    }

    async isMenuOptionFieldRequired(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.menuOptionGuid);
    }

    async isStatusFieldRequired(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.statusDropDownGuid);
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lob).getAttribute("value");
    }
}

export default new CreateNewMenuOptionPage();
