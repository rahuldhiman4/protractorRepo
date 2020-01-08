import { resolve } from 'path';
import { $, browser, by, element, protractor, ProtractorExpectedConditions, $$ } from "protractor";
import utilCommon from '../../utils/util.common';

class ComposeMail {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        title: '.modal-title',
        crossIcon: '.dialog-header-confirm .close',
        commonId: '[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"]',
        selectEmailTemplateLink: '.select-template-button',
        messageBodyFontPannelBar: '.cke_inner .cke_reset_all',
        attachLink: '.attachment-button button',
        sendButton: '[rx-view-component-id="58d8a41f-6c8f-4f23-b986-6a94d35b0fbe"] button',
        discardButton: '[rx-view-component-id="038eaa3f-f2ff-4c6d-a5d1-351449671b76"] button',
        getTextOfWarningMsg: '.d-modal__content-item',
        emailIcon: '.d-icon-left-envelope',
        composeEmailUI: '[rx-view-definition-guid="a69ea993-2e45-4ae7-9435-25ba53cbad88"]',
        selectEmailTemplate: '.select-template-button',
        popupEmail: '.popup-email',
        popupInfo: '.popup-info',
        attachButton: '[rx-view-definition-guid="a69ea993-2e45-4ae7-9435-25ba53cbad88"] .ac-attachment-button',
        emailBody: '.cke_editable_themed',
        firstClickInEmail: '.cke_editable_themed br',
        email: 'iframe[class="cke_wysiwyg_frame cke_reset"]',
        attachmentName: '.rx-attachment-view-name',
        getsubject: '.subject-name span',
        attachmentField: '.attachment-button input',
        selectTemplateButton: '.select-template-button',
        toEmailgetText: 'rx-person-group-drop-down-list-multi-select[ng-model="toList"]  .personContainer .padTop3',
        ccEmailgetText: 'rx-person-group-drop-down-list-multi-select[ng-model="ccList"]  .personContainer .padTop3',
        subjectInput:'.subject-name input',
        templateNameHeader:'.template-seperator'
    }

    async clickOnSelectEmailTemplateLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectTemplateButton)),2000);
        await $(this.selectors.selectTemplateButton).click();
    }

    async getTextOfDiscardButtonWarningMessage(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.getTextOfWarningMsg)));
        return await utilCommon.getWarningMessagegText();
    }

    async clickOnDiscardButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.discardButton)));
        await $(this.selectors.discardButton).click();
    }

    async isComposeEmailTitlePresent(title: string): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.title)));
        return await element(by.cssContainingText((this.selectors.title), title)).isPresent();
    }

    async closeComposeEmail(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.crossIcon)));
        await ($(this.selectors.crossIcon)).click();
        await utilCommon.waitUntilSpinnerToHide();
    }

    async isSubjectPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.getsubject)));
        return await $(this.selectors.getsubject).isPresent();
    }

    async getSubject(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.getsubject)),2000);
        return await $(this.selectors.getsubject).getText();
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
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailIcon)),3000);
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
        var elem = $('iframe.cke_wysiwyg_frame');
        await browser.switchTo().frame(elem);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailBody)));
        await $(this.selectors.emailBody).click();
        var elm = $(this.selectors.emailBody);
        await browser.actions().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, protractor.Key.HOME)).sendKeys(value).perform();
        await browser.switchTo().defaultContent();;
    }

    async isTextPresentInEmailBody(textvalue:string):Promise<boolean>{
            let value;
            var elem = $('iframe.cke_wysiwyg_frame');
            await browser.switchTo().frame(elem.getWebElement());
            await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailBody)),2000);
            value = await $(this.selectors.emailBody).getText();
            await browser.switchTo().defaultContent();
            return value.includes(textvalue)?true:false;
    
    }

    async getEmailBody(): Promise<string> {
        await browser.switchTo().frame(element(by.css("iframe.cke_wysiwyg_frame")).getWebElement());
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailBody)), 3000);
        let value = await $(this.selectors.emailBody).getText();;
        await browser.switchTo().defaultContent();
        return value;
    }

    async clickOnSendButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.sendButton)),3000);
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

    async setToOrCCInputTetxbox(value: String, emailIdForToOrCc: string): Promise<void> {
        let element = await $(`input[aria-label="${value}"]`);
        await browser.wait(this.EC.elementToBeClickable(element));
        await element.click();
        await element.clear();
        await element.sendKeys(emailIdForToOrCc);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.popupEmail)));
        await $(this.selectors.popupEmail).click();

    }

    async getSubjectInputValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.subjectInput)));
        var newInput = $(this.selectors.subjectInput);
        await $(this.selectors.subjectInput).click();
        let templateName = await newInput.getAttribute('value');
        return templateName;
    }

    async getEmailTemplateNameHeading():Promise<string>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateNameHeader)));
        return $(this.selectors.templateNameHeader).getText();
    }

    async selectEmailFromPopUp(emailIdForToOrCc: string): Promise<void> {
        let element = await browser.wait(this.EC.elementToBeClickable($(this.selectors.popupEmail)));
        let popupemail = await $(this.selectors.popupEmail);
        let isclicked = await popupemail.getAttribute('aria-label');
        if (isclicked.contains(emailIdForToOrCc)) {
            await popupemail.click();
        }
    }

    async clickOnAttachmentLink():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachButton)));
        await $(this.selectors.attachButton).click();
    }
    async searchPerson(value: string, EmailIdForToOrCc: string): Promise<number> {
        let countOfPersons=0;
        let element = await $(`input[aria-label="${value}"]`);
        await browser.wait(this.EC.elementToBeClickable(element));
        await element.click();
        await element.clear();
        await element.sendKeys(EmailIdForToOrCc);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.popupEmail)));
        await this.setToOrCCInputTetxbox(value, EmailIdForToOrCc);
        await browser.wait(this.EC.visibilityOf($(this.selectors.popupInfo)));
        let values:number= await $$(this.selectors.popupInfo).count();
        for (let i = 0; i < values; i++) {
            let person = await $$(this.selectors.popupInfo).get(i);
            let nm: string = await person.getText();
            if (nm.includes(value)) {
                countOfPersons++;
            }
        }
        element.clear();
        await browser.wait(this.EC.invisibilityOf($(this.selectors.popupInfo)));
        return countOfPersons;
    }
}

export default new ComposeMail();
