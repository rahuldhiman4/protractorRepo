import { $, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilCommon from '../../../utils/util.common';

class createNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        templateName: '[rx-view-component-id="ed45b56c-b7a3-4299-affd-5e9630ab5f4b"] input',
        description: '[rx-view-component-id="f5b5ca51-f48e-478c-b3bd-9457909bb4c6"] textarea',
        eventDropDownGuid: '38aba7a1-c142-41f7-9017-d261971c2429',
        moduleName: 'af58911a-383b-4548-9a8a-1a228457d0b7',
        alertInsertField: '[rx-view-component-id="34d2b4a6-5403-4e22-809d-5d26fe2f4ad8"] .cke_button__expressioneditor',
        emailInsertField: '[rx-view-component-id="ac6ba449-9c5a-46f9-85fb-8384bf57fc92"] .cke_button__expressioneditor',
        fieldValueInAlertBody: '[rx-view-component-id="34d2b4a6-5403-4e22-809d-5d26fe2f4ad8"] .cke_wysiwyg_div span',
        fieldValueInEmailBody: '[rx-view-component-id="ac6ba449-9c5a-46f9-85fb-8384bf57fc92"] .cke_wysiwyg_div span',
        emailTab: '[rx-view-component-id="c7d14533-5e1a-4564-8a81-7c6c9db3878f"] li a[title="Email"]',
        subject: '[rx-view-component-id="905d5f81-de26-4c43-8c5c-f38de9b518bf"] input',
        saveButton: '[rx-view-component-id="18ba6978-2eb2-4bf0-ab20-bd484938729e"] button',
        cancelButton: '[rx-view-component-id="1f86f67c-1645-43f5-ae8e-1cb5efa21787"] button',
        recipientsList: 'div[ng-repeat*="recipient"] .text-wrapper span',
        alertMessage: '[rx-view-component-id="34d2b4a6-5403-4e22-809d-5d26fe2f4ad8"] .cke_wysiwyg_div',
        emailBasedApprovalFlag: '[rx-view-component-id="be4360ec-c852-457f-87c0-c1bf1abf8952"] .d-textfield',
        emailBasedApprovalToggleGuid: '4437da1b-4da6-4e84-bf9c-f7366cca0f1a',
        notificationMethodGuid: '0f634bc9-63ce-4515-99d1-525fdb4e44a9',
        generateClickableLinkIconAlert: '[rx-view-component-id="34d2b4a6-5403-4e22-809d-5d26fe2f4ad8"] .cke_button__clickablelink_icon',
        generateClickableLinkIconEmail: '[rx-view-component-id="ac6ba449-9c5a-46f9-85fb-8384bf57fc92"] .cke_button__clickablelink_icon',
        emailBodyGuid: '7ecf7b01-9de9-45a6-a448-2806fe51cece'
    }
    async selectModuleName(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.moduleName, value);
    }

    async selectEvent(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.eventDropDownGuid, value);
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
        await utilCommon.setCKEditor(value, this.selectors.emailBodyGuid);
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
        await utilCommon.selectToggleButton(this.selectors.emailBasedApprovalToggleGuid, value);
    }

    async selectDefaultNotificationMethod(methodName: string) {
        await utilCommon.selectDropDown(this.selectors.notificationMethodGuid, methodName);
    }

    async clickOnGenerateClickableLinkIconOnAlert(): Promise<void> {
        await $(this.selectors.generateClickableLinkIconAlert).click();
    }

    async clickOnGenerateClickableLinkIconOnEmail(): Promise<void> {
        await $(this.selectors.generateClickableLinkIconEmail).click();
    }
}
export default new createNotificationTemplate(); 