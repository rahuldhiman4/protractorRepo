import { $,element,by, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../../utils/utility.grid';

class ConsoleProcessLibrary {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addRegisterProcessButton: '[rx-view-component-id="07cee854-7e4b-4760-8dcf-71a9fa1c211b"] button',//same
        registerProcessGuid: '1aed89be-c517-4afb-a5bc-ad1e82652a6c',
        summaryField1: 'input[id="adapt-search-unique-5"]',//done
        searchButton1: '.adapt-search-button',//done
    }

    async isProcessPresentOnGrid(process: string): Promise<boolean> {
        return await element(by.cssContainingText('.at-data-cell', process)).isPresent().then(async (result) => {
            if(result){
                return await element(by.cssContainingText('.at-data-cell', process)).getText() == process ? true : false;
            } else {
                console.log("Flowset not present");
                return false;
            }
        });
    }

    async clickOnRegisterProcess(): Promise<void> {
        await $(this.selectors.addRegisterProcessButton).click();
    }

    async isRegisterProcessEnable(): Promise<boolean> {
        return await $(this.selectors.addRegisterProcessButton).isEnabled();
    }

    async isRegisterProcessDisplayed(): Promise<boolean> {
        return await $(this.selectors.addRegisterProcessButton).isPresent();
    }


    async searchAndSelectFlowset(flowset: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(flowset);
    }

    async isAliasNamePresentOnGrid(alias: string): Promise<boolean> {
        await utilityGrid.isGridRecordPresent(alias);
        return await element(by.cssContainingText('.at-data-row a', alias)).isPresent().then(async (result) => {
            if(result){
                return await element(by.cssContainingText('.at-data-row a', alias)).getText() == alias ? true : false;
            } else {
                console.log("Flowset not present");
                return false;
            }
        });
    }


    async clickOnRefreshButton(): Promise<void> {
        await utilityGrid.clickRefreshIcon();
    }

    async isAllVisibleColumnPresent(availableValues: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches( availableValues,this.selectors.registerProcessGuid);
    }

    async addColumn(column: string[]): Promise<void> {
        await utilityGrid.addGridColumn(column,this.selectors.registerProcessGuid);
    }

    async removeColumn(column: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(column,this.selectors.registerProcessGuid);
    }

    async getSortedValuesFromColumn(columnHeader: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnHeader, 'ascending', this.selectors.registerProcessGuid);
    }

    async clearSearchBox(): Promise<void> {
        await $(this.selectors.summaryField1).clear();
    }

    async isColumnContainsSameValue(columnName: string, value: string): Promise<boolean> {
        return await utilityGrid.isEntireColumnContainsSameValue(columnName, value, this.selectors.registerProcessGuid);
    }

    async getFirstValueOfColumn(columnName: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(this.selectors.registerProcessGuid, columnName);
    }
}

export default new ConsoleProcessLibrary();