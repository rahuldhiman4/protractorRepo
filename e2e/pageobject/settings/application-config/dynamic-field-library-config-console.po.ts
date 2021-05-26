import utilityGrid from '../../../utils/utility.grid';
import { $, protractor, ProtractorExpectedConditions, promise } from "protractor";

class DynamicFieldLibraryConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addDynamicFieldBtn: '[rx-view-component-id="867d7e5f-2753-42bc-b319-8797a1c74a7e"] button',
        gridGuid: '0e836043-77c3-4c3f-bc86-64ecda4e1e42',
    }

    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnHeader, this.selectors.gridGuid);
    }

    async isValueDisplayed(columnName: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnName, this.selectors.gridGuid);
    }

    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnHeader,this.selectors.gridGuid,);
    }

    async clickAddDynamicFieldButton(): Promise<void> {
        await $(this.selectors.addDynamicFieldBtn).click();
    }

    async isAddDynamicFieldButtonEnabled(): Promise<boolean> {
       return await $(this.selectors.addDynamicFieldBtn).isEnabled();
    }

    async areRequestedColumnMatches(columnNames: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnNames, this.selectors.gridGuid);
    }

    async addRequestedGridColumn(columnNames:string[]):Promise<void>{
        await utilityGrid.addGridColumn(columnNames, this.selectors.gridGuid);
    }

    async removeRequestedGridColumn(columnNames:string[]):Promise<void>{
        await utilityGrid.removeGridColumn(columnNames, this.selectors.gridGuid);
    }

    async isRequestedColumnSortedAscending(columnName: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnName, "ascending", this.selectors.gridGuid);
    }

    async isRequestedColumnSortedDescending(columnName: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnName, "descending", this.selectors.gridGuid);
    }


}

export default new DynamicFieldLibraryConsole();