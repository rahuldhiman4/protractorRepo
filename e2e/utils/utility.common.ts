import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from 'protractor';

const fs = require('fs');


export class Utility {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dropdownBox: '.dropdown-toggle',
        dropDownInput: 'input.form-control',
        dropDownNoneOpt: '.dropdown_select__btn',
        dropDownOption: '.dropdown_select__menu-content button',
        warningOk: '.modal-content .btn-primary, .d-modal__footer button[class*="d-button d-button_primary"]',
        warningCancel: '.modal-content .btn-secondary, .d-modal__footer button[class*="d-button d-button_secondary"]',
        warningDialog: '.modal-content .modal-title, .modal-content .d-modal__title',
        warningDialogMsg: '.modal-content .modal-body, .modal-content .d-modal__content-item',
        popUpMsgLocator: '.a-toast__details div',
        popupMsgTitle: '.a-toast__summary',
        closeTipMsg: '.a-toast__close_button',
        dropDownChoice: '.dropdown-item',
    }

    async isWarningDialogBoxDisplayed(): Promise<boolean> {
        return await $(this.selectors.warningDialog).isPresent();
    }

    async getWarningDialogTitle(): Promise<string> {
        return await $(this.selectors.warningDialog).getText();
    }

    async getWarningMessageTextKnowledgeStyle(): Promise<string> {
        return await $(this.selectors.warningDialogMsg).getText();
    }

    async selectDropDown(guid: string, value: string): Promise<void> {
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        const dropDownInputElement = await dropDown.$(this.selectors.dropDownInput);
        await dropDownBoxElement.click();
        await browser.wait(this.EC.elementToBeClickable(dropDownInputElement),3000).then(async function(){
            await dropDownInputElement.sendKeys(value);
        });
        
        let optionCss: string = `[rx-view-component-id="${guid}"] .dropdown_select__menu-content button`;
        let option = await element(by.cssContainingText(optionCss, value));
        await browser.wait(this.EC.elementToBeClickable(option), 3000).then(async function () {
            await option.click();
        });
    }

    async clearDropDown(guid: string): Promise<void> {
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        const dropDownSelectNoneItem = await dropDown.$(this.selectors.dropDownNoneOpt);
        await dropDownBoxElement.click();
        await dropDownSelectNoneItem.click();
        await dropDownBoxElement.click();
    }

    async isValuePresentInDropDown(guid: string, value: string): Promise<boolean> {
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        const dropDownInputElement = await dropDown.$(this.selectors.dropDownInput);
        await dropDownBoxElement.click();
        await dropDownInputElement.sendKeys(value);
        let count = await dropDown.$$(this.selectors.dropDownOption).count();
        if (count >= 1) { return true; } else { return false; }
    }

    async isDropDownValueDisplayed(guid: string, data: string[]): Promise<boolean> {
        let arr: string[] = [];
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        await dropDownBoxElement.click();
        let drpDwnvalue: number = await $$(this.selectors.dropDownOption).count();
        for (let i = 0; i < drpDwnvalue; i++) {
            let ab: string = await $$(this.selectors.dropDownOption).get(i).getText();
            arr[i] = ab;
        }
        arr = arr.sort();
        data = data.sort();
        return arr.length === data.length && arr.every(
            (value, index) => (value === data[index])
        );
    }

    async scrollUpOrDownTillElement(element: string): Promise<void> {
        await browser.executeScript("arguments[0].scrollIntoView();", $(`${element}`).getWebElement());
    }

    async isSuccessMsgAppeared(): Promise<boolean> {
        return await $(this.selectors.popupMsgTitle).getText()=='Success';
    }

    async isErrorMsgAppeared(): Promise<boolean> {
        return await $(this.selectors.popupMsgTitle).getText()=='Script Error';
    }

    async isPopUpMessagePresent(expectedMsg: string): Promise<boolean> {
        let arr: string[] = await this.getAllPopupMsg();
        return arr.includes(expectedMsg);
    }

    async waitUntilPopUpDisappear(): Promise<void> {
        await browser.wait(this.EC.invisibilityOf($(this.selectors.popUpMsgLocator)), 5000);
    }

    async closePopUpMessage(): Promise<void> {
        await $$(this.selectors.closeTipMsg).then(async function (popups) {
            for (let i = 0; i < popups.length; i++) {
                await popups[i].click();
            }
        });
    }

    async clickOnWarningOk(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.warningOk)), 2000).then(async (result) => {
            if (result) {
                await $(this.selectors.warningOk).click();
            }
        });
    }

    async clickOnWarningCancel(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.warningCancel)), 2000).then(async (result) => {
            if (result) {
                await $(this.selectors.warningCancel).click();
            }
        });
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
        let actualFieldVal: string = await element(by.xpath(metadataField)).getText();
        return actualFieldVal;
    }

    async isFieldLabelDisplayed(guid: string, fieldName: string): Promise<boolean> {
        let fieldLabel = `[rx-view-component-id='${guid}'] .d-textfield__item`;
        return await element(by.cssContainingText(fieldLabel, fieldName)).isPresent().then(async (result) => {
            if (result) {
                return await element(by.cssContainingText(fieldLabel, fieldName)).getText() == fieldName ? true : false;
            } else {
                console.log("Flowset not present");
                return false;
            }
        });
    }

    async isRequiredAttributePresent(locator: any): Promise<boolean> {
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

    async getCurrentDate(): Promise<string> {
        let month: string;
        let date: string;

        let objDate: Date = new Date();
        let numYear: number = objDate.getFullYear();
        let year: string = new Number(numYear).toString();

        let numMonth: number = objDate.getUTCMonth() + 1;
        let month1 = new Number(numMonth);
        if (month1 <= 9) {
            month = '0' + month1.toString();
        } else {
            month = month1.toString();
        }
        let numDate: number = objDate.getUTCDate();
        let date1 = new Number(numDate);
        if (date1 <= 9) {
            date = '0' + date1.toString();
        } else {
            date = date1.toString();
        }
        return date + '/' + month + '/' + year;
    }

    async isAllPopupMsgsMatches(msgs: string[]): Promise<boolean> {
        let arr: string[] = await this.getAllPopupMsg();
        msgs.sort();
        return arr.length === msgs.length && arr.every(
            (value, index) => (value === msgs[index])
        );
    }

    async getAllPopupMsg(): Promise<string[]> {
        await browser.waitForAngularEnabled(false);
        let arr: string[] = [];
        await browser.wait(this.EC.visibilityOf($$(this.selectors.popUpMsgLocator).last()));
        let msgLocator = await $$(this.selectors.popUpMsgLocator);
        for (let i: number = 0; i < msgLocator.length; i++) {
            arr[i] = await msgLocator[i].getText();
        }
        await browser.waitForAngularEnabled(true);
        return arr;
    }

}

export default new Utility();