import { resolve } from "path";
import { $, browser, by, element, protractor, ProtractorExpectedConditions, $$ } from "protractor";

class ImagePropertiesPopUp {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        tabs: '.cke_dialog_tab[title]',
        updalodFile: 'input[name="upload"]',
        sendItToServerButton: '.cke_dialog_ui_fileButton .cke_dialog_ui_button',
        oKButton: '.cke_dialog_ui_button_ok',
        preViewBoxImg: '.ImagePreviewBox img[style]',
        inputFieldsOnImageInfoTab: '.cke_dialog_ui_hbox_first input.cke_dialog_ui_input_text',
        inputBox:'.cke_dialog_ui_labeled_content input.cke_dialog_ui_input_text',
    }

    async setInputBoxValue(value:string,squence:number):Promise<void>{
        await $$(this.selectors.inputBox).get(squence).sendKeys(value);
    }

    async getInputBoxValue(squence:number):Promise<string>{
       return await $$(this.selectors.inputBox).get(squence).getAttribute('value');
    }

    async addImageOnEmail(menuName: string,fileToUpload:string,width:number,getInputValue:number): Promise<string> {
        await this.clickOnTab(menuName);
        await this.addAttachment(fileToUpload);
        await this.clickOnSendItToServerButton();
        await this.setInputBoxValue('200',width);
        let source =await this.getInputBoxValue(getInputValue);
        await this.clickOnOkButton();
        return source;
    }

    async addImageOnEmailTemplate(fileToUpload:string):Promise<string>{
        await element(by.cssContainingText(this.selectors.tabs, 'Upload')).click();
        await this.addAttachment(fileToUpload);
        await this.clickOnSendItToServerButton();
        await $$(this.selectors.inputBox).get(2).sendKeys(200);
        let source =await $$(this.selectors.inputBox).first().getAttribute('value')
        this.clickOnOkButton();
        return source;
    }
    
    async addImg(menuName: string, fileToUpload: string): Promise<void> {
        await this.clickOnTab(menuName);
        await this.addAttachment(fileToUpload);
        await this.clickOnSendItToServerButton();
        await browser.wait(this.EC.visibilityOf($$(this.selectors.inputFieldsOnImageInfoTab).get(0)), 5000);
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
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.tabs)), 3000);
        await element(by.cssContainingText(this.selectors.tabs, menuName)).click();
    }

    async addAttachment(fileToUpload: string): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('iframe.cke_dialog_ui_input_file').getWebElement());
        await browser.wait(this.EC.elementToBeClickable($('input[type="file"]')), 3000);
        const absolutePath = resolve(__dirname, fileToUpload);
        console.log("image to upload>>>>>>>>>>>>>>", absolutePath);
        await $(this.selectors.updalodFile).sendKeys(absolutePath);
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }
}

export default new ImagePropertiesPopUp();