import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../utils/utility.grid';

class AttachmentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        row: '[rx-view-component-id="adb9ac10-3732-4fd9-8af3-29bec77272b4"] .at-row',
        gridGuid: 'adb9ac10-3732-4fd9-8af3-29bec77272b4',
        columnnHeader: '.c-header__separator',
        selectCheckbox: '.ui-chkbox-box',
        download: '.bwf-case-attachment__footer-button  .btn-primary',
        close: '.bwf-case-attachment__footer-button  .btn-secondary',
        allCheckbox: '.checkbox__input',
        attachmentSize: '.bwf-case-attachment__paginator .bwf-case-attachment__paginator__page-count',
        paginationNextButton: '.content-outlet .page-next',
        paginationPreviousButton: '.content-outlet .page-prev',
        refreshButton: '.d-icon-refresh',
        selectedCheckBoxCount: '.bwf-case-attachment__footer-button .bwf-case-attachment__footer-button__selected-files-label',
        attachmentName: 'table .attachment-view-thumbnail__title-text',
        attachmentSearchBox: '[rx-view-component-id="adb9ac10-3732-4fd9-8af3-29bec77272b4"] .adapt-table-search_input'
    }

    async getSelectedCheckBoxCount(): Promise<string> {
        return await $(this.selectors.selectedCheckBoxCount).getText();
    }

    async searchAttachmentOnGrid(attachment: string): Promise<void> {
        await $(this.selectors.attachmentSearchBox).clear();
        await $(this.selectors.attachmentSearchBox).sendKeys(attachment + protractor.Key.ENTER);
    }

    async searchAttachment(attachment: string): Promise<void> {
        for (let i: number = 0; i < 5; i++) {
            let isFilePresent: boolean = await element(by.cssContainingText(this.selectors.attachmentName, attachment)).isPresent();
            if (isFilePresent == false) {
                await browser.sleep(5000); // To Wait For Attachment gets Display On Grid.
                await this.searchAttachmentOnGrid(attachment);
            } else {
                break;
            }
        }
    }

    async searchAndSelectCheckBox(attachmentName: string): Promise<void> {
        await this.searchAttachment(attachmentName);
        let tableRows = await $$('tbody.ui-table-tbody tr');
        for (let i: number = 0; i < tableRows.length; i++) {
            let fileName: string = await $$('tbody.ui-table-tbody tr').get(i).$('[title]').getText();
            if (fileName === attachmentName) {
                await $$('tbody.ui-table-tbody tr').get(i).$('.at-selection-checkbox').click();
                break;
            }
        }
    }

    async getAttachmentSize(): Promise<string> {
        return await $(this.selectors.attachmentSize).getText();
    }

    async clickColumnHeader(columnHeader: string): Promise<void> {
        let getCountHeaders = await $$('.c-header__separator').count();
        for(let i = 0; i<getCountHeaders; i++){
            let getTextColumnHeader = await $$('.c-header__separator').get(i).getText();
            if (columnHeader == getTextColumnHeader){
                await $$('.ui-sortable-column').get(i).click();
            }
        }
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

    async getGridColumnValues(columnName: any): Promise<string[]> {
        return await utilityGrid.getAllValuesFromColumn(columnName);
    }

    async clickFileName(attachment: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.attachmentName, attachment)).isPresent().then(async (result) => {
            if (result) await element(by.cssContainingText(this.selectors.attachmentName, attachment)).click();
            else {
                await this.searchAttachment(attachment);
                await element(by.cssContainingText(this.selectors.attachmentName, attachment)).click();
            }
        });
    }

    async clickDownloadButton(): Promise<void> {
        await $(this.selectors.download).click();
    }

    async isDownloadButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.download).isEnabled();
    }

    async clickCloseButton(): Promise<void> {
        await $(this.selectors.close).isPresent().then(async (present) => {
            if (present) await $(this.selectors.close).click();
        });
    }

    async isColumnHeaderPresent(columnHeader: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.columnnHeader, columnHeader)).isDisplayed();
    }

    async isDownloadButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.download).isDisplayed();
    }

    async isCloseButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.close).isDisplayed();
    }

    async selectCheckBox(numberCheckbox: number): Promise<void> {
        await $$(this.selectors.selectCheckbox).get(numberCheckbox - 1).click();
    }
}

export default new AttachmentBlade();