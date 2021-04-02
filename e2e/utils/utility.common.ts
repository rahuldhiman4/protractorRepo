import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from 'protractor';
import { DropDownType } from './constants';

const fs = require('fs');

export class Utility {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dropdownBox: '.dropdown-toggle',
        dropDownNoneOpt: '.px-3 i',
        dropDownOption: '.dropdown-item',
        dialogMessageTitle: '.modal-content .modal-title, .modal-content .d-modal__title',
        dialogMessageText: '.modal-content .modal-body, .modal-content .d-modal__content-item',
        popUpMsgLocator: '.a-toast__details div',
        popupMsgTitle: '.a-toast__summary',
        closeTipMsg: '.a-toast__close-button',
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
        fieldParentLocator: '[rx-configuration="configuration"] .d-textfield',
        closedWarningTab: '.btn-cross',
        warningText: '.modal-content p',
        warningWindowCloseBtn: '.modal-content button',
        buttonText: 'button[adapt-button] span, button[adapt-button]',
        warningDialog: '.modal-content',
        warningMsgText: '.modal-title',
        warningDialogMsg: '.modal-content .modal-body span',
        backButton: 'button.d-icon-left-undo'
    }

    async selectDropDown(dropDownIdentifier: string | ElementFinder, dropDownValue: string, inputType?: DropDownType): Promise<void> {
        switch (inputType) {
            case DropDownType.WebElement: {
                if (!(typeof dropDownIdentifier === 'string')) {
                    await dropDownIdentifier.click();
                    let option = await element(by.cssContainingText(this.selectors.dropDownOption, dropDownValue));
                    try {
                        await this.scrollToElement(option);
                        await option.click();
                    } catch (ex) {
                        console.log(`Dropdown option not present: ${dropDownValue}`, ex);
                        await dropDownIdentifier.click();
                    }
                }
                break;
            }
            case DropDownType.Label: {
                await browser.wait(this.EC.or(async () => {
                    let count = await $$('adapt-rx-select').count();
                    return count >= 1;
                }), 3000);
                const dropDown: ElementFinder[] = await $$('adapt-rx-select');
                for (let i: number = 0; i < dropDown.length; i++) {
                    await dropDown[i].$('.form-control-label').isPresent().then(async (result) => {
                        if (result) {
                            let dropDownLabelText: string = await dropDown[i].$('.form-control-label').getText();
                            if (dropDownLabelText === dropDownIdentifier) {
                                await dropDown[i].$('button').click();
                                await dropDown[i].$('input').sendKeys(dropDownValue);
                                try {
                                    await element(by.cssContainingText('[role="option"] div', dropDownValue)).click();
                                } catch (ex) {
                                    console.log(`Dropdown option not present: ${dropDownValue}`, ex);
                                    await dropDown[i].$('button').click();
                                }
                            }
                        }
                    });
                }
                break;
            }
            case DropDownType.Name: {
                await browser.wait(this.EC.or(async () => {
                    let count = await $$('.rx-assignment-select').count();
                    return count >= 1;
                }), 3000);
                const dropDown: ElementFinder[] = await $$('.rx-assignment-select');
                for (let i: number = 0; i < dropDown.length; i++) {
                    await dropDown[i].$('.rx-assignment-select-label').isPresent().then(async (result) => {
                        if (result) {
                            let dropDownLabelText: string = await dropDown[i].$('.rx-assignment-select-label').getText();
                            if (dropDownLabelText === dropDownIdentifier) {
                                await dropDown[i].$('.d-icon-angle_down').click();
                                await dropDown[i].$('input').sendKeys(dropDownValue);
                                try {
                                    await element(by.cssContainingText("li[ng-repeat*='option']", dropDownValue)).isPresent().then(async () => {
                                        await browser.sleep(1000); // Wait For Drop Down Values Are Loaded And Ready To Select Value.
                                        await element(by.cssContainingText(".is-open li[ng-repeat*='option']", dropDownValue)).click();
                                    });
                                } catch (ex) {
                                    console.log(`Dropdown option not present: ${dropDownValue}`, ex);
                                    await dropDown[i].$('.d-icon-angle_down').click();
                                }
                            }
                        }
                    });
                }
            }
            default: {
                const dropDown = await $(`[rx-view-component-id="${dropDownIdentifier}"]`);
                const dropDownInputElement: ElementFinder = await dropDown.$('input');
                //await this.scrollToElement(await dropDown.$(this.selectors.dropdownBox)); //required to bring dropdown search in focus
                await dropDown.$(this.selectors.dropdownBox).click();
                console.log(`Selecting dropdown value: ${dropDownValue}`);
                let isSearchPresent: boolean = await dropDownInputElement.isPresent();
                if (isSearchPresent) await dropDownInputElement.sendKeys(dropDownValue);
                // to click on "Load More"
                // await dropDown.$('.adapt-build-in-loader').isPresent().then(async (isLoadMore: boolean) => {
                //     if (isLoadMore) await dropDown.$('.adapt-build-in-loader').click();
                // });
                let optionCss: string = `[rx-view-component-id="${dropDownIdentifier}"] .dropdown-item`;
                let option = await element(by.cssContainingText(optionCss, dropDownValue));
                try {
                    await browser.wait(this.EC.elementToBeClickable(option), 3000).then(async () => {
                        await option.click();
                    });
                } catch (ex) {
                    console.log(`Dropdown option not present: ${dropDownValue}`, ex);
                    await dropDown.$(this.selectors.dropdownBox).click();
                }
                break;
            }
        }
    }

    async getWarningTextOfLineOfBuisness(): Promise<string> {
        return await $(this.selectors.warningText).getText();
    }

    async closedWarningTextOfLineOfBuisness(): Promise<void> {
        await $(this.selectors.warningWindowCloseBtn).isPresent().then(async (result) => {
            if (result) {
                await $(this.selectors.warningWindowCloseBtn).click();
            } else {
                console.log("Closed window not present");
            }
        });
    }

    async clearDropDown(guid: string, optionValue: string): Promise<void> {
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        const dropDownSelectNoneItem = await dropDown.element(by.cssContainingText(this.selectors.dropDownNoneOpt, `${optionValue}`));
        await dropDownBoxElement.click();
        await dropDownSelectNoneItem.click();
        await dropDownBoxElement.click();
    }

    async isValuePresentInDropDown(guid: string | ElementFinder, value: string): Promise<boolean> {
        let count: number;
        if (typeof guid === 'string') {
            const dropDown = await $(`[rx-view-component-id="${guid}"]`);
            const dropDownInputElement: ElementFinder = await dropDown.$('input');
            //await this.scrollToElement(await dropDown.$(this.selectors.dropdownBox)); //required to bring dropdown search in focus
            await dropDown.$(this.selectors.dropdownBox).click();
            console.log(`Finding dropdown value: ${value}`);
            let isSearchPresent: boolean = await dropDownInputElement.isPresent();
            if (isSearchPresent) await dropDownInputElement.sendKeys(value);
            let optionCss: string = `[rx-view-component-id="${guid}"] .dropdown-item`;
            count = await dropDown.$$(optionCss).count();
            await dropDown.$(this.selectors.dropdownBox).click();
        } else {
            await guid.click();
            await $$('input').last().sendKeys(value);
            count = await $$(this.selectors.dropDownOption).count();
            try { await guid.click() }
            catch(ex) { await $('body').sendKeys(protractor.Key.ESCAPE); }
        }
        if (count >= 1) { return true; } else { return false; }
    }

    async isAllDropDownValuesMatches(dropDownIdentifier: string | ElementFinder, dropDownValueArr: string[], inputType?: DropDownType, dropDownSearchValue?: string): Promise<boolean> {
        let arr: string[] = await this.getAllDropDownValues(dropDownIdentifier, inputType, dropDownSearchValue);
        arr.sort();
        dropDownValueArr = dropDownValueArr.sort();
        return arr.length === dropDownValueArr.length && arr.every(
            (value, index) => (value === dropDownValueArr[index])
        );
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
        await browser.sleep(2000); // Wait For immediate getWindowHandles don't capture all the windows for few cases - it was taking time for few cases.
        await browser.getAllWindowHandles().then(async function (handles) {
            await browser.switchTo().window(handles[tabNum]);
        });
    }

    async switchToDefaultWindowClosingOtherTabs(): Promise<void> {
        await browser.sleep(2000); // Wait For immediate getWindowHandles don't capture all the windows for few cases - it was taking time for few cases.
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

    //unable to identify values on task template screen    
    async isFieldLabelDisplayed(guid: string, fieldName: string): Promise<boolean> {
        let fieldLabel = `[rx-view-component-id='${guid}'] rx-read-only-field label, [rx-view-component-id='${guid}'] label.d-textfield__label span,[rx-view-component-id='${guid}'] bwf-read-only-field label, [rx-view-component-id='${guid}'] .form-control-label span`;
        return await element(by.cssContainingText(fieldLabel, fieldName)).isPresent().then(async (result) => {
            if (result) {
                return await element(by.cssContainingText(fieldLabel, fieldName)).getText() == fieldName ? true : false;
            } else {
                let fieldLabel2 = `.clearfix label, [rx-view-component-id='${guid}'] label, .saved-advanced-filters-header, .form-control-label, [rx-view-component-id='${guid}'] span span, [rx-view-component-id='${guid}'] label span`;
                return await element(by.cssContainingText(fieldLabel2, fieldName)).getText() == fieldName ? true : false;
            }
        });

    }

    async isRequiredAttributePresent(locator: any): Promise<boolean> {
        return (await $(locator).getAttribute("required")) == 'required';
    }

    async isRequiredTagToField(guid: string): Promise<boolean> {
        let isRequired: boolean = await $(`[rx-view-component-id="${guid}"] .form-control-required`).isPresent() || await $(`[rx-view-component-id="${guid}"] .d-textfield_required`).isPresent();
        if (!isRequired) {
            let nameElement = `[rx-view-component-id="${guid}"] .form-control-label`;
            return await element(by.css(nameElement)).isPresent().then(async (result) => {
                if (result) {
                    let value: string = await this.getTextFromAfterTag($(nameElement));
                    return value.trim().substring(3, value.length - 2) === 'required';
                } else return false;
            });
        }
        return isRequired;
    }

    /*
      identifier should be guid or locator of element
      if required tag is present as text in dom, pass guid
      and if required tag is present is hidden from dom, pass Locator
    */
    async isRequiredTagPresent(identifier: string | ElementFinder, type?: string): Promise<boolean> {
        let isRequired: boolean = false;
        if (typeof identifier === 'string') {
            isRequired = await $(`[rx-view-component-id="${identifier}"] .form-control-required`).isPresent();
            let nameElement = `[rx-view-component-id="${identifier}"] adapt-rx-control-label .form-control-required`;
            isRequired = await $(nameElement).isPresent().then(async (result) => {
                if (result) {
                    let value = await $(nameElement).getText();
                    return value.includes('required');
                } else return false;
            });
        }
        else {
            if (type) {                             //taking Element as parameter need to get text from Element
                let nameElement = identifier;
                isRequired = await nameElement.isPresent().then(async (result) => {
                    if (result) {
                        let value = await nameElement.getText();
                        return value.includes('required');
                    } else return false;
                });
            }
            else {
                let nameElement = identifier;
                if (await nameElement.isPresent()) {                                  //taking Element as parameter and getting required text from inner attribute
                    let value: string = await this.getTextFromAfterTag(nameElement);
                    isRequired = value.includes('required');
                }
                else return false;
            }
        }
        return isRequired;
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
        await browser.sleep(5000); // Wait For File Gets Download. 
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

    async setDateField(dateValue: string, guid?: string): Promise<void> {
        let guidId: string = "";
        if (guid) {
            guidId = `[rx-view-component-id="${guid}"] `;
        }
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
            let dateFieldGuid = await $(guidId + this.selectors.dateFieldPicker);
            await dateFieldGuid.click();
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

            await browser.sleep(2000); // When it clicks right and left navigation on clock, It was taking time to load elements
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
            await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)), 5000).then(async () => {
                arr[i] = await $$(this.selectors.popUpMsgLocator).first().getText();
            });
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
            let msgLocator = await $$(this.selectors.popUpMsgLocator);
            for (let i: number = 0; i < msgLocator.length; i++) {
                arr[i] = await msgLocator[i].getText();
            }
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
            if (result) await element(by.cssContainingText('.modal-footer button', buttonName)).click();
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

    async scrollToElement(element: ElementFinder): Promise<void> {
        await browser.actions().mouseMove(element.getWebElement()).perform();
    }

    async getFieldValue(fieldName: string): Promise<string> {
        let fieldValue: string = undefined;
        for (let i = 0; i < (await $$(this.selectors.fieldParentLocator)).length; i++) {
            let fieldLabelLocator = await $$(this.selectors.fieldParentLocator).get(i).$('label .d-textfield__item');
            if (await fieldLabelLocator.getText() == fieldName) {
                fieldValue = (await $$(this.selectors.fieldParentLocator).get(i).$('p').getText()).trim();
                break;
            }
        }
        return fieldValue;
    }

    async getTextFromAfterTag(nameElement: ElementFinder): Promise<string> {
        let textAfterTag: string = await browser.executeScript('return window.getComputedStyle(arguments[0], ":after").content;', nameElement.getWebElement());
        return textAfterTag;
    }

    async isButtonVisible(buttonName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.buttonText, buttonName)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.buttonText, buttonName)).isDisplayed();
        })
    }

    async switchSlider(guid: string, value: boolean): Promise<void> {
        let slider = `[rx-view-component-id="${guid}"] adapt-switcher input`
        let isSliderSelected = await $(slider).getAttribute('aria-checked') == 'true';
        if (value && isSliderSelected) console.log('Field is already selected as true');
        else if ((value && !isSliderSelected) || (!value && isSliderSelected)) await $(slider).click();
        if (!value && !isSliderSelected) console.log('Field is already selected as false');
    }

    async isWarningDialogBoxDisplayed(): Promise<boolean> {
        return await $(this.selectors.warningDialog).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.warningDialog).isDisplayed();
            else return false;
        });
    }

    async getWarningDialogTitle(): Promise<string> {
        return await $(this.selectors.warningMsgText).getText();
    }

    async getWarningDialogMsg(): Promise<string> {
        return await $(this.selectors.warningDialogMsg).getText();
    }

    async getSelectedDropdownFiledValue(dropDownLabel: string): Promise<string> {
        let dropdownValue: string = undefined;
        await browser.wait(this.EC.or(async () => {
            let count = await $$('.dropdown.dropdown_select').count();
            return count >= 1;
        }), 3000);
        const dropDown: ElementFinder[] = await $$('.dropdown.dropdown_select');
        for (let i: number = 0; i < dropDown.length; i++) {
            await dropDown[i].$('.form-control-label').isPresent().then(async (result) => {
                if (result) {
                    let dropDownLabelText: string = await dropDown[i].$('.form-control-label').getText();
                    if (dropDownLabelText === dropDownLabel) {
                        dropdownValue = await dropDown[i].$('button').getText();
                    }
                }
            });
        }
        return dropdownValue;
    }

    async selectNthDropDown(guid: string, value: string, n: number): Promise<void> {
        const dropDown = await $(`[rx-view-component-id="${guid}"]`);
        const dropDownInputElement = await dropDown.$('input');
        await dropDown.$(this.selectors.dropdownBox).click();
        await dropDownInputElement.sendKeys(value);
        let optionCss: string = `[rx-view-component-id="${guid}"] .ui-select-choices-row-inner *`;
        let option = await element.all(by.cssContainingText(optionCss, value)).get(n - 1);
        await browser.wait(this.EC.elementToBeClickable(option), 3000).then(async function () {
            await element.all(by.cssContainingText(optionCss, value)).get(n - 1).click();
        });
    }

    async getAllDropDownValues(dropDownIdentifier: string | ElementFinder, inputType?: DropDownType, dropDownSearchValue?: string): Promise<string[]> {
        let drpDwnvalue: number = 0;
        let arr: string[] = [];
        switch (inputType) {
            case DropDownType.WebElement: {
                if (!(typeof dropDownIdentifier === 'string')) {
                    await dropDownIdentifier.click();
                    drpDwnvalue = await $$(this.selectors.dropDownOption).count();
                    for (let i = 0; i < drpDwnvalue; i++) {
                        let ab: string = await $$(this.selectors.dropDownOption).get(i).getText();
                        arr[i] = ab;
                    }
                    await dropDownIdentifier.click();
                }
                break;
            }
            case DropDownType.Label: {
                const dropDown = await $(`[title="${dropDownIdentifier}"],[aria-label="${dropDownIdentifier}"]`);
                const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
                await dropDownBoxElement.click();
                const dropDownInputElement = await dropDown.$('input');
                if (dropDownSearchValue) await dropDownInputElement.sendKeys(dropDownSearchValue);
                drpDwnvalue = await $$(this.selectors.dropDownOption).count(); // drpDwnvalue = await $$('.ui-select-choices-row-inner *').count();
                for (let i = 0; i < drpDwnvalue; i++) {
                    let ab: string = await $$(this.selectors.dropDownOption).get(i).getText();
                    arr[i] = ab;
                }
                await dropDownBoxElement.click();
                break;
            }
            default: {
                const dropDown = await $(`[rx-view-component-id="${dropDownIdentifier}"]`);
                const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
                await dropDownBoxElement.click();
                drpDwnvalue = await $$(this.selectors.dropDownOption).count();
                for (let i = 0; i < drpDwnvalue; i++) {
                    let ab: string = await $$(this.selectors.dropDownOption).get(i).getText();
                    arr[i] = ab;
                }
                await dropDownBoxElement.click();
                break;
            }
        }
        return arr;
    }

    // for process popup component
    async searchAndSelectProcessInSelectProcessPopup(processName: string): Promise<void> {
        await $('.dropdown-menu [rx-id="search-button"]').click();
        await $('.dropdown-menu adapt-rx-textfield input').sendKeys(processName);
        await $(`[title*="${processName}"]`).click();
    }

    // for process popup component
    async isProcessPresentInSelectProcessPopup(processName: string): Promise<boolean> {
        await $('.dropdown-menu [rx-id="search-button"]').click();
        await $('.dropdown-menu adapt-rx-textfield input').sendKeys(processName);
        let values = await $$('.dropdown-menu button.dropdown-item').count();
        if (values >= 1) return true;
        else return false;
    }

    async selectMultiSelectDropDownValues(dropdownName: string, dropdownValue: string[]) {
        let dropdown = 'rx-select-with-pagination';
        let dropdownItem = 'button.dropdown-item';
        let dropdownCount = await $$(dropdown).count();
        for (let i = 0; i < dropdownCount; i++) {
            let name = await $$(dropdown).get(i).$('.form-control-label span').getText();
            if (name === dropdownName) {
                for (let j = 0; j < dropdownValue.length; j++) {
                    await $$(dropdown).get(i).$('button.dropdown-toggle').click();
                    await $$(dropdown).get(i).$('.adapt-rx-search__input-wrapper input').sendKeys(dropdownValue[j]);
                    await browser.sleep(3000);
                    let drpDwnvalue = await $$(dropdownItem).count();
                    for (let k = 0; k < drpDwnvalue; k++) {
                        let value: string = await $$(dropdownItem).get(k).$('.rx-select__option-content').getText();
                        if (value.includes(dropdownValue[j])) {
                            console.log('Element found for ', dropdownValue[j]);
                            await $$(dropdownItem).get(k).click();
                            await $$(dropdown).get(i).click();
                            break;
                        }
                    }
                }
            }
        }
    }
}

export default new Utility();