import { browser, until, ExpectedConditions, element, by, By, $,$$, ProtractorExpectedConditions, protractor } from 'protractor';
import { WebDriverLocator } from 'protractor/built/locators';

export class Util{
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors= {
        dropdownBox: '.ui-select-match',
        valueSearch: ' input[type="search"]',
        dropDownOption: '.ui-select__rx-choice',
    }

    async clickOnElement(locator: WebDriverLocator){
        const webElement = await browser.wait(until.elementLocated(locator), 10000);
        await browser.wait(until.elementIsEnabled(webElement),10000,`${locator} not appear to be enabled to click`);
        await browser.actions().mouseMove(webElement).perform();
        await webElement.click();
    }

    async waitForSpinnerToHide(){
        await browser.wait(ExpectedConditions.invisibilityOf(element(by.xpath("//*[contains(@class,'d-preloader ')]"))));
//        await browser.wait(until.elementIsNotVisible(element(by.xpath("//*[contains(@class,'d-preloader ')]"))), 5000);
    }

    async selectDropDownOptionWithValueEntered(guid:string, value:string){        
        const dropDown =await $(`[rx-view-component-id="${guid}"]`);
        await browser.wait(this.EC.elementToBeClickable(dropDown.$(this.selectors.dropdownBox)));
        await dropDown.$(this.selectors.dropdownBox).click();
        await browser.wait(this.EC.elementToBeClickable(dropDown.$(this.selectors.valueSearch)));
        await dropDown.$(this.selectors.valueSearch).sendKeys(value);
        await browser.wait(this.EC.or(async ()=>{
            let count = await $$(this.selectors.dropDownOption).count();
            return count >= 1;
    }))
    await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText(this.selectors.dropDownOption, value))));
    await element(by.cssContainingText(this.selectors.dropDownOption, value)).click();
  }

}

export default new Util();
