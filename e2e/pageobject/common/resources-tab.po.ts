import { browser, until, ExpectedConditions, element, by, $, $$, ProtractorExpectedConditions, protractor, ElementFinder } from 'protractor';

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
    }



    async clickOnAdvancedSearchOptions(searchArea: string): Promise<void> {
        let advancedSearchButton = await element(by.xpath(`//*[@id='km-group__knowledge-header'][text()='${searchArea}']/following-sibling::div/button`));
        await browser.wait(this.EC.elementToBeClickable(advancedSearchButton));
        await advancedSearchButton.click();
    }

    async enterAdvancedSearchText(searchText: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.advancedSearchInput)));
        await $(this.selectors.advancedSearchInput).clear();
        await $(this.selectors.advancedSearchInput).sendKeys(searchText);
    }

    async clickOnAdvancedSearchSettingsIconToOpen(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.advancedSearchSettingsBtn)));
        await $(this.selectors.advancedSearchSettingsBtn).click();
    }

    async clickOnAdvancedSearchSettingsIconToClose(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.advancedSearchSettingsBtnClose)));
        await $(this.selectors.advancedSearchSettingsBtnClose).click();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.advancedSearchResult)));
    }


    async selectAdvancedSearchFilterOption(searchFilter: string, searchFilterOption: string): Promise<void> {
        const advancedSearchFilterDropDown = await element(by.xpath(`//div[@aria-label='${searchFilter}']`));
        const advancedSearchFilterInput = await element(by.xpath(`//input[@placeholder='${searchFilter}']`));
        const advancedSearchFilterOption = await $('.ui-select-choices-row-inner');
        await browser.wait(this.EC.elementToBeClickable(advancedSearchFilterDropDown));
        await advancedSearchFilterDropDown.click();
        await browser.wait(this.EC.elementToBeClickable(advancedSearchFilterInput));
        await advancedSearchFilterInput.sendKeys(searchFilterOption);
        await browser.wait(this.EC.elementToBeClickable(advancedSearchFilterOption));
        await advancedSearchFilterOption.click();
    }

    async clickOnAdvancedSearchFiltersButton(buttonText: string): Promise<void> {
        const advancedSearchFilterBtn = await element(by.xpath(`//button[text()="${buttonText}"]/preceding-sibling::button`));
        await browser.wait(this.EC.elementToBeClickable(advancedSearchFilterBtn));
        await advancedSearchFilterBtn.click();
    }

    async getAdvancedSearchResult(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.advancedSearchResult)));
        return await $(this.selectors.advancedSearchResult).getText();
    }

}
export default new Resources();