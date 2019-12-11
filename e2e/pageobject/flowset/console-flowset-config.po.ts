import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class ConsoleFlowset {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addFlowsetButton: '[rx-view-component-id="061b4a18-bba7-4f39-b545-c8a5216851df"] button'
    }

    async isAddFlowsetButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addFlowsetButton)));
        return await $(this.selectors.addFlowsetButton).getAttribute("disabled") == "true";
    }
}

export default new ConsoleFlowset();