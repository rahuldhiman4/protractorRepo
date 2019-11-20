import { element, by, ProtractorExpectedConditions, protractor, browser, $, $$, Key } from "protractor"

class ManageTaskBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addTaskFromTemplateButton: '[rx-view-component-id="d02d64d8-5a76-4cdc-8263-1d45b2da4dd1"] button',
        addAdhocTaskButton: '[rx-view-component-id="0b9c53ae-7090-446f-af7e-317ef1391d39"] button',
        refreshButton: '[rx-id="refresh-button"]',
        taskFromManageTasks: 'ux-task-manager .link',
        saveButton: '[rx-view-component-id="b7f9f666-5c22-463a-bc86-4cb66e26fa35"] button',
        searchTextbox: '[rx-id="search-text-input"]',
        canceltaskTemplatbutton: '[rx-view-component-id="ba0bd5fe-391a-4885-8f0c-56cfead43ebd"] button',
        recommendedTemplateCheckbox: '[rx-view-component-id="da1ffbb0-567a-4199-b94f-413bee7f149b"] .ui-grid-icon-ok',
    }

    async clickAddTaskFromTemplateButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addTaskFromTemplateButton)));
        await $(this.selectors.addTaskFromTemplateButton).click();
    }

    async clickAddAdhocTaskButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addAdhocTaskButton)));
        await $(this.selectors.addAdhocTaskButton).click();
    }

    async setTaskSearchBoxValue(input: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchTextbox)));
        await $(this.selectors.searchTextbox).clear();
        await $(this.selectors.searchTextbox).sendKeys(input, Key.ENTER);
    }

    async clickOnRefreshButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.refreshButton)));
        await $(this.selectors.refreshButton).click();
    }

    async clickTaskLinkOnManageTask(taskName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText(this.selectors.taskFromManageTasks, taskName))));
        await element(by.cssContainingText(this.selectors.taskFromManageTasks, taskName)).click();
    }

    async clickFirstCheckBoxInTaskTemplateSearchGrid(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedTemplateCheckbox)));
        await browser.sleep(1000);
        await $$(this.selectors.recommendedTemplateCheckbox).first().click();
    }

    async clickOnTaskGridSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnTaskGridCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.canceltaskTemplatbutton)));
        await $(this.selectors.canceltaskTemplatbutton).click();
    }
}

export default new ManageTaskBlade();