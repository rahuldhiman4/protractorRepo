import { element, by, $, protractor, ProtractorExpectedConditions, browser, $$ } from "protractor";
import utilGrid from '../../../utils/util.grid';

class FieldAssociationMappingConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
            gridGuid: '2f422268-a7c7-436c-8490-57cc4294018a',
            pageHeader: '[rx-view-component-id="3ef28d37-3f56-4bba-ba13-9f102071b34b"] p span',
            deleteButton: '[rx-view-component-id="5c759d50-8e78-4805-b0c2-29e972b0b118"] button',
            addFieldAssociationMapping: '[rx-view-component-id="50b53a4f-9c57-4909-b395-f0b5afbf8c60"] span',
    }

    async selectCheckBox(record:string): Promise<void> {
        await utilGrid.searchAndSelectGridRecord(record);
    }

    async clickAddFieldAssociationMapping(): Promise<void> {
        await $$(this.selectors.addFieldAssociationMapping).get(0).click();
    }


    async clickOnDeleteButton(): Promise<void> {
        await $(this.selectors.deleteButton).click();
    }

    async clickOnGridRefreshButton(): Promise<void> {
        await utilGrid.clickOnGridRefreshButton();
    }

    async addFilter(fieldName: string, textValue: string, type: string): Promise<void> {
        await utilGrid.addFilter(fieldName, textValue, type);
    }

    async isHeaderDisplayed(headerName:string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.pageHeader,headerName)).isDisplayed();
    }

    async isGridRecordPresent(searchRecord:string): Promise<boolean> {
        return await utilGrid.isGridRecordPresent(searchRecord);
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilGrid.searchOnGridConsole(value);
    }

    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.gridGuid, columnHeader);
    }

    async clearGridSearchBox(): Promise<void> {
        await utilGrid.clearGridSearchBox();
    }

    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.gridGuid, columnHeader);
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

    async searchAndOpenFieldAssociationMappingRecord(value: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(value);
    }
}

export default new FieldAssociationMappingConsole();