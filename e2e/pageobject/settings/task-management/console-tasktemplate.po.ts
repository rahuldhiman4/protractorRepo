import { $, $$, browser, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../../utils/util.grid';

class TaskTemplateGridPage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        manualTaskTemplateButton: '[rx-view-component-id="6843466b-bf58-47d1-baf4-97b3c9be4598"] button',
        automationtaskTemplateButton: '[rx-view-component-id="847d80e6-19ca-46ef-b01a-5a3581f784d7"] button',
        externalTaskTemplateButton: '[rx-view-component-id="df859ce0-47e3-4b61-937d-8d7ff3b64c0a"] button',
        copyTaskTemplate: '[rx-view-component-id="48afba80-4d39-4c1a-a420-1c01992cd937"] button',
        searchTemplate: '.adapt-search-triggerable input',
        recommendedTemplateLink: '.ui-selectable-row a',
        recommendedTemplateCheckBox: '.radio__label input',
        filter: 'button.d-icon-left-filter',
        availableFilterDrpDown: '.advanced-filter__container .advanced-filter__accordion-tab .text-direction span',
        refreshButton: 'button[rx-id="refresh-button"]',
        removeFilter: '.close-inverse',
        taskTemplateGuid: 'a302e830-198e-4fcc-b176-5679fc1fef43',
        columnTitle: '.c-header__separator',
    }

    async setTaskSearchBoxValue(input: string): Promise<void> {
        await $(this.selectors.searchTemplate).clear();
        await $(this.selectors.searchTemplate).sendKeys(input, Key.ENTER);
    }

    async searchAndOpenTaskTemplate(taskName: string): Promise<void> {
        await utilGrid.clearFilter();
        await utilGrid.searchAndOpenHyperlink(taskName);
    }

    async searchAndSelectTaskTemplate(taskName: string): Promise<void> {
        await utilGrid.clearFilter();
        await utilGrid.searchAndSelectGridRecord(taskName);
    }

    async addColumn(columnName: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.taskTemplateGuid, columnName)
    }

    async removeColumn(columnName: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.taskTemplateGuid, columnName)
    }

    async clickOnManualTaskTemplateButton(): Promise<void> {
        await $(this.selectors.manualTaskTemplateButton).click();
    }

    async isManualTaskTemplateButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.manualTaskTemplateButton).isEnabled();
    }

    async clickOnAutomationTaskTemplateButton(): Promise<void> {
        await $(this.selectors.automationtaskTemplateButton).click();
    }

    async isAutomationTaskTemplateButtonEnabled(): Promise<boolean> {
      return await $(this.selectors.automationtaskTemplateButton).isEnabled();
    }

    async clickOnExtrnalTaskTemplateButton(): Promise<void> {
        await $(this.selectors.externalTaskTemplateButton).click();
    }

    async isExtrnalTaskTemplateButtonEnabled(): Promise<boolean> {
      return await $(this.selectors.externalTaskTemplateButton).isEnabled();
    }

    async clickOnCopyTaskTemplateButton(): Promise<void> {
        await $(this.selectors.copyTaskTemplate).click();
    }

    async clickOnApplyFilter(filterName: string, filtervalue: string): Promise<void> {
        await $(this.selectors.filter).click();
        await element(by.cssContainingText(this.selectors.availableFilterDrpDown, filterName)).click();
        if (filterName.localeCompare('Task Type') || filterName.localeCompare('Template Status')) {
            let dropDown = await $(`[title="${filtervalue}"]`);
            await dropDown.click();
        } else {
            const dropDown = await $(`[title="${filterName}"]`);
            await dropDown.sendKeys(filtervalue, Key.ENTER);
        }
        await $(this.selectors.filter).click();
    };

    async isTaskTypeFilterValue(taskTypeValue: string): Promise<boolean> {
        let arr: string[] = await utilGrid.getAllValuesFromColoumn((this.selectors.taskTemplateGuid), 'Task Type');
        let unique = arr.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        });
        return unique.length === 1 && unique[0] === taskTypeValue;
    }

    async isFilterNamePresent(filterName: string): Promise<void> {
        await $(this.selectors.filter).click();
        await element(by.cssContainingText(this.selectors.availableFilterDrpDown, filterName)).isDisplayed();
    }

    async isFilteredTemplateDisplayed(filterName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.recommendedTemplateLink, filterName)).click();
    }

    async isAllColumnTitleDisplayed(data: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.taskTemplateGuid, data);
    }

    async clickOnColumnAndIsColumnSortedAsending(column: string): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(column, 'ascending', this.selectors.taskTemplateGuid);
    }

    async clickOnColumnAndIsColumnSortedDescending(column: string): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(column, 'descending', this.selectors.taskTemplateGuid);
    }

    async getFirstRecordValue(columnName: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.taskTemplateGuid, columnName);
    }

    async isAddManualTaskTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.manualTaskTemplateButton).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.manualTaskTemplateButton).isDisplayed();
            } else return false;
        });
    }

    async isAddAutomatedTaskTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.automationtaskTemplateButton).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.automationtaskTemplateButton).isDisplayed();
            } else return false;
        });
    }

    async isAddExternalTaskTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.externalTaskTemplateButton).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.externalTaskTemplateButton).isDisplayed();
            } else return false;
        });
    }

    async isCopyTaskTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.copyTaskTemplate).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.copyTaskTemplate).isDisplayed();
            } else return false;
        });
    }

    async isCompanyColumnValueMatches(expectedValues: string[]): Promise<boolean> {
        let actualValues: string[] = await utilGrid.getAllValuesFromColoumn(this.selectors.taskTemplateGuid, 'Task Company');
        actualValues.sort(function (a, b) {
            return a.localeCompare(b);
        });
        expectedValues.sort(function (a, b) {
            return a.localeCompare(b);
        });
        return actualValues.length === expectedValues.length && actualValues.every(
            (value, index) => (value === expectedValues[index])
        );
    }

}
export default new TaskTemplateGridPage();