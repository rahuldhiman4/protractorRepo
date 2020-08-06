import { $, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class createNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        templateName: '[rx-view-component-id="383011ea-6f7d-40c2-bf7d-5bb9d5ab6faa"] input',
        description: '[rx-view-component-id="f2eb8d5f-88a7-4e46-842b-842fba667b08"] input',
        event: 'a0554358-c226-4dae-9bef-0792a0e32c5f',
        moduleName: 'bbaf88e2-7db2-4be4-858c-950d53ace33c',
        alertInsertField: '[rx-view-component-id="b77c0581-b76e-4c92-a5e1-5c3026b379fa"] .cke_button__expressioneditor',
        emailInsertField: '[rx-view-component-id="cbc9e73f-032f-463a-9c6c-2b5abd5b59e1"] .cke_button__expressioneditor',
        fieldValueInAlertBody: '[rx-view-component-id="b77c0581-b76e-4c92-a5e1-5c3026b379fa"] .cke_wysiwyg_div span',
        fieldValueInEmailBody: '[rx-view-component-id="cbc9e73f-032f-463a-9c6c-2b5abd5b59e1"] .cke_wysiwyg_div span',
        clickOnEmailTab: '[rx-view-component-id="3f855256-dd6c-45dd-a970-2414b4d01388"] li a[title="Email"]',
        subject: '[rx-view-component-id="502114ff-23fe-4508-a5ca-04373a04d56e"] input',
        saveButton: '[rx-view-component-id="a07cb7fc-3b1a-41ca-8eee-e99e2058e161"] button',
        cancelButton: '[rx-view-component-id="86d6f515-fcd3-484a-a18f-1ff30c137a1d"] button'
    }
    async selectModuleName(value: string): Promise<void> {
        await utilCommon.selectDropDown('bbaf88e2-7db2-4be4-858c-950d53ace33c', value);
    }

    async selectEvent(value: string): Promise<void> {
        await utilCommon.selectDropDown('a0554358-c226-4dae-9bef-0792a0e32c5f', value);
    }

    async setTemplateName(value: string): Promise<void> {
        await $(this.selectors.templateName).sendKeys(value);
    }

    async setSubject(value: string): Promise<void> {
        await $(this.selectors.subject).sendKeys(value);
    }

    async setDescription(value: string): Promise<void> {
        await $(this.selectors.description).sendKeys(value);
    }

    async clickOnInsertFieldOfAlert(): Promise<void> {
        await $(this.selectors.alertInsertField).click();
    }

    async clickOnInsetFieldOfEmail(): Promise<void> {
        await $(this.selectors.emailInsertField).click();
    }

    async clickOnTab(): Promise<void> {
        await $(this.selectors.clickOnEmailTab).click();
    }

    async clickOnCancelButton():Promise<void>{
        await $(this.selectors.cancelButton).click();
    }

    async isDynamicFieldDisplayedInAlertBody(value: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.fieldValueInAlertBody, value)).isDisplayed();
    }

    async isDynamicFieldDisplayedInEmailBody(value: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.fieldValueInEmailBody, value)).isDisplayed();
    }

    async clickOnSaveButton():Promise<void>{
        await $(this.selectors.saveButton).click();
    }

}
export default new createNotificationTemplate(); 