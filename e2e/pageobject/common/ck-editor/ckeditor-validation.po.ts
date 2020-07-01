import { $, $$, browser, by, element, ElementFinder, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import imagePropertiesPo from '../../../pageobject/settings/common/image-properties.po';

class CKEValidation {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        boldText: '.rx-description-textarea-read strong , .bwf-description-read-state em',
        italicText: '.rx-description-textarea-read em , .bwf-description-read-state em',
        underLineText: '.rx-description-textarea-read u , .bwf-description-read-state u',
        linkText: '.rx-description-textarea-read div a , .bwf-description-read-state div a',
        descriptionView: '.rx-description-textarea-read, .bwf-description-read-state'
    }

    async isBoldTextDisplayed(value: string): Promise<boolean> {
        let text = await $(this.selectors.boldText).getText();
        return text.includes(value);
    }

    async isFormatedTextDisplayed(value: string, tagName: string, guid?: string): Promise<boolean> {
        let locator = await $(this.selectors.descriptionView).$(` ${tagName}`);
        if (guid) locator = `[rx-view-component-id="${guid}"] .bwf-description-read-state ${tagName}`;
        let text = await $(locator).getText();
        return text.includes(value);
    }

    async clickLinkInCKE(linkValue: string, guid?: string): Promise<void> {
        let locator = await $(this.selectors.descriptionView).$(`a[href="${linkValue}"`);
        if (guid) {
            locator = await $[`rx-view-component-id="${guid}"`].$(this.selectors.descriptionView).$(`a[href="${linkValue}"`);
        }
        await $(locator).click();
    }

    async getColorFontStyleOfText(value: string): Promise<string> {
        return await $(this.selectors.descriptionView).$(`div[style="${value}"]`).getText();
    }

    async isItalicTextDisplayed(value: string): Promise<boolean> {
        let text = await $(this.selectors.italicText).getText();
        return text.includes(value);
    }

    async isUnderLineTextDisplayed(value: string): Promise<boolean> {
        let text = await $(this.selectors.underLineText).getText();
        return text.includes(value);
    }

    async isImageDisplayed(value: string): Promise<boolean> {
        return await $(this.selectors.descriptionView).$(`img[src="${value}"]`).isDisplayed();
    }

    async isColorTextDisplayed(value: string): Promise<boolean> {
        return await $(this.selectors.descriptionView).$(`span[style="${value}"]`).isDisplayed();
    }

    async isLinkDisplayedInCKE(value: string): Promise<boolean> {
        return await $$(this.selectors.linkText).first().getText() == value;
    }

    async isTitleDisplayed(title: string): Promise<boolean> {
        let text = await browser.getTitle();
        return text.includes(title);
    }
}

export default new CKEValidation();