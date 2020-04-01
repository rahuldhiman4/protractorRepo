import { $,$$, browser, protractor, ProtractorExpectedConditions } from "protractor";

class TableProperties {
   
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        tablePropertiesInput:'.cke_single_page  tbody input',
        dropdownValues:'.cke_single_page select.cke_dialog_ui_input_select',
        okButton:'.cke_dialog_footer .cke_dialog_ui_button_ok',
    }
    
    async setValueOfTableProperties(value:string,sequ:number):Promise<void>{
        await $$(this.selectors.tablePropertiesInput).get(sequ).clear();
        await $$(this.selectors.tablePropertiesInput).get(sequ).sendKeys(value);
    }

    async selectDropDownValues(value:string,sequ:number):Promise<void>{
        await $$(this.selectors.dropdownValues).get(sequ).click();
        let locator=`option[value='${value}']`
        await $(locator).click();
    }

    async clickOnOkButton():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable( $(this.selectors.okButton)));
        await $(this.selectors.okButton).click();
    }

}
export default new TableProperties();