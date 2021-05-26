import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class ProcessLibraryConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addRegisterProcessBtn: '[rx-view-component-id="07cee854-7e4b-4760-8dcf-71a9fa1c211b"] button'
    }

    async isRegisterProcessBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.addRegisterProcessBtn).isPresent();
    }
}

export default new ProcessLibraryConsolePage();