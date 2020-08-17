import { $, by, element, ElementFinder } from "protractor";

class TaskTemplatePreview {

    selectors = {
        fieldLabels: '.clearfix label',
        taskTemplateTitle: '[rx-view-component-id="227ba62e-b3ee-4f84-958c-7d2c7f2d2be3"] span',
        taskTemplateSummary: '[rx-view-component-id="a790b9d4-46d5-408c-8f86-4e04a683bc3d"] div',
        taskType: '[rx-view-component-id="d7598602-1dce-4cf8-af9b-b0083df0e721"] div',
        priority: '[rx-view-component-id="f4a0b2ba-433c-471f-89b1-e94d0c0f3b43"] .read-only-content',
        taskCompany: '[rx-view-component-id="44e56c5d-b8d5-4f23-b4b6-da4d8baa43e9"] .read-only-content',
        assigneeName: '[rx-view-component-id="67c57532-6ca8-4e44-b6b1-244e872c2b70"] .person-name a',
        assignedGroup: '[rx-view-component-id="b3d6e7a4-e712-4947-9d9d-42e7bfdee7a7"] .read-only-content',
        assignedCompany: '[rx-view-component-id="0904d5b9-4e0f-4983-a658-3b8f96affb46"] .read-only-content',
        taskDescription: '[rx-view-component-id="f663f6d7-ef45-4170-9dda-6ca2459fad08"] .collapse-block div'
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

    async istTaskTemplateTitleDisplayed(taskTemplateTitle: string): Promise<boolean> {
        let taskTemplateTitleElement = await element(by.cssContainingText(this.selectors.taskTemplateTitle, taskTemplateTitle));
        return await this.isElementDisplayed(taskTemplateTitleElement);
    }

    async isTaskTemplateSummaryDisplayed(taskSummary: string): Promise<boolean> {
        let taskTemplateSummaryElement = await element(by.cssContainingText(this.selectors.taskTemplateSummary, taskSummary));
        return await this.isElementDisplayed(taskTemplateSummaryElement);
    }

    async isTaskTypeDisplayed(taskType: string): Promise<boolean> {
        let taskTypeDisplayIdElement = await element(by.cssContainingText(this.selectors.taskType, taskType));
        return await this.isElementDisplayed(taskTypeDisplayIdElement);
    }

    async isPriorityValueDisplayed(priority: string): Promise<boolean> {
        let priorityValueElement = await element(by.cssContainingText(this.selectors.priority, priority));
        return await this.isElementDisplayed(priorityValueElement);
    }

    async isTaskCompanyValueDisplayed(taskCompany: string): Promise<boolean> {
        let taskCompanyValueElement = await element(by.cssContainingText(this.selectors.taskCompany, taskCompany));
        return await this.isElementDisplayed(taskCompanyValueElement);
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

    async isTaskTemplateDescriptionDisplayed(taskDescription: string): Promise<boolean> {
        let taskDescriptionElement = await element(by.cssContainingText(this.selectors.taskDescription, taskDescription));
        return await this.isElementDisplayed(taskDescriptionElement);
    }
}
export default new TaskTemplatePreview();