import { resolve } from "path";
import { $, browser, protractor, ProtractorExpectedConditions, $$ } from "protractor";

class ImagePropertiesPopUp {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        tabs: '.cke_dialog_tab[title]',
        updalodFile: 'input[name="upload"]',
        sendItToServerButton: '.cke_dialog_ui_fileButton .cke_dialog_ui_button',
        oKButton: '.cke_dialog_ui_button_ok',
        preViewBoxImg: '.ImagePreviewBox img[style]',
        inputFieldsOnImageInfoTab: '.cke_dialog_ui_hbox_first input.cke_dialog_ui_input_text',
        inputBox: 'input.cke_dialog_ui_input_text',
        imageDialogWindow: '.cke_dialog_body',
        crossIcon: '[class="cke_dialog_close_button"]',
    }

    async getImageParentElementIndex(): Promise<number> {
        let i = 0;
        let elementsCount = await $$('.cke_dialog_body').count();
        for (i = 0; i < elementsCount; i++) {
            let tempElement = await $$('.cke_dialog_body').get(i);
            let actualText = await tempElement.$('div').getText();
            if (actualText == 'Image Properties') {
                break;
            }
        }
        return i;
    }

    async setInputBoxValue(value: string, fieldElementSeq: number): Promise<void> {
        let index = await this.getImageParentElementIndex();
        await $$(this.selectors.imageDialogWindow).get(index).$$(this.selectors.inputBox).get(fieldElementSeq).clear();
        await $$(this.selectors.imageDialogWindow).get(index).$$(this.selectors.inputBox).get(fieldElementSeq).sendKeys(value);
    }

    async getInputBoxValue(fieldElementSeq: number): Promise<string> {
        let index = await this.getImageParentElementIndex();
        return await $$(this.selectors.imageDialogWindow).get(index).$$(this.selectors.inputBox).get(fieldElementSeq).getAttribute('value');
    }

    async addImageOnEmail(menuName: string, fileToUpload: string, width: number, getInputValue: number): Promise<string> {
        await this.clickOnTab(menuName);
        await this.addAttachment(fileToUpload);
        await this.clickOnSendItToServerButton();
        await this.setInputBoxValue('200', width);
        let source = await this.getInputBoxValue(getInputValue);
        await this.clickOnOkButton();
        return source;
    }

    async addImageOnEmailTemplate(fileToUpload: string): Promise<string> {
        await this.clickOnTab('Upload');
        await this.addAttachment(fileToUpload);
        await this.clickOnSendItToServerButton();
        await $$(this.selectors.inputBox).get(2).sendKeys(200);
        let source = await $$(this.selectors.inputBox).first().getAttribute('value')
        await this.clickOnOkButton();
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
        let index = await this.getImageParentElementIndex();
        await $$(this.selectors.imageDialogWindow).get(index).$(this.selectors.oKButton).click();
    }

    async clickOnSendItToServerButton(): Promise<void> {
        await $(this.selectors.sendItToServerButton).click();
    }

    async clickOnCrossIcon(): Promise<void> {
        await $(this.selectors.crossIcon).isPresent().then(async (present) => {
            if (present) return await $(this.selectors.crossIcon).click();
            else return null;
        });
    }

    async clickOnTab(menuName: string): Promise<void> {
        let tab = `.cke_dialog_tab[title="${menuName}"]`;
        await browser.wait(this.EC.elementToBeClickable($(tab)), 3000).then(async () => {
            await $(tab).click();
        });
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