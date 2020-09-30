import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityCommon from './utility.common';

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
        backArrow: '[class="d-button d-icon-left-undo d-button_link d-button_small"]',
        ckEditor: '.cke_inner',
        ckEditorTextArea: '.cke_editable_themed',
    }

    async clickOnBackArrow(): Promise<void> {
        await $(this.selectors.backArrow).click();
    }

    async isWarningDialogBoxDisplayed(): Promise<boolean> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.warningDialog)), 2000);
        return await $(this.selectors.warningDialog).isPresent();
    }

    async getWarningDialogTitle(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.warningMsgText)));
        return await $(this.selectors.warningMsgText).getText();
    }

    async getWarningMessageTextKnowledgeStyle(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.warningMsgText)));
        return await $(this.selectors.warningMsgTextKnowledgeStyle).getText();
    }

    async selectDropDown(guid: string, value: string): Promise<void> {
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownInputElement = await dropDown.$(this.selectors.dropDownInput);
        await utilityCommon.scrollToElement(await dropDown.$(this.selectors.dropdownBox)); //required to bring dropdown search in focus e.g. DRDMV-16276
        await dropDown.$(this.selectors.dropdownBox).click();
        //        await browser.wait(this.EC.visibilityOf(dropDownInputElement));
        await dropDownInputElement.sendKeys(value);
        //        await browser.wait(this.EC.or(async () => {
        //            let count = await dropDown.$$(this.selectors.dropDownOption).count();
        //            return count >= 1;
        //        }));
        let optionCss: string = `[rx-view-component-id="${guid}"] .ui-select-choices-row-inner *`;
        //        await browser.sleep(1000);
        console.log('Selecting the Dropdown value:', value);
        let option = await element(by.cssContainingText(optionCss, value));
        await browser.wait(this.EC.elementToBeClickable(option), 3000).then(async function () {
            await option.click();
        });
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
        console.log("Checking drop down ===>", guid);
        let arr: string[] = [];
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        //        await browser.wait(this.EC.elementToBeClickable(dropDownBoxElement));
        await browser.executeScript("arguments[0].scrollIntoView();", dropDownBoxElement);
        await dropDownBoxElement.click();
        //        await browser.wait(this.EC.or(async () => {
        //            await browser.wait(this.EC.invisibilityOf(element(by.cssContainingText(this.selectors.dropDownOption, 'Loading data...'))), 2000);
        //            let count = await dropDown.$$(this.selectors.dropDownOption).count();
        //            return count >= 1;
        //        }),3000);
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

    async isErrorMsgPresent(): Promise<boolean> {
        return await $(this.selectors.errorMsg).isDisplayed();
    }

    async isPopUpMessagePresent(expectedMsg: string, actualNumberOfPopups?: number): Promise<boolean> {
        let arr: string[] = await this.getAllPopupMsg(actualNumberOfPopups);
        return arr.includes(expectedMsg);
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
        let optionCss: string = `[title="${name}"] .ui-select-choices-row-inner *`;
        //        await browser.sleep(1000);
        let option = await element(by.cssContainingText(optionCss, value));
        //        await browser.wait(this.EC.visibilityOf(option));
        await option.click();
    }

    async waitUntilPopUpDisappear(): Promise<void> {
        await browser.wait(this.EC.invisibilityOf($(this.selectors.popUpMsgLocator)), 10000);
    }

    async closePopUpMessage(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)));
        await $$(this.selectors.closeTipMsg).then(async function (popups) {
            for (let i = 0; i < popups.length; i++) {
                await popups[i].click();
            }
        }).catch(async () => {
            await this.waitUntilPopUpDisappear();
            console.log('Popup is already closed');
        });
    }

    async clickOnWarningOk(): Promise<void> {
        await $(this.selectors.warningOk).isPresent().then(async (result) => {
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
                await browser.sleep(500); //toggle is slow on settings pages
                await element.click();
            }
        } else {
            let element = await togglebutton.$('.d-icon-circle_slash_o')
            let isclicked = await element.getAttribute('aria-pressed');
            if (isclicked == 'false') {
                await browser.sleep(500); //toggle is slow on settings pages
                await element.click();
            }
        }
    }

    async switchToNewWidnow(windowNum: number): Promise<void> {
        await browser.sleep(2000);
        await browser.getAllWindowHandles().then(async function (handles) {
            await browser.switchTo().window(handles[windowNum]);
        });
    }

    async switchToDefaultWindowClosingOtherTabs(): Promise<void> {
        await browser.sleep(2000);
        await browser.getAllWindowHandles().then(async function (handles) {
            for (let i = handles.length; i > 1; i--) {
                await browser.switchTo().window(handles[i - 1]);
                await browser.close();
            }
            await browser.switchTo().window(handles[0]);
        });
    }

    async waitUntilSpinnerToHide(): Promise<void> {
        try {
            await browser.wait(this.EC.presenceOf($('.d-preloader')), 5000);
            await browser.wait(this.EC.or(async () => {
                await $$('.d-preloader').each(async function (element) {
                    await element.getAttribute('innerHTML') == null;
                });
            }), 7000);
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
            if (result) {
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
        let value: string = await this.getTextFromAfterTag(nameElement);
        return value.trim().substring(3, value.length - 2) === 'required';
    }

    async isRequiredTagToFieldElement(element: ElementFinder): Promise<boolean> {
        let nameElement = element;
        let value: string = await this.getTextFromAfterTagElement(nameElement);
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

    async isPopupMsgsMatches(msgs: string[], actualNumberOfPopups?: number): Promise<boolean> {
        let arr: string[] = await this.getAllPopupMsg(actualNumberOfPopups);
        msgs.sort();
        arr.sort();
        return arr.length === msgs.length && arr.every(
            (value, index) => (value.includes(msgs[index]))
        );
    }

    async getAllPopupMsg(actualNumberOfPopups?: number): Promise<string[]> {
        await browser.waitForAngularEnabled(false);
        let arr: string[] = [];
        if (actualNumberOfPopups) {
            let count = 0;
            let i = 0;
            await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)), 5000);
            arr[i] = await $$(this.selectors.popUpMsgLocator).first().getText();
            let prevVal = arr[0];
            if (await browser.wait(this.EC.or(async () => {
                count = await $$(this.selectors.popUpMsgLocator).count();
                let temp = await $$(this.selectors.popUpMsgLocator).first().getText();
                if (temp != prevVal) {
                    i++;
                    arr[i] = temp;
                    prevVal = temp;
                }
                // console.log("i= ",i," and count is ",count," and array is ",arr)
                return (count == actualNumberOfPopups) || (arr.length == actualNumberOfPopups);
            }), 8000)) {
                if (count == actualNumberOfPopups) {
                    let msgLocator = await $$(this.selectors.popUpMsgLocator);
                    for (let j = 0; j < msgLocator.length; j++) {
                        arr[j] = await msgLocator[j].getText();
                    }
                    // console.log("arr[j]: ",arr);
                }
            }
        }
        else {
            await browser.wait(this.EC.visibilityOf($$(this.selectors.popUpMsgLocator).first()), 10000);
            let msgLocator = await $$(this.selectors.popUpMsgLocator);
            for (let i: number = 0; i < msgLocator.length; i++) {
                arr[i] = await msgLocator[i].getText();
            }
        }
        await browser.waitForAngularEnabled(true);
        return arr;
    }

    async setCKEditor(description: string, guid?: string): Promise<void> {
        let ckEditorLocator = this.selectors.ckEditor;
        let ckEditorTextAreaLocator = this.selectors.ckEditorTextArea;
        if (guid) {
            ckEditorLocator = `[rx-view-component-id="${guid}"] ${this.selectors.ckEditor}`;
            ckEditorTextAreaLocator = `[rx-view-component-id="${guid}"] ${this.selectors.ckEditorTextArea}`;
        }
        await $(ckEditorLocator).isPresent().then(async (result) => {
            if (result) {
                await browser.wait(this.EC.elementToBeClickable($(ckEditorTextAreaLocator)), 3000).then(async () => {
                    await $(ckEditorTextAreaLocator).clear();
                    await $(ckEditorTextAreaLocator).sendKeys(description);
                });
            }
        });
    }

    async updateCKEditor(description: string, guid?: string): Promise<void> {
        let ckEditorLocator = this.selectors.ckEditor;
        let ckEditorTextAreaLocator = this.selectors.ckEditorTextArea;
        if (guid) {
            ckEditorLocator = `[rx-view-component-id="${guid}"] ${this.selectors.ckEditor}`;
            ckEditorTextAreaLocator = `[rx-view-component-id="${guid}"] ${this.selectors.ckEditorTextArea}`;
        }
        await $(ckEditorLocator).isPresent().then(async (result) => {
            if (result) {
                await browser.wait(this.EC.elementToBeClickable($(ckEditorTextAreaLocator)), 3000).then(async () => {
                    await $(ckEditorTextAreaLocator).sendKeys(description);
                });
            }
        });
    }

    async getCKEditorText(guid?: string): Promise<string> {
        let ckEditorLocator = this.selectors.ckEditor;
        let ckEditorTextAreaLocator = this.selectors.ckEditorTextArea;
        if (guid) {
            ckEditorLocator = `[rx-view-component-id="${guid}"] ${this.selectors.ckEditor}`;
            ckEditorTextAreaLocator = `[rx-view-component-id="${guid}"] ${this.selectors.ckEditorTextArea}`;
        }
        return await $(ckEditorLocator).isPresent().then(async (result) => {
            if (result) {
                return await browser.wait(this.EC.visibilityOf($(ckEditorTextAreaLocator)), 3000).then(async () => {
                    return await $(ckEditorTextAreaLocator).getText();
                });
            }
        });
    }

    async closeBladeOnSettings(): Promise<void> {
        await $('body').sendKeys(protractor.Key.ESCAPE);
        await this.clickOnWarningOk();
    }

    async isButtonVisible(buttonName: string): Promise<boolean> {
        return await element(by.cssContainingText('button.d-button', buttonName)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText('button.d-button', buttonName)).isDisplayed();
        })
    }

    async isDropDownOptionsMatches(fieldName:string,dropdownOptions: string[],dropDownSearchValue?:string): Promise<boolean> {
        const dropDown = await $(`[title="${fieldName}"],[aria-label="${fieldName}"]`);        
        let arr: string[] = [];
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        await dropDownBoxElement.click();
        const dropDownInputElement = await dropDown.$(this.selectors.dropDownInput);
        if (dropDownSearchValue) await dropDownInputElement.sendKeys(dropDownSearchValue);
        let drpDwnvalue: number = await $$(this.selectors.dropDownOption).count();
        for (let i = 0; i < drpDwnvalue; i++) {
            let ab: string = await $$(this.selectors.dropDownOption).get(i).getText();
            arr[i] = ab;
        }
        arr = arr.sort();
        dropdownOptions = dropdownOptions.sort();
        return arr.length === dropdownOptions.length && arr.every(
            (value, index) => (value === dropdownOptions[index])
        );
    }

    async getTextFromAfterTag(nameElement:string): Promise<string>{
        let textAfterTag:string = await browser.executeScript('return window.getComputedStyle(arguments[0], ":after").content;', nameElement);
        return textAfterTag;
    }

    async getTextFromAfterTagElement(nameElement: ElementFinder): Promise<string>{
        let textAfterTag:string = await browser.executeScript('return window.getComputedStyle(arguments[0], ":after").content;', nameElement.getWebElement());
        return textAfterTag;
    }
}

export default new Util();