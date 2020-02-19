import { $, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from "../../../utils/util.grid";
class ConsoleNotesTemplate {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        notesTemplate: '.d-icon-left-plus',
        gridGuid: '485ea5d0-3bf5-4393-b2f4-40917f524f88',
        status: 'a6f36df8-bb54-405f-ab71-7ac3b4b3e71d',
        templateNameFromGrid: '.ui-grid__link',
        deleteButton: '.d-icon-left-cross',
        selectCheckBox: '.ui-grid-icon-ok',
        body: '.cke_wysiwyg_div',
        fiter: '.d-icon-left-filter',
        searchTextBox: 'input[rx-id="search-text-input"]',
        searchButton: '[rx-id="submit-search-button"]',
        refreshButton: '.d-icon-refresh',
    }

    async clickOnCreateNotesTemplate(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.notesTemplate)));
        await $(this.selectors.notesTemplate).click();
    }

    async clickOnTemplateName(temmplateName: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(temmplateName, this.selectors.gridGuid);
    }

    async isTemplatePresentInGrid(templateNameValue: string): Promise<string> {
        await utilGrid.searchAndSelectGridRecord(templateNameValue, this.selectors.gridGuid);
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.templateNameFromGrid)));
        return await $(this.selectors.templateNameFromGrid).getText();
    }

    async searchAndClickNotesTemplateCheckBox(temmplateNameValue: string): Promise<void> {
        //        await browser.wait(this.EC.invisibilityOf($(this.selectors.body)));
        await utilGrid.searchAndSelectGridRecord(temmplateNameValue);
    }

    async searchAndClickOnNotesTemplate(templateName: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(templateName);
    }

    async clickOnDeleteButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.deleteButton)));
        await $(this.selectors.deleteButton).click();
    }

    async isTemplatePresentOnGrid(templateNameValue): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf(element(by.cssContainingText((this.selectors.templateNameFromGrid), templateNameValue))));
        return await element(by.cssContainingText(this.selectors.templateNameFromGrid, templateNameValue)).isDisplayed();
    }

    async isNotesTemplateUIConsolePresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.searchTextBox)));
        let a: boolean = await $(this.selectors.searchTextBox).isDisplayed();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.searchButton)));
        let b: boolean = await $(this.selectors.searchButton).isDisplayed();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.refreshButton)));
        let c: boolean = await $(this.selectors.refreshButton).isDisplayed();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.notesTemplate)));
        let d: boolean = await $(this.selectors.notesTemplate).isDisplayed();
        return (a == b == c == d == true);
    }

    async isAddNotesTemplateBtnDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.notesTemplate)));
        return await $(this.selectors.notesTemplate).getAttribute("disabled") == "true";
    }

    async isDeleteNotesTemplateBtnDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).getAttribute("disabled") == "true";
    }
    
    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid, columnHeader);
    }

}

export default new ConsoleNotesTemplate();