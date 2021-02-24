import { $, by, element, ElementFinder } from "protractor";

class TaskPreview {

    selectors = {
        fieldLabels: '.clearfix label',
        taskTitle: '[rx-view-component-id="0c1ccde9-2843-4814-8596-ed3b69867802"] span',
        taskSummary: '[rx-view-component-id="225ec53c-57da-40ed-a6c6-eeb4295f7240"] .focusable div',
        taskIdOrPriorityLabel: '[rx-view-component-id="dee7b1d7-5381-42af-a7c5-f975a5a9dac7"] .bwf-info-bar div',
        taskStatus: '.status-transition span',
        priority: '[rx-view-component-id="e417b17e-4cc4-4f36-85e4-fb2420eb1fee"] div',
        assigneeName: '[rx-view-component-id="3187fbb2-3e83-459e-a37c-3d1f6a0712c4"] .person-name',
        assignedGroup: '[rx-view-component-id="3187fbb2-3e83-459e-a37c-3d1f6a0712c4"] .read-only-content',
        assignedCompany: '[rx-view-component-id="38b5060b-199d-4641-ac03-102b5ee93701"] .read-only-content',
        gotoTaskButton: '[rx-view-component-id="f617e99e-45fa-4b54-9bc7-6d0595c74923"] button',
        taskDescription: '[rx-view-component-id="ddbcb40a-5a36-4936-a627-51833b951d59"] .collapse-block div'
    }

    async isElementDisplayed(element: ElementFinder): Promise<boolean> {
        return await element.isPresent().then(async (link) => {
            if (link) {
                return await element.isDisplayed();
            } else return false;
        });
    }

    async isFieldLabelDisplayed(labelName: string): Promise<boolean> {
        let labelElement = await element(by.cssContainingText(this.selectors.fieldLabels, labelName));
        return await this.isElementDisplayed(labelElement);
    }

    async isTaskTitleDisplayed(taskSummary: string): Promise<boolean> {
        let taskTitleElement = await element(by.cssContainingText(this.selectors.taskTitle, taskSummary));
        return await this.isElementDisplayed(taskTitleElement);
    }

    async isTaskSummaryDisplayed(taskSummary: string): Promise<boolean> {
        let taskSummaryElement = await element(by.cssContainingText(this.selectors.taskSummary, taskSummary));
        return await this.isElementDisplayed(taskSummaryElement);
    }

    async isTaskIdDisplayed(taskId: string): Promise<boolean> {
        let taskDisplayIdElement = await element(by.cssContainingText(this.selectors.taskIdOrPriorityLabel, taskId));
        return await this.isElementDisplayed(taskDisplayIdElement);
    }

    async isTaskPriorityLabelDisplayed(taskPriority: string): Promise<boolean> {
        let taskPriorityElement = await element(by.cssContainingText(this.selectors.taskIdOrPriorityLabel, taskPriority));
        return await this.isElementDisplayed(taskPriorityElement);
    }

    async isPriorityValueDisplayed(taskPriority: string): Promise<boolean> {
        let priorityValueElement = await element(by.cssContainingText(this.selectors.priority, taskPriority));
        return await this.isElementDisplayed(priorityValueElement);
    }

    async isTaskStatusDisplayed(taskStatus: string): Promise<boolean> {
        let taskStatusDisplayed = await element(by.cssContainingText(this.selectors.taskStatus, taskStatus));
        return await this.isElementDisplayed(taskStatusDisplayed);
    }

    async isAssigneeNameDisplayed(assigneeName: string): Promise<boolean> {
        let assigneeNameElement = await element(by.cssContainingText(this.selectors.assigneeName, assigneeName));
        return await this.isElementDisplayed(assigneeNameElement);
    }

    async isAassignedGroupValueDisplayed(assignedGroupVal: string): Promise<boolean> {
        let assignedGroupValueElement = await element(by.cssContainingText(this.selectors.assignedGroup, assignedGroupVal));
        return await this.isElementDisplayed(assignedGroupValueElement);
    }

    async isAssignedCompanyValueDisplayed(assignedCompanyVal: string): Promise<boolean> {
        let assignedCompany = await element(by.cssContainingText(this.selectors.assignedCompany, assignedCompanyVal));
        return await this.isElementDisplayed(assignedCompany);
    }

    async clickGotoTaskButton(): Promise<void> {
        await $(this.selectors.gotoTaskButton).click();
    }

    async isTaskDescriptionDisplayed(taskDescription: string): Promise<boolean> {
        let taskDescriptionElement = await element(by.cssContainingText(this.selectors.taskDescription, taskDescription));
        return await this.isElementDisplayed(taskDescriptionElement);
    }
}
export default new TaskPreview();