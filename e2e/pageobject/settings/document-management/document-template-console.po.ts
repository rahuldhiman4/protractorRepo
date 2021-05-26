import { element, by, $, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilityGrid from '../../../utils/utility.grid';

class DocumentTemplateConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
            gridGuid: '9a22b025-c87e-4ddb-b8ce-472ccbf39a63',
            pageHeader: '.rx-theme-main-text-color h2',
            deleteButton: '[rx-view-component-id="93f7643a-ab88-41be-9ff4-7a9130dbbff0"] button',
            addDocumentTemplateBtn: '[rx-view-component-id="3acdcc85-9981-433a-84dd-6891fedcc243"] button'
    }

    async clickCreateDocumentTemplate(): Promise<void> {
        await $(this.selectors.addDocumentTemplateBtn).click();
    }

    async selectCheckBox(record:string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.deleteButton)));
        await utilityGrid.searchAndSelectGridRecord(record);
    }

    async clickOnDeleteButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.deleteButton)));
        await $(this.selectors.deleteButton).click();
    }

    async clickOnGridRefreshButton(): Promise<void> {
        await utilityGrid.clickRefreshIcon();
    }

    async isHeaderDisplayed(headerName:string): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.pageHeader)));
        return await element(by.cssContainingText(this.selectors.pageHeader,headerName)).isDisplayed();
    }

    async isGridRecordPresent(searchRecord:string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(searchRecord);
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilityGrid.searchRecord(value);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnHeader);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async clearGridSearchBox(): Promise<void> {
        await utilityGrid.clearFilter();
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnHeader);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnHeader, sortType, this.selectors.gridGuid);
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnHeader);
    }

    async areGridColumnHeaderMatches(columnHeader: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnHeader);
    }

    async searchAndOpenDocumentTemplate(value: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(value);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async isAddDocumentTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.addDocumentTemplateBtn).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.addDocumentTemplateBtn).isDisplayed();
            } else return false;
        });
    }

    async isDeleteDocumentTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.deleteButton).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.deleteButton).isDisplayed();
            } else return false;
        });
    }

}

export default new DocumentTemplateConsolePage();