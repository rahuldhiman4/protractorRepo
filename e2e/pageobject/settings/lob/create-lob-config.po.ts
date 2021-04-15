import { $, by, protractor, ProtractorExpectedConditions, element } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class DefineLOBCreate {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        fieldName: '.d-textfield__label span, .d-textfield__label',
        nameInput: '[rx-view-component-id="d0c3cc9c-4406-410b-b996-f2144c556d98"] input',
        descriptionInput: '[rx-view-component-id="a850a782-6abf-40e9-b699-de9f6ed54bd7"] textarea',
        toggleBoxGuid: '66077b28-5264-4b3e-b71f-cb7fe922c057',
        emailOutgoingProfileGuid: '76d1ac5c-3c38-47f1-9112-8269f5fd129d',
        saveButton: '[rx-view-component-id="79f8f38a-ca41-49b2-abed-b7f824b4f3fe"] button',
        cancelButton: '[rx-view-component-id="dc15a9e5-ca0a-42b4-a829-4a18797ad0e7"] button',
        status: '[rx-view-component-id="a332355a-1219-481a-a86b-8bc0a93e582c"] span[aria-label="Select box activate"]',
    }

    async isFieldPresent(fieldName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.fieldName, fieldName)).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.fieldName).isDisplayed();
            else return false;
        });
    }

    async setName(name: string): Promise<void> {
        await $(this.selectors.nameInput).clear();
        await $(this.selectors.nameInput).sendKeys(name);
    }

    async setDescription(description: string): Promise<void> {
        await $(this.selectors.descriptionInput).clear();
        await $(this.selectors.descriptionInput).sendKeys(description);
    }

    async setUseAsDefaultValue(value: boolean): Promise<void> {
        await utilityCommon.selectToggleButton(this.selectors.toggleBoxGuid, value);
    }

    async selectEmailOutgoingProfile(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.emailOutgoingProfileGuid, value);
    }

    async saveLob(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async isStatusEnabled(): Promise<boolean> {
        return await $(this.selectors.status).isEnabled();
    }
}

export default new DefineLOBCreate();