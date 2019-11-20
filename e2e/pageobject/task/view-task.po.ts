import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class ViewTask {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        taskTypeValue: '[rx-view-component-id="057f2521-313b-40c9-be56-829827512abf"] p',
        editButton: '.edit-link ',
        viewCase: '[rx-view-component-id="036a7325-43e3-47e6-bb50-7f8d9fe8d118"] button',
    }

    async clickOnEditTask(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editButton)));
        await $(this.selectors.editButton).click();
    }

    async clickOnViewCase(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.viewCase)));
        await $(this.selectors.viewCase).click();
    }
}

export default new ViewTask();