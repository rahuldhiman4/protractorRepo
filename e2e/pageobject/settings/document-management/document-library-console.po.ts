import { protractor, ProtractorExpectedConditions, browser, element, by } from "protractor";
import utilCommon from '../../../utils/util.common';
import utilGrid from '../../../utils/util.grid';

class DocumentLibraryPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addDocumentButton: '[rx-view-component-id="c2df3218-8ef7-402c-bdc2-721e891346bb"] button',
        gridGuid: '5d1f94a9-693e-4dbf-896f-3b9689f95a42',   
    }

    async isGridRecordPresent(searchRecord:string): Promise<boolean> {
        return await utilGrid.isGridRecordPresent(searchRecord);
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilGrid.searchOnGridConsole(value);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.gridGuid, columnHeader);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async clearGridSearchBox(): Promise<void> {
        await utilGrid.clearGridSearchBox();
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.gridGuid, columnHeader);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(columnHeader, sortType, this.selectors.gridGuid);
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid, columnHeader);
    }

    async areGridColumnHeaderMatches(columnHeader: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.gridGuid, columnHeader);
    }

    async searchAndOpenDocumentLibrary(value: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(value, this.selectors.gridGuid);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async searchAndCheckDocumentLibraryListed(value: string): Promise<boolean> {
      return  await utilGrid.isGridRecordPresent(value);
//        await utilCommon.waitUntilSpinnerToHide();
    }


}

export default new DocumentLibraryPage();