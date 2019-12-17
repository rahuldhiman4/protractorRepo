import { $, browser, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class ConsoleKnowledge {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        searchTemplate: '[rx-id="search-text-input"]',
        recommendedArticleLink: '.ui-grid__link',
        filter: '.rx-search-filter__trigger',
        availableFilterDrpDown: '.d-accordion__title',
        applyFilter: '.rx-search-filter-heading__apply',
        removeFilter: '..d-tag-remove-button',
        tableValue: '.ui-grid-cell-contents',
    }

    async searchKnowledgeArticle(input: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchTemplate)));
        await $(this.selectors.searchTemplate).clear();
        await $(this.selectors.searchTemplate).sendKeys(input, Key.ENTER);
        await utilCommon.waitUntilSpinnerToHide();
    }

    async isArticleIdDisplayed(input: string): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.recommendedArticleLink)));
        return await element(by.cssContainingText(this.selectors.recommendedArticleLink, input)).isDisplayed();
    }

}
export default new ConsoleKnowledge();