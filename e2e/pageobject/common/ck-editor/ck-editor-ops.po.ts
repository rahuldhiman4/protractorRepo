import { resolve } from "path";
import { $, $$, browser, by, element, ElementFinder, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from 'e2e/utils/utility.common';
// import utilCommon from '../../utils/util.utilCommon';

class CkEditorOps {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        activityNoteCKEditor: '[rx-view-component-id="76b9d8a2-54ef-4b24-a086-fc6ff745449d"] bwf-rich-text-editor[style="display: block;"], bwf-rich-text-editor[style="display: block;"]',
        activityNoteTextArea: '.cke_enable_context_menu, .cke_enable_context_menu',
        linkIcon: '.cke_toolbar .cke_button__link_icon',
        boldIcon: '.cke_button__bold_icon',
        italicIcon: '.cke_button__italic_icon',
        underLineIcon: '.cke_button__underline_icon',
        leftAlignIcon: '.cke_button__justifyleft_icon',
        centerAlignIcon: '.cke_button__justifycenter_icon',
        rightAlignIcon: '.cke_button__justifyright_icon',
        colorIcon: '.cke_button__textcolor',
        numberIcon: '.cke_button__numberedlist_icon',
        bulletIcon: '.cke_button__bulletedlist_icon',
        maximizeMinimizeicon: '.cke_button__maximize_icon',
        maximizeMinimizeWindow: '.cke_button__maximize',
        fontType: '.cke_combo__font',
        fontSize: '.cke_combo__fontsize',
        frame: 'iframe.cke_wysiwyg_frame',
    }

    async clickOnLinkIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.linkIcon).click();
        else await $(this.selectors.linkIcon).click();
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

    async selectColor(colorValue: string, guidId: string): Promise<void> {
        if (guidId) {
            await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.colorIcon).click();
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame(await $('iframe.cke_panel_frame').getWebElement());
            let locator: string = `a[title="${colorValue}"]`;
            await browser.wait(this.EC.elementToBeClickable($(locator)), 2000);
            await $(locator).click();
            await browser.switchTo().defaultContent();
            await browser.waitForAngularEnabled(true);
        }
        else {
            await $(this.selectors.fontType).click();
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame(await $('iframe.cke_panel_frame').getWebElement());
            let locator: string = `a[title="${colorValue}"]`;
            await browser.wait(this.EC.elementToBeClickable($(locator)), 2000);
            await $(locator).click();
            await browser.switchTo().defaultContent();
            await browser.waitForAngularEnabled(true);
        }

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

    async selectFontTypeOrSize(value: string): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('.cke_panel.cke_combopanel iframe.cke_panel_frame').getWebElement());
        let locator = `a[title="${value}"]`;
        await browser.wait(this.EC.elementToBeClickable($(locator)), 4000);
        await $(locator).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async setCKEditor(description: string, guid?: string): Promise<void> {
        let framePresent = await $(this.selectors.frame).isPresent();
        switch (framePresent) {
            case true: {
                await browser.waitForAngularEnabled(false);
                await browser.sleep(6000);
                await browser.switchTo().frame(await element(by.css('iframe.cke_wysiwyg_frame')).getWebElement());
                await $(this.selectors.activityNoteTextArea).clear();
                await $(this.selectors.activityNoteTextArea).sendKeys(description);
                await browser.switchTo().defaultContent();
                await browser.waitForAngularEnabled(true);
                break;
            }
            case false: {
                await utilityCommon.setCKEditor(description, guid);
                break;
            }
            default: {
                console.log('Ck editor not set');
                break;
            }
        }
    }

    async updateCKEditor(description: string, guid?: string): Promise<void> {
        let framePresent = await $(this.selectors.frame).isPresent();
        switch (framePresent) {
            case true: {
                await browser.waitForAngularEnabled(false);
                await browser.sleep(6000);
                await browser.switchTo().frame(await element(by.css('iframe.cke_wysiwyg_frame')).getWebElement());
                await $(this.selectors.activityNoteTextArea).sendKeys(Key.chord(Key.CONTROL, Key.END));
                await $(this.selectors.activityNoteTextArea).sendKeys(Key.ENTER);
                await $(this.selectors.activityNoteTextArea).sendKeys(description);
                await browser.switchTo().defaultContent();
                await browser.waitForAngularEnabled(true);
                break;
            }
            case false: {
                await utilityCommon.updateCKEditor(description, guid);
                break;
            }
            default: {
                console.log('Ck editor not updated');
                break;
            }
        }
    }

    async isBoldTextDisplayedInCkEditorTextArea(boldTextElementFinder: ElementFinder, bodyText: string): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        switch (framePresent) {
            case true: {
                await browser.waitForAngularEnabled(false);
                await browser.switchTo().frame($(this.selectors.frame).getWebElement());
                return boldTextElementFinder.isPresent().then(async (result) => {
                    if (result) {
                        let boldTextCke = await boldTextElementFinder.getText();
                        if (boldTextCke.includes(bodyText)) {
                            await browser.switchTo().defaultContent();
                            await browser.waitForAngularEnabled(true);
                            return true;
                        }
                    }
                    else return false;
                });
            }

            case false: {
                return boldTextElementFinder.isPresent().then(async (result) => {
                    if (result) {
                        let boldTextCke = await boldTextElementFinder.getText();
                        if (boldTextCke.includes(bodyText)) {
                            return true;
                        }
                    }
                    else return false;
                });
            }
            default: {
                console.log('No Bold text element matches');
                break;
            }
        }
    }

    async caseActivityLogsValidation(dropDownElementFinder: ElementFinder, bodyText: string): Promise<boolean> {
        return dropDownElementFinder.isPresent().then(async (result) => {
            if (result) {
                let boldTextCke = await dropDownElementFinder.getText();
                if (boldTextCke.includes(bodyText)) {
                    return true;
                }
            }
            else return false;
        });
    }
}

export default new CkEditorOps();