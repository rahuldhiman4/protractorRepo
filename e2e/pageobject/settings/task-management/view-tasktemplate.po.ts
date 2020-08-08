import utilCommon from '../../../utils/util.common';
import { $, browser, protractor, ProtractorExpectedConditions, element, by, $$ } from "protractor";
import { lstat } from 'fs';
import ckeditorValidationPo from '../../../pageobject/common/ck-editor/ckeditor-validation.po';

class ViewTaskTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        manageDynamicField: '[rx-view-component-id="60aedaf2-92a3-433f-8024-34e26e71350c"] button',
        dynamicFieldTitle: '.simple-field .d-textfield__item',
        processnameValue: '[rx-view-component-id="5e792424-a4d7-4235-8715-be24149be51b"] p',
        copyTaskButton: '[rx-view-component-id="e2ec0e87-e65d-4926-9efc-25e3ad329e52"] button',
        templateName: '[rx-view-component-id="72010a6d-c0d7-433a-ab9d-3203fb373518"] span',
        templateStatus: '[rx-view-component-id="d17d9cf8-a5ac-47de-acae-a4b69e086855"] p',
        summaryValue: '[rx-view-component-id="80087f51-1b1f-4b47-9fde-36aed981db13"] p',
        taskTypeValue: '[rx-view-component-id="27f3842f-613a-4439-a29c-bedd51b0eecd"] p',
        taskDescriptionValue: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] [ux-bind-html]',
        taskCompanyValue: '[rx-view-component-id="2717de6b-2e4e-47d2-a39e-b5ade14ea3e9"] p',
        categoryTier1Value: '[rx-view-component-id="d64a99a4-e878-47b7-86f2-b6dfb7cd4652"] p',
        categoryTier2Value: '[rx-view-component-id="c427cb37-5018-4bc6-b951-46f31a679d93"] p',
        categoryTier3Value: '[rx-view-component-id="118170eb-e94d-4056-9d0b-cb944ff96ebb"] p',
        categoryTier4Value: '[rx-view-component-id="d88c4135-b283-4b9a-9909-80f1e83e6087"] p',
        editProcessLink: '[rx-view-component-id="bb9a3cc7-a8e9-4291-a447-f3a5c33afd1e"] button',
        ownerCompanyValue: '[rx-view-component-id="37dd629c-6d13-4e6d-b70e-90b91dd5b484"] p',
        ownerGroupValue: '[rx-view-component-id="f02e4c7b-93f9-4b35-af23-f522d56daa4b"] p',
        buisnessunitValue: '[rx-view-component-id="787a1a66-06fc-4e1c-8bf4-172c32be397d"] p',
        departmentValue: '[rx-view-component-id="03314749-1da7-4741-8b0d-8296933e966f"] p',
        label: '[rx-view-component-id="bae4bb58-1146-4f96-a695-543deecc5cc1"] p',

        editLink: '[rx-view-component-id="0ff4dfc7-09f3-4d12-bc32-5c9426f6cc6c"] .rx-record-editor-edit',
        taskTemplateId: '.text-field',
        taskSummaryGuid: '80087f51-1b1f-4b47-9fde-36aed981db13',
        taskTypeGuid: '27f3842f-613a-4439-a29c-bedd51b0eecd',
        taskCompanyGuid: '2717de6b-2e4e-47d2-a39e-b5ade14ea3e9',
        taskCategoryTier1Guid: 'd64a99a4-e878-47b7-86f2-b6dfb7cd4652',
        taskCategoryTier2Guid: 'c427cb37-5018-4bc6-b951-46f31a679d93',
        taskCategoryTier3Guid: '118170eb-e94d-4056-9d0b-cb944ff96ebb',
        taskCategoryTier4Guid: 'd88c4135-b283-4b9a-9909-80f1e83e6087',
        taskLabelGuid: 'bae4bb58-1146-4f96-a695-543deecc5cc1',
        taskProcessGuid: '5e792424-a4d7-4235-8715-be24149be51b',
        templateStatusGuid: 'd17d9cf8-a5ac-47de-acae-a4b69e086855',
        ownerCompanyGuid: '37dd629c-6d13-4e6d-b70e-90b91dd5b484',
        ownerGroupGuid: 'f02e4c7b-93f9-4b35-af23-f522d56daa4b',
        taskDescriptonGuid: 'cce67ce7-e6a5-4ed6-aa50-c57ea75d2854',
        supportGroupGuid: '244607b3-1fd7-490c-975b-7640a6b2c615',
        assigneeGuid: 'bb18eb5c-ba9c-47e1-8593-cd79aefac190',
        dynamicField: '[rx-view-component-id="7ac78e56-c471-4e50-bca8-53568ad6e4af"] label span',
        assigneeNameValue: '[rx-view-component-id="bb18eb5c-ba9c-47e1-8593-cd79aefac190"] .person-main a',
        assigneeBusinessUnitValue: '[rx-view-component-id="e4548927-a25e-439e-8e9c-d495c7c87378"] p',
        assigneeDepartmentValue: '[rx-view-component-id="ea7695f8-ebd3-41e6-b85f-ebd800e9c913"] p',
        editMetaData: '[rx-view-component-id="8b8bfec6-0ee2-42a3-be4b-ac4f37d060f1"] .edit-link',
        priorityValue: '.selection-field',
        showMoreDescriptionLink: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] button.more',
        taskDescription: 'cce67ce7-e6a5-4ed6-aa50-c57ea75d2854',
    }

    async getDynamicFieldTitle(): Promise<string> {
        return await $(this.selectors.dynamicFieldTitle).getText();
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
        await $(this.selectors.manageDynamicField).click();
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
        return await $(this.selectors.ownerCompanyValue).getText();
    }

    async getBuisnessunitValue(): Promise<string> {
        return await $(this.selectors.buisnessunitValue).getText();
    }

    async getDepartmentValue(): Promise<string> {
        return await $(this.selectors.departmentValue).getText();
    }

    async getLabelValue(): Promise<string> {
        return await $(this.selectors.label).getText();
    }

    async getOwnerGroupValue(): Promise<string> {
        return await $(this.selectors.ownerGroupValue).getText();
    }

    async getProcessNameValue(): Promise<string> {
        return await $(this.selectors.processnameValue).getText();
    }

    async getTemplateName(): Promise<string> {
        return await $(this.selectors.templateName).getText();
    }

    async getTemplateStatus(): Promise<string> {
        return await $(this.selectors.templateStatus).getText();
    }

    async clickOnCopyTemplate(): Promise<void> {
        await $(this.selectors.copyTaskButton).click();
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
        return await $(this.selectors.summaryValue).getText();
    }

    async getTaskTypeValue(): Promise<string> {
        return await $(this.selectors.taskTypeValue).getText();
    }

    async getTaskDescriptionNameValue(): Promise<string> {
        return await $(this.selectors.taskDescriptionValue).getText();
    }

    async getTaskCompanyNameValue(): Promise<string> {
        return await $(this.selectors.taskCompanyValue).getText();
    }

    async getTaskTemplateId(): Promise<string> {
        return await $(this.selectors.taskTemplateId).getText();
    }

    async getCategoryTier1Value(): Promise<string> {
        return await $(this.selectors.categoryTier1Value).getText();
    }

    async getCategoryTier2Value(): Promise<string> {
        return await $(this.selectors.categoryTier2Value).getText();
    }

    async getCategoryTier3Value(): Promise<string> {
        return await $(this.selectors.categoryTier3Value).getText();
    }

    async getCategoryTier4Value(): Promise<string> {
        return await $(this.selectors.categoryTier4Value).getText();
    }

    async isTaskSummaryTitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskSummaryGuid, input);
    }

    async isTaskTypeTitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskTypeGuid, input);
    }

    async isTaskCompanyTitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCompanyGuid, input);
    }

    async isTaskCategoryTier1TitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier1Guid, input);
    }

    async isTaskCategoryTier2TitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier2Guid, input);
    }

    async isTaskCategoryTier3TitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier3Guid, input);
    }

    async isTaskCategoryTier4TitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCategoryTier4Guid, input);
    }

    async isTaskLabelTitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskLabelGuid, input);
    }

    async isTaskProcessTitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskProcessGuid, input);
    }

    async isTaskDescriptionTitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskDescriptonGuid, input);
    }

    async isTemplateStatusTitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.templateStatusGuid, input);
    }

    async isOwnerCompanyTitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.ownerCompanyGuid, input);
    }

    async isOwnerGroupTitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.ownerGroupGuid, input);
    }

    async isAssigneeTitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.assigneeGuid, input);
    }

    async isSupportGuidTitlePresent(input: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.supportGroupGuid, input);
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
        return await ckeditorValidationPo.isColorTextDisplayed(value, this.selectors.taskDescription);
    }

    async isImageDisplayed(value: string): Promise<boolean> {
        return await ckeditorValidationPo.isImageDisplayed(value, this.selectors.taskDescription);
    }

    async isFormatedTextDisplayed(value: string, tagName: string): Promise<boolean> {
        return await ckeditorValidationPo.isFormatedTextDisplayed(value, tagName, this.selectors.taskDescription);
    }

    async getColorFontStyleOfText(value: string): Promise<string> {
        return await ckeditorValidationPo.getColorFontStyleOfText(value, this.selectors.taskDescription);
    }

    async isItalicTextDisplayed(value: string): Promise<boolean> {
        return await ckeditorValidationPo.isItalicTextDisplayed(value, this.selectors.taskDescription);
    }

    async isBoldTextDisplayed(value: string): Promise<boolean> {
        return await ckeditorValidationPo.isBoldTextDisplayed(value, this.selectors.taskDescription);
    }

    async isUnderLineTextDisplayed(value: string): Promise<boolean> {
        return await ckeditorValidationPo.isUnderLineTextDisplayed(value, this.selectors.taskDescription);
    }

    async isLinkDisplayedInCKE(value: string): Promise<boolean> {
        return await $$(`[rx-view-component-id="${this.selectors.taskDescription}"] a[href="${value}"]`).last().isDisplayed();
    }

    async getTableCellAlignText(value: string): Promise<string> {
        return await ckeditorValidationPo.getTableCellAlignText(value, this.selectors.taskDescription);
    }
  
}

export default new ViewTaskTemplate();