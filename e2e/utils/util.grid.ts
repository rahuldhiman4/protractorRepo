import { $, $$, browser, by, By, element, ElementFinder, Key, protractor, ProtractorExpectedConditions, until, ElementHelper, ElementArrayFinder } from 'protractor';
import utilCommon, { Util } from './util.common';

export class GridOperation {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    utility: Util;
    constructor() {
        this.utility = new Util();
    }

    selectors = {
        firstGridCheckbox: '.ui-grid-row .ui-grid-selection-row-header-buttons',
        selectAllCheckBox: 'grid.selection.selectAll',
        summaryField1: ' input[role="search"]',
        searchButton1: ' button[rx-id="submit-search-button"]',
        clearGridSearchBoxButton: '.d-textfield__action[aria-label="Clear Search Field"]',
        filterPreset: '.rx-filter-presets-dropdown__trigger',
        clearFilterButton: 'button[rx-id="clear-button"]',
        filterClose: '.d-tag-remove-button',
        gridRecords: '(//div[@class="ui-grid-canvas"]/div)[2]',
        refreshButton: 'button.d-icon-refresh',
        searchInput: '[rx-id="search-text-input"]',
        searchIcon: '[rx-id="submit-search-button"]',
        searchGridRefreshIcon: '[rx-id="refresh-button"]',
        selectFilterOption: '.d-dropdown__menu-options-item a',
        gridColumnHeader: '.ui-grid-header-cell-label',
        addColumnIcon: 'rx-record-grid-menu.rx-record-grid-toolbar__item_visible-columns .d-icon-ellipsis',
        gridRecordPresent: 'div.ui-grid-row',
        filterIcon: '.rx-search-filter button',
        filterItems: '.search-filter-dropdown .d-accordion__item',
        applyButton: '.rx-search-filter-heading__apply',
        dateFrom: 'input[max-date="option.toDatePicker.date"]',
        dateTo: 'input[min-date="option.fromDatePicker.date"]',
        datePickerApplyButton: '.dropdown-item_range .d-button_small',
        presetFilter: '.rx-filter-preset__title span',
        appliedFilterName: '.d-tag-label',
        timePicker: 'button.d-timepicker__input'
    }

    async clickOnGridRefreshButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.refreshButton)));
        await $(this.selectors.refreshButton).click();
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async areColumnHeaderMatches(guid: string, columnHeader: string[]): Promise<boolean> {
        let arr: string[] = [];

        let gridColumnHeaderList = await $$(`[rx-view-component-id='${guid}'] .ui-grid-header-cell-label`);
        for (let i: number = 0; i < gridColumnHeaderList.length; i++) {
            arr.push(await gridColumnHeaderList[i].getAttribute('innerText'));
        }
        arr.sort();
        columnHeader.sort();
        return arr.length === columnHeader.length && arr.every(
            (value, index) => (value === columnHeader[index])
        );
    }

    async isGridRecordPresent(searchRecord: string, guid?: string): Promise<boolean> {
        await this.clearGridSearchBox(guid);
        await this.searchOnGridConsole(searchRecord, guid);
        let gridRecord = this.selectors.gridRecordPresent;
        if (guid) { gridRecord = `[rx-view-component-id="${guid}"] ` + gridRecord; }
        return await $(gridRecord).isPresent();
    }

    async addGridColumn(guid: string, columnName: string[]): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addColumnIcon)));
        await ($(this.selectors.addColumnIcon)).click();
        for (let i: number = 0; i < columnName.length; i++) {
            let customxpath = `(//*[@rx-view-component-id="${guid}"]//li[contains(@class,"d-dropdown__menu-options-item")]//a[text()="${columnName[i]}"])[1]`;
            //            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(customxpath))));
            let attrbuteVal = await element(by.xpath(customxpath)).getAttribute('aria-checked');
            if (attrbuteVal == 'false') {
                await element(by.xpath(customxpath)).click();
            } else { console.log('Column: ', columnName[i], ' already selected'); }
        }
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addColumnIcon)));
        await ($(this.selectors.addColumnIcon)).click();

    }

    async removeGridColumn(guid: string, columnName: string[]): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addColumnIcon)));
        await ($(this.selectors.addColumnIcon)).click();
        for (let i: number = 0; i < columnName.length; i++) {
            let customxpath = `(//*[@rx-view-component-id="${guid}"]//li[contains(@class,"d-dropdown__menu-options-item")]//a[text()="${columnName[i]}"])[1]`;
            //            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(customxpath))));
            let attrbuteVal = await element(by.xpath(customxpath)).getAttribute('aria-checked');
            if (attrbuteVal == 'true') {
                await element(by.xpath(customxpath)).click();
            } else { console.log('Column already selected'); }
        }
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addColumnIcon)));
        await ($(this.selectors.addColumnIcon)).click();

    }

    getGridLocator(locatorName: string, gridId: string) {
        const allLocators = {
            summaryField: `[rx-view-component-id="${gridId}"] input[role="search"]`,
            searchButton: `[rx-view-component-id="${gridId}"] button[rx-id="submit-search-button"]`,
            gridLink: `[rx-view-component-id="${gridId}"] .ui-grid__link`,
            firstCheckBox: `[rx-view-component-id="${gridId}"] div[class="ui-grid-selection-row-header-buttons ui-grid-icon-ok"]`
        };
        return allLocators[locatorName];
    }

    async gridHyperLink(id: string) {
        //        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText('.ui-grid__link', id))));
        await element(by.cssContainingText('.ui-grid__link', id)).click();
    }

    async clearGridSearchBox(guid?: string) {
        let searchBoxCrossIcon: string = this.selectors.clearGridSearchBoxButton;
        if (guid) { searchBoxCrossIcon = `[rx-view-component-id="${guid}"] ` + searchBoxCrossIcon; }
        let clearBtn: boolean = await $(searchBoxCrossIcon).isDisplayed();
        if (clearBtn == true) {
            await $(searchBoxCrossIcon).click();
        } else { console.log('Grid search box is already cleared') }
    }

    async searchAndOpenHyperlink(id: string, guid?: string) {
        await browser.sleep(30000); // workaround for performance issue
        await this.searchOnGridConsole(id, guid);
        await element(by.linkText(id)).click();
    }

    async clickCheckBoxOfValueInGrid(value: string, guid?: string): Promise<void> {
        let guidId: string = "";
        if (guid) {
            guidId = `//*[@rx-view-component-id="${guid}"]`
        }
        //        await utilCommon.waitUntilSpinnerToHide();	
        //        await browser.wait(this.EC.visibilityOf(element(by.xpath(`${guidId}//*[text()='${value}']`))));	
        let size: number = await element.all(by.xpath(`${guidId}//*[@role='gridcell']//*[@tabindex='0']`)).count();
        let cnt: number = 0;
        for (let i: number = 1; i <= size; i++) {
            cnt++;
            let locator: string = `(${guidId}//*[@role='gridcell']//*[@tabindex='0'])[${i}]`;
            //            await browser.wait(this.EC.presenceOf(element(by.xpath(locator))));	
            if (await element(by.xpath(locator)).getText() == value) break;
        }
        let checkbox: string = `(${guidId}//div[@aria-label='Select row'])[${cnt}]`;
        //        await browser.wait(this.EC.elementToBeClickable(element(by.xpath(checkbox))));	        
        await element(by.xpath(checkbox)).click();
    }

    async searchAndSelectFirstCheckBox(gridId: string, value: string) {
        //        await browser.wait(this.EC.elementToBeClickable($(this.getGridLocator('summaryField', gridId))));	
        await $(this.getGridLocator('summaryField', gridId)).clear();
        await $(this.getGridLocator('summaryField', gridId)).sendKeys(value);
        //        await browser.wait(this.EC.elementToBeClickable($(this.getGridLocator('searchButton', gridId))));	
        await $(this.getGridLocator('searchButton', gridId)).click();
        //        browser.sleep(3000);	
        //        await browser.wait(this.EC.elementToBeClickable(element(by.model(this.selectors.selectAllCheckBox))));	
        await $(this.getGridLocator('firstCheckBox', gridId)).click();
    }

    async selectAllCheckBox() {
        await element(by.model(this.selectors.selectAllCheckBox)).click();
    }

    async searchAndSelectAllCheckBoxWOGrid(value: string) {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.summaryField1)));	
        await $(this.selectors.summaryField1).clear();
        await $(this.selectors.summaryField1).sendKeys(value);
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchButton1)));	
        await $(this.selectors.searchButton1).click();
        //        await browser.sleep(5000);	
        //        await browser.wait(this.EC.elementToBeClickable(element(by.model(this.selectors.selectAllCheckBox))));	
        await element(by.model(this.selectors.selectAllCheckBox)).click();
    }

    async clearFilter(): Promise<void> {
        //      await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterPreset)));
        await $(this.selectors.filterClose).isPresent().then(async (result) => {
            if (result) {
                await $(this.selectors.filterPreset).click();
                await $(this.selectors.clearFilterButton).click();
            } else {
                console.log("Filters are already cleared");
            }
        });
    }

    async clickOnSelectedGridRecord(guid: string, columnHeader: string): Promise<void> {
        let gridColumnHeaderPosition = `//*[@rx-view-component-id='${guid}']//span[@class="ui-grid-header-cell-label"][text()='${columnHeader}']/parent::div/parent::div[@role='columnheader']/parent::div/preceding-sibling::*`;
        let gridRecords = '//div[@class="ui-grid-canvas"]/div';
        let columnPosition: number;
        try {
            columnPosition = await element.all(by.xpath(gridColumnHeaderPosition)).count();
        } catch (Ex) {
            columnPosition = 0;
        }
        columnPosition = columnPosition + 1;
        let gridRows: number = await element.all(by.xpath(gridRecords)).count();
        if (gridRows > 0) {
            let gridRecordCellValue = `(//*[@rx-view-component-id=${guid}]//div[@class="ui-grid-cell-contents"]/parent::div/parent::div)[1]/div[${columnPosition}]/div`;
            //            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(gridRecordCellValue))));
            await element(by.xpath(gridRecordCellValue)).click();
        } else {
            console.log("No Records Found.");
        }
    }

    async getSelectedGridRecordValue(guid: string, columnHeader: string): Promise<string> {
        let gridColumnHeaderList = await $$(`[rx-view-component-id='${guid}'] .ui-grid-header-cell-label`);
        let columnValue = undefined;
        for (let i: number = 0; i < gridColumnHeaderList.length; i++) {
            if (await gridColumnHeaderList[i].getText() == columnHeader) {
                columnValue = await $$(`[rx-view-component-id='${guid}'] .ui-grid-cell[role='gridcell'] .ui-grid-cell-contents`).get(i).getText();
                return columnValue;
            }
        }
    }

    async getAllValuesFromColoumn(guid: string, columnHeader: string): Promise<string[]> {
        let gridColumnHeaderList = await $$(`[rx-view-component-id='${guid}'] .ui-grid-header-cell-label`);
        let columnPosition = 0;
        for (let i: number = 0; i < gridColumnHeaderList.length; i++) {
            if (await gridColumnHeaderList[i].getText() == columnHeader) {
                columnPosition = i;
            }
        }

        let gridRecord: string[] = [];
        let allElement = `[rx-view-component-id='${guid}'] [role='gridcell']`;
        let allElementSize: number = await element.all(by.css(allElement)).count();
        let coloumnSize: number = gridColumnHeaderList.length;

        console.log('Count:' + allElementSize + "," + columnPosition + ',' + coloumnSize);

        for (columnPosition; columnPosition < allElementSize; columnPosition = columnPosition + coloumnSize) {
            let locator = `[rx-view-component-id='${guid}'] .ui-grid-render-container-body .ui-grid-canvas .ui-grid-cell-contents`;
            let allGrid: ElementFinder[] = await $$(locator);
            gridRecord[columnPosition] = await allGrid[columnPosition].getText();
        }
        let returnedvalue = gridRecord.filter(function (el) {
            return el != null;
        });
        return returnedvalue;
    }

    async searchRecord(id: string, guid?: string) {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.summaryField1)));
        if (guid) {
            await $(`[rx-view-component-id="${guid}"]` + this.selectors.summaryField1).clear();
            await $(`[rx-view-component-id="${guid}"]` + this.selectors.summaryField1).sendKeys(id);
            await $(`[rx-view-component-id="${guid}"]` + this.selectors.searchButton1).click();
        } else {
            await $(this.selectors.summaryField1).clear();
            await $(this.selectors.summaryField1).sendKeys(id);
            //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchButton1)));
            await $(this.selectors.searchButton1).click();
            //        await browser.sleep(3000);
        }
    }

    async searchOnGridConsole(searchValue: string, guid?: string): Promise<void> {
        let searchBoxInput: string = this.selectors.searchInput;
        let gridRefreshButton: string = this.selectors.refreshButton;
        let gridSearchIcon: string = this.selectors.searchIcon;
        if (guid) {
            searchBoxInput = `[rx-view-component-id="${guid}"] ` + searchBoxInput;
            gridRefreshButton = `[rx-view-component-id="${guid}"] ` + gridRefreshButton;
            gridSearchIcon = `[rx-view-component-id="${guid}"] ` + gridSearchIcon;
        }
        await $(searchBoxInput).clear();
        await $(gridRefreshButton).click();
        await $(searchBoxInput).sendKeys(searchValue);
        await $(gridSearchIcon).click();
    }

    async searchAndSelectGridRecord(searchValue: string, guid?: string): Promise<void> {
        await this.searchOnGridConsole(searchValue);
        await browser.sleep(1000);
        let checkboxRows: ElementFinder[];

        if (guid) {
            checkboxRows = await $$(`*[rx-view-component-id="${guid}"] .ui-grid .ui-grid-pinned-container .ui-grid-viewport .ui-grid-row`);
        } else {
            checkboxRows = await $$('.ui-grid .ui-grid-pinned-container .ui-grid-viewport .ui-grid-row');
        }
        if (checkboxRows[0]) await checkboxRows[0].$('.ui-grid-selection-row-header-buttons').click();
    }

    async getNumberOfRecordsInGrid(guid?: string): Promise<number> {
        if (guid) {
            return await $$(`*[rx-view-component-id="${guid}"] .ui-grid-render-container-body .ui-grid-row`).count();
        } else {
            return await $$('.ui-grid-render-container-body .ui-grid-row').count();
        }
    }

    async isGridColumnSorted(columnHeader: string, sortType: string, guid?: string): Promise<boolean> {
        let arr: string[] = [];
        columnHeader = "'" + columnHeader + "'";
        guid = "'" + guid + "'";

        //Clicking on columns based on sort type
        let columnHeaderLocator = await element(by.xpath(`//*[@rx-view-component-id=${guid}]//div[@role="columnheader"]//*[text()=${columnHeader}]`));
        let ariaSort = `//*[@rx-view-component-id=${guid}]//div[@role="columnheader"]//*[text()=${columnHeader}]//ancestor::div[@aria-sort]`;
        for (let i: number = 0; i < 3; i++) {
            //            await browser.wait(this.EC.visibilityOf(element(by.xpath(ariaSort))));
            //            await browser.sleep(3000);
            let sortValue = await element(by.xpath(ariaSort)).getAttribute("aria-sort");
            if (sortValue == sortType) {
                console.log("Sorted as: " + sortType);
                break;
            }
            else {
                //                await browser.wait(this.EC.elementToBeClickable(columnHeaderLocator));
                await columnHeaderLocator.click();
                //                await utilCommon.waitUntilSpinnerToHide();
            }
        }

        //Verifying if columns are sorted
        let gridColumnHeaderPosition = `//*[@rx-view-component-id=${guid}]//span[@class="ui-grid-header-cell-label"][text()=${columnHeader}]/parent::div/parent::div[@role='columnheader']/parent::div/preceding-sibling::*`;
        let gridRecords = '//div[@class="ui-grid-canvas"]/div';
        let columnPosition: number = await element.all(by.xpath(gridColumnHeaderPosition)).count();
        columnPosition = columnPosition + 1;
        let gridRows: number = await element.all(by.xpath(gridRecords)).count();
        let gridRecordCellValue;
        for (let i: number = 1; i <= gridRows; i++) {
            try {
                gridRecordCellValue = `(//*[@rx-view-component-id=${guid}]//div[@class="ui-grid-cell-contents"]/parent::div/parent::div)[${i}]/div[${columnPosition}]/div`;
                arr[i] = await element(by.xpath(gridRecordCellValue)).getText();
            }
            catch (e) {
                break;
            }
        }
        arr.shift();
        const copy = Object.assign([], arr);
        await arr.sort(function (a, b) {
            return a.localeCompare(b);
        })
        if (sortType == "descending") {
            arr.reverse();
        }
        return arr.length === copy.length && arr.every(
            (value, index) => (value === copy[index])
        );
    }

    async clickOnSearchRefreshIcon(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchGridRefreshIcon)));
        await $(this.selectors.searchGridRefreshIcon).click();
    }

    async addFilter(fieldName: string, textValue: string, type: string, guid?: string): Promise<void> {
        let guidId: string = "";
        if (guid) {
            guidId = `[rx-view-component-id="${guid}"] `
        }

        // await browser.wait(this.EC.elementToBeClickable($(guidId + this.selectors.filterIcon)));
        await $(guidId + this.selectors.filterIcon).click();
        await element.all(by.cssContainingText(guidId + this.selectors.filterItems, fieldName)).last().click();
        // await browser.wait(this.EC.elementToBeClickable(fldLocator));

        switch (type) {
            case "checkbox": {
                let cbox = `.rx-search-filter-option[title='${textValue}']`
                // await browser.wait(this.EC.elementToBeClickable($(cbox)));
                await $(cbox).click();
                break;
            }
            case "date": {
                let date = textValue.split("-");
                await $(this.selectors.dateFrom).clear();
                await $(this.selectors.dateFrom).sendKeys(date[0]);
                await $(this.selectors.dateTo).clear();
                await $(this.selectors.dateTo).sendKeys(date[1]);
                await $(this.selectors.datePickerApplyButton).click();
                break;
            }
            default: {
                element.all(by.cssContainingText(guidId + this.selectors.filterItems, fieldName)).last().$('label.d-textfield__label').sendKeys(textValue + Key.ENTER);
                break;
            }
        }
        await $(guidId + this.selectors.applyButton).click();
        // await utilCommon.waitUntilSpinnerToHide();
    }

    async applyPresetFilter(filterName: string): Promise<void> {
        await $(this.selectors.filterPreset).click();
        await element(by.cssContainingText(this.selectors.presetFilter, filterName)).click();
    }

    async getAppliedFilterName(): Promise<string> {
        return await $(this.selectors.appliedFilterName).getText();
    }

    async isTableColumnSorted(allelementLocator: string, isDescendingOrder?: boolean): Promise<boolean> {
        let allElements = $$(allelementLocator);
        let originalArray: string[] = [], i = 0, processedArray: string[] = [];
        for (i = 0; i < (await allElements).length; i++) {
            await allElements.get(i).getText().then(async (text) => {
                originalArray.push(text);
            });
        }
        processedArray = originalArray.slice();
        if (isDescendingOrder) {
            // Descending         
            processedArray.sort((a, b) => 0 - (a > b ? 1 : -1));
        }
        else {
            // Ascending
            originalArray.sort((a, b) => 0 - (a > b ? -1 : 1));
        }
        console.log("UI column values: ", originalArray);
        console.log("Sorted array: ", processedArray);
        return processedArray.length === originalArray.length && processedArray.every(
            (value, index) => (value === originalArray[index])
        );
    }

    async isAllFilterValueMatches(expectedFilterValues: string[], guid?: string): Promise<boolean> {
        await $(this.selectors.filterPreset).click();
        let csslocator: string = undefined;
        if (guid) csslocator = `[rx-view-component-id='${guid}'] ${this.selectors.filterItems}`;
        else csslocator = this.selectors.filterItems;
        let actualFilterValues = await element.all(by.css(csslocator))
            .map(async function (filterItems) {
                return await filterItems.getAttribute('innerText');
            });
        actualFilterValues.sort();
        expectedFilterValues.sort();
        return actualFilterValues.length === expectedFilterValues.length && actualFilterValues.every(
            (value, index) => (value === expectedFilterValues[index])
        );
    }

    async isEntireColumnContainsSameValue(columnHeader: string, value: string, guid: string): Promise<boolean> {
        let allValues = await this.getAllValuesFromColoumn(guid, columnHeader);
        const allEqual = arr => arr.every(v => v === arr[0]);
        return allEqual(allValues) && allValues[0] === value;
    }
}
export default new GridOperation();