import { $,$$, browser, Key, protractor, ProtractorExpectedConditions, element, by } from "protractor";
import createCasePage from '../../pageobject/case/create-case.po';
import utilGrid from '../../utils/util.grid';
import utilCommon from '../../utils/util.common';


class SelectCaseTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        recommendedTemplate: 'Recommended Templates',
        allTemplates: 'All Templates',
        searchTextbox: '[rx-id="search-text-input"]',
        refreshbutton: '[rx-id="refresh-button"]',
        checkBox: 'ui-grid-icon-ok',
        applyButton: '[rx-view-component-id="39321025-7d92-4284-8498-a0c6fc44f6cd"] button',
        caseTemplateCheckBox: '.ui-grid-icon-ok',
        caseTemplateLink: '.ui-grid__link',
        cancelButton: '[rx-view-component-id="befd164d-2508-4b8e-9445-3ace011022b7"] button',
    }

    async clickOnRecommendedTemplateTab(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedTemplate)));
        await element(by.linkText(this.selectors.recommendedTemplate)).click();
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
        await element(by.linkText(this.selectors.allTemplates)).click();
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
}

export default new SelectCaseTemplateBlade();