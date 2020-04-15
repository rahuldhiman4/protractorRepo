import { $, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilGrid from '../../utils/utility.grid';

class SelectCaseTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        recommendedTemplate: 'Recommended Templates',
        allTemplates: '.nav-link-wrapper',
        searchTextbox: '[rx-view-component-id="c61478d4-1d46-4d0d-9450-c90885aab77e"] .adapt-search-field-ellipsis',
        refreshbutton: '[rx-id="refresh-button"]',
        applyButton: '[rx-view-component-id="f348e681-ac02-452c-b37f-009ac4434053"] button',
        caseTemplateCheckBox: '.ui-grid-icon-ok',
        caseTemplateLink: '.radio__item',
        cancelButton: '[rx-view-component-id="161ed2e2-ea43-4db5-9f9c-149f82a74db2"] button',
    }

    async clickOnRecommendedTemplateTab(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedTemplate)));
        await element(by.cssContainingText(this.selectors.allTemplates,'Recommended Templates')).click();    
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
        await element(by.cssContainingText(this.selectors.allTemplates,'All Templates')).click();
    }

    async searchAndOpenCaseTemplate(input: string): Promise<void> {
        await this.clickOnAllTemplateTab();
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

    async clickOnCaseTemplate(templateName: string): Promise<void> {
        await $(`div[title=${templateName}]`).click();
    }
}

export default new SelectCaseTemplateBlade();