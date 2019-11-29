import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"
import utilCommon from '../../utils/util.common';

class editNotesTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="6946bd12-b3f4-404c-8da3-054815bfea9b"] input',
        status: '6333057d-5f6a-4d5d-b862-a07db2f9997e',
        company: 'cdcad966-c707-404e-8aad-a71dc60930f2',
        language: 'f541b151-ebf5-4534-a36f-e9fd3aafde91',
        label: '54ccbb24-f8e2-43cf-bb34-f943e579a13e',
        localizedMessageButton: '[rx-view-component-id="d01e8c76-89c3-4259-ad53-9409a740030e"] button',
        insertField: '[rx-view-component-id="9373799a-664e-4027-8bb1-9b2fcc9cd593"] .cke_button__expressioneditor',
        fieldVariable: '.rx-data-dictionary-item-value',
        parentFields:  '.rx-tree-node-parent',
        okButtonOnEditor: '.rx-expression-editor-action-buttons .d-button_primary',
        cancelButtonOnEditor: '.rx-expression-editor-action-buttons .d-button_secondary',
        body: '.cke_wysiwyg_div',
        statusValue: '[rx-view-component-id="6333057d-5f6a-4d5d-b862-a07db2f9997e"] .ui-select-match-text',
        bodyUpdateValue: '.cke_wysiwyg_div p',
        saveButton: '[rx-view-component-id="7cfbf19a-7366-4d4f-b686-be6b6befaf82"] .d-button_primary',
        cancelButton: '[rx-view-component-id="020cadc5-e0da-4ed3-99d3-6ad0bef712bc"] .d-button_secondary'
    }

    async changeTemplateName(templateNameValue:string):Promise<void>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.templateName)));
        await $(this.selectors.templateName).clear();
        await $(this.selectors.templateName).sendKeys(templateNameValue);
    }

    async changeStatusValue(statusValue:string):Promise<void>{
        await utilCommon.selectDropDown(this.selectors.status,statusValue);
    }

    async changeCompanyValue(companyValue:string):Promise<void>{
        await utilCommon.selectDropDown(this.selectors.company,companyValue);
    }

    async changeLanguageValue(languageValue:string):Promise<void>{
        await utilCommon.selectDropDown(this.selectors.language,languageValue);
    }
    
    async changeLabelValue(labelValue:string):Promise<void>{
        await utilCommon.selectDropDown(this.selectors.status,labelValue);
    }

    async updateBody(bodyValue:string):Promise<void>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.body)));
        await $(this.selectors.body).sendKeys(bodyValue);
    }

    async clickOnInsertFieldLink():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.insertField)));
        await $(this.selectors.insertField).click();
    }

    async clickOnSaveButton():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async getStatusValue():Promise<string>{
        await await browser.wait(this.EC.visibilityOf($(this.selectors.statusValue)));
        return await $(this.selectors.statusValue).getText();     
    }

    async getBodyValue():Promise<string>{
        await await browser.wait(this.EC.visibilityOf($(this.selectors.bodyUpdateValue)));
        return await $(this.selectors.bodyUpdateValue).getText();     
    }
}
export default new editNotesTemplate();