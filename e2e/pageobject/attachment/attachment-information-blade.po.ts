import { $, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class AttachmentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        values: '.case-details div',
        download: '.case-details-footer .d-button_primary',
        close: '.case-details-footer .d-button_secondary',
        title: '.case-attachments-details .modal-title'

    }

    async getValuesOfInformation(value: any): Promise<string> {
        return await element(by.cssContainingText(this.selectors.values, value)).getText();
    }

    async isDownloadButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.download).isDisplayed();
    }

    async isCloseButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.close).isDisplayed();
    }

    async clickOnDonwloadButton(): Promise<void> {
        await $(this.selectors.download).click();
    }

    async isTitleNameDisplayed(): Promise<boolean> {
        return await $(this.selectors.title).getText() == 'Attachment Information' ? true : false;
    }


}

export default new AttachmentBlade();