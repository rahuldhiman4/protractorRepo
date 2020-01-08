import { $, browser, protractor, ProtractorExpectedConditions} from "protractor";


class ConsoleEmailTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        emailTemplate:'[rx-view-component-id="c293ce64-f48e-42cd-ab05-cf5f36d70a91"] button',
    }

    async createEmailTemplate():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailTemplate)));
        $(this.selectors.emailTemplate).click();
    }   
}
export default new ConsoleEmailTemplate();