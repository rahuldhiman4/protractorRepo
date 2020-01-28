import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../utils/util.grid';

class ConsoleFlowset {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addFlowsetButton: '[rx-view-component-id="061b4a18-bba7-4f39-b545-c8a5216851df"] button',
        flowsetGuid:'99dc49f0-0f0e-4ec2-9b31-c0766ba23885',
    }

    async isAddFlowsetButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addFlowsetButton)));
        return await $(this.selectors.addFlowsetButton).getAttribute("disabled") == "true";
    }

    async clickOnAddFlowset(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addFlowsetButton)));
        await $(this.selectors.addFlowsetButton).click();
    }

    async searchAndSelectFlowset(flowset:string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(flowset);
    }
}

export default new ConsoleFlowset();