import { link } from 'fs';
import { $, $$, Key, element, by, ElementFinder, browser, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityCommon from '../utils/utility.common';

export class GridOperations {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        noFilterAppliedError: '.has-danger .form-control-feedback',
        searchTextBox: '.adapt-search-triggerable input',
        clearSearchBoxButton: '.adapt-search-triggerable .adapt-search-clear',
        gridRowLinks: '.at-data-row a',
        gridRowHyperLinks: '.at-data-row a',
        gridRows: '.at-data-row',
        gridCheckbox: '.ui-chkbox-box',
        appliedPresetFilter: '.a-tag-active span, adapt-table-toolbar span.btn-link',
        activeFilter: 'adapt-table-toolbar span.btn-link',
        filterPresetBtn: 'button.d-icon-left-filter',
        clearSaveFilterBtn: '.advanced-filter__actions-buttons button',
        addVisibleColumnsIcon: 'button.d-icon-left-lines_vertical',
        gridColumnSelect: '.dropdown-item .checkbox__input',
        gridHeaders: '.c-header-container .c-header-name',
        gridCellData: '.at-data-row .at-data-cell',
        filterItems: '.advanced-filter__container .advanced-filter__accordion-tab .text-direction span',
        filterCheckboxOptions: '.a-select-inline__list .a-select-inline__item .checkbox__label',
        filterTab: '.dropdown-menu [role="tablist"] .nav-item button',
        visibleColumnButton: '.d-icon-eye_closed,.d-icon-eye',
        refreshIcon: 'button[rx-id="refresh-button"]',
        filterSearchValueBox: '.adapt-mt-input-container input',
        filterCounterInput: 'input.adapt-counter-input',
        filterValue: '[class="filter-tags__tag-text"]',
        filterName: '.radio__item span',
        editPresetFilterSaveButton: '.advanced-filter__editing-footer .btn-primary',
        savePresetInput: '.advanced-filter-name-editor__input',
        saveOrCancelPresetFilterButton: 'button.custom-action-btn__right',
        lineOfBusinessDropDown: 'button[btn-type="tertiary"]'
    }

    async searchRecord(searchValue: string, guid?: string): Promise<void> {
        let searchTextBoxLocator: string = this.selectors.searchTextBox;
        let gridRecordsLocator: string = this.selectors.gridRowLinks;
        if (guid) {
            searchTextBoxLocator = `[rx-view-component-id="${guid}"] ` + searchTextBoxLocator;
            gridRecordsLocator = `[rx-view-component-id='${guid}'] ` + gridRecordsLocator;
        }
        await this.clearFilter();
        for (let i: number = 0; i < 4; i++) {
            console.log(searchValue, "search angular grid count: ", i);
            await $(searchTextBoxLocator).clear();
            await $(searchTextBoxLocator).sendKeys(searchValue + protractor.Key.ENTER);
            let gridRecordCount: number = await $$(gridRecordsLocator).count();
            if (gridRecordCount == 0) {
                await browser.sleep(10000); // workaround for performance issue, this can be removed when issue fixed
            } else break;
        }
    }

    async searchRecordWithoutFilter(searchValue: string, guid?: string): Promise<void> {
        await browser.sleep(30000); // workaround for performance issue
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
        await $(searchTextBoxLocator).sendKeys(searchRecord + protractor.Key.ENTER);
        return await $(gridRowLinks).isPresent();
    }



    async clickCheckBoxOfValueInGrid(value: string, guid?: string): Promise<void> {
        let gridGuid: string = '';
        if (guid) { gridGuid = `[rx-view-component-id="${guid}"] `; }
        let rowLocator = await $$(gridGuid + this.selectors.gridRows);

        for (let i: number = 0; i < await rowLocator.length; i++) {
            let tempRowLocator = await $$(gridGuid + this.selectors.gridRows).get(i);
            let linkText: string = await tempRowLocator.$(this.selectors.gridRowHyperLinks).getText();
            if (linkText.trim() == value) {
                await tempRowLocator.$(this.selectors.gridCheckbox).click();
                break;
            }
        }
    }

    async isNoFilterAppliedError(): Promise<boolean> {
        return await $(this.selectors.noFilterAppliedError).isDisplayed();
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
        if(hiddentFilter1 == true){
            await $('.adapt-table-toolbar-hidden-items-dropdown .d-icon-ellipsis').click();
        }
        await $(appliedPresetFilter).isPresent().then(async (result) => {
            if (result) {
                await $(filterPresetBtn).click();
                await $$(clearBtn).first().click();
                await $(refreshIcon).click();
                let hiddentFilter2 = await $('.adapt-table-toolbar-hidden-items-dropdown .d-icon-ellipsis').isPresent();
                if(hiddentFilter2 == true){
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
        let hiddentFilter = await $('.adapt-table-toolbar-hidden-items-dropdown .d-icon-ellipsis').isPresent();
        if(hiddentFilter == true){
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
            case "date": {
                await utilityCommon.setDateField(guid, textValue);
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
            default: {
                await $('.card[aria-selected="true"] .adapt-mt input').sendKeys(textValue + protractor.Key.ENTER);
                break;
            }
        }
        await $(refreshIcon).click();

        if(hiddentFilter == true){
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
        await $(this.selectors.clearSearchBoxButton).click();
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
            await $('.textfield-padding-transition').clear();
            await $('.textfield-padding-transition').sendKeys(newFilterName);
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
                await utilityCommon.setDateField(guid, textValue);
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
        await $('.textfield-padding-transition').clear();
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

}
export default new GridOperations();
