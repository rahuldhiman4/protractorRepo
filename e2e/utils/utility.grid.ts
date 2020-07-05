import { $, $$, Key, element, by, ElementFinder, browser, protractor } from 'protractor';
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
        clearBtn: '.advanced-filter__actions-buttons button',
        addVisibleColumnsIcon: 'button.d-icon-left-lines_vertical',
        gridColumnSelect: '.dropdown-item .checkbox__input',
        gridHeaders: '.c-header-container .c-header-name',
        gridCellData: '.at-data-row .at-data-cell',
        filterItems: '.advanced-filter__container .advanced-filter__accordion-tab .text-direction span',
        filterCheckboxOptions: '.a-select-inline__list .a-select-inline__item .checkbox__label',
        filterTab: '.nav-item button',
        visibleColumnButton: '.d-icon-left-lines_vertical',
        refreshIcon: 'button[rx-id="refresh-button"]',
        filterSearchValueBox: '.adapt-mt-input-container input',
    }

    async searchRecord(searchValue: string, guid?: string): Promise<void> {
        let searchTextBoxLocator: string = this.selectors.searchTextBox;
        if (guid) { searchTextBoxLocator = `[rx-view-component-id="${guid}"] ` + searchTextBoxLocator; }
        await $(searchTextBoxLocator).clear();
        await $(searchTextBoxLocator).sendKeys(searchValue + protractor.Key.ENTER);
    }

    async typeInFilterExperssion(date: string): Promise<void> {
        await $(this.selectors.filterPresetBtn).click();
        await $(this.selectors.filterSearchValueBox).clear();
        await $(this.selectors.filterSearchValueBox).sendKeys(date, Key.ENTER);

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
        let appliedPresetFilter = this.selectors.appliedPresetFilter;
        let filterPresetBtn = this.selectors.filterPresetBtn;
        let clearBtn = this.selectors.clearBtn;
        let refreshIcon = this.selectors.refreshIcon;
        if (guid) {
            let gridGuid = `[rx-view-component-id="${guid}"] `;
            filterPresetBtn = gridGuid + filterPresetBtn;
            refreshIcon = gridGuid + refreshIcon;
        }
        // await $(appliedPresetFilter).isPresent().then(async (result) => {
        //     if (result) {
        await $(filterPresetBtn).click();
        await $$(clearBtn).first().isPresent().then(async (present) => {
            if (present) await $$(clearBtn).first().click();
        });
        await $(refreshIcon).click();
        //     } else {
        //         console.log("Filters are already cleared");
        //     }
        // });
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
            guidComponent = `[rx-view-component-id="${guid}"] `;
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
        let csslocator: string = undefined;
        if (guid) csslocator = `[rx-view-component-id='${guid}'] .c-header-container .c-header-name`;
        else csslocator = ".c-header-container .c-header-name";
        let actualHeaders = await element.all(by.css(csslocator))
            .map(async function (header) {
                return await header.getAttribute('innerText');
            });
        actualHeaders.sort();
        expetcedHeaders.sort();
        return actualHeaders.length === expetcedHeaders.length && actualHeaders.every(
            (value, index) => (value === expetcedHeaders[index])
        );
    }

    async searchAndOpenHyperlink(id: string, guid?: string): Promise<void> {
        await this.searchRecord(id, guid);
        if (guid) await $$(`[rx-view-component-id='${guid}'] ` + this.selectors.gridRowLinks).first().click();
        else await $$(this.selectors.gridRowLinks).first().click();
    }

    async getFirstGridRecordColumnValue(columnName: string, guid?: string): Promise<string> {
        let count: number = 0;
        let gridHeaders = '.c-header-container .c-header-name';
        let gridCellData = '.at-data-row .at-data-cell'
        if (guid) {
            gridHeaders = `[rx-view-component-id='${guid}'] ` + gridHeaders;
            gridCellData = `[rx-view-component-id='${guid}'] ` + gridCellData;
        }

        if (await $$(gridCellData).count() > 0) {
            let forLimit = await $$(gridHeaders).count();
            for (let i: number = 0; i < forLimit; i++) {
                count = count + 1;
                let gridText = (await $$(gridHeaders).get(i).getAttribute('innerText')).trim();
                if (gridText == columnName) { break; }
            }
            return (await $$(gridCellData).get(count - 1).getAttribute('innerText')).trim();
        }
        else { return ""; }
    }

    async getAllValuesFromColumn(columnHeader: string, guid?: string): Promise<string[]> {
        let allElement = this.selectors.gridCellData;
        let gridColumnHeaderList = await $$(this.selectors.gridHeaders);
        if (guid) {
            gridColumnHeaderList = await $$(`[rx-view-component-id='${guid}'] ` + this.selectors.gridHeaders);
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
        let columnHeaderLocator = '.c-header-container .c-header-name';
        let columnContainerLocator = '.c-header-container';
        if (guid) {
            columnHeaderLocator = `[rx-view-component-id='${guid}'] ` + columnHeaderLocator;
            columnContainerLocator = `[rx-view-component-id='${guid}'] ` + columnContainerLocator;
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

    //Accepts sortType as 'asc' or 'desc'
    async sortGridColumn(columnName: string, sortType: string, guid?: string): Promise<void> {
        let columnHeaderLocator = '.c-header-container .c-header-name';
        let columnContainerLocator = '.c-header-container';
        if (guid) {
            columnHeaderLocator = `[rx-view-component-id='${guid}'] ` + columnHeaderLocator;
            columnContainerLocator = `[rx-view-component-id='${guid}'] ` + columnContainerLocator;
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
    }

    async addFilter(fieldName: string, textValue: string, type: string, guid?: string): Promise<void> {
        let guidId: string = "";
        let refreshIcon = this.selectors.refreshIcon;
        if (guid) {
            guidId = `[rx-view-component-id="${guid}"] `;
            refreshIcon = `[rx-view-component-id="${guid}"] ` + refreshIcon;
        }
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
                break;
            }
            default: {
                await $('.card[aria-selected="true"] .adapt-mt input').sendKeys(textValue + protractor.Key.ENTER);
                break;
            }
        }
        await $(refreshIcon).click();
    }

    async applyPresetFilter(filterName: string, guid?: string): Promise<void> {
        let refreshIcon = 'button[rx-id="refresh-button"]';
        let guidId: string = "";
        if (guid) guidId = `[rx-view-component-id="${guid}"] `;
        await $(guidId + this.selectors.filterPresetBtn).click();
        await $$(this.selectors.filterTab).get(1).click().then(async () => {
            await element(by.cssContainingText('.radio__item', filterName)).click();
        });
        await $(guidId + refreshIcon).click();
    }

    async getAppliedFilterName(guid?: string): Promise<string> {
        if (guid) return $(`[rx-view-component-id="${guid}"] ` + this.selectors.appliedPresetFilter)
        else return await $(this.selectors.appliedPresetFilter).getText();
    }

    async searchAndSelectGridRecord(recordName: string, guid?: string): Promise<void> {
        let selectCheckbox = '.ui-chkbox-box';
        let selectRadioButton = '.radio__label input';
        if (guid) {
            await this.searchRecord(recordName, guid);
            selectCheckbox = `[rx-view-component-id="${guid}"] ` + selectCheckbox;
            selectRadioButton = `[rx-view-component-id="${guid}"] ` + selectRadioButton;
        }
        else await this.searchRecord(recordName);
        let checkboxLocator = await $(selectCheckbox);
        let radioButtonLocator = await $(selectRadioButton);
        if (await checkboxLocator.isPresent()) await checkboxLocator.click();
        else await radioButtonLocator.click();
    }

    async clearFilterPreset(): Promise<void> {
        await $(this.selectors.filterPresetBtn).click();
        await $$('button.nav-link').first().click();
        await $(this.selectors.refreshIcon).click();
        await this.clearFilter();
    }

    async clickRefreshIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.refreshIcon).click();
        else await $(this.selectors.refreshIcon).click();
    }

}



export default new GridOperations();
