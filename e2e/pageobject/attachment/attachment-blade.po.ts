import { $$, $, browser, by, element, protractor, ProtractorExpectedConditions, ElementFinder } from "protractor";

class AttachmentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        columnnHeader: '.ui-grid-header-cell',
        selectCheckbox: '.ui-grid-selection-row-header-buttons',
        download: '.case-attachments-action-buttons .d-button_primary',
        close: '.case-attachments-action-buttons .d-button_secondary',
        gridValue: '.ui-grid-cell-contents',
        searchbox: 'input[role="search"]',
        searchButton: 'button[rx-id="submit-search-button"]',
        crossbutton: '.d-icon-cross[aria-label="Clear Search Field"]',
    }

    async searchAndSelectCheckBox(record: string): Promise<void> {
        let allAttachmentRows: ElementFinder[] = await $$('.attachments_row');
        let attachmentFound: boolean = false;
        for (let i: number = 0; i < allAttachmentRows.length; i++) {
            let attachmentName: ElementFinder = await allAttachmentRows[i].$('.attachment-title-text');
            if (await attachmentName.getText() === record) {
                await allAttachmentRows[i].$('.ui-grid-selection-row-header-buttons').click();
                attachmentFound = true;
                break;
            }
        }
        if (!attachmentFound) {
            await $(this.selectors.searchbox).click();
            await $(this.selectors.searchbox).sendKeys(record);
            await $(this.selectors.searchButton).click();
            let i: number;
            for (i = 0; i <= 10; i++) {
                let bolnVal: boolean = await $(this.selectors.selectCheckbox).isPresent();
                if (bolnVal == false) {
                    await browser.sleep(5000);
                    await $(this.selectors.crossbutton).click();
                    await $(this.selectors.searchbox).sendKeys(record);
                    await $(this.selectors.searchButton).click();
                } else {
                    break;
                }
            }
        }
    }

    async getRecordValue(value: any): Promise<string> {
        return await element(by.cssContainingText(this.selectors.gridValue, value)).getText();
    }

    async clickOnFileName(value: any): Promise<void> {
        // return await element(by.cssContainingText(this.selectors.gridValue, value)).click();
        await $(`.attachment-title-text[title='${value}']`).click();
        // await $(`[rx-view-component-id='${value}'] .ui-grid-header-cell-label`);

    }

    async clickOnDownloadButton(): Promise<void> {
        await $(this.selectors.download).click();
    }

    async getTextOfColumnHeader(columnHeader: string): Promise<string> {
        return await element(by.cssContainingText(this.selectors.columnnHeader, columnHeader)).getText()
    }

    async isDownloadButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.download).isDisplayed();
    }

    async isCloseButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.close).isDisplayed();
    }
}

export default new AttachmentBlade();