import { $, $$, browser, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";
import caseViewPage from "../../pageobject/case/view-case.po";
import utilCommon from "../../utils/util.common";
import utilGrid from '../../utils/util.grid';

class ManageTaskBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addTaskFromTemplateButton: '[rx-view-component-id="d02d64d8-5a76-4cdc-8263-1d45b2da4dd1"] button',
        addAdhocTaskButton: '[rx-view-component-id="0b9c53ae-7090-446f-af7e-317ef1391d39"] button',
        refreshButton: '[rx-id="refresh-button"]',
        taskFromManageTasks: 'ux-task-manager a.link',
        saveButton: '[rx-view-component-id="b7f9f666-5c22-463a-bc86-4cb66e26fa35"] button',
        searchTextbox: '[rx-id="search-text-input"]',
        canceltaskTemplatbutton: '[rx-view-component-id="ba0bd5fe-391a-4885-8f0c-56cfead43ebd"] button',
        recommendedTemplateCheckbox: '[rx-view-component-id="da1ffbb0-567a-4199-b94f-413bee7f149b"] .ui-grid-icon-ok',
        closeButton: '[rx-view-component-id="8e7b2768-299d-468a-bd46-4827677e8eff"] button',
        columnHeaders: '.ui-grid-header-cell-label',
        taskTemplateGuid: '0f3712cc-95da-49c3-b2b0-6b7409c8349b',
    }

    async clickAddTaskFromTemplateButton(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.closeButton)));
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addTaskFromTemplateButton)));
        await $(this.selectors.addTaskFromTemplateButton).click();
    }

    async getSortedValuesFromColumn(columnHeader: string): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(columnHeader, 'ascending', this.selectors.taskTemplateGuid);
    }

    async getFilterValue(copy: string): Promise<boolean> {
        let arr: string[] = await utilGrid.getAllValuesFromColoumn((this.selectors.taskTemplateGuid), 'Task Type');
        let filtered: string[] = arr.filter(function (el) {
            return el == copy;
        });
        return arr.length == filtered.length;
    }

    async clickonColumnHeader(value: string): Promise<void> {
        let column = await element(by.cssContainingText(this.selectors.columnHeaders, value));
        await browser.wait(this.EC.elementToBeClickable(column));
        await column.click();
    }

    async clickManageTaskCloseButton(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.closeButton)));
        await $(this.selectors.closeButton).click();
    }

    async clickAddAdhocTaskButton(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.closeButton)));
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addAdhocTaskButton)));
        await $(this.selectors.addAdhocTaskButton).click();
    }

    async setTaskSearchBoxValue(input: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchTextbox)));
        await $(this.selectors.searchTextbox).clear();
        await $(this.selectors.searchTextbox).sendKeys(input, Key.ENTER);
    }

    async searchTaskAndClickOnLink(input: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(input);
    }

    async clickOnRefreshButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.refreshButton)));
        await $(this.selectors.refreshButton).click();
    }

    async clickTaskLinkOnManageTask(taskSummary: string): Promise<void> {
        await browser.wait(this.EC.or(async () => {
            let count = await $$(this.selectors.taskFromManageTasks).count();
            return count >= 1;
        }));
        await browser.wait(this.EC.elementToBeClickable(element(by.linkText(taskSummary))));
        await element(by.linkText(taskSummary)).click();
        await utilCommon.waitUntilSpinnerToHide();
    }

    async clickFirstCheckBoxInTaskTemplateSearchGrid(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedTemplateCheckbox)));
        await browser.sleep(3000);
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

    async clickOnCloseButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.closeButton)));
        await $(this.selectors.closeButton).click();
        await browser.wait(this.EC.invisibilityOf($('.modal-dialog')));
        await browser.wait(this.EC.visibilityOf($(caseViewPage.selectors.editLink)));
        await utilCommon.waitUntilSpinnerToHide();
    }

    async isTaskLinkOnManageTask(taskSummary: string): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText(this.selectors.taskFromManageTasks, taskSummary))));
        return await element(by.cssContainingText(this.selectors.taskFromManageTasks, taskSummary)).isDisplayed();
    }

    async addTaskFromTaskTemplate(templateSummary: string): Promise<void> {
        await this.clickAddTaskFromTemplateButton();
        await utilGrid.searchAndSelectGridRecord(templateSummary);
        await this.clickOnTaskGridSaveButton();
       
    }
}

export default new ManageTaskBlade();