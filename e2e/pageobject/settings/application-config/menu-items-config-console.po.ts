import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../../utils/utility.grid';

class MenuItemsConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addMenuOptionBtn: '[rx-view-component-id="306a51e0-cb89-45db-9270-c40b4ec3b149"] button',
        gridGuid: 'b09e033f-cd38-4a33-92ae-0832c9de8dcb',
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilityGrid.searchRecord(value);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async isMenuItemRecordPresentOnGridConsole(value: string): Promise<void> {
        await utilityGrid.isGridRecordPresent(value);
    }
    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnHeader, this.selectors.gridGuid);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async clearGridSearchBox(): Promise<void> {
        await utilityGrid.clearSearchBox();
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnHeader,this.selectors.gridGuid);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnHeader, sortType, this.selectors.gridGuid);
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnHeader,this.selectors.gridGuid);
    }

    async areColumnHeaderMatches(columnHeader: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnHeader, this.selectors.gridGuid);
    }

    async searchAndEditMenuOption(menuOption: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(menuOption);
//        await utilCommon.waitUntilSpinnerToHide();
    }



    async isAddButtonDisplayed(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.addMenuOptionBtn)));
        return await $(this.selectors.addMenuOptionBtn).isPresent();
    }

}

export default new MenuItemsConsolePage();