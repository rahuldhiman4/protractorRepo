import { ProtractorExpectedConditions, protractor, browser, $, by, element } from 'protractor';
import utilGrid from "../../utils/util.grid";
import casetemplateBlade from '../../pageobject/case/select-casetemplate-blade.po';

class CaseTemplateConsole {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        createCaseTemplate: '[rx-view-component-id="3a9fd0a9-2b68-4872-a022-7c56b377a4dc"] button',
        copyCaseTemplate: '[rx-view-component-id="92e13921-bf7b-494e-9d65-609a07c36505"] button',
        gridGUID: "1c10246e-18ed-4201-91b7-210e7a975f9c",
        searchButton: "1c10246e-18ed-4201-91b7-210e7a975f9c",
        gridLink: '[rx-view-component-id="1c10246e-18ed-4201-91b7-210e7a975f9c"] .ui-grid__link'
    }

    async clickOnCreateCaseTemplateButton(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.createCaseTemplate)));
        await $(this.selectors.createCaseTemplate).click();
    }

    async clickOnCopyCaseTemplate(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.copyCaseTemplate)));
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.copyCaseTemplate)));
        await $(this.selectors.copyCaseTemplate).click();
    }

    async searchAndClickOnCaseTemplate(caseTemplateValue: string): Promise<void> {
        await utilGrid.searchAndClickOnHyperLink(this.selectors.gridGUID, caseTemplateValue);
    }

    async searchAndselectCaseTemplate(caseTemplateValue: string): Promise<void> {
        await casetemplateBlade.setSearchBoxValue(caseTemplateValue);
        browser.sleep(4000);
        await casetemplateBlade.clickOnFirstCheckBox();
    }
    async getCaseTemplateNamePresentOnGrid(templateName: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf(element(by.cssContainingText((this.selectors.gridLink), templateName))));
        return element(by.cssContainingText((this.selectors.gridLink), templateName)).getText();
    }
}

export default new CaseTemplateConsole();
