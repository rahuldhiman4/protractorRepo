import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../../utils/util.grid'

class AssignmentsConfigConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        guid: "1b99bc03-6124-4e14-9acc-7c6213f23f4a",
        addAssignmentBtn: '[rx-view-component-id="3d2b6371-d60f-4346-a9c0-7815d2cd4241"] button',
        deleteButton: '[rx-view-component-id="10da8112-39a0-4be3-9388-f526f2fd1bbd"] button'
    }

    async isAddAssignmentsBtnDisabled(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.addAssignmentBtn)));
        return await $(this.selectors.addAssignmentBtn).getAttribute("disabled") == "true";
    }

    async isDeleteAssignmentConfigBtnDisabled(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).getAttribute("disabled") == "true";
    }

    async searchAndClickOnAssignmentConfig(assignmentMappingName: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(assignmentMappingName, this.selectors.guid);
    }

    async searchAndselectAssignmentConfig(caseTemplateValue: string): Promise<void> {
        await utilGrid.searchAndSelectGridRecord(caseTemplateValue, this.selectors.guid);
    }

    async searchAssignmentConfig(assignmentMappingName: string): Promise<void> {
        await utilGrid.searchOnGridConsole(assignmentMappingName);
    }

    async getValueOnAssignmentConfigGrid(columnName:string): Promise<string>{
        return await utilGrid.getSelectedGridRecordValue(this.selectors.guid,columnName);
    }

    async clickOnCreateAssignmentConfiguration(): Promise<void> {
                await $(this.selectors.addAssignmentBtn).click();
    }

    async areCaseAssignmentGridColumnMatches(columnNames: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.guid, columnNames);
    }

    async addRequestedCaseAssignmentGridColumn(columnNames: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.guid, columnNames);
    }

    async removeRequestedCaseAssignmentGridColumn(columnNames: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.guid, columnNames);
    }

    async clickDeleteButton(): Promise<void> {
        await $(this.selectors.deleteButton).click();
    }

}

export default new AssignmentsConfigConsolePage();