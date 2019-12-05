import { ProtractorExpectedConditions, protractor, browser, $, element, by } from "protractor"

class BusinessSegmentConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addBusinessSegment: '[rx-view-component-id="cbfb8468-4d75-4ba4-8c50-2d7f97cf2ec4"] button'
    }

    async isAddBusinessSegmentBtnDisabled(): Promise<boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.addBusinessSegment)));
        return await $(this.selectors.addBusinessSegment).getAttribute("disabled")=="true";
    }
}

export default new BusinessSegmentConsolePage();