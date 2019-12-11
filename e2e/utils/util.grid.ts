import { $, browser, by, By, element, protractor, ProtractorExpectedConditions, until } from 'protractor';
import { Util } from './util.common';

export class GridOperation {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    utility: Util;
    constructor() {
        this.utility = new Util();
    }

    selectors = {
        firstGridCheckbox: '.ui-grid-row .ui-grid-selection-row-header-buttons',
        selectAllCheckBox: 'grid.selection.selectAll',
        summaryField1: 'input[role="search"]',
        searchButton1: 'button[rx-id="submit-search-button"]',
        filterPreset: '.rx-filter-presets-dropdown__trigger',
        clearFilterButton: 'button[rx-id="clear-button"]',
        filterClose: '.d-tag-remove-button',
        refreshButton: 'button.d-icon-refresh'
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

    async searchAndSelectFirstCheckBox(gridId: string, value: string) {
        await browser.wait(until.elementLocated(By.css(this.getGridLocator('summaryField', gridId))), 10000).clear();
        await browser.wait(until.elementLocated(By.css(this.getGridLocator('summaryField', gridId))), 10000).sendKeys(value);
        await browser.wait(until.elementLocated(By.css(this.getGridLocator('searchButton', gridId))), 10000).click();
        await browser.wait(this.EC.elementToBeClickable($(this.getGridLocator('firstCheckBox', gridId))));
        await browser.sleep(5000);
        await $(this.getGridLocator('firstCheckBox', gridId)).click();
    }

    async searchAndSelectFirstCheckBoxWOGrid(value: string) {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.summaryField1)));
        await $(this.selectors.summaryField1).sendKeys(value);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchButton1)));
        await $(this.selectors.searchButton1).click();
        await browser.sleep(5000);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.firstGridCheckbox)));
        await $(this.selectors.firstGridCheckbox).click();
    }

    async searchAndSelectAllCheckBox(gridId: string, value: string) {
        await browser.wait(this.EC.elementToBeClickable($(this.getGridLocator('summaryField', gridId))));
        await $(this.getGridLocator('summaryField', gridId)).sendKeys(value);
        await browser.wait(this.EC.elementToBeClickable($(this.getGridLocator('searchButton', gridId))));
        await $(this.getGridLocator('searchButton', gridId)).click();
        browser.sleep(3000);
        await browser.wait(this.EC.elementToBeClickable(element(by.model(this.selectors.selectAllCheckBox))));
        await element(by.model(this.selectors.selectAllCheckBox)).click();
    }

    async searchAndSelectAllCheckBoxWOGrid(value: string) {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.summaryField1)));
        await $(this.selectors.summaryField1).sendKeys(value);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchButton1)));
        await $(this.selectors.searchButton1).click();
        await browser.sleep(5000);
        await browser.wait(this.EC.elementToBeClickable(element(by.model(this.selectors.selectAllCheckBox))));
        await element(by.model(this.selectors.selectAllCheckBox)).click();
    }

    async gridHyperLink(id: string) {
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText('.ui-grid__link', id))));
        await element(by.cssContainingText('.ui-grid__link', id)).click();
    }

    async searchAndOpenHyperlink(id: string) {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.summaryField1)));
        await $(this.selectors.summaryField1).clear();
        await $(this.selectors.summaryField1).sendKeys(id);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchButton1)));
        await $(this.selectors.searchButton1).click();
        await browser.sleep(3000);
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText('.ui-grid__link', id))));
        await element(by.cssContainingText('.ui-grid__link', id)).click();
    }

    async clearFilter(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterPreset)));
        try {
            if (await $(this.selectors.filterClose).isDisplayed()) {
                await $(this.selectors.filterPreset).click();
                await browser.wait(this.EC.elementToBeClickable($(this.selectors.clearFilterButton)));
                await $(this.selectors.clearFilterButton).click();
                await browser.sleep(1000);
            }
        }
        catch (Ex) {
            await console.log("Filters are already clear");
        }
    }

    async searchAndClickOnHyperLink(gridId: string, value: string) {
        await browser.wait(until.elementLocated(By.css(this.getGridLocator('summaryField', gridId))), 10000).sendKeys(value);
        await browser.wait(until.elementLocated(By.css(this.getGridLocator('searchButton', gridId))), 10000).click();
        let gridvalueLink = element(by.cssContainingText((this.getGridLocator('gridLink', gridId)), value));
        console.log(gridvalueLink);
        await browser.wait(this.EC.elementToBeClickable(gridvalueLink));
        await browser.sleep(3000);
        await gridvalueLink.click();
    }

    async clickOnSelectedGridRecord(guid: string, columnHeader: string, filterOptionValue: string): Promise<void> {
        let gridRecord: string;
        columnHeader = "'" + columnHeader + "'";
        guid = "'" + guid + "'";
        var gridColumnHeaderPosition = `//*[@rx-view-component-id=${guid}]//span[@class="ui-grid-header-cell-label"][text()=${columnHeader}]/parent::div/parent::div[@role='columnheader']/parent::div/preceding-sibling::*`;
        var gridRecords = '//div[@class="ui-grid-canvas"]/div';
        let columnPosition: number = await element.all(by.xpath(gridColumnHeaderPosition)).count();
        columnPosition = columnPosition + 1;
        await element($(this.selectors.refreshButton)).click();
        var gridRows: number = await element.all(by.xpath(gridRecords)).count();
        if (gridRows > 0) {
            let gridRecordCellValue = `(//*[@rx-view-component-id=${guid}]//div[@class="ui-grid-cell-contents"]/parent::div/parent::div)[1]/div[${columnPosition}]/div`;
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(gridRecordCellValue))));
            await element(by.xpath(gridRecordCellValue)).click();
        } else {
            console.log("No Records Found.");
        }
    }

    async getSelectedGridRecordValue(guid: string, columnHeader: string, filterOptionValue: string): Promise<string> {
        let gridRecord: string;
        columnHeader = "'" + columnHeader + "'";
        guid = "'" + guid + "'";
        let gridColumnHeaderPosition = `//*[@rx-view-component-id=${guid}]//span[@class="ui-grid-header-cell-label"][text()=${columnHeader}]/parent::div/parent::div[@role='columnheader']/parent::div/preceding-sibling::*`;
        let gridRecords = '//div[@class="ui-grid-canvas"]/div';
        let columnPosition: number = await element.all(by.xpath(gridColumnHeaderPosition)).count();
        columnPosition = columnPosition + 1;
        await element($(this.selectors.refreshButton)).click();
        var gridRows: number = await element.all(by.xpath(gridRecords)).count();
        if (gridRows > 0) {
            let gridRecordCellValue = `(//*[@rx-view-component-id=${guid}]//div[@class="ui-grid-cell-contents"]/parent::div/parent::div)[1]/div[${columnPosition}]/div`;
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(gridRecordCellValue))));
            gridRecord = await element(by.xpath(gridRecordCellValue)).getText();
        } else {
            console.log("No Records Found.");
        }
        return gridRecord;
    }


}

export default new GridOperation();
