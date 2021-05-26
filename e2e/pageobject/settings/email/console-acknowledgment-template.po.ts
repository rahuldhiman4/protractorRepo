import { $, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../../utils/utility.grid';

class AcknowledgmentTemplateConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        gridGuid: 'deb7a0eb-56a9-432d-9c4a-912cf4644086',
        delete: '[rx-view-component-id="b21478a3-5ca4-4d00-85d3-da3a5bc4ea96"] button',
        addAckTemplates: '.d-icon-left-plus',
    }

    async clickOnAddAcknowlegeTemplateButton(): Promise<void> {
        await $(this.selectors.addAckTemplates).click();
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

    async clearGridSearchBox(): Promise<void> {
        await utilityGrid.clearSearchBox();
    }

    async removeColumnOnGrid(columnHeader: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnHeader, this.selectors.gridGuid);
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnHeader, sortType, this.selectors.gridGuid);
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnHeader,this.selectors.gridGuid );
    }

    async areGridColumnHeaderMatches(columnHeader: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnHeader, this.selectors.gridGuid);
    }

    async searchAndOpenAcknowledgmentTemplate(value: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(value);
    }

    async addFilter(fieldName: string, textValue: string, type: string): Promise<void> {
        await utilityGrid.addFilter(fieldName, textValue, type);
    }

    async clearGridFilter(): Promise<void> {
        await utilityGrid.clearFilter();
    }

    async isAddAcknowledgeTemplateButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.addAckTemplates).isPresent();
    }

    async isAddAcknowledgeTemplateButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.addAckTemplates).isEnabled();
    }

    async isDeleteAcknowledgementTemplateButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.delete).isPresent();
    }
}

export default new AcknowledgmentTemplateConsolePage();