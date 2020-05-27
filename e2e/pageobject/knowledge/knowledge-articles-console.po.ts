import { $, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from "../../utils/util.grid";
import utilityGrid from '../../utils/utility.grid';

class KnowledgeArticlesGridConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        knowledgeArticleConsoleTitle: '[rx-view-component-id="11f37569-5ecd-4239-aaa7-075d1874b1d1"] span',
        searchInput: '.adapt-search-triggerable input[type="search"]',
        searchIcon: '.input-group-append button',
        gridColumnHeader: '.ui-grid-header-cell-label',
        hamburgerFilterIcon: '[rx-view-component-id="a9dfa448-2900-4a2b-a230-503f4a0ac12e"] .rx-record-grid-toolbar__item .d-icon-ellipsis',
        removeAssignedToMeFilter: '.d-tag-remove-button',
        knowledgeArticleGridConsoleGuid: '0df18e99-4315-457c-aef0-3abc96fb08ee',
        recommendedArticleLink: '.at-data-cell button',
        filter: '.d-icon-left-filter',
        applyFilter: '.advanced-filter__actions-buttons .m-start-4',
        removeFilter: '.advanced-filter__actions-buttons button',
        tableValue: '.c-header-container [class="c-header-name"]',
        getAccessText: '[rx-view-component-id="234d397b-5a98-400a-8c72-9de75e6659d9"]',
    }

    async searchAndOpenKnowledgeArticle(knowledgeId: string): Promise<void> {
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(knowledgeId);
    }

    async getKnowledgeArticleConsoleTitle(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeArticleConsoleTitle)));
        return await $(this.selectors.knowledgeArticleConsoleTitle).getText();
    }

    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnHeader, this.selectors.knowledgeArticleGridConsoleGuid);
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async clearGridSearchBox(): Promise<void> {
        await utilGrid.clearGridSearchBox();
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnHeader, this.selectors.knowledgeArticleGridConsoleGuid);
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnHeader, sortType, this.selectors.knowledgeArticleGridConsoleGuid);
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(this.selectors.knowledgeArticleGridConsoleGuid, columnHeader);
    }

    async searchOnGridConsole(columnHeader: string): Promise<void> {
        return await utilityGrid.searchRecord(columnHeader);
    }

    async areGridColumnHeaderMatches(columnHeader: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnHeader);
    }

    async isSelectedFilterOptionDisplayedOnGridConsole(gridColumn: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(gridColumn);
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
        return await utilityGrid.isGridRecordPresent(searchRecord);
    }

    async getKnowledgeArticleTitle(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeArticleTitle)));
        return await $(this.selectors.knowledgeArticleConsoleTitle).getText();
    }

    async isValueDisplayedInGrid(columnName: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnName, this.selectors.knowledgeArticleGridConsoleGuid);
    }

    async getNumberOfRecordsInGrid(): Promise<number> {
        return await utilityGrid.getNumberOfRecordsInGrid(this.selectors.knowledgeArticleGridConsoleGuid);
    }

    async getMessageOfAccess(): Promise<string> {
        return await $(this.selectors.getAccessText).getText();
    }

    async isFilterValueOnGridDisplayed(columnField: string, fieldValue: string): Promise<boolean> {
        let arr: string[] = await utilityGrid.getAllValuesFromColumn((this.selectors.knowledgeArticleGridConsoleGuid), columnField);
        let unique = arr.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        });
        return unique.length === 1 && unique[0] === fieldValue;
    }

    async applyFilter(fieldName: string, textValue: string, type: string): Promise<void> {
        await utilityGrid.addFilter(fieldName, textValue, type);
    }
}

export default new KnowledgeArticlesGridConsole();