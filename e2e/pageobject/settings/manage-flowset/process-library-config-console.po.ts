import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class ProcessLibraryConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addRegisterProcessBtn: '[rx-view-component-id="07cee854-7e4b-4760-8dcf-71a9fa1c211b"] button'
    }

    async isRegisterProcessBtnDisabled(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.addRegisterProcessBtn)));
        return await $(this.selectors.addRegisterProcessBtn).getAttribute("disabled") == "true";
    }
}

export default new ProcessLibraryConsolePage();