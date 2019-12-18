import {element, by, $, browser, protractor, ProtractorExpectedConditions, $$ } from "protractor";
import utilCommon from '../../utils/util.common';
import { resolve } from 'path';

class ComposeMail {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        title: '.modal-title',
        crossIcon:'.dialog-header-confirm .close',
        commonId:'[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"]',
        to: '.d-textfield__input[aria-label="To"]',
        cc:'.d-textfield__input[aria-label="Cc"]',
        subject:'.subject-name span',
        selectEmailTemplateLink:'.select-template-button',
        messageBodyFontPannelBar:'.cke_inner .cke_reset_all',
        attachLink:'.attachment-button button',
        sendButton: '[rx-view-component-id="58d8a41f-6c8f-4f23-b986-6a94d35b0fbe"] button',
        discardButton: '[rx-view-component-id="038eaa3f-f2ff-4c6d-a5d1-351449671b76"] button',
        getTextOfWarningMsg: '.d-modal__dialog .d-modal__content-item',
        emailIcon: '.d-icon-left-envelope',
        composeEmailUI: '[rx-view-definition-guid="a69ea993-2e45-4ae7-9435-25ba53cbad88"]',
        selectEmailTemplate: '.select-template-button',
        popupEmail: '.popup-email',
        popupTemplate: '.popup-template',
        attachButton: '[rx-view-definition-guid="a69ea993-2e45-4ae7-9435-25ba53cbad88"] .ac-attachment-button',
        emailBody: '.cke_editable_themed',
        fristClickInEmail: '.cke_editable_themed br',
        email: 'iframe[class="cke_wysiwyg_frame cke_reset"]',
        attachementName: '.rx-attachment-view-name',
        getsubject: '.subject-name span',
        attachmentField: '.attachment-button input',
        selectTemplateButton: '.select-template-button',
        toEmailgetText: 'rx-person-group-drop-down-list-multi-select[ng-model="toList"]  .personContainer .padTop3',
        ccEmailgetText: 'rx-person-group-drop-down-list-multi-select[ng-model="ccList"]  .personContainer .padTop3',

    }

    async clickOnSelectEmailTemplateLink(): Promise<void> {
            await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectTemplateButton)));
            await $(this.selectors.selectTemplateButton).click();
    }
    
    async getTextOfDiscardButtonWarningMessage(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.getTextOfWarningMsg)));
        return await $(this.selectors.getTextOfWarningMsg).getText();        
    }

    async clickOnDiscardButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.discardButton)));
        await $(this.selectors.discardButton).click();        
    }

    async isComposeEmailTitlePreset(title:string): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.title)));
        return await element(by.cssContainingText((this.selectors.title), title)).isPresent();
    }

    async CloseComposeEmail(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.crossIcon)));
        await ($(this.selectors.crossIcon)).click();
        await utilCommon.waitUntilSpinnerToHide();
    }

    async isSubjectPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.subject)));
        return await $(this.selectors.subject).isPresent();
    }

    async getSubject(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.subject)));
        return await $(this.selectors.subject).getText();
    }

    async isSelectEmailTemplateLinkPresent(): Promise<boolean> {
         await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectEmailTemplateLink)));
        return await $(this.selectors.selectEmailTemplateLink).isPresent();        
    }    

    async isMessageBodyFontPannelBarPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.messageBodyFontPannelBar)));
        return await $(this.selectors.messageBodyFontPannelBar).isPresent();
    }

    async isAttachLinkPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachLink)));
        return await $(this.selectors.attachLink).isPresent();
    }

    async isSendButtonPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.sendButton)));
        return await $(this.selectors.sendButton).isPresent();
    }
    
    async isDiscardButtonPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.discardButton)));
        return await $(this.selectors.discardButton).isPresent();        
    }

    async addAttachment(): Promise<void> {
        const fileToUpload = '../../data/ui/attachment/demo.txt';
        const absolutePath = resolve(__dirname, fileToUpload);
        await $(this.selectors.attachmentField).sendKeys(absolutePath);
    }

    async clickOnEmailIconLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailIcon)));
        await $(this.selectors.emailIcon).click();
    }

    async clickOnSelectTempalteButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectTemplateButton)));
        await $(this.selectors.selectTemplateButton).click();
    }

    async getToEmailPerson(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.toEmailgetText)));
        return await $(this.selectors.toEmailgetText).getText();
    }

    async getCcEmailPerson(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ccEmailgetText)));
        return await $(this.selectors.ccEmailgetText).getText();
    }

    async setEmailBody(value: string): Promise<void> {
        await browser.sleep(4000);
        var elem = $('iframe.cke_wysiwyg_frame');
        browser.switchTo().frame(elem.getWebElement());
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailBody)));
        await $(this.selectors.emailBody).click();
        var elm = $(this.selectors.emailBody);
        await browser.actions().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, protractor.Key.HOME)).sendKeys(value).perform();
        browser.switchTo().defaultContent();
    }

    async getEmailBody(): Promise<string> {
        let value;
        var elem = $('iframe.cke_wysiwyg_frame');
        browser.switchTo().frame(elem.getWebElement());
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailBody)));
        value = await $(this.selectors.emailBody).getText();
        browser.switchTo().defaultContent();
        return value;
    }

    async clickOnSendButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.sendButton)));
        await $(this.selectors.sendButton).click();
    }


    async isEmailIconLinkPresent(): Promise<boolean> {
        await browser.wait(this.EC.presenceOf($('[rx-view-component-id="b721ed87-8e6b-4279-9e21-d4348c6a4599"]')));
        let presentInDom: boolean = await element(by.css('[rx-view-component-id="b721ed87-8e6b-4279-9e21-d4348c6a4599"] button')).isPresent();
        if (presentInDom) {
            await browser.wait(this.EC.visibilityOf($('[rx-view-component-id="b721ed87-8e6b-4279-9e21-d4348c6a4599"] button')), 5000);
        }
        return presentInDom;
    }

    async isSelectEmailTemplateButtonPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectTemplateButton)));
        return await $(this.selectors.selectTemplateButton).isDisplayed();
    }

    async isComposeEmailUIDisplay(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.composeEmailUI)));
        return await $(this.selectors.composeEmailUI).isDisplayed();
    }

    async isToOrCCInputTetxboxPresent(value: String): Promise<boolean> {
        let element = await $(`input[aria-label="${value}"]`);
        await browser.wait(this.EC.elementToBeClickable(element));
        return await element.isDisplayed();
    }

    async setToOrCCInputTetxboxPresent(value: String, EmailIdForToOrCc: string): Promise<void> {
        let element = await $(`input[aria-label="${value}"]`);
        await browser.wait(this.EC.elementToBeClickable(element));
        await element.click();
        await element.clear();
        await element.sendKeys(EmailIdForToOrCc);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.popupEmail)));
        $(this.selectors.popupEmail).click();

    }

    async selectEmailfromPopUp(EmailIdForToOrCc: string): Promise<void> {
        let element = await browser.wait(this.EC.elementToBeClickable($(this.selectors.popupEmail)));
        let popupemail = await $(this.selectors.popupEmail);
        let isclicked = await popupemail.getAttribute('aria-label');
        if (isclicked.contains(EmailIdForToOrCc)) {
            await popupemail.click();
        }
    }
}

export default new ComposeMail();