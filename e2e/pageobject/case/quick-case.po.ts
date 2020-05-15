import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions, Key } from "protractor";
import utilityCommon from '../../utils/utility.common';


class QuickCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        recommendedTitle: '.bwf-search-result .bwf-search-fields__title-text span',
        drpdownHeader: '.sr-preview-item .dropdown-toggle',
        startOver: '.text-muted .btn-secondary',
        smartSearchTextBox: '[rx-view-component-id="2b9a3989-5461-4196-9cd9-fe7a1cdf6eb2"] .sr-input',
        confirmedItemSelection: '.sr-preview-pane .sr-preview-item-header',
        caseTemplate: '.bwf-selectable-list-item .sr-template-name',
        gotoCaseButton: '[rx-view-component-id="529287cb-4d9d-4729-aa6c-5676980df72e"] button',
        validateButton: '[rx-view-component-id="390a77cd-518e-4d67-abb4-bc4d410ce3df"] button',
        pinValidateInput: '[rx-view-component-id="bfe9a8e0-26e7-43a5-9561-1c92539bdda3"] input',
        pinOk: '[rx-view-component-id="ea1b7291-a0de-47d6-9239-cccf6b850a86"] button',
        quickCaseGuid: 'ac36dcad-30f0-4ab0-86a4-11fee7195051',
        smartSearchText: '.smart-recorder-highlightPerfectMatch',
        createCaseButton: '.d-inline-block [rx-view-component-id="8b88c054-4445-43e4-90f0-72f829571fd5"] button',
        requesters: '.bwf-select-list .bwf-selectable-list-item',
        pinFirstRecommendedCase: '.search-item__unpin-icon svg.adapt-icon',
        requester: '[rx-view-component-id="2b9a3989-5461-4196-9cd9-fe7a1cdf6eb2"] .ac-person-full-name',
        arrowFirstRecommendedCase: '[rx-view-component-id="b01aa3f3-0371-4b7e-a956-b1cf025927d6"] .list__item__preview-icon',
        arrowFirstRecommendedKnowledge: '[rx-view-component-id="dceba6c7-a422-4937-8314-e7c6c1bc2ce1"] .list__item__preview-icon',
        roleDropDown: '.sr-preview-pane .sr-preview-item-header .btn-secondary',
        sourceValue: '.sr-select-bar .btn-xs',
        roleValue: '.select_option_container span',
        descriptionText: 'div.sr-placeholder div.large',
        resources: 'bwf-smart-recorder-results div.sr-result-placeholder div',
        advancedSearchFields: '[class="row ng-star-inserted"] .dropdown_select label',
        startOverButton: '.sr-footer .text-muted .btn-secondary',
        recommendedKnowledge: 'bwf-search-result-fields .bwf-search-fields__title-text',
        recommendedKnowledgeEmpty: '[rx-view-component-id="dceba6c7-a422-4937-8314-e7c6c1bc2ce1"] .bwf-search-result p',
        recommendedCaseGuid: '[rx-view-component-id="c0487804-1748-4995-99c9-69e6ad217c74"]',
        recommendedKnowledgeGuid: '[rx-view-component-id="dceba6c7-a422-4937-8314-e7c6c1bc2ce1"]',
        dropdownSourceValue: '.dropdown-item span',
    }

    async pinRecommendedKnowledgeArticles(numberOfArticles: number): Promise<void> {
        for (let i = 0; i < numberOfArticles; i++) {
            await $(this.selectors.recommendedKnowledgeGuid).$$('adapt-icon[class="search-item__unpin-icon"]').get(i).click();
        }
    }

    async pinRecommendedCases(numberOfCases: number): Promise<void> {
        for (let i = 0; i < numberOfCases; i++) {
            await $(this.selectors.recommendedCaseGuid).$$('adapt-icon[class="search-item__unpin-icon"]').get(i).click();
        }
    }

    async isRecommendedKnowledgeEmpty(): Promise<boolean> {
        return await $(this.selectors.recommendedKnowledgeEmpty).isPresent();
    }

    async isCaseSummaryPresentInRecommendedCases(caseSummary: string): Promise<boolean> {
        return await $$('.km-group').get(2).$$(`div[title="${caseSummary}"]`).isPresent();
    }

    async clickOnCaseSummaryInRecommendedCases(caseSummary: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.recommendedTitle, caseSummary)).click();

    }

    async getDrpDownValueByIndex(indexValue: number): Promise<string> {
        return await $$(this.selectors.drpdownHeader).get(indexValue - 1).getText();
    }

    async selectDrpDownValueByIndex(value: string, indexValue: number): Promise<void> {
        await $$(this.selectors.drpdownHeader).get(indexValue - 1).click();
        let option = await element(by.cssContainingText('.dropdown-item', value));
        await browser.wait(this.EC.elementToBeClickable(option), 3000).then(async () => {
            await option.click();
        });
    }

    async selectRequesterName(name: string): Promise<void> {
        //await $(this.selectors.inputBox).clear();
        //await browser.wait(this.EC.visibilityOf($(this.selectors.inputBox)));
        await $(this.selectors.smartSearchTextBox).sendKeys(`@${name}`);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.requesters)), 3000);
        await $$(this.selectors.requesters).first().click();
    }

    async setCaseSummary(summary: string): Promise<void> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.smartSearchTextBox)));
        await $(this.selectors.smartSearchTextBox).sendKeys(summary);
    }

    async clearInputBox(): Promise<void> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.smartSearchTextBox)));
        await $(this.selectors.smartSearchTextBox).clear();
    }

    async getRequester(): Promise<string> {
        //await browser.wait(this.EC.visibilityOf($$(this.selectors.smartSearchText).first()));
        return await $$(this.selectors.smartSearchText).first().getText();
    }

    async validatePersonAndHisRelation(relationType: string): Promise<string> {
        let employee: string;
        await browser.sleep(1000); // required because UI renders after get call used before calling this method
        let elementCount = await $$(this.selectors.confirmedItemSelection).count();
        for (let i = 0; i < elementCount; i++) {
            let actualRelationType = await $$(this.selectors.confirmedItemSelection).get(i).$('button.dropdown-toggle').getText();
            if (actualRelationType == relationType) {
                employee = await $$(this.selectors.confirmedItemSelection).get(i).$('.sr-header-display-name').getText();
                break;
            }
        }
        return employee;
    }

    async isSummOrDescPopulatedAtSmartTextArea(text: string): Promise<number> {
        // await browser.wait(this.EC.visibilityOf($(this.selectors.smartSearchTextBox)));
        let flag: number = (await $(this.selectors.smartSearchTextBox).getText()).search(text);
        //-1 is returned as a flag, if text fetched through the locator doesn't consist of the 'text' passed
        return flag;
    }

    async getTextOfSummaryTextBox(): Promise<string> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.smartSearchTextBox)));
        return await $(this.selectors.smartSearchTextBox).getText();
    }

    async isCreateButtonDisabled(): Promise<boolean> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.createCaseButton)));
        return await $(this.selectors.createCaseButton).getAttribute("disabled") == "true";
    }

    async createCaseButton(): Promise<void> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.createCaseButton)));
        await $(this.selectors.createCaseButton).click();
    }

    async gotoCaseButton(): Promise<void> {
        // await browser.wait(this.EC.visibilityOf($(this.selectors.gotoCaseButton)));
        await $(this.selectors.gotoCaseButton).click();
        // await utilCommon.waitUntilSpinnerToHide();
    }

    async pinFirstRecommendedCase(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.pinFirstRecommendedCase))));
        await $$(this.selectors.pinFirstRecommendedCase).first().click();
    }

    async clickArrowFirstRecommendedCase(): Promise<void> {
        //await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.arrowFirstRecommendedCase))));
        await element(by.css(this.selectors.arrowFirstRecommendedCase)).click();
    }

    async clickArrowFirstRecommendedKnowledge(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.pinFirstRecommendedCase))));
        await element(by.css(this.selectors.arrowFirstRecommendedKnowledge)).click();
    }

    async saveCase(): Promise<void> {
        await $(this.selectors.createCaseButton).click();
        // await browser.wait(this.EC.visibilityOf($(this.selectors.gotoCaseButton__preview)));
    }

    async selectCaseTemplate(templateName: string): Promise<boolean> {
        let success: boolean = false;
        for (let i: number = 0; i <= 3; i++) {
            browser.sleep(1000);
            let template: string = "!" + templateName;
            await $(this.selectors.smartSearchTextBox).sendKeys(template);
            success = await browser.element(by.cssContainingText(this.selectors.caseTemplate, templateName)).isPresent().then(async (result) => {
                if (result) {
                    await browser.element(by.cssContainingText(this.selectors.caseTemplate, templateName)).click();
                    return true;
                } else false;
            });
            if (success) break;
            else {
                for (let j: number = 0; j < template.length; j++) {
                    await $(this.selectors.smartSearchTextBox).sendKeys(protractor.Key.BACK_SPACE);
                }
                continue;
            }
        }
        return success;
    }

    async validatePin(): Promise<void> {
        // await browser.wait(this.EC.visibilityOf($(this.selectors.validateButton)));
        await $(this.selectors.validateButton).click();
        // await browser.wait(this.EC.visibilityOf($(this.selectors.pinValidateInput)));
        await $(this.selectors.pinValidateInput).sendKeys("1234");
        await $(this.selectors.pinOk).click();

    }

    async getDescriptionDetails(): Promise<string> {
        return browser.element(by.css(this.selectors.descriptionText)).getText();
    }

    async getResourcesText(): Promise<string> {
        return await $$(this.selectors.resources).get(1).getText();
    }

    async selectRoleValue(value: string): Promise<void> {
        await $(this.selectors.roleDropDown).click();
        await browser.element(by.cssContainingText(this.selectors.roleValue, value)).click();
    }

    async isValuePresentInSourceDropDown(value: string): Promise<boolean> {
        await $(this.selectors.sourceValue).click();
        let dropdownValues: number = await $$(this.selectors.dropdownSourceValue).count();
        for (let i = 0; i < dropdownValues; i++) {
            let souceValue = await $$(this.selectors.dropdownSourceValue).get(i).getText();
            if (souceValue == value) {
                return true;
            }
        }
        return false;
    }

    async selectSourceValue(value: string): Promise<void> {
        await $(this.selectors.sourceValue).click();
        await browser.element(by.cssContainingText(this.selectors.dropdownSourceValue, value)).click();
    }

    async getSelectedSourceValue(): Promise<string> {
        return await $(this.selectors.sourceValue).getText();
    }

    async clickStartOverButton(): Promise<void> {
        await $(this.selectors.startOverButton).click();
    }

    async getKnowledgeArticleInfo(): Promise<string> {
        return await $$('.flex-column bwf-search-result-fields div span').getText();
    }

    async getKnowledgeArticleID(): Promise<string> {
        return await $$('.flex-column bwf-search-result-fields div span').first().getText();
    }

    async isFilterAvailable(filterText: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.advancedSearchFields, filterText)).isPresent();
    }

    async clickOnCaseTemplate(templateName: string): Promise<void> {
        await $(`div[title=${templateName}]`).click();
    }

    async setSummaryAndClickOnRecommandedCase(caseID: string,caseSummary:string): Promise<boolean> {
        let success: boolean = false;
        for (let i: number = 0; i <= 3; i++) {
		 await $(this.selectors.smartSearchTextBox).sendKeys(caseSummary);
            browser.sleep(1000);
            success = await $(`div[title=${caseID}]`).isPresent().then(async (result) => {
                if (result) {
                   await $(`div[title=${caseID}]`).click();
                    return true;
                } else false;
            });
            if (success) break;
            else {
                for (let j: number = 0; j < caseSummary.length; j++) {
                    await $(this.selectors.smartSearchTextBox).sendKeys(protractor.Key.BACK_SPACE);
                }
                continue;
            }
        }
        return success;
    }

    async setSummaryAndPinRecommandedCase(caseID: string,caseSummary:string): Promise<boolean> {
        let success: boolean = false;
        for (let i: number = 0; i <= 3; i++) {
		 await $(this.selectors.smartSearchTextBox).sendKeys(caseSummary);
            browser.sleep(1000);
            success = await $(`div[title=${caseID}]`).isPresent().then(async (result) => {
                if (result) {
                   await $(this.selectors.pinFirstRecommendedCase).click();
                    return true;
                } else false;
            });
            if (success) break;
            else {
                for (let j: number = 0; j < caseSummary.length; j++) {
                    await $(this.selectors.smartSearchTextBox).sendKeys(protractor.Key.BACK_SPACE);
                }
                continue;
            }
        }
        return success;
    }
}
export default new QuickCasePage();