import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class ViewTaskTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        processnameValue: '[rx-view-component-id="5e792424-a4d7-4235-8715-be24149be51b"] p',
        copyTaskButton: '[rx-view-component-id="e2ec0e87-e65d-4926-9efc-25e3ad329e52"] button',
    }

    async getProcessNameValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.processnameValue)));
        return await $(this.selectors.processnameValue).getText();
    }

    async clickOnCopyTemplate(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.copyTaskButton)));
        await $(this.selectors.copyTaskButton).click();
    }
}

export default new ViewTaskTemplate();