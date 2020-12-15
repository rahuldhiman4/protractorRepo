import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../../utils/util.grid'
import utilCommon from '../../../utils/util.common';

class AssignmentsConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        guid: "1b99bc03-6124-4e14-9acc-7c6213f23f4a",
        addAssignmentBtn: '[rx-view-component-id="3d2b6371-d60f-4346-a9c0-7815d2cd4241"] button',
        deleteButton: '[rx-view-component-id="10da8112-39a0-4be3-9388-f526f2fd1bbd"] button'
    }

    async isAddAssignmentsBtnDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addAssignmentBtn)));
        return await $(this.selectors.addAssignmentBtn).isPresent();
    }

    async isDeleteAssignmentConfigBtnDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).isPresent();
    }

    async searchAndClickOnAssignmentConfig(assignmentMappingName: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(assignmentMappingName, this.selectors.guid);
    }

    async searchAndselectAssignmentConfig(caseTemplateValue: string): Promise<void> {
        await utilGrid.searchAndSelectGridRecord(caseTemplateValue, this.selectors.guid);
    }

    async selectAllRecordsAssignmentConfig(): Promise<void> {
        await utilGrid.selectAllCheckBox();
    }

    async searchAssignmentConfig(assignmentMappingName: string): Promise<void> {
        await utilGrid.searchOnGridConsole(assignmentMappingName);
    }

    async getValueOnAssignmentConfigGrid(columnName: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.guid, columnName);
    }

    async clickOnCreateAssignmentConfiguration(): Promise<void> {
        await $(this.selectors.addAssignmentBtn).click();
    }

    async isCreateAssignmentConfigurationEnabled(): Promise<boolean> {
        return await $(this.selectors.addAssignmentBtn).isEnabled();
    }

    async areCaseAssignmentGridColumnMatches(columnNames: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.guid, columnNames);
    }

    async addColumns(columnNames: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.guid, columnNames);
    }

    async removeColumns(columnNames: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.guid, columnNames);
    }

    async clickDeleteButton(): Promise<void> {
        await $(this.selectors.deleteButton).click();
    }

    async clickDeleteButtonOnlyIfRecordsPresent(): Promise<void> {
        let recordsCount = await utilGrid.getNumberOfRecordsInGrid(this.selectors.guid);
        if (recordsCount > 0) {
            await utilGrid.selectAllCheckBox();
            await $(this.selectors.deleteButton).click();
            await utilCommon.clickOnWarningOk();
        }
        else {
            console.log("No records to delete")
        }
    }

    async addFilter(fieldName: string, textValue: string, type: string): Promise<void> {
        await utilGrid.addFilter(fieldName, textValue, type);
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async clearFilter(): Promise<void> {
        await utilGrid.clearFilter();
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async deleteDefaultAssignmentConfig(): Promise<void> {
        await utilGrid.clearFilter();
        await this.addFilter('Default Mapping', 'True', 'checkbox');
        await $('div.ui-grid-row').isPresent().then(async (result) => {
            if (result) {
                await utilGrid.selectAllCheckBox();
                await this.clickDeleteButton();
                await utilCommon.clickOnWarningOk();
                await utilCommon.closePopUpMessage();
                await utilGrid.clearFilter();
            } else {
                await utilGrid.clearFilter();
            }
        });
    }

    async deleteFilteredAssignmentConfig(): Promise<void> {
        await $('div.ui-grid-row').isPresent().then(async (result) => {
            if (result) {
                await utilGrid.selectAllCheckBox();
                await this.clickDeleteButton();
                await utilCommon.clickOnWarningOk();
                await utilCommon.closePopUpMessage();
                await utilGrid.clearFilter();
            } else {
                await utilGrid.clearFilter();
            }
        });
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.guid, columnHeader);
    }

}

export default new AssignmentsConfigConsolePage();