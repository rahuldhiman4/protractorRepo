import { element, by, protractor, ProtractorExpectedConditions, $, $$, browser } from "protractor";
import utilityGrid from '../../../utils/utility.grid';

class ServiceTargetViewConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        serviceTargetSearchInput: '[rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"] input[type="search"]',
        createServiceTargetButton: '[rx-view-component-id="8985f5e9-f984-43d1-b6cd-ce780f64a71b"] button',
        refreshIcon: '[rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"] .d-icon-refresh',
        filterIcon: '[rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"] .d-icon-left-filter',
        filterItems: '.advanced-filter__tab-content .form-control-feedback',
        applyButton: 'button[data-testid="adapt-af-1_Save"]',
        addColumnIcon: '[rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"] .d-icon-eye_closed',
        filterClose: '.close-inverse',

    }

    async searchServiceTarget(searchSVT: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(searchSVT);
    }

    async isAddSVTButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.createServiceTargetButton).isEnabled();
    }

    async removeColumns(columnNames: string[]): Promise<void> {
        await ($(this.selectors.addColumnIcon)).click();
        for (let i: number = 0; i < columnNames.length; i++) {
            let customxpath = `(//div[@class='a-dropdown-window--menu']//span[2])["${i}"]`;
            let customxpath1 = `(//div[@class='a-dropdown-window--menu']//span[2])["${i}"]/../preceding-sibling::input`;
            let columnVal = await element(by.xpath(customxpath)).getText();

            if (columnVal == columnNames[i]) {
                let attrbuteVal = await element(by.xpath(customxpath)).getAttribute('aria-checked');
                if (attrbuteVal == 'true') {
                    await element(by.xpath(customxpath1)).click();
                } else { console.log('Column already selected'); }
            }
        }
        await ($(this.selectors.addColumnIcon)).click();
    }

    async addColumns(columnNames: string[]): Promise<void> {
        await ($(this.selectors.addColumnIcon)).click();
        for (let i: number = 0; i < columnNames.length; i++) {
            let customxpath = `(//div[@class='a-dropdown-window--menu']//span[2])["${i}"]`;
            let customxpath1 = `(//div[@class='a-dropdown-window--menu']//span[2])["${i}"]/../preceding-sibling::input`;
            let columnVal = await element(by.xpath(customxpath)).getText();

            if (columnVal == columnNames[i]) {
                let attrbuteVal = await element(by.xpath(customxpath)).getAttribute('aria-checked');
                if (attrbuteVal == 'false') {
                    await element(by.xpath(customxpath1)).click();
                } else { console.log('Column already selected'); }
            }
        }
        await ($(this.selectors.addColumnIcon)).click();
    }

    async searchOnGridConsole(searchValue: string): Promise<void> {
        await utilityGrid.searchRecord(searchValue);
    }

    async isGridRecordDisplayed(searchValue: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(searchValue);
    }

    async isGridColumnSorted(columnHeader: string, sortType: string): Promise<boolean> {
        let arr: string[] = [];
        //Clicking on columns based on sort type
        let columnHeaderLocator = await element(by.xpath(`//*[@rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"]//thead//th//span[text()='${columnHeader}']`));
        let columnHeaderSortLocator = await element(by.xpath(`//*[@rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"]//thead//th//span[text()='${columnHeader}']//following-sibling::span`));

        let ariaSort = `//*[@rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"]//thead//th//span[text()='${columnHeader}']//following-sibling::span[@aria-sort]`;
        for (let i: number = 0; i < 3; i++) {
            let sortValue = await element(by.xpath(ariaSort)).getAttribute("aria-sort");
            if (sortValue == sortType) {
                console.log("Sorted as: " + sortType);
                break;
            }
            else {
                await columnHeaderSortLocator.click();
            }
        }

        //Verifying if columns are sorted
        let gridColumnHeaderPosition = `//*[@rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"]//thead//th//span[text()='${columnHeader}']//ancestor::th//preceding-sibling::th`;
        let gridRecords = '//*[@rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"]//tbody//tr';
        let columnPosition: number = await element.all(by.xpath(gridColumnHeaderPosition)).count();
        columnPosition = columnPosition + 1;
        let gridRows: number = await element.all(by.xpath(gridRecords)).count();
        let gridRecordCellValue;
        for (let i: number = 1; i <= gridRows; i++) {
            try {
                gridRecordCellValue = `(//*[@rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"]//tbody//tr)[${i}]//td[${columnPosition}]`;
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
        return await $$('[rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"] div.ui-table-scrollable-body tr td').last().getText();
    }

    async getServiceTargetID(): Promise<string> {
        return await $$('[rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"] div.ui-table-scrollable-body tr td').get(1).getText();
    }

    async isFilteredRecordDisplayed(): Promise<boolean> {
        return await $('[rx-view-component-id="1e73ee06-4772-4770-9e25-e5eba4722fb0"] div.ui-table-scrollable-body tr').isPresent();
    }

    async clickRefreshIcon(): Promise<void> {
        await $(this.selectors.refreshIcon).click();
    }

    async clearFilter(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterClose)), 2000);
        await $(this.selectors.filterClose).click();
    }


}

export default new ServiceTargetViewConsole();