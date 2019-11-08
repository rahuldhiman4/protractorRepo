import { ProtractorExpectedConditions, protractor, browser, $, $$ } from "protractor"

class CreateQuickCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        inputBox: '.smart-recorder-textarea',
        requesters: '.smart-recorder__popup-item',
        createCaseButton: '.smart-recorder__footer button.d-button_primary',
        gotoCaseButton__preview: '[rx-view-component-id="529287cb-4d9d-4729-aa6c-5676980df72e"] button'
    }

    async selectRequester(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.inputBox)));
        await $(this.selectors.inputBox).sendKeys('@Allen');
        await browser.wait(this.EC.visibilityOf($(this.selectors.requesters)));
        await $$(this.selectors.requesters).first().click();
    }

    async enterSummary(): Promise<void> {
        await $(this.selectors.inputBox).sendKeys('This is test case using quick case e2e');
    }

    async saveCase(): Promise<void> {
        await $(this.selectors.createCaseButton).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.gotoCaseButton__preview)));
    }

    async createQuickCase(): Promise<void> {
        await this.selectRequester();
        await this.enterSummary();
        await this.saveCase();
    }
    
    async gotoCase(): Promise<void> {
        await $(this.selectors.gotoCaseButton__preview).click();
    }
}
export default new CreateQuickCasePage();