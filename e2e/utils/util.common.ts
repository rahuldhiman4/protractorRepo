import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from 'protractor';

export class Util {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dropdownBox: '.ui-select-toggle',
        dropDownInput: 'input[type="search"]',
        dropDownOption: '.ui-select-choices-row-inner *',
        popUpMsgLocator: '.rx-growl-item__message',
        warningOk: '.d-modal__footer button[class*="d-button d-button_primary d-button_small"]',
        warningCancel: '.d-modal__footer button[class*="d-button d-button_secondary d-button_small"]',
        closeTipMsg: '.close'
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
        await browser.sleep(1000);
        var option = await element(by.cssContainingText(optionCss, value));
        await browser.wait(this.EC.visibilityOf(option));
        await option.click();
    }

    async isDrpDownvalueDisplayed(guid: string,data: string[]): Promise<boolean> {
        let arr: string[] = [];
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        await browser.wait(this.EC.elementToBeClickable(dropDownBoxElement));
        await dropDownBoxElement.click();
        let drpDwnvalue: number = await $$(this.selectors.dropDownOption).count();
        for (var i = 0; i < drpDwnvalue; i++) {
            var ab: string = await $$(this.selectors.dropDownOption).get(i).getText();
            arr[i] = ab;
        }
        arr = arr.sort();
        data = data.sort();
        return arr.length === data.length && arr.every(
            (value, index) => (value === data[index])
        );
    }

    async getPopUpMessage(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)));
        return await $(this.selectors.popUpMsgLocator).getText();
    }

    async isPopUpMessagePresent(value: string) : Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)));
        await browser.wait(this.EC.or(async () => {
            let count = await $$(this.selectors.popUpMsgLocator).count();
            return count >= 1;
        }));
        let option:boolean = await element(by.cssContainingText(this.selectors.popUpMsgLocator, value)).isDisplayed();
        return option;
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
        await browser.sleep(1000);
        var option = await element(by.cssContainingText(optionCss, value));
        await browser.wait(this.EC.visibilityOf(option));
        await option.click();
    }

    async waitUntilPopUpDisappear(): Promise<void> {
        await browser.wait(this.EC.invisibilityOf($(this.selectors.popUpMsgLocator)));
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

    async switchToNewWidnow(windowNum: number): Promise<void> {
        await browser.sleep(5000);
        await browser.getAllWindowHandles().then(async function (handles) {
            await browser.switchTo().window(handles[windowNum]);
        });
    }

    async switchToDefaultWindowClosingOtherTabs(): Promise<void> {
        await browser.sleep(5000);
        await browser.getAllWindowHandles().then(async function (handles) {
            for (let i = handles.length; i > 1; i--) {
                await browser.switchTo().window(handles[i - 1]);
                await browser.close();
            }
            await browser.switchTo().window(handles[0]);
        });
    }

    async waitUntilSpinnerToHide(): Promise<void> {
        await browser.wait(this.EC.presenceOf($('.d-preloader')));
        await browser.wait(this.EC.or(async () => {
            await $$('.d-preloader').each(async function (element) {
                await element.getAttribute('innerHTML') == null
            });
        }), 30 * 1000);
    }
}

export default new Util();