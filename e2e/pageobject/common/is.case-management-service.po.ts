import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../utils/util.grid';

class CaseManagementServicePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        summaryField1: 'input[role="search"]',
        searchButton1: 'button[rx-id="submit-search-button"]',
        allTab: '.d-tabs__tab',
    }
    async searchAndgetValue(id:string):Promise<string>{
        await $(this.selectors.summaryField1).clear();
        await $(this.selectors.summaryField1).sendKeys(id);
//          await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchButton1)));
        await $(this.selectors.searchButton1).click();
//          await browser.sleep(3000);
//          await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText('.ui-grid__link', id))));
        return await element(by.linkText(id)).getText();
//          await utilCommon.waitUntilSpinnerToHide();
        
    }

    async clickOnTab(value:string):Promise<void>{
        await element(by.cssContainingText(this.selectors.allTab,value)).click();
    }
}

export default new CaseManagementServicePage();