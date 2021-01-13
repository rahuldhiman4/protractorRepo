import { $,$$, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import utilCommon from '../../../utils/util.common';

class createNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        templateName: '[rx-view-component-id="383011ea-6f7d-40c2-bf7d-5bb9d5ab6faa"] input',
        description: '[rx-view-component-id="f2eb8d5f-88a7-4e46-842b-842fba667b08"] input',
        eventDropDownGuid: 'a0554358-c226-4dae-9bef-0792a0e32c5f',
        moduleName: 'bbaf88e2-7db2-4be4-858c-950d53ace33c',
        alertInsertField: '.cke_button__expressioneditor',
        emailInsertField: 'id="cke_103"',
        fieldValueInAlertBody: '.cke_wysiwyg_div',
        fieldValueInEmailBody: '[id="cke_116_contents"] .cke_wysiwyg_div',
        emailTab: '[rx-view-component-id="e55bb281-692b-4daa-bb8b-ada70bd0581c"] button[aria-posinset="2"]',
        subject: '[rx-view-component-id="dbfcd07f-0191-4282-9184-8044e4ae28bb"] input',
        saveButton: '[rx-view-component-id="a07cb7fc-3b1a-41ca-8eee-e99e2058e161"] button',
        cancelButton: '[rx-view-component-id="86d6f515-fcd3-484a-a18f-1ff30c137a1d"] button',
        recipientsList: 'div[ng-repeat*="recipient"] .text-wrapper span',
        alertMessage: '[rx-view-component-id="560e4bbc-9f76-4a7b-9029-e561bdaa5526"] .cke_wysiwyg_div',
        emailBasedApprovalFlag: '[rx-view-component-id="be4360ec-c852-457f-87c0-c1bf1abf8952"] .d-textfield',
        emailBasedApprovalToggleGuid: '4437da1b-4da6-4e84-bf9c-f7366cca0f1a',
        notificationMethodGuid: '0f634bc9-63ce-4515-99d1-525fdb4e44a9',
        generateClickableLinkIconAlert: '[rx-view-component-id="34d2b4a6-5403-4e22-809d-5d26fe2f4ad8"] .cke_button__clickablelink_icon',
        generateClickableLinkIconEmail: '[rx-view-component-id="ac6ba449-9c5a-46f9-85fb-8384bf57fc92"] .cke_button__clickablelink_icon',
        emailBodyGuid: '7ecf7b01-9de9-45a6-a448-2806fe51cece',
        eventDropDownInput: '[rx-view-component-id="38aba7a1-c142-41f7-9017-d261971c2429"] input',
        eventDropDown: '[rx-view-component-id="a0554358-c226-4dae-9bef-0792a0e32c5f"] button',
        dropDownOption: '.dropdown-item',
    }
    
    async selectModuleName(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.moduleName, value);
    }

    async selectEvent(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.eventDropDownGuid, value);
    }

    async selectNthEvent(value: string, n: number): Promise<void> {
        await utilCommon.selectNthDropDown(this.selectors.eventDropDownGuid, value, n);
    }

    async setTemplateName(value: string): Promise<void> {
        await $(this.selectors.templateName).sendKeys(value);
    }

    async setSubject(value: string): Promise<void> {
        await $(this.selectors.subject).sendKeys(value);
    }

    async setEmailBody(value: string): Promise<void> {
        await utilityCommon.setCKEditor(value, this.selectors.emailBodyGuid);
    }

    async setDescription(value: string): Promise<void> {
        await $(this.selectors.description).sendKeys(value);
    }

    async clickOnInsertFieldOfAlert(): Promise<void> {
        await $(this.selectors.alertInsertField).click();
    }

    async clickOnInsertFieldOfEmail(): Promise<void> {
        await $(this.selectors.emailInsertField).click();
    }

    async clickOnEmailTab(): Promise<void> {
        await $(this.selectors.emailTab).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async isDynamicFieldDisplayedInAlertBody(value: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.fieldValueInAlertBody, value)).isDisplayed();
    }

    async isDynamicFieldDisplayedInEmailBody(value: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.fieldValueInEmailBody, value)).isDisplayed();
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async areRecipientsMatches(expectedRecipients: string[]): Promise<boolean> {
        if (expectedRecipients.length > 0) {
            let actualRecipients = await element.all(by.css(this.selectors.recipientsList))
                .map(async function (recipients) {
                    return await recipients.getAttribute('innerText');
                });
            actualRecipients.sort();
            expectedRecipients.sort();
            return actualRecipients.length === expectedRecipients.length && actualRecipients.every(
                (value, index) => (value === expectedRecipients[index])
            );
        }
        else return !(await $(this.selectors.recipientsList).isPresent());
    }

    async setAlertMessage(msg: string): Promise<void> {
        await $(this.selectors.alertMessage).sendKeys(msg);
    }

    async isEmailBasedApprovalFlagDisplayed(): Promise<boolean> {
        return await $(this.selectors.emailBasedApprovalFlag).isPresent().then(async (result) => {
            if (result)
                return await $(this.selectors.emailBasedApprovalFlag).isDisplayed();
            else return false;
        })
    }

    async selectEmailBasedApprovalToggle(value: boolean): Promise<void> {
        await utilityCommon.selectToggleButton(this.selectors.emailBasedApprovalToggleGuid, value);
    }

    async selectDefaultNotificationMethod(methodName: string) {
        await utilityCommon.selectDropDown(this.selectors.notificationMethodGuid, methodName);
    }

    async clickOnGenerateClickableLinkIconOnAlert(): Promise<void> {
        await $(this.selectors.generateClickableLinkIconAlert).click();
    }

    async clickOnGenerateClickableLinkIconOnEmail(): Promise<void> {
        await $(this.selectors.generateClickableLinkIconEmail).click();
    }

    async clickOnNotificationEventDropDown():Promise<void>{
        await $(this.selectors.eventDropDown).click();
    }

    async clearNotificationEventFromDropDown():Promise<void>{
        await $(this.selectors.eventDropDownInput).clear();
    }

    async isNotificationEventOptionPresentInDropDown(notificationEvent: string): Promise<boolean> {
        await $(this.selectors.eventDropDownInput).clear();
        await $(this.selectors.eventDropDownInput).sendKeys(notificationEvent);
        let values= await $$(this.selectors.dropDownOption).count();
        if (values >= 1) { return true; } else { return false; }
    } 


}
export default new createNotificationTemplate(); 