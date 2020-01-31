import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class CreateDocumentTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addTemplate: '.d-icon-left-plus',
        templateName: '[rx-view-component-id="98493095-1421-4405-8927-dd684b0d2006"] input',
        company: 'a80a3c32-ce91-485b-a56b-3bac1f78d40f',
        labelDropDownGuid: '02d4e346-ca1c-4eeb-a80e-322eab42ad02',
        description: '[rx-view-component-id="933dd491-7d55-4735-b30a-f2826afe1461"] input',
        documentBody: '[rx-view-component-id="4c08281f-b2ce-4aeb-a0f5-13a4a4d98a7c"] div.cke_wysiwyg_div',
        saveButton: '[rx-view-component-id="01906a54-d879-427b-a057-a5c5d4834487"] button',
        cancelButton: '[rx-view-component-id="cfab43d9-cdba-4bec-99f3-6aefdf9fae9d"] button',
        pageHeader: '.modal-title',
        insertFieldLinkOnDocumentBody: '[rx-view-component-id="4c08281f-b2ce-4aeb-a0f5-13a4a4d98a7c"] .cke_button__expressioneditor_icon',
        clickImageButton: '[rx-view-component-id="4c08281f-b2ce-4aeb-a0f5-13a4a4d98a7c"] .cke_button__image',
    }
    async clickOnDocumentBodyImageButton(): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.clickImageButton)));
        await $(this.selectors.clickImageButton).click();
    }

    async isHeaderDisplayed(headerName: string): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.pageHeader)));
        return await element(by.cssContainingText(this.selectors.pageHeader, headerName)).isDisplayed();
    }

    async clickOnAddTemplate(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addTemplate)));
        await $(this.selectors.addTemplate).click();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        return await $(this.selectors.saveButton).isEnabled();
    }

    async setTemplateName(value: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        await $(this.selectors.templateName).sendKeys(value);
    }

    async selectLabelDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.labelDropDownGuid, value);
    }

    async setCompany(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.company, value);
    }

    async setDescription(value: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.description)));
        await $(this.selectors.description).sendKeys(value);
    }

    async clickOnInsertFieldOfDocumentBody(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.insertFieldLinkOnDocumentBody)), 2000);
        await $(this.selectors.insertFieldLinkOnDocumentBody).click();
    }

    async setDocumentBody(documentBodyText: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.documentBody)));
        await $(this.selectors.documentBody).sendKeys(documentBodyText);
    }

    async clickOnSaveButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }
}

export default new CreateDocumentTemplate();