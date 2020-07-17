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
        sectionTitle: 'div.default-section-title',
        boldIcon: 'label[title="Bold"]',
        italicIcon: 'label[title="Italic"]',
        underLineIcon: 'label[title="Underline"]',
        leftAlignIcon: 'label[title="Align Left"]',
        rightAlignIcon: 'label[title="Align Right"]',
        justifyAlignIcon: 'label[title="Justify"]',
        strikeOutIcon: 'label[title="Strikethrough"]',
        centeralAlignIcon: 'label[title="Center"]',
        previewBox: 'textarea.create-ticket__item',
        fontDropdown: 'select[ng-model="selected_css.fontFamily.value"]',
        fontDropdownValue: 'select[ng-model="selected_css.fontFamily.value"] option',
        textColor: 'input[ng-model="selected_css.color.value"]',
        backGroundColor: 'input[ng-model="selected_css.backgroundColor.value"]'
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

    async isSectionTitlePresent(sectionTitleText: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.sectionTitle, sectionTitleText)).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText(this.selectors.sectionTitle, sectionTitleText)).isDisplayed();
            else return false;
        });
    }

    async clickOnBoldIcon(): Promise<void> {
        await $$(this.selectors.boldIcon).last().click();
    }

    async clickOnItalicIcon(): Promise<void> {
        await $$(this.selectors.italicIcon).last().click();
    }

    async clickOnUnderLineIcon(): Promise<void> {
        await $$(this.selectors.underLineIcon).last().click();
    }

    async clickOnLeftAlignIcon(): Promise<void> {
        await $$(this.selectors.leftAlignIcon).last().click();
    }

    async clickOnRightAlignIcon(): Promise<void> {
        await $$(this.selectors.rightAlignIcon).last().click();
    }

    async clickOnStrikeOutIcon(): Promise<void> {
        await $$(this.selectors.strikeOutIcon).last().click();
    }

    async clickOnCenterAlignIcon(): Promise<void> {
        await $$(this.selectors.centeralAlignIcon).last().click();
    }

    async isTextDisplayedInPreviewBox(styleName: string): Promise<boolean> {
        switch (styleName) {
            case "Bold": {
                let textAttribute: string = await $$(this.selectors.previewBox).getAttribute('style');
                return textAttribute.includes('font-weight: bold;');
                break;
            }
            case "Italic": {
                let textAttribute: string = await $$(this.selectors.previewBox).getAttribute('style');
                return textAttribute.includes('font-style: italic;');
                break;
            }
            case "Underline": {
                let textAttribute: string = await $$(this.selectors.previewBox).getAttribute('style');
                return textAttribute.includes('text-decoration: underline;');
                break;
            }
            case "Strikethrough": {
                let textAttribute: string = await $$(this.selectors.previewBox).getAttribute('style');
                return textAttribute.includes('text-decoration: line-through;');
                break;
            }
            case "Align Center": {
                let textAttribute: string = await $$(this.selectors.previewBox).getAttribute('style');
                return textAttribute.includes('text-align: center;');
                break;
            }
            case "Align Left": {
                let textAttribute: string = await $$(this.selectors.previewBox).getAttribute('style');
                return textAttribute.includes('text-align: left;');
                break;
            }
            case "Align Right": {
                let textAttribute: string = await $$(this.selectors.previewBox).getAttribute('style');
                return textAttribute.includes('text-align: right;');
                break;
            }
            case "Justify": {
                let textAttribute: string = await $$(this.selectors.previewBox).getAttribute('style');
                return textAttribute.includes('text-align: justify;');
                break;
            }
            default: {
                console.log('No such a match');
                break;
            }
        }
    }
    async isFontStylDetailsDisplayed(styleName: string, value: string): Promise<boolean> {
        switch (styleName) {
            case "Font Family": {
                let textAttribute: string = await $$(this.selectors.previewBox).getAttribute('style');
                return textAttribute.includes(`font-family: ${value};`);
                break;
            }
            case "Text Color": {
                let textAttribute: string = await $$(this.selectors.previewBox).getAttribute('style');
                return textAttribute.includes(`color: ${value};`);
                break;
            }
            case "Background Color": {
                let textAttribute: string = await $$(this.selectors.previewBox).getAttribute('style');
                return textAttribute.includes(`background-color: ${value};`);
                break;
            }
            default: {
                console.log('No such a match');
                break;
            }
        }
    }

    async selectFont(value: string): Promise<void> {
        await $$(this.selectors.fontDropdown).last().click();
        await element.all(by.cssContainingText(this.selectors.fontDropdownValue, value)).last().click();
    }

    async selectTextColor(value: string): Promise<void> {
        await $$(this.selectors.textColor).last().sendKeys(value);
    }

    async selectBackgroundColor(value: string): Promise<void> {
        await $$(this.selectors.backGroundColor).last().sendKeys(value);
    }
}
export default new ArticleTemplateStyle();