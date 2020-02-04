import { element, by, $, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilCommon from '../../../utils/util.common';
import utilGrid from '../../../utils/util.grid';

class DocumentTemplateConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
            gridGuid: '9a22b025-c87e-4ddb-b8ce-472ccbf39a63',
            pageHeader: '.rx-theme-main-text-color h2',
            deleteButton: '[rx-view-component-id="93f7643a-ab88-41be-9ff4-7a9130dbbff0"] .d-button_small span',
    }

    async selectCheckBox(record:string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.deleteButton)));
        await utilGrid.searchAndSelectGridRecord(record);
    }

    async clickOnDeleteButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.deleteButton)));
        await $(this.selectors.deleteButton).click();
    }

    async clickOnGridRefreshButton(): Promise<void> {
        await utilGrid.clickOnGridRefreshButton();
    }

    async isHeaderDisplayed(headerName:string): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.pageHeader)));
        return await element(by.cssContainingText(this.selectors.pageHeader,headerName)).isDisplayed();
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

    async searchAndOpenDocumentTemplate(value: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(value);
//        await utilCommon.waitUntilSpinnerToHide();
    }


}

export default new DocumentTemplateConsolePage();