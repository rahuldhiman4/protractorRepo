import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../../utils/utility.grid';
import editDocumentLibraryPo from './edit-document-library.po';

class DocumentLibraryPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addDocumentButton: '[rx-view-component-id="c2df3218-8ef7-402c-bdc2-721e891346bb"] button',
        gridGuid: '5d1f94a9-693e-4dbf-896f-3b9689f95a42',  
        deleteButton: '.d-icon-left-cross', 
        radioButon: '[rx-view-component-id="5d1f94a9-693e-4dbf-896f-3b9689f95a42"] input[type="radio"]',
    }

    async unselectCheckBox(): Promise<void> {
         await $(this.selectors.radioButon).click();
    }

    async isDeleteButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        return await $(this.selectors.deleteButton).isDisplayed();
    }


    async isDeleteButtonEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).isEnabled();
    }


    async isGridRecordPresent(searchRecord:string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(searchRecord);
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilityGrid.searchRecordWithoutFilter(value);
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async searchAndSelectDocument(value: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(value);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnHeader, this.selectors.gridGuid);
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async clearGridSearchBox(): Promise<void> {
        await utilityGrid.clearFilter();
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnHeader, this.selectors.gridGuid);
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnHeader, sortType, this.selectors.gridGuid);
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnHeader);
    }

    async areGridColumnHeaderMatches(columnHeader: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnHeader, this.selectors.gridGuid);
    }

    async searchAndOpenDocumentLibrary(value: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(value, this.selectors.gridGuid);
        await $(editDocumentLibraryPo.selectors.docLibEditButton).click(); // view doc lib page has Edit button to edit the doc lib 
    }

    async searchAndCheckDocumentLibraryListed(value: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(value);
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async deleteDocument(): Promise<void> {
        await $(this.selectors.deleteButton).click();
    }

}

export default new DocumentLibraryPage();