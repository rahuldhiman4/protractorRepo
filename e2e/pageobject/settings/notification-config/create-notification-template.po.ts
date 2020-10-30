import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class createNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        templateName: '[rx-view-component-id="383011ea-6f7d-40c2-bf7d-5bb9d5ab6faa"] input',
        description: '[rx-view-component-id="a2ac2ebb-72e8-48b9-b639-648f3b5f3357"] textarea',
        eventDropDownGuid: '6b65ad98-5a2c-40b9-a45b-62c10a88df86',
        moduleName: 'bbaf88e2-7db2-4be4-858c-950d53ace33c',
        alertInsertField: '[rx-view-component-id="b77c0581-b76e-4c92-a5e1-5c3026b379fa"] .cke_button__expressioneditor',
        emailInsertField: '[rx-view-component-id="cbc9e73f-032f-463a-9c6c-2b5abd5b59e1"] .cke_button__expressioneditor',
        fieldValueInAlertBody: '[rx-view-component-id="b77c0581-b76e-4c92-a5e1-5c3026b379fa"] .cke_wysiwyg_div span',
        fieldValueInEmailBody: '[rx-view-component-id="cbc9e73f-032f-463a-9c6c-2b5abd5b59e1"] .cke_wysiwyg_div span',
        clickOnEmailTab: '[rx-view-component-id="3f855256-dd6c-45dd-a970-2414b4d01388"] li a[title="Email"]',
        subject: '[rx-view-component-id="502114ff-23fe-4508-a5ca-04373a04d56e"] input',
        saveButton: '[rx-view-component-id="a07cb7fc-3b1a-41ca-8eee-e99e2058e161"] button',
        cancelButton: '[rx-view-component-id="86d6f515-fcd3-484a-a18f-1ff30c137a1d"] button',
        recipientsList: 'div[ng-repeat*="recipient"] .text-wrapper span',
        alertMessage: '[rx-view-component-id="b77c0581-b76e-4c92-a5e1-5c3026b379fa"] .cke_wysiwyg_div',
        emailBasedApprovalFlag: '[rx-view-component-id="be4360ec-c852-457f-87c0-c1bf1abf8952"] .d-textfield',
        emailBasedApprovalToggleGuid: '4c32ae80-d3de-4cca-88b9-0714972d15c1',
        notificationMethodGuid: '0788e5c4-93ca-4d92-b61a-cd024f523a3e',
        generateClickableLinkIconAlert: '[rx-view-component-id="b77c0581-b76e-4c92-a5e1-5c3026b379fa"] .cke_button__clickablelink_icon',
        generateClickableLinkIconEmail: '[rx-view-component-id="cbc9e73f-032f-463a-9c6c-2b5abd5b59e1"] .cke_button__clickablelink_icon',
    }
    async selectModuleName(value: string): Promise<void> {
        await utilCommon.selectDropDown('bbaf88e2-7db2-4be4-858c-950d53ace33c', value);
    }

    async selectEvent(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.eventDropDownGuid, value);
    }

    async setTemplateName(value: string): Promise<void> {
        await $(this.selectors.templateName).sendKeys(value);
    }

    async setSubject(value: string): Promise<void> {
        await $(this.selectors.subject).sendKeys(value);
    }

    async setEmailBody(value: string): Promise<void> {
        await utilCommon.setCKEditor(value, 'cbc9e73f-032f-463a-9c6c-2b5abd5b59e1');
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

    async clickOnTab(): Promise<void> {
        await $(this.selectors.clickOnEmailTab).click();
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