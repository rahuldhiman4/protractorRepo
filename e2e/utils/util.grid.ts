import { ProtractorExpectedConditions, protractor, browser, by, element, until, By, $ } from 'protractor';
import { Util } from './util.common';

export class GridOperation {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    utility:Util;
    constructor(){
        this.utility = new Util();
    }

    selectors = {
        firstGridCheckbox: '.ui-grid-row .ui-grid-selection-row-header-buttons',
        selectAllCheckBox: 'grid.selection.selectAll',
    }

    getGridLocator(locatorName: string, gridId: string) {
        const allLocators = {
            summaryField: `[rx-view-component-id="${gridId}"] input[role="search"]`,
            searchButton: `[rx-view-component-id="${gridId}"] button[rx-id="submit-search-button"]`,
            firstCheckBox: `[rx-view-component-id="${gridId}"] div[class="ui-grid-selection-row-header-buttons ui-grid-icon-ok"]`
        };
        return allLocators[locatorName];
    }

    async searchAndSelectFirstCheckBox(gridId: string, value: string) {
        await browser.wait(until.elementLocated(By.css(this.getGridLocator('summaryField', gridId))), 10000).sendKeys(value);
        await browser.wait(until.elementLocated(By.css(this.getGridLocator('searchButton', gridId))), 10000).click();
        await browser.wait(this.EC.elementToBeClickable($(this.getGridLocator('firstCheckBox', gridId))));
        await browser.sleep(5000);
        await $(this.getGridLocator('firstCheckBox', gridId)).click();
    }

    async searchAndSelectAllCheckBox(gridId: string, value: string) {
        await browser.wait(this.EC.elementToBeClickable($(this.getGridLocator('summaryField', gridId))));
        await $(this.getGridLocator('summaryField', gridId)).sendKeys(value);
        await browser.wait(this.EC.elementToBeClickable($(this.getGridLocator('searchButton', gridId))));
        await $(this.getGridLocator('searchButton', gridId)).click();
        browser.sleep(5000);
        await browser.wait(this.EC.elementToBeClickable(element(by.model(this.selectors.selectAllCheckBox))));
        await element(by.model(this.selectors.selectAllCheckBox)).click();
    }

    async gridHyperLink(id: string){
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText('.ui-grid__link', id))));
        await element(by.cssContainingText('.ui-grid__link', id)).click();
    }
}

export default new GridOperation();
