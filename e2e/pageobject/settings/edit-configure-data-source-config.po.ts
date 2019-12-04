import { ProtractorExpectedConditions, protractor, browser, $, element, by } from "protractor"

class ConfigureDataSourceConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        showAdvancedSettings: '.modal-body .d-textfield button',
        buildExpressionBtn: '.modal-body .d-textfield__label button',
        associationName: 'associationModel',
        saveButton: '.slm-modal-footer button.d-button_primary',
    }

    async clickShowAdvancedSettings(): Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.showAdvancedSettings)));
        await $(this.selectors.showAdvancedSettings).click();   
    }

    async isBuildExpressionBtnDisabled(): Promise<boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.buildExpressionBtn)));
        return await $(this.selectors.buildExpressionBtn).getAttribute("disabled")=="true";
    }

    async isAssociationNameDisabled(): Promise<boolean>{
        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.associationName))));
        return await element(by.model(this.selectors.associationName)).getAttribute("disabled")=="true";
    }

    async isSaveBtnDisabled(): Promise<boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        return await $(this.selectors.saveButton).getAttribute("disabled")=="true";
    }


}

export default new ConfigureDataSourceConfigEditPage();
