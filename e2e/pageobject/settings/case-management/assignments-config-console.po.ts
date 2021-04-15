import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../../utils/utility.grid'
import utilityCommon from '../../../utils/utility.common';

class AssignmentsConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        guid: "876fe795-fdb4-4ebe-ada7-dd2ff5cb280c",
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
        await utilityGrid.searchAndOpenHyperlink(assignmentMappingName, this.selectors.guid);
    }

    async searchAndselectAssignmentConfig(caseTemplateValue: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(caseTemplateValue, this.selectors.guid);
    }

    async selectAllRecordsAssignmentConfig(): Promise<void> {
        await utilityGrid.selectAllCheckBox();
    }

    async searchAssignmentConfig(assignmentMappingName: string): Promise<void> {
        await utilityGrid.searchRecord(assignmentMappingName);
    }

    async getValueOnAssignmentConfigGrid(columnName: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnName, this.selectors.guid);
    }

    async clickOnCreateAssignmentConfiguration(): Promise<void> {
        await $(this.selectors.addAssignmentBtn).click();
    }

    async isCreateAssignmentConfigurationEnabled(): Promise<boolean> {
        return await $(this.selectors.addAssignmentBtn).isEnabled();
    }

    async areCaseAssignmentGridColumnMatches(columnNames: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnNames, this.selectors.guid);
    }

    async addColumns(columnNames: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnNames, this.selectors.guid);
    }

    async removeColumns(columnNames: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnNames, this.selectors.guid);
    }

    async clickDeleteButton(): Promise<void> {
        await $(this.selectors.deleteButton).click();
    }

    async clickDeleteButtonOnlyIfRecordsPresent(): Promise<void> {
        let recordsCount = await utilityGrid.getNumberOfRecordsInGrid(this.selectors.guid);
        if (recordsCount > 0) {
            await utilityGrid.selectAllCheckBox();
            await $(this.selectors.deleteButton).click();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        }
        else {
            console.log("No records to delete")
        }
    }

    async addFilter(fieldName: string, textValue: string, type: string): Promise<void> {
        await utilityGrid.addFilter(fieldName, textValue, type);
        //        await utilityCommon.waitUntilSpinnerToHide();
    }

    async clearFilter(): Promise<void> {
        await utilityGrid.clearFilter();
        //        await utilityCommon.waitUntilSpinnerToHide();
    }

    async deleteDefaultAssignmentConfig(): Promise<void> {
        await utilityGrid.clearFilter();
        await this.addFilter('Default Mapping', 'True', 'radioButton');
        await $('.at-selection-checkbox .ui-chkbox-box').isPresent().then(async (result) => {
            if (result) {
                await utilityGrid.selectAllCheckBox();
                await this.clickDeleteButton();
                await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
                await utilityCommon.closePopUpMessage();
                await utilityGrid.clearFilter();
            } else {
                await utilityGrid.clearFilter();
            }
        });
    }

    async deleteFilteredAssignmentConfig(): Promise<void> {
        await $('.at-selection-checkbox .ui-chkbox-box').isPresent().then(async (result) => {
            if (result) {
                await utilityGrid.selectAllCheckBox();
                await this.clickDeleteButton();
                await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
                await utilityCommon.closePopUpMessage();
                await utilityGrid.clearFilter();
            } else {
                await utilityGrid.clearFilter();
            }
        });
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnHeader, this.selectors.guid);
    }

}

export default new AssignmentsConfigConsolePage();