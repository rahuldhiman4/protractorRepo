import { $, $$, browser, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

class ManageTaskBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addTaskFromTemplateButton: '[rx-view-component-id="d02d64d8-5a76-4cdc-8263-1d45b2da4dd1"] button',
        addAdhocTaskButton: '[rx-view-component-id="0b9c53ae-7090-446f-af7e-317ef1391d39"] button',
        refreshButton: '[rx-id="refresh-button"]',
        saveButton: '[rx-view-component-id="b7f9f666-5c22-463a-bc86-4cb66e26fa35"] button',
        searchTextbox: '.adapt-search-triggerable input[type="search"]',
        canceltaskTemplatbutton: '[rx-view-component-id="ba0bd5fe-391a-4885-8f0c-56cfead43ebd"] button',
        recommendedTemplateCheckbox: '[rx-view-component-id="da1ffbb0-567a-4199-b94f-413bee7f149b"] input[type="radio"]',
        closeButton: '[rx-view-component-id="8e7b2768-299d-468a-bd46-4827677e8eff"] button',
        columnHeaders: '.c-header-container .c-header-name',
        taskSummaryLink: '[rx-view-component-id="8334a05d-06ba-4d9b-8c35-e40e90637e85"] .task-summary__name',
        taskDisplayId: '[rx-view-component-id="ab0b52da-6511-4202-b1c4-f1d3eb65aada"] .bwf-task-card .task-meta-data__display-id',
        taskCardLocator: '[rx-view-component-id="ab0b52da-6511-4202-b1c4-f1d3eb65aada"] .bwf-task-card',
        rerunBtn: 'button.btn-rerun',
        gridGuid: 'da1ffbb0-567a-4199-b94f-413bee7f149b'
    }

    async clickAddTaskFromTemplateButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable(await $(this.selectors.addTaskFromTemplateButton)), 4000);
        await $(this.selectors.addTaskFromTemplateButton).isPresent().then(async (link) => {
            if (link) await $(this.selectors.addTaskFromTemplateButton).click();
            else console.log('AddTaskFromTemplate button not found');
        });
    }

    async isGridColumnSorted(columnHeader: string): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnHeader, 'asc');
    }


    async getFilterValue(copy: string): Promise<boolean> {
        let arr: string[] = await utilityGrid.getAllValuesFromColumn('Task Type');
        let filtered: string[] = arr.filter(function (el) {
            return el == copy;
        });
        return arr.length == filtered.length;
    }

    async clickGridColumnHeader(value: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.columnHeaders, value)).click();
        await browser.sleep(1500); // wait until sorting
    }

    async getTaskDisplayId(): Promise<string> {
        return await $(this.selectors.taskDisplayId).getText();
    }

    async clickAddAdhocTaskButton(): Promise<void> {
        await $(this.selectors.addAdhocTaskButton).click();
    }

    async setTaskSearchBoxValue(input: string): Promise<void> {
        await $(this.selectors.searchTextbox).clear();
        await $(this.selectors.searchTextbox).sendKeys(input, Key.ENTER);
    }

    async searchAndOpenTaskTemplate(input: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(input);
    }

    async clickTaskGridRefresh(): Promise<void> {
        await $(this.selectors.refreshButton).click();
    }

    async clickTaskLink(taskSummary: string): Promise<void> {
        await browser.wait(this.EC.or(async () => {
            let count = await $$(this.selectors.taskSummaryLink).count();
            return count >= 1;
        }), 5000);
        await element(by.cssContainingText(this.selectors.taskSummaryLink, taskSummary)).click();
        // due to defect we are adding below code
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
    }

    async clickFirstCheckBoxInTaskTemplateSearchGrid(): Promise<void> {
        await $$(this.selectors.recommendedTemplateCheckbox).first().click();
    }

    async clickTaskGridSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickTaskGridCancelButton(): Promise<void> {
        await $(this.selectors.canceltaskTemplatbutton).click();
    }

    async clickCloseButton(): Promise<void> {
        await $(this.selectors.closeButton).click();
    }

    async isTaskLinkPresent(taskSummary: string): Promise<boolean> {
        await this.waitUntilNumberOfTaskLinkAppear(1);
        let summaryLinkTxt = await element(by.cssContainingText(this.selectors.taskSummaryLink, taskSummary)).getText();
        return summaryLinkTxt === taskSummary;
    }

    async addTaskFromTaskTemplate(templateName: string, expectedTaskCount?: number): Promise<void> {
        await this.clickAddTaskFromTemplateButton();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndSelectGridRecord(templateName);
        await this.clickTaskGridSaveButton();
        if (expectedTaskCount) await this.waitUntilNumberOfTaskLinkAppear(expectedTaskCount);
        else await this.waitUntilNumberOfTaskLinkAppear(1);
    }

    async waitUntilNumberOfTaskLinkAppear(taskCount: number): Promise<boolean> {
        return await browser.wait(this.EC.or(async () => {
            let count = await $$(this.selectors.taskSummaryLink).count();
            return count >= taskCount;
        }), 5000);
    }

    async getTaskStatus(taskName: string): Promise<string> {
        let totalTaskCard = await $$(this.selectors.taskCardLocator).count();
        let statusValue: string = '';
        for (let i = 0; i < totalTaskCard; i++) {
            if (await $$(this.selectors.taskCardLocator).get(i).$('a.task-summary__name').getText() == taskName) {
                statusValue = await $$(this.selectors.taskCardLocator).get(i).$('.task-assigned-group div[title]').getText();
                break;
            }
        }
        return statusValue.trim();
    }

    async clickRerunBtn(): Promise<void> {
        await $(this.selectors.rerunBtn).click();
    }

    async searchTaskTemplate(templateName: string): Promise<void> {
        await utilityGrid.searchRecord(templateName, this.selectors.gridGuid);
    }

    async getGridRecordValue(columnHeader: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnHeader, this.selectors.gridGuid);
    }

    async isRecordPresent(record: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(record, this.selectors.gridGuid);
    }
}

export default new ManageTaskBlade();