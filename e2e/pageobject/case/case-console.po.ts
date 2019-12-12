import { $, $$, browser, Key, protractor, ProtractorExpectedConditions } from "protractor";

class CaseConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        searchCase: '[rx-id="search-text-input"]',
        recommendedCaseLink: '.ui-grid__link',
        recommendedCaseCheckBox: '.ui-grid-icon-ok',
        filter: '.rx-search-filter__trigger',
        availableFilterDrpDown: '.d-accordion__title',
        applyFilter: '.rx-search-filter-heading__apply',
        removeFilter: '..d-tag-remove-button',
        tableValue: '.ui-grid-cell-contents',
    }

    async setCaseSearchBoxValue(input: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchCase)));
        await $(this.selectors.searchCase).clear();
        await $(this.selectors.searchCase).sendKeys(input, Key.ENTER);
    }

    async clickFirstLinkInCaseSearchGrid(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedCaseLink)));
        await $$(this.selectors.recommendedCaseLink).first().click();
    }

    async isCaseIdHyperlinked(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.recommendedCaseLink)));
        return await $$(this.selectors.recommendedCaseLink).first().isDisplayed();
    }

    async clickFirstCheckBoxInCaseSearchGrid(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedCaseCheckBox)));
        await $(this.selectors.recommendedCaseCheckBox).click();
    }
}

export default new CaseConsolePage();