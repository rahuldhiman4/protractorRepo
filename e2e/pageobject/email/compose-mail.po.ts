import { resolve } from 'path';
import { $, $$, browser, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../utils/utility.common';
import ckeditorOpsPo from '../common/ck-editor/ckeditor-ops.po';

class ComposeMail {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        title: '.modal-title',
        commonGuid: '71d315a1-3466-4e25-85be-2ce9a69efcb4',
        commonId: '[rx-view-component-id="71d315a1-3466-4e25-85be-2ce9a69efcb4"]',
        selectEmailTemplateLink: '.select-template-button',
        attachLink: '[rx-view-component-id="070e22ca-4312-4b2e-b5ac-9544c0e7b165"] button.d-icon-left-paperclip',
        sendButton: '[rx-view-component-id="58d8a41f-6c8f-4f23-b986-6a94d35b0fbe"] button',
        discardButton: '[rx-view-component-id="038eaa3f-f2ff-4c6d-a5d1-351449671b76"] button',
        composeEmailUI: '[rx-view-definition-guid="a69ea993-2e45-4ae7-9435-25ba53cbad88"]',
        popupEmail: '.dropdown-menu .popup-email',
        popupInfo: '.dropdown-menu .popup-info',
        emailBody: '.cke_editable_themed',
        firstClickInEmail: '.cke_editable_themed br',
        getsubject: '.subject-name span',
        toOrCcEmailgetText: 'div.adapt-mt-field-wrapper .flexi-type-ahead-person-tag',
        subjectInput: '.subject-name input',
        templateNameHeader: '.select-email-container .template-seperator',
        recipientRemoveIcon: '.adapt-mt-wrapper .adapt-mt-item-close',
        messageBodyFontPannelBar: '[rx-view-component-id="71d315a1-3466-4e25-85be-2ce9a69efcb4"] .cke_inner .cke_reset_all',
        colorIcon: '[rx-view-component-id="71d315a1-3466-4e25-85be-2ce9a69efcb4"] .cke_button__textcolor',
        attachmentField: '[rx-view-component-id="71d315a1-3466-4e25-85be-2ce9a69efcb4"] .attachment-button input[type="file"]',
        numberIcon: '[rx-view-component-id="71d315a1-3466-4e25-85be-2ce9a69efcb4"] .cke_button__numberedlist_icon',
        attachmentView: 'span.bwf-attachment-container__file-name',
        warningMessage: '.modal-content .modal-body, .modal-content .d-modal__content-item',
        toCcInput: '.adapt-mt-input-container input',
    }

    async clickOnTableIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnTableIcon(this.selectors.commonGuid);
        await browser.sleep(2000); // Wait For Table Pop Up Gets Open.
    }

    async clickOnImageIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnImageIcon(this.selectors.commonGuid);
        await browser.sleep(2000); // Wait For Image Icon Popup Gets Open.
    }

    async clickOnLinkIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnLinkIcon(this.selectors.commonGuid);
        await browser.sleep(2000); // Wait For Link Pop up Gets Open.
    }

    async clickOnBoldIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnBoldIcon(this.selectors.commonGuid);
    }

    async clickOnItalicIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnItalicIcon(this.selectors.commonGuid);
    }

    async clickOnUnderLineIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnUnderLineIcon(this.selectors.commonGuid);
    }

    async clickOnLeftAlignIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnLeftAlignIcon(this.selectors.commonGuid);
    }

    async clickOnRightAlignIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnRightAlignIcon(this.selectors.commonGuid);
    }

    async clickOnCenterAlignIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnCenterAlignIcon(this.selectors.commonGuid);
    }

    async clickOnFontTypeIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnFontTypeIcon(this.selectors.commonGuid);
    }

    async clickOnFontSizeIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnFontSizeIcon(this.selectors.commonGuid);
    }

    async selectColor(colorValue: string): Promise<void> {
        await ckeditorOpsPo.selectColor(colorValue, this.selectors.commonGuid);
    }

    async setNumberList(values: string[]): Promise<void> {
        await ckeditorOpsPo.setNumberList(values, this.selectors.commonGuid);
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

    async setEmailBody(value: string): Promise<void> {
        await $$('.cke_enable_context_menu, .cke_editable_themed').last().sendKeys(Key.CONTROL, Key.END);
        await $$('.cke_enable_context_menu, .cke_editable_themed').last().sendKeys(Key.ENTER);
        await ckeditorOpsPo.updateCKEditor(value, "71d315a1-3466-4e25-85be-2ce9a69efcb4");
    }

    async isTextPresentInEmailBody(textvalue: string): Promise<boolean> {
        await browser.waitForAngularEnabled(false);
        let value = await $('[rx-view-component-id="71d315a1-3466-4e25-85be-2ce9a69efcb4"] .cke_wysiwyg_div').getText();
        return value.includes(textvalue) ? true : false;
    }

    async getEmailBody(): Promise<string> {
        return utilityCommon.getCKEditorText(this.selectors.commonGuid);
    }

    async clickOnSendButton(): Promise<void> {
        await $(this.selectors.sendButton).click();
    }

    async isEmailIconLinkPresent(): Promise<boolean> {
        return await element(by.css('[rx-view-component-id="b721ed87-8e6b-4279-9e21-d4348c6a4599"] button')).isPresent().then(async (present) => {
            if (present) return await $('[rx-view-component-id="b721ed87-8e6b-4279-9e21-d4348c6a4599"] button').isDisplayed();
            else return false;
        });
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
        await browser.sleep(1000); //required to poulate to and cc
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

    async setSubject(value: string): Promise<void> {
        await $(this.selectors.subjectInput).clear();
        await $(this.selectors.subjectInput).sendKeys(value);
    }
}

export default new ComposeMail();
