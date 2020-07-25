import { $, by, element, ElementFinder } from "protractor";

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


    async isElementDisplayed(element: ElementFinder): Promise<boolean> {
        return await element.isPresent().then(async (link) => {
            if (link) {
                return element.isDisplayed();
            } else return false;
        });
    }

    async isFieldLabelDisplayed(labelName: string): Promise<boolean> {
        let option = await element(by.cssContainingText(this.selectors.fieldLabels, labelName));
        let booleanVal =this.isElementDisplayed(option);
        return booleanVal;
    }

    async isTaskTitleDisplayed(taskSummary: string): Promise<boolean> {
        let option = await element(by.cssContainingText(this.selectors.taskTitle, taskSummary));
        let booleanVal =this.isElementDisplayed(option);
        return booleanVal;
    }

    async isTaskSummaryDisplayed(taskSummary: string): Promise<boolean> {
        let option = await element(by.cssContainingText(this.selectors.taskSummary, taskSummary));
        let booleanVal =this.isElementDisplayed(option);
        return booleanVal;
    }

    async isTaskIdDisplayed(taskId: string): Promise<boolean> {
        let option = await element(by.cssContainingText(this.selectors.taskIdOrPriorityLabel, taskId));
        let booleanVal =this.isElementDisplayed(option);
        return booleanVal;
    }

    async isTaskPriorityLabelDisplayed(taskPriority: string): Promise<boolean> {
        let option = await element(by.cssContainingText(this.selectors.taskIdOrPriorityLabel, taskPriority));
        let booleanVal =this.isElementDisplayed(option);
        return booleanVal;
    }

    async isPriorityValueDisplayed(taskPriority: string): Promise<boolean> {
        let option = await element(by.cssContainingText(this.selectors.priority, taskPriority));
        let booleanVal =this.isElementDisplayed(option);
        return booleanVal;
    }

    async isTaskStatusDisplayed(taskStatus: string): Promise<boolean> {
        let option = await element(by.cssContainingText(this.selectors.taskStatus, taskStatus));
        let booleanVal =this.isElementDisplayed(option);
        return booleanVal;
    }

    async isAssigneeNameDisplayed(assigneeName: string): Promise<boolean> {
        let option = await element(by.cssContainingText(this.selectors.assigneeName, assigneeName));
        let booleanVal =this.isElementDisplayed(option);
        return booleanVal;
    }

    async isAassignedGroupValueDisplayed(assignedGroupVal: string): Promise<boolean> {
        let option = await element(by.cssContainingText(this.selectors.assignedGroup, assignedGroupVal));
        let booleanVal =this.isElementDisplayed(option);
        return booleanVal;
    }

    async isAssignedCompanyValueDisplayed(assignedCompanyVal: string): Promise<boolean> {
        let option = await element(by.cssContainingText(this.selectors.assignedCompany, assignedCompanyVal));
        let booleanVal =this.isElementDisplayed(option);
        return booleanVal;
    }

    async clickGotoTaskButton(): Promise<void> {
        await $(this.selectors.gotoTaskButton).click();
    }

    async isTaskDescriptionDisplayed(taskDescription: string): Promise<boolean> {
        let option = await element(by.cssContainingText(this.selectors.taskDescription, taskDescription));
        let booleanVal =this.isElementDisplayed(option);
        return booleanVal;
    }

}
export default new TaskPreview();