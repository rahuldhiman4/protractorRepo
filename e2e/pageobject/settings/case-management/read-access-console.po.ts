import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class ReadAccessConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addReadAccessBtn: '[rx-view-component-id="12ed5e94-7064-4d46-a4b7-31562f84b28b"] button',
        deleteButton: '[rx-view-component-id="0ff26fc0-a352-46dd-91e9-dffda0f97ef5"] button'
    }

    async isAddButtonDisabled() {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addReadAccessBtn)));
        return await $(this.selectors.addReadAccessBtn).getAttribute("disabled") == "true";
    }

    async isDeleteButtonDisabled() {
        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).getAttribute("disabled") == "true";
    }

}

export default new ReadAccessConsolePage();