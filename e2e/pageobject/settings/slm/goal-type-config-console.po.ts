import { $, $$, browser, protractor, ProtractorExpectedConditions, element, by, Key } from "protractor";
import utilGrid from '../../../utils/util.grid';

class GoalTypeConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addGoalType: '[rx-view-component-id="4d8a4ec5-1b1c-4679-b3cf-0ad793c56bc5"] button',
        goalTypeConsoleGUID: '72a09a55-57b4-440a-9e8d-e8ed1d30edc6',
        refreshIcon: 'button.d-icon-refresh',
        filterIcon: '.rx-search-filter button',
        filterItems: '.search-filter-dropdown .d-accordion__item',
        applyButton: '.rx-search-filter-heading__apply',
    }

    async isAddGoalTypeBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.addGoalType).isPresent();
    }

    async removeColumns(columnNames: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.goalTypeConsoleGUID, columnNames);
    }

    async addColumns(columnNames: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.goalTypeConsoleGUID, columnNames);
    }

    async searchOnGridConsole(searchValue: string): Promise<void> {
        await utilGrid.searchOnGridConsole(searchValue, this.selectors.goalTypeConsoleGUID);
    }

    async isGridRecordDisplayed(searchValue: string): Promise<boolean> {
        return await utilGrid.isGridRecordPresent(searchValue, this.selectors.goalTypeConsoleGUID);
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(columnHeader, sortType, this.selectors.goalTypeConsoleGUID);
    }

    async getGoalTypeGUID(): Promise<string> {
        return await $$('[rx-view-component-id="72a09a55-57b4-440a-9e8d-e8ed1d30edc6"] div.ui-grid-row .ui-grid-cell-contents').last().getText();
    }

    async isFilteredRecordDisplayed(): Promise<boolean> {
        return await $('[rx-view-component-id="72a09a55-57b4-440a-9e8d-e8ed1d30edc6"]  div.ui-grid-row').isPresent();
    }

    async clickRefreshIcon(): Promise<void> {
        await $(this.selectors.refreshIcon).click();
    }

    async addGoalTypeFilter(fieldName: string, textValue: string,type:string, guid?: string): Promise<void> {
        let guidId: string = "";
        if (guid) {
            guidId = `[rx-view-component-id="${guid}"] `
        }
        await $(guidId + this.selectors.filterIcon).click();
        await element.all(by.cssContainingText(guidId + this.selectors.filterItems, fieldName)).first().click();

        switch (type) {
            case "checkbox": {
                await $(`.rx-search-filter-option[title='${textValue}']`).click();
                break;
            }
            default: {
               await element.all(by.cssContainingText(guidId + this.selectors.filterItems, fieldName)).last().$('label.d-textfield__label').sendKeys(textValue + Key.ENTER);
                break;
            }
        }
        await $(guidId + this.selectors.applyButton).click();
    }



}

export default new GoalTypeConfigConsolePage();