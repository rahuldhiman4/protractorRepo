import { $, browser, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';

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
        gridGuid: '0df18e99-4315-457c-aef0-3abc96fb08ee',
        knowledgeArticleTitle: '[rx-view-component-id="11f37569-5ecd-4239-aaa7-075d1874b1d1"] span',
        searchFilterOptions: '.search-filter__option-item_search',
    }

    async searchKnowledgeArticle(input: string): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.searchTemplate)));
        await $(this.selectors.searchTemplate).clear();
        await $(this.selectors.searchTemplate).sendKeys(input, Key.ENTER);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async addAllcolumnOnKnowledgeConsole(knowledgeGridColumnFields: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.gridGuid, knowledgeGridColumnFields);
    }

    async removeAddedColumns(knowledgeGridColumnFields: string[]):Promise<void>{
        await utilGrid.removeGridColumn(this.selectors.gridGuid, knowledgeGridColumnFields);
    }

    async isArticleIdDisplayed(input: string): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.recommendedArticleLink)));
        return await element(by.cssContainingText(this.selectors.recommendedArticleLink, input)).isDisplayed();
    }

    async isGridRecordPresent(searchRecord: string): Promise<boolean> {
        return await utilGrid.isGridRecordPresent(searchRecord);
    }

    async getKnowledgeArticleTitle(): Promise<string> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeArticleTitle)));
        return await $(this.selectors.knowledgeArticleTitle).getText();
    }

    async isValueDisplayedInGrid(columnName: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid, columnName);
    }
}
export default new ConsoleKnowledge();