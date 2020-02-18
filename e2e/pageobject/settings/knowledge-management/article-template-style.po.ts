import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class ArticleTemplateStyle {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        knowledgeset: '.template-styles .knowledgeSetTitle',
        templateName: '.templates',
        templateStyle: '.ka-config__edit-item-label',
        addNewStyle:'.icon-plus',
        deleteButtonIcon:'.delete-btn-icon',
        stylesName:'.create-ticket__item [ng-model="style.type"]',
        saveButton:'.ka-config__add-btn',
        styleNameRequired:'.label__text_required',
        cancelButton:'.action-panel__cancel-btn',
    }

    async clickSaveButton():Promise<void>{
        await $(this.selectors.saveButton).click();
    }

    async clickCancelButton():Promise<void>{
        await $(this.selectors.cancelButton).click();
    }

    async isDeleteStyleButtonPresent():Promise<boolean>{
        return await $(this.selectors.deleteButtonIcon).isPresent();
    }

    async clickAddNewStyle():Promise<void>{
        await $(this.selectors.addNewStyle).click();
    }

    async clickDeleteButton():Promise<void>{
        await $$('.templateStyles').last().$(this.selectors.deleteButtonIcon).click();
    }

    async isSaveButtonEnabled():Promise<boolean>{
        return await $(this.selectors.saveButton).isEnabled();
    }

    async getStyleNameFieldRequiredValue():Promise<string>{
        let nameElement =   await element.all(by.cssContainingText(this.selectors.styleNameRequired,'Style Name')).first();
        let value:string = await browser.executeScript('return window.getComputedStyle(arguments[0], ":after").content;', nameElement);
        return await value.trim().substring(3,value.length-2);
       }

    async isAddedStyleDeleted(styleName:string):Promise<boolean>{
        return  await element.all(by.cssContainingText('.templateStyles',styleName)).first().isPresent(); 
    }
    
    async setStyleName(values:string):Promise<void>{
       await $$(this.selectors.stylesName).last().sendKeys(values);
    }

    async isAddNewStyleButtonDisplay():Promise<boolean>{
        return await $(this.selectors.addNewStyle).isDisplayed();
    }

    async navigateToTemplateName(knowledgesetValue:string,templateNameValue:string): Promise<void> {
        await element.all(by.cssContainingText(this.selectors.knowledgeset,knowledgesetValue)).first().click();
        await element.all(by.cssContainingText(this.selectors.templateName,templateNameValue)).first().click();
    }

    async isDefaultTemplateDisplayed(templatNameValue:string):Promise<boolean>{
       return await element.all(by.cssContainingText(this.selectors.templateName,templatNameValue)).first().isDisplayed();
     }

    async getStyleOfAllTemplate(): Promise<string> {
        let allstyle="";
        let countofstyle: number = await $$(this.selectors.templateStyle).count();
        for (let i = 0; i < countofstyle; i++) {
            let message = await $$(this.selectors.templateStyle).get(i).getText();
            allstyle = (allstyle)+" "+message;
        }
        return allstyle;
    }
}
export default new ArticleTemplateStyle();