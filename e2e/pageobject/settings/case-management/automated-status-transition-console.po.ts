import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../../utils/util.grid';

class AutomatedStatusTransitionConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addAutomatedTransitionButton: '[rx-view-component-id="9fa82257-c4fc-42a6-a652-6878fa70f097"] button',
        deleteButton: '[rx-view-component-id="ada73186-a453-4bbf-8b40-73939b7f2970"] button',
        editAutomatedStatusConfigBlade: '.modal-content',
        guid: 'c17656af-35ac-46b3-9a84-ed1660799274'
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
        await utilGrid.searchAndOpenHyperlink(configName);
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.editAutomatedStatusConfigBlade)));
    }

    async addGridColumns(data: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.guid, data);
    }

    async areGridColumnMatches(data: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.guid, data);
    }

    async removeGridColumns(data: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.guid, data);
    }

    async isGridColumnSorted(columnName: string): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(columnName, 'descending', this.selectors.guid);
    }

    async getEnabledColumnValueOfRule(configName: string): Promise<string> {
        await utilGrid.searchRecord(configName);
        return await utilGrid.getSelectedGridRecordValue(this.selectors.guid, 'Enabled');
    }
}

export default new AutomatedStatusTransitionConfigConsolePage();