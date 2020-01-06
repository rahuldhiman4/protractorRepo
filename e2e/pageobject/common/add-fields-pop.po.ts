import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class addField {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        fieldVariable: '.rx-data-dictionary-item-value',
        parentFields: '.rx-tree-node-parent',
        okButtonOnEditor: '.rx-expression-editor-action-buttons .d-button_primary',
        cancelButtonOnEditor: '.rx-expression-editor-action-buttons .d-button_secondary',
        addField: '.rx-expression-editor-dictionary h5',
        groupName:'.rx-data-dictionary-item div'
    }

    async getHeaderOfAddfield(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addField)));
        return $(this.selectors.addField).getText();
    }
    
    async navigateToDynamicFieldInCaseTemplate(fromTemplate:string){
        let option = await element(by.cssContainingText(this.selectors.parentFields, 'Additional Fields from Case Template'));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
        let templateName = await element(by.cssContainingText(this.selectors.parentFields, fromTemplate));
        await browser.wait(this.EC.elementToBeClickable(templateName));
        await templateName.click();
    }

    async navigateToDynamicFieldInTaskTemplate(fromTemplate:string){
        let option = await element(by.cssContainingText(this.selectors.parentFields, 'Additional Fields from Task Template'));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
        let templateName = await element(by.cssContainingText(this.selectors.parentFields, fromTemplate));
        await browser.wait(this.EC.elementToBeClickable(templateName));
        await templateName.click();
    }

    async navigateToAssociationsInCase(){
        let option = await element(by.cssContainingText(this.selectors.parentFields, 'Case'));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
        let associations = await element(by.cssContainingText(this.selectors.parentFields, 'Associations'));
        await browser.wait(this.EC.elementToBeClickable(associations));
        await associations.click();
    }

    async navigateToAssociationsInTask(){
        let option = await element(by.cssContainingText(this.selectors.parentFields, 'Task'));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
        let associations = await element(by.cssContainingText(this.selectors.parentFields, 'Associations'));
        await browser.wait(this.EC.elementToBeClickable(associations));
        await associations.click();
    }

    async isAssocitionDisplayed(value:string):Promise<boolean>{
        return await element(by.cssContainingText(this.selectors.parentFields, value)).isDisplayed();
    }

    async clickOnAssocitionAndSelectField(association:string,fieldValue:string):Promise<void>{
        let option = await element(by.cssContainingText(this.selectors.parentFields, association));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click(); 
        await this.selectDynamicField(fieldValue);
    }

    async isDynamicFieldPresentInTemplate(value:string):Promise<boolean>{
       return await element(by.cssContainingText(this.selectors.fieldVariable, value)).isDisplayed();
    }

    async selectDynamicField(value:string):Promise<void>{
        var fieldValue = await element(by.cssContainingText(this.selectors.fieldVariable, value));
        await browser.wait(this.EC.elementToBeClickable(fieldValue));
        await browser.actions().mouseMove(fieldValue).doubleClick().perform();
    
    }

    async clickOnGroupName(groupvalue:string):Promise<void>{
        var groupName = await element(by.cssContainingText(this.selectors.groupName,groupvalue));
        await browser.wait(this.EC.elementToBeClickable(groupName));
        await groupName.click();
    }

    async isCaseTemplatePresent(caseTemplateValue:string):Promise<boolean>{
        return await element(by.cssContainingText(this.selectors.parentFields, caseTemplateValue)).isPresent();
    }
    async setValueOfField(fromTree: string, value: string): Promise<void> {
        var option = await element(by.cssContainingText(this.selectors.parentFields, fromTree));
        await browser.wait(this.EC.visibilityOf(option));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
        var fieldValue = await element(by.cssContainingText(this.selectors.fieldVariable, value));
        await browser.wait(this.EC.visibilityOf(fieldValue));
        await browser.wait(this.EC.elementToBeClickable(fieldValue));
        await browser.actions().mouseMove(fieldValue).doubleClick().perform();
    }

    async clickOnOkButtonOfEditor(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.okButtonOnEditor)));
        await $(this.selectors.okButtonOnEditor).click();
    }

}
export default new addField();