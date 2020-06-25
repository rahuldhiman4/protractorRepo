import { $, browser, protractor, ProtractorExpectedConditions, element, by, ElementFinder } from "protractor";
import { ICaseTemplate } from "../../../data/ui/interface/caseTemplate.interface";
import caseTemplateGrid from "../../../pageobject/settings/case-management/console-casetemplate.po";
import changeAssignemetOldBlade from '../../common/change-assignment-old-blade.po';
import viewCaseTemplate from "../../../pageobject/settings/case-management/view-casetemplate.po";
import utilCommon from '../../../utils/util.common';

class CreateCaseTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createCaseTemplate: '[rx-view-component-id="3a9fd0a9-2b68-4872-a022-7c56b377a4dc"] button',
        copyCaseTemplateOnCreate: '[rx-view-component-id="92e13921-bf7b-494e-9d65-609a07c36505"] button',
        templateName: '[rx-view-component-id="432c5f23-8c50-490d-9e94-8912ac4cd5e1"] input',
        caseSummary: '[rx-view-component-id="9aac1caa-d110-450e-a9a2-d87168ec6162"] input',
        caseDescriptionGuid: '9023c12e-819f-4964-8079-b11cd6c0b860',
        saveButton: '[rx-view-component-id="fee3e577-173c-4dec-8265-ec81580ed26d"] button',
        cancelButton: '[rx-view-component-id="be371341-8b3f-4433-93fa-33d242984010"] button',
        companyDropDown: '127214a1-bfc0-4a8c-acb7-cd2be137fa3c',
        flowset: 'e29c6d30-5ac3-4f18-a4c6-9192017d46ed',
        casePriority: '98327bc1-9ada-48f9-ab88-9787ddecd409',
        caseStatus: '6b1d1112-129e-4c27-82b2-2248f12dc09a',
        statusReason: 'b6a6fc24-c3e7-4565-b2d2-848dd4a6747b',
        label: '7ea99756-16a7-4aae-a8a0-8e5e11acfb77',
        caseCategoryTier1: '[rx-view-component-id="57b0a78a-b91a-46c3-8800-04acc0d81108"], [rx-view-component-id="c8ce4fd2-d864-4544-baf7-4b27b59c12c3"]',
        caseCategoryTier2: '42e3edda-f057-41e2-8160-7a9482e847dc',
        caseCategoryTier3: 'bb675d8f-82bc-497b-8b99-dfc1baa1dd41',
        caseCategoryTier4: 'ec532c69-dbc8-4473-b76d-ad90bec193d2',
        identityValidation: '768c4f0a-309f-4e7f-ba88-a0ef9a169d6f',
        assignmentMethod: '1930b678-6f96-41a3-a127-a483fc8ffd26',
        taskFailureConfiguration: '317fe9a4-3ca7-4a55-a647-18163fd4a572',
        allowCaseReopen: 'cd24485f-5719-48e3-8d76-4320f5d13c4c',
        templateStatusDropdown: '3bebf8c9-1396-487a-b9ea-bf1e39d4d475',
        ownerCompany: '84efe67b-c540-4fd9-9a7a-724e9390656a',
        resolutionCode: 'f5b64175-c39b-4b6b-a6c4-956038a232b3',
        resolutionDescription: '8f8159e2-d647-4c46-ae71-ff56f1a81a0b',
        businessUnitDropdown: 'f5c9ce38-b11a-4c5a-b952-16903c1c383d',
        departmentDropdown: '70778256-c238-4a16-a24f-86b71cc3da87',
        resolveCaseOnLastTaskCompletion: '0ecdd658-0479-4cb3-a103-31f0a3238c29',
        ownerGroupDropdown: 'b3ebc604-b7dc-4090-90a5-9515d1ea7f3e',
        selectOptions: '[rx-view-component-id="5a23952e-aac4-4e00-af6c-b93a214e26a9"] span',
        changeAssignmentButton: '[rx-view-component-id="5a23952e-aac4-4e00-af6c-b93a214e26a9"] button',
        clearButton: '[rx-view-component-id="863df084-ff37-4099-85d9-2bfcc4783adc"] button',
        reopentimelineDays: '[rx-view-component-id="c562f849-8baa-4324-bbfc-77f34c4cdbde"] input',
        searchInput: 'input[type="search"]',
    }

    async setCompanyName(companyValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyDropDown, companyValue);
    }

    async clickSaveCaseTemplate(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        //await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)),3000);
        await $(this.selectors.saveButton).click();
        //        await browser.wait(this.EC.elementToBeClickable($(viewCaseTemplate.selectors.identityValidationValue)));
    }

    async clickOnCancelButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async setCategoryTier1(tier1Value: string): Promise<void> {
        await utilCommon.selectDropDown2($(this.selectors.caseCategoryTier1), tier1Value);
    }

    async isResolveCaseOnLastTaskCompletion(value: boolean): Promise<void> {
        await utilCommon.selectToggleButton(this.selectors.resolveCaseOnLastTaskCompletion, value);
    }

    async setCategoryTier2(tier2Value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.caseCategoryTier2, tier2Value);
    }

    async setCategoryTier3(tier3Value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.caseCategoryTier3, tier3Value);
    }

    async setCategoryTier4(tier4Value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.caseCategoryTier4, tier4Value);
    }

    async setLabelValue(labelValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.caseCategoryTier4, labelValue);
    }

    async setFlowsetValue(flowsetValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.flowset, flowsetValue);
    }

    async setStatusReasonValue(StatusReasonValue: string): Promise<void> {
        await $('[rx-view-component-id="ffcb232a-0ef2-4e6f-9fc1-5d75c1576fd1"] label').isPresent().then(async(present)=>{
            if(present) await utilCommon.selectDropDown('ffcb232a-0ef2-4e6f-9fc1-5d75c1576fd1', StatusReasonValue);
            else await utilCommon.selectDropDown(this.selectors.statusReason, StatusReasonValue);
        });
    }

    async setIdentityValidationValue(identityValidationValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.identityValidation, identityValidationValue);
    }

    async setReopenTimelineDays(reopenDaysValues: string) {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.reopentimelineDays)));
        await $(this.selectors.reopentimelineDays).sendKeys(reopenDaysValues);
    }

    async setPriorityValue(priorityValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.casePriority, priorityValue);
    }

    async setCaseStatusValue(caseStatusValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.caseStatus, caseStatusValue);
    }

    async setAllowCaseReopenValue(allowCaseReopenValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.allowCaseReopen, allowCaseReopenValue);
    }

    async setDepartmentDropdownValue(departmentDropdownValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.departmentDropdown, departmentDropdownValue);
    }

    async setOwnerCompanyValue(ownerCompanyValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ownerCompany, ownerCompanyValue);
    }

    async setTaskFailureConfigurationValue(taskFailureConfigurationValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.taskFailureConfiguration, taskFailureConfigurationValue);
    }

    async setBusinessUnitDropdownValue(businessUnitDropdownValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.businessUnitDropdown, businessUnitDropdownValue);
    }

    async setAssignmentMethodValue(assignmentMethodValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.assignmentMethod, assignmentMethodValue);
    }

    async setOwnerGroupDropdownValue(ownerGroupValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ownerGroupDropdown, ownerGroupValue);
    }

    async setTemplateStatusDropdownValue(templateStatusValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.templateStatusDropdown, templateStatusValue);
    }

    async clickOnChangeAssignmentButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeAssignmentButton)));
        await $(this.selectors.changeAssignmentButton).click();
    }

    async clickOnClearButton(): Promise<void> {
        await $(this.selectors.clearButton).click();
    }

    async isResolutionCodeRequired(values: boolean): Promise<void> {
        await utilCommon.selectToggleButton(this.selectors.resolutionCode, values);
    }

    async isResolutionDescriptionRequired(values: boolean): Promise<void> {
        await utilCommon.selectToggleButton(this.selectors.resolutionDescription, values);
    }

    async setTemplateName(templateNameValue: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.templateName)));
        await $(this.selectors.templateName).clear();
        await $(this.selectors.templateName).sendKeys(templateNameValue);
    }

    async setCaseSummary(caseSummaryValue: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseSummary)));
        await $(this.selectors.caseSummary).clear();
        await $(this.selectors.caseSummary).sendKeys(caseSummaryValue);
    }

    async setCaseDescription(caseDescription: string): Promise<void> {
        await utilCommon.setCKEditor(caseDescription, this.selectors.caseDescriptionGuid);
    }

    async createCaseTemplateWithMandatoryFields(caseTemplate: ICaseTemplate): Promise<void> {
        await caseTemplateGrid.clickOnCreateCaseTemplateButton();
        await this.setTemplateName(caseTemplate.templateName);
        await this.setCaseSummary(caseTemplate.templateSummary);
        await this.setCompanyName(caseTemplate.company);
        await this.setBusinessUnitDropdownValue(caseTemplate.ownerBusinessUnit);
        await this.setOwnerGroupDropdownValue(caseTemplate.ownerGroup);
        await this.setCaseDescription(caseTemplate.templateDescription);
        await this.setCategoryTier1(caseTemplate.categoryTier1);
        await this.setCategoryTier2(caseTemplate.categoryTier2);
        await this.setCategoryTier3(caseTemplate.categoryTier3);
        await this.isResolutionCodeRequired(true);
        await this.isResolutionDescriptionRequired(true);
        await this.clickOnChangeAssignmentButton();
        await changeAssignemetOldBlade.selectBusinessUnit(caseTemplate.businessUnit);
        await changeAssignemetOldBlade.selectSupportGroup(caseTemplate.supportGroup);
        await changeAssignemetOldBlade.selectAssignee(caseTemplate.assignee);
        await changeAssignemetOldBlade.clickOnAssignButton();
        //        await browser.sleep(2000);
        // expect(await copyCasetemplatePo.getValueOfAssignee()).toBe(caseTemplate.assignee);
        await this.clickSaveCaseTemplate();
    }

    async createCaseTemplateWithAllFields(caseTemplate: ICaseTemplate): Promise<void> {
        await caseTemplateGrid.clickOnCreateCaseTemplateButton();
        await this.setTemplateName(caseTemplate.templateName);
        await this.setCaseSummary(caseTemplate.templateSummary);
        await this.setCompanyName(caseTemplate.company);
        await this.setCaseDescription(caseTemplate.templateDescription);
        await this.setFlowsetValue(caseTemplate.flowset);
        await this.setCaseStatusValue(caseTemplate.caseStatus);
        await this.setBusinessUnitDropdownValue(caseTemplate.ownerBusinessUnit);
        await this.setOwnerGroupDropdownValue(caseTemplate.ownerGroup);
        await this.setPriorityValue(caseTemplate.casePriority);
        await this.setCategoryTier1(caseTemplate.categoryTier1);
        await this.setCategoryTier2(caseTemplate.categoryTier2);
        await this.setCategoryTier3(caseTemplate.categoryTier3);
        await this.setStatusReasonValue(caseTemplate.statusReason);
        await this.setIdentityValidationValue(caseTemplate.identityValidation);
        await this.setAssignmentMethodValue(caseTemplate.assignmentMethod);
        await this.setTaskFailureConfigurationValue(caseTemplate.taskFailureConfiguration);
        await this.setTemplateStatusDropdownValue(caseTemplate.templateStatus);
        await this.setAllowCaseReopenValue(caseTemplate.allowCaseReopen);
        await this.isResolutionCodeRequired(true);
        await this.isResolutionDescriptionRequired(true);
        await this.clickOnChangeAssignmentButton();
        await changeAssignemetOldBlade.selectBusinessUnit(caseTemplate.businessUnit);
        await changeAssignemetOldBlade.selectSupportGroup(caseTemplate.supportGroup);
        await changeAssignemetOldBlade.selectAssignee(caseTemplate.assignee);
        await changeAssignemetOldBlade.clickOnAssignButton();
        //        await browser.wait(this.EC.invisibilityOf($(changeAssignemetOldBlade.selectors.assignToMeCheckBox)));
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeAssignmentButton)));
        await this.clickSaveCaseTemplate();
    }
}

export default new CreateCaseTemplate();