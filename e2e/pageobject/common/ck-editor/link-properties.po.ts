import { $, $$, protractor, ProtractorExpectedConditions } from "protractor";

class LinkProperties {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        linkPropertiesInput: 'input.cke_dialog_ui_input_text',
        dropdownValues: 'select.cke_dialog_ui_input_select',
        targetTab: '[title="Target"]',
        okButton: '.cke_dialog_ui_button_ok',
        linkDialogWindow: '.cke_dialog_body'
    }

    async getLinkParentElementIndex(): Promise<number> {
        let i = 0;
        let elementsCount = await $$('.cke_dialog_body').count();
        for (i = 0; i < elementsCount; i++) {
            let tempElement = await $$('.cke_dialog_body').get(i);
            let actualText = await tempElement.$('div').getText();
            if (actualText == 'Link') {
                break;
            }
        }
        return i;
    }

    async clickOnTargetTab(): Promise<void> {
        await $(this.selectors.targetTab).click();
    }

    async clickOnOkBtn(): Promise<void> {
        let index = await this.getLinkParentElementIndex();
        await $$(this.selectors.linkDialogWindow).get(index).$(this.selectors.okButton).click();
    }

    async setValueOfLinkProperties(value: string, sequence: number): Promise<void> {
        let index = await this.getLinkParentElementIndex();
        await $$(this.selectors.linkDialogWindow).get(index).$$(this.selectors.linkPropertiesInput).get(sequence).sendKeys(value);
    }

    async selectDropDown(value: string, sequence: number) {
        let index = await this.getLinkParentElementIndex();
        await $$(this.selectors.linkDialogWindow).get(index).$$(this.selectors.dropdownValues).get(sequence).click();
        let locator = `option[value='${value}']`;
        await $$(locator).get(1).click();
    }

}
export default new LinkProperties();