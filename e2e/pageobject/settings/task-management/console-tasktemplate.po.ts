import { $, $$, browser, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../../utils/util.grid';

class TaskTemplateGridPage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addColumnCheckBox: '.d-dropdown__menu-options .d-dropdown__menu-options-item-option',
        manualTaskTemplateButton: '[rx-view-component-id="6843466b-bf58-47d1-baf4-97b3c9be4598"] button',
        automationtaskTemplateButton: '[rx-view-component-id="847d80e6-19ca-46ef-b01a-5a3581f784d7"] button',
        externalTaskTemplateButton: '[rx-view-component-id="df859ce0-47e3-4b61-937d-8d7ff3b64c0a"] button',
        copyTaskTemplate: '[rx-view-component-id="48afba80-4d39-4c1a-a420-1c01992cd937"] button',
        searchTemplate: '[rx-id="search-text-input"]',
        recommendedTemplateLink: '.ui-grid__link',
        recommendedTemplateCheckBox: '.ui-grid-icon-ok',
        filter: '.rx-search-filter__trigger',
        availableFilterDrpDown: '.d-accordion__title',
        applyFilter: '.rx-search-filter-heading__apply',
        removeFilter: '..d-tag-remove-button',
        taskTemplateGuid: 'a302e830-198e-4fcc-b176-5679fc1fef43',
        columnTitle: '.ui-grid-header-cell-label',
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

    async clickOnAutomationTaskTemplateButton(): Promise<void> {
        await $(this.selectors.automationtaskTemplateButton).click();
    }

    async clickOnExtrnalTaskTemplateButton(): Promise<void> {
        await $(this.selectors.externalTaskTemplateButton).click();
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
        await $(this.selectors.applyFilter).click();
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

    async getFirstRecordValue(columnName: string) : Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.taskTemplateGuid, columnName);
    }

    async isAddManualTaskTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.manualTaskTemplateButton).then(async (result) => {
            if (result) {
                return await $(this.selectors.manualTaskTemplateButton).isDisplayed();
            } else return false;
        });
    }

    async isAddAutomatedTaskTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.automationtaskTemplateButton).then(async (result) => {
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

}
export default new TaskTemplateGridPage();