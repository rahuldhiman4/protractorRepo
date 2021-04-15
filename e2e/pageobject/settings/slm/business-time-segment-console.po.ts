import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class BusinessSegmentConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addBusinessSegment: '[rx-view-component-id="cbfb8468-4d75-4ba4-8c50-2d7f97cf2ec4"] button',
    }

    
    async isAddBusinessSegmentBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.addBusinessSegment).isPresent();
    }

}

export default new BusinessSegmentConsolePage();