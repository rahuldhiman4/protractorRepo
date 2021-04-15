import utilityCommon from '../../utils/utility.common';
import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../utils/utility.grid';


class CaseConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        guid: "d628a20f-e852-4a84-87e6-f5191f77ddf6",
        searchCase: '[rx-view-component-id="d628a20f-e852-4a84-87e6-f5191f77ddf6"] .adapt-search-field-ellipsis',
        recommendedCaseLink: '.ui-table-tbody tr td:nth-of-type(2) a',
        recommendedCaseCheckBox: '.ui-chkbox-box',
        filter: '.d-icon-left-filter',
        availableFilterDrpDown: '.card-title',
        AttachedfileName: '.bwf-attachment-container__file-name',
        addToWatchlist: '[rx-view-component-id="10a1551f-f216-4af7-8d62-cc79ad19f8c3"] button span',
        watchlistIcon: '[rx-view-component-id="deafbff6-199a-46f5-b7bf-642cda73c5f1"] button',
        caseTitle: '[rx-view-component-id="72f24e08-7a88-4479-8eb1-d254dde49c6c"] span',
        changeAssignment: '[rx-view-component-id="da845b85-4dba-4fb2-90b1-93d6f6d94058"] button',
        allCheckboxes: '[rx-view-component-id="d628a20f-e852-4a84-87e6-f5191f77ddf6"] .ui-chkbox-box',
        selectAllrows: '[rx-view-component-id="d628a20f-e852-4a84-87e6-f5191f77ddf6"] .checkbox__input',
        selectedCheckboxes: '[rx-view-component-id="d628a20f-e852-4a84-87e6-f5191f77ddf6"] .pi-check',
        unselectedCheckboxes: '[rx-view-component-id="d628a20f  -e852-4a84-87e6-f5191f77ddf6"] .ui-state-default :not(.pi-check)',
        LineOfBuisnessText: '[rx-view-component-id="48502f73-98fe-4958-ada3-9abcf698438f"] button'
    }

    async setCaseSearchBoxValue(input: string): Promise<void> {
        await utilityGrid.searchRecord(input);
    }

    async clickFirstLinkInCaseSearchGrid(): Promise<void> {
        await $$(this.selectors.recommendedCaseLink).first().click();
    }

    async isCaseIdHyperlinked(): Promise<boolean> {
        return await $$(this.selectors.recommendedCaseLink).first().isDisplayed();
    }

    async getCaseTitle(): Promise<string> {
        return await $(this.selectors.caseTitle).getText();
    }

    async getLineOfBuisnessText(): Promise<string> {
        return await $(this.selectors.LineOfBuisnessText).getText();
    }

    async isLineOfBuisnessEnable(): Promise<boolean> {
        return await $(this.selectors.LineOfBuisnessText).isEnabled();
    }

    async clickFirstCheckBoxInCaseSearchGrid(): Promise<void> {
        await $(this.selectors.recommendedCaseCheckBox).click();
    }

    async searchCase(caseId: string): Promise<void> {
        await utilityGrid.searchRecord(caseId);
    }

    async searchAndOpenCase(caseId: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(caseId);
    }

    async isCaseIdPresent(caseId: string): Promise<boolean> {
        let caseIDfromGrid = await utilityGrid.getFirstGridRecordColumnValue('Case ID');
        return caseId === caseIDfromGrid.trim();
    }

    async isCasePriorityPresent(priority: string): Promise<boolean> {
        let priorityValue = await utilityGrid.getFirstGridRecordColumnValue('Priority');
        return priority === priorityValue;
    }

    async isCaseStatusPresent(status: string): Promise<boolean> {
        let caseStatus = await utilityGrid.getFirstGridRecordColumnValue('Status');
        return status === caseStatus;
    }

    async isCaseSummaryPresent(summary: string): Promise<boolean> {
        let caseSummary = await utilityGrid.getFirstGridRecordColumnValue('Summary');
        return summary === caseSummary;
    }

    async selectCase(caseID: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(caseID);
    }

    async clickOnAddToWatchlist(): Promise<void> {
        await $(this.selectors.addToWatchlist).isPresent().then(async (result) => {
            if (result) await $(this.selectors.addToWatchlist).click();
        });
    }

    async clickOnWatchlistIcon(): Promise<void> {
        await $(this.selectors.watchlistIcon).isPresent().then(async (result) => {
            if (result) await $(this.selectors.watchlistIcon).click();
        });
    }

    async getAddToWatchlistText(): Promise<string> {
        return await $(this.selectors.addToWatchlist).getText();
    }

    async getWatchlistIconText(): Promise<string> {
        return await $(this.selectors.watchlistIcon).getText();
    }

    async clickOnChangeAssignmentButton(): Promise<void> {
        await $(this.selectors.changeAssignment).click();
    }

    async selectAllCases(): Promise<void> {
        await $(this.selectors.selectAllrows).click();
    }

    async isAllCasesSelected(): Promise<boolean> {
        let allCheckboxCount: number = await $$(this.selectors.allCheckboxes).count();
        let selectedCheckboxCount: number = await $$(this.selectors.selectedCheckboxes).count();
        return selectedCheckboxCount == allCheckboxCount;
    }

    async isAllCasesUnSelected(): Promise<boolean> {
        let allCheckboxCount: number = await $$(this.selectors.allCheckboxes).count();
        let selectedCheckboxCount: number = await $$(this.selectors.selectedCheckboxes).count();
        return selectedCheckboxCount == 0 && allCheckboxCount > 0;
    }

    async areCaseGridColumnMatches(columnNames: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnNames, this.selectors.guid);
    }

    async addRequestedCaseGridColumn(columnNames: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnNames, this.selectors.guid);
    }

    async removeRequestedCaseGridColumn(columnNames: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnNames, this.selectors.guid);
    }

    async removeColumns(columnNames: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnNames, this.selectors.guid);
    }

    async addColumns(columnNames: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnNames, this.selectors.guid);
    }

    async isFieldLabelDisplayed(labelName: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.guid, labelName);
    }
    async getCountAttachedFiles(fileName: string): Promise<number> {
        return await element.all(by.cssContainingText(this.selectors.AttachedfileName, fileName)).count();
    }
}

export default new CaseConsolePage();