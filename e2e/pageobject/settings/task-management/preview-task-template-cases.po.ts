import { $, protractor, ProtractorExpectedConditions, $$ } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class PreviewTaskTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        taskummary: '[rx-view-component-id="a790b9d4-46d5-408c-8f86-4e04a683bc3d"] span',
        taskSummaryValue: '[rx-view-component-id="a790b9d4-46d5-408c-8f86-4e04a683bc3d"] div.read-only-content',
        taskTemplateName: '[rx-view-component-id="227ba62e-b3ee-4f84-958c-7d2c7f2d2be3"] span',
        taskCompany: '44e56c5d-b8d5-4f23-b4b6-da4d8baa43e9',
        taskCompanyValue: '[rx-view-component-id="44e56c5d-b8d5-4f23-b4b6-da4d8baa43e9"] .d-textfield__rx-value',
        taskPriority: 'f4a0b2ba-433c-471f-89b1-e94d0c0f3b43',
        taskPriorityValue: '[rx-view-component-id="f4a0b2ba-433c-471f-89b1-e94d0c0f3b43"] .d-textfield__rx-value',
        taskSummary: 'a790b9d4-46d5-408c-8f86-4e04a683bc3d',
        taskCategoryTier1: '516cbfcd-dda1-4d15-8508-4e90f7699846',
        taskCategoryTier2: 'ffb8c92f-ff09-41b2-8bd3-fff86c983416',
        taskCategoryTier3: '56354504-a395-4c39-b2ee-c1d937c57349',
        taskCategoryTier4: '9df7b305-6be0-4f50-8c2f-88a61ed85cb4',
        taskType: 'd7598602-1dce-4cf8-af9b-b0083df0e721',
        taskTypeValue: '[rx-view-component-id="d7598602-1dce-4cf8-af9b-b0083df0e721"] .d-textfield__rx-value',
        label: 'ef679736-6aaf-4b21-867a-307e154464d8',
        taskDescription: 'f663f6d7-ef45-4170-9dda-6ca2459fad08',
        processName: 'f79145f8-5b9f-4ef5-b573-7920752f860a',
        backButton: '[rx-view-component-id="cbb794a3-d696-4fff-81df-27e73e1438d8"] button',
        getTaskCategoryTier4: '[rx-view-component-id="9df7b305-6be0-4f50-8c2f-88a61ed85cb4"] p',
        dynamicFieldName: '[rx-view-component-id="ef229a94-f3fe-490c-904f-257d06d69194"] span',
    }

    async clickOnBackButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.backButton)));
        await $(this.selectors.backButton).click();
    }

    async getTaskCategoryTier4(): Promise<string> {
        return await $(this.selectors.getTaskCategoryTier4).getText();
    }

    async getTaskTemplateName(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.taskTemplateName)));
        return await $(this.selectors.taskTemplateName).getText();
    }

    async getTaskSummary(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.taskSummaryValue)));
        return await $(this.selectors.taskSummaryValue).getText();
    }

    async getTaskCompany(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.taskCompanyValue)));
        return await $(this.selectors.taskCompanyValue).getText();
    }

    async getTaskType(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.taskTypeValue)));
        return await $(this.selectors.taskTypeValue).getText();
    }

    async getTaskPriority(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.taskPriorityValue)));
        return await $(this.selectors.taskPriorityValue).getText();
    }

    async isTaskSummaryTitleDisplayed(taskSummary: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.taskummary)));
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskCompany, taskSummary);
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
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.label, label);
    }

    async isTaskDescriptionTitleDisplayed(taskDescription: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskDescription, taskDescription);
    }

    async isProcessNameTitleDisplayed(processName: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.processName, processName);
    }

    async isDynamicGroupDisplayed(groupName: string): Promise<boolean> {
        return await $(`[rx-view-component-id="ef229a94-f3fe-490c-904f-257d06d69194"] .group-container__name__title[title=${groupName}]}`).isDisplayed(); 
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

}

export default new PreviewTaskTemplateBlade();