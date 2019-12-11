import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class EditTaskTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        taskTypeValue: '[rx-view-component-id="cee6d303-5db9-4b3a-98e1-3096ffebf363"] .ui-select-container',
        cancelButton: '[rx-view-component-id="7c66f7cb-612d-4ef5-b3f5-79f6d96b0083"] button',
        processNameValue: '[rx-view-component-id="880bd8d5-1b16-4c74-a377-4135919c362a"] input',
        saveButton: '[rx-view-component-id="6649c51c-e27e-4026-ab4a-de5f40216ea9"] button',
    }

    async clickOnSaveButton() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        $(this.selectors.saveButton).click();
    }

    async getTaskTypeValueAttribute(attribute: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskTypeValue)));
        return await $(this.selectors.taskTypeValue).getAttribute(attribute);
    }

    async clickOnCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async getTaskTypeValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskTypeValue)));
        return await $(this.selectors.taskTypeValue).getText();
    }

    async isProcessNamePresentInTask(): Promise<boolean> {
        await browser.wait(this.EC.presenceOf($(this.selectors.processNameValue)));
        return await $(this.selectors.processNameValue).isDisplayed();
    }
}

export default new EditTaskTemplate();