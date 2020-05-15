import { ICaseTemplate } from 'e2e/data/ui/interface/caseTemplate.interface';
import { $, $$, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class EditCaseTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        editCaseCompany: '[rx-view-component-id="39db6cc5-79ae-4934-a4bc-74765278fcda"] .btn-default',
        editcaseTemplate: '[rx-view-component-id="672c4706-9ce0-46be-9a3a-a639ded79b23"] .edit-link',
        editTemplateMetaData: '[rx-view-component-id="c9f48c1b-75e2-411c-929c-76bdce069a3d"] .edit-link',
        caseSummary: '[rx-view-component-id="e3cb1a92-1e94-477d-93fa-b63b29c1c129"] input',
        caseDescription: '[rx-view-component-id="3b3506af-b9a2-47bd-88f7-032092bc1264"] textarea',
        saveButton: '[rx-view-component-id="60fae5e7-7bf2-477f-9e60-8be66292e6b5"] button',
        cancelButton: '[rx-view-component-id="a68b0e71-032d-4ecf-9d12-e0cd49f4b652"] button',
        templateStatusReadOnly:'[rx-view-component-id="88cf66ca-8be6-46b2-93e0-52890187dffb"] .ui-select-match',
        companyDropDown: '127214a1-bfc0-4a8c-acb7-cd2be137fa3c',
        flowset: '2fe19a48-630b-4380-8b17-cbff70023a89',
        resolveCaseOnLastTaskCompletion:'e4956197-0230-4272-8fc4-87358bd084bf',
        casePriority: '98327bc1-9ada-48f9-ab88-9787ddecd409',
        caseStatus: '5289a531-7138-4e4f-afdc-ee3f67a2aa64',
        statusReason: 'cfde7589-436d-4835-aab8-f5d71e04f91a',
        label: '7ea99756-16a7-4aae-a8a0-8e5e11acfb77',
        caseCategoryTier1: '241f0e58-3106-4f8a-a1cc-43554414bb7c',
        caseCategoryTier2: '4f950be7-d968-41a4-8bb9-018674e53f88',
        caseCategoryTier3: 'a7fbc4bc-23c6-4f92-818a-5554107d04c0',
        caseCategoryTier4: 'fbc0f516-1f57-44ad-82ab-f8bbbe1aa5f5',
        identityValidation: 'dead2a5c-4753-40c6-9709-4b8ea9c454fd',
        assignmentMethod: '9183824b-61c4-4a00-bcfa-7f4e7461e10c',
        taskFailureConfiguration: '61e9aaa2-654c-4f6e-817c-64f5f86cf9fa',
        allowCaseReopen: 'cd503085-d130-4a5c-84c8-732b1d1770a2',
        templateStatusDropdown: '88cf66ca-8be6-46b2-93e0-52890187dffb',
        ownerCompany: '80c13021-4b91-4298-bbdc-8b0cfe006a91',
        resolutionCode: 'c3d9b91a-0198-4b61-b13a-59d46d3b0103',
        resolutionDescription: 'b5b2d17e-e6b1-44e9-bbd5-23d74b3f1a2a',
        businessUnitDropdown: 'e645fae1-100f-4e85-bf93-336ef552254f',
        departmentDropdown: 'ec169352-7979-4527-b8d0-4deec9caf822',
        ownerGroupDropdown: 'b1022495-e1e9-441e-834f-89a9ce9e7f93',
        changeAssignmentButton: '[rx-view-component-id="d6915b45-3cc0-40de-b80c-1212d050b40f"] button',
        clearButton: '[rx-view-component-id="26645a3a-2ce9-4d60-b167-7c4642cc00f2"] button',
        saveTemplateMetaData: '[rx-view-component-id="c9db0571-b703-4d5d-830c-d3a98f243c94"] button',
        cancelTemplateMetaData: '[rx-view-component-id="e4cd9ed1-026d-4c8c-8557-bce659a2c344"] button',
        caseTemplateId: '.text-field',
        reopentimelineDays: '[rx-view-component-id="88249662-e4c4-4ca7-9e34-0ecbd4bc0252"] input',
        manageDynamicFieldsLink: '[rx-view-component-id="3cd9b535-36f6-4718-bede-9154ca02ae22"] .edit-link',
        copyTemplate: '[rx-view-component-id="0bb1dd3b-639f-4019-adbd-96faae6920ef"] button',
        taskFlow: '[rx-view-component-id="f76e9987-cfa0-4742-b92f-087bd38c59df"] .d-icon-left-pencil',
        assignmentMethodValue: '[rx-view-component-id="9183824b-61c4-4a00-bcfa-7f4e7461e10c"] .ui-select-match-text',
        tier1ValueOnCaseTemplate: '[rx-view-component-id="241f0e58-3106-4f8a-a1cc-43554414bb7c"] .d-textfield__rx-value',
        tier2ValueOnCaseTemplate: '[rx-view-component-id="4f950be7-d968-41a4-8bb9-018674e53f88"] .d-textfield__rx-value',
        tier3ValueOnCaseTemplate: '[rx-view-component-id="a7fbc4bc-23c6-4f92-818a-5554107d04c0"] .d-textfield__rx-value',
        summaryGuid: 'e3cb1a92-1e94-477d-93fa-b63b29c1c129',
        priorityGuid: 'c933ab70-9004-4347-9537-3ae65ec633b9',
        companyGuid: '39db6cc5-79ae-4934-a4bc-74765278fcda',
        saveTemplateData: '[rx-view-component-id="16f6e232-26f8-4c72-a30a-b4e765fd09b6"] button',
        caseStatusValue: '[rx-view-component-id="5289a531-7138-4e4f-afdc-ee3f67a2aa64"] .ui-select-toggle', 
        manageDynamicField: '[rx-view-component-id="3cd9b535-36f6-4718-bede-9154ca02ae22"] button',
        dynamicFieldsName:'[rx-view-component-id="3cd9b535-36f6-4718-bede-9154ca02ae22"] span'
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
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
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

    async updateCategoriesValues(caseTemplate: ICaseTemplate): Promise<void> {
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

    async changeCategoryTier1(tier1Value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.caseCategoryTier1, tier1Value);
    }

    async changeCategoryTier2(tier2Value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.caseCategoryTier2, tier2Value);
    }

    async changeCategoryTier3(tier3Value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.caseCategoryTier3, tier3Value);
    }

    async changeCategoryTier4(tier4Value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.caseCategoryTier4, tier4Value);
    }

    async changeLabelValue(labelValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.caseCategoryTier4, labelValue);
    }

    async changeFlowsetValue(flowsetValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.flowset, flowsetValue);
    }

    async changeIdentityValidationValue(identityValidationValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.identityValidation, identityValidationValue);
    }

    async changeReopenTimelineDays(reopenDaysValues: string) {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.reopentimelineDays)));
        await $(this.selectors.reopentimelineDays).sendKeys(reopenDaysValues);
    }

    async changePriorityValue(priorityValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.casePriority, priorityValue);
    }

    async changeCaseStatusValue(caseStatusValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.caseStatus, caseStatusValue);
    }

    async changeAllowCaseReopenValue(allowCaseReopenValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.allowCaseReopen, allowCaseReopenValue);
    }

    async changeDepartmentDropdownValue(departmentDropdownValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.departmentDropdown, departmentDropdownValue);
    }

    async changeOwnerCompanyValue(ownerCompanyValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ownerCompany, ownerCompanyValue);
    }

    async changeTaskFailureConfigurationValue(taskFailureConfigurationValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ownerCompany, taskFailureConfigurationValue);
    }

    async changeBusinessUnitDropdownValue(businessUnitDropdownValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.businessUnitDropdown, businessUnitDropdownValue);
    }

    async changeAssignmentMethodValue(assignmentMethodValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.assignmentMethod, assignmentMethodValue);
    }

    async changeOwnerGroupDropdownValue(ownerGroupValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ownerGroupDropdown, ownerGroupValue);
    }

    async changeTemplateStatusDropdownValue(templateStatusValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.templateStatusDropdown, templateStatusValue);
    }

    async clickOnChangeAssignmentButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeAssignmentButton)));
        await $(this.selectors.changeAssignmentButton).click();
    }

    async setResolutionCodeRequired(value: boolean): Promise<void> {
        await utilCommon.selectToggleButton(this.selectors.resolutionCode, value)
    }

    async setResolutionDescriptionRequired(value: boolean): Promise<void> {
        await utilCommon.selectToggleButton(this.selectors.resolutionDescription, value)
    }

    async clearCaseSummary():Promise<void>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseSummary)));
        await $(this.selectors.caseSummary).clear();
    }

    async changeCaseSummary(caseSummaryValue: string): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.caseSummary)));
        await $(this.selectors.caseSummary).clear();
        await $(this.selectors.caseSummary).sendKeys(caseSummaryValue);
    }

    async changeCaseDescription(caseDescription: string): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.caseDescription)));
        await $(this.selectors.caseDescription).clear();
        await $(this.selectors.caseDescription).sendKeys(caseDescription);
    }

    async getValueOfAssignmentMethod(): Promise<string> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignmentMethodValue)));
        return await $(this.selectors.assignmentMethodValue).getText(); 
     }

     async isCaseCompanyDisabled(): Promise<string> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.editCaseCompany)));
        return await $(this.selectors.editCaseCompany).getAttribute('disabled');
    }

    async isCaseSummaryReadOnly(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.caseSummary)));
        return await $(this.selectors.caseSummary).getAttribute('readonly') =='true'? true:false;        
    }

    async isSaveButtonOnMetaDataIsDisabled(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.saveTemplateMetaData)));
        return await $(this.selectors.saveTemplateMetaData).getAttribute('disabled') == 'true' ? true : false;        
    }

    async isResolveCaseOnLastTaskCompletion(value: boolean): Promise<void> {
        await utilCommon.selectToggleButton(this.selectors.resolveCaseOnLastTaskCompletion, value);
    }
    
    async isPriorityRequiredTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.priorityRequiredText)));
        return await utilCommon.isRequiredTagToField(this.selectors.priorityGuid);
    }

    async isSummaryRequiredTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.summary)));
        return await utilCommon.isRequiredTagToField(this.selectors.summaryGuid);
    }

    async isCompanyRequiredTextPresent(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isTemplateStatusRequiredTextPresent(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.templateStatusDropdown);
    }

    async isOwnerGroupRequiredTextPresent(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.ownerGroupDropdown);
    }

    async isOwnerCompanyRequiredTextPresent(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.ownerCompany);
    }

    async allStatusOptionsPresent(list: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.caseStatus, list);
    }

    async allTemplateStatusOptionsPresent(list: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.templateStatusDropdown, list);
    }

    async allPriorityOptionsPresent(list: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.priorityGuid, list);
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
}

export default new EditCaseTemplate();