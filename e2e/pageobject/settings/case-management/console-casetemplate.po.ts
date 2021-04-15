import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityGrid from "../../../utils/utility.grid";

class CaseTemplateConsole {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        createCaseTemplate: '[rx-view-component-id="3a9fd0a9-2b68-4872-a022-7c56b377a4dc"] button',
        copyCaseTemplate: '[rx-view-component-id="92e13921-bf7b-494e-9d65-609a07c36505"] button',
        gridGUID: "1c10246e-18ed-4201-91b7-210e7a975f9c",
        searchButton: "1c10246e-18ed-4201-91b7-210e7a975f9c",
        gridLink: 'a.no-href-link',
        recordvalue: '.at-radiobutton-cell input'
    }

    async clickOnCreateCaseTemplateButton(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.createCaseTemplate)));
        await $(this.selectors.createCaseTemplate).click();
        await browser.sleep(4000); //Defect --> DRDMV-25992  Need this sleep becoz default owner group/organization/company loading let and case template not gets save
    }

    async isCreateCaseTemplateEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.createCaseTemplate)));
        return await $(this.selectors.createCaseTemplate).isEnabled();
    }

    async clickOnCopyCaseTemplate(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.copyCaseTemplate)));
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.copyCaseTemplate)));
        await $(this.selectors.copyCaseTemplate).click();
    }

    async searchAndClickOnCaseTemplate(caseTemplateValue: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(caseTemplateValue, this.selectors.gridGUID);
    }

    async searchAndselectCaseTemplate(caseTemplateValue: string): Promise<void> {
        await browser.sleep(5000); //Unable to search record in given time frame
        await utilityGrid.searchAndSelectGridRecord(caseTemplateValue, this.selectors.gridGUID);
    }

    async getCaseTemplateNamePresentOnGrid(templateName: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf(element(by.cssContainingText((this.selectors.gridLink), templateName))));
        return await element(by.cssContainingText((this.selectors.gridLink), templateName)).getText();
    }

    async addColumnOnGrid(columnName: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnName, this.selectors.gridGUID);
    }

    async removeColumnFromGrid(columnName: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnName, this.selectors.gridGUID)
    }

    async getFirstRecordValue(columnName: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnName, this.selectors.gridGUID);
    }

    async clickOnClearSearchIcon(): Promise<void> {
        await utilityGrid.clearSearchBox();
    }

    async moreRecordsArePresentAfterClear(): Promise<number> {
        //        await utilCommon.waitUntilSpinnerToHide();
        return await $$(this.selectors.recordvalue).count();
    }

    async getTemplateCountFromGrid(): Promise<number> {
        return await $$(this.selectors.gridLink).count();
    }

    async isAddCaseTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.createCaseTemplate).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.createCaseTemplate).isDisplayed();
            } else return false;
        });
    }

    async isCopyCaseTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.copyCaseTemplate).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.copyCaseTemplate).isDisplayed();
            } else return false;
        });
    }

}

export default new CaseTemplateConsole();
