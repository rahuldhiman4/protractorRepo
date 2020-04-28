import { $, browser, by, element, protractor, ProtractorExpectedConditions, $$, Key } from "protractor";
import utilCommon from '../../../utils/util.common';

class CreateEmailTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="310bbc87-54ee-4994-9a1e-93b1982155f2"] input',
        companyGuid: 'd240380a-1de2-4b28-9082-81e96fc21415',
        statusGuid: '3cfbfd34-19ff-4ddb-818b-23b19c859dbe',
        labelGuid: 'a0774e28-42c2-4132-9da4-0063545e791f',
        description: '[rx-view-component-id="0fab6085-678b-442a-851d-25085b0bde8c"] input',
        subject: '[rx-view-component-id="187510cc-9804-46e2-bbda-0cdba1d6c83c"] textarea',
        body: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_editable',
        insertField:'[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_button__expressioneditor_icon',
        fieldValueInBody:'[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_wysiwyg_div span',
        saveButton:'[rx-view-component-id="093a0eeb-c1e0-4ed8-945f-da46d9bbde88"] button',
        cancelButton: '[rx-view-component-id="9aeef4d7-1a10-4ffd-aa3a-22665c32883c"] button',
    }

    async setTemplateName(value: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        await $(this.selectors.templateName).sendKeys(value);
    }

    async selectCompany(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyGuid, value);
    }

    async selectStatusDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, value);
    }

    async selectLabelDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.labelGuid, value);
    }

    async setDescription(value: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.description)));
        await $(this.selectors.description).sendKeys(value);
    }

    async setSubject(value: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.subject)));
        await $(this.selectors.subject).sendKeys(value);
    }

    async setFontBody(value: string):Promise<void>{
        await $(this.selectors.body).sendKeys(value);
    }
    async setBody(value: string): Promise<void> {
        await $(this.selectors.body).sendKeys(Key.chord(Key.CONTROL, Key.END));
        await $(this.selectors.body).sendKeys(Key.ENTER);
        await $(this.selectors.body).sendKeys(value);
    }

    async clickOnInsertField(): Promise<void> {
        await $(this.selectors.insertField).click();
    }

    async clickOnSaveButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }
    
    async clickOnCancelButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async isDynamicFieldDisplayedInBody(value:string):Promise<boolean>{
        return await element(by.cssContainingText(this.selectors.fieldValueInBody, value)).isDisplayed();
    }

    async clickInTableRowOfEmailTemplate(row: number, column:number, summary:string):Promise<void>{
        let locator=`table[summary='${summary}'] tr`;
        let rowLocator = await $$(locator).get(row-1);
        await rowLocator.$$('td').get(column-1).click();
    }

    async setDataInEmailTemplateTable(row: number, column: number, value: string, summary: string): Promise<void> {
        let locator=`table[summary='${summary}'] tr`;
        let rowLocator = await $$(locator).get(row-1);
        await rowLocator.$$('td').get(column-1).sendKeys(value);
    }

}
export default new CreateEmailTemplate();