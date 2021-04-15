import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class BusinessTimeSharedEntityConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addBusinessTimeSharedEntity: '[rx-view-component-id="01b05b2e-c358-4f2e-89c8-437cea39722d"] button',
        
    }

    async isAddBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.addBusinessTimeSharedEntity).isPresent();
    }

}

export default new BusinessTimeSharedEntityConfigConsolePage();