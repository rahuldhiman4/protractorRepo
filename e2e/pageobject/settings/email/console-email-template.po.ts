import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../../utils/utility.grid';

class ConsoleEmailTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        gridGuid: '67dc7c19-05bd-4c7b-8aaf-812a97783d77',
        delete: '[rx-view-component-id="a5e75632-1fa2-4432-9903-8521a89cfdc2"] button',
        addEmailTemplate: '[rx-view-component-id="c293ce64-f48e-42cd-ab05-cf5f36d70a91"] button',
    }

    async clickOnAddEmailTemplateButton(): Promise<void> {
        await $(this.selectors.addEmailTemplate).click();
    }

    async clickOnDeleteButton(): Promise<void> {
        await $(this.selectors.delete).click();
    }

    async searchAndSelectGridRecord(value: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(value);
    }

    async clickOnGridRefreshButton(): Promise<void> {
        await utilityGrid.clickRefreshIcon();
    }

    async isGridRecordPresent(searchRecord: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(searchRecord);
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilityGrid.searchRecord(value);
    }

    async addColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnHeader, this.selectors.gridGuid);
    }

    async addFilter(fieldName: string, textValue: string, type: string): Promise<void> {
        await utilityGrid.addFilter(fieldName, textValue, type);
    }

    async clearGridSearchBox(): Promise<void> {
        await utilityGrid.clearSearchBox();
    }

    async clearGridFilter(): Promise<void> {
        await utilityGrid.clearFilter();
    }

    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnHeader, this.selectors.gridGuid);
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnHeader, sortType, this.selectors.gridGuid);
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue( columnHeader,this.selectors.gridGuid);
    }

    async areGridColumnHeaderMatches(columnHeader: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnHeader, this.selectors.gridGuid);
    }

    async searchAndOpenEmailTemplate(value: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(value);
    }

    async isAddEmailTemplateButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.addEmailTemplate).isPresent();
    }

    async isAddEmailTemplateButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.addEmailTemplate).isEnabled();
    }

    async isDeleteEmailTemplateButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.delete).isPresent();
    }
}
export default new ConsoleEmailTemplate();