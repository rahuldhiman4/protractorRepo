import { resolve } from 'path';
import { $, $$, browser, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";

class ComposeMail {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        title: '.modal-title',
        commonId: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"]',
        selectEmailTemplateLink: '.select-template-button',
        attachLink: '.attachment-button button',
        sendButton: '[rx-view-component-id="58d8a41f-6c8f-4f23-b986-6a94d35b0fbe"] button',
        discardButton: '[rx-view-component-id="038eaa3f-f2ff-4c6d-a5d1-351449671b76"] button',
        composeEmailUI: '[rx-view-definition-guid="a69ea993-2e45-4ae7-9435-25ba53cbad88"]',
        popupEmail: '.dropdown-item .popup-email',
        popupInfo: '.dropdown-item .popup-info',
        emailBody: '.cke_editable_themed',
        firstClickInEmail: '.cke_editable_themed br',
        attachmentName: '.rx-attachment-view-name',
        getsubject: '.subject-name span',
        toOrCcEmailgetText: 'div.adapt-mt-field-wrapper .flexi-type-ahead-person-tag',
        subjectInput: '.subject-name input',
        templateNameHeader: '.select-email-container .template-seperator',
        recipientRemoveIcon: '.adapt-mt-wrapper .adapt-mt-item-close',
        messageBodyFontPannelBar: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_inner .cke_reset_all',
        tableIcon: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_toolbar .cke_button__table_icon',
        imageIcon: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_toolbar .cke_button__image_icon',
        linkIcon: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_toolbar .cke_button__link_icon',
        boldIcon: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_button__bold_icon',
        italicIcon: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_button__italic_icon',
        underLineIcon: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_button__underline_icon',
        leftAlignIcon: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_button__justifyleft_icon',
        centerAlignIcon: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_button__justifycenter_icon',
        rightAlignIcon: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_button__justifyright_icon',
        colorIcon: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_button__textcolor',
        fontType: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_combo__font',
        fontSize: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_combo__fontsize',
        attachmentField: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .attachment-button input[type="file"]',
        numberIcon: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] .cke_button__numberedlist_icon',
        attachmentView: 'span.bwf-attachment-container__file-name',
        warningMessage: '.modal-content .modal-body, .modal-content .d-modal__content-item',
        toCcInput: '.adapt-mt-input-container input',
    }

    async clickOnTableIcon(): Promise<void> {
        await $(this.selectors.tableIcon).click();
        await browser.sleep(2000); // Wait For Table Pop Up Gets Open.
    }

    async clickOnImageIcon(): Promise<void> {
        await $(this.selectors.imageIcon).click();
        await browser.sleep(2000); // Wait For Image Icon Popup Gets Open.
    }

    async clickOnLinkIcon(): Promise<void> {
        await $(this.selectors.linkIcon).click();
        await browser.sleep(2000); // Wait For Link Pop up Gets Open.
    }


    async clickInTableCell(row: number, column: number, summary: string): Promise<void> {
        let locator = `table[summary='${summary}'] tr`;
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(element(by.css('[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] iframe.cke_wysiwyg_frame')).getWebElement());
        await browser.sleep(1000); // sleep required for proper frame switch
        let rowLocator = await $$(locator).get(row - 1);
        await rowLocator.$$('td').get(column - 1).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async setDataInTable(row: number, column: number, value: string, summary: string): Promise<void> {
        await browser.waitForAngularEnabled(false);
        let locator = `table[summary='${summary}'] tr`;
        await browser.switchTo().frame(element(by.css('[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] iframe.cke_wysiwyg_frame')).getWebElement());
        let rowLocator = await $$(locator).get(row - 1);
        await rowLocator.$$('td').get(column - 1).sendKeys(value);
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
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
        await browser.wait(this.EC.elementToBeClickable($(locator)), 4000);
        await $(locator).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async isUserPopulatedInToOrCc(value: string, emailToOrCCValue): Promise<boolean> {
        if (value == 'To') {
            await $$(this.selectors.toCcInput).get(0).clear();
            await $$(this.selectors.toCcInput).get(0).sendKeys(emailToOrCCValue);
        } else {
            await $$(this.selectors.toCcInput).get(1).clear();
            await $$(this.selectors.toCcInput).get(1).sendKeys(emailToOrCCValue);
        }
        return await $(this.selectors.recipientRemoveIcon).isPresent();
    }

    async clickOnSelectEmailTemplateLink(): Promise<void> {
        await $(this.selectors.selectEmailTemplateLink).click();
    }

    async getTextOfDiscardButtonWarningMessage(): Promise<string> {
        return await $$(this.selectors.warningMessage).last().getText();
    }

    async clickOnDiscardButton(): Promise<void> {
        await $(this.selectors.discardButton).isPresent().then(async (present) => {
            if (present) {
                await browser.wait(this.EC.elementToBeClickable($(this.selectors.discardButton)), 2000);
                await $(this.selectors.discardButton).click();
            }
        });
    }

    async isComposeEmailTitlePresent(title: string): Promise<boolean> {
        return await element(by.cssContainingText((this.selectors.title), title)).isPresent();
    }

    async isSubjectPresent(): Promise<boolean> {
        return await $(this.selectors.getsubject).isPresent();
    }

    async getSubject(): Promise<string> {
        return (await $(this.selectors.getsubject).getText()).trim();
    }

    async isSelectEmailTemplateLinkPresent(): Promise<boolean> {
        return await $(this.selectors.selectEmailTemplateLink).isPresent();
    }

    async isMessageBodyFontPannelBarPresent(): Promise<boolean> {
        return await $(this.selectors.messageBodyFontPannelBar).isPresent();
    }

    async isAttachLinkPresent(): Promise<boolean> {
        return await $(this.selectors.attachLink).isPresent();
    }

    async isSendButtonPresent(): Promise<boolean> {
        return await $(this.selectors.sendButton).isDisplayed();
    }

    async isDiscardButtonPresent(): Promise<boolean> {
        return await $(this.selectors.discardButton).isPresent();
    }

    async getFileDisplayedFileName(): Promise<string> {
        return await $(this.selectors.attachmentView).getText();
    }

    async addAttachment(fileToUpload: string[]): Promise<void> {
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        await $(this.selectors.attachmentField).sendKeys(absPathArray.join('\n'));
    }

    async clickOnSelectTempalteButton(): Promise<void> {
        await $(this.selectors.selectEmailTemplateLink).click();
    }

    async getToEmailPerson(): Promise<string> {
        return await (await $$(this.selectors.toOrCcEmailgetText).first().getText()).trim();
    }

    async getCcEmailPerson(): Promise<string> {
        return await (await $$(this.selectors.toOrCcEmailgetText).last().getText()).trim();
    }

    async setBulletPointAndNumer(value: string): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] iframe.cke_wysiwyg_frame').getWebElement());
        await $(this.selectors.emailBody).sendKeys(Key.CONTROL, Key.END);
        await $(this.selectors.emailBody).sendKeys(Key.ENTER);
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        await $(this.selectors.numberIcon).click();
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] iframe.cke_wysiwyg_frame').getWebElement());
        await $(this.selectors.emailBody).sendKeys(value);
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async setEmailBody(value: string): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.sleep(6000); // Wait For Switch To Frame
        await browser.switchTo().frame(await element(by.css('[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] iframe.cke_wysiwyg_frame')).getWebElement());
        await $(this.selectors.emailBody).sendKeys(Key.chord(Key.CONTROL, Key.END));
        await $(this.selectors.emailBody).sendKeys(Key.ENTER);
        await $(this.selectors.emailBody).sendKeys(value);
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async isTextPresentInEmailBody(textvalue: string): Promise<boolean> {
        let value: string = undefined;
        await browser.waitForAngularEnabled(false);
        let elem = $('[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] iframe.cke_wysiwyg_frame');
        await browser.switchTo().frame(elem.getWebElement());
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailBody)), 2000);
        value = await $(this.selectors.emailBody).getText();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return value.includes(textvalue) ? true : false;
    }

    async getEmailBody(): Promise<string> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await element(by.css('[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] iframe.cke_wysiwyg_frame')).getWebElement());
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailBody)), 3000);
        let value = await $(this.selectors.emailBody).getText();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return value;
    }

    async clickOnSendButton(): Promise<void> {
        await $(this.selectors.sendButton).click();
    }


    async isEmailIconLinkPresent(): Promise<boolean> {
        let presentInDom: boolean = await element(by.css('[rx-view-component-id="b721ed87-8e6b-4279-9e21-d4348c6a4599"] button')).isPresent();
        return await $('[rx-view-component-id="b721ed87-8e6b-4279-9e21-d4348c6a4599"] button').isDisplayed();
    }

    async isSelectEmailTemplateButtonPresent(): Promise<boolean> {
        return await $(this.selectors.selectEmailTemplateLink).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.selectEmailTemplateLink).isDisplayed();
            else return false;
        });
    }


    async isComposeEmailUIDisplay(): Promise<boolean> {
        return await $(this.selectors.composeEmailUI).isDisplayed();
    }

    async isToOrCCInputTetxboxPresent(value: String): Promise<boolean> {
        let countNum: number = await $$(`.adapt-mt-input-container`).count();
        if (value == 'To' && countNum == 2) {
            return await $$(`.adapt-mt-input-container`).get(0).isDisplayed();
        } else if (countNum == 2) {
            return await $$(`.adapt-mt-input-container`).get(1).isDisplayed();
        }
    }

    async setToOrCCInputTextbox(value: String, emailIdForToOrCc: string): Promise<void> {
        if (value == 'To') {
            await $$(this.selectors.toCcInput).get(0).clear();
            await $$(this.selectors.toCcInput).get(0).sendKeys(emailIdForToOrCc);
        } else {
            await $$(this.selectors.toCcInput).get(1).clear();
            await $$(this.selectors.toCcInput).get(1).sendKeys(emailIdForToOrCc);
        }
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.popupEmail)), 4000);
        await $$(this.selectors.popupEmail).first().click();
        await browser.sleep(1000); //required to poulate the email id from text box
    }

    async getSubjectInputValue(): Promise<string> {
        let newInput = $(this.selectors.subjectInput);
        await $(this.selectors.subjectInput).click();
        let templateName = await newInput.getAttribute('value');
        return templateName;
    }

    async getEmailTemplateNameHeading(): Promise<string> {
        return await $(this.selectors.templateNameHeader).getText();
    }

    async selectEmailFromPopUp(emailIdForToOrCc: string): Promise<void> {
        let popupemail = await $(this.selectors.popupEmail);
        let isclicked = await popupemail.getAttribute('aria-label');
        if (isclicked.contains(emailIdForToOrCc)) {
            await popupemail.click();
        }
    }

    async clickOnAttachmentLink(): Promise<void> {
        await $(this.selectors.attachLink).click();
    }
    async searchPerson(value: string, EmailIdForToOrCc: string): Promise<number> {
        if (value == 'To') {
            await $$(this.selectors.toCcInput).get(0).clear();
            await $$(this.selectors.toCcInput).get(0).sendKeys(EmailIdForToOrCc);
            let values: number = await $$(this.selectors.popupInfo).count();
            await $$(this.selectors.toCcInput).get(0).clear();
            await $$(this.selectors.toCcInput).get(0).sendKeys('n' + Key.BACK_SPACE);
            await browser.wait(this.EC.invisibilityOf($$(this.selectors.popupInfo).get(0)), 4000);
            return values;
        } if (value == 'Cc') {
            await $$(this.selectors.toCcInput).get(1).clear();
            await $$(this.selectors.toCcInput).get(1).sendKeys(EmailIdForToOrCc);
            let values: number = await $$(this.selectors.popupInfo).count();
            await $$(this.selectors.toCcInput).get(1).clear();
            await $$(this.selectors.toCcInput).get(1).sendKeys('n' + Key.BACK_SPACE);
            await browser.wait(this.EC.invisibilityOf($$(this.selectors.popupInfo).get(0)), 4000);
            return values;
        }
    }
    async isImageDisplayedComposeEmail(value: string): Promise<boolean> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] iframe.cke_wysiwyg_frame').getWebElement());
        let locator = `img[src='${value}']`;
        let imageIsDisplayed: boolean = await $$(locator).last().isDisplayed();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return imageIsDisplayed;
    }

    async isLinkDisplayedComposeEmail(value: string): Promise<boolean> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] iframe.cke_wysiwyg_frame').getWebElement());
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailBody)), 3000);
        let locator = `[href='${value}']`;
        let islinkDisplayed: boolean = await $(locator).isDisplayed();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return islinkDisplayed;
    }

    async getColorOrFontOfTextComposeEmail(value: string): Promise<string> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] iframe.cke_wysiwyg_frame').getWebElement());
        let locator = `td span[style='${value}']`;
        let isColorDisplayed = await $(locator).getText();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
        return isColorDisplayed;
    }

    async setSubject(value: string): Promise<void> {
        await $(this.selectors.subjectInput).clear();
        await $(this.selectors.subjectInput).sendKeys(value);
    }
}

export default new ComposeMail();
