import { $, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../utils/util.grid';

class AttachmentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        columnnHeader: '.ui-grid-header-cell',
        selectCheckbox: '.ui-grid-selection-row-header-buttons',
        download: '.case-attachments-action-buttons .d-button_primary',
        close: '.case-attachments-action-buttons .d-button_secondary',
    }


    async SearchAndSelectCheckBox(record: string): Promise<void> {
        await utilGrid.searchRecord(record);
        await $(this.selectors.selectCheckbox).click();
    }

    async isColumnHeaderMatche(columnHeader: string): Promise<string> {
        // return await element(by.cssContainingText(this.selectors.columnnHeader, columnHeader)).getText() == columnHeader ? true : false;
        return await element(by.cssContainingText(this.selectors.columnnHeader, columnHeader)).getText()
        // let columnHeadertrim=columnHeader.trim();
        // console.log('This is column header trim '+columnHeadertrim);
        // console.log('This is column header text '+columnHeaderText);

        // return columnHeadertrim == columnHeader ? true : false;
    }

    async isDownloadButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.download).isDisplayed();
    }

    async isCloseButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.close).isDisplayed();
    }


}

export default new AttachmentBlade();