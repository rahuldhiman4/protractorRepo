import { DropDownType } from "../../../utils/constants";
import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
class EditNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        cancelButton: '.rx-action-button_secondary button.btn-secondary',
        header: '.dp-title',
        saveButton: '[rx-view-component-id="8b5f78b0-0aa8-40da-8d52-66d5afe1356b"] button',
        emailTab: 'li.nav-item button[aria-posinset="2"]',
        editButtonOnEmailTab: '[rx-view-component-id="4436dca0-329b-406f-8dd9-ab686df3f4b8"] button.d-icon-left-pencil',
        checkBoxEmailTab: '[rx-view-component-id="4436dca0-329b-406f-8dd9-ab686df3f4b8"] .radio__label input',
        alertSubjectCheckbox: '[rx-view-component-id="54e4673e-6717-4f72-98e2-4251ee72d702"] label.radio__label',
        editCheckbox: '.d-icon-left-pencil',
        clickableField: 'div.cke_contents.cke_reset span[contenteditable]',
        cancelAlertMessageTextButton: '[rx-view-component-id="780514cc-7344-44a5-88af-5af509619ab0"] button',
        defaultNotificationMethodGuid: "c80f9de5-1a84-46fa-949d-fc073d65ebd8",
        description: '[rx-view-component-id="73750a2f-4d74-4919-b0e4-fbc8e1b4167a"] textarea',
        event: '[rx-view-component-id="f535976d-f547-460a-8fa6-f959eb485d38"] button',
        addRecipientsBtn: '[rx-view-component-id="73a718fa-c683-48b0-b211-97b3744d7c3f"] button',
        addLocalizedMessageBtn: '[rx-view-component-id="92468fc7-a2b9-46b4-8ad9-c2cfe12c9d8b"] button',
        alertMessageBox: 'a.cke_button',
        emailSubjectMessage: '[rx-view-component-id="2edd6ab4-d1e5-456e-879c-f8ca22bfbb32"] textarea',
        emailSubjectBox: '[rx-view-component-id="ffb54436-9f83-437a-8606-94deb68c85f3"] input',
        emailBodyMessageBox: '.cke_contents div',
        cancelEmailSubjectBlade: '[rx-view-component-id="8335618d-2a88-49d1-9002-e5b7601b7674"] button',
        cancelEmailBodyBlade: '[rx-view-component-id="780514cc-7344-44a5-88af-5af509619ab0"] button',
        moduleNameText: '[rx-view-component-id="bdd94b56-3700-4876-8455-62f1e1b05ff6"] button div',
        eventNameText: '[rx-view-component-id="f535976d-f547-460a-8fa6-f959eb485d38"] button div',
        searchRecipient: '[rx-view-component-id="115b11c9-9847-4747-8285-7689088705da"] .adapt-search',
        applyButton: '[rx-view-component-id="115b11c9-9847-4747-8285-7689088705da"] .filter-list [btn-type="primary"]',
        fieldLabels: '[rx-view-component-id="115b11c9-9847-4747-8285-7689088705da"] .form-control-label span, [rx-view-component-id="115b11c9-9847-4747-8285-7689088705da"] .bwf-footer button, [rx-view-component-id="115b11c9-9847-4747-8285-7689088705da"] .border-top button',
        recipientTypeSelect: '[id="adapt-select-37"] .dropdown-toggle',
        selectRecipient: '.rx-recipients-assignment-person-fullName, .rx-recipients-assignment-person-structure',
        recipientList: '.body tr td',
        unCheckEmailGridvalue: '[rx-view-component-id="4436dca0-329b-406f-8dd9-ab686df3f4b8"] input[type="radio"]',
        recipientsCheckbox: '.body tr td label span input',
        recipientsCheckboxInput: '.body tr td label span input',
        notificationMethod: '[rx-view-component-id="c80f9de5-1a84-46fa-949d-fc073d65ebd8"] .dropdown',
        emailBasedApprovalFlag: '[rx-view-component-id="99cd2540-80fa-4dbe-96b9-bbadc2fcc93c"] button',
        emailSubject: '[rx-view-component-id="87825f39-f76b-4a2b-9d04-1e521562dc00"] input',
        saveAlertEmailSubjectBody: '[rx-view-component-id="498a2cf3-8866-4303-996a-61dc33e4a400"] button, [rx-view-component-id="cd6ddce5-4729-4cc9-a5a4-6f76e967de03"] button, [rx-view-component-id="498a2cf3-8866-4303-996a-61dc33e4a400"] button',
        emailBody: '.cke_editable_themed p, .cke_editable_themed p u, .cke_editable_themed p span i',
        emailBasedApplrovalTrueFlag: '[rx-view-component-id="99cd2540-80fa-4dbe-96b9-bbadc2fcc93c"] button.btn-primary',
        cancelButtonAddRecipient: '.float-right button.btn-secondary',
        alertInsertField: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_button__rtfexpressioneditor_icon',
        searchRecipeint: '[rx-view-component-id="115b11c9-9847-4747-8285-7689088705da"] .rx-form-control',
        searchRecipeintList: '[rx-view-component-id="115b11c9-9847-4747-8285-7689088705da"] .rx-typeahead-popup-content button',
        saveButtonAddRecipient: '.float-right button.btn-primary',
    }

    async selectCheckBoxOfBody(): Promise<void> {
        await $$(this.selectors.checkBoxEmailTab).get(1).click();
    }

    async selectDefaultNotificationMethod(notification: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.defaultNotificationMethodGuid, notification);
    }

    async clickOnCancelButton(): Promise<void> {
      //  await $(this.selectors.cancelButton).click();
        await $(this.selectors.cancelButton).isPresent().then(async (result) =>{
            if(result) await $(this.selectors.cancelButton).click();
            else console.log("Cancel Button is not present");
        })
    }

    async clickCancelButtonAddRecipient(): Promise<void> {
        await $(this.selectors.cancelButtonAddRecipient).isPresent().then(async (result) =>{
            if(result) await $(this.selectors.cancelButtonAddRecipient).click();
            else console.log("Cancel Button is not present")
        })
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async getHeaderText(): Promise<string> {
        return await $(this.selectors.header).getText();
    }

    async clickOnEmailTab(): Promise<void> {
        await $(this.selectors.emailTab).click();
    }

    async clickOnEditButtonOfEmailTab(): Promise<void> {
        await $(this.selectors.editButtonOnEmailTab).click();
        await browser.sleep(2000); // After click, edit email tab load takes time
    }

    async openAlertEditMessageText(): Promise<void> {
        await $(this.selectors.alertSubjectCheckbox).click();
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
        await $$(this.selectors.checkBoxEmailTab).get(0).click();
        await $$(this.selectors.editCheckbox).last().click();
    }

    async clickEmailUncheckvalue(): Promise<void> {
        await $$(this.selectors.unCheckEmailGridvalue).get(0).click();
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
        return await $(this.selectors.addRecipientsBtn).isEnabled();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }

    async isAlertSubjectMessageDisabled(): Promise<boolean> {
        return await $(this.selectors.alertMessageBox).getAttribute('aria-disabled') == 'true';
    }

    async isEmailSubjectMessageDisabled(): Promise<boolean> {
        return await $(this.selectors.emailSubjectBox).getAttribute('readonly') =='true';
    }

    async isEmailBodyMessageDisabled(): Promise<boolean> {
        return await $(this.selectors.emailBodyMessageBox).getAttribute('contenteditable') == 'false';
    }

    async cancelEmailSubjectBlade(): Promise<void> {
        await $(this.selectors.cancelEmailSubjectBlade).click();
    }

    async cancelEmailBodyBlade(): Promise<void> {
        await $(this.selectors.cancelEmailBodyBlade).click();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
    }

    async getModuleName(): Promise<string> {
        return await $(this.selectors.moduleNameText).getText();
    }

    async getEventName(): Promise<string> {
        return await $(this.selectors.eventNameText).getText();
    }

    async clickAddRecipientsBtn(): Promise<void> {
        await $(this.selectors.addRecipientsBtn).click();
    }

    async isSearchRecipientDispalyed(): Promise<boolean> {
        return await $(this.selectors.searchRecipient).isDisplayed();
    }

    async getAllFieldsLabel(): Promise<String[]> {
        return await element.all(by.css(this.selectors.fieldLabels))
            .map(async function (fields) {
                return await fields.getAttribute('innerText');
            });
    }

    async selectRecipientType(option: string): Promise<void> {
        await $(this.selectors.recipientTypeSelect).click();
        await element(by.cssContainingText(`${this.selectors.recipientTypeSelect} option`, option)).click();
    }

    async clickApplyButton(): Promise<void> {
        await $(this.selectors.applyButton).click();
    }

    async selectIndividualRecipient(recipientName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.selectRecipient, recipientName)).click();
    }

    async saveAddRecipients(): Promise<void> {
        await $(this.selectors.saveButtonAddRecipient).click();
    }

    async clickRecipientsCheckbox(recipientName: string, recipientOption: string) {
        let count: number = 0;
        let checkboxCount: number = 0;
        let recipientLength = (await $$(this.selectors.recipientList)).length;
        for (let i = 0; i < recipientLength; i++) {
            if (await $$(this.selectors.recipientList).get(i).getText() == recipientName) break;
            count = count + 1;
        }
        switch (recipientOption) {
            case "TO": {
                checkboxCount = count + 1;
                break;
            }
            case "CC": {
                checkboxCount = count + 2;
                break;
            }
            case "BCC": {
                checkboxCount = count + 3;
                break;
            }
            default: {
                console.log("Invalid Recipient Option");
                break;
            }
        }
        await $$(this.selectors.recipientList).get(checkboxCount).$('[class="checkbox__label"]').click();
    }

    async isRecipientsCheckboxChecked(recipientName: string, recipientOption: string): Promise<boolean> {
        let count: number = 0;
        let checkboxCount: number = 0;
        let recipientLength = (await $$(this.selectors.recipientList)).length;
        for (let i = 0; i < recipientLength; i++) {
            if (await $$(this.selectors.recipientList).get(i).getText() == recipientName) break;
            count = count + 1;
        }
        switch (recipientOption) {
            case "TO": {
                checkboxCount = count+1;
                break;
            }
            case "CC": {
                checkboxCount = (count ) + 2;
                break;
            }
            case "BCC": {
                checkboxCount = (count) + 3;
                break;
            }
            default: {
                console.log("Invalid Recipient Option");
                break;
            }
        }
        return (await $$(this.selectors.recipientList).get(checkboxCount).$('[type=checkbox]').getAttribute('aria-checked') =='true');
    }

    async isRecipientDisplayed(recipientName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.recipientList, recipientName)).isPresent().then(async (result) => {
            if (result)
                return await element(by.cssContainingText(this.selectors.recipientList, recipientName)).isDisplayed();
            else return false;
        });
    }

    async isNotificationMethodDisabled(): Promise<boolean> {
        return await $(this.selectors.notificationMethod).getAttribute('disabled') == 'true';
    }

    async isEmailBasedApprovalFlagEnabled(): Promise<boolean> {
        return await $$(this.selectors.emailBasedApprovalFlag).first().isEnabled() && await $$(this.selectors.emailBasedApprovalFlag).last().isEnabled();
    }

    async updateDescription(description: string): Promise<void> {
        await $(this.selectors.description).clear();
        await $(this.selectors.description).sendKeys(description);
    }

    async updateAlertEmailMsgs(content: string): Promise<void> {
        await utilityCommon.updateCKEditor(content);
    }

    async updateEmailSubject(subject: string): Promise<void> {
        await $(this.selectors.emailSubject).clear();
        await $(this.selectors.emailSubject).sendKeys(subject);
    }

    async saveEmailAlertMsg(): Promise<void> {
        await $(this.selectors.saveAlertEmailSubjectBody).click();
    }

    async getSelectedFieldValue(fieldName: string): Promise<string> {
        let fieldGuid: string = undefined;
        switch (fieldName) {
            case "Company": {
                fieldGuid = '0d86e65f-f804-40c4-a955-ff82dd531956';
                break;
            }
            case "Status": {
                fieldGuid = 'da40a967-db52-4c1b-8d69-0c441f290323';
                break;
            }
            case "Module": {
                fieldGuid = 'bdd94b56-3700-4876-8455-62f1e1b05ff6';
                break;
            }
            case "Default Notification Method": {
                fieldGuid = 'c80f9de5-1a84-46fa-949d-fc073d65ebd8';
                break;
            }
            case "Event": {
                fieldGuid = 'f535976d-f547-460a-8fa6-f959eb485d38';
                break;
            }
            default: {
                console.log('Drop down values does not match');
                break;
            }
        }
        return await $(`[rx-view-component-id="${fieldGuid}"] button`).getText();
    }

    async isEmailBasedApprovalFlagTrue(): Promise<boolean> {
        return await $(this.selectors.emailBasedApplrovalTrueFlag).getAttribute('aria-pressed') == 'true';
    }

    async getDescriptionValue(): Promise<string> {
        return await $(this.selectors.description).getAttribute('value');
    }

    async getEmailSubjectValue(): Promise<string> {
        return await $(this.selectors.emailSubject).getAttribute('value');
    }

    async isEmailBodyContains(value: string): Promise<boolean> {
        let allLocatorCount: number = (await $$(this.selectors.emailBody)).length;
        let allValues: string = '';
        for (let i = 0; i < allLocatorCount; i++) {
            allValues = allValues + await $$(this.selectors.emailBody).get(i).getAttribute('innerText');
        }
        return (allValues.replace(/\s/g, "")).includes(value.replace(/\s/g, ""));
    }
    async setDropDownValue(dropDownName: string, dropDownValue: string): Promise<void> {
        let locator = '[rx-view-component-id="115b11c9-9847-4747-8285-7689088705da"] adapt-rx-select button';
        //if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        let dropDownElement: ElementFinder;
        switch (dropDownName) {
            case "RecipientType": {
                dropDownElement = await $$(locator).get(0);
                break;
            }
            case "AssignedGroup": {
                dropDownElement = await $$(locator).get(1);
                break;
            }
            default: {
                console.log('Dropdown Not Available');
                break;
            }
        }
        await utilityCommon.selectDropDown(dropDownElement, dropDownValue, DropDownType.WebElement);
    }
    async clickOnInsertFieldOfAlert(): Promise<void> {
        await $(this.selectors.alertInsertField).click();
    }

    async searchRecipient(requester: string): Promise<void> {
        await $(this.selectors.searchRecipeint).clear();
        await $(this.selectors.searchRecipeint).sendKeys(requester);
        await $$(this.selectors.searchRecipeintList).first().click();
    }


}
export default new EditNotificationTemplate();