import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class CKEValidation {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        boldText: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] strong,.rx-description-textarea-read strong,.bwf-description-read-state strong,.bwf-description-read-state strong',
        italicText: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] em,.rx-description-textarea-read em,.bwf-description-read-state em,.bwf-description-read-state em',
        underLineText: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] u,.rx-description-textarea-read u,.bwf-description-read-state u,.bwf-description-read-state u',
        linkText: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] div a,.rx-description-textarea-read div a,.bwf-description-read-state div a,.bwf-description-read-state a',
        descriptionView: '.rx-description-textarea-read,.bwf-description-read-state',
        maximizeMinimizeWindow: '.cke_button__maximize',
        activityNoteCKEditor: '[rx-view-component-id="76b9d8a2-54ef-4b24-a086-fc6ff745449d"] bwf-rich-text-editor[style="display: block;"]',
        numberIcon: '.cke_button__numberedlist_icon',
        bulletIcon: '.cke_button__bulletedlist_icon',
        boldTextCkEditorTextArea: '.cke_enable_context_menu strong,.activity__body strong',
        italicTextCkEditorTextArea: '.cke_enable_context_menu em,.activity__body em',
        underlineTextCkEditorTextArea: '.cke_enable_context_menu u,.activity__body u',
        colorTextCkEditorTextArea: '.cke_enable_context_menu span',
        alignmentTextCkEditorTextArea: 'div.cke_enable_context_menu , div.cke_enable_context_menu div',
        strikeThroughTextCkEditorTextArea: '.cke_enable_context_menu s,.cke_wysiwyg_div .bwf-text-strikethrough',
        justifyAlignText: '.cke_enable_context_menu [style="text-align: justify;"]',
        deletedTextInCKE: '.cke_editable_themed del',
        rightAlignText: '.cke_enable_context_menu div[style="text-align: right;"],.cke_enable_context_menu p[style="text-align: right;"]',
        centerAlignText: '.cke_enable_context_menu [style="text-align: center;"]',
        numberListCkEditorTextArea: '.cke_enable_context_menu ol li',
        bulletListTextCkEditorTextArea: '.cke_enable_context_menu ul li',
        linkTextCkEditorTextArea: '.cke_enable_context_menu a',
        frame: 'iframe.cke_wysiwyg_frame,[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] iframe.cke_wysiwyg_frame',
        bodyTextArea: '.cke_enable_context_menu, .cke_editable_themed',
        activityNoteTextArea: '.cke_enable_context_menu',
        addNotePublicCheckBoxToolTip: '.d-icon-question_circle_o',
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
        let elementCount = await $$(locator).count();
        let elementText = "";
        for (let i: number = 0; i < elementCount; i++) {
            elementText += await $$(locator).get(i).getText();
        }
        return elementText;
    }

    async isFormatedTextDisplayed(value: string, tagName: string, guid?: string): Promise<boolean> {
        let descriptionView = `${this.selectors.descriptionView} ${tagName}`;
        if (guid) descriptionView = `[rx-view-component-id="${guid}"] ${this.selectors.descriptionView} ${tagName}`;

        let elementCount = await $$(descriptionView).count();
        let elementText = "";
        for (let i: number = 0; i < elementCount; i++) {
            elementText += await $$(descriptionView).get(i).getText();
        }
        return elementText.includes(value);
    }

    async clickLinkInCKE(linkValue: string, guid?: string): Promise<void> {
        let descriptionViewLink = `a[href="http://${linkValue}"]`;
        if (guid) {
            descriptionViewLink = `[rx-view-component-id="${guid}"] ${this.selectors.descriptionView} a[href="http://${linkValue}"]`;
        }
        await $$(descriptionViewLink).last().click();
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
        let elementCount = await $$(imageView).count();
        for (let i: number = 0; i < elementCount; i++) {
            if (await $$(imageView).get(i).isDisplayed()) return true;
        }
        return false;
    }

    async isColorTextDisplayed(value: string, guid?: string): Promise<boolean> {
        let isColorText = `${this.selectors.descriptionView} span[style="${value}"]`;
        if (guid) isColorText = `[rx-view-component-id="${guid}"] ${this.selectors.descriptionView} span[style="${value}"]`;
        return await $$(isColorText).last().isDisplayed();
    }

    async isLinkDisplayedInCKE(value: string, guid?: string): Promise<boolean> {
        let link = this.selectors.linkText;
        if (guid) link = `[rx-view-component-id="${guid}"] a`;
        return await $$(this.selectors.linkText).first().getText() == value;
    }

    async isTitleDisplayed(title: string): Promise<boolean> {
        await browser.sleep(1000); // To Wait For Display Title.
        let text = await browser.getTitle();
        return text.includes(title);
    }

    async getCKEditorText(guid?: string): Promise<string> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame(await element(by.css('iframe.cke_wysiwyg_frame')).getWebElement());
            await browser.wait(this.EC.elementToBeClickable($(this.selectors.bodyTextArea)), 3000);
            let value = await $(this.selectors.bodyTextArea).getText();
            await browser.switchTo().defaultContent();
            await browser.waitForAngularEnabled(true);
            return value;
        }
        else {
            return await utilityCommon.getCKEditorText(guid);
        }
    }

    async isBoldTextDisplayedInCkEditorTextArea(bodyText: string, boldTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (!boldTextElement) boldTextElement = await $(this.selectors.boldTextCkEditorTextArea);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return await boldTextElement.isPresent().then(async (result) => {
                if (result) {
                    let boldTextCke = await boldTextElement.getText();
                    if (boldTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return boldTextElement.isPresent().then(async (result) => {
                if (result) {
                    let boldTextCke = await boldTextElement.getText();
                    if (boldTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isItalicTextDisplayedInCkEditorTextArea(bodyText: string, italicTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (!italicTextElement) italicTextElement = await $(this.selectors.italicTextCkEditorTextArea);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return await italicTextElement.isPresent().then(async (result) => {
                if (result) {
                    let italicTextCke = await italicTextElement.getText();
                    if (italicTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return await italicTextElement.isPresent().then(async (result) => {
                if (result) {
                    let italicTextCke = await italicTextElement.getText();
                    if (italicTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isUnderlineTextDisplayedInCkEditorTextArea(bodyText: string, underlineTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (!underlineTextElement) underlineTextElement = await $(this.selectors.underlineTextCkEditorTextArea);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return await underlineTextElement.isPresent().then(async (result) => {
                if (result) {
                    let italicTextCke = await underlineTextElement.getText();
                    if (italicTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return await underlineTextElement.isPresent().then(async (result) => {
                if (result) {
                    let italicTextCke = await underlineTextElement.getText();
                    if (italicTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isColorTextDisplayedInCkEditorTextArea(bodyText: string, colorValue?: string, colorTextElement?: ElementFinder, ): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (!colorTextElement) colorTextElement = await $(`.cke_enable_context_menu span[style="${colorValue}"]`);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return await colorTextElement.isPresent().then(async (result) => {
                if (result) {
                    let colorTextCke = await colorTextElement.getText();
                    if (colorTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return await colorTextElement.isPresent().then(async (result) => {
                if (result) {
                    let colorTextCke = await colorTextElement.getText();
                    if (colorTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isTextLeftAlignInCkEditorTextArea(bodyText: string, leftAlignTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (!leftAlignTextElement) leftAlignTextElement = await $(this.selectors.alignmentTextCkEditorTextArea);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return await leftAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let leftAlignTextCke = await leftAlignTextElement.getText();
                    if (leftAlignTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return await leftAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let leftAlignTextCke = await leftAlignTextElement.getText();
                    if (leftAlignTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isTextRightAlignInCkEditorTextArea(bodyText: string, rightAlignTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (!rightAlignTextElement) rightAlignTextElement = await $$(this.selectors.rightAlignText).first();
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return await rightAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let rightAlignTextCke = await rightAlignTextElement.getText();
                    if (rightAlignTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                    else return false;
                }
                else return false;
            });
        }
        else {
            return await rightAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let rightAlignTextCke = await rightAlignTextElement.getText();
                    if (rightAlignTextCke.includes(bodyText)) {
                        return true;
                    }
                    else return false;
                }
                else return false;
            });
        }
    }

    async isTextCenterAlignInCkEditorTextArea(bodyText: string, centerAlignTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (!centerAlignTextElement) centerAlignTextElement = await $(this.selectors.centerAlignText);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return await centerAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let centerAlignTextCke = await centerAlignTextElement.getText();
                    if (centerAlignTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return await centerAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let centerAlignTextCke = await centerAlignTextElement.getText();
                    if (centerAlignTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isNumberListDisplayedInCkEditorTextArea(bodyText: string, numberListTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (!numberListTextElement) numberListTextElement = await $(this.selectors.numberListCkEditorTextArea);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return await numberListTextElement.isPresent().then(async (result) => {
                if (result) {
                    let numberListTextCke = await numberListTextElement.getText();
                    if (numberListTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return await numberListTextElement.isPresent().then(async (result) => {
                if (result) {
                    let numberListTextCke = await numberListTextElement.getText();
                    if (numberListTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isBulletListDisplayedInCkEditorTextArea(bodyText: string, bulletListTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (!bulletListTextElement) bulletListTextElement = await $(this.selectors.bulletListTextCkEditorTextArea);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return await bulletListTextElement.isPresent().then(async (result) => {
                if (result) {
                    let bulletListTextCke = await bulletListTextElement.getText();
                    if (bulletListTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return await bulletListTextElement.isPresent().then(async (result) => {
                if (result) {
                    let bulletListTextCke = await bulletListTextElement.getText();
                    if (bulletListTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async getColorFontStyleOfText(value: string, guid?: string): Promise<string> {
        let alignColorFontStyle;
        await $(`div.contents [style="${value}"]`).isPresent().then(async (result) => {
            if (result) {
                alignColorFontStyle = `div [style="${value}"]`;
            } else {
                alignColorFontStyle = `[style="${value}"]`;
            }
        });

        if (guid) alignColorFontStyle = `[rx-view-component-id="${guid}"] [style="${value}"]`;
        let framePresent = await $(this.selectors.frame).isPresent();
        let elementText: string;
        let styleElementCount = (await $$(alignColorFontStyle)).length;
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            for (let i: number = 0; i < styleElementCount; i++) {
                elementText += await $$(alignColorFontStyle).get(i).getText();
            }
            await browser.switchTo().defaultContent();
            await browser.waitForAngularEnabled(true);
            return elementText;
        }
        else {
            for (let i: number = 0; i < styleElementCount; i++) {
                elementText += await $$(alignColorFontStyle).get(i).getText();
            }
            return elementText;
        }
    }

    async isLinkDisplayedInCkEditorTextArea(bodyText: string, linkTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (!linkTextElement) linkTextElement = await $$(this.selectors.linkTextCkEditorTextArea).first();
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return await linkTextElement.isPresent().then(async (result) => {
                if (result) {
                    let linkTextCke = await linkTextElement.getText();
                    if (linkTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return await linkTextElement.isPresent().then(async (result) => {
                if (result) {
                    let linkTextCke = await linkTextElement.getText();
                    if (linkTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isFontApplied(value, tagName: string, guid?: string): Promise<boolean> {
        let locator = `.cke_wysiwyg_div ${tagName}[style="font-size:${value}px;"]`;
        if (guid) {
            locator = `[rx-view-component-id="${guid}"] .cke_wysiwyg_div ${tagName}[style="font-size:${value}px;"]`;
        }
        console.log(locator);
        return await $(locator).isPresent().then(async (link) => {
            if (link) {
                return await $(locator).isDisplayed();
            } else return false;
        });
    }

    async isTextJustifyAlignInCkEditorTextArea(bodyText: string, justifyAlignTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (!justifyAlignTextElement) justifyAlignTextElement = await $(this.selectors.justifyAlignText);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return await justifyAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let centerAlignTextCke = await justifyAlignTextElement.getText();
                    if (centerAlignTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return await justifyAlignTextElement.isPresent().then(async (result) => {
                if (result) {
                    let centerAlignTextCke = await justifyAlignTextElement.getText();
                    if (centerAlignTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isStrikeThroughTextDisplayedInCkEditorTextArea(bodyText: string, strikeThroughTextElement?: ElementFinder): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        if (!strikeThroughTextElement) strikeThroughTextElement = await $(this.selectors.strikeThroughTextCkEditorTextArea);
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            return await strikeThroughTextElement.isPresent().then(async (result) => {
                if (result) {
                    let strikeTextCke = await strikeThroughTextElement.getText();
                    if (strikeTextCke.includes(bodyText)) {
                        await browser.switchTo().defaultContent();
                        await browser.waitForAngularEnabled(true);
                        return true;
                    }
                }
                else return false;
            });
        }
        else {
            return await strikeThroughTextElement.isPresent().then(async (result) => {
                if (result) {
                    let strikeTextCke = await strikeThroughTextElement.getText();
                    if (strikeTextCke.includes(bodyText)) {
                        return true;
                    }
                }
                else return false;
            });
        }
    }

    async isStyleApplied(value: string, tagName: string, guid?: string): Promise<boolean> {
        let locator = `.cke_wysiwyg_div ${tagName}`;
        if (guid) {
            locator = `[rx-view-component-id="${guid}"] .cke_wysiwyg_div ${tagName}`;
        }
        let text = await $(locator).getText();
        return text.includes(value);
    }

    async isCkEditorDisplayed(): Promise<boolean> {
        return await $(this.selectors.activityNoteTextArea).isPresent().then(async (link) => {
            if (link) return await $(this.selectors.activityNoteTextArea).isDisplayed();
            else return false;
        });
    }

    async isImageDisplayedInCKE(value: string, guidId?: string): Promise<boolean> {
        if (guidId) {
            return await $(`[rx-view-component-id="${guidId}"] img[src="${value}"]`).isDisplayed();
        }
        let framePresent = await $(this.selectors.frame).isPresent();
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame($(this.selectors.frame).getWebElement());
            let locator = `img[src='${value}']`;
            let imageIsDisplayed: boolean = await $$(locator).last().isDisplayed();
            await browser.switchTo().defaultContent();
            await browser.waitForAngularEnabled(true);
            return imageIsDisplayed;
        }
        else {
            return await $$(`img[src="${value}"]`).last().isDisplayed();
        }
    }

    async getTextCkEditorMinimizeOrMiximize(guidId?: string): Promise<string> {
        if (guidId) return await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.maximizeMinimizeWindow).getAttribute('title');
        else return await $(this.selectors.maximizeMinimizeWindow).getAttribute('title');
    }

    async getTextCkEditorTextArea(): Promise<string> {
        return await $(this.selectors.activityNoteTextArea).getText();
    }

    async isPublicCheckBoxToolTipIconDisplayed(): Promise<boolean> {
        return await $(this.selectors.addNotePublicCheckBoxToolTip).isPresent().then(async (link) => {
            if (link) return await $(this.selectors.addNotePublicCheckBoxToolTip).isDisplayed();
            else return false;
        });
    }

    async isTableCaptionDisplayedInCkEditorTextArea(tableSummary: string, tableCaption: string): Promise<boolean> {
        let locator = `table[summary='${tableSummary}'] caption`;
        return await element(by.css(locator)).isPresent().then(async (result) => {
            if (result) {
                let tableCaptionText = await element(by.css(locator)).getText();
                return tableCaptionText.includes(tableCaption);
            }
            else return false;
        });
    }

    async isTableSummaryDisplayedInCkEditorTextArea(tableSummary: string): Promise<boolean> {
        let locator = `table[summary='${tableSummary}']`;
        return await element(by.css(locator)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.css(locator)).isDisplayed();
            } else return false;
        });
    }

    async isHyperLinkDisplayedInCkEditorTextArea(value: string): Promise<boolean> {
        let framePresent = await $(this.selectors.frame).isPresent();
        let locator = `[href='${value}']`;
        if (framePresent == true) {
            await browser.waitForAngularEnabled(false);
            await browser.switchTo().frame(await $('[rx-view-component-id="c13d2848-2fe9-4e6d-adc0-79bb13e1f965"] iframe.cke_wysiwyg_frame').getWebElement());
            await browser.wait(this.EC.elementToBeClickable($(this.selectors.bodyTextArea)), 3000);
            let islinkDisplayed: boolean = await $(locator).isDisplayed();
            await browser.switchTo().defaultContent();
            await browser.waitForAngularEnabled(true);
            return islinkDisplayed;
        }
        else {
            return await $(locator).isPresent().then(async (isPresent) => {
                if(isPresent) return await $$(locator).last().isDisplayed();
                else return false;
            })
        }
    }
}

export default new CKEValidation();