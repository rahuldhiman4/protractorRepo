import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import ckeditorValidationPo from '../../../pageobject/common/ck-editor/ckeditor-validation.po';
import utilityCommon from "../../../utils/utility.common";

class ViewTaskTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        manageDynamicField: '[rx-view-component-id="60aedaf2-92a3-433f-8024-34e26e71350c"] button',
        dynamicFieldTitle: '.simple-field .d-textfield__item',
        processnameValue: '[rx-view-component-id="5e792424-a4d7-4235-8715-be24149be51b"] .read-only-content',
        copyTaskButton: '[rx-view-component-id="e2ec0e87-e65d-4926-9efc-25e3ad329e52"] button',
        templateName: '[rx-view-component-id="72010a6d-c0d7-433a-ab9d-3203fb373518"] span',
        templateStatus: '[rx-view-component-id="d8b9ff29-11a1-406c-b746-81ac9491ce23"] .read-only-content',
        summaryValue: '[rx-view-component-id="80087f51-1b1f-4b47-9fde-36aed981db13"] .read-only-content',
        taskTypeValue: '[rx-view-component-id="27f3842f-613a-4439-a29c-bedd51b0eecd"] .read-only-content',
        taskDescriptionValue: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] .contents ',
        taskCompanyValue: '[rx-view-component-id="2717de6b-2e4e-47d2-a39e-b5ade14ea3e9"] .read-only-content',
        categoryTier1Value: '[rx-view-component-id="636d53eb-5cf3-4fbd-9af4-e258cf3424c2"] .read-only-content',
        categoryTier2Value: '[rx-view-component-id="a52e2f89-e120-442c-8df4-e466cafeb657"] .read-only-content',
        categoryTier3Value: '[rx-view-component-id="9529c556-08ef-4e5d-aa41-57db84d3e416"] .read-only-content',
        categoryTier4Value: '[rx-view-component-id="965bc2ec-34c6-43ae-8636-68f904c58ea7"] .read-only-content',
        editProcessLink: '[rx-view-component-id="bb9a3cc7-a8e9-4291-a447-f3a5c33afd1e"] button',
        ownerCompanyValue: '[rx-view-component-id="37dd629c-6d13-4e6d-b70e-90b91dd5b484"] .read-only-content',
        ownerGroupValue: '[rx-view-component-id="f02e4c7b-93f9-4b35-af23-f522d56daa4b"] .read-only-content',
        buisnessunitValue: '[rx-view-component-id="787a1a66-06fc-4e1c-8bf4-172c32be397d"] .read-only-content',
        departmentValue: '[rx-view-component-id="03314749-1da7-4741-8b0d-8296933e966f"] p',
        label: '[rx-view-component-id="14236a56-7a89-438b-9535-d2edca70d44c"] .read-only-content',
        editLink: '[rx-view-component-id="0ff4dfc7-09f3-4d12-bc32-5c9426f6cc6c"] .justify-content-end button',
        taskTemplateId: '[rx-view-component-id="5109350d-c09f-49ae-85b3-fbc5280fd4e4"] .text-field',
        taskSummaryGuid: '80087f51-1b1f-4b47-9fde-36aed981db13',
        taskTypeGuid: '27f3842f-613a-4439-a29c-bedd51b0eecd',
        taskCompanyGuid: '2717de6b-2e4e-47d2-a39e-b5ade14ea3e9',
        taskCategoryTier1Guid: '636d53eb-5cf3-4fbd-9af4-e258cf3424c2',
        taskCategoryTier2Guid: 'a52e2f89-e120-442c-8df4-e466cafeb657',
        taskCategoryTier3Guid: '9529c556-08ef-4e5d-aa41-57db84d3e416',
        taskCategoryTier4Guid: '965bc2ec-34c6-43ae-8636-68f904c58ea7',
        taskLabelGuid: 'bae4bb58-1146-4f96-a695-543deecc5cc1',
        taskProcessGuid: '5e792424-a4d7-4235-8715-be24149be51b',
        templateStatusGuid: 'd8b9ff29-11a1-406c-b746-81ac9491ce23',
        ownerCompanyGuid: '37dd629c-6d13-4e6d-b70e-90b91dd5b484',
        ownerGroupGuid: 'f02e4c7b-93f9-4b35-af23-f522d56daa4b',
        taskDescriptionGuid: 'cce67ce7-e6a5-4ed6-aa50-c57ea75d2854',
        supportGroupGuid: 'fd172dbd-f8b0-4985-8905-4f07be498a0b',
        assigneeGuid: 'fd172dbd-f8b0-4985-8905-4f07be498a0b',
        dynamicField: '[rx-view-component-id="60aedaf2-92a3-433f-8024-34e26e71350c"] .d-textfield__item',
        assigneeNameValue: '[rx-view-component-id="fd172dbd-f8b0-4985-8905-4f07be498a0b"] .person-main a',
        assigneeBusinessUnitValue: '[rx-view-component-id="fd172dbd-f8b0-4985-8905-4f07be498a0b"] .read-only-content',
        assigneeDepartmentValue: '[rx-view-component-id="ea7695f8-ebd3-41e6-b85f-ebd800e9c913"] p',
        editMetaData: '[rx-view-component-id="8b8bfec6-0ee2-42a3-be4b-ac4f37d060f1"] button',
        priorityValue: '[rx-view-component-id="5109350d-c09f-49ae-85b3-fbc5280fd4e4"] .selection-field',
        showMoreDescriptionLink: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] button',
        backArrowButton: '[rx-view-component-id="ae1743d3-c8e3-47f7-b257-fba698a2e6e0"] button',
        lobValue: '[rx-view-component-id="7f7b8d48-4df2-4607-aece-7bc65443dd6d"] div.read-only-content'
    }

    async getDynamicFieldTitle(): Promise<string> {
        return await $$(this.selectors.dynamicFieldTitle).last().getText();
    }

    async isGroupDisplayed(groupName: string): Promise<boolean> {
        return await $(`[rx-view-component-id="60aedaf2-92a3-433f-8024-34e26e71350c"] .group-container__name div[title=${groupName}]`).isDisplayed();
    }

    async isDynamicFieldPresent(dynamic: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.dynamicField, dynamic)).isPresent().then(async (result) => {
            if (result) {
                return await element(by.cssContainingText(this.selectors.dynamicField, dynamic)).getText() == dynamic ? true : false;
            } else {
                console.log("dynamic data not present");
                return false;
            }
        });
    }

    async clickOnManageDynamicFieldLink(): Promise<void> {
        await $$(this.selectors.manageDynamicField).last().click();
    }

    async isManageDynamicFieldLinkDisplayed(): Promise<boolean> {
        return await $(this.selectors.manageDynamicField).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.manageDynamicField).getText() ? true : false;
            } else {
                console.log("Managelink not present");
                return false;
            }
        });
    }

    async getOwnerCompanyValue(): Promise<string> {
        return await $$(this.selectors.ownerCompanyValue).last().getText();
    }

    async getBuisnessunitValue(): Promise<string> {
        return await $$(this.selectors.buisnessunitValue).last().getText();
    }

    async getDepartmentValue(): Promise<string> {
        return await $$(this.selectors.departmentValue).last().getText();
    }

    async getLabelValue(): Promise<string> {
        return await $$(this.selectors.label).last().getText();
    }

    async getOwnerGroupValue(): Promise<string> {
        return await $$(this.selectors.ownerGroupValue).last().getText();
    }

    async getProcessNameValue(): Promise<string> {
        return await $$(this.selectors.processnameValue).last().getText();
    }

    async getTemplateName(): Promise<string> {
        return await $$(this.selectors.templateName).last().getText();
    }

    async getTemplateStatus(): Promise<string> {
        return await $$(this.selectors.templateStatus).last().getText();
    }

    async clickOnCopyTemplate(): Promise<void> {
        await $('[rx-view-component-id="242a48e1-2a6c-4244-8d02-66f6d22597ee"] .dropdown').isPresent().then(async (present) => {
            if (present) await $('[rx-view-component-id="242a48e1-2a6c-4244-8d02-66f6d22597ee"] .dropdown').click();
        });
        await $$(this.selectors.copyTaskButton).last().click();
    }

    async clickOnEditProcessLink(): Promise<void> {
        await $(this.selectors.editProcessLink).click();
    }

    async isEditProcessLinkDisplayed(): Promise<boolean> {
        return await $(this.selectors.editProcessLink).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.editProcessLink).getText() ? true : false;
            } else {
                console.log("Flowset not present");
                return false;
            }
        });
    }

    async clickOnEditLink(): Promise<void> {
        await $(this.selectors.editLink).click();
    }

    async getSummaryValue(): Promise<string> {
        return await $$(this.selectors.summaryValue).last().getText();
    }

    async getTaskTypeValue(): Promise<string> {
        return await $$(this.selectors.taskTypeValue).last().getText();
    }

    async getTaskDescriptionNameValue(): Promise<string> {
        return await $$(this.selectors.taskDescriptionValue).last().getText();
    }

    async getTaskCompanyNameValue(): Promise<string> {
        return await $$(this.selectors.taskCompanyValue).last().getText();
    }

    async getTaskTemplateId(): Promise<string> {
        return await $$(this.selectors.taskTemplateId).last().getText();
    }

    async getCategoryTier1Value(): Promise<string> {
        return await $$(this.selectors.categoryTier1Value).last().getText();
    }

    async getCategoryTier2Value(): Promise<string> {
        return await $$(this.selectors.categoryTier2Value).last().getText();
    }

    async getCategoryTier3Value(): Promise<string> {
        return await $$(this.selectors.categoryTier3Value).last().getText();
    }

    async getCategoryTier4Value(): Promise<string> {
        return await $$(this.selectors.categoryTier4Value).last().getText();
    }

    async isTaskSummaryTitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskSummaryGuid, input);
    }

    async isTaskTypeTitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskTypeGuid, input);
    }

    async isTaskCompanyTitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskCompanyGuid, input);
    }

    async isTaskCategoryTier1TitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier1Guid, input);
    }

    async isTaskCategoryTier2TitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier2Guid, input);
    }

    async isTaskCategoryTier3TitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier3Guid, input);
    }

    async isTaskCategoryTier4TitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier4Guid, input);
    }

    async isTaskLabelTitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskLabelGuid, input);
    }

    async isTaskProcessTitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskProcessGuid, input);
    }

    async isTaskDescriptionTitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.taskDescriptionGuid, input);
    }

    async isTemplateStatusTitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.templateStatusGuid, input);
    }

    async isOwnerCompanyTitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.ownerCompanyGuid, input);
    }

    async isOwnerGroupTitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.ownerGroupGuid, input);
    }

    async isAssigneeTitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.assigneeGuid, input);
    }

    async isSupportGuidTitlePresent(input: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.supportGroupGuid, input);
    }

    async isEditButtonPresent(): Promise<boolean> {
        return await $(this.selectors.editLink).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.editLink).isDisplayed();
            } else {
                console.log("editLink not present");
                return false;
            }
        });;
    }

    async getAssigneeText(): Promise<string> {
        return await $(this.selectors.assigneeNameValue).getText();
    }

    async getAssigneeBusinessUnitValue(): Promise<string> {
        return await $(this.selectors.assigneeBusinessUnitValue).getText();
    }

    async getAssigneeDepartmentValue(): Promise<string> {
        return await $(this.selectors.assigneeDepartmentValue).getText();
    }

    async clickOnEditMetaData(): Promise<void> {
        await $(this.selectors.editMetaData).click();
    }

    async getPriorityValue(): Promise<string> {
        return await $(this.selectors.priorityValue).getText();
    }

    async clickShowMoreDescriptionLink(): Promise<void> {
        return await $$(this.selectors.showMoreDescriptionLink).last().click();
    }

    async isColorTextDisplayed(value: string): Promise<boolean> {
        return await ckeditorValidationPo.isColorTextDisplayed(value, this.selectors.taskDescriptionGuid);
    }

    async isImageDisplayed(value: string): Promise<boolean> {
        return await ckeditorValidationPo.isImageDisplayed(value, this.selectors.taskDescriptionGuid);
    }

    async isFormatedTextDisplayed(value: string, tagName: string): Promise<boolean> {
        return await ckeditorValidationPo.isFormatedTextDisplayed(value, tagName, this.selectors.taskDescriptionGuid);
    }

    async getColorFontStyleOfText(value: string): Promise<string> {
        return await ckeditorValidationPo.getColorFontStyleOfText(value, this.selectors.taskDescriptionGuid);
    }

    async isItalicTextDisplayed(value: string): Promise<boolean> {
        return await ckeditorValidationPo.isItalicTextDisplayed(value, this.selectors.taskDescriptionGuid);
    }

    async isBoldTextDisplayed(value: string): Promise<boolean> {
        return await ckeditorValidationPo.isBoldTextDisplayed(value, this.selectors.taskDescriptionGuid);
    }

    async isUnderLineTextDisplayed(value: string): Promise<boolean> {
        return await ckeditorValidationPo.isUnderLineTextDisplayed(value, this.selectors.taskDescriptionGuid);
    }

    async isLinkDisplayedInCKE(value: string): Promise<boolean> {
        return await $(`[rx-view-component-id="${this.selectors.taskDescriptionGuid}"] [href="${value}"]`).isDisplayed();
    }

    async getTableCellAlignText(value: string): Promise<string> {
        return await ckeditorValidationPo.getTableCellAlignText(value, this.selectors.taskDescriptionGuid);
    }

    async isCopyTaskButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.copyTaskButton).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.copyTaskButton).isDisplayed();
            else return false;
        });
    }

    async clickBackArrowBtn(): Promise<void> {
        let backArrow = await $$(this.selectors.backArrowButton).count();
        for (let i = 0; i < backArrow; i++) {
            await $$(this.selectors.backArrowButton).last().click();
        }
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new ViewTaskTemplate();