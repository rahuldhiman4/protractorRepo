import { $, $$, browser, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";

class TaskGridPage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        searchTemplate: '[rx-id="search-text-input"]',
        recommendedTemplateLink: '.ui-grid__link',
        recommendedTemplateCheckBox: '.ui-grid-icon-ok',
        filter: '.rx-search-filter__trigger',
        availableFilterDrpDown: '.d-accordion__title',
        applyFilter: '.rx-search-filter-heading__apply',
        removeFilter: '..d-tag-remove-button',
        tableValue: '.ui-grid-cell-contents',
    }


    async setTaskSearchBoxValue(input: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchTemplate)));
        await $(this.selectors.searchTemplate).clear();
        await $(this.selectors.searchTemplate).sendKeys(input, Key.ENTER);
    }

    async clickFirstLinkInTaskTemplateSearchGrid(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedTemplateLink)));
        await browser.sleep(3000);
        await $$(this.selectors.recommendedTemplateLink).first().click();
    }

    async isCaseIdLinkIsPresent(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf(element(by.xpath("(//*[@role='gridcell'])[2]//a"))));
        var caseId: string = await element(by.xpath("(//*[@role='gridcell'])[2]//a")).getText();
        return caseId.includes('CASE');
    }
    async clickFirstCheckBoxInTaskTemplateSearchGrid(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedTemplateCheckBox)));
        await browser.sleep(3000);
        await $(this.selectors.recommendedTemplateCheckBox).click();
    }
    async getFilteredValue(filterName: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.tableValue)));
        await browser.sleep(3000);
        return await element(by.cssContainingText(this.selectors.tableValue, filterName)).getText();
    }

}
export default new TaskGridPage();