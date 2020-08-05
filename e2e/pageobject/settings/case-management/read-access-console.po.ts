import { $, protractor, ProtractorExpectedConditions, element, by } from "protractor";
import utilGrid from '../../../utils/util.grid';
import utilCommon from '../../../utils/util.common';

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

    async isDeleteButtonDisplayed(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).isPresent();
    }

    async clickOnReadAccessConfiguration(): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.addReadAccessBtn)));
        await $(this.selectors.addReadAccessBtn).click();
    }

    async addColumns(columnNames: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.consoleReadAccessGuid, columnNames);
    }

    async removeColumns(columnNames: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.consoleReadAccessGuid, columnNames);
    }

    async getValueOnReadAccessConfigGrid(columnName:string): Promise<string>{
        return await utilGrid.getSelectedGridRecordValue(this.selectors.consoleReadAccessGuid,columnName);
    }

    async clickDeleteButton(): Promise<void> {
        await $(this.selectors.deleteButton).click();
    }

    async addFilter(fieldName: string, textValue: string, type: string): Promise<void> {
        await utilGrid.addFilter(fieldName, textValue, type);
    }

    async deleteDefaultReadAccess(): Promise<void> {
        await utilGrid.clearFilter();
        await this.addFilter('Default Mapping', 'True', 'checkbox');
        await $('div.ui-grid-row').isPresent().then(async (result) => {
            if (result) {
                await utilGrid.selectAllCheckBox();
                await this.clickDeleteButton();
                await utilCommon.clickOnWarningOk();
                await utilCommon.closePopUpMessage();
                await utilGrid.clearFilter();
                console.log("Record is Deleted");                
            } else {
                await utilGrid.clearFilter();
                console.log("Record is Not Present");
            }
        });
    }

    async searchReadAccessMappingName(processMappingName: string): Promise<boolean> {
        await utilGrid.searchRecord(processMappingName, this.selectors.consoleReadAccessGuid);
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