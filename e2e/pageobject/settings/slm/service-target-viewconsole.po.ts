import { element, by, protractor, ProtractorExpectedConditions, $, $$, browser } from "protractor";
import utilityGrid from '../../../utils/utility.grid';

class ServiceTargetViewConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createServiceTargetButton: '[rx-view-component-id="5a771a32-973d-4c3f-a90a-280c36890dea"] button',
        refreshIcon: '[rx-view-component-id="9cc9357d-3895-4a20-a5f8-04e02692267d"] .d-icon-refresh',
        filterIcon: '[rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"] .d-icon-left-filter',
        filterItems: '.advanced-filter__tab-content .form-control-feedback',
        applyButton: 'button[data-testid="adapt-af-1_Save"]',
        filterClose: '.close-inverse',
        consoleGuid: '9cc9357d-3895-4a20-a5f8-04e02692267d'

    }

    async searchServiceTarget(searchSVT: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(searchSVT);
    }

    async isAddSVTButtonVisible(): Promise<boolean> {
        return await $(this.selectors.createServiceTargetButton).isPresent().then(async (result) => {
            if(result) $(this.selectors.createServiceTargetButton).isDisplayed();
            else return false;
        });
    }

    async removeColumns(columnNames: string[]): Promise<void> {
       await utilityGrid.removeGridColumn(columnNames,this.selectors.consoleGuid)
    }

    async addColumns(columnNames: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnNames,this.selectors.consoleGuid);
    }

    async searchOnGridConsole(searchValue: string): Promise<void> {
        await utilityGrid.searchRecord(searchValue);
    }

    async isGridRecordDisplayed(searchValue: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(searchValue);
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
      return await utilityGrid.isGridColumnSorted(columnHeader,sortType);       
    }

    async getServiceTargetGUID(): Promise<string> {
        return await $$('[rx-view-component-id="9cc9357d-3895-4a20-a5f8-04e02692267d"]  tr td').get(5).getText();
    }

    async getServiceTargetID(): Promise<string> {
        return await $$('[rx-view-component-id="9cc9357d-3895-4a20-a5f8-04e02692267d"]  tr td').get(1).getText();
    }

    async isFilteredRecordDisplayed(): Promise<boolean> {
        return await $('[rx-view-component-id="9cc9357d-3895-4a20-a5f8-04e02692267d"] .filter-tags__tag-tex').isPresent();
    }
}

export default new ServiceTargetViewConsole();