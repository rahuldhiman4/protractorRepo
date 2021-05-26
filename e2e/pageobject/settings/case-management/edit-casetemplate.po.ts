import { ICaseTemplateUI } from '../../../data/interface/template.interface';
import { $, $$, browser, protractor, ProtractorExpectedConditions, element, by, ElementFinder } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class EditCaseTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        editCaseCompany: '[rx-view-component-id="39db6cc5-79ae-4934-a4bc-74765278fcda"] .dropdown-toggle',
        editcaseTemplate: '[rx-view-component-id="672c4706-9ce0-46be-9a3a-a639ded79b23"] .justify-content-end button',
        editTemplateMetaData: '[rx-view-component-id="c9f48c1b-75e2-411c-929c-76bdce069a3d"] .btn-link',
        caseSummary: '[rx-view-component-id="e3cb1a92-1e94-477d-93fa-b63b29c1c129"] input',
        caseDescriptionGuid: '3b3506af-b9a2-47bd-88f7-032092bc1264',
        saveButton: '[rx-view-component-id="60fae5e7-7bf2-477f-9e60-8be66292e6b5"] button',
        cancelButton: '[rx-view-component-id="a68b0e71-032d-4ecf-9d12-e0cd49f4b652"] button',
        templateStatusReadOnly: '[rx-view-component-id="88cf66ca-8be6-46b2-93e0-52890187dffb"] button',
        companyDropDown: '39db6cc5-79ae-4934-a4bc-74765278fcda',
        flowset: 'da30d0cb-0adb-4145-8954-7a43cebe415c',
        resolveCaseOnLastTaskCompletion: 'e4956197-0230-4272-8fc4-87358bd084bf',
        casePriority: 'c933ab70-9004-4347-9537-3ae65ec633b9',
        caseStatusGuid: '5289a531-7138-4e4f-afdc-ee3f67a2aa64',
        statusReason: 'cfde7589-436d-4835-aab8-f5d71e04f91a',
        label: '33e2d3dd-d813-4d35-8d1a-c8307b23d3e3',
        caseCategoryTier1: 'ad1a72f6-a588-428f-a99e-6a2e8baf12ff',
        caseCategoryTier2: 'c80b1e58-3854-45bd-9553-5c6e0bb334d8',
        caseCategoryTier3: 'a0243fb4-35cd-457b-a517-210a5e3e330d',
        caseCategoryTier4: '8a790c6a-3401-44f6-afc3-eb43a67a55b1',
        identityValidation: 'dead2a5c-4753-40c6-9709-4b8ea9c454fd',
        assignmentMethod: '9183824b-61c4-4a00-bcfa-7f4e7461e10c',
        taskFailureConfiguration: '61e9aaa2-654c-4f6e-817c-64f5f86cf9fa',
        allowCaseReopen: 'cd503085-d130-4a5c-84c8-732b1d1770a2',
        templateStatusDropdown: '88cf66ca-8be6-46b2-93e0-52890187dffb',
        ownerCompany: '80c13021-4b91-4298-bbdc-8b0cfe006a91',
        resolutionCode: 'c3d9b91a-0198-4b61-b13a-59d46d3b0103',
        resolutionDescription: 'b5b2d17e-e6b1-44e9-bbd5-23d74b3f1a2a',
        businessUnitDropdown: 'd65df3ea-bb07-4d6a-90ac-a5453f4419c8',
        ownerGroupDropdown: '9bd8d31f-93c2-48cd-bf82-9e06cd584f22',
        changeAssignmentButton: '[rx-view-component-id="d6915b45-3cc0-40de-b80c-1212d050b40f"] button',
        clearButton: '[rx-view-component-id="26645a3a-2ce9-4d60-b167-7c4642cc00f2"] button',
        saveTemplateMetaData: '[rx-view-component-id="c9db0571-b703-4d5d-830c-d3a98f243c94"] button',
        cancelTemplateMetaData: '[rx-view-component-id="e4cd9ed1-026d-4c8c-8557-bce659a2c344"] button',
        caseTemplateId: '.text-field',
        reopentimelineDays: '[rx-view-component-id="88249662-e4c4-4ca7-9e34-0ecbd4bc0252"] input',
        manageDynamicFieldsLink: '[rx-view-component-id="3cd9b535-36f6-4718-bede-9154ca02ae22"] .d-icon-left-pencil',
        copyTemplate: '[rx-view-component-id="0bb1dd3b-639f-4019-adbd-96faae6920ef"] button',
        taskFlow: '[rx-view-component-id="3b142f9f-078c-4a9f-9215-0cc3ec054244"] .d-icon-left-pencil',
        assignmentMethodValue: '[rx-view-component-id="9183824b-61c4-4a00-bcfa-7f4e7461e10c"] .dropdown-toggle',
        tier1ValueOnCaseTemplate: '[rx-view-component-id="ad1a72f6-a588-428f-a99e-6a2e8baf12ff"] .dropdown-toggle',
        tier2ValueOnCaseTemplate: '[rx-view-component-id="c80b1e58-3854-45bd-9553-5c6e0bb334d8"] .dropdown-toggle',
        tier3ValueOnCaseTemplate: '[rx-view-component-id="a0243fb4-35cd-457b-a517-210a5e3e330d"] .dropdown-toggle',
        tier4ValueOnCaseTemplate: '[rx-view-component-id="8a790c6a-3401-44f6-afc3-eb43a67a55b1"] .dropdown-toggle',
        summaryGuid: 'e3cb1a92-1e94-477d-93fa-b63b29c1c129',
        priorityGuid: 'c933ab70-9004-4347-9537-3ae65ec633b9',
        companyGuid: '39db6cc5-79ae-4934-a4bc-74765278fcda',
        saveTemplateData: '[rx-view-component-id="16f6e232-26f8-4c72-a30a-b4e765fd09b6"] button',
        caseStatusValue: '[rx-view-component-id="5289a531-7138-4e4f-afdc-ee3f67a2aa64"] .dropdown-toggle',
        manageDynamicField: '[rx-view-component-id="3cd9b535-36f6-4718-bede-9154ca02ae22"] button',
        dynamicFieldsName: '[rx-view-component-id="3cd9b535-36f6-4718-bede-9154ca02ae22"] span',
        caseStatus: '[rx-view-component-id="5289a531-7138-4e4f-afdc-ee3f67a2aa64"] button',
        labelValue: '[rx-view-component-id="33e2d3dd-d813-4d35-8d1a-c8307b23d3e3"] .dropdown-toggle',
        dropdownBox: '.dropdown-toggle',

    }

    async clickOnCopyCaseTemplate(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.copyTemplate)));
        await $(this.selectors.copyTemplate).click();
    }

    async clickSaveCaseTemplate(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnTaskFlowButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.taskFlow)));
        await $(this.selectors.taskFlow).click();
    }

    async clickOnCancelButton(): Promise<void> {
        let cancelButton = await $(this.selectors.cancelButton);
        await utilityCommon.scrollToElement(cancelButton);
        await cancelButton.click();
    }

    async clickOnMangeDyanmicLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.manageDynamicFieldsLink)));
        await $(this.selectors.manageDynamicFieldsLink).click();
    }

    async clickOnCancelTemplateMetaData(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelTemplateMetaData)));
        await $(this.selectors.cancelTemplateMetaData).click();
    }

    async getCaseTemplateID(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseTemplateId)));
        return await $(this.selectors.caseTemplateId).getText();
    }

    async clickOnSaveCaseTemplateMetadata(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveTemplateMetaData)));
        await $(this.selectors.saveTemplateMetaData).click();
    }

    async clickOnEditCaseTemplateMetadata(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editTemplateMetaData)));
        await $(this.selectors.editTemplateMetaData).click();
    }

    async clickEditCaseTemplate(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editcaseTemplate)));
        await $(this.selectors.editcaseTemplate).click();
    }

    async clickOnClearButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.clearButton)));
        await $(this.selectors.clearButton).click();
    }

    async updateCategoriesValues(caseTemplate: ICaseTemplateUI): Promise<void> {
        await this.changeCategoryTier1(caseTemplate.categoryTier1);
        await this.changeCategoryTier2(caseTemplate.categoryTier2);
        await this.changeCategoryTier3(caseTemplate.categoryTier3);
    }

    async getValueOfTier1(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.tier1ValueOnCaseTemplate)));
        return await $(this.selectors.tier1ValueOnCaseTemplate).getText();
    }

    async getValueOfTier2(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.tier2ValueOnCaseTemplate)));
        return await $(this.selectors.tier2ValueOnCaseTemplate).getText();
    }

    async getValueOfTier3(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.tier3ValueOnCaseTemplate)));
        return await $(this.selectors.tier3ValueOnCaseTemplate).getText();
    }

    async getValueOfTier4(): Promise<string> {
        return await $(this.selectors.tier4ValueOnCaseTemplate).getText();
    }

    async changeCategoryTier1(tier1Value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.caseCategoryTier1, tier1Value);
    }

    async changeCategoryTier2(tier2Value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.caseCategoryTier2, tier2Value);
    }

    async changeCategoryTier3(tier3Value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.caseCategoryTier3, tier3Value);
    }

    async changeCategoryTier4(tier4Value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.caseCategoryTier4, tier4Value);
    }

    async changeLabelValue(labelValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.label, labelValue);
    }

    async changeFlowsetValue(flowsetValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.flowset, flowsetValue);
    }

    async changeIdentityValidationValue(identityValidationValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.identityValidation, identityValidationValue);
    }

    async changeReopenTimelineDays(reopenDaysValues: string) {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.reopentimelineDays)));
        await $(this.selectors.reopentimelineDays).sendKeys(reopenDaysValues);
    }

    async changePriorityValue(priorityValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.casePriority, priorityValue);
    }

    async changeCaseStatusValue(caseStatusValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.caseStatusGuid, caseStatusValue);
    }

    async changeAllowCaseReopenValue(allowCaseReopenValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.allowCaseReopen, allowCaseReopenValue);
    }

    async changeOwnerCompanyValue(ownerCompanyValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.ownerCompany, ownerCompanyValue);
    }

    async changeTaskFailureConfigurationValue(taskFailureConfigurationValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.ownerCompany, taskFailureConfigurationValue);
    }

    async changeBusinessUnitDropdownValue(businessUnitDropdownValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.businessUnitDropdown, businessUnitDropdownValue);
    }

    async changeAssignmentMethodValue(assignmentMethodValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.assignmentMethod, assignmentMethodValue);
    }

    async changeOwnerGroupDropdownValue(ownerGroupValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.ownerGroupDropdown, ownerGroupValue);
    }

    async changeTemplateStatusDropdownValue(templateStatusValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.templateStatusDropdown, templateStatusValue);
    }

    async clickOnChangeAssignmentButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeAssignmentButton)));
        await $(this.selectors.changeAssignmentButton).click();
    }

    async setResolutionCodeRequired(value: boolean): Promise<void> {
        await utilityCommon.switchSlider(this.selectors.resolutionCode, value)
    }

    async setResolutionDescriptionRequired(value: boolean): Promise<void> {
        await utilityCommon.switchSlider(this.selectors.resolutionDescription, value)
    }

    async clearCaseSummary(): Promise<void> {
        await $(this.selectors.caseSummary).clear();
    }

    async changeCaseSummary(caseSummaryValue: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseSummary)));
        await $(this.selectors.caseSummary).clear();
        await $(this.selectors.caseSummary).sendKeys(caseSummaryValue);
    }

    async changeCaseDescription(caseDescription: string): Promise<void> {
        await utilityCommon.setCKEditor(caseDescription, this.selectors.caseDescriptionGuid);
    }

    async getValueOfAssignmentMethod(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignmentMethodValue)));
        return await $(this.selectors.assignmentMethodValue).getText();
    }

    async isCaseCompanyDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.editCaseCompany)));
        return (await $(this.selectors.editCaseCompany).getAttribute('class')).includes('disabled');
    }

    async isCaseSummaryReadOnly(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseSummary)));
        return await $(this.selectors.caseSummary).getAttribute('readonly') == 'true' ? true : false;
    }

    async isSaveButtonOnMetaDataIsDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.saveTemplateMetaData)));
        return await $(this.selectors.saveTemplateMetaData).getAttribute('disabled') == 'true' ? true : false;
    }

    async isResolveCaseOnLastTaskCompletion(value: boolean): Promise<void> {
        await utilityCommon.switchSlider(this.selectors.resolveCaseOnLastTaskCompletion, value);
    }

    async isPriorityRequiredTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.priorityRequiredText)));
        return await utilityCommon.isRequiredTagToField(this.selectors.priorityGuid);
    }

    async isSummaryRequiredTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.summary)));
        return await utilityCommon.isRequiredTagToField(this.selectors.summaryGuid);
    }

    async isCompanyRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isTemplateStatusRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.templateStatusDropdown);
    }

    async isOwnerGroupRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.ownerGroupDropdown);
    }

    async isOwnerCompanyRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.ownerCompany);
    }

    async allStatusOptionsPresent(list: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.caseStatusGuid, list);
    }

    async allTemplateStatusOptionsPresent(list: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.templateStatusDropdown, list);
    }

    async allPriorityOptionsPresent(list: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.priorityGuid, list);
    }

    async isDynamicFieldDisplayed(fieldName: string): Promise<boolean> {
        let dynamicFields: number = await $$(this.selectors.dynamicFieldsName).count();
        for (let i = 0; i < dynamicFields; i++) {
            let field = await $$(this.selectors.dynamicFieldsName).get(i).getText();
            if (fieldName == field) {
                return true;
            }
        }
        return false;
    }

    async isManageDynamicFieldLinkDisplayed(): Promise<boolean> {
        return await $(this.selectors.manageDynamicField).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.manageDynamicField).isDisplayed();
            } else {
                console.log("Managelink not present");
                return false;
            }
        });
    }

    async isCaseStatusFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.caseStatus).getAttribute('disabled') == 'true';
    }

    async isCopyTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.copyTemplate).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.copyTemplate).isDisplayed();
            else return false;
        });
    }

    async isCaseSummaryFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.caseSummary).getAttribute('readonly') == 'true';
    }

    async isTemplateStatusDisabled(): Promise<boolean> {
        return await $(this.selectors.templateStatusReadOnly).getAttribute('aria-disabled') == 'true';
    }

    async isSaveTemplateBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }

    async isSaveMetadataBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.saveTemplateMetaData).isEnabled();
    }

    async isFlowsetPresentInDropDown(list: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.flowset, list);
    }

    async isCaseTemplateLabelValueDisplayed(labelName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.labelValue, labelName)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.labelValue, labelName)).isDisplayed();
            else return false;
        });
    }

    async clickOnFlowsetDropDown(): Promise<void> {
        const dropDown = await $(`[rx-view-component-id="12abf0f1-146b-4c94-bd9b-d7a55200153d"]`);
        const dropDownBoxElement = await dropDown.$(this.selectors.dropdownBox);
        //await utilityCommon.scrollToElement(dropDownBoxElement);
        await dropDownBoxElement.click();
    }

}

export default new EditCaseTemplate();