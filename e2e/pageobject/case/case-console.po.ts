import { $, $$, browser, Key, protractor, ProtractorExpectedConditions } from "protractor";
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
    }

    async setCaseSearchBoxValue(input: string): Promise<void> {
        await gridUtil.searchOnGridConsole(input);
        await utilCommon.waitUntilSpinnerToHide();
    }

    async clickFirstLinkInCaseSearchGrid(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedCaseLink)));
        await $$(this.selectors.recommendedCaseLink).first().click();
    }

    async isCaseIdHyperlinked(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.recommendedCaseLink)));
        return await $$(this.selectors.recommendedCaseLink).first().isDisplayed();
    }

    async clickFirstCheckBoxInCaseSearchGrid(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedCaseCheckBox)));
        await $(this.selectors.recommendedCaseCheckBox).click();
    }

    async searchCase(caseId: string): Promise<void> {
        await gridUtil.clearFilter();
        await gridUtil.searchRecord(caseId);
        await utilCommon.waitUntilSpinnerToHide();
    }

    async searchAndOpenCase(caseId: string): Promise<void> {
        await gridUtil.clearFilter();
        await gridUtil.searchAndOpenHyperlink(caseId);
        await utilCommon.waitUntilSpinnerToHide();
    }

    async isCaseIdPresent(caseId: string): Promise<boolean> {
        let priorityValue = await gridUtil.getSelectedGridRecordValue(this.selectors.guid, 'Case ID');
        return caseId === priorityValue;
    }

    async isCasePriorityPresent(priority: string): Promise<boolean> {
        let priorityValue = await gridUtil.getSelectedGridRecordValue(this.selectors.guid, 'Priority');
        return priority === priorityValue;
    }

    async isCaseStatusPresent(status: string): Promise<boolean> {
        let priorityValue = await gridUtil.getSelectedGridRecordValue(this.selectors.guid, 'Status');
        return status === priorityValue;

    }

    async isCaseSummaryPresent(summary: string): Promise<boolean> {
        let priorityValue = await gridUtil.getSelectedGridRecordValue(this.selectors.guid, 'Summary');
        return summary === priorityValue;
    }

}

export default new CaseConsolePage();