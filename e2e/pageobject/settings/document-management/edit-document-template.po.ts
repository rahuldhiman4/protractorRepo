import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class EditDocumentTemplatePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="4b7649f7-fcca-4cd5-80f5-534f41d8a05e"] input',
        documentBody: '[rx-view-component-id="f6baa44c-1e91-49be-9164-1c56077900d8"] div.cke_wysiwyg_div',
        company: '[rx-view-component-id="0b925817-7212-418b-adf7-1403351d6b0c"] .ui-select-toggle',
        description: '[rx-view-component-id="c5ac0f65-e850-43aa-8040-00434db0acc9"] input',
        saveButton: '[rx-view-component-id="0afac686-fde8-4877-854b-7b8da0f3a9fa"] button',
        cancelButton: '[rx-view-component-id="55363c3b-863f-4f6c-b8c4-fe78e55208dc"] button',
        labelDropDown: '[rx-view-component-id="72d4bfbf-ec5c-437e-b0f1-f216babb58f8"] .ui-select-allow-clear',
        labelDropDownGuid: '72d4bfbf-ec5c-437e-b0f1-f216babb58f8',
        pageHeader: '.modal-title',
        documentBodyImg: '[rx-view-component-id="f6baa44c-1e91-49be-9164-1c56077900d8"] .cke_contents_ltr img',
        dynamicField: '[class="cke_contents cke_reset"] span',
    }

    async isDocumentBodyImgDisplay(): Promise<boolean> {
        return await $(this.selectors.documentBodyImg).isDisplayed();
    }

    async getDynamicFieldOnBody(): Promise<string> {
        return await $(this.selectors.dynamicField).getText();
    }

    async updateDescription(descriptionText: string): Promise<void> {
        await $(this.selectors.description).clear();
        await $(this.selectors.description).sendKeys(descriptionText);
    }

    async updateDocumentBody(descriptionText: string): Promise<void> {
        await $(this.selectors.documentBody).clear();
        await $(this.selectors.documentBody).sendKeys(descriptionText);
    }

    async selectLabelDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.labelDropDownGuid, value);
    }

    async isHeaderDisplayed(headerName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.pageHeader, headerName)).isDisplayed();
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async isTemplateNameDisplayed(templateName: string): Promise<boolean> {
        let attribute = await $(this.selectors.templateName).getAttribute('value');
        return attribute == templateName ? true : false
    }

    async isCompanyDropDownDisabled(): Promise<boolean> {
        return await $(this.selectors.company).getAttribute('disabled') == 'true';
    }

    async isTemplateNameDisabled(): Promise<boolean> {
        return await $(this.selectors.templateName).getAttribute('readonly') == 'true';
    }

    async isCompanyNameDisplayed(companyName: string): Promise<boolean> {
        let getText = await $(this.selectors.company).$('.ui-select-match-text').getText();
        return getText == companyName ? true : false
    }

    async isLabelValueDisplayed(companyName: string): Promise<boolean> {
        let getText = await $(this.selectors.labelDropDown).getText();
        return getText == companyName ? true : false
    }

    async isDescriptionValueDisplayed(descriptionName: string): Promise<boolean> {
        let attribute = await $(this.selectors.description).getAttribute('value');
        return attribute == descriptionName ? true : false
    }

    async isDocumentBodyDisplayed(documentBody: string): Promise<boolean> {
        let attribute = await $(this.selectors.documentBody).getText();
        return attribute == documentBody ? true : false
    }

    async isDescriptionFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.description).getAttribute('readonly') == 'true';
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }
    
}

export default new EditDocumentTemplatePage()