import { $, $$, browser, by, element, ElementFinder, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import imagePropertiesPo from '../../../pageobject/settings/common/image-properties.po';

class CKEditor {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        activityNoteCKEditor: '.bwf-rich-text-editor[style="display: block;"]',
        bodyTextArea: '.cke_enable_context_menu, .cke_editable_themed',
        linkIcon: '.cke_toolbar .cke_button__link_icon',
        boldIcon: '.cke_button__bold_icon',
        italicIcon: '.cke_button__italic_icon',
        underLineIcon: '.cke_button__underline_icon',
        leftAlignIcon: '.cke_button__justifyleft_icon',
        centerAlignIcon: '.cke_button__justifycenter_icon',
        rightAlignIcon: '.cke_button__justifyright_icon',
        colorIcon: '.cke_button__textcolor',
        styleDropDown:'a.cke_combo_button',
        numberIcon: '.cke_button__numberedlist_icon',
        bulletIcon: '.cke_button__bulletedlist_icon',
        maximizeMinimizeicon: '.cke_button__maximize_icon',
        maximizeMinimizeWindow: '.cke_button__maximize',
        fontType: '.cke_combo__font',
        fontSize: '.cke_combo__fontsize',
        frame: 'iframe.cke_wysiwyg_frame',
        boldTextCkEditorTextArea: '.cke_enable_context_menu strong',
        italicTextCkEditorTextArea: '.cke_enable_context_menu em',
        underlineTextCkEditorTextArea: '.cke_enable_context_menu u',
        colorTextCkEditorTextArea: '.cke_enable_context_menu span',
        alignmentTextCkEditorTextArea: '.cke_enable_context_menu div',
        rightAlignText:'.cke_enable_context_menu div[style="text-align: right;"]',
        centerAlignText:'.cke_enable_context_menu div[style="text-align: center;"]',
        numberListCkEditorTextArea: '.cke_enable_context_menu ol li',
        bulletListTextCkEditorTextArea: '.cke_enable_context_menu ul li',
        linkTextCkEditorTextArea: '.cke_enable_context_menu a',
        tableIcon:'.cke_toolbar .cke_button__table_icon',
        imageIcon:'.cke_toolbar .cke_button__image_icon',
        ckEditor: '.cke_inner',
        ckEditorTextArea: '.cke_editable_themed',
        deletedTextInCKE:'.cke_editable_themed del',
    }

    async enterNewLineInCKE(guidId?:string):Promise<void>{
        let cke_editor='.cke_inner';
        let ckeTextArea='.cke_editable_themed';
        if (guidId) {
            cke_editor=`[rx-view-component-id="${guidId}"]`+this.selectors.ckEditor;
            ckeTextArea=`[rx-view-component-id="${guidId}"]`+this.selectors.ckEditorTextArea;
        }
        await $(cke_editor).isPresent().then(async (result) => {
            if (result) {
                await browser.wait(this.EC.elementToBeClickable($(ckeTextArea)), 3000).then(async () => {
                    await $(ckeTextArea).click();
                    await $(ckeTextArea).sendKeys(Key.HOME+Key.END +Key.ENTER+Key.ENTER);
                });
            }
        });
    } 

    async clickInTableCell(row: number, column: number, tableSummary?: string): Promise<void> {
        let locator;
        if(tableSummary) locator = `table[summary='${tableSummary}'] tr`;
        let rowLocator = await $$(locator).get(row - 1);
        await rowLocator.$$('td').get(column - 1).click();
     }

    async setDataInTable(row: number, column: number, value: string, tableSummary?: string): Promise<void> {
        let locator;
        if(tableSummary)  locator = `table[summary='${tableSummary}'] tr`;
        let rowLocator = await $$(locator).get(row - 1);
        await rowLocator.$$('td').get(column - 1).sendKeys(value);
     }

    async isCkEditorDisplayed(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.activityNoteCKEditor).click();
        else await $(this.selectors.activityNoteCKEditor).click();
    }

    async imageUploadWithURL(uploadURL:string,imageUrlFieldIndex:number,imageWidthFieldIndex:number,widthSize:string):Promise<void>{
        await imagePropertiesPo.setInputBoxValue(uploadURL, imageUrlFieldIndex);
        await imagePropertiesPo.setInputBoxValue(widthSize, imageWidthFieldIndex);
        await imagePropertiesPo.clickOnOkButton();
    }

    async isImageDisplayedInCKE(value: string):Promise<boolean>{
        return await $$(`img[src="${value}"]`).last().isDisplayed();
    }
    async uploadImageFromLocal(menuName: string, fileToUpload: string, width: number, getInputValue: number,widthSize:string): Promise<string> {
        await imagePropertiesPo.clickOnTab(menuName);
        await imagePropertiesPo.addAttachment(fileToUpload);
        await imagePropertiesPo.clickOnSendItToServerButton();
        await imagePropertiesPo.setInputBoxValue(widthSize, width);
        let source = await imagePropertiesPo.getInputBoxValue(getInputValue);
        await imagePropertiesPo.clickOnOkButton();
        return source;
    }
    async clickOnTableIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.tableIcon).click();
        else await $(this.selectors.tableIcon).click();
        await browser.sleep(1000);
    }

    async clickOnImageIcon(guidId?: string):Promise<void>{
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.imageIcon).click();
        else await $(this.selectors.imageIcon).click();
        await browser.sleep(1000);

    }
    async clickOnLinkIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.linkIcon).click();
        else await $(this.selectors.linkIcon).click();
        await browser.sleep(1000);
    }


    async clickOnBoldIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.boldIcon).click();
        else await $(this.selectors.boldIcon).click();
    }

    async clickOnItalicIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.italicIcon).click();
        else await $(this.selectors.italicIcon).click();
    }

    async clickOnUnderLineIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.underLineIcon).click();
        else await $(this.selectors.underLineIcon).click();
    }

    async clickOnLeftAlignIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.leftAlignIcon).click();
        else await $(this.selectors.leftAlignIcon).click();
    }

    async clickOnRightAlignIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.rightAlignIcon).click();
        else await $(this.selectors.rightAlignIcon).click();
    }


    async clickOnCenterAlignIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.centerAlignIcon).click();
        else await $(this.selectors.centerAlignIcon).click();
    }

    async selectColor(colorValue: string, guidId?: string): Promise<void> {
        if (guidId) { await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.colorIcon).click(); }
        else { await $(this.selectors.colorIcon).click(); }
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('iframe.cke_panel_frame').getWebElement());
        let locator: string = `a[title="${colorValue}"]`;
        await browser.wait(this.EC.elementToBeClickable($(locator)), 2000).then(async () => {
            await $(locator).click();
        });
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async selectStyles(styleValue:string,guidId?:string):Promise<void>{
        if (guidId) { await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.styleDropDown).click(); }
        else { await $(this.selectors.styleDropDown).click(); }
        await browser.sleep(1000);
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $$('iframe.cke_panel_frame').last().getWebElement());
        let locator: string = `a[title="${styleValue}"]`;
        await browser.wait(this.EC.elementToBeClickable($(locator)), 2000).then(async () => {
            await $(locator).click();
        });
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async clickOnFontTypeIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.fontType).click();
        else await $(this.selectors.fontType).click();
    }

    async clickOnFontSizeIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.fontSize).click();
        else await $(this.selectors.fontSize).click();
    }

    async clickMaximizeMinimizeIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.maximizeMinimizeicon).click();
        else await $(this.selectors.maximizeMinimizeicon).click();
    }

    async selectFontTypeOrSize(value: string, fontTypeOrFontSizeText: string, guidId?: string): Promise<void> {
        if (fontTypeOrFontSizeText == "FontType") { await this.clickOnFontTypeIcon(guidId); }
        else if (fontTypeOrFontSizeText == "FontSize") { await this.clickOnFontSizeIcon(guidId); }
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('.cke_panel.cke_combopanel iframe.cke_panel_frame').getWebElement());
        let locator = `a[title="${value}"]`;
        await browser.wait(this.EC.elementToBeClickable($(locator)), 2000).then(async () => {
            await $(locator).click();
        });
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async getTextCkEditorMinimizeOrMiximize(guidId?: string): Promise<string> {
        if (guidId) return await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.maximizeMinimizeWindow).getAttribute('title');
        else return await $(this.selectors.maximizeMinimizeWindow).getAttribute('title');
    }

    async setCKEditor(description: string, guid?: string): Promise<void> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame(await element(by.css('iframe.cke_wysiwyg_frame')).getWebElement());
            await $(this.selectors.bodyTextArea).clear();
            await $(this.selectors.bodyTextArea).sendKeys(description);
            await browser.switchTo().defaultContent();
            await browser.waitForAngularEnabled(true);
        }
        else{
            await utilityCommon.setCKEditor(description, guid);
        }
    }

    async updateCKEditor(description: string, guid?: string): Promise<void> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame(await element(by.css('iframe.cke_wysiwyg_frame')).getWebElement());
            await $(this.selectors.bodyTextArea).sendKeys(Key.chord(Key.CONTROL, Key.END));
            await $(this.selectors.bodyTextArea).sendKeys(Key.ENTER);
            await $(this.selectors.bodyTextArea).sendKeys(description);
            await browser.switchTo().defaultContent();
            await browser.waitForAngularEnabled(true);
        }
        else {
            await utilityCommon.updateCKEditor(description, guid);
        }
    }

    async getCKEditorText(guid?: string): Promise<string> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame(await element(by.css('iframe.cke_wysiwyg_frame')).getWebElement());
            await browser.wait(this.EC.elementToBeClickable($(this.selectors.bodyTextArea)), 3000);
            let value = await $(this.selectors.bodyTextArea).getText();
            await browser.switchTo().defaultContent();
            await browser.waitForAngularEnabled(true);
            return value;
        }
        else {
           return await utilityCommon.getCKEditorText(guid);
        }
    }

    async isBoldTextDisplayedInCkEditorTextArea(bodyText: string,boldTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if(!boldTextElement) boldTextElement=await $(this.selectors.bodyTextArea);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return boldTextElement.isPresent().then(async (result) => {
                if (result) {
                    let boldTextCke = await boldTextElement.getText();
                    if (boldTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return boldTextElement.isPresent().then(async (result) => {
                if (result) {
                    let boldTextCke = await boldTextElement.getText();
                    if (boldTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isItalicTextDisplayedInCkEditorTextArea( bodyText: string,italicTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if(!italicTextElement) italicTextElement=await $(this.selectors.italicTextCkEditorTextArea);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return italicTextElement.isPresent().then(async (result) => {
                if (result) {
                    let italicTextCke = await italicTextElement.getText();
                    if (italicTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return italicTextElement.isPresent().then(async (result) => {
                if (result) {
                    let italicTextCke = await italicTextElement.getText();
                    if (italicTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isUnderlineTextDisplayedInCkEditorTextArea( bodyText: string,underlineTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if(!underlineTextElement) underlineTextElement=await $(this.selectors.underlineTextCkEditorTextArea);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return underlineTextElement.isPresent().then(async (result) => {
                if (result) {
                    let italicTextCke = await underlineTextElement.getText();
                    if (italicTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return underlineTextElement.isPresent().then(async (result) => {
                if (result) {
                    let italicTextCke = await underlineTextElement.getText();
                    if (italicTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isColorTextDisplayedInCkEditorTextArea(bodyText: string,colorValue?:string,colorTextElement?: ElementFinder,): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if(!colorTextElement) colorTextElement=await $(`.cke_enable_context_menu span[style="${colorValue}"]`);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return colorTextElement.isPresent().then(async (result) => {
                if (result) {
                    let colorTextCke = await colorTextElement.getText();
                    if (colorTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else { 
            return colorTextElement.isPresent().then(async (result) => {
                if (result) {
                    let colorTextCke = await colorTextElement.getText();
                    if (colorTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isTextLeftAlignInCkEditorTextArea(bodyText: string,leftAlignTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if(!leftAlignTextElement) leftAlignTextElement=await $(this.selectors.alignmentTextCkEditorTextArea);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return leftAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let leftAlignTextCke = await leftAlignTextElement.getText();
                    if (leftAlignTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return leftAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let leftAlignTextCke = await leftAlignTextElement.getText();
                    if (leftAlignTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isTextRightAlignInCkEditorTextArea(bodyText: string,rightAlignTextElement?: ElementFinder,): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if(!rightAlignTextElement) rightAlignTextElement=await $(this.selectors.rightAlignText);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return rightAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let rightAlignTextCke = await rightAlignTextElement.getText();
                    if (rightAlignTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return rightAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let rightAlignTextCke = await rightAlignTextElement.getText();
                    if (rightAlignTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isTextCenterAlignInCkEditorTextArea(bodyText: string,centerAlignTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if(!centerAlignTextElement) centerAlignTextElement=await $(this.selectors.centerAlignText);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return centerAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let centerAlignTextCke = await centerAlignTextElement.getText();
                    if (centerAlignTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return centerAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let centerAlignTextCke = await centerAlignTextElement.getText();
                    if (centerAlignTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isNumberListDisplayedInCkEditorTextArea( bodyText: string,numberListTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if(!numberListTextElement) numberListTextElement=await $(this.selectors.numberListCkEditorTextArea);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return numberListTextElement.isPresent().then(async (result) => {
                if (result) {
                    let numberListTextCke = await numberListTextElement.getText();
                    if (numberListTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return numberListTextElement.isPresent().then(async (result) => {
                if (result) {
                    let numberListTextCke = await numberListTextElement.getText();
                    if (numberListTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isBulletListDisplayedInCkEditorTextArea(bodyText: string,bulletListTextElement: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if(!bulletListTextElement) bulletListTextElement=await $(this.selectors.bulletListTextCkEditorTextArea);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return bulletListTextElement.isPresent().then(async (result) => {
                if (result) {
                    let bulletListTextCke = await bulletListTextElement.getText();
                    if (bulletListTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return bulletListTextElement.isPresent().then(async (result) => {
                if (result) {
                    let bulletListTextCke = await bulletListTextElement.getText();
                    if (bulletListTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async getColorFontStyleOfText(rowNumber: number, columnNumber: number, value: string): Promise<string> {
        let row = await $$('.cke_contents table tr').get(rowNumber - 1);
        let cell = await row.$$('td').get(columnNumber - 1);
        let locator = `span[style='${value}']`;
        return await cell.$(locator).getAttribute('innerHTML');
    }

    async isLinkDisplayedInCkEditorTextArea(bodyText: string,linkTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if(!linkTextElement)  linkTextElement=await $$(this.selectors.linkTextCkEditorTextArea).first();
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return linkTextElement.isPresent().then(async (result) => {
                if (result) {
                    let linkTextCke = await linkTextElement.getText();
                    if (linkTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return linkTextElement.isPresent().then(async (result) => {
                if (result) {
                    let linkTextCke = await linkTextElement.getText();
                    if (linkTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    
}
export default new CKEditor();