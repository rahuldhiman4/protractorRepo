import { element, by, $, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilCommon from '../../../utils/util.common';
import utilGrid from '../../../utils/util.grid';

class AcknowledgmentTemplateConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
            gridGuid: 'deb7a0eb-56a9-432d-9c4a-912cf4644086',
            delete: '[rx-view-component-id="b21478a3-5ca4-4d00-85d3-da3a5bc4ea96"] button',
            addAckTemplates: '.d-icon-left-plus',
    }

    async clickOnAddAcknowlegeTemplateButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addAckTemplates)));
        await element(by.cssContainingText(this.selectors.addAckTemplates, 'Acknowledgment Template')).click();
    }

    async clickOnDeleteButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.delete)));
        await $(this.selectors.delete).click();
    }

    async searchAndSelectGridRecord(value:string): Promise<void> {
        await utilGrid.searchAndSelectGridRecord(value);
    }

    async clickOnGridRefreshButton(): Promise<void> {
        await utilGrid.clickOnGridRefreshButton();
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

    async searchAndOpenAcknowledgmentTemplate(value: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(value);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async addFilter(fieldName: string, textValue: string,type:string): Promise<void> {
        await utilGrid.addFilter(fieldName,textValue,type);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async clearGridFilter(): Promise<void> {
        await utilGrid.clearFilter();
    }

    async isAddAcknowledgeTemplateButtonDisplayed(): Promise<boolean>{
        return await $(this.selectors.addAckTemplates).isPresent();
    }

    async isDeleteAcknowledgementTemplateButtonDisplayed(): Promise<boolean>{
        return await $(this.selectors.delete).isPresent();
    }
}

export default new AcknowledgmentTemplateConsolePage();