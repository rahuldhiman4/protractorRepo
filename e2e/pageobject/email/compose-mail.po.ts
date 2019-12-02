import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class ComposeMail {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
       discardButton: '[rx-view-component-id="038eaa3f-f2ff-4c6d-a5d1-351449671b76"] button',
    }


    async clickOnDiscardButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.discardButton)));
        await $(this.selectors.discardButton).click();
    }


}

export default new ComposeMail();