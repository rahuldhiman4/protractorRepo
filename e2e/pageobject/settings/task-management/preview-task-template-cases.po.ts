import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class PreviewTaskTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        taskummary: '[rx-view-component-id="a790b9d4-46d5-408c-8f86-4e04a683bc3d"] span',
        taskSummaryValue: '[rx-view-component-id="a790b9d4-46d5-408c-8f86-4e04a683bc3d"] p',
        taskTemplateName: '[rx-view-component-id="227ba62e-b3ee-4f84-958c-7d2c7f2d2be3"] span',
        taskCompany: '44e56c5d-b8d5-4f23-b4b6-da4d8baa43e9',
        taskCompanyValue: '[rx-view-component-id="44e56c5d-b8d5-4f23-b4b6-da4d8baa43e9"] .d-textfield__rx-value',
        taskPriority: 'f4a0b2ba-433c-471f-89b1-e94d0c0f3b43',
        taskPriorityValue: '[rx-view-component-id="f4a0b2ba-433c-471f-89b1-e94d0c0f3b43"] .d-textfield__rx-value',
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

    }

    async clickOnBackButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.backButton)));
        await $(this.selectors.backButton).click();
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

    async isTaskSummaryTitleDisplayed(): Promise<boolean> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.taskummary)));
        return await $(this.selectors.taskummary).isDisplayed();
    }

    async isTaskCompanyTitleDisplayed(taskCompany:string): Promise<boolean> {
       return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCompany,taskCompany);
    }

    async isTaskPriorityTitleDisplayed(taskPriority:string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskPriority,taskPriority);
    }

    async isTaskCategoryTier1TitleDisplayed(taskCategoryTier1:string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier1,taskCategoryTier1);
    }

    async isTaskCategoryTier2TitleDisplayed(taskCategoryTier2:string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier2,taskCategoryTier2);
    }

    async isTaskCategoryTier3TitleDisplayed(taskCategoryTier3:string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier3,taskCategoryTier3);
    }

    async isTaskCategoryTier4TitleDisplayed(taskCategoryTier4:string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier4,taskCategoryTier4);
    }

    async isTaskTypeTitleDisplayed(taskType:string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskType,taskType);
    }

    async isLabelTitleDisplayed(label:string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.label,label);
    }

    async isTaskDescriptionTitleDisplayed(taskDescription:string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskDescription,taskDescription);
    }

    async isProcessNameTitleDisplayed(processName:string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.processName,processName);
    }
}

export default new PreviewTaskTemplateBlade();