import { $, protractor, ProtractorExpectedConditions, promise } from "protractor";
import utilGrid from '../../../utils/util.grid';

class DynamicFieldLibraryConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addDynamicFieldBtn: '[rx-view-component-id="867d7e5f-2753-42bc-b319-8797a1c74a7e"] button',
        gridGuid: '0e836043-77c3-4c3f-bc86-64ecda4e1e42',
    }

    
    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.gridGuid, columnHeader);
    }

    async isValueDisplayed(columnName: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid, columnName);
    }

    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.gridGuid, columnHeader);
    }

    async clickAddDynamicFieldButton(): Promise<void> {
        await $(this.selectors.addDynamicFieldBtn).click();
    }

    async areRequestedColumnMatches(columnNames: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches( this.selectors.gridGuid,columnNames);
    }

    async addRequestedGridColumn(columnNames:string[]):Promise<void>{
        await utilGrid.addGridColumn(this.selectors.gridGuid,columnNames);
    }

    async removeRequestedGridColumn(columnNames:string[]):Promise<void>{
        await utilGrid.removeGridColumn(this.selectors.gridGuid,columnNames);
    }

    async isRequestedColumnsSortedAscending(columnName: string): Promise<boolean> {
        await utilGrid.clearFilter();
        return await utilGrid.isGridColumnSorted(columnName, "asc", this.selectors.gridGuid);
    }
}

export default new DynamicFieldLibraryConsole();