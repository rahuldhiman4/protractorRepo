import { $, protractor, ProtractorExpectedConditions, $$, element, by, browser } from "protractor";
import utilCommon from '../../../utils/util.common';
class EditNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        cancelButton: '[rx-view-component-id="2a50e7b7-b260-4749-ad9d-1d7cb65b5d95"] button',
        header: '.modal-title',
        saveButton: '[rx-view-component-id="50e25982-5452-4f20-ac79-5682de7cb467"] button',
        clickOnEmailTab: 'li.rx-tab a',
        editButtonOnEmailTab: '[rx-view-component-id="0306ec1b-e16e-416d-952d-b39c3a8336f0"] button',
        selectCheckBoxEmailTab: '[rx-view-component-id="66f56078-f1e0-4946-a41c-f0624ba3b4a8"] .ui-grid-selection-row-header-buttons',
        selectAlertSubjectCheckbox: '[rx-view-component-id="2c84ca97-2ff6-4325-ae14-3f2ed0c556ac"] .ui-grid-selection-row-header-buttons',
        editCheckbox: 'button.d-icon-left-pencil',
        clickableField: 'div.cke_contents.cke_reset span',
        cancelAlertMessageTextButton: '[rx-view-component-id="780514cc-7344-44a5-88af-5af509619ab0"] button',
        defaultNotificationMethodGuid: "911e28fd-89bb-4ee0-bea9-1d22e48f1134",
        description: '[rx-view-component-id="48a3c0ad-103c-4b1b-a8a0-3e0648ff6ab6"] input',
        event: '[rx-view-component-id="15aad4c8-1522-4586-b9d3-6be376cfcaa8"] .ui-select-toggle',
        addRecipentsBtn: '[rx-view-component-id="9c294d12-1577-44fd-950d-fe7021853558"] button',
        addLocalizedMessageBtn: '[rx-view-component-id="a93ae1ed-3ae3-42cc-8f2b-6ce26fcc1f91"] button',
        alertMessageBox: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .d-textfield div',
        emailSubjectBox: '[rx-view-component-id="2edd6ab4-d1e5-456e-879c-f8ca22bfbb32"] textarea',
        emailBodyMessageBox: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .d-textfield div',
        cancelEmailSubjectBlade: '[rx-view-component-id="8335618d-2a88-49d1-9002-e5b7601b7674"] button',
        cancelEmailBodyBlade: '[rx-view-component-id="780514cc-7344-44a5-88af-5af509619ab0"] button'
    }

    async selectCheckBoxOfBody(): Promise<void> {
        await $$(this.selectors.selectCheckBoxEmailTab).get(1).click();
    }

    async selectDefaultNotificationMethod(notification: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.defaultNotificationMethodGuid, notification);
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async getHeaderText(): Promise<string> {
        return await $(this.selectors.header).getText();
    }

    async clickOnEmailTab(): Promise<void> {
        await $(this.selectors.clickOnEmailTab).click();
    }

    async clickOnEditButtonOfEmailTab(): Promise<void> {
        await $(this.selectors.editButtonOnEmailTab).click();
    }

    async openAlertEditMessageText(): Promise<void> {
        await $(this.selectors.selectAlertSubjectCheckbox).click();
        await $$(this.selectors.editCheckbox).first().click();
    }

    async isFieldClickable(fieldName: string): Promise<boolean> {
        let fieldLocator = await element(by.cssContainingText(this.selectors.clickableField, fieldName));
        let attributeValue: string = undefined;
        await browser.wait(this.EC.visibilityOf(fieldLocator), 10000).then(async () => {
            attributeValue = await fieldLocator.getAttribute('class');
        });
        return attributeValue == 'clickable_class';
    }

    async cancelAlertMessageText(): Promise<void> {
        await $(this.selectors.cancelAlertMessageTextButton).click();
    }

    async openEmailBodyEditMessageText(): Promise<void> {
        await this.selectCheckBoxOfBody();
        await $$(this.selectors.editCheckbox).last().click();
    }

    async openEmailSubjectEditMessageText(): Promise<void> {
        await $$(this.selectors.selectCheckBoxEmailTab).get(0).click();
        await $$(this.selectors.editCheckbox).last().click();
    }

    async isDescriptionFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.description).getAttribute('readonly') == 'true';
    }

    async isEventDropdownDisabled(): Promise<boolean> {
        return await $(this.selectors.event).getAttribute('disabled') == 'true';
    }

    async isAddLocalizedButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.addLocalizedMessageBtn).isEnabled();
    }

    async isAddRecipientButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.addRecipentsBtn).isEnabled();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }

    async isAlertSubjectMessageDisabled(): Promise<boolean> {
        return await $(this.selectors.alertMessageBox).getAttribute('class') =='rtf-read-only';
    }

    async isEmailSubjectMessageDisabled(): Promise<boolean> {
        return await $(this.selectors.emailSubjectBox).getAttribute('readonly') == 'true';
    }

    async isEmailBodyMessageDisabled(): Promise<boolean> {
        return await $(this.selectors.emailBodyMessageBox).getAttribute('class') =='rtf-read-only';
    }

    async cancelEmailSubjectBlade(): Promise<void> {
        await $(this.selectors.cancelEmailSubjectBlade).click();
    }

    async cancelEmailBodyBlade(): Promise<void> {
        await $(this.selectors.cancelEmailBodyBlade).click();
    }
}
export default new EditNotificationTemplate();