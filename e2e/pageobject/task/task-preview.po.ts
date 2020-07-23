import { $, by, element } from "protractor";

class TaskPreview {

    selectors = {
        fieldLabels: '.clearfix label',
        taskTitle: '[rx-view-component-id="0c1ccde9-2843-4814-8596-ed3b69867802"] span',
        taskSummary: '[rx-view-component-id="225ec53c-57da-40ed-a6c6-eeb4295f7240"] .focusable div',
        taskIdOrPriorityLabel: '[rx-view-component-id="dee7b1d7-5381-42af-a7c5-f975a5a9dac7"] .bwf-info-bar div',
        taskStatus: '.status-transition span',
        priority: '[rx-view-component-id="e417b17e-4cc4-4f36-85e4-fb2420eb1fee"] div',
        assigneeName: '[rx-view-component-id="ac4d2a47-868b-4545-b42b-0626004a3051"] .person-name a',
        assignedGroup: '[rx-view-component-id="4fbc8956-6c5b-4074-95dd-c946dd7913d4"] .read-only-content',
        assignedCompany: '[rx-view-component-id="38b5060b-199d-4641-ac03-102b5ee93701"] .read-only-content',
        gotoTaskButton: '[rx-view-component-id="f617e99e-45fa-4b54-9bc7-6d0595c74923"] button',
        taskDescription: '[rx-view-component-id="ddbcb40a-5a36-4936-a627-51833b951d59"] .collapse-block div'
    }

    async isFieldLabelDisplayed(labelName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.fieldLabels, labelName)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.fieldLabels, labelName)).isDisplayed();
            } else return false;
        });
    }

    async isTaskTitleDisplayed(taskSummary: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.taskTitle, taskSummary)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.taskTitle, taskSummary)).isDisplayed();
            } else return false;
        });
    }

    async isTaskSummaryDisplayed(taskSummary: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.taskTitle, taskSummary)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.taskTitle, taskSummary)).isDisplayed();
            } else return false;
        });
    }

    async isTaskIdDisplayed(taskId: string): Promise<boolean> {
        return await element.all(by.cssContainingText(this.selectors.taskIdOrPriorityLabel, taskId)).get(0).isPresent().then(async (link) => {
            if (link) {
                return await element.all(by.cssContainingText(this.selectors.taskIdOrPriorityLabel, taskId)).get(0).isDisplayed();
            } else return false;
        });
    }

    async isTaskPriorityLabelDisplayed(taskPriority: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.taskIdOrPriorityLabel, taskPriority)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.taskIdOrPriorityLabel, taskPriority)).isDisplayed();
            } else return false;
        });
    }

    async isPriorityValueDisplayed(taskPriority: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.priority, taskPriority)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.priority, taskPriority)).isDisplayed();
            } else return false;
        });
    }

    async isTaskStatusDisplayed(taskStatus: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.taskStatus, taskStatus)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.taskStatus, taskStatus)).isDisplayed();
            } else return false;
        });
    }

    async isAssigneeNameDisplayed(assigneeName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.assigneeName, assigneeName)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.assigneeName, assigneeName)).isDisplayed();
            } else return false;
        });
    }

    async isAassignedGroupValueDisplayed(assignedGroupVal: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.assignedGroup, assignedGroupVal)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.assignedGroup, assignedGroupVal)).isDisplayed();
            } else return false;
        });
    }

    async isAssignedCompanyValueDisplayed(assignedCompanyVal: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.assignedCompany, assignedCompanyVal)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.assignedCompany, assignedCompanyVal)).isDisplayed();
            } else return false;
        });
    }

    async clickGotoTaskButton(): Promise<void> {
        await $(this.selectors.gotoTaskButton).click();
    }

    async isTaskDescriptionDisplayed(taskDescription: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.taskDescription, taskDescription)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.taskDescription, taskDescription)).isDisplayed();
            } else return false;
        });
    }

}
export default new TaskPreview();