import { $, $$, by, element, protractor, ProtractorExpectedConditions } from 'protractor';

export class Resources {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dropdownBox: '.ui-select-toggle',
        dropDownInput: 'input[type="search"]',
        dropDownOption: '.ui-select-choices-row-inner *',
        popUpMsgLocator: '.rx-growl-item__message',
        warningOk: '.d-modal__footer button[class*="d-button d-button_primary d-button_small"]',
        warningCancel: '.d-modal__footer button[class*="d-button d-button_secondary d-button_small"]',
        closeTipMsg: '.close.rx-growl-close',
        errorMsg: '.rx-growl-item__message',
        advancedSearchInput: 'input.rx-adv-search-textField',
        advancedSearchSettingsBtn: 'button.d-icon-adjust_settings',
        advancedSearchSettingsBtnClose: 'button[ng-hide="showAdvOptions"]',
        advancedSearchResult: '.km-group-list-item__description',
        dropDownChoice: '.ui-select__rx-choice',
        warningMsgText: '.d-modal__content-item',
        configurationOptionsErrorMessage: '.panel-default .panel-heading h4',
        headingName: '.km-group__header span',
        recommendedKnowledgeNo: 'h3[class="km-group__header ng-binding"]:nth-last-child(3) span',
        advanceSearchResultDetails: '.padding-top-4',
        advanceSearchResultId: '.km-group-list-item__title',
        advanceSearchBackButton: '.rx-adv-search-back-btn',
    }

    async clickOnAdvanceSearchBackButton(): Promise<void> {
        await $(this.selectors.advanceSearchBackButton).click();
    }

    async isKnowledgeArticlesEmpty(): Promise<boolean> {
        return await $$('.km-group').get(0).$$('.km-group-list-item_empty').get(0).isPresent();
    }

    async clickOnAdvancedSearchOptions(searchArea: string): Promise<void> {
        let advancedSearchButton = await element(by.xpath(`//*[@id='km-group__knowledge-header'][text()='${searchArea}']/following-sibling::div/button`));
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
        const advancedSearchFilterBtn = await element(by.xpath(`//*[contains(@class,'km-group')]//button[text()="${buttonText}"]`));
        //        await browser.wait(this.EC.elementToBeClickable(advancedSearchFilterBtn));
        await advancedSearchFilterBtn.click();
    }

    async isApplyOrClearButtonButtonEnabled(buttonText: string): Promise<boolean> {
        return await element(by.cssContainingText('.pull-right .d-button_small', buttonText)).isEnabled();
    }
    async getAdvancedSearchResultForParticularSection(headingType: string): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.advancedSearchResult)));
        const searchResult = await element(by.xpath(`//*[text()="${headingType}"]/..//*[contains(@class,"km-group-list-item__description")]`))
        return await searchResult.getText();
    }

    async getCountOfHeading(headerName: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.headingName)));
        let count: string = await $(this.selectors.recommendedKnowledgeNo).getText();
        return await count.substring(1, count.length - 1);
    }

}
export default new Resources();