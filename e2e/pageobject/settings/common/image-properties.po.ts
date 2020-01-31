import { resolve } from "path";
import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class ImagePropertiesPopUp {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        tabs: '.cke_dialog_tab[title]',
        updalodFile: 'input[name="upload"]',
        sendItToServerButton: '.cke_dialog_ui_fileButton .cke_dialog_ui_button',
        oKButton: '.cke_dialog_ui_button_ok',
        preViewBoxImg: '.ImagePreviewBox img[style]',

    }

    async addImg(menuName: string,fileToUpload:string): Promise<void> {
        await this.clickOnTab(menuName);
        await this.addAttachment(fileToUpload);
        await this.clickOnSendItToServerButton();
        await this.clickOnOkButton();
    }

    async clickOnOkButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.oKButton)));
        await $(this.selectors.oKButton).click();
    }

    async clickOnSendItToServerButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.sendItToServerButton)));
        await $(this.selectors.sendItToServerButton).click();
//        await browser.wait(this.EC.visibilityOf($(this.selectors.preViewBoxImg)));

    }

    async clickOnTab(menuName: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.tabs)));
        await element(by.cssContainingText(this.selectors.tabs,menuName)).click();
    }

    async addAttachment(fileToUpload:string): Promise<void> {
        var elem = $('iframe.cke_dialog_ui_input_file');
        await browser.switchTo().frame(elem.getWebElement());
        const absolutePath = resolve(__dirname, fileToUpload);
        console.log("image to upload>>>>>>>>>>>>>>", absolutePath);
        await $(this.selectors.updalodFile).sendKeys(absolutePath);
        await browser.switchTo().defaultContent();
    }
}

export default new ImagePropertiesPopUp();