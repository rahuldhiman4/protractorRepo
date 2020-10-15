import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class CreateDocumentTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addTemplate: '.d-icon-left-plus',
        templateName: '[rx-view-component-id="98493095-1421-4405-8927-dd684b0d2006"] input',
        company: 'a80a3c32-ce91-485b-a56b-3bac1f78d40f',
        labelDropDownGuid: '93d439ff-ca35-4a86-a6b3-d45e705be23d',
        description: '[rx-view-component-id="e976be62-48e8-4b2a-8db5-713843068652"] textarea',
        documentBody: '[rx-view-component-id="4c08281f-b2ce-4aeb-a0f5-13a4a4d98a7c"] div.cke_wysiwyg_div',
        saveButton: '[rx-view-component-id="01906a54-d879-427b-a057-a5c5d4834487"] button',
        cancelButton: '[rx-view-component-id="cfab43d9-cdba-4bec-99f3-6aefdf9fae9d"] button',
        pageHeader: '.modal-title',
        insertFieldLinkOnDocumentBody: '[rx-view-component-id="4c08281f-b2ce-4aeb-a0f5-13a4a4d98a7c"] .cke_button__expressioneditor_icon',
        clickImageButton: '[rx-view-component-id="4c08281f-b2ce-4aeb-a0f5-13a4a4d98a7c"] .cke_button__image',
        dynamicField: '[class="cke_contents cke_reset"] span',
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

    async getDynamicFieldOnBody(): Promise<string> {
        return (await $(this.selectors.dynamicField).getText()).trim();
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

    async isFieldRequired(fieldName: string): Promise<boolean> {
        let guid: string = undefined;
        switch (fieldName) {
            case "Template Name": {
                guid = '98493095-1421-4405-8927-dd684b0d2006';
                break;
            }
            case "Company": {
                guid = 'a80a3c32-ce91-485b-a56b-3bac1f78d40f';
                break;
            }
            case "Description": {
                guid = '933dd491-7d55-4735-b30a-f2826afe1461';
                break;
            }
            case "Document Body": {
                guid = '4c08281f-b2ce-4aeb-a0f5-13a4a4d98a7c';
                break;
            }
            case "Label": {
                guid = '02d4e346-ca1c-4eeb-a80e-322eab42ad02';
                break;
            }
            default: {
                console.log(fieldName, ' is not a valid parameter');
                break;
            }
        }
        return await utilCommon.isRequiredTagToField(guid);
    }
}

export default new CreateDocumentTemplate();