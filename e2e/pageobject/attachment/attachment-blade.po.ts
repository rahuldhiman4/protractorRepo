import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
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
        allCheckbox: '.row_selection .ui-grid-selection-row-header-button',
        attachmentSize: '.attachmnet-size',
        paginationNextButton: '.d-icon-right-angle_right',
        paginationPreviousButton: '.d-icon-right-angle_left',
        refreshButton: '.d-icon-refresh',
    }


    async searchRecord(record: string): Promise<void> {
        await $(this.selectors.searchbox).clear();
        await $(this.selectors.searchbox).click();
        await $(this.selectors.searchbox).sendKeys(record);
        await $(this.selectors.searchButton).click();
        let i: number;
        for (i = 0; i <= 10; i++) {
            let bolnVal: boolean = await $(this.selectors.selectCheckbox).isPresent();
            if (bolnVal == false) {
                await browser.sleep(5000);
                await $(this.selectors.searchbox).clear();
                await $(this.selectors.searchbox).sendKeys(record);
                await $(this.selectors.searchButton).click();
            } else {
                break;
            }
        }
    }

    async searchAndSelectCheckBox(record: string): Promise<void> {
        let allAttachmentRows: ElementFinder[] = await $$('.attachments_row');
        let attachmentFound: boolean = false;
        for (let i: number = 0; i < allAttachmentRows.length; i++) {
            let attachmentName: ElementFinder = await allAttachmentRows[i].$('.attachment-title-text');
            if (await attachmentName.getText() === record) {
                await browser.executeScript("arguments[0].scrollIntoView();", await allAttachmentRows[i].$('.ui-grid-selection-row-header-buttons').getWebElement());
                await allAttachmentRows[i].$('.ui-grid-selection-row-header-buttons').click();
                attachmentFound = true;
                break;
            }
        }
        if (!attachmentFound) {
            await $(this.selectors.searchbox).clear();
            await $(this.selectors.searchbox).sendKeys(record);
            await $(this.selectors.searchButton).click();
            let i: number;
            for (i = 0; i <= 10; i++) {
                let bolnVal: boolean = await $(this.selectors.selectCheckbox).isPresent();
                if (bolnVal == false) {
                    await browser.sleep(5000);
                    await $(this.selectors.searchbox).clear();
                    await $(this.selectors.searchbox).sendKeys(record);
                    await $(this.selectors.searchButton).click();

                } else {
                    break;
                }
            }
        }
    }

    async getAttachmentSize(): Promise<string> {
        return await $(this.selectors.attachmentSize).getText();
    }

    async clickOnColumnHeader(columnHeader: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.columnnHeader, columnHeader)).click();
    }

    async isAttachmentPresent(attachmentName: string): Promise<boolean> {
        return await $(`.attachment-title-text[title='${attachmentName}']`).isPresent();
    }

    async getAttachmentNameCount(attachmentName: string): Promise<number> {
        return await $$(`.attachment-title-text[title='${attachmentName}']`).count();
    }

    async getAttachmentToolTipText(attachmentName: string): Promise<boolean> {
        return await $(`.attachment-title-text[title='${attachmentName}']`).getAttribute('title') == attachmentName ? true : false;
    }

    async clickOnAllCheckboxButton(): Promise<void> {
        await $(this.selectors.allCheckbox).click();
    }

    async isCheckBoxSelected(record: string): Promise<boolean> {
        let allAttachmentRows: ElementFinder[] = await $$('.attachments_row');
        for (let i: number = 0; i < allAttachmentRows.length; i++) {
            let attachmentName: ElementFinder = await allAttachmentRows[i].$('.attachment-title-text');
            if (await attachmentName.getText() === record) {
                await browser.executeScript("arguments[0].scrollIntoView();", await allAttachmentRows[i].$('.ui-grid-selection-row-header-buttons').getWebElement());
                return await allAttachmentRows[i].$('.ui-grid-selection-row-header-buttons').isSelected();
            }
        }
    }

    async clickOnPaginationPreviousButton(): Promise<void> {
        await $(this.selectors.paginationPreviousButton).click();
    }

    async clickOnPaginationNextButton(): Promise<void> {
        await $(this.selectors.paginationNextButton).click();
    }

    async clickOnRefreshButton(): Promise<void> {
        await $(this.selectors.refreshButton).click();
    }

    async getRecordValue(value: any): Promise<string> {
        return await element(by.cssContainingText(this.selectors.gridValue, value)).getText();
    }

    async clickOnFileName(value: any): Promise<void> {
        await $(`.attachment-title-text[title='${value}']`).click();
    }

    async clickOnDownloadButton(): Promise<void> {
        await $(this.selectors.download).click();
    }

    async isDownloadButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.download).isEnabled();
    }

    async clickOnCloseButton(): Promise<void> {
        await $(this.selectors.close).click();
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