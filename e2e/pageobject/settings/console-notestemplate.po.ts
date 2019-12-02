import { ProtractorExpectedConditions, protractor, browser, $, $$, element, by, promise } from "protractor"
import utilGrid from "../../utils/ui/util.grid";
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
class ConsoleNotesTemplate {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        notesTemplate: '.d-icon-left-plus',
        gridGuid: '485ea5d0-3bf5-4393-b2f4-40917f524f88',
        status: 'a6f36df8-bb54-405f-ab71-7ac3b4b3e71d',
        templateNameFromGrid: '.ui-grid__link',
        deleteButton: '.d-icon-left-cross',
        selectCheckBox: '.ui-grid-icon-ok',
        body: '.cke_wysiwyg_div'
    };

    async clickOnCreateNotesTemplate(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.notesTemplate)));
        $(this.selectors.notesTemplate).click();
    }

    async clickOnTemplateName(temmplateName: string): Promise<void> {
        utilGrid.searchAndClickOnHyperLink(this.selectors.gridGuid, temmplateName);
    }

    async isTemplatePresentInGrid(templateNameValue: string): Promise<string> {
        utilGrid.searchAndSelectFirstCheckBox(this.selectors.gridGuid, templateNameValue);
        await browser.wait(this.EC.visibilityOf($(this.selectors.templateNameFromGrid)));
        return await $(this.selectors.templateNameFromGrid).getText();
    }

    async searchAndSelectFristCheckBox(temmplateNameValue: string): Promise<void> {
        await utilGrid.searchAndSelectFirstCheckBox(this.selectors.gridGuid, temmplateNameValue);
    }

    async searchAndClickOnNotesTemplate(templateName: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(templateName);
    }

    async clickOnDeleteButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.deleteButton)));
        await $(this.selectors.deleteButton).click();
    }

    async selectCheckBox(): Promise<void> {
        await browser.wait(this.EC.invisibilityOf($(this.selectors.body)));
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectCheckBox)));
        await $(this.selectors.selectCheckBox).click();
    }

    async isTemplatePresentOnGrid(templateNameValue): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf(element(by.cssContainingText((this.selectors.templateNameFromGrid), templateNameValue))));
        return element(by.cssContainingText(this.selectors.templateNameFromGrid, templateNameValue)).isDisplayed();
    }
}

export default new ConsoleNotesTemplate();