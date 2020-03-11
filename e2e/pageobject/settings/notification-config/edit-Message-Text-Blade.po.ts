import { $, protractor, ProtractorExpectedConditions, Key, browser } from "protractor";
class EditMessageTextBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        messageBody: '.cke_wysiwyg_div',
        saveButton:'[rx-view-component-id="498a2cf3-8866-4303-996a-61dc33e4a400"] button',
    }

    async setMessageBody(value:string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.messageBody)),3000);
        await $(this.selectors.messageBody).click();
        await browser.actions().sendKeys(protractor.Key.chord(Key.CONTROL + Key.END)).click().sendKeys(protractor.Key.ENTER).click();
        await $(this.selectors.messageBody).sendKeys(value);
        await browser.actions().sendKeys(protractor.Key.chord(Key.CONTROL + Key.END)).click().sendKeys(protractor.Key.ENTER).click();
       
    }

    async clickOnSaveButton():Promise<void>{
        await $(this.selectors.saveButton).click();
    }

}
export default new EditMessageTextBlade();