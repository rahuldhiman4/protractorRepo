import { remove } from 'lodash';
import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import { DropDownType } from '../../../utils/constants';

class createNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        templateName: '[rx-view-component-id="ed45b56c-b7a3-4299-affd-5e9630ab5f4b"] input',
        description: '[rx-view-component-id="f5b5ca51-f48e-478c-b3bd-9457909bb4c6"] textarea',
        eventDropDownGuid: '38aba7a1-c142-41f7-9017-d261971c2429',
        moduleName: 'af58911a-383b-4548-9a8a-1a228457d0b7',
        alertInsertField: '[rx-view-component-id="3b8c6647-5b47-444f-941b-aaec38d4ea2e"] .cke_button__rtfexpressioneditor_icon',
        emailInsertField: '[rx-view-component-id="384fc1d0-2db9-4a9b-b807-47b1158327e6"] .cke_button__rtfexpressioneditor_icon',
        fieldValueInAlertBody: '.cke_wysiwyg_div',
        fieldValueInEmailBody: '[id="cke_116_contents"] .cke_wysiwyg_div',
        emailTab: '[rx-view-component-id="49e5407b-f0ea-4952-8d6c-7745ab6e2ef2"] button[aria-posinset="2"]',
        subject: '[rx-view-component-id="2ac0962f-e643-4534-a85f-75721da2502e"] .textfield-padding-transition',
        saveButton: '[rx-view-component-id="18ba6978-2eb2-4bf0-ab20-bd484938729e"] button',
        cancelButton: '[rx-view-component-id="1f86f67c-1645-43f5-ae8e-1cb5efa21787"] button',
        recipientsList: 'tr[class="table-row ng-star-inserted"] td',
        alertMessage: '[rx-view-component-id="3b8c6647-5b47-444f-941b-aaec38d4ea2e"] .cke_wysiwyg_div',
        emailBasedApprovalFlag: '[rx-view-component-id="be4360ec-c852-457f-87c0-c1bf1abf8952"] .d-textfield',
        emailBasedApprovalToggleGuid: '8b68aed2-0a80-40b7-9425-155e252d962e',
        notificationMethodGuid: '0f634bc9-63ce-4515-99d1-525fdb4e44a9',
        generateClickableLinkIconAlert: '[rx-view-component-id="3b8c6647-5b47-444f-941b-aaec38d4ea2e"] .cke_button__rtfclickablelink_icon',
        generateClickableLinkIconEmail: '[rx-view-component-id="384fc1d0-2db9-4a9b-b807-47b1158327e6"] .cke_button__rtfclickablelink_icon',
        emailBodyGuid: '7ecf7b01-9de9-45a6-a448-2806fe51cece',
        eventDropDownInput: '[rx-view-component-id="38aba7a1-c142-41f7-9017-d261971c2429"] input',
        eventDropDown: '[rx-view-component-id="38aba7a1-c142-41f7-9017-d261971c2429"] button',
        dropDownOption: '.dropdown-item',
        eventGuid: '38aba7a1-c142-41f7-9017-d261971c2429'
    }

    async selectModuleName(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.moduleName, value);
    }

    async selectEvent(value: string): Promise<void> {
        await utilityCommon.selectDropDown("Event", value,DropDownType.Label);
    }

    async selectNthEvent(value: string, n: number): Promise<void> {
        await utilityCommon.selectNthDropDown(this.selectors.eventDropDownGuid, value, n);
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
            let actualRecipientRaw = await element.all(by.css(this.selectors.recipientsList))
                .map(async function (recipients) {
                    return (await recipients.getAttribute('innerText')).trim();
                });
            let actualRecipients = remove(actualRecipientRaw, function (n) {
                return n != '';
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

    async clickOnNotificationEventDropDown(): Promise<void> {
        await $(this.selectors.eventDropDown).click();
    }

    async clearNotificationEventFromDropDown(): Promise<void> {
        await $(this.selectors.eventDropDownInput).clear();
    }

    async isNotificationEventOptionPresentInDropDown(notificationEvent: string): Promise<boolean> {
        await $(this.selectors.eventDropDownInput).clear();
        await $(this.selectors.eventDropDownInput).sendKeys(notificationEvent);
        let values = await $$(this.selectors.dropDownOption).count();
        if (values >= 1) { return true; } else { return false; }
    }


}
export default new createNotificationTemplate(); 