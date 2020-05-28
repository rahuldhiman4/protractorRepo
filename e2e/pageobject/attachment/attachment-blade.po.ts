import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../utils/util.grid';
import utilityGrid from '../../utils/utility.grid';
class AttachmentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        row: '[rx-view-component-id="adb9ac10-3732-4fd9-8af3-29bec77272b4"] .at-row',
        gridGuid: 'adb9ac10-3732-4fd9-8af3-29bec77272b4',
        columnnHeader: '.c-header-container .c-header-name',
        selectCheckbox: '.ui-chkbox-box',
        download: '.bwf-case-attachment__footer-button  .btn-primary',
        close: '.bwf-case-attachment__footer-button  .btn-secondary',
        gridValue: '.ui-grid-cell-contents',
        searchbox: '.adapt-search-triggerable .adapt-search-field-ellipsis',
        searchButton: '.input-group-append button',
        crossbutton: '.d-icon-cross[aria-label="Clear Search Field"]',
        allCheckbox: '.checkbox__input',
        attachmentSize: '.bwf-case-attachment__paginator .bwf-case-attachment__paginator__page-count',
        paginationNextButton: '.content-outlet .page-next',
        paginationPreviousButton: '.content-outlet .page-prev',
        refreshButton: '.d-icon-refresh',
        selectedCheckBoxCount: '.bwf-case-attachment__footer-button .bwf-case-attachment__footer-button__selected-files-label',
        attachmentColoumnValues: '[rx-view-component-id="adb9ac10-3732-4fd9-8af3-29bec77272b4"] .attachment-view-thumbnail__title-text',
        attachmentColoumnHeader: 'table thead tr th:nth-of-type(2) div',
        attachedToColoumnValues: '[rx-view-component-id="adb9ac10-3732-4fd9-8af3-29bec77272b4"] td:nth-of-type(3)',
        attachedToColoumnHeader: 'table thead tr th:nth-of-type(3) div',
        mediaTypemediaTypeColoumnValues: '[rx-view-component-id="adb9ac10-3732-4fd9-8af3-29bec77272b4"] td:nth-of-type(4)',
        mediaTypeColoumnHeader: 'table thead tr th:nth-of-type(4) div',
        createdDateColoumnValues: '[rx-view-component-id="adb9ac10-3732-4fd9-8af3-29bec77272b4"] td:nth-of-type(5)',
        createdDateColoumnHeader: 'table thead tr th:nth-of-type(5) div',
        attachmentName: 'table .attachment-view-thumbnail__title-text',
    }

    async getSelectedCheckBoxCount(): Promise<string> {
        return await $(this.selectors.selectedCheckBoxCount).getText();
    }

    async searchAttachment(record: string): Promise<void> {
        await utilityGrid.searchRecord(record);
        await $(this.selectors.searchbox).clear();
        await $(this.selectors.searchbox).sendKeys(record);
        await $(this.selectors.searchButton).click();
        let i: number;
        for (i = 0; i <= 5; i++) {
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
        let allAttachmentRows: ElementFinder[] = await $$('.at-row');
        let attachmentFound: boolean = false;
        for (let i: number = 0; i < allAttachmentRows.length; i++) {
            let attachmentName: ElementFinder = await allAttachmentRows[i].$('.attachment-view-thumbnail__title-text');
            if (await attachmentName.getText() === record) {
                await browser.executeScript("arguments[0].scrollIntoView();", await allAttachmentRows[i].$('.ui-chkbox-box').getWebElement());
                await allAttachmentRows[i].$('.ui-chkbox-box').click();
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

    async clickColumnHeader(columnHeader: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.columnnHeader, columnHeader)).click();
    }

    async isAttachmentPresent(attachmentName: string): Promise<boolean> {
        await this.searchAttachment(attachmentName);
        return await $(this.selectors.row).isPresent().then(async (link) => {
            if (link) {
                return await $(this.selectors.row).isDisplayed();
            } else return false;
        });
    }

    async getAttachmentNameCount(attachmentName: string): Promise<number> {
        return await $$(`.attachment-view-thumbnail__title-text[title='${attachmentName}']`).count();
    }

    async getAttachmentToolTipText(attachmentName: string): Promise<boolean> {
        return await $(`.attachment-view-thumbnail__title-text[title=${attachmentName}]`).getAttribute('title') == attachmentName ? true : false;
    }

    async clickAllCheckboxButton(): Promise<void> {
        await $(this.selectors.allCheckbox).click();
    }

    async isCheckBoxSelected(record: string): Promise<boolean> {
        let allAttachmentRows: ElementFinder[] = await $$('.at-row');
        for (let i: number = 0; i < allAttachmentRows.length; i++) {
            let attachmentName: ElementFinder = await allAttachmentRows[i].$('.attachment-view-thumbnail__title-text');
            if ((await attachmentName.getText()).trim() === record) {
                await browser.executeScript("arguments[0].scrollIntoView();", await allAttachmentRows[i].$('.ui-chkbox-box').getWebElement());
                return await allAttachmentRows[i].$('.ui-chkbox-box').isSelected();
            }
        }
    }

    async clickPaginationPrevious(): Promise<void> {
        await $(this.selectors.paginationPreviousButton).click();
    }

    async clickPaginationNext(): Promise<void> {
        await $(this.selectors.paginationNextButton).click();
    }

    async clickRefreshButton(): Promise<void> {
        await $(this.selectors.refreshButton).click();
    }

    async getRecordValue(columnName: any): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnName);
    }

    async clickFileName(attachment: string): Promise<void> {
        await this.searchAttachment(attachment);
        await element(by.cssContainingText(this.selectors.attachmentName, attachment)).click();
    }

    async clickDownloadButton(): Promise<void> {
        await $(this.selectors.download).click();
    }

    async isDownloadButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.download).isEnabled();
    }

    async clickCloseButton(): Promise<void> {
        await $(this.selectors.close).click();
    }

    async getTextOfColumnHeader(columnHeader: string): Promise<string> {
        return await element(by.cssContainingText(this.selectors.columnnHeader, columnHeader)).getText();
    }

    async isDownloadButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.download).isDisplayed();
    }

    async isCloseButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.close).isDisplayed();
    }

}

export default new AttachmentBlade();