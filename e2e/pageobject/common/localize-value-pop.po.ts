import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class AddLocalizeValue {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        valueTextBox: '.d-textfield__input[aria-label="Value for default locale"]',
        saveButton: '.d-button_primary[rx-id="save-button"]',
    }

    async clickOnSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
        await utilCommon.waitUntilPopUpDisappear();
    }

    async clearValueTextBox(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.valueTextBox)));
        await $(this.selectors.valueTextBox).clear();
    }

    async valueTextBox(value:string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.valueTextBox)));
        await $(this.selectors.valueTextBox).sendKeys(value);
    }
}
export default new AddLocalizeValue();