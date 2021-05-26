import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../../utils/utility.grid';

class AutomatedStatusTransitionConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addAutomatedTransitionButton: '[rx-view-component-id="9fa82257-c4fc-42a6-a652-6878fa70f097"] button',
        deleteButton: '[rx-view-component-id="ada73186-a453-4bbf-8b40-73939b7f2970"] button',
        editAutomatedStatusConfigBlade: '.modal-content',
        guid: 'c17656af-35ac-46b3-9a84-ed1660799274',
        lineOfBusiness: '[rx-view-component-id="e7cd0428-d55c-42e9-917f-1105df6051be"] button'
    } 

    async isAddAutomatedStatusTransitionBtnPresent(): Promise<boolean> {
        return await $(this.selectors.addAutomatedTransitionButton).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.addAutomatedTransitionButton).isDisplayed();
            } else {
                console.log("dynamic data not present");
                return false;
            }
        });
    }

    async isDeleteAutomatedStatusTransitionBtnPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).isPresent();
    }

    async clickAddAutomatedStatusTransitionBtn(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addAutomatedTransitionButton)));
        await $(this.selectors.addAutomatedTransitionButton).click();
    }

    async isAddAutomatedStatusTransitionBtnEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addAutomatedTransitionButton)));
        return await $(this.selectors.addAutomatedTransitionButton).isEnabled();
    }

    async openAutomatedTransitionConfig(configName: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(configName);
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.editAutomatedStatusConfigBlade)));
    }

    async addGridColumns(data: string[]): Promise<void> {
        await utilityGrid.addGridColumn(data, this.selectors.guid);
    }

    async areGridColumnMatches(data: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(data, this.selectors.guid);
    }

    async removeGridColumns(data: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(data, this.selectors.guid);
    }

    async isGridColumnSorted(columnName: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnName, 'descending', this.selectors.guid);
    }

    async getEnabledColumnValueOfRule(configName: string): Promise<string> {
        await utilityGrid.searchRecord(configName);
        return await utilityGrid.getFirstGridRecordColumnValue('Enabled', this.selectors.guid);
    }
}

export default new AutomatedStatusTransitionConfigConsolePage();