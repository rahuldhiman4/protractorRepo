import { ProtractorExpectedConditions, protractor, browser, $, $$, element, by } from "protractor"
import commonUtils from "../../utils/util.common";
import utilsGrid from "../../utils/util.grid";
import { resolve } from 'path';
import utilCommon from '../../utils/util.common';

class EmailTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        applyButton: '[rx-view-component-id="05732013-6207-4a3f-864b-be482cdffa6b"] button',
        emptyGridNoCheckBox: '.ui-grid-icon-ok',
        cancelButton:'[rx-view-component-id="84e2938d-2e78-4b3a-bbe5-7ffba7e7ebfb"] button'
    }

    async clickOnApplyButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.applyButton)));
        $(this.selectors.applyButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        $(this.selectors.cancelButton).click();
    }

    async searchAndSelectEmailTemplate(value:string): Promise<void> {
        await utilsGrid.searchAndSelectFirstCheckBoxWOGrid(value);
    }

    async isEmailTemplateGridEmpty():Promise<boolean>{
        return $(this.selectors.applyButton).isPresent();
    }

}

export default new EmailTemplateBlade();