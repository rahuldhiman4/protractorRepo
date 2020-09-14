import { element, by, protractor, ProtractorExpectedConditions, $, $$, browser } from "protractor";
import utilCommon from '../../../utils/util.common';
import utilGrid from '../../../utils/util.grid';

class ServiceTargetViewConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        serviceTargetHeader: '.datasource__heading .padleft13',
        serviceTargetSearchInput: 'searchText',
        createServiceTargetButton: 'button.d-icon-left-plus',
        goalTypeConsoleGUID: '781a6488-ff08-481b-86c7-7c78c577357b',
        refreshIcon: 'button.d-icon-refresh',
        filterIcon: '.rx-search-filter button',
        filterItems: '.search-filter-dropdown .d-accordion__item',
        applyButton: '.rx-search-filter-heading__apply',
        addColumnIcon: 'rx-record-grid-menu.rx-record-grid-toolbar__item_visible-columns .d-icon-ellipsis',
        filterClose: '.d-tag-remove-button',

    }

    async searchServiceTarget(searchSVT: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(searchSVT);
    }

    async isAddSVTButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.createServiceTargetButton).isEnabled();
    }

    async removeColumns(columnNames: string[]): Promise<void> {
        await ($(this.selectors.addColumnIcon)).click();
        for (let i: number = 0; i < columnNames.length; i++) {
            let customxpath = `(//*[@rx-configuration="recordGridConfiguration"]//li[contains(@class,"d-dropdown__menu-options-item")]//a[text()="${columnNames[i]}"])[1]`;
            let attrbuteVal = await element(by.xpath(customxpath)).getAttribute('aria-checked');
            if (attrbuteVal == 'true') {
                await element(by.xpath(customxpath)).click();
            } else { console.log('Column already selected'); }
        }
        await ($(this.selectors.addColumnIcon)).click();
    }

    async addColumns(columnNames: string[]): Promise<void> {
        await ($(this.selectors.addColumnIcon)).click();
        for (let i: number = 0; i < columnNames.length; i++) {
            let customxpath = `(//*[@rx-configuration="recordGridConfiguration"]//li[contains(@class,"d-dropdown__menu-options-item")]//a[text()="${columnNames[i]}"])[1]`;
            //            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(customxpath))));
            let attrbuteVal = await element(by.xpath(customxpath)).getAttribute('aria-checked');
            if (attrbuteVal == 'false') {
                await element(by.xpath(customxpath)).click();
            } else { console.log('Column: ', columnNames[i], ' already selected'); }
        }
        await ($(this.selectors.addColumnIcon)).click();
    }

    async searchOnGridConsole(searchValue: string): Promise<void> {
        await utilGrid.searchOnGridConsole(searchValue);
    }

    async isGridRecordDisplayed(searchValue: string): Promise<boolean> {
        return await utilGrid.isGridRecordPresent(searchValue);
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
        let arr: string[] = [];
        columnHeader = "'" + columnHeader + "'";

        //Clicking on columns based on sort type
        let columnHeaderLocator = await element(by.xpath(`//*[@rx-configuration="recordGridConfiguration"]//div[@role="columnheader"]//*[text()=${columnHeader}]`));
        let ariaSort = `//*[@rx-configuration="recordGridConfiguration"]//div[@role="columnheader"]//*[text()=${columnHeader}]//ancestor::div[@aria-sort]`;
        for (let i: number = 0; i < 3; i++) {
            let sortValue = await element(by.xpath(ariaSort)).getAttribute("aria-sort");
            if (sortValue == sortType) {
                console.log("Sorted as: " + sortType);
                break;
            }
            else {
                await columnHeaderLocator.click();
            }
        }

        //Verifying if columns are sorted
        let gridColumnHeaderPosition = `//*[@rx-configuration="recordGridConfiguration"]//span[@class="ui-grid-header-cell-label"][text()=${columnHeader}]/parent::div/parent::div[@role='columnheader']/parent::div/preceding-sibling::*`;
        let gridRecords = '//div[@class="ui-grid-canvas"]/div';
        let columnPosition: number = await element.all(by.xpath(gridColumnHeaderPosition)).count();
        columnPosition = columnPosition + 1;
        let gridRows: number = await element.all(by.xpath(gridRecords)).count();
        let gridRecordCellValue;
        for (let i: number = 1; i <= gridRows; i++) {
            try {
                gridRecordCellValue = `(//*[@rx-configuration="recordGridConfiguration"]//div[@class="ui-grid-cell-contents"]/parent::div/parent::div)[${i}]/div[${columnPosition}]/div`;
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

    async getServiceTargetGUID(): Promise<string> {
        return await $$('[rx-configuration="recordGridConfiguration"] div.ui-grid-row .ui-grid-cell-contents').last().getText();
    }

    async getServiceTargetID(): Promise<string> {
        return await $$('[rx-configuration="recordGridConfiguration"] div.ui-grid-row .ui-grid-cell-contents').get(1).getText();
    }

    async isFilteredRecordDisplayed(): Promise<boolean> {
        return await $('[rx-configuration="recordGridConfiguration"] div.ui-grid-row').isPresent();
    }

    async clickRefreshIcon(): Promise<void> {
        await $(this.selectors.refreshIcon).click();
    }

    async clearFilter(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterClose)),2000);
        await $(this.selectors.filterClose).click();
    }


}

export default new ServiceTargetViewConsole();