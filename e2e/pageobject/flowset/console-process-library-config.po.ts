import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../utils/util.grid';

class ConsoleProcessLibrary {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addRegisterProcessButton: '[rx-view-component-id="07cee854-7e4b-4760-8dcf-71a9fa1c211b"] button',
        registerProcessGuid:'1aed89be-c517-4afb-a5bc-ad1e82652a6c',
    }

    async clickOnRegisterProcess(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addRegisterProcessButton)));
        await $(this.selectors.addRegisterProcessButton).click();
    }

    async isRegisterProcessEnable(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addRegisterProcessButton)));
        await $(this.selectors.addRegisterProcessButton).isEnabled;
    }

    async searchAndSelectFlowset(flowset:string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(flowset);
    }
}

export default new ConsoleProcessLibrary();