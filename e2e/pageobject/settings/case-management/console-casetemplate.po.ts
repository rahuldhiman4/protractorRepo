import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from 'protractor';
import utilCommon from "../../../utils/util.common";
import utilGrid from "../../../utils/util.grid";

class CaseTemplateConsole {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        createCaseTemplate: '[rx-view-component-id="3a9fd0a9-2b68-4872-a022-7c56b377a4dc"] button',
        copyCaseTemplate: '[rx-view-component-id="92e13921-bf7b-494e-9d65-609a07c36505"] button',
        gridGUID: "1c10246e-18ed-4201-91b7-210e7a975f9c",
        searchButton: "1c10246e-18ed-4201-91b7-210e7a975f9c",
        gridLink: '[rx-view-component-id="1c10246e-18ed-4201-91b7-210e7a975f9c"] .ui-grid__link',
        recordvalue: '.ui-grid-canvas .ui-grid-row'
    }

    async clickOnCreateCaseTemplateButton(): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.createCaseTemplate)));
        await $(this.selectors.createCaseTemplate).click();
    }

    async clickOnCopyCaseTemplate(): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.copyCaseTemplate)));
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.copyCaseTemplate)));
        await $(this.selectors.copyCaseTemplate).click();
    }

    async searchAndClickOnCaseTemplate(caseTemplateValue: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(caseTemplateValue, this.selectors.gridGUID);
    }

    async searchAndselectCaseTemplate(caseTemplateValue: string): Promise<void> {
        await utilGrid.searchAndSelectGridRecord(caseTemplateValue, this.selectors.gridGUID);
    }

    async getCaseTemplateNamePresentOnGrid(templateName: string): Promise<string> {
//        await browser.wait(this.EC.visibilityOf(element(by.cssContainingText((this.selectors.gridLink), templateName))));
        return element(by.cssContainingText((this.selectors.gridLink), templateName)).getText();
    }

    async addColumnOnGrid(columnName: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.gridGUID, columnName);
    }

    async removeColumnFromGrid(columnName: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.gridGUID, columnName)
    }

    async isValueDisplayed(columnName: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGUID, columnName);
    }

    async clickOnClearSearchIcon(): Promise<void> {
        await utilGrid.clearGridSearchBox();
    }

    async moreRecordsArePresentAfterClear(): Promise<number> {
//        await utilCommon.waitUntilSpinnerToHide();
        return await $$(this.selectors.recordvalue).count();
    }

    async getTemplateCountFromGrid(): Promise<number> {
        return await $$(this.selectors.gridLink).count();
    }
}

export default new CaseTemplateConsole();
