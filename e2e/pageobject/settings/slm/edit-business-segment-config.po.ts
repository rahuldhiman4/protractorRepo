import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from "../../../utils/utility.common";

class BusinessTimeSegmentConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        statusGuid: '0dcae164-99ca-4df9-ac69-4467c72e3b5d',
        nextButton: '[rx-view-component-id="6420624b-6958-47d8-8dcf-18bdffcfee46"] button',
        previousButton: '[rx-view-component-id="1789d876-36fe-4919-8111-0de2886c18df"] button',
        finishButton: '[rx-view-component-id="c5549ad7-5548-4710-b681-6f6cc96b76f6"] button',
    }

    
    async updateStatus(status: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async clickNextButton(): Promise<void> {
        await $(this.selectors.nextButton).click();
    }

    async isFinishButtonDisabled(): Promise<boolean> {
        return await $(this.selectors.finishButton).getAttribute("disabled") == "true";
    }
}

export default new BusinessTimeSegmentConfigEditPage();