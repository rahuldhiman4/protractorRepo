import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser, ElementFinder } from "protractor";
import utilityCommon from '../../utils/utility.common';

class Search {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        searchIcon: '.global-search-group .d-icon-search',
        searchBoxLabel: '.adapt-search-field-layout span',
        searchBox: '.adapt-search-field-wrapper .adapt-search-field',
        categoryDropDown: '[rx-view-component-id="8d5a0a18-39ae-4305-bf38-c13e53cb957e"] .btn-secondary',
        clearSearch: '[rx-view-component-id="8d5a0a18-39ae-4305-bf38-c13e53cb957e"] .adapt-search-clear',
        recentSearch: '.global-search-group .btn-recent-search',
        advanceFilterButton: '.global-search-bar-filter-section .d-icon-right-triangle_down',
        leftPannel: '[rx-view-component-id="ec910813-2ba5-42a2-bd1d-3304a02fe2b1"] h2',
        caseGuid: '102fc677-16a9-4fc6-9cf9-72c69f36bf99',
        taskGuid: '1d59d987-b273-4a5a-950e-adf31d4554a4',
        knowledgeArticleGuid: 'b3e3933d-2ee7-4985-ac6b-48aaa9ebcb3b',
        documentsGuid: '0d07f6c9-b920-418d-a523-e5cbca77d16c',
        peopleGuid: '04d2b294-42c4-4d11-ac7a-4d17b5621f70',
        caseTemplatesGuid: 'e69a451f-fccb-488b-ab70-33018801f747',
        taskTemplateGuid: 'fe57b0e4-2546-407e-a2ea-c6f01868a835',
    }

    async searchRecord(record: string): Promise<void> {
        await $$(this.selectors.searchBox).get(1).clear();
        await $$(this.selectors.searchBox).get(1).sendKeys(record + protractor.Key.ENTER);
    }

    async isSearchBoxLabelDisplayed(): Promise<boolean> {
        return await $(this.selectors.searchBoxLabel).isPresent().then(async (link) => {
            if (link) {
                return element(by.cssContainingText(this.selectors.searchBoxLabel, 'Type search text and press enter.')).isDisplayed();
            } else return false;
        });
    }

    async isClearSearchButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.clearSearch).isPresent().then(async (link) => {
            if (link) {
                return await $(this.selectors.clearSearch).isDisplayed();
            } else return false;
        });
    }

    async clickClearSearchButton(): Promise<void> {
        await $(this.selectors.clearSearch).click();
    }

    async isAdvanceFilterButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.advanceFilterButton).isPresent().then(async (link) => {
            if (link) {
                return await $$(this.selectors.advanceFilterButton).isDisplayed();
            } else return false;
        });
    }

    async isRecentSearchesButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.recentSearch).isPresent().then(async (link) => {
            if (link) {
                return await $$(this.selectors.recentSearch).isDisplayed();
            } else return false;
        });
    }

    async isCategoryDropDownSelectedValueDisplayed(categoryText: string): Promise<boolean> {
        let defaultcategoryText = await $$(this.selectors.categoryDropDown).getText();
        if (defaultcategoryText.includes(categoryText)) return true;
        else return false;
    }

    async isCategoryAllDropDownValuesMatches(data: string[]): Promise<boolean> {
        let elemeent = await $(this.selectors.categoryDropDown);
        return await utilityCommon.isAllDropDownValuesMatchesWithElement(elemeent, data);
    }

    async selectCategoryDropDownValue(categoryText: string): Promise<void> {
        let elemeent = await $(this.selectors.categoryDropDown);
        await utilityCommon.selectDropDown2(elemeent, categoryText);
    }

    async isLeftGlobalSearchPannelDisplayed(): Promise<boolean> {
        return await $(this.selectors.leftPannel).isPresent().then(async (link) => {
            if (link) {
                return await $$(this.selectors.leftPannel).get(0).isDisplayed();
            } else return false;
        });
    }

    async getRecordCountOnLeftPannel(record: string, moduleName: string): Promise<number> {
        let guid;
        switch (moduleName) {
            case "Case": {
                guid = this.selectors.caseGuid;
                break;
            }
            case "Task": {
                guid = this.selectors.taskGuid;
                break;
            }
            case "Knowledge Article": {
                guid = this.selectors.knowledgeArticleGuid;
                break;
            }
            case "Documents": {
                guid = this.selectors.documentsGuid;
                break;
            }
            case "People": {
                guid = this.selectors.peopleGuid;
                break;
            }
            case "Case Templates": {
                guid = this.selectors.caseTemplatesGuid;
                break;
            }
            case "Task Template": {
                guid = this.selectors.taskTemplateGuid;
                break;
            }
            default: {
                console.log('Module name does not match');
                break;
            }
        }
        let recordCount: number = await $$(`[rx-view-component-id="${guid}"] .bwf-search-fields[title="${record}"]`).count();
        return recordCount;
    }

    async isModuleTitleDisplayed(record: string, moduleTitle: string, moduleName: string): Promise<boolean> {
        let guid;
        switch (moduleName) {
            case "Case": {
                guid = this.selectors.caseGuid;
                break;
            }
            case "Task": {
                guid = this.selectors.taskGuid;
                break;
            }
            case "Knowledge Article": {
                guid = this.selectors.knowledgeArticleGuid;
                break;
            }
            case "Documents": {
                guid = this.selectors.documentsGuid;
                break;
            }
            case "People": {
                guid = this.selectors.peopleGuid;
                break;
            }
            case "Case Templates": {
                guid = this.selectors.caseTemplatesGuid;
                break;
            }
            case "Task Template": {
                guid = this.selectors.taskTemplateGuid;
                break;
            }
            default: {
                console.log('Module name does not match');
                break;
            }
        }

        let booleanVal: boolean;
        for (let i: number = 0; i < 12; i++) {
            let moduleTitleText = await $(`[rx-view-component-id="${guid}"] h2`).getText();
            if (moduleTitleText.includes(moduleTitle)) {
                booleanVal = true;
                break;
            } else {
                booleanVal = false;
                await this.searchRecord(record);
                await browser.sleep(5000);
            }
        }
        return booleanVal;
    }

    async isRecordDisplayedOnLeftPannel(record: string, moduleName: string, recordNumber?: number): Promise<boolean> {
        let guid;
        switch (moduleName) {
            case "Case": {
                guid = this.selectors.caseGuid;
                break;
            }
            case "Task": {
                guid = this.selectors.taskGuid;
                break;
            }
            case "Knowledge Article": {
                guid = this.selectors.knowledgeArticleGuid;
                break;
            }
            case "Documents": {
                guid = this.selectors.documentsGuid;
                break;
            }
            case "People": {
                guid = this.selectors.peopleGuid;
                break;
            }
            case "Case Templates": {
                guid = this.selectors.caseTemplatesGuid;
                break;
            }
            case "Task Template": {
                guid = this.selectors.taskTemplateGuid;
                break;
            }
            default: {
                console.log('Module name does not match');
                break;
            }
        }

        return await $$(`[rx-view-component-id="${guid}"] .bwf-search-fields[title="${record}"]`).isPresent().then(async (link) => {
            if (link) {
                if (recordNumber) {
                    return await $$(`[rx-view-component-id="${guid}"] .bwf-search-fields[title="${record}"]`).get(recordNumber - 1).isDisplayed();
                } else {
                    return await $$(`[rx-view-component-id="${guid}"] .bwf-search-fields[title="${record}"]`).isDisplayed();
                }
            } else return false;
        });
    }

    async clickOnLeftPannelRecord(record: string, moduleName: string): Promise<void> {
        let guid;
        switch (moduleName) {
            case "Case": {
                guid = this.selectors.caseGuid;
                break;
            }
            case "Task": {
                guid = this.selectors.taskGuid;
                break;
            }
            case "Knowledge Article": {
                guid = this.selectors.knowledgeArticleGuid;
                break;
            }
            case "Documents": {
                guid = this.selectors.documentsGuid;
                break;
            }
            case "People": {
                guid = this.selectors.peopleGuid;
                break;
            }
            case "Case Templates": {
                guid = this.selectors.caseTemplatesGuid;
                break;
            }
            case "Task Template": {
                guid = this.selectors.taskTemplateGuid;
                break;
            }
            default: {
                console.log('Module name does not match');
                break;
            }
        }
        await $(`[rx-view-component-id="${guid}"] .bwf-search-fields[title="${record}"]`).click();
    }

    async clickOnPaginationPageNo(moduleName: string, pageNo: string): Promise<void> {
        let guid;
        switch (moduleName) {
            case "Case": {
                guid = this.selectors.caseGuid;
                break;
            }
            case "Task": {
                guid = this.selectors.taskGuid;
                break;
            }
            case "Knowledge Article": {
                guid = this.selectors.knowledgeArticleGuid;
                break;
            }
            case "Documents": {
                guid = this.selectors.documentsGuid;
                break;
            }
            case "People": {
                guid = this.selectors.peopleGuid;
                break;
            }
            case "Case Templates": {
                guid = this.selectors.caseTemplatesGuid;
                break;
            }
            case "Task Template": {
                guid = this.selectors.taskTemplateGuid;
                break;
            }
            default: {
                console.log('Module name does not match');
                break;
            }
        }
        await element(by.cssContainingText(`[rx-view-component-id="${guid}"] .page-link`, pageNo)).click();


    }

    async isPaginationDisplayed(moduleName: string): Promise<boolean> {
        let guid;
        switch (moduleName) {
            case "Case": {
                guid = this.selectors.caseGuid;
                break;
            }
            case "Task": {
                guid = this.selectors.taskGuid;
                break;
            }
            case "Knowledge Article": {
                guid = this.selectors.knowledgeArticleGuid;
                break;
            }
            case "Documents": {
                guid = this.selectors.documentsGuid;
                break;
            }
            case "People": {
                guid = this.selectors.peopleGuid;
                break;
            }
            case "Case Templates": {
                guid = this.selectors.caseTemplatesGuid;
                break;
            }
            case "Task Template": {
                guid = this.selectors.taskTemplateGuid;
                break;
            }
            default: {
                console.log('Module name does not match');
                break;
            }
        }

        return await $(`[rx-view-component-id="${guid}"] .pagination`).isPresent().then(async (link) => {
            if (link) {
                return await $(`[rx-view-component-id="${guid}"] .pagination`).isDisplayed();
            } else return false;
        });
    }

    async searchRecordOnLeftPannel(record: string, moduleName: string): Promise<void> {
        let guid;
        switch (moduleName) {
            case "Case": {
                guid = this.selectors.caseGuid;
                break;
            }
            case "Task": {
                guid = this.selectors.taskGuid;
                break;
            }
            case "Knowledge Article": {
                guid = this.selectors.knowledgeArticleGuid;
                break;
            }
            case "Documents": {
                guid = this.selectors.documentsGuid;
                break;
            }
            case "People": {
                guid = this.selectors.peopleGuid;
                break;
            }
            case "Case Templates": {
                guid = this.selectors.caseTemplatesGuid;
                break;
            }
            case "Task Template": {
                guid = this.selectors.taskTemplateGuid;
                break;
            }
            default: {
                console.log('Module name does not match');
                break;
            }
        }

        for (let i: number = 0; i < 10; i++) {
            let isFilePresent: boolean = await $$(`[rx-view-component-id="${guid}"] .bwf-search-fields[title="${record}"]`).get(0).isPresent();
            if (isFilePresent == false) {
                await browser.sleep(5000);
                await this.searchRecord(record);
            } else {
                break;
            }
        }
    }
}
export default new Search();