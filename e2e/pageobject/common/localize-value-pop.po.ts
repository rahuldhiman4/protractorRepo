import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class AddLocalizeValue {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        valueTextBox: '.d-textfield__input[aria-label="Value for default locale"]',
        saveButton: '.d-button_primary[rx-id="save-button"]',
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clearValueTextBox(): Promise<void> {
        await $(this.selectors.valueTextBox).clear();
    }

    async setLocalizeValue(value:string): Promise<void> {
        await $(this.selectors.valueTextBox).sendKeys(value);
    }
}
export default new AddLocalizeValue();