import {element, by, $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class ComposeMail {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        title: '.modal-title',
        crossIcon:'.dialog-header-confirm .close',
        commonId:'[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"]',
        to: '.d-textfield__input[aria-label="To"]',
        cc:'.d-textfield__input[aria-label="Cc"]',
        subject:'.subject-name .d-textfield__item',
        selectEmailTemplateLink:'.select-template-button',
        messageBodyFontPannelBar:'.cke_inner .cke_reset_all',
        attachLink:'.ac-attachment-button',
        sendButton: '[rx-view-component-id="58d8a41f-6c8f-4f23-b986-6a94d35b0fbe"] button',
        discardButton: '[rx-view-component-id="038eaa3f-f2ff-4c6d-a5d1-351449671b76"] button',
        getTextOfWarningMsg: '.d-modal__dialog .d-modal__content-item',
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
        return await element(by.cssContainingText((this.selectors.title), title)).isDisplayed();
    }

    async CloseComposeEmail(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.crossIcon)));
        await ($(this.selectors.crossIcon)).click();
        await utilCommon.waitUntilSpinnerToHide();
    }

    async isToPresent(): Promise<boolean> {
        let commonIdstr = $(this.selectors.commonId);
        await browser.wait(this.EC.elementToBeClickable(commonIdstr.$(this.selectors.to)));
        return await (commonIdstr.$(this.selectors.to)).isEnabled();
    }

    async isCcPresent(): Promise<boolean> {
        let commonIdstr = $(this.selectors.commonId);
        await browser.wait(this.EC.elementToBeClickable(commonIdstr.$(this.selectors.cc)));
        return await (commonIdstr.$(this.selectors.cc)).isEnabled();
    }

    async isSubjectPresent(): Promise<boolean> {
        let commonIdstr = $(this.selectors.commonId);
        await browser.wait(this.EC.elementToBeClickable(commonIdstr.$(this.selectors.subject)));
        return await (commonIdstr.$(this.selectors.subject)).isEnabled();
    }

    async getTextOfSubject(): Promise<string> {
        let commonIdstr = $(this.selectors.commonId);
        await browser.wait(this.EC.elementToBeClickable(commonIdstr.$(this.selectors.subject)));
        return await (commonIdstr.$(this.selectors.subject)).getText();
    }

    async isSelectEmailTemplateLinkPresent(): Promise<boolean> {
        let commonIdstr = $(this.selectors.commonId);
        await browser.wait(this.EC.elementToBeClickable(commonIdstr.$(this.selectors.selectEmailTemplateLink)));
        return await (commonIdstr.$(this.selectors.selectEmailTemplateLink)).isEnabled();
    }

    async isMessageBodyFontPannelBarPresent(): Promise<boolean> {
        let commonIdstr = $(this.selectors.commonId);
        await browser.wait(this.EC.elementToBeClickable(commonIdstr.$(this.selectors.messageBodyFontPannelBar)));
        return await (commonIdstr.$(this.selectors.messageBodyFontPannelBar)).isDisplayed();
    }

    async isAttachLinkPresent(): Promise<boolean> {
        let commonIdstr = $(this.selectors.commonId);
        await browser.wait(this.EC.elementToBeClickable(commonIdstr.$(this.selectors.attachLink)));
        return await (commonIdstr.$(this.selectors.attachLink)).isEnabled();
    }

    async isSendButtonPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.sendButton)));
        return await $(this.selectors.sendButton).isEnabled();
    }
    
    async isDiscardButtonPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.discardButton)));
        return await $(this.selectors.discardButton).isEnabled();        
    }

}

export default new ComposeMail();