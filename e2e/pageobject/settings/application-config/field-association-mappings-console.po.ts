import { element, by, $, protractor, ProtractorExpectedConditions, browser, $$ } from "protractor";
import utilityGrid from '../../../utils/utility.grid';

class FieldAssociationMappingConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
            gridGuid: '2f422268-a7c7-436c-8490-57cc4294018a',
            pageHeader: '[rx-view-component-id="3ef28d37-3f56-4bba-ba13-9f102071b34b"] p span',
            deleteButton: '[rx-view-component-id="5c759d50-8e78-4805-b0c2-29e972b0b118"] button',
            addFieldAssociationMapping: '[rx-view-component-id="50b53a4f-9c57-4909-b395-f0b5afbf8c60"] span',
    }

    async selectCheckBox(record:string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(record);
    }

    async clickAddFieldAssociationMapping(): Promise<void> {
        await $$(this.selectors.addFieldAssociationMapping).get(0).click();
    }


    async clickOnDeleteButton(): Promise<void> {
        await $(this.selectors.deleteButton).click();
    }

    async clickOnGridRefreshButton(): Promise<void> {
        await utilityGrid.clickRefreshIcon();
    }

    async addFilter(fieldName: string, textValue: string, type: string): Promise<void> {
        await utilityGrid.addFilter(fieldName, textValue, type);
    }

    async isHeaderDisplayed(headerName:string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.pageHeader,headerName)).isDisplayed();
    }

    async isGridRecordPresent(searchRecord:string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(searchRecord);
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilityGrid.searchRecord(value);
    }

    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.addGridColumn( columnHeader,this.selectors.gridGuid);
    }

    async clearGridSearchBox(): Promise<void> {
        await utilityGrid.clearSearchBox();
    }

    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnHeader,this.selectors.gridGuid);
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnHeader, sortType, this.selectors.gridGuid);
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnHeader,this.selectors.gridGuid);
    }

    async areGridColumnHeaderMatches(columnHeader: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnHeader,this.selectors.gridGuid);
    }

    async searchAndOpenFieldAssociationMappingRecord(value: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(value);
    }
}

export default new FieldAssociationMappingConsole();