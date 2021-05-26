import { $, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class AttachmentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        values: '.attachment-details__information  .row div',
        download: '.dp-footer .btn-primary',
        close: '.dp-footer .btn-secondary',
        title: '.dp-header .dp-title'
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

    async clickDownloadButton(): Promise<void> {
        await $(this.selectors.download).click();
    }

    async clickCloseButton(): Promise<void> {
        await $(this.selectors.close).isEnabled().then(async (result) => {
            if (result) await $(this.selectors.close).click();
        });
    }

    async isTitleNameDisplayed(): Promise<boolean> {
        return await $(this.selectors.title).getText() == 'Attachment Information' ? true : false;
    }

}

export default new AttachmentBlade();