import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions, ElementFinder } from 'protractor';

const fs = require('fs');


export class Utility {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dropdownBox: '.dropdown-toggle',
        dropDownInput: 'input.form-control',
        dropDownNoneOpt: '.dropdown-item span',
        dropDownOption: '.dropdown_select__menu-content button',
        dialogMessageTitle: '.modal-content .modal-title, .modal-content .d-modal__title',
        dialogMessageText: '.modal-content .modal-body, .modal-content .d-modal__content-item',
        popUpMsgLocator: '.a-toast__details div',
        popupMsgTitle: '.a-toast__summary',
        closeTipMsg: '.a-toast__close-button',
        dropDownChoice: '.dropdown-item',
        dateFieldPicker: 'input.i-date-time',
        yearDate: 'div.a3t-calendar--controls-line[aria-label="Choose year"]',
        monthDate: 'div.a3t-calendar--controls-line[aria-label="Choose month"]',
        rightNavigation: 'button:nth-of-type(2)',
        leftNavigation: 'button:nth-of-type(1)',
        calendarDays: '.a3t-calendar--table tr td.a3t-calendar--table-day[aria-disabled="false"]',
        selectTimeArrow: '.a3t-datetime--time-picker-summary-toggle',
        activeMeridiemClock: '.a3t-clock--control-item[class*=active]',
        meridiemClock: '.a3t-clock--control-item',
        okDateTimePicker: '.btn-primary',
        clearDateTimePicker: '.btn-secondary',
        ckEditor: 'bwf-rich-text-editor[style="display: block;"], .activity-feed-note-text-container,.doc-editor',
        ckEditorTextArea: '.cke_enable_context_menu',
    }

    async selectDropDown(guid: string, value: string): Promise<void> {
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        const dropDownInputElement: ElementFinder = await dropDown.$(this.selectors.dropDownInput);
        await dropDownBoxElement.click();
        let isSearchPresent: boolean = await dropDownInputElement.isPresent();
        if (isSearchPresent) await dropDownInputElement.sendKeys(value);

        let optionCss: string = `[rx-view-component-id="${guid}"] .dropdown_select__menu-content button`;
        let option = await element(by.cssContainingText(optionCss, value));
        await browser.wait(this.EC.elementToBeClickable(option), 3000).then(async function () {
            await option.click();
        });
    }

    async selectDropDown2(dropDownElementFinder: ElementFinder, value: string): Promise<void> {
        await dropDownElementFinder.click();
        let option = await element(by.cssContainingText(this.selectors.dropDownChoice, value));
        await option.click();
    }

    async clearDropDown(guid: string,optionValue:string): Promise<void> {
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        const dropDownSelectNoneItem = await dropDown.element(by.cssContainingText(this.selectors.dropDownNoneOpt, `${optionValue}`));
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

    async isAllDropDownValuesMatches(guid: string, data: string[]): Promise<boolean> {
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

    async isAllDropDownValuesMatchesWithElement(element: ElementFinder, data: string[]): Promise<boolean> {
        let arr: string[] = [];
        await element.click();
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

    async isPopUpMessagePresent(expectedMsg: string, actualNumberOfPopups?: number): Promise<boolean> {
        let arr: string[] = await this.getAllPopupMsg(actualNumberOfPopups);
        return arr.includes(expectedMsg);
    }

    async waitUntilPopUpDisappear(): Promise<void> {
        await browser.wait(this.EC.invisibilityOf($(this.selectors.popUpMsgLocator)), 10000);
    }

    async closePopUpMessage(): Promise<void> {
        await $$(this.selectors.closeTipMsg).then(async function (popups) {
            for (let i = 0; i < popups.length; i++) {
                await popups[i].click();
            }
        }).catch(async () => {
            await this.waitUntilPopUpDisappear();
            console.log('Popup is already closed');
        });
    }

    async selectToggleButton(guid: string, value: boolean): Promise<void> {
        const togglebutton = await $(`[rx-view-component-id="${guid}"]`);
        if (value) {
            let element = await togglebutton.$('button[rx-id="true-button"]')
            let isclicked = await element.getAttribute('aria-pressed');
            if (isclicked == 'false') {
                await element.click();
            }
        }
        else {
            let element = await togglebutton.$('button[rx-id="false-button"]')
            let isclicked = await element.getAttribute('aria-pressed');
            if (isclicked == 'false') {
                await element.click();
            }
        }
    }

    async switchToNewTab(tabNum: number): Promise<void> {
        await browser.sleep(2000);
        await browser.getAllWindowHandles().then(async function (handles) {
            await browser.switchTo().window(handles[tabNum]);
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

    async getSelectedFieldValue(guid: string): Promise<string> {
        return await $(`[rx-view-component-id="${guid}"] button`).getText()
    }

    async isFieldLabelDisplayed(guid: string, fieldName: string): Promise<boolean> {
        let fieldLabel = `[rx-view-component-id='${guid}'] rx-read-only-field label, [rx-view-component-id='${guid}'] label.d-textfield__label span, [rx-view-component-id='${guid}'] bwf-read-only-field label, [rx-view-component-id='${guid}'] adapt-select .form-control-label span`;
        return await element(by.cssContainingText(fieldLabel, fieldName)).isPresent().then(async (result) => {
            if (result) {
                return await element(by.cssContainingText(fieldLabel, fieldName)).getText() == fieldName ? true : false;
            } else {
                console.log(fieldName, " not present");
                return false;
            }
        });
    }

    async isRequiredAttributePresent(locator: any): Promise<boolean> {
        return (await $(locator).getAttribute("required")) == 'required';
    }

    async isRequiredTagToField(guid: string): Promise<boolean> {
        let isRequired: boolean = await $(`[rx-view-component-id="${guid}"] .form-control-required`).isPresent();
        if (!isRequired) {
            let nameElement = await $(`[rx-view-component-id="${guid}"] .form-control-label`);
        let value: string = await browser.executeScript('return window.getComputedStyle(arguments[0], ":after").content;', nameElement);
            isRequired = value.trim().substring(3, value.length - 2) === 'required';
        }
        return isRequired;
    }

    async isRequiredTagToFieldElement(nameElement: ElementFinder): Promise<boolean> {
        return await nameElement.isPresent().then(async (result) => {
            if (result) {
                let value: string = await browser.executeScript('return window.getComputedStyle(arguments[0], ":after").content;', nameElement);
                return value.trim().substring(3, value.length - 2) === 'required';
            } else return false;
        });
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

    async setDateField(guid: string, dateValue: string): Promise<void> {
        //expects dateValue as format 04-01-2023 06:11 PM  -  DD-MM-YYYY HH:MM PM/AM
        if (dateValue.includes(":") && dateValue.includes("-")) { // validates correct date format

            let currentDate = new Date();
            let currentMonth = currentDate.getMonth() + 1;      //incrementing 1 because getmonth() function returns 0 for jan and 11 for dec
            let arr = dateValue.split(" ");
            let date = arr[0].split("-");
            let time = arr[1].split(":");
            let meridiem = arr[2];
            let day: number = +date[0];
            let month: number = +date[1];
            let year: number = +date[2];
            let hour: number = +time[0];
            let minutes: number = +time[1];
            let yearDifference = year - currentDate.getFullYear();
            let monthDifference = month - currentMonth;
            let dateFieldGuid = await $(`[rx-view-component-id='${guid}']`);
            let dateFieldElement = await dateFieldGuid.$(this.selectors.dateFieldPicker);
            await dateFieldElement.click();
            if (yearDifference > 0) {
                for (let i = 0; i < yearDifference; i++) {
                    await dateFieldGuid.$(this.selectors.yearDate).$(this.selectors.rightNavigation).click();
                }
            }
            else if (yearDifference < 0) {
                for (let i = 0; i < (currentDate.getFullYear() - year); i++) {
                    await dateFieldGuid.$(this.selectors.yearDate).$(this.selectors.leftNavigation).click();
                }
            }

            if (monthDifference > 0) {
                for (let i = 0; i < monthDifference; i++) {
                    await dateFieldGuid.$(this.selectors.monthDate).$(this.selectors.rightNavigation).click();
                }
            }
            else if (monthDifference < 0) {
                for (let i = 0; i < (currentMonth - month); i++) {
                    await dateFieldGuid.$(this.selectors.monthDate).$(this.selectors.leftNavigation).click();
                }
            }

            await browser.sleep(2000);
            let numberOfDays = await dateFieldGuid.$$(this.selectors.calendarDays).count();
            let dayToCompare: string = day + ", " + year;
            for (let i = 0; i < numberOfDays; i++) {
                let activeDayElement: string = await dateFieldGuid.$$(this.selectors.calendarDays).get(i).getAttribute('aria-label');
                if (activeDayElement.search(dayToCompare) != -1) {
                    await dateFieldGuid.$$(this.selectors.calendarDays).get(i).click();
                    break;
                }
            }

            await dateFieldGuid.$(this.selectors.selectTimeArrow).click();
            let degrees = hour * 30;
            await dateFieldGuid.$(`.a3t-clock--tick-label[style="transform: rotate(-${degrees}deg);"]`).click();
            degrees = minutes * 6;
            await dateFieldGuid.$(`.a3t-clock--tick-label[style="transform: rotate(-${degrees}deg);"]`).click();
            let isActive = false;
            let activeCounter = await dateFieldGuid.$$(this.selectors.activeMeridiemClock).count();
            for (let i = 0; i < activeCounter; i++) {
                if (await dateFieldGuid.$$(this.selectors.activeMeridiemClock).get(i).getText() == meridiem) {
                    isActive = true;
                    break;
                }
            }

            if (isActive == false) {
                let counter = await dateFieldGuid.$$(this.selectors.meridiemClock).count();
                for (let i = 0; i < counter; i++) {
                    if (await dateFieldGuid.$$(this.selectors.meridiemClock).get(i).getText() == meridiem) {
                        await dateFieldGuid.$$(this.selectors.meridiemClock).get(i).click();
                    }
                }
            }
            await dateFieldGuid.$(this.selectors.okDateTimePicker).click();
        }
    }

    async getDialoguePopupMessage(): Promise<string> {
        return await $(this.selectors.dialogMessageText).getText();
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
            await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)), 10000);
            arr[0] = await $$(this.selectors.popUpMsgLocator).first().getText();
        }
        await browser.waitForAngularEnabled(true);
        return arr;
    }

    async refresh(): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.navigate().refresh();
        await browser.switchTo().alert().then((alert) => {
            alert.accept();
        }, () => { });
        await browser.waitForAngularEnabled(true);
    }

    async acceptOrRejectBrowserPopup(accept: boolean): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().alert().then((alert) => {
            if (accept) alert.accept();
            else alert.dismiss();
        }, () => { });
        await browser.waitForAngularEnabled(true);
    }

    async clickOnApplicationWarningYesNoButton(buttonName: string): Promise<void> {
        await $('rx-modal').isPresent().then(async (result) => {
            if (result) await element(by.cssContainingText('.modal-footer adapt-button', buttonName)).click();
        });
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

    async getOldDate(noOfDays: number): Promise<Date> {
        let d: Date = new Date();
        d.setDate(d.getDate() - noOfDays);
        return d;
    }

    async closeAllBlades(): Promise<void> {
        await $('body').sendKeys(protractor.Key.ESCAPE);
        await $('.modal-title').isPresent().then(async (result) => {
            if (result) await this.clickOnApplicationWarningYesNoButton("Yes");
        });
        for (let i: number = 0; i < 2; i++) {
            await $('body').sendKeys(protractor.Key.ESCAPE);
        }
    }
}

export default new Utility();