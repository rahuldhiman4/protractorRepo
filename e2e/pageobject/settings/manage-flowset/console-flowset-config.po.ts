import { compact } from "lodash";
import { $, by, element, protractor, ProtractorExpectedConditions } from "protractor";

import utilityGrid from  '../../../utils/utility.grid';

class ConsoleFlowset {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addFlowsetButton: '[rx-view-component-id="061b4a18-bba7-4f39-b545-c8a5216851df"] button',
        flowsetGuid: '99dc49f0-0f0e-4ec2-9b31-c0766ba23885',
        summaryField1: 'input[class="form-control adapt-search-field-ellipsis ng-pristine ng-valid ng-touched"]',//done
        searchButton1: 'button[btn-type="secondary"]',//done
        threeDots: '.d-icon-eye_closed',
        refreshBtn: '.d-icon-refresh',
    }

    async isAddFlowsetButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.addFlowsetButton).isPresent();
    }

    async isAddFlowsetButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.addFlowsetButton).isEnabled();
    }

    async clickOnAddFlowset(): Promise<void> {
        await $(this.selectors.addFlowsetButton).click();
    }

    async clickGridRefreshButton(): Promise<void> {
        await utilityGrid.clickRefreshIcon();
    }

    async getSortedValuesFromColumn(columnHeader: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnHeader, 'ascending', this.selectors.flowsetGuid);
    }

    async isAllVisibleColumnPresent(availableValues: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches( availableValues, this.selectors.flowsetGuid);
    }

    async searchAndSelectFlowset(flowset: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(flowset);
    }

    async addColumn(column: string[]): Promise<void> {
        await utilityGrid.addGridColumn(column, this.selectors.flowsetGuid);
    }

    async removeColumn(column: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(column,this.selectors.flowsetGuid);
    }

    async isFlowsetPresentOnGrid(flowset: string): Promise<boolean> {
         console.log(flowset);
      return  await utilityGrid.isGridRecordPresent(flowset);
        // console.log(flowset);
        // return await element(by.cssContainingText('.ui-grid__link', flowset)).isPresent().then(async (result) => {
        //     if(result){
        //         return await element(by.cssContainingText('.ui-grid__link', flowset)).getText() == flowset ? true : false;
        //     } else {
        //         console.log("Flowset not present");
        //         return false;
        //     }
        // });
    }

    async clearSearcBox(): Promise<void> {
        await utilityGrid.clearFilter();
    }

    async isDecriptionPresentOnGrid(description: string): Promise<boolean> {
        return  await utilityGrid.isGridRecordPresent(description);
        //return await element(by.cssContainingText('.ui-grid-cell-contents', description)).getText() == description ? true : false;
    }
}

export default new ConsoleFlowset();