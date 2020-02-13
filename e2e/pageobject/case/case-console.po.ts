import { $, $$, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';
import gridUtil from '../../utils/util.grid';

class CaseConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        guid: "d628a20f-e852-4a84-87e6-f5191f77ddf6",
        searchCase: '[rx-id="search-text-input"]',
        recommendedCaseLink: '.ui-grid__link',
        recommendedCaseCheckBox: '.ui-grid-icon-ok',
        filter: '.rx-search-filter__trigger',
        availableFilterDrpDown: '.d-accordion__title',
        applyFilter: '.rx-search-filter-heading__apply',
        removeFilter: '..d-tag-remove-button',
        tableValue: '.ui-grid-cell-contents',
        addToWatchlist: '[rx-view-component-id="10a1551f-f216-4af7-8d62-cc79ad19f8c3"] button',
        watchlistIcon: '[rx-view-component-id="deafbff6-199a-46f5-b7bf-642cda73c5f1"] button',
        caseTitle: '[rx-view-component-id="72f24e08-7a88-4479-8eb1-d254dde49c6c"] span',
        changeAssignment: '[rx-view-component-id="da845b85-4dba-4fb2-90b1-93d6f6d94058"] button',
        allCheckboxes: '[rx-view-component-id="d628a20f-e852-4a84-87e6-f5191f77ddf6"] .ui-grid-selection-row-header-buttons',
        selectAllrows: '[rx-view-component-id="d628a20f-e852-4a84-87e6-f5191f77ddf6"] div[aria-label="Select all rows"]',
        selectedCheckboxes: '[rx-view-component-id="d628a20f-e852-4a84-87e6-f5191f77ddf6"] div[aria-checked="true"]',
        unselectedCheckboxes: '[rx-view-component-id="d628a20f-e852-4a84-87e6-f5191f77ddf6"] div[aria-checked="false"]',
        requestedCaseGuid: '934faa1d-0932-4141-9a6e-7f6ac1726427'
    }

    async setCaseSearchBoxValue(input: string): Promise<void> {
        await gridUtil.searchOnGridConsole(input);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async clickFirstLinkInCaseSearchGrid(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedCaseLink)));
        await $$(this.selectors.recommendedCaseLink).first().click();
    }

    async isCaseIdHyperlinked(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.recommendedCaseLink)));
        return await $$(this.selectors.recommendedCaseLink).first().isDisplayed();
    }

    async getCaseTitle(): Promise<string> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.caseTitle)));
        return await $(this.selectors.caseTitle).getText();
    }

    async clickFirstCheckBoxInCaseSearchGrid(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedCaseCheckBox)));
        await $(this.selectors.recommendedCaseCheckBox).click();
    }

    async searchCase(caseId: string): Promise<void> {
        await gridUtil.clearFilter();
        await gridUtil.searchRecord(caseId);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async searchAndOpenCase(caseId: string): Promise<void> {
        await gridUtil.clearFilter();
        await gridUtil.searchAndOpenHyperlink(caseId);
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async isCaseIdPresent(caseId: string): Promise<boolean> {
        let caseIDfromGrid = await gridUtil.getSelectedGridRecordValue(this.selectors.guid, 'Case ID');
        return caseId === caseIDfromGrid;
    }

    async isCasePriorityPresent(priority: string): Promise<boolean> {
        let priorityValue = await gridUtil.getSelectedGridRecordValue(this.selectors.guid, 'Priority');
        return priority === priorityValue;
    }

    async isCaseStatusPresent(status: string): Promise<boolean> {
        let caseStatus = await gridUtil.getSelectedGridRecordValue(this.selectors.guid, 'Status');
        return status === caseStatus;
    }

    async isCaseSummaryPresent(summary: string): Promise<boolean> {
        let caseSummary = await gridUtil.getSelectedGridRecordValue(this.selectors.guid, 'Summary');
        return summary === caseSummary;
    }

    async selectCase(caseID: string): Promise<void> {
        await gridUtil.searchAndSelectGridRecord(caseID);
    }

    async clickOnAddToWatchlist(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addToWatchlist)));
        await $(this.selectors.addToWatchlist).click();
    }

    async clickOnWatchlistIcon(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.watchlistIcon)));
        await $(this.selectors.watchlistIcon).click();
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async getAddToWatchlistText(): Promise<string> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addToWatchlist)));
        return await $(this.selectors.addToWatchlist).getText();
    }

    async getWatchlistIconText(): Promise<string> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.watchlistIcon)));
        return await $(this.selectors.watchlistIcon).getText();
    }

    async clickOnChangeAssignmentButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeAssignment)));
        await $(this.selectors.changeAssignment).click();
    }

    async selectAllCases(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectAllrows)));
        await $(this.selectors.selectAllrows).click();
    }

    async isAllCasesSelected(): Promise<boolean> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addToWatchlist)));
        let allCheckboxCount: number = await $$(this.selectors.allCheckboxes).count();
        let selectedCheckboxCount: number = await $$(this.selectors.selectedCheckboxes).count();
        return selectedCheckboxCount == allCheckboxCount;
    }

    async isAllCasesUnSelected(): Promise<boolean> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addToWatchlist)));
        let allCheckboxCount: number = await $$(this.selectors.allCheckboxes).count();
        let unSelectedCheckboxCount: number = await $$(this.selectors.unselectedCheckboxes).count();
        return unSelectedCheckboxCount == allCheckboxCount;
    }

    async areCaseGridColumnMatches(columnNames: string[]): Promise<boolean> {
        return await gridUtil.areColumnHeaderMatches(this.selectors.guid, columnNames);
    }

    async addRequestedCaseGridColumn(columnNames: string[]): Promise<void> {
        await gridUtil.addGridColumn(this.selectors.guid, columnNames);
    }

    async removeRequestedCaseGridColumn(columnNames: string[]): Promise<void> {
        await gridUtil.removeGridColumn(this.selectors.guid, columnNames);
    }

}

export default new CaseConsolePage();