import { $, $$, by, element, protractor, ProtractorExpectedConditions, ElementFinder } from 'protractor';

export class Resources {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dropDownOption: '.dropdown_select__menu-content .dropdown-item *',
        advancedSearchInput: 'input.adapt-search-field[placeholder="Search"]',
        advancedSearchSettingsBtn: 'span.d-icon-adjust_settings',
        advancedSearchSettingsBtnClose: 'button.opened-advance-search-option',
        advancedSearchResult: 'div.sr-search-result-components .bwf-search-fields__title-text',
        headingName: '.km-group__header span',
        recommendedKnowledgeNo: 'h3[class="km-group__header ng-binding"]:nth-last-child(3) span',
        advancedSearchButton: 'span.d-icon-search',
        backBuuton: 'span.d-icon-angle_left',
    }

    async isKnowledgeArticlesEmpty(): Promise<boolean> {
        return await $$('.km-group').get(0).$$('.km-group-list-item_empty').get(0).isPresent();
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


    async selectAdvancedSearchFilterOption(searchFilter: string, searchFilterOption: string): Promise<void> {
        const advancedSearchFilterDropDown = await element(by.xpath(`//div[@aria-label='${searchFilter}']`));
        const advancedSearchFilterInput = await element(by.xpath(`//input[@placeholder='${searchFilter}']`));
        const advancedSearchFilterOption = await $('.ui-select-choices-row-inner');
        //        await browser.wait(this.EC.elementToBeClickable(advancedSearchFilterDropDown));
        await advancedSearchFilterDropDown.click();
        //        await browser.wait(this.EC.elementToBeClickable(advancedSearchFilterInput));
        await advancedSearchFilterInput.sendKeys(searchFilterOption);
        //        await browser.wait(this.EC.elementToBeClickable(advancedSearchFilterOption));
        await advancedSearchFilterOption.click();
    }

    async isAdvancedSearchFilterOptionDropDownValueDisplayed(dropDownName: string, data: string[]): Promise<boolean> {
        let arr: string[] = [];
        await $(`div.ui-select-container[aria-label='${dropDownName}']`).click();
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
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.advancedSearchResult)));
        const searchResult = await element(by.xpath(`//*[@title="${headingType}"]/..//*[contains(@class,"bwf-search-fields__title-text")]`))
        return await searchResult.getText();
    }

    async getCountOfHeading(headerName: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.headingName)));
        let count: string = await $(this.selectors.recommendedKnowledgeNo).getText();
        return await count.substring(1, count.length - 1);
    }

}
export default new Resources();