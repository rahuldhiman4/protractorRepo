import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
class EditNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        cancelButton: '[rx-view-component-id="d2dd0f98-69d0-462f-9002-5da452b67f63"] button,[rx-view-component-id="2a50e7b7-b260-4749-ad9d-1d7cb65b5d95"] button',
        header: '.dp-title',
        saveButton: '[rx-view-component-id="50e25982-5452-4f20-ac79-5682de7cb467"] button',
        emailTab: 'li.nav-item button[aria-posinset="2"]',
        editButtonOnEmailTab: '[rx-view-component-id="a0c7d2a0-326b-4c8c-88ab-1b626b865769"] button',
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
        alertMessageBox: '[rx-view-component-id="a0a91ca7-9acd-467b-a4fc-d22217199f01"] div[id="cke_242_contents"]',
        emailSubjectBox: '[rx-view-component-id="31bcbb1a-0420-481c-8233-d9d9e117b230"] input',
        emailBodyMessageBox: 'div[id="cke_292_contents"]',
        cancelEmailSubjectBlade: '[rx-view-component-id="8335618d-2a88-49d1-9002-e5b7601b7674"] button',
        cancelEmailBodyBlade: '[rx-view-component-id="780514cc-7344-44a5-88af-5af509619ab0"] button',
        moduleNameText: '[rx-view-component-id="bdd94b56-3700-4876-8455-62f1e1b05ff6"] button div',
        eventNameText: '[rx-view-component-id="f535976d-f547-460a-8fa6-f959eb485d38"] button div',
        searchRecipient: '[rx-view-component-id="115b11c9-9847-4747-8285-7689088705da"] .adapt-search',
        applyButton: '[rx-view-component-id="115b11c9-9847-4747-8285-7689088705da"] .filter-list [btn-type="primary"]',
        fieldLabels: '[rx-view-component-id="115b11c9-9847-4747-8285-7689088705da"] .adapt-select-label-wrapper',
        recipientTypeSelect: '[id="adapt-select-37"] .dropdown-toggle',
        selectRecipient: '.rx-recipients-assignment-person-fullName, .rx-recipients-assignment-person-structure',
        recipientList: '.body tr td',
        unCheckEmailGridvalue: '[rx-view-component-id="a0c7d2a0-326b-4c8c-88ab-1b626b865769"] input[type="checkbox"]',
        recipientsCheckbox: '.body tr td label span input',
        recipientsCheckboxInput: '.body tr td label span input',
        notificationMethod: '[rx-view-component-id="c80f9de5-1a84-46fa-949d-fc073d65ebd8"] .dropdown',
        emailBasedApprovalFlag: '[rx-view-component-id="99cd2540-80fa-4dbe-96b9-bbadc2fcc93c"] button',
        emailSubject: '[rx-view-component-id="2edd6ab4-d1e5-456e-879c-f8ca22bfbb32"] textarea',
        saveAlertEmailSubjectBody: '[rx-view-component-id="498a2cf3-8866-4303-996a-61dc33e4a400"] button, [rx-view-component-id="cd6ddce5-4729-4cc9-a5a4-6f76e967de03"] button, [rx-view-component-id="498a2cf3-8866-4303-996a-61dc33e4a400"] button',
        emailBody: '.cke_editable_themed p, .cke_editable_themed p u, .cke_editable_themed p span i',
        emailBasedApplrovalTrueFlag: '[rx-view-component-id="99cd2540-80fa-4dbe-96b9-bbadc2fcc93c"] button.d-icon-check'
    }

    async selectCheckBoxOfBody(): Promise<void> {
        await $$(this.selectors.checkBoxEmailTab).get(1).click();
    }

    async selectDefaultNotificationMethod(notification: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.defaultNotificationMethodGuid, notification);
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
        await $(this.selectors.emailTab).click();
    }

    async clickOnEditButtonOfEmailTab(): Promise<void> {
        await $$(this.selectors.editButtonOnEmailTab).get(4).click();
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
        return await $(this.selectors.alertMessageBox).getAttribute('class') == 'rtf-read-only';
    }

    async isEmailSubjectMessageDisabled(): Promise<boolean> {
        return await $(this.selectors.emailSubjectBox).getAttribute('readonly') == 'true';
    }

    async isEmailBodyMessageDisabled(): Promise<boolean> {
        return await $(this.selectors.emailBodyMessageBox).getAttribute('class') == 'rtf-read-only';
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
        await element(by.cssContainingText(this.selectors.fieldLabels, 'Save')).click();
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
        await $$(this.selectors.recipientList).get(checkboxCount).click();
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
                checkboxCount = count * 3;
                break;
            }
            case "CC": {
                checkboxCount = (count * 3) + 1;
                break;
            }
            case "BCC": {
                checkboxCount = (count * 3) + 2;
                break;
            }
            default: {
                console.log("Invalid Recipient Option");
                break;
            }
        }
        return (await $$(this.selectors.recipientsCheckboxInput).get(checkboxCount).getAttribute('class')).includes('ng-not-empty');
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
                fieldGuid = 'a423a785-aec4-453b-b2b7-d44f534fd2ed';
                break;
            }
            case "Status": {
                fieldGuid = 'edadf429-50e9-4867-ab44-d027826932df';
                break;
            }
            case "Module": {
                fieldGuid = '4fd471a8-c2c4-44f3-8c33-57501411df07';
                break;
            }
            case "Default Notification Method": {
                fieldGuid = 'c80f9de5-1a84-46fa-949d-fc073d65ebd8';
                break;
            }
            case "Event": {
                fieldGuid = '15aad4c8-1522-4586-b9d3-6be376cfcaa8';
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

}
export default new EditNotificationTemplate();