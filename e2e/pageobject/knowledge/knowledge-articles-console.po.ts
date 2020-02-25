import { ProtractorExpectedConditions, protractor, browser, $, $$, element, by, ElementFinder, Key } from "protractor"
import { TestObject } from 'protractor/built/driverProviders';
import utilGrid from "../../utils/util.grid";
import utilCommon from '../../utils/util.common';

class KnowledgeArticlesGridConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        guid: '0df18e99-4315-457c-aef0-3abc96fb08ee',
        knowledgeArticleConsoleTitle: '[rx-view-component-id="11f37569-5ecd-4239-aaa7-075d1874b1d1"] span',
        searchInput: '[rx-id="search-text-input"]',
        searchIcon: '[rx-id="submit-search-button"]',
        selectFilterOption: '.d-dropdown__menu-options-item a',
        gridColumnHeader: '.ui-grid-header-cell-label',
        hamburgerFilterIcon: '[rx-view-component-id="a9dfa448-2900-4a2b-a230-503f4a0ac12e"] .rx-record-grid-toolbar__item .d-icon-ellipsis',
        removeAssignedToMeFilter: '.d-tag-remove-button',
        knowledgeArticleGridConsoleGuid: '0df18e99-4315-457c-aef0-3abc96fb08ee',
        recommendedArticleLink: '.ui-grid__link',
        filter: '.rx-search-filter__trigger',
        availableFilterDrpDown: '.d-accordion__title',
        applyFilter: '.rx-search-filter-heading__apply',
        removeFilter: '..d-tag-remove-button',
        tableValue: '.ui-grid-cell-contents',
        searchFilterOptions: '.search-filter__option-item_search',
        getAccessText:'[rx-view-component-id="234d397b-5a98-400a-8c72-9de75e6659d9"]',
    }

    async getKnowledgeArticleConsoleTitle(): Promise<string> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeArticleConsoleTitle)));
        return await $(this.selectors.knowledgeArticleConsoleTitle).getText();
    }

    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.knowledgeArticleGridConsoleGuid, columnHeader);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async clearGridSearchBox(): Promise<void> {
        await utilGrid.clearGridSearchBox();
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.knowledgeArticleGridConsoleGuid, columnHeader);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(columnHeader, sortType, this.selectors.knowledgeArticleGridConsoleGuid);
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.knowledgeArticleGridConsoleGuid, columnHeader);
    }

    async searchOnGridConsole(columnHeader: string): Promise<void> {
        return await utilGrid.searchOnGridConsole(columnHeader);
    }

    async areGridColumnHeaderMatches(columnHeader: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.knowledgeArticleGridConsoleGuid, columnHeader);
    }

    async isSelectedFilterOptionDisplayedOnGridConsole(gridColumn: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.knowledgeArticleGridConsoleGuid,gridColumn);
    }

    async searchKnowledgeArticle(input: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.searchTemplate)));
        await $(this.selectors.searchInput).clear();
        await $(this.selectors.searchInput).sendKeys(input, Key.ENTER);
        //        await utilCommon.waitUntilSpinnerToHide();
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
        return await $(this.selectors.knowledgeArticleConsoleTitle).getText();
    }

    async isValueDisplayedInGrid(columnName: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.knowledgeArticleGridConsoleGuid, columnName);
    }

    async getNumberOfRecordsInGrid(): Promise<number>{
        return await utilGrid.getNumberOfRecordsInGrid(this.selectors.guid);
    }

    async getMessageOfAccess():Promise<string>{
        return await $(this.selectors.getAccessText).getText();
    }

}

export default new KnowledgeArticlesGridConsole();