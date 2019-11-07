import { ProtractorExpectedConditions, protractor, browser, element, by, $, $$, WebElement, ElementFinder } from "protractor"
import { GridOperation } from '../grid.po';

class CaseEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    taskTemplateGrid: GridOperation;
    constructor() {
      this.taskTemplateGrid = new GridOperation();
    }
    
    selectors = {
        editLink: '.edit-link',
        changeAssignment: '[rx-view-component-id="459e6f41-abd3-4726-8dc2-25bab758877f"] button',
        assignmentDropDownList: '.rx-assignment_modal_filters .rx-assignment-select',
        selectOptions: '.options-box .options li',
        searchAsignee: '.d-icon-search input',
        assignee: '.rx-assignment-person-fullName',
        assignButton: '.rx-assignment-modal-footer button.d-button_primary',
        saveCaseButton: '[rx-view-component-id="518308c0-34ea-4e75-a3a8-b4b07fc91de9"] button',
        statusChange: '[rx-view-component-id="48bbcbbf-564c-4d46-8dc2-1e7670c187ff"] .status-transition',
        statusDropDown: '[rx-view-component-id="3c8d9278-fc1f-430c-b866-cdc9d217318b"]',
        statusChangeReason: '[rx-view-component-id="049c43a1-4cbd-482d-980d-5db4ed78f295"]',
        saveUpdateStatus: '[rx-view-component-id="ee5dd503-a10e-4d22-9ac5-99c400892bb7"] button',
        addTaskButton: '[rx-view-component-id="db1c57fc-c332-40fa-b1c0-759e21d9ad5c"] button',
        addTaskFromTemplateButton: '[rx-view-component-id="d02d64d8-5a76-4cdc-8263-1d45b2da4dd1"] button',
        taskTemplateGridId: "da1ffbb0-567a-4199-b94f-413bee7f149b",
        templateGridSaveButton: '[rx-view-component-id="b7f9f666-5c22-463a-bc86-4cb66e26fa35"] button',
        taskFromManageTasks: '[draggable] a',
        taskStatusChange: '[rx-view-component-id="1437179f-34be-4cb3-8f85-cf0ac6a83394"] .status-transition',
        taskStatusDropDown: '[rx-view-component-id="8b4cef48-0a4c-4ec1-bc4c-cce47179c964"]',
        taskStatusChangeReason: '[rx-view-component-id="baf69b56-c37b-4a0b-9e68-f18558738ebb"]',
        saveUpdateTaskStatus: '[rx-view-component-id="6759ba60-df0d-4d5e-8eb9-5101490fd4d4"] button',
        viewCaseLink: '[rx-view-component-id="036a7325-43e3-47e6-bb50-7f8d9fe8d118"] button',
    }

    async clickEditCaseButton(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.editLink)));
        await $(this.selectors.editLink).click();
    }

    async clickChangeAssignmentButton(): Promise<void> {
        await $(this.selectors.changeAssignment).click();
    }

    async selectSupportGroup(supportGroup:string): Promise<void> {
        const lastDropDown = $$(this.selectors.assignmentDropDownList).last();
        await browser.wait(this.EC.elementToBeClickable(lastDropDown.$('button')));
        await lastDropDown.$('button').click();
        await browser.wait(this.EC.visibilityOf(lastDropDown.$('input')));
        await lastDropDown.$('input').sendKeys(supportGroup);
        await browser.wait(this.EC.or(async ()=>{
            let count = await lastDropDown.$$(this.selectors.selectOptions).count();
            return count == 1;
        }))
        expect(lastDropDown.$$(this.selectors.selectOptions).first().getText()).toBe(supportGroup);
        await lastDropDown.$$(this.selectors.selectOptions).first().click();
    }

    async selectAssignee(name:string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchAsignee)));
        await $(this.selectors.searchAsignee).sendKeys(name);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        await browser.wait(this.EC.or(async ()=>{
            let count = await $$(this.selectors.assignee).count();
            return count >= 2;
        }))
        await element(by.cssContainingText(this.selectors.assignee, name)).click();
    }

    async clickAssignButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignButton)));
        await $(this.selectors.assignButton).click();
    }

    async clickSaveCase(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveCaseButton)));
        await $(this.selectors.saveCaseButton).click();
    }

    async verifyCaseAssignee(name:string): Promise<void> {
        expect(await browser.wait(this.EC.visibilityOf($(`a[title="${name}"]`))));
    }

    async changeCaseStatus(statusValue:string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        const statusUpdate = $(this.selectors.statusDropDown);
        await browser.wait(this.EC.elementToBeClickable(statusUpdate.$('[aria-label="Status activate"]')));
        await (statusUpdate.$('[aria-label="Status activate"]')).click();
        await element(by.cssContainingText(this.selectors.statusDropDown+' .ui-select__rx-choice', statusValue)).click();
    }

    async setStatusReason(statusValue:string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChangeReason)));
        await $(this.selectors.statusChange).click();
        const statusReason = $(this.selectors.statusChangeReason);
        await browser.wait(this.EC.elementToBeClickable(statusReason.$('[aria-label="Select box activate"]')));
        await (statusReason.$('[aria-label="Select box activate"]')).click();
        await element(by.cssContainingText(this.selectors.statusChangeReason+' .ui-select__rx-choice', statusValue)).click();
    }

    async clickSaveStatus(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveUpdateStatus)));
        await $(this.selectors.saveUpdateStatus).click();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLink)));
    }

    async clickAddTaskButton() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addTaskButton)));
        await $(this.selectors.addTaskButton).click();
    }

    async addTaskFromTaskTemplate(templateName: string) {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addTaskFromTemplateButton)));
        await $(this.selectors.addTaskFromTemplateButton).click();
        await this.taskTemplateGrid.searchAndSelectFirstCheckBox(this.selectors.taskTemplateGridId, templateName);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateGridSaveButton)));
        await $(this.selectors.templateGridSaveButton).click();
    }

    async clickTaskOnManageTasks(taskName:string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.taskFromManageTasks)));
        await element(by.cssContainingText(this.selectors.taskFromManageTasks, taskName)).click();
    }

    async changeTaskStatus(statusValue:string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.taskStatusChange)));
        await $(this.selectors.taskStatusChange).click();
        const statusUpdate = $(this.selectors.taskStatusDropDown);
        await browser.wait(this.EC.elementToBeClickable(statusUpdate.$('[aria-label="Status activate"]')));
        await (statusUpdate.$('[aria-label="Status activate"]')).click();
        await element(by.cssContainingText(this.selectors.taskStatusDropDown+' .ui-select__rx-choice', statusValue)).click();
    }

    async setTaskStatusReason(statusValue:string): Promise<void> {
        const statusUpdate = $(this.selectors.taskStatusChangeReason);
        await browser.wait(this.EC.elementToBeClickable(statusUpdate.$('.ui-select-toggle')));
        await (statusUpdate.$('.ui-select-toggle')).click();
        await browser.wait(this.EC.visibilityOf(element(by.cssContainingText(this.selectors.taskStatusChangeReason+' .ui-select__rx-choice', statusValue))));
        await element(by.cssContainingText(this.selectors.taskStatusChangeReason+' .ui-select__rx-choice', statusValue)).click();
    }

    async clickTaskSaveStatus(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveUpdateTaskStatus)));
        await $(this.selectors.saveUpdateTaskStatus).click();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLink)));
    }

    async clickViewCaseLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.viewCaseLink)));
        await $(this.selectors.viewCaseLink).click();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLink)));
    }
}

export default new CaseEditPage();