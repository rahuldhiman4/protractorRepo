import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from 'protractor';

export class Resources {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dropDownOption: '.dropdown_select__menu-content .dropdown-item *',
        advancedSearchInput: 'input.adapt-search-field[placeholder="Search"]',
        advancedSearchSettingsBtn: 'span.d-icon-adjust_settings',
        advancedSearchSettingsBtnClose: 'button.opened-advance-search-option',
        advancedSearchResult: 'div.sr-search-result-components .bwf-search-fields__title-text',
        headingName: '.km-group__header span',
        smartSearchResult: '.sr-search-result-components h2',
        advancedSearchButton: 'span.d-icon-search',
        backButton: 'span.d-icon-angle_left',
        knowledgeTitle: '[rx-view-component-id="aacf8477-f930-4983-820d-1b9fa12441c0"] div.bwf-search-fields__title-text',
        advancedSearchFields: '[class="row ng-star-inserted"] .dropdown_select',
        recommendedKnowledgeGuid: '[rx-view-component-id="dceba6c7-a422-4937-8314-e7c6c1bc2ce1"]',
        paginationNextButton: '.content-outlet .page-next',
    }

    async isSearchRecordEmpty(recordNumber: number): Promise<boolean> {
        return await $$('.bwf-search-result p').get(recordNumber - 1).isPresent();
    }

    async clickOnAdvancedSearchOptions(): Promise<void> {
        let advancedSearchButton = await $('span.d-icon-search');
        await advancedSearchButton.click();
    }

    async enterAdvancedSearchText(searchText: string): Promise<void> {
        await $(this.selectors.advancedSearchInput).clear();
        await $(this.selectors.advancedSearchInput).sendKeys(searchText);
    }

    async searchTextAndEnter(searchText: string): Promise<void> {
        await $(this.selectors.advancedSearchInput).clear();
        await $(this.selectors.advancedSearchInput).sendKeys(searchText + protractor.Key.ENTER);
    }

    async clickOnAdvancedSearchSettingsIconToOpen(): Promise<void> {
        await $(this.selectors.advancedSearchSettingsBtn).click();
    }

    async clickOnAdvancedSearchSettingsIconToClose(): Promise<void> {
        await $(this.selectors.advancedSearchSettingsBtnClose).click();
    }

    async selectAdvancedSearchFilterOption(dropDownLabel: string, dropDownValue: string): Promise<void> {
        await browser.wait(this.EC.or(async () => {
            let count = await $$('.dropdown.dropdown_select').count();
            return count >= 1;
        }), 3000);
        const dropDown: ElementFinder[] = await $$('.dropdown.dropdown_select');
        for (let i: number = 0; i < dropDown.length; i++) {
            await dropDown[i].$('.form-control-label').isPresent().then(async (result) => {
                if (result) {
                    let dropDownLabelText: string = await dropDown[i].$('.form-control-label').getText();
                    if (dropDownLabelText === dropDownLabel) {
                        await dropDown[i].$('button').click();
                        await dropDown[i].$('input').sendKeys(dropDownValue);
                        await element(by.cssContainingText('[role="option"] span', dropDownValue)).click();
                    }
                }
            });
        }
    }

    async isAdvancedSearchFilterOptionDropDownValueDisplayed(data: string[], dropDownNumber: number): Promise<boolean> {
        let arr: string[] = [];
        await $$('.advance-search button.dropdown-toggle').get(dropDownNumber).click();
        let drpDwnvalue: number = await $$(this.selectors.dropDownOption).count();
        for (let i = 0; i < drpDwnvalue; i++) {
            let ab: string = await $$(this.selectors.dropDownOption).get(i).getText();
            arr[i] = ab;
        }
        arr = arr.sort();
        data = data.sort();
        return arr.length === data.length && arr.every(
            (value, index) => (value === data[index])
        );
    }

    async clickOnAdvancedSearchFiltersButton(buttonText: string): Promise<void> {
        const advancedSearchFilterBtn = await element(by.xpath(`//*[contains(@class,'justify-content-end')]//button[contains(text(),"${buttonText}")]`));
        await advancedSearchFilterBtn.click();
    }

    async isApplyOrClearButtonButtonEnabled(buttonText: string): Promise<boolean> {
        return await element(by.cssContainingText('.pull-right .d-button_small', buttonText)).isEnabled();
    }

    async getAdvancedSearchResultForParticularSection(headingType: string): Promise<string> {
        return await element(by.cssContainingText('div.bwf-search-fields__title-text span', headingType)).isPresent().then(async (result) => {
            if (result) {
                return await browser.wait(this.EC.visibilityOf(element(by.cssContainingText('div.bwf-search-fields__title-text span', headingType))), 5000).then(async () => {
                    return await element(by.cssContainingText('div.bwf-search-fields__title-text span', headingType)).getText();
                });
            }
        });
    }

    async isAdvancedSearchResultContainsRecord(recordTitle: string): Promise<boolean> {
        return await element(by.cssContainingText('div.bwf-search-fields__title-text span', recordTitle)).isPresent().then(async (result) => {
            if(result) return await element(by.cssContainingText('div.bwf-search-fields__title-text span', recordTitle)).isDisplayed();
            else return false;
        });
    }

    async getCountOfHeading(headerName: string): Promise<number> {
        let smartRecorderResults: ElementFinder[] = await $$(this.selectors.smartSearchResult);
        for (let i: number = 0; i < smartRecorderResults.length; i++) {
            if ((await smartRecorderResults[i].getText()).includes(headerName)) {
                let count: string = await smartRecorderResults[i].$('span').getText();
                return parseInt(count.substring(1, count.length - 1));
            }
        }
    }

    async isRecommendedKnowledgePresent(knowledgeTitle: string): Promise<boolean> {
        return await this.isResourcePresent(knowledgeTitle);
    }

    async isRecommendedTemplatePresent(caseTemplateName: string): Promise<boolean> {
        return await this.isResourcePresent(caseTemplateName);
    }

    async isRecommendedCasePresent(caseSummary: string): Promise<boolean> {
        return await this.isResourcePresent(caseSummary);
    }

    async isResourcePresent(resourceName: string): Promise<boolean> {
        // need to wait until spinner to hide (three dots)
        return await $(`[title="${resourceName}"]`).isPresent().then(async (link) => {
            if (link) return await $(`[title="${resourceName}"]`).isDisplayed();
            else return false;
        });
    }

    async isFilterAvailable(filterText: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.advancedSearchFields, filterText)).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText(this.selectors.advancedSearchFields, filterText)).isDisplayed();
            else return false;
        });
    }

    async clickArrowFirstRecommendedKnowledge(): Promise<void> {
        let sections = $$('div.bwf-search-result');
        for(let i=0; i<(await sections).length; i++){
            let sectionLocator = sections.get(i).$('h2');
            if((await sectionLocator.getText()).includes('Recommended Knowledge')) {
                await sections.get(i).$$('div.search-result-fields').first().click();
            }
        }
    }

    async getKnowledgeArticleInfo(): Promise<string> {
        return await $$('.flex-column bwf-search-result-fields div span').getText();
    }

    async pinRecommendedKnowledgeArticles(numberOfArticles: number): Promise<void> {
        for (let i = 0; i < numberOfArticles; i++) {
            await $$('adapt-icon[class="search-item__unpin-icon"]').get(i).click();
        }
    }

    async unpinRecommendedKnowledgeArticles(numberOfArticles: number): Promise<void> {
        for (let i = 0; i < numberOfArticles; i++) {
            await $$('adapt-icon[class="search-item__pin-icon"]').get(i).click();
        }
    }

    async isFirstPinnedArticleDisplayed(): Promise<boolean> {
        return await $('adapt-icon[class="search-item__pin-icon"]').isPresent().then(async (link) => {
            if (link) return await $('adapt-icon[class="search-item__pin-icon"]').isDisplayed();
            else return false;
        });
    }

    async getCountOfPinKnowledgeArticles(): Promise<number> {
        return await $$('adapt-icon[class="search-item__pin-icon"]').count();    
    }

    async clickOnBackButton(): Promise<void> {
        await $(this.selectors.backButton).click();
    }

    async clickPaginationNext(): Promise<void> {
        await $(this.selectors.paginationNextButton).click();
    }

    async isSectionTitleDisplayed(sectionName: string): Promise<boolean> {
        return await $(`[aria-label*="${sectionName}"]`).isPresent().then(async (link) => {
            if (link) return await $(`[aria-label*="${sectionName}"]`).isDisplayed();
            else return false;
        });
    }
}

export default new Resources();