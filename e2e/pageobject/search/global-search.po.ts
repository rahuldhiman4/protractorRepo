import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser, ElementFinder } from "protractor";
import utilityCommon from '../../utils/utility.common';
import { DropDownType } from '../../utils/constants';

class GlobalSearch {

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
        recentSearchDropDownValue: '.dropdown-item',
        recentSearchDropDown: '[rx-view-component-id="8d5a0a18-39ae-4305-bf38-c13e53cb957e"] .dropdown-menu'
    }

    async searchRecord(record: string): Promise<void> {
        await $(this.selectors.searchBox).clear();
        await $(this.selectors.searchBox).sendKeys(record);
        await $(this.selectors.searchBox).sendKeys(protractor.Key.ENTER);

    }

    async isSearchBoxLabelDisplayed(): Promise<boolean> {
        return await $(this.selectors.searchBoxLabel).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.searchBoxLabel, 'Type search text and press enter.')).isDisplayed();
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
        let element = await $(this.selectors.categoryDropDown);
        return await utilityCommon.isAllDropDownValuesMatches(element, data, DropDownType.WebElement);
    }

    async selectCategoryDropDownValue(categoryDropdownValue: string): Promise<void> {
        let elemeent = await $(this.selectors.categoryDropDown);
        await utilityCommon.selectDropDown(elemeent, categoryDropdownValue,DropDownType.WebElement);
    }

    async clickOnRecentSearchDropDownButton(): Promise<void> {
        await $(this.selectors.searchBox).click();
        await $(this.selectors.recentSearch).click();
    }

    async selectRecentSearchDropDownValue(value: string): Promise<void> {
        await $(this.selectors.recentSearch).click();
        await element.all(by.cssContainingText(this.selectors.recentSearchDropDownValue, value)).click();
    }

    async getCountOfRecentDropDownValue(value: string): Promise<number> {
        return await element.all(by.cssContainingText(this.selectors.recentSearchDropDownValue, value)).count();
    }

    async isRecentSearchDropdownPopupDisplayed(): Promise<boolean> {
        return await $(this.selectors.recentSearchDropDown).isPresent().then(async (link) => {
            if (link) {
                return await $$(this.selectors.recentSearchDropDown).isDisplayed();
            } else return false;
        });
    }


    async isRecentSearchesDropDownValueDisplayed(value: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.recentSearchDropDownValue, value)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.recentSearchDropDownValue, value)).isDisplayed();
            } else return false;
        });
    }

    async getRecentSerachDropDownValue(recordNumber): Promise<string> {
        return await $$(this.selectors.recentSearchDropDownValue).get(recordNumber - 1).getText();
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
            case "Task Templates": {
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
            case "Task Templates": {
                guid = this.selectors.taskTemplateGuid;
                break;
            }
            default: {
                console.log('Module name does not match');
                break;
            }
        }

        let booleanVal: boolean;
        booleanVal= await $(`[rx-view-component-id="${guid}"] h2`).isPresent();
        if(booleanVal==true){
        for (let i: number = 0; i < 12; i++) {
            let moduleTitleText = await $(`[rx-view-component-id="${guid}"] h2`).getText();
            if (moduleTitleText.includes(moduleTitle)) {
                booleanVal = true;
                break;
            } else {
                await browser.sleep(2000);//Need this sleep because after create record it takes time to show on UI
                booleanVal = false;
                await this.searchRecord(record);
            }
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
            case "Task Templates": {
                guid = this.selectors.taskTemplateGuid;
                break;
            }
            default: {
                console.log('Module name does not match');
                break;
            }
        }
        if (recordNumber) {
            return await $$(`[rx-view-component-id="${guid}"] .bwf-search-fields[title="${record}"]`).get(recordNumber - 1).isPresent().then(async (link) => {
                if (link) {
                    return await $$(`[rx-view-component-id="${guid}"] .bwf-search-fields[title="${record}"]`).get(recordNumber - 1).isDisplayed();
                } else return false;
            });
        } else {
            return await $(`[rx-view-component-id="${guid}"] .bwf-search-fields[title="${record}"]`).isPresent().then(async (link) => {
                if (link) {
                    return await $(`[rx-view-component-id="${guid}"] .bwf-search-fields[title="${record}"]`).isDisplayed();
                } else return false;
            });
        }
    }

    async clickOnLeftPannelRecord(record: string, moduleName: string, recordNumber?:number): Promise<void> {
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
            case "Task Templates": {
                guid = this.selectors.taskTemplateGuid;
                break;
            }
            default: {
                console.log('Module name does not match');
                break;
            }
        }

        if (recordNumber) {
            await $$(`[rx-view-component-id="${guid}"] .bwf-search-fields[title="${record}"]`).get(recordNumber-1).click();  
        } else {
            await $(`[rx-view-component-id="${guid}"] .bwf-search-fields[title="${record}"]`).click();     
           }
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
            case "Task Templates": {
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
            case "Task Templates": {
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
            case "Task Templates": {
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
                await this.searchRecord(record);
            } else {
                break;
            }
        }
    }

    async isBlankRecordValidationDisplayedOnLeftPanel(moduleName: string): Promise<boolean> {
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
            case "Task Templates": {
                guid = this.selectors.taskTemplateGuid;
                break;
            }
            default: {
                console.log('Module name does not match');
                break;
            }
        }

        return await element(by.cssContainingText(`[rx-view-component-id="${guid}"] p`, 'No results found.')).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(`[rx-view-component-id="${guid}"] p`, 'No results found.')).isDisplayed();
            } else return false;
        });
    }

    async getDate(): Promise<string> {
        return await $('.bwf-show-more__content-row .bwf-text-overflow-ellipsis').getText();
    }

    async closeFilterDateLabel(): Promise<void> {
        await $('.bwf-show-more__content-row a').click();
    }

    async getDateFormateOnLeftPannel(moduleName: string, recordNumber?: number): Promise<string> {
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
            case "Task Templates": {
                guid = this.selectors.taskTemplateGuid;
                break;
            }
            default: {
                console.log('Module name does not match');
                break;
            }
        }
            return await $$(`[rx-view-component-id="${guid}"] .list__item`).get(recordNumber - 1).$$('.bwf-search-fields span').get(1).getText();
        }
}
export default new GlobalSearch();