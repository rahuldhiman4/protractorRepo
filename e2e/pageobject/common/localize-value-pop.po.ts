import { $, protractor, ProtractorExpectedConditions } from "protractor";

class AddLocalizeValue {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        valueTextBox: 'input[aria-label="Value for default locale"]',
        saveButton: 'button[rx-id="save-button"]',
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
      return  await $(this.selectors.saveButton).isEnabled();
    }

    async clearValueTextBox(): Promise<void> {
        await $(this.selectors.valueTextBox).clear();
    }

    async setLocalizeValue(value:string): Promise<void> {
        await $(this.selectors.valueTextBox).sendKeys(value);
    }

    async clearLocalizeValue(): Promise<void> {
        await $(this.selectors.valueTextBox).clear();
    }
}
export default new AddLocalizeValue();