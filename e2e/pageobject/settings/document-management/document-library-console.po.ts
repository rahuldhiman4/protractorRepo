import { protractor, ProtractorExpectedConditions, browser, element, by } from "protractor";
import utilCommon from '../../../utils/util.common';
import utilityGrid from '../../../utils/utility.grid';

class DocumentLibraryPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addDocumentButton: '[rx-view-component-id="c2df3218-8ef7-402c-bdc2-721e891346bb"] button',
        gridGuid: '5d1f94a9-693e-4dbf-896f-3b9689f95a42',   
    }

    async isGridRecordPresent(searchRecord:string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(searchRecord);
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilityGrid.searchRecordWithoutFilter(value);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnHeader,this.selectors.gridGuid);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async clearGridSearchBox(): Promise<void> {
        await utilityGrid.clearFilter();
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
        return await utilityGrid.getFirstGridRecordColumnValue(columnHeader);
    }

    async areGridColumnHeaderMatches(columnHeader: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnHeader,this.selectors.gridGuid);
    }

    async searchAndOpenDocumentLibrary(value: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(value, this.selectors.gridGuid);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async searchAndCheckDocumentLibraryListed(value: string): Promise<boolean> {
      return  await utilityGrid.isGridRecordPresent(value);
//        await utilCommon.waitUntilSpinnerToHide();
    }


}

export default new DocumentLibraryPage();