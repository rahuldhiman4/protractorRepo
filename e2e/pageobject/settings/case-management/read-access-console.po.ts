import { $, protractor, ProtractorExpectedConditions, element, by } from "protractor";
import utilityGrid from '../../../utils/utility.grid';
import utilityCommon from '../../../utils/utility.common';

class ReadAccessConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addReadAccessBtn: '[rx-view-component-id="12ed5e94-7064-4d46-a4b7-31562f84b28b"] button',
        deleteButton: '[rx-view-component-id="0ff26fc0-a352-46dd-91e9-dffda0f97ef5"] button',
        consoleReadAccessGuid: 'e2eae398-8732-41ea-b245-9d09cfee1dc3'
    }

    async isAddButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addReadAccessBtn)));
        return await $(this.selectors.addReadAccessBtn).isPresent();
    }

    async isAddButtonEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addReadAccessBtn)));
        return await $(this.selectors.addReadAccessBtn).isEnabled();
    }

    async isDeleteButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.deleteButton).isPresent();
    }

    async clickOnReadAccessConfiguration(): Promise<void> {
        await $(this.selectors.addReadAccessBtn).click();
    }

    async addColumns(columnNames: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnNames, this.selectors.consoleReadAccessGuid);
    }

    async removeColumns(columnNames: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnNames, this.selectors.consoleReadAccessGuid);
    }

    async getValueOnReadAccessConfigGrid(columnName: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnName, this.selectors.consoleReadAccessGuid);
    }

    async clickDeleteButton(): Promise<void> {
        await $(this.selectors.deleteButton).click();
    }

    async addFilter(fieldName: string, textValue: string, type: string): Promise<void> {
        await utilityGrid.addFilter(fieldName, textValue, type);
    }

    async searchAndOpenReadAccess(ReadAccessName: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(ReadAccessName);
    }


    async deleteDefaultReadAccess(): Promise<void> {
        await utilityGrid.clearFilter();
        await this.addFilter('Default Mapping', 'True', 'radioButton');
        await $('tr.at-data-row').isPresent().then(async (result) => {
            if (result) {
                await utilityGrid.selectAllCheckBox();
                await this.clickDeleteButton();
                await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
                await utilityCommon.closePopUpMessage();
                await utilityGrid.clearFilter();
                console.log("Record is Deleted");
            } else {
                await utilityGrid.clearFilter();
                console.log("Record is Not Present");
            }
        });
    }

    async searchReadAccessMappingName(processMappingName: string): Promise<boolean> {
        await utilityGrid.searchRecord(processMappingName, this.selectors.consoleReadAccessGuid);
        return await element(by.cssContainingText('[rx-view-component-id="e2eae398-8732-41ea-b245-9d09cfee1dc3"] .ui-grid__link', processMappingName)).isPresent().then(async (result) => {
            if (result) {
                return await element(by.cssContainingText('[rx-view-component-id="e2eae398-8732-41ea-b245-9d09cfee1dc3"] .ui-grid__link', processMappingName)).getText() == processMappingName ? true : false;
            } else {
                console.log("Mapping not present");
                return false;
            }
        });
    }
}

export default new ReadAccessConsolePage();