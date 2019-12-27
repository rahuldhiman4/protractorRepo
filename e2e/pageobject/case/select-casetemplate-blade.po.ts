import { $, browser, Key, protractor, ProtractorExpectedConditions } from "protractor";
import createCasePage from '../../pageobject/case/create-case.po';
import utilGrid from '../../utils/util.grid';


class SelectCaseTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        recommendedTemplate: '[rx-view-component-id="7f305d78-5a25-4a37-be39-86d6abf6661a"] [title="Recommended Templates"]',
        allTemplates: '[rx-view-component-id="7f305d78-5a25-4a37-be39-86d6abf6661a"] [title="All Templates"]',
        searchTextbox: '[rx-id="search-text-input"]',
        refreshbutton: '[rx-id="refresh-button"]',
        checkBox: 'ui-grid-icon-ok',
        applyButton: '[rx-view-component-id="f348e681-ac02-452c-b37f-009ac4434053"] button',
        caseTemplateCheckBox: '.ui-grid-icon-ok',
    }

    async clickOnRecommendedTemplateTab(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedTemplate)));
        await $(this.selectors.recommendedTemplate).click();
    }

    async clickOnCaseTemplateCheckbox(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseTemplateCheckBox)));
        await $(this.selectors.caseTemplateCheckBox).click();
    }

    async clickOnAllTemplateTab(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.allTemplates)));
        await browser.wait(this.EC.visibilityOf($(this.selectors.allTemplates)));
        await $(this.selectors.allTemplates).click();
    }

    async setSearchBoxValue(input: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchTextbox)));
        await $(this.selectors.searchTextbox).clear();
        await $(this.selectors.searchTextbox).sendKeys(input, Key.ENTER);
    }

    async clickOnRefreshButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.refreshbutton)));
        await $(this.selectors.refreshbutton).click();
    }

    async selectCaseTemplate(templateName: string): Promise<void> {
        await this.clickOnAllTemplateTab();
        await utilGrid.searchAndSelectGridRecord(templateName);
        await this.clickOnApplyButton();
        await browser.wait(this.EC.elementToBeClickable($(createCasePage.selectors.selectCaseTemplateButton)));
    }

    async clickOnApplyButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.applyButton)));
        await $(this.selectors.applyButton).click();
    }
}

export default new SelectCaseTemplateBlade();