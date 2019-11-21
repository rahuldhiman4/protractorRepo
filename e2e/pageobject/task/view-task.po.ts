import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class ViewTask {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        taskTypeValue: '[rx-view-component-id="057f2521-313b-40c9-be56-829827512abf"] p',
        editButton: '.edit-link ',
        viewCase: '[rx-view-component-id="036a7325-43e3-47e6-bb50-7f8d9fe8d118"] button',
        categoryTier1Value: '[rx-view-component-id="909ad3ad-6706-4d46-bb5a-bc48fa6ca98e"] p',
        categoryTier2Value: '[rx-view-component-id="49d231d9-ee81-4d7c-90af-d7ca785a32d4"] p',
        categoryTier3Value: '[rx-view-component-id="c8858fb5-5b21-4e0d-a947-c0130a72b51a"] p',
        categoryTier4Value: '[rx-view-component-id="ff1636f8-4efe-4447-9c04-f32799904f2b"] p',
        labelValue: '[rx-view-component-id="4c2784af-c080-4630-8f16-d9e6b07e87a2"] p',
        descriptionValue: '[rx-view-component-id="6053a7e8-5194-420b-965a-1c3bfe3ad0a1"] .show-less-wrapper',
        processnameValue: '[rx-view-component-id="7260c238-9e41-4d31-90de-2d46443117b4"] p',
        taskIdText: '[rx-view-component-id="75371088-cfeb-4554-a939-2fe7b2aa098b"] .text-field',
    }

    async clickOnEditTask(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editButton)));
        await $(this.selectors.editButton).click();
    }

    async clickOnViewCase(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.viewCase)));
        await $(this.selectors.viewCase).click();
    }

    async getCategoryTier1Value(): Promise<string> {
        await browser.wait(this.EC.presenceOf($(this.selectors.categoryTier1Value)));
        return await $(this.selectors.categoryTier1Value).getText();
    }

    async getCategoryTier2Value(): Promise<string> {
        await browser.wait(this.EC.presenceOf($(this.selectors.categoryTier2Value)));
        return await $(this.selectors.categoryTier2Value).getText();
    }

    async getCategoryTier3Value(): Promise<string> {
        await browser.wait(this.EC.presenceOf($(this.selectors.categoryTier3Value)));
        return await $(this.selectors.categoryTier3Value).getText();
    }

    async getCategoryTier4Value(): Promise<string> {
        await browser.wait(this.EC.presenceOf($(this.selectors.categoryTier4Value)));
        return await $(this.selectors.categoryTier4Value).getText();
    }

    async getLabelValue(): Promise<string> {
        await browser.wait(this.EC.presenceOf($(this.selectors.labelValue)));
        return await $(this.selectors.labelValue).getText();
    }

    async getDescriptionValue(): Promise<string> {
        await browser.wait(this.EC.presenceOf($(this.selectors.descriptionValue)));
        return await $(this.selectors.descriptionValue).getText();
    }

    async getTaskTypeValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskTypeValue)));
        return await $(this.selectors.taskTypeValue).getText();
    }

    async getProcessNameValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.processnameValue)));
        return await $(this.selectors.processnameValue).getText();
    }

    async getTaskID(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskIdText)));
        return await $(this.selectors.taskIdText).getText();
    }
}

export default new ViewTask();