import { $, $$, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class CKEValidation {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        boldText: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] strong,.rx-description-textarea-read strong,.bwf-description-read-state strong,.bwf-description-read-state strong',
        italicText: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] em,.rx-description-textarea-read em,.bwf-description-read-state em,.bwf-description-read-state em',
        underLineText: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] u,.rx-description-textarea-read u,.bwf-description-read-state u,.bwf-description-read-state u',
        linkText: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] div a,.rx-description-textarea-read div a,.bwf-description-read-state div a,.bwf-description-read-state a',
        descriptionView: '.rx-description-textarea-read,.bwf-description-read-state',
    }

    async isBoldTextDisplayed(value: string, guid?: string): Promise<boolean> {
        let bold = this.selectors.boldText;
        if (guid) bold = `[rx-view-component-id="${guid}"] strong`;
        let text = await $(bold).getText();
        return text.includes(value);
    }

    async getTableCellAlignText(alignValue: string, guid?: string): Promise<string> {
        let locator = `table td[style="${alignValue}"]`;
        if (guid) locator = `[rx-view-component-id="${guid}"] table td[style="${alignValue}"]`;
        return await $(locator).getText();
    }

    async isFormatedTextDisplayed(value: string, tagName: string, guid?: string): Promise<boolean> {
        let descriptionView = `${this.selectors.descriptionView} ${tagName}`;
        if (guid) descriptionView = `[rx-view-component-id="${guid}"] ${this.selectors.descriptionView} ${tagName}`;
        let text = await $(descriptionView).getText();
        return text.includes(value);
    }

    async clickLinkInCKE(linkValue: string, guid?: string): Promise<void> {
        let descriptionViewLink = `a[href="http://${linkValue}"]`;
        if (guid) {
            descriptionViewLink = `[rx-view-component-id="${guid}"] ${this.selectors.descriptionView} a[href="http://${linkValue}"]`;
        }
        await $$(descriptionViewLink).last().click();
    }

    async getColorFontStyleOfText(value: string, guid?: string): Promise<string> {
        let alignColorFontStyle = `${this.selectors.descriptionView} div[style="${value}"]`;
        if (guid) alignColorFontStyle = `[rx-view-component-id="${guid}"] ${this.selectors.descriptionView} div[style="${value}"]`;
        let elementText: string;
        let styleElementCount = (await $$(alignColorFontStyle)).length;
        for (let i: number = 0; i < styleElementCount; i++) {
            elementText += await $$(alignColorFontStyle).get(i).getText();
        }
        return elementText;
    }

    async isItalicTextDisplayed(value: string, guid?: string): Promise<boolean> {
        let italic = this.selectors.italicText;
        if (guid) italic = `[rx-view-component-id="${guid}"] em`;
        let text = await $(italic).getText();
        return text.includes(value);
    }

    async isUnderLineTextDisplayed(value: string, guid?: string): Promise<boolean> {
        let underLine = this.selectors.underLineText;
        if (guid) underLine = `[rx-view-component-id="${guid}"] u`;
        let text = await $(underLine).getText();
        return text.includes(value);
    }

    async isImageDisplayed(value: string, guid?: string): Promise<boolean> {
        let imageView = `${this.selectors.descriptionView} img[src="${value}"]`;
        if (guid) imageView = `[rx-view-component-id="${guid}"] ${this.selectors.descriptionView} img[src="${value}"]`;
        return await $(imageView).isDisplayed();
    }

    async isColorTextDisplayed(value: string, guid?: string): Promise<boolean> {
        let isColorText = `${this.selectors.descriptionView} span[style="${value}"]`;
        if (guid) isColorText = `[rx-view-component-id="${guid}"] ${this.selectors.descriptionView} span[style="${value}"]`;
        return await $(isColorText).isDisplayed();
    }

    async isLinkDisplayedInCKE(value: string, guid?: string): Promise<boolean> {
        let link = this.selectors.linkText;
        if (guid) link = `[rx-view-component-id="${guid}"] a`;
        return await $$(this.selectors.linkText).first().getText() == value;
    }

    async isTitleDisplayed(title: string): Promise<boolean> {
        await browser.sleep(1000);
        let text = await browser.getTitle();
        return text.includes(title);
    }
}

export default new CKEValidation();