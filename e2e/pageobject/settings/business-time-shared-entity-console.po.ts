import { ProtractorExpectedConditions, protractor, browser, $, element, by } from "protractor"

class BusinessTimeSharedEntityConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addBusinessTimeSharedEntity: '[rx-view-component-id="01b05b2e-c358-4f2e-89c8-437cea39722d"] button'
    }

    async isAddBtnDisabled(): Promise<boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.addBusinessTimeSharedEntity)));
        return await $(this.selectors.addBusinessTimeSharedEntity).getAttribute("disabled")=="true";
    }
}

export default new BusinessTimeSharedEntityConfigConsolePage();