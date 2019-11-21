import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class EditTask {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        taskTypeValue: '[rx-view-component-id="057f2521-313b-40c9-be56-829827512abf"] .ui-select-toggle',
        cancelButton: '[rx-view-component-id="705c3907-a82e-4de4-a8b0-32fe00483403"] button',
        processNameValue: '[rx-view-component-id="7260c238-9e41-4d31-90de-2d46443117b4"] input',
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

    async processNamePresentInTask(): Promise<boolean> {
        await browser.wait(this.EC.invisibilityOf($(this.selectors.processNameValue)));
        return await $(this.selectors.processNameValue).isDisplayed();
    }

    async waitProcessNamePresentInTask(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.processNameValue)));
        return await $(this.selectors.processNameValue).isDisplayed();
    }
}

export default new EditTask();