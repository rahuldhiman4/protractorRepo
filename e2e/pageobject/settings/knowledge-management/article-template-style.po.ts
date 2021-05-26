import utilityCommon from '../../../utils/utility.common';
import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class ArticleTemplateStyle {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        knowledgeset: '.bwf-define_knowledge-styles .knowledgeSetTitle',
        templateName: '.bwf-template-name',
        templateStyle: '.bwf-ka-config__edit-template-sections .text-direction span',
        addNewStyle: '.add_new_style',
        deleteButtonIcon: '.card-title-text button',
        stylesName: '.bwf-left-align [name="templateName"]',
        saveButton: 'button[btn-type="primary"]',
        styleNameRequired: 'adapt-textfield[name="templateName"] input.form-control',
        cancelButton: '.btn-secondary.btn-primary span',
        sectionTitle: 'adapt-accordion-tab .text-direction span',
        boldIcon: 'button .d-icon-bold',
        italicIcon: 'button .d-icon-italic',
        underLineIcon: 'button .d-icon-underline',
        leftAlignIcon: 'button .d-icon-align_left',
        rightAlignIcon: 'button .d-icon-align_right',
        justifyAlignIcon: 'button .d-icon-lines',
        strikeOutIcon: 'button .d-icon-strikeout',
        centeralAlignIcon: 'button .d-icon-align_center',
        previewBox: '.label_control-wrap [name="textarea"]',
        fontDropdown: 'button[aria-label="Font"]',
        fontDropdownValue: 'div.rx-select__options .rx-select__option-content div',
        textColor: '.bwf-left-align .adapt-cp-input-wrapper div input',
        backGroundColor: '.bwf-right-align .adapt-cp-input-wrapper div input'
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async isDeleteStyleButtonPresent(): Promise<boolean> {
        return await $$(this.selectors.deleteButtonIcon).last().isDisplayed();
    }

    async clickAddNewStyle(): Promise<void> {
        await $(this.selectors.addNewStyle).click();
    }

    async clickDeleteButton(styleName: string): Promise<void> {
        await element.all(by.cssContainingText('.bwf-templateStyles', styleName)).first().$(this.selectors.deleteButtonIcon).click();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }

    async isStyleNameFieldRequired(): Promise<boolean> {
        return await $$(this.selectors.styleNameRequired).last().getAttribute("aria-required") == "true";
    }

    async isAddedStyleDeleted(styleName: string): Promise<boolean> {
        return await element.all(by.cssContainingText('.templateStyles', styleName)).first().isPresent();
    }

    async setStyleName(values: string): Promise<void> {
        await $$(this.selectors.stylesName).last().clear();
        await $$(this.selectors.stylesName).last().sendKeys(values);
    }

    async isAddNewStyleButtonDisplay(): Promise<boolean> {
        return await $(this.selectors.addNewStyle).isDisplayed();
    }

    async navigateToTemplateName(knowledgesetValue: string, templateNameValue: string): Promise<void> {
        await element.all(by.cssContainingText(this.selectors.knowledgeset, knowledgesetValue)).first().click();
        await element.all(by.cssContainingText(this.selectors.templateName, templateNameValue)).first().click();
    }

    async isDefaultTemplateDisplayed(templatNameValue: string): Promise<boolean> {
        return await element.all(by.cssContainingText(this.selectors.templateName, templatNameValue)).first().isDisplayed();
    }

    async getStyleOfAllTemplate(): Promise<string> {
        let allstyle = "";
        let countofstyle: number = await $$(this.selectors.templateStyle).count();
        for (let i = 0; i < countofstyle; i++) {
            let message = await $$(this.selectors.templateStyle).get(i).getText();
            allstyle = (allstyle) + " " + message;
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
                let textAttribute: string = await $$(this.selectors.previewBox).last().getAttribute('style');
                return textAttribute.includes('font-weight: bold;');
                break;
            }
            case "Italic": {
                let textAttribute: string = await $$(this.selectors.previewBox).last().getAttribute('style');
                return textAttribute.includes('font-style: italic;');
                break;
            }
            case "Underline": {
                let textAttribute: string = await $$(this.selectors.previewBox).last().getAttribute('style');
                return textAttribute.includes('text-decoration: underline;');
                break;
            }
            case "Strikethrough": {
                let textAttribute: string = await $$(this.selectors.previewBox).last().getAttribute('style');
                return textAttribute.includes('text-decoration: line-through;');
                break;
            }
            case "Align Center": {
                let textAttribute: string = await $$(this.selectors.previewBox).last().getAttribute('style');
                return textAttribute.includes('text-align: center;');
                break;
            }
            case "Align Left": {
                let textAttribute: string = await $$(this.selectors.previewBox).last().getAttribute('style');
                return textAttribute.includes('text-align: left;');
                break;
            }
            case "Align Right": {
                let textAttribute: string = await $$(this.selectors.previewBox).last().getAttribute('style');
                return textAttribute.includes('text-align: right;');
                break;
            }
            case "Justify": {
                let textAttribute: string = await $$(this.selectors.previewBox).last().getAttribute('style');
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
                let textAttribute: string = await $$(this.selectors.previewBox).last().getAttribute('style');
                return textAttribute.includes(`font-family: ${value};`);
                break;
            }
            case "Text Color": {
                let textAttribute: string = await $$(this.selectors.previewBox).last().getAttribute('style');
                return textAttribute.includes(`color: ${value};`);
                break;
            }
            case "Background Color": {
                let textAttribute: string = await $$(this.selectors.previewBox).last().getAttribute('style');
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
        await $$(this.selectors.textColor).last().click();
        await $$(this.selectors.textColor).last().clear();
        await $$(this.selectors.textColor).last().sendKeys(value);
    }

    async selectBackgroundColor(value: string): Promise<void> {
        await $$(this.selectors.backGroundColor).last().click();
        await $$(this.selectors.backGroundColor).last().clear();
        await $$(this.selectors.backGroundColor).last().sendKeys(value);
    }
}
export default new ArticleTemplateStyle();
