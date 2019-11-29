import { browser, until, ExpectedConditions, element, by, $, $$, ProtractorExpectedConditions, protractor } from 'protractor';

export class Util {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dropdownBox: '.ui-select-toggle',
        dropDownInput: 'input[type="search"]',
        dropDownOption: '.ui-select-choices-row-inner *',
        popUpMsgLocator: '.rx-growl-item__message',
        warningOk: '.d-modal__footer button[class*="d-button d-button_primary d-button_small"]',
        warningCancel: '.d-modal__footer button[class*="d-button d-button_secondary d-button_small"]',
        errorMsg: '.rx-growl-item__message',
        closeTipMsg: '.close.rx-growl-close'
    }

    async selectDropDown(guid: string, value: string): Promise<void> {
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        const dropDownInputElement = await dropDown.$(this.selectors.dropDownInput);
        await browser.wait(this.EC.elementToBeClickable(dropDownBoxElement));
        await dropDownBoxElement.click();
        await browser.wait(this.EC.visibilityOf(dropDownInputElement));
        await dropDownInputElement.sendKeys(value);
        await browser.wait(this.EC.or(async () => {
            let count = await dropDown.$$(this.selectors.dropDownOption).count();
            return count >= 1;
        }));
        var optionCss: string = `[rx-view-component-id="${guid}"] .ui-select-choices-row-inner *`;
        await browser.sleep(300);
        var option = await element(by.cssContainingText(optionCss, value));
        await browser.wait(this.EC.visibilityOf(option));
        await option.click();
    }

    async getPopUpMessage() {
        await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)));
        return await $(this.selectors.popUpMsgLocator).getText();
    }

    async getPopUpMessages(messageNo:number) {
        await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)));
        return await $$(this.selectors.popUpMsgLocator).get(messageNo).getText();
    }

    async selectDropDownWithName(name: string, value: string): Promise<void> {
        const dropDown = await $(`[title="${name}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        const dropDownInputElement = await dropDown.$(this.selectors.dropDownInput);
        await browser.wait(this.EC.elementToBeClickable(dropDownBoxElement));
        await dropDownBoxElement.click();
        await browser.wait(this.EC.visibilityOf(dropDownInputElement));
        await dropDownInputElement.sendKeys(value);
        await browser.wait(this.EC.or(async () => {
            let count = await dropDown.$$(this.selectors.dropDownOption).count();
            return count >= 1;
        }));
        var optionCss: string = `[title="${name}"] .ui-select-choices-row-inner *`;
        await browser.sleep(300);
        var option = await element(by.cssContainingText(optionCss, value));
        await browser.wait(this.EC.visibilityOf(option));
        await option.click();
    }

    async waitUntilPopUpDisappear(): Promise<void> {
        await browser.wait(this.EC.invisibilityOf($(this.selectors.popUpMsgLocator)));
    }

    async waitUntilErrorMessageDisappear(): Promise<void> {
        await browser.wait(this.EC.invisibilityOf($(this.selectors.errorMsg)));
    }

    async closePopUpMessage(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.closeTipMsg)));
        await $(this.selectors.closeTipMsg).click();
    }

    async clickOnWarningOk(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.warningOk)));
        await $(this.selectors.warningOk).click();
    }

    async clickOnWarningCancel(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.warningCancel)));
        await $(this.selectors.warningCancel).click();
    }

    async selectToggleButton(guid: string, value: boolean): Promise<void> {
        const togglebutton = await $(`[rx-view-component-id="${guid}"]`);
        if (value) {
            let element = await togglebutton.$('.d-icon-check')
            let isclicked = await element.getAttribute('aria-pressed');
            if (isclicked == 'false') {
                await element.click();
            }
        } else {
            let element = await togglebutton.$('.d-icon-circle_slash_o')
            let isclicked = await element.getAttribute('aria-pressed');
            if (isclicked == 'false') {
                await element.click();
            }
        }
    }

    async switchToNewWidnow(windowNum:number): Promise<void> {
        await browser.sleep(5000);
        await browser.getAllWindowHandles().then(async function(handles){
            await browser.switchTo().window(handles[windowNum]);
        });
    }

    async switchToDefaultWidnow(): Promise<void> {
        await browser.sleep(5000);
        await browser.switchTo().defaultContent();
    }
}

export default new Util();