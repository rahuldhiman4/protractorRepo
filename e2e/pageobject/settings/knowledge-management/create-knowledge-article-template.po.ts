import { $, browser, protractor, ProtractorExpectedConditions, element, by } from "protractor";
import utilCommon from '../../../utils/util.common';

class CreateKATemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        templateName: '[name="templateName"]',
        knowledgeSet: '[ng-model="knowledgeSetTitle"]',
        disabledEnabledCheck: '.d-checkbox__label .d-checkbox__item',
        addsection:'.d-icon-left-plus_circle',
        sectionTitle:'.rx-template-editor-text-fields input',
        templateDescription:'.d-textfield textarea',
        saveButton: 'button[type="submit"]'

    }

    async setTemplateName(value:string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        await $(this.selectors.templateName).sendKeys(value);
    }

    async setDescription(value:string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateDescription)));
        await $(this.selectors.templateDescription).sendKeys(value);
    }

    async setKnowledgeSetValue(value:string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeSet)));
        await $(this.selectors.knowledgeSet).click();
        let customXpath=`option[title='${value}']`;
//        await browser.wait(this.EC.elementToBeClickable($(customXpath)));
        await $(customXpath).click();
    }

    async clickOnDisableEnableCheckBox(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.disabledEnabledCheck)));
        await $(this.selectors.disabledEnabledCheck).click();
    }

    async clickOnAddSection(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addsection)));
        await $(this.selectors.addsection).click();
    }

    async setSectionTitle(value:string):Promise<void>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.sectionTitle)));
        await $(this.selectors.sectionTitle).sendKeys(value);
    }

    async clickOnSaveButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
//        await utilCommon.waitUntilPopUpDisappear();
    }

}
export default new CreateKATemplate();