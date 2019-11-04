import { browser, until, ExpectedConditions, element, by, By } from 'protractor';
import { WebDriverLocator } from 'protractor/built/locators';

export class Util{

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
}