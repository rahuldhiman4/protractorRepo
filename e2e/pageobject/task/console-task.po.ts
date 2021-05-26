import utilityCommon from '../../utils/utility.common';
import { $, $$, browser, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../utils/utility.grid';


class TaskGridPage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        searchTemplate: '.adapt-search-triggerable input[type="search"]',
        recommendedTemplateLink: '.at-data-row .btn-link',
        recommendedTemplateCheckBox: '.ui-grid-icon-ok',
        filter: 'button.d-icon-left-filter',
        availableFilterDrpDown: '.advanced-filter__container .advanced-filter__accordion-tab .text-direction span',
        applyFilter: '.rx-search-filter-heading__apply',
        removeFilter: '.close',
        tableValue: '.at-data-row .at-data-cell',
        taskTitle: '[rx-view-component-id="3ebf9e95-a77a-47f7-a531-c4c549e42333"] span',
        taskGuid: '9e02c1c1-6544-4d92-9114-823a9ff9fdcd',
        columnHeaders: '.c-header-container .c-header-name',
        LineOfBuisnessText: '[rx-view-component-id="dcba1505-ab0f-4af0-8e3a-3810413f32c1"] button'
    }

    async getSortedValueFromColumn(columnHeader: string): Promise<string> {
        columnHeader = "'" + columnHeader + "'";
        let guid: string = "'" + this.selectors.taskGuid + "'";
        let gridColumnHeaderPosition = `//*[@rx-view-component-id=${guid}]//span[@class="ui-grid-header-cell-label"][text()=${columnHeader}]/parent::div/parent::div[@role='columnheader']/parent::div/preceding-sibling::*`;
        let columnPosition: number = await element.all(by.xpath(gridColumnHeaderPosition)).count();
        columnPosition = columnPosition + 1;
        let sortedValue: string = await browser.element(by.xpath("(//*[@class='ui-grid-cell-contents'])" + "[" + columnPosition + "]")).getText()
        return sortedValue;
    }

    async clickonColumnHeader(value: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.columnHeaders, value)).click();
    }

    async getLineOfBuisnessText(): Promise<string> {
        return await $(this.selectors.LineOfBuisnessText).getText();
    }

    async isLineOfBuisnessEnable(): Promise<boolean> {
        return await $(this.selectors.LineOfBuisnessText).isEnabled();
    }

    async isTaskTypeFilterValue(taskTypeValue: string): Promise<boolean> {
        let arr: string[] = await utilityGrid.getAllValuesFromColumn('Task Type');
        let unique = arr.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        });
        return unique.length === 1 && unique[0] === taskTypeValue;
    }

    async setTaskSearchBoxValue(input: string): Promise<void> {
        await $(this.selectors.searchTemplate).clear();
        await $(this.selectors.searchTemplate).sendKeys(input, Key.ENTER);
    }

    async getTaskTitle(): Promise<string> {
        return await $(this.selectors.taskTitle).getText();
    }

    async clickFirstCheckBoxInTaskTemplateSearchGrid(): Promise<void> {
        await $(this.selectors.recommendedTemplateCheckBox).click();
    }
    async getFilteredValue(filterName: string): Promise<string> {
        return await element(by.cssContainingText(this.selectors.tableValue, filterName)).getText();
    }

    async clearFilter(): Promise<void> {
        await utilityGrid.clearFilter()
    }

    async searchAndOpenTask(taskId: string): Promise<void> {
        await this.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(taskId);
    }

    async isFieldLabelDisplayed(labelName: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskGuid, labelName);
    }

    async applyFilter(fieldName: string, textValue: string, type: string): Promise<void> {
        await utilityGrid.addFilter(fieldName, textValue, type);
    }
}
export default new TaskGridPage();