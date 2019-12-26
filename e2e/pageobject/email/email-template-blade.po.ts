import { ProtractorExpectedConditions, protractor, browser, $, $$, element, by } from "protractor"
import commonUtils from "../../utils/util.common";
import utilsGrid from "../../utils/util.grid";
import { resolve } from 'path';

class EmailTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        applyButton: '[rx-view-component-id="05732013-6207-4a3f-864b-be482cdffa6b"] button'
    }

    async clickOnApplyButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.applyButton)));
        $(this.selectors.applyButton).click();
    }

    async searchAndSelectEmailTemplate(value:string): Promise<void> {
        await utilsGrid.searchAndSelectFirstCheckBoxWOGrid(value);
    }

}

export default new EmailTemplateBlade();