import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from 'protractor';

const fs = require('fs');

export class Util {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dropdownBox: '.ui-select-toggle',
        dropDownInput: 'input[type="search"]',
        dropDownOption: '.ui-select-choices-row-inner *',
        popUpMsgLocator: '.rx-growl-item__message',
        warningOk: '.modal-footer button[class*="d-button d-button_primary"], .d-modal__footer button[class*="d-button d-button_primary"]',
        warningCancel: '.modal-footer button[class*="d-button d-button_secondary"], .d-modal__footer button[class*="d-button d-button_secondary"]',
        warningDialog: '.modal-content .modal-dialog, .modal-content .d-modal__dialog',
        warningDialogMsg: '.modal-content .modal-body, .modal-content .d-modal__content-item',
        closeTipMsg: '.close.rx-growl-close',
        errorMsg: '.rx-alert-error',
        advancedSearchInput: 'input.rx-adv-search-textField',
        advancedSearchSettingsBtn: 'button.d-icon-adjust_settings',
        advancedSearchSettingsBtnClose: 'button[ng-hide="showAdvOptions"]',
        advancedSearchResult: '.km-group-list-item__description',
        dropDownChoice: '.ui-select__rx-choice',
        warningMsgText: '.modal-content .modal-title-message, .modal-content .d-modal__title',
        warningMsgTextKnowledgeStyle: '.d-modal__content .d-modal__content-item',
        configurationOptionsErrorMessage: '.panel-default .panel-heading h4',
    }

    async isConfigurationOptionMessageDisplayed(errorMessage): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.configurationOptionsErrorMessage)));
        return await element(by.cssContainingText(this.selectors.configurationOptionsErrorMessage, errorMessage)).isDisplayed();

    }

    async isWarningDialogBoxDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.warningDialog)),2000);
        return await $(this.selectors.warningDialog).isDisplayed();
    }

    async getWarningMessagegText(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.warningMsgText)));
        return await $(this.selectors.warningMsgText).getText();
    }

    async getWarningMessageTextKnowledgeStyle(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.warningMsgText)));
        return await $(this.selectors.warningMsgTextKnowledgeStyle).getText();
    }

    async selectDropDown(guid: string, value: string): Promise<void> {
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        const dropDownInputElement = await dropDown.$(this.selectors.dropDownInput);
        //        await browser.wait(this.EC.elementToBeClickable(dropDownBoxElement));
        await dropDownBoxElement.click();
        //        await browser.wait(this.EC.visibilityOf(dropDownInputElement));
        await dropDownInputElement.sendKeys(value);
        //        await browser.wait(this.EC.or(async () => {
        //            let count = await dropDown.$$(this.selectors.dropDownOption).count();
        //            return count >= 1;
        //        }));
        var optionCss: string = `[rx-view-component-id="${guid}"] .ui-select-choices-row-inner *`;
        //        await browser.sleep(1000);
        var option = await element(by.cssContainingText(optionCss, value));
        //        await browser.wait(this.EC.elementToBeClickable(option), 2000).then(async function () {
        await option.click();
        //        });
    }

    async selectDropDown2(dropDownElementFinder: ElementFinder, value: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable(dropDownElementFinder));
        await dropDownElementFinder.click();
        //        await browser.wait(this.EC.or(async () => {
        //            await browser.wait(this.EC.invisibilityOf(element(by.cssContainingText(this.selectors.dropDownChoice, 'Loading data...'))));
        //            let count = await $$(this.selectors.dropDownChoice).count();
        //            return count >= 1;
        //        }));
        let option = await element(by.cssContainingText(this.selectors.dropDownChoice, value));
        //        await browser.sleep(1000);
        //        await browser.wait(this.EC.elementToBeClickable(option), 2000).then(async function () {
        await option.click();
        //        });
    }

    async isValuePresentInDropDown(guid: string, value: string): Promise<boolean> {
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        const dropDownInputElement = await dropDown.$(this.selectors.dropDownInput);
        //        await browser.wait(this.EC.elementToBeClickable(dropDownBoxElement));
        await dropDownBoxElement.click();
        //        await browser.wait(this.EC.visibilityOf(dropDownInputElement));
        await dropDownInputElement.sendKeys(value);
        //        await this.waitUntilSpinnerToHide();
        let count = await dropDown.$$(this.selectors.dropDownOption).count();
        if (count >= 1) { return true; } else { return false; }
    }

    async isDrpDownvalueDisplayed(guid: string, data: string[]): Promise<boolean> {
        let arr: string[] = [];
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        //        await browser.wait(this.EC.elementToBeClickable(dropDownBoxElement));
        await dropDownBoxElement.click();
        //        await browser.wait(this.EC.or(async () => {
        //            await browser.wait(this.EC.invisibilityOf(element(by.cssContainingText(this.selectors.dropDownOption, 'Loading data...'))), 2000);
        //            let count = await dropDown.$$(this.selectors.dropDownOption).count();
        //            return count >= 1;
        //        }),3000);
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
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)));
        return await $(this.selectors.popUpMsgLocator).getText();
    }

    async scrollUpOrDownTillElement(element:string): Promise<void> {
        await browser.executeScript("arguments[0].scrollIntoView();", $(`${element}`).getWebElement());
    }

    async isErrorMsgPresent(): Promise<boolean> {
        return await $(this.selectors.errorMsg).isDisplayed();
    }

    async isPopUpMessagePresent(value: string): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)));
        // await browser.wait(this.EC.or(async () => {
        //     let count = await $$(this.selectors.popUpMsgLocator).count();
        //     return count >= 1;
        // }), 2000);
        // let allMessages = await $$(this.selectors.popUpMsgLocator);
        // let allMessageList = [];        
        // for(let i: number =0; i < allMessages.length; i++){
        //     allMessageList.push(await allMessages[i].getText());
        // }
        // console.log(allMessageList);
        let option: boolean = await element(by.cssContainingText(this.selectors.popUpMsgLocator, value)).isDisplayed();
        return option;
    }

    async selectDropDownWithName(name: string, value: string): Promise<void> {
        const dropDown = await $(`[title="${name}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        const dropDownInputElement = await dropDown.$(this.selectors.dropDownInput);
        //        await browser.wait(this.EC.elementToBeClickable(dropDownBoxElement));
        await dropDownBoxElement.click();
        //        await browser.wait(this.EC.visibilityOf(dropDownInputElement));
        await dropDownInputElement.sendKeys(value);
        //        await browser.wait(this.EC.or(async () => {
        //            let count = await dropDown.$$(this.selectors.dropDownOption).count();
        //            return count >= 1;
        //        }));
        var optionCss: string = `[title="${name}"] .ui-select-choices-row-inner *`;
        //        await browser.sleep(1000);
        var option = await element(by.cssContainingText(optionCss, value));
        //        await browser.wait(this.EC.visibilityOf(option));
        await option.click();
    }

    async waitUntilPopUpDisappear(): Promise<void> {
        await browser.wait(this.EC.invisibilityOf($(this.selectors.popUpMsgLocator)), 5000);
    }

    async closePopUpMessage(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)));
        await $$(this.selectors.closeTipMsg).then(async function (popups) {
            for (let i = 0; i < popups.length; i++) {
                await popups[i].click();
            }
        });
    }

    async clickOnWarningOk(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.warningOk)),2000);
        await $(this.selectors.warningOk).click();
    }

    async clickOnWarningCancel(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.warningCancel)));
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
        await browser.sleep(2000);
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
        await browser.sleep(2000);
    }

    async waitUntilSpinnerToHide(): Promise<void> {
        try {
            await browser.wait(this.EC.presenceOf($('.d-preloader')), 5 * 1000);
            await browser.wait(this.EC.or(async () => {
                await $$('.d-preloader').each(async function (element) {
                    await element.getAttribute('innerHTML') == null;
                });
            }), 7 * 1000);
        } catch (error) {
            console.log('Spinner not present on the page');
        }
    }

    /*Work as same as String.format i.e. first parameter is a string with multiple variables embedded and other parameters will replace the embedded variables of first string
    Example: 
    let str1 = "This is {0} best {1}.";
    let str2 = "the";
    let str3 = "example";
    console.log(formatString(str1, str2, str3)); Output ==>  "This is the best example."
    */
    formatString(str: string, ...val: string[]) {
        for (let index = 0; index < val.length; index++) {
            str = str.replace(`{${index}}`, val[index]);
        }
        return str;
    }

    async getSelectedFieldValue(fieldName: string): Promise<string> {
        let metadataField = `//span[@class='d-textfield__item'][text()='${fieldName}']/following-sibling::*//span[contains(@class,'ui-select-match-text')]`;
        //        await browser.wait(this.EC.visibilityOf(element(by.xpath(metadataField))));
        let actualFieldVal: string = await element(by.xpath(metadataField)).getText();
        return actualFieldVal;
    }

    async isFieldLabelDisplayed(guid: string, fieldName: string): Promise<boolean> {
        let fieldLabel = `[rx-view-component-id='${guid}'] .d-textfield__item`;
        //        await browser.wait(this.EC.visibilityOf($(fieldLabel)));
        return await element(by.cssContainingText(fieldLabel, fieldName)).isPresent().then(async (result) => {
            if(result){
                return await element(by.cssContainingText(fieldLabel, fieldName)).getText() == fieldName ? true : false;
            } else {
                console.log("Flowset not present");
                return false;
            }
        });
    }

    async isRequiredAttributePresent(locator: any): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(locator)));
        return (await $(locator).getAttribute("required")) == 'required';
    }

    async isRequiredTagToField(guid: string): Promise<boolean> {
        let nameElement = await $(`[rx-view-component-id="${guid}"] span`);
        let value: string = await browser.executeScript('return window.getComputedStyle(arguments[0], ":after").content;', nameElement);
        return value.trim().substring(3, value.length - 2) === 'required';
    }

    async deleteAlreadyDownloadedFile(fileName: string): Promise<boolean> {
        let filePath: string = 'e2e/data/downloads/' + fileName;
        console.log("Deleting....", filePath);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        } else console.log("File not present");
        return !fs.existsSync(filePath);
    }

    async isFileDownloaded(fileName: string): Promise<boolean> {
        let filePath: string = 'e2e/data/downloads/' + fileName;
        await browser.sleep(5000);
        return await fs.existsSync(filePath);
    }

    async getWarningDialogMsg(): Promise<string> {
        return await $(this.selectors.warningDialogMsg).getText();
    }

    async isPopupMsgsMatches(msgs:string[]): Promise<boolean>{
        let arr: string[] = await this.getAllPopupMsg();
        msgs.sort();
        return arr.length === msgs.length && arr.every(
            (value, index) => (value === msgs[index])
        );
    }

    async getAllPopupMsg(): Promise<string[]>{
        await browser.waitForAngularEnabled(false);
        let arr: string[] = [];
        await browser.wait(this.EC.visibilityOf($$(this.selectors.popUpMsgLocator).last()));
        let msgLocator = await $$(this.selectors.popUpMsgLocator);
        for (let i: number = 0; i < msgLocator.length; i++) {
            arr[i]=await msgLocator[i].getText();            
        }
        await browser.waitForAngularEnabled(true);
        return arr;
    }

}

export default new Util();