import { ProtractorExpectedConditions, protractor, browser, element, by, $, $$ } from "protractor"

class CreateQuickCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        inputBox: '.smart-recorder-textarea',
        requesters: '.smart-recorder__popup-item',
        caseTemplate: '.smart-recorder__popup-item-highlight',
        createCaseButton: '.smart-recorder__footer button.d-button_primary',
        gotoCaseButton__preview: '[rx-view-component-id="529287cb-4d9d-4729-aa6c-5676980df72e"] button',
        validateButton: '[rx-view-component-id="390a77cd-518e-4d67-abb4-bc4d410ce3df"] button',
        pinValidateInput: '[rx-view-component-id="bfe9a8e0-26e7-43a5-9561-1c92539bdda3"] input',
        pinOk: '[rx-view-component-id="ea1b7291-a0de-47d6-9239-cccf6b850a86"] button',
        popUpMsgLocator: '.rx-growl-item__message'
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

    async selectCaseTemplate(templateName:string): Promise<void> {
        await $(this.selectors.inputBox).sendKeys(`!${templateName}`);
        await browser.wait(this.EC.or(async ()=>{
            let count = await $$(this.selectors.caseTemplate).count();
            return count >= 1;
        }))
        await element(by.cssContainingText(this.selectors.caseTemplate, templateName)).click();
    }

    async validatePin(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.validateButton)));
        await $(this.selectors.validateButton).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.pinValidateInput)));
        await $(this.selectors.pinValidateInput).sendKeys("1234");
        await $(this.selectors.pinOk).click();
    }

    async getPopUpMessage() {
        await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)));
        return await $(this.selectors.popUpMsgLocator).getText();
    }

    async waitUntilPopUpDisappear() {
        await browser.wait(this.EC.invisibilityOf($(this.selectors.popUpMsgLocator)));
    }

    async saveCase(): Promise<void> {
        await $(this.selectors.createCaseButton).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.gotoCaseButton__preview)));
    }
}

export default new CreateQuickCasePage();