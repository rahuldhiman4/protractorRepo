import { ProtractorExpectedConditions, protractor, browser, $, $$, element, by, ElementFinder } from "protractor"
import { TestObject } from 'protractor/built/driverProviders';
import utilGrid from "../../utils/util.grid";
import utilCommon from '../../utils/util.common';

class KnowledgeArticlesGridConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        knowledgeArticleConsoleTitle: '[rx-view-component-id="11f37569-5ecd-4239-aaa7-075d1874b1d1"] span',
        searchInput: '[rx-id="search-text-input"]',
        searchIcon: '[rx-id="submit-search-button"]',
        selectFilterOption: '.d-dropdown__menu-options-item a',
        gridColumnHeader: '.ui-grid-header-cell-label',
        hamburgerFilterIcon: '[rx-view-component-id="a9dfa448-2900-4a2b-a230-503f4a0ac12e"] .rx-record-grid-toolbar__item .d-icon-ellipsis',
        removeAssignedToMeFilter: '.d-tag-remove-button',
        knowledgeArticleGridConsoleGuid: '0df18e99-4315-457c-aef0-3abc96fb08ee',
    }

    async getKnowledgeArticleConsoleTitle(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeArticleConsoleTitle)));
        return await $(this.selectors.knowledgeArticleConsoleTitle).getText();
    }

    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.knowledgeArticleGridConsoleGuid, columnHeader);
        await utilCommon.waitUntilSpinnerToHide();
    }

    async clearGridSearchBox(): Promise<void> {
        await utilGrid.clearGridSearchBox();
        await utilCommon.waitUntilSpinnerToHide();
    }

    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.knowledgeArticleGridConsoleGuid, columnHeader);
        await utilCommon.waitUntilSpinnerToHide();
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
}

export default new KnowledgeArticlesGridConsole();