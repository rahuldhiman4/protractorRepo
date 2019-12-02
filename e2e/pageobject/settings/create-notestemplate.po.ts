import { ProtractorExpectedConditions, protractor, browser, $} from "protractor"
import utilCommon from '../../utils/ui/util.common';
class createNotesTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="438e2c9d-b937-4ab5-8718-7ddb98073ee6"] input',
        status: 'a6f36df8-bb54-405f-ab71-7ac3b4b3e71d',
        company: '8072a3c4-6972-4760-86be-d5526dac8c8d',
        language: '951065ca-a003-4465-aed5-9623a689fd4f',
        label: 'c31f5d9c-3f30-43fa-bc65-0245bf3b6495',
        insertField: '[rx-view-component-id="96169de5-0dff-4627-8834-ffc528787e4e"] .cke_button__expressioneditor',
        fieldVariable: '.rx-data-dictionary-item-value',
        parentFields: '.rx-tree-node-parent',
        okButtonOnEditor: '.rx-expression-editor-action-buttons .d-button_primary',
        cancelButtonOnEditor: '.rx-expression-editor-action-buttons .d-button_secondary',
        body: '.cke_wysiwyg_div',
        saveButton: '[rx-view-component-id="d735ac20-de9c-4b76-a226-2d9c577d4bd0"] .d-button_primary',
        cancelButton: '[rx-view-component-id="85dcb9ba-5367-4f65-8613-920291ce4786"] .d-button_secondary'
    }

    async setTemplateName(templateNameValue: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.templateName)));
        await $(this.selectors.templateName).clear();
        await $(this.selectors.templateName).sendKeys(templateNameValue);
    }

    async setStatusValue(statusValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.status, statusValue);
    }

    async setCompanyValue(companyValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.company, companyValue);
    }

    async setLanguageValue(languageValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.language, languageValue);
    }

    async setLabelValue(labelValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.status, labelValue);
    }

    async setBody(bodyValue: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.body)));
        await $(this.selectors.body).sendKeys(bodyValue);
    }

    async clickOnInsertFieldLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.insertField)));
        await $(this.selectors.insertField).click();
    }

    async clickOnSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        $(this.selectors.saveButton).click();
    }
}
export default new createNotesTemplate();