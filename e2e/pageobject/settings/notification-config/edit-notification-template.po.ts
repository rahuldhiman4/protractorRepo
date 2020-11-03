import { $, protractor, ProtractorExpectedConditions, $$, element, by, browser, ElementFinder } from "protractor";
import utilCommon from '../../../utils/util.common';
class EditNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        cancelButton: '[rx-view-component-id="d2dd0f98-69d0-462f-9002-5da452b67f63"] button',
        header: '.modal-title',
        saveButton: '[rx-view-component-id="8b5f78b0-0aa8-40da-8d52-66d5afe1356b"] button',
        emailTab: 'li.rx-tab a',
        editButtonOnEmailTab: '[rx-view-component-id="4436dca0-329b-406f-8dd9-ab686df3f4b8"] button',
        checkBoxEmailTab: '[rx-view-component-id="4436dca0-329b-406f-8dd9-ab686df3f4b8"] .ui-grid-selection-row-header-buttons',
        alertSubjectCheckbox: '[rx-view-component-id="54e4673e-6717-4f72-98e2-4251ee72d702"] .ui-grid-selection-row-header-buttons',
        editCheckbox: 'button.d-icon-left-pencil',
        clickableField: 'div.cke_contents.cke_reset span[contenteditable]',
        cancelAlertMessageTextButton: '[rx-view-component-id="780514cc-7344-44a5-88af-5af509619ab0"] button',
        defaultNotificationMethodGuid: "c80f9de5-1a84-46fa-949d-fc073d65ebd8",
        description: '[rx-view-component-id="73750a2f-4d74-4919-b0e4-fbc8e1b4167a"] textarea',
        event: '[rx-view-component-id="f535976d-f547-460a-8fa6-f959eb485d38"] .ui-select-toggle',
        addRecipientsBtn: '[rx-view-component-id="73a718fa-c683-48b0-b211-97b3744d7c3f"] button',
        addLocalizedMessageBtn: '[rx-view-component-id="a93ae1ed-3ae3-42cc-8f2b-6ce26fcc1f91"] button',
        alertMessageBox: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .d-textfield div',
        emailSubjectBox: '[rx-view-component-id="2edd6ab4-d1e5-456e-879c-f8ca22bfbb32"] textarea',
        emailBodyMessageBox: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .d-textfield div',
        cancelEmailSubjectBlade: '[rx-view-component-id="8335618d-2a88-49d1-9002-e5b7601b7674"] button',
        cancelEmailBodyBlade: '[rx-view-component-id="780514cc-7344-44a5-88af-5af509619ab0"] button',
        moduleNameText: '[rx-view-component-id="bdd94b56-3700-4876-8455-62f1e1b05ff6"] .ui-select-match-text',
        eventNameText: '[rx-view-component-id="f535976d-f547-460a-8fa6-f959eb485d38"] .ui-select-match-text',
        searchRecipient: 'input[ng-model="searchInput"]',
        applyButton: '[ng-click="onFilterApply()"]',
        fieldLabels: '.rx-recipients-assignment-select-label, .modal-footer button',
        recipientTypeSelect: '.rx-recipients-assignment-select select',
        selectRecipient: '.rx-recipients-assignment-person-fullName, .rx-recipients-assignment-person-structure',
        recipientList: 'div[ng-repeat*="recipient"] .text-wrapper span',
        recipientsCheckbox: 'div[ng-repeat*="recipient"] .d-checkbox__item',
        recipientsCheckboxInput: 'div[ng-repeat*="recipient"] input',
        notificationMethod: '[rx-view-component-id="c80f9de5-1a84-46fa-949d-fc073d65ebd8"] .dropdown',
        emailBasedApprovalFlag: '[rx-view-component-id="be4360ec-c852-457f-87c0-c1bf1abf8952"] button',
        emailSubject: '[rx-view-component-id="2edd6ab4-d1e5-456e-879c-f8ca22bfbb32"] textarea',
        saveAlertEmailSubjectBody: '[rx-view-component-id="498a2cf3-8866-4303-996a-61dc33e4a400"] button, [rx-view-component-id="cd6ddce5-4729-4cc9-a5a4-6f76e967de03"] button, [rx-view-component-id="498a2cf3-8866-4303-996a-61dc33e4a400"] button',
        emailBody: '.cke_editable_themed p, .cke_editable_themed p u, .cke_editable_themed p span i',
        emailBasedApplrovalTrueFlag: '[rx-view-component-id="be4360ec-c852-457f-87c0-c1bf1abf8952"] button.d-icon-check' 
    }

    async selectCheckBoxOfBody(): Promise<void> {
        await $$(this.selectors.checkBoxEmailTab).get(1).click();
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
        await utilCommon.clickOnWarningOk();
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

    async selectDropdownWithName(dropDownName: string, option: string): Promise<void> {
        await browser.wait(this.EC.or(async () => {
            let count = await $$('.rx-recipients-assignment-select').count();
            return count >= 1;
        }), 3000);
        const dropDown: ElementFinder[] = await $$('.rx-recipients-assignment-select');
        for (let i: number = 0; i < dropDown.length; i++) {
            await dropDown[i].$('.rx-recipients-assignment-select-label').isPresent().then(async (result) => {
                if (result) {
                    let dropDownLabelText: string = await dropDown[i].$('.rx-recipients-assignment-select-label').getText();
                    if (dropDownLabelText === dropDownName) {
                        await dropDown[i].$('.d-icon-angle_down').click();
                        await dropDown[i].$('input').sendKeys(option);
                        await element(by.cssContainingText("li[ng-repeat*='option']", option)).isPresent().then(async () => {
                            await browser.sleep(1000); // Wait For Drop Down Value Is Ready To Select.
                            await element(by.cssContainingText(".is-open li[ng-repeat*='option']", option)).click();
                        });
                    }
                }
            });
        }
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
        await $$(this.selectors.recipientsCheckbox).get(checkboxCount).click();
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
            if(result) 
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
        await utilCommon.updateCKEditor(content);
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
        return await $(`[rx-view-component-id="${fieldGuid}"] .ui-select-match-text`).getText();
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
        let allLocatorCount:number = (await $$(this.selectors.emailBody)).length;
        let allValues: string = '';
        for(let i=0; i<allLocatorCount; i++){
            allValues =  allValues + await $$(this.selectors.emailBody).get(i).getAttribute('innerText');
        }
        return (allValues.replace(/\s/g, "")).includes(value.replace(/\s/g, ""));
    }

}
export default new EditNotificationTemplate();