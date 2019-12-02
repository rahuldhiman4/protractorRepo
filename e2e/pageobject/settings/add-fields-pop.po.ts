import { ProtractorExpectedConditions, protractor, browser, $, element, by } from "protractor"

class addField {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        fieldVariable: '.rx-data-dictionary-item-value',
        parentFields: '.rx-tree-node-parent',
        okButtonOnEditor: '.rx-expression-editor-action-buttons .d-button_primary',
        cancelButtonOnEditor: '.rx-expression-editor-action-buttons .d-button_secondary',
        addField: '.rx-expression-editor-dictionary h5'
    }

    async getHeaderOfAddfield(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addField)));
        return $(this.selectors.addField).getText();
    }

    async setValueOfField(fromTree: string, value: string): Promise<void> {
        var option = await element(by.cssContainingText(this.selectors.parentFields, fromTree));
        await browser.wait(this.EC.visibilityOf(option));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
        var fieldValue = await element(by.cssContainingText(this.selectors.fieldVariable, value));
        await browser.wait(this.EC.visibilityOf(fieldValue));
        await browser.wait(this.EC.elementToBeClickable(fieldValue));
        await browser.actions().mouseMove(fieldValue).doubleClick().perform();
    }

    async clickOnOkButtonOfEditor():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.okButtonOnEditor)));
        await $(this.selectors.okButtonOnEditor).click(); 
    }

}
export default new addField();