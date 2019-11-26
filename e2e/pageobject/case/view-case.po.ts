import { ProtractorExpectedConditions, protractor, browser, element, by, $ } from "protractor"
import manageTask from "../../pageobject/task/manage-task-blade.po";

class ViewCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        saveUpdateStatus: '[rx-view-component-id="ee5dd503-a10e-4d22-9ac5-99c400892bb7"] button',
        statusChange: '[rx-view-component-id="48bbcbbf-564c-4d46-8dc2-1e7670c187ff"] .status-transition',
        statusChangeReason: '[rx-view-component-id="049c43a1-4cbd-482d-980d-5db4ed78f295"]',
        statusDropDown: '[rx-view-component-id="3c8d9278-fc1f-430c-b866-cdc9d217318b"]',
        coreTaskArrow: '[rx-view-component-id="0733a05e-2eea-4fe5-90a8-909238dc6389"] i',
        addTaskButton: '[rx-view-component-id="db1c57fc-c332-40fa-b1c0-759e21d9ad5c"] button',
        editLink: '.edit-link',
        caseIdText: '[rx-view-component-id="7b47ca08-e9d4-4656-8f96-3bc751c098b0"] .title',
    }

    async addTaskFromTaskTemplate(templateName: string) {
        await manageTask.clickAddTaskFromTemplateButton();
        await manageTask.setTaskSearchBoxValue(templateName);
        await manageTask.clickFirstCheckBoxInTaskTemplateSearchGrid();
        await manageTask.clickOnTaskGridSaveButton();
    }

    async clickSaveStatus(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveUpdateStatus)));
        await $(this.selectors.saveUpdateStatus).click();
        await browser.sleep(2000);
    }

    async goToManageTask(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.coreTaskArrow)));
        await $(this.selectors.coreTaskArrow).click();
    }

    async changeCaseStatus(statusValue: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        const statusUpdate = $(this.selectors.statusDropDown);
        await browser.wait(this.EC.elementToBeClickable(statusUpdate.$('[aria-label="Status activate"]')));
        await (statusUpdate.$('[aria-label="Status activate"]')).click();
        await element(by.cssContainingText(this.selectors.statusDropDown + ' .ui-select__rx-choice', statusValue)).click();
    }

    async clickEditCaseButton(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.editLink)));
        await $(this.selectors.editLink).click();
    }

    async setStatusReason(statusValue: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChangeReason)));
        await $(this.selectors.statusChangeReason).click();
        const statusReason = $(this.selectors.statusChangeReason);
        await browser.wait(this.EC.elementToBeClickable(statusReason.$('input[type="search"]')));
        await (statusReason.$('input[type="search"]')).sendKeys(statusValue);
        var option = await element(by.cssContainingText((this.selectors.statusChangeReason + ' .ui-select__rx-choice'), statusValue));
        await browser.wait(this.EC.visibilityOf(option));
        await option.click();
    }

    async clickAddTaskButton() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addTaskButton)));
        await $(this.selectors.addTaskButton).click();
    }

    async getCaseID(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.caseIdText)));
        return await $(this.selectors.caseIdText).getText();
    }
}

export default new ViewCasePage();