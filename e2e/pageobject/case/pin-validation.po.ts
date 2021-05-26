import { $, by, element, protractor, ProtractorExpectedConditions, browser, $$ } from "protractor";


class PinValidationPO {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        validateButton: '.alert-warning button.btn-secondary',
        pinValidateInput: '.bwf-pin-validation-view input',
        pinOk: '.bwf-pin-validation-view .button-container button.btn-primary',
        pinCancel: '.bwf-pin-validation-view .button-container button.btn-secondary',
        popUpMessage: 'button.d-icon-left-exclamation_triangle span',
    }

    async isIdentityValidationMessageDisplayed(messageValue: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.popUpMessage, messageValue)).isPresent().then(async (result) => {
            if(result) return await element(by.cssContainingText(this.selectors.popUpMessage, messageValue)).isDisplayed();
            else return false;
        })
    }
    
    async clickOnPINCancelBtn(): Promise<void> {
        await $(this.selectors.pinCancel).click();
    }

    async validatePin(pinValue: string): Promise<void> {
        await $(this.selectors.validateButton).click();
        await $(this.selectors.pinValidateInput).sendKeys(pinValue);
        await $(this.selectors.pinOk).click();
    }
}

export default new PinValidationPO();