import { $,$$, browser, Key, protractor, ProtractorExpectedConditions } from "protractor";
import createCasePage from '../../pageobject/case/create-case.po';
import utilGrid from '../../utils/util.grid';
import utilCommon from '../../utils/util.common';


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
        caseTemplateLink: '.ui-grid__link',
        cancelButton: '[rx-view-component-id="161ed2e2-ea43-4db5-9f9c-149f82a74db2"] button',
    }

    async clickOnRecommendedTemplateTab(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedTemplate)));
        await $(this.selectors.recommendedTemplate).click();
    }

    async clickOnCaseTemplateCheckbox(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseTemplateCheckBox)));
        await $(this.selectors.caseTemplateCheckBox).click();
    }

    async clickOnCaseTemplateLink(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseTemplateLink)));
        await $(this.selectors.caseTemplateLink).click();
    }

    async clickOnAllTemplateTab(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.allTemplates)));
//        await browser.wait(this.EC.visibilityOf($(this.selectors.allTemplates)));
        await $(this.selectors.allTemplates).click();
    }

    async searchAndClickOnLink(input: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(input);
    }

    async clickOnRefreshButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.refreshbutton)));
        await $(this.selectors.refreshbutton).click();
    }

    async selectCaseTemplate(templateName: string): Promise<void> {
        await this.clickOnAllTemplateTab();
        await utilGrid.searchAndSelectGridRecord(templateName);
        await this.clickOnApplyButton();
//        await browser.wait(this.EC.invisibilityOf($('.modal-content')));
    }

    async clickOnApplyButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.applyButton)));
        await $(this.selectors.applyButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }
}

export default new SelectCaseTemplateBlade();