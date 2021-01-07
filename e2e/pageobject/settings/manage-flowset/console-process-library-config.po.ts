import { $,element,by, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../../utils/util.grid';

class ConsoleProcessLibrary {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addRegisterProcessButton: '[rx-view-component-id="07cee854-7e4b-4760-8dcf-71a9fa1c211b"] button',//same
        registerProcessGuid: '1aed89be-c517-4afb-a5bc-ad1e82652a6c',
        summaryField1: 'input[id="adapt-search-unique-5"]',//done
        searchButton1: '.adapt-search-button',//done
    }

    async isProcessPresentOnGrid(process: string): Promise<boolean> {
        return await element(by.cssContainingText('.ui-grid-cell-contents', process)).isPresent().then(async (result) => {
            if(result){
                return await element(by.cssContainingText('.ui-grid-cell-contents', process)).getText() == process ? true : false;
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
        await utilGrid.searchAndOpenHyperlink(flowset);
    }

    async isAliasNamePresentOnGrid(alias: string): Promise<boolean> {
        await utilGrid.searchOnGridConsole(alias);
        return await element(by.cssContainingText('.ui-grid__link', alias)).isPresent().then(async (result) => {
            if(result){
                return await element(by.cssContainingText('.ui-grid__link', alias)).getText() == alias ? true : false;
            } else {
                console.log("Flowset not present");
                return false;
            }
        });
    }


    async clickOnRefreshButton(): Promise<void> {
        await utilGrid.clickOnGridRefreshButton();
    }

    async isAllVisibleColumnPresent(availableValues: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.registerProcessGuid, availableValues);
    }

    async addColumn(column: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.registerProcessGuid, column);
    }

    async removeColumn(column: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.registerProcessGuid, column);
    }

    async getSortedValuesFromColumn(columnHeader: string): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(columnHeader, 'ascending', this.selectors.registerProcessGuid);
    }

    async clearSearchBox(): Promise<void> {
        await $(this.selectors.summaryField1).clear();
    }

    async isColumnContainsSameValue(columnName: string, value: string): Promise<boolean> {
        return await utilGrid.isEntireColumnContainsSameValue(columnName, value, this.selectors.registerProcessGuid);
    }

    async getFirstValueOfColumn(columnName: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.registerProcessGuid, columnName);
    }
}

export default new ConsoleProcessLibrary();