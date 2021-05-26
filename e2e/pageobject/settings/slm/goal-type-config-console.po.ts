import { $, $$, browser, protractor, ProtractorExpectedConditions, element, by, Key } from "protractor";
import utilityGrid from '../../../utils/utility.grid';

class GoalTypeConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addGoalType: '[rx-view-component-id="7d2a8db4-6b9d-4cd8-b493-698f7594cacf"] button',
        goalTypeConsoleGUID: '781a6488-ff08-481b-86c7-7c78c577357b',
        refreshIcon: 'button.d-icon-refresh',
        filterIcon: 'button.d-icon-left-filter',
        filterItems: '.advanced-filter__tab-content .form-control-feedback',
        applyButton: 'button.custom-action-btn__right',
    }

    async isAddGoalTypeBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.addGoalType).isPresent();
    }

    async removeColumns(columnNames: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnNames);
    }

    async addColumns(columnNames: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnNames);
    }

    async searchOnGridConsole(searchValue: string): Promise<void> {
        await utilityGrid.searchRecord(searchValue);
    }

    async isGridRecordDisplayed(searchValue: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(searchValue);
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnHeader, sortType);
    }

    async getGoalTypeGUID(): Promise<string> {
        return await (await $$('[rx-view-component-id="781a6488-ff08-481b-86c7-7c78c577357b"] tbody.ui-table-tbody tr td').last().getText()).trim();
    }

    async isFilteredRecordDisplayed(): Promise<boolean> {
        return await $('[rx-view-component-id="781a6488-ff08-481b-86c7-7c78c577357b"] tbody.ui-table-tbody tr').isPresent();
    }

    async clickRefreshIcon(): Promise<void> {
        await $(this.selectors.refreshIcon).click();
    }

    async addGoalTypeFilter(fieldName: string, textValue: string, type: string, guid?: string): Promise<void> {
        let guidId: string = "";
        if (guid) {
            guidId = `[rx-view-component-id="${guid}"] `
        }
        await $(guidId + this.selectors.filterIcon).click();
        await element.all(by.cssContainingText(guidId + this.selectors.filterItems, fieldName)).first().click();

        switch (type) {
            case "checkbox": {
                let fieldCount: number = await $$('.advanced-filter__select-inline input[type="checkbox"] + span.checkbox__item').count();

                for (let i = 0; i < fieldCount; i++) {
                    let field = await (await $$('.advanced-filter__select-inline input[type="checkbox"] + span.checkbox__item').get(i).getText()).trim();
                    if (field == textValue) {
                        await $('.advanced-filter__select-inline input[type="checkbox"] + span.checkbox__item').click();
                        break;
                    }
                }
            }
            default: {
                await $('input.adapt-mt-input').sendKeys(textValue + Key.ENTER);
                break;
            }
        }
        await $(guidId + this.selectors.applyButton).click();
    }

    async searchAndOpenGoalType(goalTypeTitle: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(goalTypeTitle, this.selectors.goalTypeConsoleGUID);
    }

}

export default new GoalTypeConfigConsolePage();