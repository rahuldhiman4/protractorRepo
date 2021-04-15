import { $, protractor, ProtractorExpectedConditions, Key, browser } from "protractor";

class EditMessageTextBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        messageBody: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_wysiwyg_div',
        tableIcon: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_toolbar .cke_button__table_icon',
        imageIcon: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_toolbar .cke_button__image_icon',
        linkIcon: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_toolbar .cke_button__link_icon',
        boldIcon: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_button__bold_icon',
        italicIcon: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_button__italic_icon',
        underLineIcon: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_button__underline_icon',
        leftAlignIcon: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_button__justifyleft_icon',
        centerAlignIcon: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_button__justifycenter_icon',
        rightAlignIcon: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_button__justifyright_icon',
        colorIcon: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_button__textcolor',
        fontType: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_combo__font',
        fontSize: '[rx-view-component-id="f86522e1-87a9-4c7b-9e1e-a940deec8b24"] .cke_combo__fontsize',
        saveButton:'[rx-view-component-id="498a2cf3-8866-4303-996a-61dc33e4a400"] button',
    }

    async clickOnTableIcon(): Promise<void> {
        await $(this.selectors.tableIcon).click();
        await browser.sleep(2000); // To Wait For Table Pop-up Gets Open.
    }

    async clickOnImageIcon(): Promise<void> {
        await $(this.selectors.imageIcon).click();
        await browser.sleep(2000); // To Wait For Image Pop-up Gets Open.
    }

    async clickOnLinkIcon(): Promise<void> {
        await $(this.selectors.linkIcon).click();
        await browser.sleep(2000); // To Wait For Link Pop-Up Gets Open.
    }

    async clickOnBoldIcon(): Promise<void> {
        await $(this.selectors.boldIcon).click();
    }

    async clickOnItalicIcon(): Promise<void> {
        await $(this.selectors.italicIcon).click();
    }

    async clickOnUnderLineIcon(): Promise<void> {
        await $(this.selectors.underLineIcon).click();
    }

    async clickOnLeftAlignIcon(): Promise<void> {
        await $(this.selectors.leftAlignIcon).click();
    }

    async clickOnRightAlignIcon(): Promise<void> {
        await $(this.selectors.rightAlignIcon).click();
    }

    async clickOnCenterAlignIcon(): Promise<void> {
        await $(this.selectors.centerAlignIcon).click();
    }

    async selectColor(colorValue: string): Promise<void> {
        await $(this.selectors.colorIcon).click();
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('iframe.cke_panel_frame').getWebElement());
        let locator: string = `a[title="${colorValue}"]`;
        await browser.wait(this.EC.elementToBeClickable($(locator)), 2000);
        await $(locator).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async clickOnFontTypeIcon(): Promise<void> {
        await $(this.selectors.fontType).click();
    }

    async clickOnFontSizeIcon(): Promise<void> {
        await $(this.selectors.fontSize).click();
    }

    async selectFontTypeOrSize(value: string): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('.cke_panel.cke_combopanel iframe.cke_panel_frame').getWebElement());
        let locator = `a[title="${value}"]`;
        await browser.wait(this.EC.elementToBeClickable($(locator)), 3000);
        await $(locator).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async setMessageBody(value:string): Promise<void> {
        await browser.sleep(2000);
        await $(this.selectors.messageBody).sendKeys(Key.chord(Key.CONTROL, Key.END));
        await $(this.selectors.messageBody).sendKeys(Key.ENTER);
        await $(this.selectors.messageBody).sendKeys(value);
       
    }

    async clickOnSaveButton():Promise<void>{
        await $(this.selectors.saveButton).click();
    }

    async getMessageBody(): Promise<string> {
        return await $(this.selectors.messageBody).getText();
    }

}
export default new EditMessageTextBlade();