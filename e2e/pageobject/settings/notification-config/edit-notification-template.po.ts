import { $, protractor, ProtractorExpectedConditions, $$, element, by, browser, ElementFinder } from "protractor";
import utilCommon from '../../../utils/util.common';
class EditNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        cancelButton: '[rx-view-component-id="2a50e7b7-b260-4749-ad9d-1d7cb65b5d95"] button',
        header: '.modal-title',
        saveButton: '[rx-view-component-id="50e25982-5452-4f20-ac79-5682de7cb467"] button',
        clickOnEmailTab: 'li.rx-tab a',
        editButtonOnEmailTab: '[rx-view-component-id="0306ec1b-e16e-416d-952d-b39c3a8336f0"] button',
        selectCheckBoxEmailTab: '[rx-view-component-id="4436dca0-329b-406f-8dd9-ab686df3f4b8"] .ui-grid-selection-row-header-buttons',
        selectAlertSubjectCheckbox: '[rx-view-component-id="54e4673e-6717-4f72-98e2-4251ee72d702"] .ui-grid-selection-row-header-buttons',
        editCheckbox: 'button.d-icon-left-pencil',
        clickableField: 'div.cke_contents.cke_reset span[contenteditable]',
        cancelAlertMessageTextButton: '[rx-view-component-id="780514cc-7344-44a5-88af-5af509619ab0"] button',
        defaultNotificationMethodGuid: "911e28fd-89bb-4ee0-bea9-1d22e48f1134",
        description: '[rx-view-component-id="a9a1fe44-a890-4c1d-903d-74674bf4c221"] textarea',
        event: '[rx-view-component-id="15aad4c8-1522-4586-b9d3-6be376cfcaa8"] .ui-select-toggle',
        addRecipientsBtn: '[rx-view-component-id="9c294d12-1577-44fd-950d-fe7021853558"] button',
        addLocalizedMessageBtn: '[rx-view-component-id="a93ae1ed-3ae3-42cc-8f2b-6ce26fcc1f91"] button',
        alertMessageBox: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .d-textfield div',
        emailSubjectBox: '[rx-view-component-id="2edd6ab4-d1e5-456e-879c-f8ca22bfbb32"] textarea',
        emailBodyMessageBox: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .d-textfield div',
        cancelEmailSubjectBlade: '[rx-view-component-id="8335618d-2a88-49d1-9002-e5b7601b7674"] button',
        cancelEmailBodyBlade: '[rx-view-component-id="780514cc-7344-44a5-88af-5af509619ab0"] button',
        moduleNameText: '[rx-view-component-id="4fd471a8-c2c4-44f3-8c33-57501411df07"] .ui-select-match-text',
        eventNameText: '[rx-view-component-id="15aad4c8-1522-4586-b9d3-6be376cfcaa8"] .ui-select-match-text',
        searchRecipient: 'input[ng-model="searchInput"]',
        applyButton: '[ng-click="onFilterApply()"]',
        fieldLabels: '.rx-recipients-assignment-select-label, .modal-footer button',
        recipientTypeSelect: '.rx-recipients-assignment-select select',
        selectRecipient: '.rx-recipients-assignment-person-fullName, .rx-recipients-assignment-person-structure',
        recipientList: 'div[ng-repeat*="recipient"] .text-wrapper span',
        recipientsCheckbox: 'div[ng-repeat*="recipient"] .d-checkbox__item',
        recipientsCheckboxInput: 'div[ng-repeat*="recipient"] input',
        notificationMethod: '[rx-view-component-id="911e28fd-89bb-4ee0-bea9-1d22e48f1134"] .dropdown',
        emailBasedApprovalFlag: '[rx-view-component-id="be4360ec-c852-457f-87c0-c1bf1abf8952"] button',
        emailSubject: '[rx-view-component-id="2edd6ab4-d1e5-456e-879c-f8ca22bfbb32"] textarea',
        saveAlertEmailSubjectBody: '[rx-view-component-id="498a2cf3-8866-4303-996a-61dc33e4a400"] button, [rx-view-component-id="cd6ddce5-4729-4cc9-a5a4-6f76e967de03"] button, [rx-view-component-id="498a2cf3-8866-4303-996a-61dc33e4a400"] button',
        emailBody: '.cke_editable_themed p, .cke_editable_themed p u, .cke_editable_themed p span i',
        emailBasedApplrovalTrueFlag: '[rx-view-component-id="be4360ec-c852-457f-87c0-c1bf1abf8952"] button.d-icon-check' 
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
        await browser.sleep(2000); // After click, edit email tab load takes time
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
                fieldGuid = '911e28fd-89bb-4ee0-bea9-1d22e48f1134';
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