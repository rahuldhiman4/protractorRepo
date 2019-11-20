import { ProtractorExpectedConditions, protractor, browser, by, element, until, By } from 'protractor';
import { Util } from './util.common';

export class GridOperation {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    utility:Util;
    constructor(){
        this.utility = new Util();
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
        browser.sleep(2000);
        await this.utility.clickOnElement(by.xpath(`(//div[@aria-label='Select row'])['${value}']`));
    }

    async gridHyperLink(id: string){
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText('.ui-grid__link', id))));
        await element(by.cssContainingText('.ui-grid__link', id)).click();
    }
}