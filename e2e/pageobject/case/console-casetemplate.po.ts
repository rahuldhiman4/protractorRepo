import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class CaseTemplateConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createCaseTemplate: '[rx-view-component-id="3a9fd0a9-2b68-4872-a022-7c56b377a4dc"] button',
    }

    async clickOnCreateCaseTemplateButton(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.createCaseTemplate)));
        await $(this.selectors.createCaseTemplate).click();
    }
}

export default new CaseTemplateConsole();
