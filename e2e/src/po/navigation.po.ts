import { element, by, ProtractorExpectedConditions, protractor, browser } from "protractor"

class NavigationPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createMenu: '//rx-shell//*[text()="Create"]/..',
        createCaseMenuItem: '//rx-shell//*[text()="Create"]/../..//a[contains(text(),"Case")]',
        createQuickCaseMenu: '//rx-shell//*[text()="Quick Case"]/..'
    }

    async gotCreateCase(): Promise<void> {
        await browser.wait(this.EC.visibilityOf(element(by.xpath(this.selectors.createMenu))), 60000);
        await element(by.xpath(this.selectors.createMenu)).click();
        await element(by.xpath(this.selectors.createCaseMenuItem)).click();
        await browser.wait(this.EC.titleContains('Case Create - Business Workflows'), 30000);
    }
    
    async gotoQuickCase(): Promise<void> {
        await element(by.xpath(this.selectors.createQuickCaseMenu)).click();
        await browser.wait(this.EC.titleContains('Case Create - Quick Case - Business Workflows'), 30000);
        
    }
}

export default new NavigationPage();