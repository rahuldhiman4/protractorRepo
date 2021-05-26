import { $, $$, browser, by, element, ElementFinder, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import imagePropertiesPo from '../../../pageobject/settings/common/image-properties.po';

class CKEditor {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        bodyTextArea: '.cke_enable_context_menu, .cke_editable_themed',
        linkIcon: '.cke_toolbar .cke_button__link_icon',
        boldIcon: '.cke_button__bold_icon',
        italicIcon: '.cke_button__italic_icon',
        underLineIcon: '.cke_button__underline_icon',
        leftAlignIcon: '.cke_button__justifyleft_icon',
        centerAlignIcon: '.cke_button__justifycenter_icon',
        rightAlignIcon: '.cke_button__justifyright_icon',
        colorIcon: '.cke_button__textcolor',
        styleDropDown: 'a.cke_combo_button',
        maximizeMinimizeicon: '.cke_button__maximize_icon',
        fontType: '.cke_combo__font',
        fontSize: '.cke_combo__fontsize',
        frame: 'iframe.cke_wysiwyg_frame,[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] iframe.cke_wysiwyg_frame',
        tableIcon: '.cke_toolbar .cke_button__table_icon',
        imageIcon: '.cke_toolbar .cke_button__image_icon',
        ckEditor: '.cke_inner',
        ckEditorTextArea: '.cke_editable_themed',
        fontDropDown: 'a[title="Font Size"]',
        justifyAlignIcon: '.cke_button__justifyblock_icon',
        strikeThroughIcon: '.cke_button__strike_icon',
        numberIcon: '.cke_button__numberedlist_icon',
        bulletIcon: '.cke_button__bulletedlist_icon',
    }

    async enterNewLineInCKE(guidId?: string): Promise<void> {
        let cke_editor = '.cke_inner';
        let ckeTextArea = '.cke_editable_themed';
        if (guidId) {
            cke_editor = `[rx-view-component-id="${guidId}"] .cke_inner`;
            ckeTextArea = `[rx-view-component-id="${guidId}"] .cke_editable_themed`;
        }
        await $(cke_editor).isPresent().then(async (result) => {
            if (result) {
                await browser.wait(this.EC.elementToBeClickable($(ckeTextArea)), 3000).then(async () => {
                    // await utilityCommon.scrollToElement($(ckeTextArea));
                    // await $(ckeTextArea).click();
                    await $(ckeTextArea).sendKeys(Key.HOME + Key.END + Key.ENTER + Key.ENTER);
                });
            }
        });
    }

    async clickInTableCell(row: number, column: number, tableSummary?: string): Promise<void> {
        let locator;
        if (tableSummary) locator = `table[summary='${tableSummary}'] tr`;
        let framePresent = await $(this.selectors.frame).isPresent();
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            await browser.sleep(1000); // sleep required for proper frame switch
            let rowLocator = await $$(locator).get(row - 1);
            await rowLocator.$$('td').get(column - 1).click();
            await browser.switchTo().defaultContent();
            await browser.waitForAngularEnabled(true);
        }
        else {
            let rowLocator = await $$(locator).get(row - 1);
            await rowLocator.$$('td').get(column - 1).click();
        }
    }

    async setDataInTable(row: number, column: number, value: string, tableSummary?: string): Promise<void> {
        let locator;
        if (tableSummary) locator = `table[summary='${tableSummary}'] tr`;
        let framePresent = await $(this.selectors.frame).isPresent();
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            let rowLocator = await $$(locator).get(row - 1);
            await rowLocator.$$('td').get(column - 1).sendKeys(value);
            await browser.switchTo().defaultContent();
            await browser.waitForAngularEnabled(true);
        }
        else {
            let rowLocator = await $$(locator).get(row - 1);
            await rowLocator.$$('td').get(column - 1).sendKeys(value);
        }
    }

    async imageUploadWithURL(uploadURL: string, imageUrlFieldIndex: number, imageWidthFieldIndex: number, widthSize: string): Promise<void> {
        await imagePropertiesPo.setInputBoxValue(uploadURL, imageUrlFieldIndex);
        await imagePropertiesPo.setInputBoxValue(widthSize, imageWidthFieldIndex);
        await browser.sleep(1000); // To Wait For Image Upload.
        await imagePropertiesPo.clickOnOkButton();
    }

    async uploadImageFromLocal(menuName: string, fileToUpload: string, width: number, getInputValue: number, widthSize: string): Promise<string> {
        await imagePropertiesPo.clickOnTab(menuName);
        await imagePropertiesPo.addAttachment(fileToUpload);
        await imagePropertiesPo.clickOnSendItToServerButton();
        await imagePropertiesPo.setInputBoxValue(widthSize, width);
        let source = await imagePropertiesPo.getInputBoxValue(getInputValue);
        await browser.sleep(2000); // To wait For Image Set Correctly
        await imagePropertiesPo.clickOnOkButton();
        return source;
    }

    async clickOnTableIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.tableIcon).click();
        else await $(this.selectors.tableIcon).click();
        await browser.sleep(1000); // To Wait For Table Pop-up Gets Open.
    }

    async clickOnImageIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.imageIcon).click();
        else await $(this.selectors.imageIcon).click();
        await browser.sleep(1000); // To Wait For Image Pop-up Gets Open.

    }

    async clickOnLinkIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.linkIcon).click();
        else await $(this.selectors.linkIcon).click();
        await browser.sleep(1000); // To Wait Until Link Pop-Up Gets Open.
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
        await browser.sleep(500); // Wait until text/cursor gets aligned
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.leftAlignIcon).click();
        else await $(this.selectors.leftAlignIcon).click();
        await browser.sleep(500); // Wait until text/cursor gets aligned
    }

    async clickOnRightAlignIcon(guidId?: string): Promise<void> {
        await browser.sleep(500); // Wait until text/cursor gets aligned
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.rightAlignIcon).click();
        else await $(this.selectors.rightAlignIcon).click();
        await browser.sleep(500); // Wait until text/cursor gets aligned
    }

    async clickOnCenterAlignIcon(guidId?: string): Promise<void> {
        await browser.sleep(500); // Wait until text/cursor gets aligned
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.centerAlignIcon).click();
        else await $(this.selectors.centerAlignIcon).click();
        await browser.sleep(500); // Wait until text/cursor gets aligned
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

    async selectStyles(styleValue: string, guidId?: string): Promise<void> {
        if (guidId) { await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.styleDropDown).click(); }
        else { await $(this.selectors.styleDropDown).click(); }
        await browser.sleep(1000); // Wait For Show Styles From Drop Down And Switch To Frame.
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
        else {
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

    async updateDescription(caseDescription: string): Promise<void> {
        await $(this.selectors.ckEditor).isPresent().then(async (result) => {
            if (result) {
                await browser.wait(this.EC.elementToBeClickable($(this.selectors.ckEditorTextArea)), 3000).then(async () => {
                    await $(this.selectors.ckEditorTextArea).sendKeys(caseDescription);
                });
            }
        });
    }

    async selectFont(fontValue, guidId?: string): Promise<void> {
        if (guidId) { await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.fontDropDown).click(); }
        else { await $(this.selectors.fontDropDown).click(); }
        await browser.sleep(1000); // Wait For Font Drop down Values Shows And Switch To Frame.
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $$('iframe.cke_panel_frame').last().getWebElement());
        let locator: string = `a[title="${fontValue}"]`;
        await browser.wait(this.EC.elementToBeClickable($(locator)), 2000).then(async () => {
            await $(locator).click();
        });
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async clickOnJustifyAlignIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.justifyAlignIcon).click();
        else await $(this.selectors.justifyAlignIcon).click();
        await browser.sleep(1000); // Wait For Text/Cursor Gets Allign As Per Justify Functionality
    }

    async clickOnStrikeThroughIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.strikeThroughIcon).click();
        else await $(this.selectors.strikeThroughIcon).click();
    }

    // input should be a list
    async setNumberList(values: string[], guidId?: string): Promise<void> {
        let locator: string;
        let bodyArea = this.selectors.bodyTextArea;
        if (guidId) {
            locator = `[rx-view-component-id="${guidId}"] .cke_button__numberedlist_icon`;
            bodyArea = `[rx-view-component-id="${guidId}"] ${bodyArea}` ;
        }
        else { locator = await this.selectors.numberIcon }

        let framePresent = await $(this.selectors.frame).isPresent();
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            await $(this.selectors.bodyTextArea).sendKeys(Key.CONTROL, Key.END);
            await $(this.selectors.bodyTextArea).sendKeys(Key.ENTER);
            await browser.switchTo().defaultContent();
            await browser.waitForAngularEnabled(true);
            await $(locator).click();
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            if (values.length == 1) await $(this.selectors.bodyTextArea).sendKeys(values[0]);
            else {
                for (let i = 0; i < values.length; i++) {
                    await $(this.selectors.bodyTextArea).sendKeys(values[i]);
                    await $(this.selectors.bodyTextArea).sendKeys(Key.ENTER);
                }
            }
            await browser.switchTo().defaultContent();
            await browser.waitForAngularEnabled(true);
        }
        else {
            try {
                await $$(bodyArea).last().sendKeys(Key.CONTROL, Key.END);
                await $$(bodyArea).last().sendKeys(Key.ENTER);
                await $(locator).click();
                if (values.length == 1) await $$(bodyArea).last().sendKeys(values[0]);
                else {
                    for (let i = 0; i < values.length; i++) {
                        await $$(bodyArea).last().sendKeys(values[i]);
                        await $$(bodyArea).last().sendKeys(Key.ENTER);
                    }
                }
            }
            catch (ex) {
                await $$(bodyArea).first().sendKeys(Key.CONTROL, Key.END);
                await $$(bodyArea).first().sendKeys(Key.ENTER);
                await $(locator).click();
                if (values.length == 1) await $$(bodyArea).first().sendKeys(values[0]);
                else {
                    for (let i = 0; i < values.length; i++) {
                        await $$(bodyArea).first().sendKeys(values[i]);
                        await $$(bodyArea).first().sendKeys(Key.ENTER);
                    }
                }
            }

        }
    }

    // input should be a list
    async setBulletList(values: string[], guidId?: string): Promise<void> {
        let bodyArea = this.selectors.bodyTextArea;
        let bulletIconLctr = this.selectors.bulletIcon;
        if (guidId) {
            bulletIconLctr = `[rx-view-component-id="${guidId}"] ${bulletIconLctr}`;
            bodyArea = `[rx-view-component-id="${guidId}"] ${bodyArea}`;
        }
        await $(bodyArea).sendKeys(Key.CONTROL, Key.END);
        await $(bodyArea).sendKeys(Key.ENTER);
        await $(bulletIconLctr).click();
        if (values.length == 1) await $(bodyArea).sendKeys(values[0]);
        else {
            for (let i = 0; i < values.length; i++) {
                await $(bodyArea).sendKeys(values[i]);
                await $(bodyArea).sendKeys(Key.ENTER);
            }
        }
    }
}
export default new CKEditor();