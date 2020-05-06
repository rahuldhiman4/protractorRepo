import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from 'protractor';

export class Resources {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dropDownOption: '.dropdown_select__menu-content .dropdown-item *',
        advancedSearchInput: 'input.adapt-search-field[placeholder="Search"]',
        advancedSearchSettingsBtn: 'span.d-icon-adjust_settings',
        advancedSearchSettingsBtnClose: 'button.opened-advance-search-option',
        advancedSearchResult: 'div.sr-search-result-components .bwf-search-fields__title-text',
        headingName: '.km-group__header span',
        smartSearchResult: 'bwf-smart-recorder-results h1',
        advancedSearchButton: 'span.d-icon-search',
        backButton: 'span.d-icon-angle_left',
    }

    async isSearchRecordEmpty(recordNumber: number): Promise<boolean> {
        return await $$('.bwf-search-result p').get(recordNumber - 1).isPresent();
    }

    async clickOnAdvancedSearchOptions(searchArea: string): Promise<void> {
        let advancedSearchButton = await $('span.d-icon-search');
        //        await browser.wait(this.EC.elementToBeClickable(advancedSearchButton));
        await advancedSearchButton.click();
    }

    async enterAdvancedSearchText(searchText: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.advancedSearchInput)));
        await $(this.selectors.advancedSearchInput).clear();
        await $(this.selectors.advancedSearchInput).sendKeys(searchText);
    }

    async searchTextAndEnter(searchText: string): Promise<void> {
        await $(this.selectors.advancedSearchInput).clear();
        await $(this.selectors.advancedSearchInput).sendKeys(searchText + protractor.Key.ENTER);
    }

    async clickOnAdvancedSearchSettingsIconToOpen(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.advancedSearchSettingsBtn)));
        await $(this.selectors.advancedSearchSettingsBtn).click();
    }

    async clickOnAdvancedSearchSettingsIconToClose(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.advancedSearchSettingsBtnClose)));
        await $(this.selectors.advancedSearchSettingsBtnClose).click();
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.advancedSearchResult)));
    }


    async selectAdvancedSearchFilterOption(dropDownLabel: string, dropDownValue: string): Promise<void> {
        await browser.wait(this.EC.presenceOf($$('.dropdown.dropdown_select').last()), 5000);
        const dropDown: ElementFinder[] = await $$('.dropdown.dropdown_select');
        for (let i: number = 0; i < dropDown.length; i++) {
            let dropDownLabelText: string = await dropDown[i].$('.form-control-label').getText();
            if (dropDownLabelText === dropDownLabel) {
                await dropDown[i].$('button').click();
                await dropDown[i].$('input').sendKeys(dropDownValue);
                await element(by.cssContainingText('[role="option"] span', dropDownValue)).click();
            }
        }
    }

    async isAdvancedSearchFilterOptionDropDownValueDisplayed(data: string[], dropDownNumber: number): Promise<boolean> {
        let arr: string[] = [];
        await $$('.advance-search button.dropdown-toggle').get(dropDownNumber).click();
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

    async clickOnAdvancedSearchFiltersButton(buttonText: string): Promise<void> {
        const advancedSearchFilterBtn = await element(by.xpath(`//*[contains(@class,'justify-content-end')]//button[contains(text(),"${buttonText}")]`));
        //        await browser.wait(this.EC.elementToBeClickable(advancedSearchFilterBtn));
        await advancedSearchFilterBtn.click();
    }

    async isApplyOrClearButtonButtonEnabled(buttonText: string): Promise<boolean> {
        return await element(by.cssContainingText('.pull-right .d-button_small', buttonText)).isEnabled();
    }
    async getAdvancedSearchResultForParticularSection(headingType: string): Promise<string> {
        //await browser.wait(this.EC.elementToBeClickable($(this.selectors.advancedSearchResult)));
        const searchResult = await element(by.xpath(`//*[contains(@title,"${headingType}")]/..//*[contains(@class,"bwf-search-fields__title-text")]`))
        return await searchResult.getText();
    }

    async getCountOfHeading(headerName: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.headingName)));
        let smartRecorderResults: ElementFinder[] = await $$(this.selectors.smartSearchResult);
        for (let i: number = 0; i < smartRecorderResults.length; i++) {
            if ((await smartRecorderResults[i].getText()).includes(headerName)) {
                let count: string = await smartRecorderResults[i].$('span').getText();
                return count.substring(1, count.length - 1);
            }
        }
    }
}

export default new Resources();