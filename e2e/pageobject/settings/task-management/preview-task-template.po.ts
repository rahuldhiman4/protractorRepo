import { $, protractor, ProtractorExpectedConditions, $$, browser, element, by } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class PreviewTaskTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        taskummary: '[rx-view-component-id="a790b9d4-46d5-408c-8f86-4e04a683bc3d"] span',
        taskSummaryValue: '[rx-view-component-id="a790b9d4-46d5-408c-8f86-4e04a683bc3d"] div.read-only-content',
        taskTemplateName: '[rx-view-component-id="227ba62e-b3ee-4f84-958c-7d2c7f2d2be3"] span',
        taskCompany: '44e56c5d-b8d5-4f23-b4b6-da4d8baa43e9',
        taskCompanyValue: '[rx-view-component-id="44e56c5d-b8d5-4f23-b4b6-da4d8baa43e9"] label ~ *',
        taskPriority: 'f4a0b2ba-433c-471f-89b1-e94d0c0f3b43',
        taskPriorityValue: '[rx-view-component-id="f4a0b2ba-433c-471f-89b1-e94d0c0f3b43"] label ~ *',
        taskSummary: 'a790b9d4-46d5-408c-8f86-4e04a683bc3d',
        taskCategoryTier1: 'b3c01a87-de23-409d-bbd8-2893ae57594f',
        taskCategoryTier2: '3555d678-bd9f-486a-9f87-d1847478eac1',
        taskCategoryTier3: 'b4e25583-320c-4e46-84db-9adf9cf8701a',
        taskCategoryTier4: 'fee46083-3316-45b8-8600-190e851bee3b',
        taskType: 'd7598602-1dce-4cf8-af9b-b0083df0e721',
        taskTypeValue: '[rx-view-component-id="d7598602-1dce-4cf8-af9b-b0083df0e721"] label ~ *',
        labelGuid:'ef679736-6aaf-4b21-867a-307e154464d8',
        label: "[rx-view-component-id='ef679736-6aaf-4b21-867a-307e154464d8'] label",
        taskDescription: 'f663f6d7-ef45-4170-9dda-6ca2459fad08',
        processName: 'f79145f8-5b9f-4ef5-b573-7920752f860a',
        backButton: '[rx-view-component-id="cbb794a3-d696-4fff-81df-27e73e1438d8"] button',
        getTaskCategoryTier4: '[rx-view-component-id="fee46083-3316-45b8-8600-190e851bee3b"] .read-only-content',
        dynamicFieldName: '[rx-view-component-id="92456067-e396-441c-b1c5-b452bc473991"] span',
        assigneeText: '[rx-view-component-id="1f5a6ff8-d488-4f3d-9de3-5da1512b9438"] .person-link',
        showMoreDescriptionLink:'.bwf-description-read-state button',
        assigneeGuid: '1f5a6ff8-d488-4f3d-9de3-5da1512b9438',
        supportGroupGuid: '1f5a6ff8-d488-4f3d-9de3-5da1512b9438',
        supportCompanyGuid: '1f5a6ff8-d488-4f3d-9de3-5da1512b9438',
        previewBladeGuid: '5ac76d38-6032-4d80-a6bb-1630e59d8cda',
        assigneeFieldValue: '.person-main a'
    }

    async clickShowMoreDescriptionLink():Promise<void>{
        await $(this.selectors.showMoreDescriptionLink).click();
    }

    async clickOnBackButton(): Promise<void> {
        await $(this.selectors.backButton).click();
    }

    async getTaskCategoryTier4(): Promise<string> {
        return await $(this.selectors.getTaskCategoryTier4).getText();
    }

    async getTaskTemplateName(): Promise<string> {
        return await $(this.selectors.taskTemplateName).getText();
    }

    async getTaskSummary(): Promise<string> {
        return await $(this.selectors.taskSummaryValue).getText();
    }

    async getTaskCompany(): Promise<string> {
        return await $(this.selectors.taskCompanyValue).isPresent().then(async (present) => {
            if (present) return await $(this.selectors.taskCompanyValue).getText();
            else return "no company";
        });
    }

    async getTaskType(): Promise<string> {
        return await $(this.selectors.taskTypeValue).getText();
    }

    async getTaskPriority(): Promise<string> {
        return await $(this.selectors.taskPriorityValue).getText();
    }

    async getSupportGroup(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.supportGroupGuid}"] .read-only-content`).getText();
    }

    async getSupportCompany(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.supportCompanyGuid}"] .read-only-content`).getText();
    }

    async getDescription(): Promise<string> {
        return await $$(`[rx-view-component-id="${this.selectors.taskDescription}"] .collapse-block div`).get(2).getText();
    }

    async isTaskSummaryTitleDisplayed(taskSummary: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskSummary, taskSummary);
    }

    async isTaskCompanyTitleDisplayed(taskCompany: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskCompany, taskCompany);
    }

    async isTaskPriorityTitleDisplayed(taskPriority: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskPriority, taskPriority);
    }

    async isTaskCategoryTier1TitleDisplayed(taskCategoryTier1: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier1, taskCategoryTier1);
    }

    async isTaskCategoryTier2TitleDisplayed(taskCategoryTier2: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier2, taskCategoryTier2);
    }

    async isTaskCategoryTier3TitleDisplayed(taskCategoryTier3: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier3, taskCategoryTier3);
    }

    async isTaskCategoryTier4TitleDisplayed(taskCategoryTier4: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier4, taskCategoryTier4);
    }

    async isTaskTypeTitleDisplayed(taskType: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskType, taskType);
    }

    async isLabelTitleDisplayed(label: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.label, label)).isPresent().then(async (result) => {
            if (result){
                return await element(by.cssContainingText(this.selectors.label, label)).isDisplayed();
            }else return false;
        });
    }

    async isTaskDescriptionTitleDisplayed(): Promise<boolean> {
        let taskDescriptionLocator = await element(by.cssContainingText('[rx-view-component-id="f663f6d7-ef45-4170-9dda-6ca2459fad08"] label', 'Task Description'));
        return await taskDescriptionLocator.isPresent().then(async (result) => {
            if(result) return await taskDescriptionLocator.isDisplayed();
            else return false;
        });
    }

    async isAssigneeTitleDisplayed(assignee: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.assigneeGuid, assignee);
    }

    async isSupportGroupTitleDisplayed(supportGroup: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.supportGroupGuid, supportGroup);
    }

    async isSupportCompanyTitleDisplayed(supportCompany: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.supportCompanyGuid, supportCompany);
    }

    async isProcessNameTitleDisplayed(processName: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.processName, processName);
    }

    async isDynamicGroupDisplayed(groupName: string): Promise<boolean> {
        return await $(`[rx-view-component-id="92456067-e396-441c-b1c5-b452bc473991"] .group-container__name__title[title=${groupName}]`).isDisplayed();
    }

    async isDynamicFieldDisplayed(fieldName: string): Promise<boolean> {
        let dynamicFields: number = await $$(this.selectors.dynamicFieldName).count();
        for (let i = 0; i < dynamicFields; i++) {
            let field = await $$(this.selectors.dynamicFieldName).get(i).getText();
            if (fieldName == field) {
                return true;
            }
        }
        return false;
    }

    async getAssigneeText(): Promise<string> {
        return await $(this.selectors.assigneeText).getText();
    }

    async isFieldLabelDisplayed(fieldName: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.previewBladeGuid, fieldName);
    }

    async getAssigneeFieldValue(): Promise<string> {
        return (await $$(this.selectors.assigneeFieldValue).first().getText()).trim();
    }
}

export default new PreviewTaskTemplateBlade();