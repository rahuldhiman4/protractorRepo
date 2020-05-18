import { $, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../../utils/util.grid';

class ConsoleFlowset {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addFlowsetButton: '[rx-view-component-id="061b4a18-bba7-4f39-b545-c8a5216851df"] button',
        flowsetGuid: '99dc49f0-0f0e-4ec2-9b31-c0766ba23885',
        summaryField1: 'input[role="search"]',
        searchButton1: 'button[rx-id="submit-search-button"]',
        threeDots: '.d-dropdown_selected-columns',
        refreshBtn: '.rx-record-grid-toolbar__refresh',
    }

    async isAddFlowsetButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addFlowsetButton)));
        return await $(this.selectors.addFlowsetButton).isPresent();
    }

    async clickOnAddFlowset(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addFlowsetButton)));
        await $(this.selectors.addFlowsetButton).click();
    }

    async clickGridRefreshButton(): Promise<void> {
        await utilGrid.clickOnGridRefreshButton();
    }

    async getSortedValuesFromColumn(columnHeader: string): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(columnHeader, 'ascending', this.selectors.flowsetGuid);
    }

    async isAllVisibleColumnPresent(availableValues: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.flowsetGuid, availableValues);
    }

    async searchAndSelectFlowset(flowset: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(flowset);
    }

    async addColumn(column: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.flowsetGuid, column);
    }

    async removeColumn(column: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.flowsetGuid, column);
    }

    async isFlowsetPresentOnGrid(flowset: string): Promise<boolean> {
        await utilGrid.searchOnGridConsole(flowset);
        return await element(by.cssContainingText('.ui-grid__link', flowset)).isPresent().then(async (result) => {
            if(result){
                return await element(by.cssContainingText('.ui-grid__link', flowset)).getText() == flowset ? true : false;
            } else {
                console.log("Flowset not present");
                return false;
            }
        });
    }

    async clearSearcBox(): Promise<void> {
        await utilGrid.clearGridSearchBox();
    }

    async isDecriptionPresentOnGrid(description: string): Promise<boolean> {
        await utilGrid.searchOnGridConsole(description);
        return await element(by.cssContainingText('.ui-grid-cell-contents', description)).getText() == description ? true : false;
    }
}

export default new ConsoleFlowset();