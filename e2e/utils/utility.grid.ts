import { $, $$, Key, element, by, ElementFinder, browser } from 'protractor';
import utilityCommon from '../utils/utility.common';

export class GridOperations {

    selectors = {
        searchTextBox: '.adapt-search-triggerable input',
        clearSearchBoxButton: '.adapt-search-triggerable .adapt-search-clear',
        gridRowLinks: '.at-data-row .btn-link',
        gridRowHyperLinks: '.btn-link',
        gridRows: '.at-data-row',
        gridCheckbox: '.ui-chkbox-box',
        appliedPresetFilter: '.a-tag-active span',
        filterPresetBtn: 'button.d-icon-left-filter',
        clearBtn: '.advanced-filter__actions-buttons',
        addVisibleColumnsIcon: 'button.d-icon-left-lines_vertical',
        gridColumnSelect: '.dropdown-item .checkbox__input',
        gridHeaders: '.c-header-container .c-header-name',
        gridCellData: '.at-data-row .at-data-cell',
        filterItems: '.advanced-filter__container .advanced-filter__accordion-tab .text-direction span',
        filterCheckboxOptions: '.a-select-inline__list .a-select-inline__item .checkbox__label',
        filterTab: '.nav-item button',
        visibleColumnButton: '.d-icon-left-lines_vertical',
        selectCheckbox: '.ui-chkbox-box',
        selectRadioButton: '.radio__label input'
    }

    async searchRecord(searchValue: string, guid?: string): Promise<void> {
        let searchTextBoxLocator: string = this.selectors.searchTextBox;
        if (guid) { searchTextBoxLocator = `[rx-view-component-id="${guid}"] ` + searchTextBoxLocator; }
        await $(searchTextBoxLocator).clear();
        await $(searchTextBoxLocator).sendKeys(searchValue + Key.ENTER);
    }

    async isGridRecordPresent(searchRecord: string, guid?: string): Promise<boolean> {
        let searchTextBoxLocator: string = this.selectors.searchTextBox;
        let gridRowLinks: string = this.selectors.gridRowLinks;
        if (guid) {
            searchTextBoxLocator = `[rx-view-component-id="${guid}"] ` + searchTextBoxLocator;
            gridRowLinks = `[rx-view-component-id="${guid}"] ` + gridRowLinks;
        }
        await $(searchTextBoxLocator).clear();
        await $(searchTextBoxLocator).sendKeys(searchRecord + Key.ENTER);
        return await $(gridRowLinks).isPresent();
    }

    async clickCheckBoxOfValueInGrid(value: string, guid?: string): Promise<void> {
        let gridGuid: string = '';
        if (guid) { gridGuid = `[rx-view-component-id="${guid}"] `; }
        let rowLocator = await $$(gridGuid + this.selectors.gridRows);

        for (let i: number = 0; i < await rowLocator.length; i++) {
            let tempRowLocator = await $$(gridGuid + this.selectors.gridRows).get(i);
            let tempHyperLinkLocator = await tempRowLocator.$(this.selectors.gridRowHyperLinks);
            let linkText: string = await tempHyperLinkLocator.getText();
            if (linkText.trim() == value) {
                await tempRowLocator.$(this.selectors.gridCheckbox).click();
                break;
            }
        }
    }

    async clearFilter(guid?: string): Promise<void> {
        let gridGuid: string = ''
        if (guid) {
            this.selectors.appliedPresetFilter = gridGuid + this.selectors.appliedPresetFilter;
            this.selectors.filterPresetBtn = gridGuid + this.selectors.filterPresetBtn;
            this.selectors.clearBtn = gridGuid + this.selectors.clearBtn;
        }
        await $(this.selectors.appliedPresetFilter).isPresent().then(async (result) => {
            if (result) {
                await $(this.selectors.filterPresetBtn).click();
                await $(this.selectors.clearBtn).click();
            } else {
                console.log("Filters are already cleared");
            }
        })
    }

    async addGridColumn(columnNameList: string[], guid?: string): Promise<void> {
        await this.addOrRemoveGridColumn(columnNameList, 'false', guid);
    }

    async removeGridColumn(columnNameList: string[], guid?: string): Promise<void> {
        await this.addOrRemoveGridColumn(columnNameList, 'true', guid);
    }

    async addOrRemoveGridColumn(columnNameList: string[], removeColumn: string, guid?: string): Promise<void> {
        let guidComponent = '';
        if (guid) {
            guidComponent = `[rx-view-component-id="${guid}"]`;
        }
        await $(guidComponent + this.selectors.visibleColumnButton).click();

        let allVisibleColumnCheckboxes = await $$('.a-dropdown-window--menu label');
        for (let i: number = 0; i < allVisibleColumnCheckboxes.length; i++) {
            let singleVisibleColumn = allVisibleColumnCheckboxes[i];
            let isCheckBoxChecked = await singleVisibleColumn.$('input').getAttribute('aria-checked');
            let columnName = await singleVisibleColumn.$$('span').get(1).getText();
            if (columnNameList.includes(columnName) && isCheckBoxChecked == removeColumn) {
                await singleVisibleColumn.click();
            }
        }
        await $(guidComponent + this.selectors.visibleColumnButton).click();
    }

    async areColumnHeaderMatches(expetcedHeaders: string[], guid?: string): Promise<boolean> {
        let actualHeaders = await element.all(by.css(".c-header-container .c-header-name"))
            .map(async function (header) {
                return await header.getAttribute('innerText');
            })
        actualHeaders.sort();
        expetcedHeaders.sort();
        return actualHeaders.length === expetcedHeaders.length && actualHeaders.every(
            (value, index) => (value === expetcedHeaders[index])
        );
    }

    async searchAndOpenHyperlink(id: string, guid?: string): Promise<void> {
        if (guid) {
            await this.searchRecord(id, guid);
            await $$(`[rx-view-compone=nt-id='${guid}'] ` + this.selectors.gridRowLinks).first().click();
        }
        else {
            await this.searchRecord(id);
            await $$(this.selectors.gridRowLinks).first().click();
        }
    }

    async getFirstGridRecordColumnValue(columnName: string, guid?: string): Promise<string> {
        let count: number = 0;
        if (guid) {
            this.selectors.gridHeaders = `[rx-view-compone=nt-id='${guid}'] ` + this.selectors.gridHeaders;
            this.selectors.gridCellData = `[rx-view-compone=nt-id='${guid}'] ` + this.selectors.gridCellData;
        }
        let headersLocator = await $$(this.selectors.gridHeaders);
        for (let i: number = 0; i < await headersLocator.length; i++) {
            count = count + 1;
            let tempLocator = await $$(this.selectors.gridHeaders).get(i);
            if (await tempLocator.getText() == columnName) { break; }
        }
        return await $$(this.selectors.gridCellData).get(count - 1).getAttribute('innerText');
    }

    async getAllValuesFromColumn(columnHeader: string, guid?: string): Promise<string[]> {
        let allElement = this.selectors.gridCellData;
        let gridColumnHeaderList = await $$(this.selectors.gridHeaders);
        if (guid) {
            gridColumnHeaderList = await $$(`[rx-view-compone=nt-id='${guid}'] ` + this.selectors.gridHeaders);
            allElement = `[rx-view-component-id='${guid}'] ` + this.selectors.gridCellData;
        }
        let columnPosition = 0;
        for (let i: number = 0; i < gridColumnHeaderList.length; i++) {
            if (await gridColumnHeaderList[i].getText() == columnHeader) {
                columnPosition = i;
            }
        }
        let gridRecord: string[] = [];
        let allElementSize: number = await element.all(by.css(allElement)).count();
        let coloumnSize: number = gridColumnHeaderList.length;

        for (columnPosition; columnPosition < allElementSize; columnPosition = columnPosition + coloumnSize) {
            let allGrid: ElementFinder[] = await $$(allElement);
            gridRecord[columnPosition] = await allGrid[columnPosition].getText();
        }
        let returnedvalue = gridRecord.filter(function (el) {
            return el != null;
        });
        return returnedvalue;
    }

    async getNumberOfRecordsInGrid(guid?: string): Promise<number> {
        if (guid) { return await (await $$(`[rx-view-component-id='${guid}'] ` + this.selectors.gridRows)).length }
        else { return await (await $$(this.selectors.gridRows)).length; }
    }

    //Accepts sortType as 'asc' or 'desc'
    async isGridColumnSorted(columnName: string, sortType: string, guid?: string): Promise<boolean> {
        let columnHeaderLocator = this.selectors.gridHeaders;
        let columnContainerLocator = '.c-header-container';
        if (guid) {
            columnHeaderLocator = `[rx-view-component-id='${guid}'] ` + this.selectors.gridHeaders;
            columnContainerLocator = `[rx-view-component-id='${guid}'] ` + '.c-header-container';
        }
        let columnHeaderContainer = await $$(columnContainerLocator);
        for (let i = 0; i < await columnHeaderContainer.length; i++) {
            if (await $$(columnHeaderLocator).get(i).getText() == columnName) {
                for (let j = 0; j < 3; j++) {
                    let b: string = await $$(columnContainerLocator).get(i).$$('.c-header-sort svg path').getAttribute('class') + '';
                    if (b.includes('ng-star-inserted') && b.includes(sortType)) break;
                    else await $$(columnContainerLocator).get(i).$$('.c-header-sort').click();
                }
            }
        }
        let columnData: string[] = undefined;
        if (guid) columnData = await this.getAllValuesFromColumn(columnName, guid);
        else columnData = await this.getAllValuesFromColumn(columnName);

        const copy = Object.assign([], columnData);
        await columnData.sort(function (a, b) {
            return a.localeCompare(b);
        })
        if (sortType == "desc") {
            columnData.reverse();
        }
        return columnData.length === copy.length && columnData.every(
            (value, index) => (value === copy[index])
        );
    }

    async addFilter(fieldName: string, textValue: string, type: string, guid?: string): Promise<void> {
        let guidId: string = "";
        if (guid) { guidId = `[rx-view-component-id="${guid}"] `; }
        await $(guidId + this.selectors.filterPresetBtn).click();
        let filterCount = await $$(this.selectors.filterItems);
        for (let i = 0; i < await filterCount.length; i++) {
            let tempLocator = $$(this.selectors.filterItems).get(i);
            if (await tempLocator.getText() == fieldName) {
                await tempLocator.click();
                break;
            }
        }
        switch (type) {
            case "checkbox": {
                await element(by.cssContainingText(this.selectors.filterCheckboxOptions, textValue)).click();
                break;
            }
            case "date": {
                await utilityCommon.setDateField(guid, textValue);
            }
            default: {
                let aloc = await $('.card[aria-selected="true"] .adapt-mt');
                let action = await browser.actions().mouseMove(aloc).click();
                await action.sendKeys(textValue + Key.ENTER).perform();
                break;
            }
        }
        await browser.refresh();
    }

    async applyPresetFilter(filterName: string, guid?: string): Promise<void> {
        let guidId: string = "";
        if (guid) { guidId = `[rx-view-component-id="${guid}"] `; }
        await $(guidId + this.selectors.filterPresetBtn).click();
        await $$(this.selectors.filterTab).get(1).click();
        await element(by.cssContainingText('.radio__item', filterName)).click();
        await browser.refresh();
    }

    async getAppliedFilterName(guid?: string): Promise<string> {
        if (guid) return $(`[rx-view-component-id="${guid}"] ` + this.selectors.appliedPresetFilter)
        else return await $(this.selectors.appliedPresetFilter).getText();
    }

    async searchAndSelectGridRecord(recordName: string, guid?: string): Promise<void> {
        if (guid) {
            this.searchRecord(recordName, guid);
            this.selectors.selectCheckbox = `[rx-view-component-id="${guid}"] ` + this.selectors.selectCheckbox;
            this.selectors.selectRadioButton = `[rx-view-component-id="${guid}"] ` + this.selectors.selectRadioButton;
        }
        else await this.searchRecord(recordName);
        let checkboxLocator = await $(this.selectors.selectCheckbox);
        let radioButtonLocator = await $(this.selectors.selectRadioButton);
        if (await checkboxLocator.isPresent()) await checkboxLocator.click();
        else await radioButtonLocator.click();
    }


}

export default new GridOperations();