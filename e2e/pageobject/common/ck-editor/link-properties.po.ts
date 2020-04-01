import { $,$$, protractor, ProtractorExpectedConditions } from "protractor";

class LinkProperties {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        linkPropertiesInput:'.cke_dialog_ui_labeled_content input.cke_dialog_ui_input_text',
        dropdownValues:'select.cke_dialog_ui_input_select',
        targetTab:'[title="Target"]',
        okButton:'.cke_dialog_footer .cke_dialog_ui_button_ok',
    }

    async clickOnTargetTab():Promise<void>{
      await $(this.selectors.targetTab).click();  
    }
    
    async clickOnOkBtn(sequ:number):Promise<void>{
        await $$(this.selectors.okButton).get(sequ).click();
    }

    async setValueOfLinkProperties(value:string,sequ:number):Promise<void>{
        await $$(this.selectors.linkPropertiesInput).get(sequ).sendKeys(value);
    }

    async selectDropDown(value:string,squ:number){
        await $$(this.selectors.dropdownValues).get(squ).click();
        let locator=`option[value='${value}']`;
        await $$(locator).get(1).click();
    }

}
export default new LinkProperties();