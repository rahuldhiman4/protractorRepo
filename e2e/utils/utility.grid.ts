import { uniqBy } from 'lodash';
import { $, $$, browser, by, element, ElementFinder, Key, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityCommon from '../utils/utility.common';

export class GridOperations {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        selectAllCheckBox: '.adapt-selection-cell .checkbox__input',
        noFilterAppliedError: '.has-danger .form-control-feedback',
        searchTextBox: '.adapt-search-triggerable input',
        clearSearchBoxButton: '.adapt-search-triggerable .adapt-search-clear-visible',
        gridRowHyperLinks: '.at-data-row a',
        gridRows: '.at-data-row',
        gridCheckbox: '.ui-chkbox-box, .radio__label input',
        appliedPresetFilter: '.a-tag-active span, adapt-table-toolbar span.btn-link',
        activeFilter: 'adapt-table-toolbar span.btn-link',
        filterPresetBtn: 'button.d-icon-left-filter',
        clearSaveFilterBtn: '.advanced-filter__actions-buttons button',
        addVisibleColumnsIcon: 'button.d-icon-left-lines_vertical',
        gridColumnSelect: '.dropdown-item .checkbox__input',
        gridHeaders: '.c-header-container .c-header__separator',
        gridCellData: '.at-data-row .at-data-cell',
        filterItems: '.advanced-filter__label',
        filterCheckboxOptions: 'adapt-tabset [role="option"],.advanced-filter__scrollable-container [role="option"]',
        filterTab: '.dropdown-menu [role="tablist"] .nav-item button',
        visibleColumnButton: '.d-icon-eye_closed,.d-icon-eye',
        refreshIcon: 'button[rx-id="refresh-button"]',
        filterSearchValueBox: '.adapt-mt-input-container input',
        filterCounterInput: '.tab-container .adapt-rx-counter-input',
        filterValue: '[class="filter-tags__tag-text"]',
        filterName: '.radio__item span',
        editPresetFilterSaveButton: '.advanced-filter__editing-footer .btn-primary',
        savePresetInput: 'input[placeholder="Enter preset name"]',
        saveOrCancelPresetFilterButton: 'button.custom-action-btn__right',
        lineOfBusinessDropDown: 'button[btn-type="tertiary"]',
        deleteButton: 'button span'
    }

    async selectAllCheckBox() {
        await $(this.selectors.selectAllCheckBox).click();
    }

    async searchRecord(searchValue: string, guid?: string): Promise<void> {
        let searchTextBoxLocator: string = this.selectors.searchTextBox;
        let gridRecordsLocator: string = this.selectors.gridRows;
        if (guid) {
            searchTextBoxLocator = `[rx-view-component-id="${guid}"] ` + searchTextBoxLocator;
            gridRecordsLocator = `[rx-view-component-id='${guid}'] ` + gridRecordsLocator;
        }
        await this.clearFilter();
        await this.loopGridSearch(searchValue, searchTextBoxLocator, gridRecordsLocator,guid);
    }

    async searchRecordWithoutClearFilter(searchValue: string, guid?: string): Promise<void> {
        let searchTextBoxLocator: string = this.selectors.searchTextBox;
        let gridRecordsLocator: string = this.selectors.gridRows;
        if (guid) {
            searchTextBoxLocator = `[rx-view-component-id="${guid}"] ` + searchTextBoxLocator;
            gridRecordsLocator = `[rx-view-component-id='${guid}'] ` + gridRecordsLocator;
        }
        await this.loopGridSearch(searchValue, searchTextBoxLocator, gridRecordsLocator,guid);
    }

    async loopGridSearch(searchValue: string, searchTextBoxLocator: string, gridRecordsLocator: string,guid?:string): Promise<void> {
        for (let i: number = 0; i < 5; i++) {
            console.log(searchValue, "search angular grid count: ", i);
            await $(searchTextBoxLocator).clear();
            if(searchValue.startsWith('KA-') || searchValue.startsWith('TASK-')) //Workaround for Search Task and Knowledge Console issue
            {
                let idArray: string[]= searchValue.split('-');
                searchValue = idArray[1];
            }
            await $(searchTextBoxLocator).sendKeys(searchValue + protractor.Key.ENTER);
            await browser.sleep(2000); // wait until grid records loaded
            this.clickRefreshIcon(guid);
            await browser.sleep(1000); // wait until grid records loaded
            let gridRecordCount: number = await $$(gridRecordsLocator).count();
            console.log("grid records found: ", gridRecordCount);
            if (gridRecordCount == 0) {
                await browser.sleep(2000); // workaround for performance issue, this can be removed when issue fixed
            } else break;
        }
    }

    async typeInFilterExperssion(date: string): Promise<void> {
        await $(this.selectors.filterPresetBtn).click();
        await $(this.selectors.filterSearchValueBox).clear();
        await $(this.selectors.filterSearchValueBox).sendKeys(date, Key.ENTER);

    }

    async isGridRecordPresent(searchRecord: string, guid?: string): Promise<boolean> {
        let booleanVal: boolean = false;
        let gridRowLocator: string = '.at-data-cell';
        if (guid) {
            gridRowLocator = `[rx-view-component-id="${guid}"] ` + gridRowLocator;
        }
        await this.searchRecordWithoutClearFilter(searchRecord, guid);
        return await $(gridRowLocator).isPresent().then(async (isRecordPresent) => {
            if (isRecordPresent) {
                let recordCount = await $$(gridRowLocator).count();
                for (let i = 0; i < recordCount; i++) {
                    let getTextElement = await $$(gridRowLocator).get(i).getText();
                    if (getTextElement.includes(searchRecord)) {
                        booleanVal = true;
                        break;
                    }
                }
                return booleanVal;
            }
            else return false;
        });
    }

    async clickCheckBoxOfValueInGrid(value: string, guid?: string): Promise<void> {
        let gridRowLocator: string = this.selectors.gridRows;
        let gridRecordLocator = this.selectors.gridRowHyperLinks;
        if (guid) {
            gridRowLocator = `[rx-view-component-id="${guid}"] ${this.selectors.gridRows}`;
            gridRecordLocator = `[rx-view-component-id="${guid}"] ${this.selectors.gridRowHyperLinks}`;
        }
        let totalGridRecords = await $$(gridRecordLocator).count();
        var index = 0;
        while (index < totalGridRecords) {
            let linkedText = await $$(gridRecordLocator).get(index).getText();
            if (linkedText.trim() == value) {
                await $$(`${gridRowLocator} ${this.selectors.gridCheckbox}`).get(index).click();
                break;
            }
            totalGridRecords = await $$(gridRecordLocator).count();
            index++;
        }
    }

    async isNoFilterAppliedError(): Promise<boolean> {
        return await await $(this.selectors.noFilterAppliedError).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.noFilterAppliedError).isDisplayed();
            } else return false;
        });
    }

    async clickFilterField(fieldName: string, guid?: string): Promise<void> {
        let guidId: string = "";
        let refreshIcon = this.selectors.refreshIcon;
        if (guid) {
            guidId = `[rx-view-component-id="${guid}"] `;
            refreshIcon = `[rx-view-component-id="${guid}"] ` + refreshIcon;
        }
        await $(guidId + this.selectors.filterPresetBtn).click();
        let filterCount = await $$(this.selectors.filterItems);
        for (let i = 0; i < await filterCount.length; i++) {
            let tempLocator = await $$(this.selectors.filterItems).get(i);
            if (await tempLocator.getText() == fieldName) {
                await tempLocator.click();
                break;
            }
        }
    }

    async clearFilter(guid?: string): Promise<void> {
        let appliedPresetFilter = this.selectors.appliedPresetFilter;
        let filterPresetBtn = this.selectors.filterPresetBtn;
        let clearBtn = this.selectors.clearSaveFilterBtn;
        let refreshIcon = this.selectors.refreshIcon;
        if (guid) {
            let gridGuid = `[rx-view-component-id="${guid}"] `;
            filterPresetBtn = gridGuid + filterPresetBtn;
            refreshIcon = gridGuid + refreshIcon;
        }
        let hiddentFilter1 = await $('.adapt-table-toolbar-hidden-items-dropdown .d-icon-ellipsis').isPresent();
        if (hiddentFilter1 == true) {
            await $('.adapt-table-toolbar-hidden-items-dropdown .d-icon-ellipsis').click();
        }
        await $(appliedPresetFilter).isPresent().then(async (result) => {
            if (result) {
                await $(filterPresetBtn).click();
                await $$(clearBtn).first().click();
                await $(refreshIcon).click();
                let hiddentFilter2 = await $('.adapt-table-toolbar-hidden-items-dropdown .d-icon-ellipsis').isPresent();
                if (hiddentFilter2 == true) {
                    await $('.adapt-table-toolbar-hidden-items-dropdown .d-icon-ellipsis').click();
                }
            } else {
                console.log("Filters are already cleared");
            }
        });
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
        if (guid) csslocator = `[rx-view-component-id='${guid}'] .c-header-container .c-header__separator`;
        else csslocator = ".c-header-container .c-header__separator";
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
        if (guid) await $$(`[rx-view-component-id='${guid}'] ` + this.selectors.gridRowHyperLinks).first().click();
        else await $$(this.selectors.gridRowHyperLinks).first().click();
    }

    async searchAndOpenHyperlinkWithoutRemovingFilter(id: string, guid?: string): Promise<void> {
        await this.searchRecordWithoutClearFilter(id, guid);
        if (guid) await $$(`[rx-view-component-id='${guid}'] ` + this.selectors.gridRowHyperLinks).first().click();
        else await $$(this.selectors.gridRowHyperLinks).first().click();
    }

    async getFirstGridRecordColumnValue(columnName: string, guid?: string): Promise<string> {
        let count: number = 0;
        let gridHeaders = '.c-header-container .c-header__separator';
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
                if (gridText == columnName) {
                    break;
                }
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

    //Accepts sortType as 'ascending' or 'descending'
    async isGridColumnSorted(columnName: string, sortType: string, guid?: string): Promise<boolean> {
        let columnHeaderLocator = '.c-header-container .c-header__separator';
        let columnContainerLocator = '.c-header-container';
        if (guid) {
            columnHeaderLocator = `[rx-view-component-id='${guid}'] ` + columnHeaderLocator;
            columnContainerLocator = `[rx-view-component-id='${guid}'] ` + columnContainerLocator;
        }
        let columnHeaderContainer = await $$(columnContainerLocator);
        for (let i = 0; i < await columnHeaderContainer.length; i++) {
            if (await $$(columnHeaderLocator).get(i).getText() == columnName) {
                for (let j = 0; j < 3; j++) {
                    let b: string = await $$(columnContainerLocator).get(i).$$('.c-header__sort-icon').getAttribute('aria-sort') + '';
                    if (b.includes(sortType)) break;
                    else await $$(columnContainerLocator).get(i).$$('.c-header__sort-icon').click();
                }
            }
        }
        let columnData: string[] = undefined;
        if (guid) columnData = await this.getAllValuesFromColumn(columnName, guid);
        else columnData = await this.getAllValuesFromColumn(columnName);
        const copy = Object.assign([], columnData);

        if (columnName == 'Priority') {
            columnData = uniqBy(columnData, function (record) { return record; });
            var priorityOrder = ['Critical', 'High', 'Medium', 'Low']; //Asc by default
            if (sortType == "descending") {
                priorityOrder.reverse();
            }
            var excludePriorities = [];
            priorityOrder.forEach(function (outItem, outIndex) {
                var isMatch = false;
                columnData.forEach(function (inItem, inIndex) {
                    if (outItem == inItem) {
                        isMatch = true;
                    }
                });
                if (!isMatch) {
                    excludePriorities.push(outItem);
                }
            });
            excludePriorities.forEach(function (item, index) {
                var priorityIndex = priorityOrder.indexOf(item);
                if (priorityIndex > -1) {
                    priorityOrder.splice(priorityIndex, 1);
                }
            });
            var returnVar = true;
            columnData.forEach(function (item, index) {
                if (item != priorityOrder[index]) {
                    returnVar = false;
                }
            });
            return returnVar;
        } else {
            columnData.sort(function (a, b) {
                return a.localeCompare(b);
            })
            if (sortType == "descending") {
                columnData.reverse();
            }

            return columnData.length === copy.length && columnData.every(
                (value, index) => (value === copy[index])
            );
        }
    }

    //Accepts sortType as 'ascending' or 'descending'
    async sortGridColumn(columnName: string, sortType: string, guid?: string): Promise<void> {
        let columnHeaderLocator = '.c-header-container .c-header__separator';
        let columnContainerLocator = '.c-header-container';
        if (guid) {
            columnHeaderLocator = `[rx-view-component-id='${guid}'] ` + columnHeaderLocator;
            columnContainerLocator = `[rx-view-component-id='${guid}'] ` + columnContainerLocator;
        }
        let columnHeaderContainer = await $$(columnContainerLocator);
        for (let i = 0; i < await columnHeaderContainer.length; i++) {
            if (await $$(columnHeaderLocator).get(i).getText() == columnName) {
                for (let j = 0; j < 3; j++) {
                    let b: string = await $$(columnContainerLocator).get(i).$$('.c-header__sort-icon').getAttribute('aria-sort') + '';
                    if (b.includes(sortType)) break;
                    else await $$(columnContainerLocator).get(i).$$('.c-header__sort-icon').click();
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
        let hiddentFilter = await $('.adapt-table-toolbar-hidden-items-dropdown .d-icon-ellipsis').isPresent();
        if (hiddentFilter == true) {
            await $('.adapt-table-toolbar-hidden-items-dropdown .d-icon-ellipsis').click();
        }
        await $(guidId + this.selectors.filterPresetBtn).click();
        await $$(this.selectors.filterTab).get(0).click();
        let filterCount = await $$(this.selectors.filterItems);
        for (let i = 0; i < filterCount.length; i++) {
            let tempLocator = await $$(this.selectors.filterItems).get(i);
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

            case "radioButton": {
                await element(by.cssContainingText('.advanced-filter__radiobutton .radio__item span', textValue)).click();
                break;
            }

            case "date": {
                await utilityCommon.setDateField(textValue, guid);
                break;
            }

            case "counter": {
                if (textValue.includes('-')) {
                    let counterValues = (textValue.split('-'));
                    await $$(this.selectors.filterCounterInput).first().sendKeys(counterValues[0]);
                    await browser.wait(this.EC.elementToBeClickable($$(this.selectors.filterCounterInput).last()), 5000);
                    await $$(this.selectors.filterCounterInput).last().sendKeys(counterValues[1]);
                }
                else await $$(this.selectors.filterCounterInput).first().sendKeys(textValue);
                break;
            }

            case "raw": {
                await $('.advanced-filter__popover-header .adapt-mt-wrapper').click();
                await $('.advanced-filter__popover-header .adapt-mt-wrapper input').sendKeys(textValue + protractor.Key.ENTER);
                break;
            }

            default: {
                await $('.card[aria-selected="true"] .adapt-mt input').sendKeys(textValue + protractor.Key.ENTER);
                break;
            }
        }
        await $(refreshIcon).click(); //Need to update once defect DRDMV-24648 is resolved

        if (hiddentFilter == true) {
            await $('.adapt-table-toolbar-hidden-items-dropdown .d-icon-ellipsis').click();
        }
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

    async searchAndSelectGridRecord(recordName: string, guid?: string): Promise<void> {
        let selectCheckbox = '.ui-chkbox-box';
        let selectRadioButton = '.radio__label input';
        if (guid) {
            await this.searchRecordWithoutClearFilter(recordName, guid);
            selectCheckbox = `[rx-view-component-id="${guid}"] ` + selectCheckbox;
            selectRadioButton = `[rx-view-component-id="${guid}"] ` + selectRadioButton;
        }
        else await this.searchRecordWithoutClearFilter(recordName);
        let checkboxLocator = await $(selectCheckbox);
        let radioButtonLocator = await $(selectRadioButton);
        if (await checkboxLocator.isPresent()) await checkboxLocator.click();
        else await radioButtonLocator.click();
    }

    async clickRefreshIcon(guidId?: string): Promise<void> {
        if (guidId) await $(`[rx-view-component-id="${guidId}"] ` + this.selectors.refreshIcon).click();
        else await $(this.selectors.refreshIcon).click();
        await browser.sleep(1000); // sometime refresh grid takes time
    }

    async isEntireColumnContainsSameValue(columnHeader: string, value: string, guid?: string): Promise<boolean> {
        let allValues: string[] = undefined;
        guid ? allValues = await this.getAllValuesFromColumn(columnHeader, guid) : allValues = await this.getAllValuesFromColumn(columnHeader);
        const allEqual = arr => arr.every(v => v === arr[0])
        return allEqual(allValues) && allValues[0] === value;
    }

    async saveFilter(filterName: string, guid?: string): Promise<void> {
        let refreshIcon = 'button[rx-id="refresh-button"]';
        let guidId: string = "";
        if (guid) guidId = `[rx-view-component-id="${guid}"] `;
        await $(guidId + this.selectors.filterPresetBtn).click();
        await $$(this.selectors.filterTab).get(1).click().then(async () => {
            await $$(this.selectors.clearSaveFilterBtn).get(1).click();
            await $(this.selectors.savePresetInput).sendKeys(filterName);
            await $$(this.selectors.saveOrCancelPresetFilterButton).get(1).click();
        });
        await $(guidId + refreshIcon).click();
    }
    async isAppliedFilterMatches(expetcedFilters: string[], guid?: string): Promise<boolean> {
        let csslocator: string = undefined;
        let showMoreElement: ElementFinder = await $('.dropdown  .filter-tags__dropdown-toggle');
        let moreLabeLink = await showMoreElement.isPresent();
        if (moreLabeLink == true) {
            await showMoreElement.click();
        }
        await $(this.selectors.activeFilter).isPresent().then(async (linkPresent) => {
            if (linkPresent) {
                await $$(this.selectors.filterPresetBtn).click();
            }
        });
        if (guid) csslocator = `[rx-view-component-id='${guid}'] .a-tag-active `;
        else csslocator = ".a-tag-active, .advanced-filter__expression-tag-field .adapt-mt-text";
        let actualFilters = await element.all(by.css(csslocator))
            .map(async function (header) {
                return await header.getAttribute('innerText');
            });
        actualFilters.sort();
        expetcedFilters.sort();
        return actualFilters.length === expetcedFilters.length && actualFilters.every(
            (value, index) => (value === expetcedFilters[index])
        );
    }

    async clearSearchBox(): Promise<void> {
        await $(this.selectors.clearSearchBoxButton).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.clearSearchBoxButton).click();
            else await console.log('Search box already clear');
        })
    }

    async deleteCustomPresetFilter(filterName: string, guid?: string): Promise<void> {
        let refreshIcon = 'button[rx-id="refresh-button"]';
        let guidId: string = "";
        if (guid) guidId = `[rx-view-component-id="${guid}"] `;
        await $(guidId + this.selectors.filterPresetBtn).click();
        await $$(this.selectors.filterTab).get(1).click().then(async () => {
            let countFilterName = await $$(this.selectors.filterName).count();
            for (let i = 0; i < countFilterName; i++) {
                let filterValue = await $$(this.selectors.filterName).get(i).getText();

                if (filterValue == filterName) {
                    let filterdeleteButton = await $$('.d-icon-trash').get(i).isPresent();
                    if (filterdeleteButton == true) {
                        await $$('.d-icon-trash').get(i).click();
                        break;
                    }
                } else {
                    console.log('No Preset Filter Found');
                }
            }
        });
        await $(guidId + refreshIcon).click();
    }

    async isPresetFilterNameDisplayed(filterName: string, guid?: string): Promise<boolean> {
        let guidId: string = "";
        if (guid) guidId = `[rx-view-component-id="${guid}"] `;
        await $(this.selectors.refreshIcon).click();
        await $(guidId + this.selectors.filterPresetBtn).click();
        await $$(this.selectors.filterTab).get(1).click();
        return await element(by.cssContainingText(this.selectors.filterName, filterName)).isPresent().then(async (result) => {
            if (result) {
                let booleanVal = await element(by.cssContainingText(this.selectors.filterName, filterName)).isDisplayed();
                if (booleanVal == true) {
                    await $(this.selectors.refreshIcon).click();
                    return booleanVal;
                }
            }
            else {
                await $(this.selectors.refreshIcon).click();
                return false;
            }
        });
    }

    async updateCustomPresetFilter(fieldName: string, textValue: string, type: string, filterName: string, newFilterName?: string, guid?: string): Promise<void> {
        let guidId: string = "";
        let refreshIcon = this.selectors.refreshIcon;
        if (guid) {
            guidId = `[rx-view-component-id="${guid}"] `;
            refreshIcon = `[rx-view-component-id="${guid}"] ` + refreshIcon;
        }

        await $(refreshIcon).click();
        await $(guidId + this.selectors.filterPresetBtn).click();
        await $$(this.selectors.filterTab).get(1).click().then(async () => {
            let countFilterName = await $$(this.selectors.filterName).count();
            for (let i = 0; i < countFilterName; i++) {
                let filterValue = await $$(this.selectors.filterName).get(i).getText();
                if (filterValue == filterName) {
                    await $$('.d-icon-pencil_adapt').get(i).click();
                    break;
                } else {
                    console.log('No Preset Filter Found');
                }
            }
        });

        if (newFilterName) {
            await $$('.advanced-filter__editing-container .rx-form-control').get(0).clear();
            await $$('.advanced-filter__editing-container .rx-form-control').get(0).sendKeys(newFilterName);
        }

        let filterCount = await $$(this.selectors.filterItems);
        for (let i = 0; i < await filterCount.length; i++) {
            let tempLocator = await $$(this.selectors.filterItems).get(i);
            if (await tempLocator.getText() == fieldName) {
                await tempLocator.click();
                break;
            }
        }
        switch (type) {
            case "checkbox": {
                await element(by.cssContainingText(this.selectors.filterCheckboxOptions, textValue)).click();
                await $(this.selectors.editPresetFilterSaveButton).click();
                break;
            }
            case "date": {
                await utilityCommon.setDateField(textValue, guid);
                await $(this.selectors.editPresetFilterSaveButton).click();
                break;
            }
            case "counter": {
                if (textValue.includes('-')) {
                    let counterValues = (textValue.split('-'));
                    await $$(this.selectors.filterCounterInput).first().sendKeys(counterValues[0]);
                    await browser.wait(this.EC.elementToBeClickable($$(this.selectors.filterCounterInput).last()), 5000);
                    await $$(this.selectors.filterCounterInput).last().sendKeys(counterValues[1]);
                    await $(this.selectors.editPresetFilterSaveButton).click();
                }
                else await $$(this.selectors.filterCounterInput).first().sendKeys(textValue);
                await $(this.selectors.editPresetFilterSaveButton).click();
                break;
            }
            default: {
                await $('.card[aria-selected="true"] .adapt-mt input').sendKeys(textValue + protractor.Key.ENTER);
                await $(this.selectors.editPresetFilterSaveButton).click();
                break;
            }
        }
        await $(refreshIcon).click();
    }

    async getCountPresetFilter(presetFilterName: string): Promise<number> {
        let guidId: string = "";
        await this.clickRefreshIcon;
        await $(guidId + this.selectors.filterPresetBtn).click();
        await $$(this.selectors.filterTab).get(1).click();
        let getCountPresetFilter = await element.all(by.cssContainingText(this.selectors.filterName, presetFilterName)).count();
        await this.clickRefreshIcon;
        return getCountPresetFilter;
    }

    async clickOnFilterButton(guid?: string): Promise<void> {
        let guidId: string = "";
        if (guid) guidId = `[rx-view-component-id="${guid}"] `;
        await $(guidId + this.selectors.filterPresetBtn).click();
    }

    async clickOnFilterTab(filterTabName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.filterTab, filterTabName)).click();
    }

    async getAllDynamicFilterName(): Promise<string[]> {
        let filterNameText: string[] = [];
        let filterItemElement: ElementFinder[] = await $$('.form-control-feedback .ellipsis');
        for (let i: number = 0; i < filterItemElement.length; i++) {
            filterNameText[i] = await filterItemElement[i].getText();
        }
        return filterNameText;
    }

    async clickEditPresetFilterButton(filterName: string): Promise<void> {
        let countFilterName = await $$(this.selectors.filterName).count();
        for (let i = 0; i < countFilterName; i++) {
            let filterValue = await $$(this.selectors.filterName).get(i).getText();
            if (filterValue == filterName) {
                await $$('.d-icon-pencil_adapt').get(i).click();
                break;
            } else {
                console.log('No Preset Filter Found');
            }
        }
    }

    async clickBackButtonOnEditCustomPresetFilter(): Promise<void> {
        await $('.advanced-filter__back-btn').click();
    }

    async getHeaderOnEditCustomPresetFilter(): Promise<string> {
        return await $('.advanced-filter__editing-title').getText();
    }

    async clickEditFilterSaveButton(): Promise<void> {
        await $(this.selectors.editPresetFilterSaveButton).click();
    }

    async clickEditFilterCancelButton(): Promise<void> {
        await $('.advanced-filter__editing-footer .btn-secondary').click();
    }

    async isRequiredLabelDisplayedOnEditFilter(fieldName: string): Promise<boolean> {
        return await element(by.cssContainingText('.form-control-label', fieldName)).isPresent().then(async (result) => {
            if (result) {
                return await element(by.cssContainingText('.form-control-label', fieldName)).isDisplayed();
            } else return false;
        });
    }

    async isAppliedFilterInputBoxDisplayedOnPresetFilter(): Promise<boolean> {
        return await $('.adapt-mt-wrapper .adapt-mt').isPresent().then(async (result) => {
            if (result) {
                return await $('.adapt-mt-wrapper .adapt-mt').isDisplayed();
            } else return false;
        });
    }

    async IsEditPresetFilterSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.editPresetFilterSaveButton).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.editPresetFilterSaveButton).isEnabled();
            } else return false;
        });
    }

    async removeFilterValue(fieldName: string, fiterValue: string): Promise<void> {
        let filterCount = await $$(this.selectors.filterItems);
        for (let i = 0; i < await filterCount.length; i++) {
            let tempLocator = await $$(this.selectors.filterItems).get(i);
            if (await tempLocator.getText() == fieldName) {
                await tempLocator.click();
                break;
            }
        }
        let countFilterValue = await $$('.adapt-mt-item-wrapper .adapt-mt-text').count();
        for (let i = 0; i < countFilterValue; i++) {
            let filterValueText = await $$('.adapt-mt-item-wrapper .adapt-mt-text').get(i).getText();
            if (filterValueText == fiterValue) {
                await $$('.adapt-mt-item-wrapper .adapt-mt-item-close').get(i).click();
                break;
            } else {
                console.log('No Filter Value Found');
            }
        }
    }

    async clearFilterNameOnEditPresetFilter(): Promise<void> {
        for (let j: number = 0; j < 17; j++) {
            await $$('.advanced-filter__editing-container .rx-form-control').get(0).sendKeys(protractor.Key.BACK_SPACE);
             }
        //await $$('.advanced-filter__editing-container .rx-form-control').get(0).clear();
    }

    async isValidationMessageDisplayedOnEditPresetFilter(validationMessage): Promise<boolean> {
        return await element(by.cssContainingText('.advanced-filter__editing-fields .form-control-feedback', validationMessage)).isPresent().then(async (result) => {
            if (result) {
                return await element(by.cssContainingText('.advanced-filter__editing-fields .form-control-feedback', validationMessage)).isDisplayed();
            } else return false;
        });
    }

    async selectLineOfBusiness(value: string, guid?: string): Promise<void> {
        let guidID: string = "";
        if (guid) guidID = `[rx-view-component-id="${guid}"] `;
        await $(guidID + this.selectors.lineOfBusinessDropDown).click();
        await element(by.cssContainingText('.lob-list .dropdown-item', value)).click();
    }

    async deleteGridRecord(gridRecord: string, guid?: string): Promise<void> {
        let deleteButtonLocator: string = this.selectors.deleteButton;
        if (guid) deleteButtonLocator = `[rx-view-component-id="${guid}"] ${this.selectors.deleteButton}`;
        await this.searchAndSelectGridRecord(gridRecord, guid);
        await element(by.cssContainingText(deleteButtonLocator, 'Delete')).click();
    }

    async isDeleteButtonEnabled(guid?: string): Promise<boolean> {
        let deleteButtonLocator: string = this.selectors.deleteButton;
        if (guid) deleteButtonLocator = `[rx-view-component-id="${guid}"] ${this.selectors.deleteButton}`;
        return await $(deleteButtonLocator).isEnabled();
    }
}
export default new GridOperations();
