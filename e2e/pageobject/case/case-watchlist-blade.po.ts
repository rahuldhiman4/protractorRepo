import { $, $$, by, element, ElementFinder, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilityGrid from '../../utils/utility.grid';

class CaseWatchlistBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        watchlistEvents: '[rx-view-component-id="99e01ff6-3123-436a-85f4-405994271b33"] .a-select-inline__item span',
        saveButton: '[rx-view-component-id="fe442bdb-1c1e-47b7-8f47-cfcf61505b45"] button',
        closeButton: '[rx-view-component-id="7a0cb1ff-c0a5-4571-a2dc-6670842db2c6"] button',
        guid: '60bc2700-9909-4b0f-8de4-edb02443b62f',
        selectAllrows: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] .checkbox__label input',
        selectedCheckboxes: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] div .ui-state-active',
        unselectedCheckboxes: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] div[class="ui-chkbox-box ui-widget ui-state-default"]',
        allCheckboxes: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] div .ui-state-default .ui-clickable',
        backButton: '[rx-view-component-id="e109c9be-4093-4c82-9e20-8bc98347c984"] button',
        searchInput: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] .adapt-search-field-ellipsis',
        searchIcon: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] .adapt-search-button',
        removeBtn: '[rx-view-component-id="fdc9b3f0-3baa-48f4-b404-11f6441e676a"] button',
        updateWatchlistEventsButton: '[rx-view-component-id="36e39eb7-fc47-45d3-b435-4b1a4311383d"] button',
        filterPreset: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] button.d-icon-left-filter',
        clearFilterButton: 'button.custom-action-btn',
        filterDropdown: '.show__more-tags',
        caseLinks: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] tr td:nth-of-type(2) a',
        clearSearchicon: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] .adapt-search-clear',
        clearSorting: '.adapt-table-sort-menu__clear-all-btn button',
        selectAllEvent: '[rx-view-component-id="1c7ab457-9db0-430c-958f-e05bf00feb57"] [class="custom-action-btn-label"]'
    }

    async addWatchlistEvent(eventName: string): Promise<void> {
        await $(this.selectors.selectAllEvent).isPresent().then(async (results) => {
            if (results) {
                await element(by.cssContainingText(this.selectors.watchlistEvents, eventName)).click();
            } else await element(by.cssContainingText(this.selectors.watchlistEvents, eventName)).click();
        });
    }

    async saveEvents(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async isCasePresent(caseId: string): Promise<boolean> {
        await utilityGrid.searchRecord(caseId, this.selectors.guid);
        let status = await element(by.cssContainingText(this.selectors.caseLinks, caseId)).isPresent();
        await $(this.selectors.clearSearchicon).click();
        return status;
    }

    async selectAllCases(): Promise<void> {
        await $(this.selectors.selectAllrows).click();
    }

    async isAllCasesSelected(): Promise<boolean> {
        let allCheckboxCount: number = await $$(this.selectors.allCheckboxes).count();
        let selectedCheckboxCount: number = await $$(this.selectors.selectedCheckboxes).count();
        return selectedCheckboxCount == allCheckboxCount;
    }

    async isAllCasesUnSelected(): Promise<boolean> {
        let allCheckboxCount: number = await $$(this.selectors.allCheckboxes).count();
        let unSelectedCheckboxCount: number = await $$(this.selectors.unselectedCheckboxes).count();
        return unSelectedCheckboxCount == allCheckboxCount;
    }

    async searchCase(searchValue: string): Promise<void> {
        await $(this.selectors.searchInput).clear();
        await $(this.selectors.searchInput).sendKeys(searchValue);
        await $(this.selectors.searchIcon).click();
    }

    async isCaseSearchGiveCorrectResult(caseId: string): Promise<boolean> {
        await utilityGrid.searchRecord(caseId, this.selectors.guid);
        let count: number = await $$(this.selectors.caseLinks).count();
        return count == 1 && await $$(this.selectors.caseLinks).first().getText() == caseId;
    }

    async isColumnSorted(columnHeader: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnHeader, "asc", this.selectors.guid);
    }

    async areWatchlistColumnMatches(columnNames: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnNames, this.selectors.guid);
    }

    async addWatchlistGridColumn(columnNames: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnNames, this.selectors.guid);
    }

    async removeWatchlistGridColumn(columnNames: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnNames, this.selectors.guid);
    }

    async addFilter(fieldName: string, textValue: string, type: string): Promise<void> {
        await utilityGrid.addFilter(fieldName, textValue, type, this.selectors.guid);
    }

    async isEntireColumnContainsValue(columnName: string, value: string): Promise<boolean> {
        let allValues: string[] = await utilityGrid.getAllValuesFromColumn(columnName, this.selectors.guid);
        let filteredValues: string[] = allValues.filter(function (ele) {
            return ele == value;
        });
        return allValues.length == filteredValues.length;
    }

    async selectCase(caseId: string): Promise<void> {
        await utilityGrid.sortGridColumn('Case ID', 'descending', this.selectors.guid);
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId, this.selectors.guid);
    }

    async selectTwoCases(caseId1: string, caseId2: string): Promise<void> {
        await utilityGrid.sortGridColumn('Case ID', 'descending', this.selectors.guid);
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId1, this.selectors.guid);
        await utilityGrid.clickCheckBoxOfValueInGrid(caseId2, this.selectors.guid);
    }

    async clickOnRemoveBtn(): Promise<void> {
        await $(this.selectors.removeBtn).click();
    }

    async clickOnUpdateWatchlistEventsBtn(): Promise<void> {
        await $(this.selectors.updateWatchlistEventsButton).click();
    }

    async clearWatchlistFilter(): Promise<void> {
        let clearFilterLocator = await $$(this.selectors.clearFilterButton).first();
        try {
            await $(this.selectors.filterPreset).click();
            if (await clearFilterLocator.isPresent()) {
                await clearFilterLocator.click();
            }
            await $('[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] .d-icon-refresh').click();
        }
        catch (Ex) {
            console.log("Filters are already cleared");
        }
    }

    async clickOnBackBtn(): Promise<void> {
        await $(this.selectors.backButton).click();
    }

    async getCaseAssignmentChangesLabel(): Promise<string> {
        let locator = await $$(this.selectors.watchlistEvents).get(0);
        return await locator.getText();
    }

    async getCaseGroupAssignmentChangesLabel(): Promise<string> {
        let locator = await $$(this.selectors.watchlistEvents).get(1);
        return await locator.getText();
    }

    async getCaseStatusChangesLabel(): Promise<string> {
        let locator = await $$(this.selectors.watchlistEvents).get(2);
        return await locator.getText();
    }

    async getSaveButtonLabel(): Promise<string> {
        return await $(this.selectors.saveButton).getText();
    }

    async getCloseButtonLabel(): Promise<string> {
        return await $(this.selectors.closeButton).getText();
    }

    async getRemoveButtonLabel(): Promise<string> {
        return await $(this.selectors.removeBtn).getText();
    }

    async getUpdateWatchlistEventsButtonLabel(): Promise<string> {
        return await $(this.selectors.updateWatchlistEventsButton).getText();
    }

    async openCase(caseId: string): Promise<void> {
        await utilityGrid.sortGridColumn('Case ID', 'descending', this.selectors.guid);
        let locator = await element(by.cssContainingText(this.selectors.caseLinks, caseId));
        await locator.click();
    }

    async isSaveEventsButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }

    async clickOnCloseButton(): Promise<void> {
        await $(this.selectors.closeButton).click();
    }

    async sortDescendingByCaseId(): Promise<void> {
        let headerText = await $$('[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] .at-header-data-cell');
        for (let i: number = 0; i < (await headerText.length); i++) {
            let columnName = await headerText[i].$('.c-header__separator');
            if (await columnName.getText() == 'Case ID') {
                await headerText[i].$('adapt-table-header-cell-menu').click();
                break;
            }
        }
        let descendingSign: ElementFinder = await $$('.adapt-table-sort-menu__btn').get(1);
        await descendingSign.click();
        await $$('.d-icon-refresh').last().click();
    }
}

export default new CaseWatchlistBlade();