import { $, $$, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../utils/util.grid';

class CaseWatchlistBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        watchlistEvents: '[rx-view-component-id="99e01ff6-3123-436a-85f4-405994271b33"] .rx-multiselect-list span',
        saveButton: '[rx-view-component-id="fe442bdb-1c1e-47b7-8f47-cfcf61505b45"] button',
        closeButton: '[rx-view-component-id="7a0cb1ff-c0a5-4571-a2dc-6670842db2c6"] button',
        guid: '60bc2700-9909-4b0f-8de4-edb02443b62f',
        selectAllrows: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] div[aria-label="Select all rows"]',
        selectedCheckboxes: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] div[aria-checked="true"]',
        unselectedCheckboxes: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] div[aria-checked="false"]',
        allCheckboxes: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] .ui-grid-selection-row-header-buttons',
        backButton: '[rx-view-component-id="e109c9be-4093-4c82-9e20-8bc98347c984"] button',
        searchInput: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] [rx-id="search-text-input"]',
        searchIcon: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] [rx-id="submit-search-button"]',
        filterIcon: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] .rx-search-filter button',
        filterItems: '.search-filter-dropdown .d-accordion__item',
        applyButton: '.rx-search-filter-heading__apply',
        removeBtn: '[rx-view-component-id="fdc9b3f0-3baa-48f4-b404-11f6441e676a"] button',
        updateWatchlistEventsButton: '[rx-view-component-id="36e39eb7-fc47-45d3-b435-4b1a4311383d"] button',
        filterPreset: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] .rx-filter-presets-dropdown__trigger',
        clearFilterButton: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] button[rx-id="clear-button"]',
        filterDropdown: '.show__more-tags',
        caseLinks: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] .ui-grid__link',
        clearSearchicon: '[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] .d-icon-cross',
        watchListModal: '.modal-dialog'
    }

    async addWatchlistEvent(eventName: string): Promise<void> {
        let locator = await element(by.cssContainingText(this.selectors.watchlistEvents, eventName));
//        await browser.wait(this.EC.elementToBeClickable(locator));
        await locator.click();
    }

    async saveEvents(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async isCasePresent(caseId: string): Promise<boolean> {
        await this.searchCase(caseId);
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.backButton)));
        let status = element(by.cssContainingText(this.selectors.caseLinks, caseId)).isPresent();
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.clearSearchicon)));
        await $(this.selectors.clearSearchicon).click();
//        await utilCommon.waitUntilSpinnerToHide();
        return status;
    }

    async selectAllCases(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectAllrows)));
        await $(this.selectors.selectAllrows).click();
    }

    async isAllCasesSelected(): Promise<boolean> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.backButton)));
        let allCheckboxCount: number = await $$(this.selectors.allCheckboxes).count();
        let selectedCheckboxCount: number = await $$(this.selectors.selectedCheckboxes).count();
        return selectedCheckboxCount == allCheckboxCount;
    }

    async isAllCasesUnSelected(): Promise<boolean> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.backButton)));
        let allCheckboxCount: number = await $$(this.selectors.allCheckboxes).count();
        let unSelectedCheckboxCount: number = await $$(this.selectors.unselectedCheckboxes).count();
        return unSelectedCheckboxCount == allCheckboxCount;
    }

    async searchCase(searchValue: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchInput)));
        await $(this.selectors.searchInput).clear();
        await $(this.selectors.searchInput).sendKeys(searchValue);
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchIcon)));
        await $(this.selectors.searchIcon).click();
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async isCaseSearchGiveCorrectResult(caseId: string): Promise<boolean> {
        await this.searchCase(caseId);
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseLinks)));
        let count: number = await $$(this.selectors.caseLinks).count();
        return count==1 && await $$(this.selectors.caseLinks).first().getText()==caseId;
    }

    async isColumnSorted(columnHeader: string): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(columnHeader, "ascending", this.selectors.guid);
    }

    async areWatchlistColumnMatches(columnNames: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.guid, columnNames);
    }

    async addWatchlistGridColumn(columnNames: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.guid, columnNames);
    }

    async removeWatchlistGridColumn(columnNames: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.guid, columnNames);
    }

    async addFilter(fieldName: string, textValue: string,type: string): Promise<void> {
        await utilGrid.addFilter(fieldName, textValue, type, this.selectors.guid);
    }

    async isEntireColumnContainsValue(columnName: string, value: string): Promise<boolean> {
        let allValues: string[] = await utilGrid.getAllValuesFromColoumn(this.selectors.guid, columnName);
        let filteredValues: string[] = allValues.filter(function (ele) {
            return ele == value;
        });
        return allValues.length == filteredValues.length;
    }

    async selectCase(caseId: string): Promise<void> {
        await this.sortDescendingByCaseId();
        await utilGrid.clickCheckBoxOfValueInGrid(caseId, this.selectors.guid);
    }

    async selectTwoCases(caseId1: string, caseId2: string): Promise<void>{
        await this.sortDescendingByCaseId();
        await utilGrid.clickCheckBoxOfValueInGrid(caseId1, this.selectors.guid);
        await utilGrid.clickCheckBoxOfValueInGrid(caseId2, this.selectors.guid);
    }

    async clickOnRemoveBtn(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.removeBtn)));
        await $(this.selectors.removeBtn).click();
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchIcon)));
//        await utilCommon.waitUntilSpinnerToHide();
    }

    async clickOnUpdateWatchlistEventsBtn(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.updateWatchlistEventsButton)));
        await $(this.selectors.updateWatchlistEventsButton).click();
    }

    async clearWatchlistFilter(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterPreset)));
        try {
            if (await $(this.selectors.filterDropdown).isDisplayed()) {
                await $(this.selectors.filterPreset).click();
//                await browser.wait(this.EC.elementToBeClickable($(this.selectors.clearFilterButton)));
                await $(this.selectors.clearFilterButton).click();
//                await utilCommon.waitUntilSpinnerToHide();
            }
        }
        catch (Ex) {
            console.log("Filters are already cleared");
        }
    }

    async clickOnBackBtn(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.backButton)));
        await $(this.selectors.backButton).click();
//        await browser.wait(this.EC.invisibilityOf($(this.selectors.watchListModal)));
    }

    async getCaseAssignmentChangesLabel(): Promise<string> {
        let locator = await $$(this.selectors.watchlistEvents).get(0);
//        await browser.wait(this.EC.elementToBeClickable(locator));
        return await locator.getText();
    }

    async getCaseGroupAssignmentChangesLabel(): Promise<string> {
        let locator = await $$(this.selectors.watchlistEvents).get(1);
//        await browser.wait(this.EC.elementToBeClickable(locator));
        return await locator.getText();
    }

    async getCaseStatusChangesLabel(): Promise<string> {
        let locator = await $$(this.selectors.watchlistEvents).get(2);
//        await browser.wait(this.EC.elementToBeClickable(locator));
        return await locator.getText();
    }

    async getSaveButtonLabel(): Promise<string> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        return await $(this.selectors.saveButton).getText();
    }

    async getCloseButtonLabel(): Promise<string> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.closeButton)));
        return await $(this.selectors.closeButton).getText();
    }

    async getRemoveButtonLabel(): Promise<string> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.removeBtn)));
        return await $(this.selectors.removeBtn).getText();
    }

    async getUpdateWatchlistEventsButtonLabel(): Promise<string> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.updateWatchlistEventsButton)));
        return await $(this.selectors.updateWatchlistEventsButton).getText();
    }

    async openCase(caseId: string): Promise<void> {
        await this.searchCase(caseId);
        let locator = await element(by.cssContainingText(this.selectors.caseLinks, caseId));
//        await browser.wait(this.EC.elementToBeClickable(locator));
        await locator.click();
    }

    async isSaveEventsButtonEnabled(): Promise<boolean>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.closeButton)));
        return $(this.selectors.saveButton).isEnabled();
    }

    async clickOnCloseButton(): Promise<void>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.closeButton)));
        await $(this.selectors.closeButton).click();
    }

async sortDescendingByCaseId(): Promise<void>{
            let headerText = await $$('[rx-view-component-id="60bc2700-9909-4b0f-8de4-edb02443b62f"] .sortable');
            for(let i:number=0; i<(await headerText.length); i++){
                let columnName = await headerText[i].$('span');
                if(await columnName.getText()=='Case ID'){
                    await headerText[i].$('.ui-grid-icon-angle-down').click();
                    break;
                }
            }
            let descendingSign: ElementFinder = await element.all(by.repeater('item in menuItems')).get(1);
            await descendingSign.click();
        }

}

export default new CaseWatchlistBlade();