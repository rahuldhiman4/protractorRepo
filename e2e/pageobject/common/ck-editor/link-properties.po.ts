import { $,$$, protractor, ProtractorExpectedConditions } from "protractor";

class LinkProperties {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        linkPropertiesInput:'input.cke_dialog_ui_input_text',
        dropdownValues:'select.cke_dialog_ui_input_select',
        targetTab:'[title="Target"]',
        okButton:'.cke_dialog_ui_button_ok',
        linkDialogWindow:'.cke_dialog_body'
    }

    async clickOnTargetTab():Promise<void>{
      await $(this.selectors.targetTab).click();  
    }
    
    async clickOnOkBtn():Promise<void>{
        await $$(this.selectors.linkDialogWindow).get(1).$(this.selectors.okButton).click();
    }

    async setValueOfLinkProperties(value:string,sequence:number):Promise<void>{
        await $$(this.selectors.linkDialogWindow).get(1).$$(this.selectors.linkPropertiesInput).get(sequence).sendKeys(value);
    }

    async selectDropDown(value:string,sequence:number){
        await $$(this.selectors.linkDialogWindow).get(1).$$(this.selectors.dropdownValues).get(sequence).click();
        let locator=`option[value='${value}']`;
        await $$(locator).get(1).click();
    }

}
export default new LinkProperties();