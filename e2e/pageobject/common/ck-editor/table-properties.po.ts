import { $, $$, protractor, ProtractorExpectedConditions, browser } from "protractor";

class TableProperties {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        tablePropertiesInput: ' table tbody input',
        dropdownValues: ' table tbody select.cke_dialog_ui_input_select',
        okButton: '.cke_dialog_ui_button_ok',
        tableDialogWindow: '.cke_dialog_body'
    }

    async getTableParentElementIndex(): Promise<number> {
        let i: number = 0;
        let elementsCount = await $$('.cke_dialog_body .cke_dialog_title').count();
        for (i = 0; i < elementsCount; i++) {
            let actualText = await $$('.cke_dialog_body .cke_dialog_title').get(i).getText();
            if (actualText == 'Table Properties') {
                break;
            }
        }
        return i;
    }

    async setValueOfTableProperties(value: string, sequ: number): Promise<void> {
        let index = await this.getTableParentElementIndex();
        await $$(this.selectors.tableDialogWindow).get(index).$$(this.selectors.tablePropertiesInput).get(sequ).clear();
        await $$(this.selectors.tableDialogWindow).get(index).$$(this.selectors.tablePropertiesInput).get(sequ).sendKeys(value);
    }

    async selectDropDownValues(value: string, sequ: number): Promise<void> {
        let index = await this.getTableParentElementIndex();
        await $$(this.selectors.tableDialogWindow).get(index).$$(this.selectors.dropdownValues).get(sequ).click();
        let locator = `option[value='${value}']`
        await $(locator).click();
    }

    async clickOnOkButton(): Promise<void> {
        let index = await this.getTableParentElementIndex();
        await $$(this.selectors.tableDialogWindow).get(index).$(this.selectors.okButton).click();
        await browser.sleep(1000); // Wait For Table Gets Added On Email Body.
    }

}
export default new TableProperties();