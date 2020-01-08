import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class CreateEmailTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="310bbc87-54ee-4994-9a1e-93b1982155f2"] input',
        company: 'd240380a-1de2-4b28-9082-81e96fc21415',
        description: '[rx-view-component-id="0fab6085-678b-442a-851d-25085b0bde8c"] input',
        subject: '[rx-view-component-id="187510cc-9804-46e2-bbda-0cdba1d6c83c"] textarea',
        body: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_editable',
        insertField:'[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_button__expressioneditor_icon',
        fieldValueInBody:'[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_wysiwyg_div span',
        saveButton:'[rx-view-component-id="093a0eeb-c1e0-4ed8-945f-da46d9bbde88"] button'
    }

    async setTemplateName(value: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        await $(this.selectors.templateName).sendKeys(value);
    }

    async selectCompany(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.company, value);
    }

    async setDescription(value: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.description)));
        await $(this.selectors.description).sendKeys(value);
    }

    async setSubject(value: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.subject)));
        await $(this.selectors.subject).sendKeys(value);
    }

    async setBody(value: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.body)));
        await $(this.selectors.body).sendKeys(value);
    }

    async clickOnInsertField(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.insertField)));
        await $(this.selectors.insertField).click();
    }

    async clickOnSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async isDynamicFieldDisplayedInBody(value:string):Promise<boolean>{
        return await element(by.cssContainingText(this.selectors.fieldValueInBody, value)).isDisplayed();
    }
}
export default new CreateEmailTemplate();