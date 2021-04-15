import { $, protractor, ProtractorExpectedConditions } from "protractor";

class EditApplicationConfiguration {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        companyDropDown: '[rx-view-component-id="a423a9c6-179b-4af2-aad8-3febd15a3bdf"] button div',
    }

    async getCompanyValue(): Promise<string> {
        return await $(this.selectors.companyDropDown).getText();
    }
}

export default new EditApplicationConfiguration();