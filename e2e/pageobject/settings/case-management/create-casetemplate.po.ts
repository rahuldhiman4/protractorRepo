import apiHelper from '../../../api/api.helper';
import { $, protractor, ProtractorExpectedConditions } from "protractor";
import { ICaseTemplateUI } from "../../../data/interface/template.interface";
import caseTemplateGrid from "../../../pageobject/settings/case-management/console-casetemplate.po";
import utilityCommon from '../../../utils/utility.common';
import { flowsetMandatoryFields } from '../../../data/ui/flowset/flowset.ui';
import { cloneDeep } from 'lodash';
import { DropDownType } from '../../../utils/constants';
import changeAssignmentBlade from '../../../pageobject/common/change-assignment.po';

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
        flowset: '2e16954b-fa7e-45d6-ae31-fb285c270090',
        casePriority: '98327bc1-9ada-48f9-ab88-9787ddecd409',
        caseStatus: '6b1d1112-129e-4c27-82b2-2248f12dc09a',
        statusReason: 'b6a6fc24-c3e7-4565-b2d2-848dd4a6747b',
        label: '8bd6ba65-515d-4968-ba4d-e04f535ecfcc',
        caseCategoryTier1Guid: '83fbf8aa-8cf3-4672-94b5-b569f978b880',
        caseCategoryTier1: '[rx-view-component-id="83fbf8aa-8cf3-4672-94b5-b569f978b880"], [rx-view-component-id="c8ce4fd2-d864-4544-baf7-4b27b59c12c3"]',
        caseCategoryTier2: '60c2bb3a-6278-4056-a400-3c3816f4084d',
        caseCategoryTier3: 'b544a068-bb95-4915-b6cc-217bfa458564',
        caseCategoryTier4: '772fdb69-d3e5-4b59-b792-187fc7555957',
        identityValidation: '768c4f0a-309f-4e7f-ba88-a0ef9a169d6f',
        assignmentMethod: '1930b678-6f96-41a3-a127-a483fc8ffd26',
        taskFailureConfiguration: '317fe9a4-3ca7-4a55-a647-18163fd4a572',
        allowCaseReopen: 'cd24485f-5719-48e3-8d76-4320f5d13c4c',
        templateStatusDropdown: '3bebf8c9-1396-487a-b9ea-bf1e39d4d475',
        resolutionCode: 'f5b64175-c39b-4b6b-a6c4-956038a232b3',
        resolutionDescription: '8f8159e2-d647-4c46-ae71-ff56f1a81a0b',
        supportCompany: 'a370b52e-3949-429a-b49c-e10200f7ab2c',
        ownerCompany: '67ba805d-dda3-4131-9c74-4f6c9a375583',
        ownerOrgDropdown: 'c0d483a9-75ae-4eb3-a65e-96f1f1bb61ec',
        departmentDropdown: '70778256-c238-4a16-a24f-86b71cc3da87',
        ownerGroupDropdown: 'a6e62e56-9bda-40af-8bce-29ad062b76f5',
        resolveCaseOnLastTaskCompletion: '0ecdd658-0479-4cb3-a103-31f0a3238c29',
        selectOptions: '[rx-view-component-id="5a23952e-aac4-4e00-af6c-b93a214e26a9"] span',
        changeAssignmentButton: '[rx-view-component-id="5a23952e-aac4-4e00-af6c-b93a214e26a9"] button',
        clearButton: '[rx-view-component-id="863df084-ff37-4099-85d9-2bfcc4783adc"] button',
        reopentimelineDays: '[rx-view-component-id="c562f849-8baa-4324-bbfc-77f34c4cdbde"] input',
        searchInput: 'input[type="search"]',
        ckEditor: '.cke_inner',
        ckEditorTextArea: '.cke_editable_themed',
        flowsetVal: '[rx-view-component-id="2e16954b-fa7e-45d6-ae31-fb285c270090"] .dropdown-toggle',
        lobValue: '[rx-view-component-id="26cdb3e6-39c6-4942-8d51-bbe18d94afe2"]'
    }

    async setCompanyName(companyValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyDropDown, companyValue);
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
        await utilityCommon.selectDropDown('83fbf8aa-8cf3-4672-94b5-b569f978b880', tier1Value);
    }

    async isResolveCaseOnLastTaskCompletion(value: boolean): Promise<void> {
        await utilityCommon.switchSlider(this.selectors.resolveCaseOnLastTaskCompletion, value);
    }

    async setCategoryTier2(tier2Value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.caseCategoryTier2, tier2Value);
    }

    async setCategoryTier3(tier3Value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.caseCategoryTier3, tier3Value);
    }

    async setCategoryTier4(tier4Value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.caseCategoryTier4, tier4Value);
    }

    async setLabelValue(labelValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.label, labelValue);
    }

    async setFlowsetValue(flowsetValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.flowset, flowsetValue);
    }

    async setStatusReasonValue(StatusReasonValue: string): Promise<void> {
        await $('[rx-view-component-id="ffcb232a-0ef2-4e6f-9fc1-5d75c1576fd1"] label').isPresent().then(async (present) => {
            if (present) await utilityCommon.selectDropDown(this.selectors.statusReason, StatusReasonValue);
            else await utilityCommon.selectDropDown(this.selectors.statusReason, StatusReasonValue);
        });
    }

    async setIdentityValidationValue(identityValidationValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.identityValidation, identityValidationValue);
    }

    async setReopenTimelineDays(reopenDaysValues: string) {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.reopentimelineDays)));
        await $(this.selectors.reopentimelineDays).sendKeys(reopenDaysValues);
    }

    async setPriorityValue(priorityValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.casePriority, priorityValue);
    }

    async setCaseStatusValue(caseStatusValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.caseStatus, caseStatusValue);
    }

    async setAllowCaseReopenValue(allowCaseReopenValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.allowCaseReopen, allowCaseReopenValue);
    }

    async setDepartmentDropdownValue(departmentDropdownValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.departmentDropdown, departmentDropdownValue);
    }

    async setOwnerCompanyValue(ownerCompanyValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.ownerCompany, ownerCompanyValue);
    }

    async setTaskFailureConfigurationValue(taskFailureConfigurationValue: string): Promise<void> {
        await utilityCommon.selectDropDown(await $('[rx-view-component-id="317fe9a4-3ca7-4a55-a647-18163fd4a572"] button') , taskFailureConfigurationValue, DropDownType.WebElement);
    }

    async setOwnerOrgDropdownValue(ownerOrgValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.ownerOrgDropdown, ownerOrgValue);
    }

    async setAssignmentMethodValue(assignmentMethodValue: string): Promise<void> {
        await utilityCommon.selectDropDown(await $('[rx-view-component-id="1930b678-6f96-41a3-a127-a483fc8ffd26"] button'), assignmentMethodValue, DropDownType.WebElement);
    }

    async setOwnerGroupDropdownValue(ownerGroupValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.ownerGroupDropdown, ownerGroupValue);
    }

    async setTemplateStatusDropdownValue(templateStatusValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.templateStatusDropdown, templateStatusValue);
    }

    async clickOnChangeAssignmentButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeAssignmentButton)));
        await $(this.selectors.changeAssignmentButton).click();
    }

    async clickOnClearAssignmentButton(): Promise<void> {
        let toggleLocator = await $('[rx-view-component-id="bc681c89-5179-4256-bcd4-a506d1659121"] button.rx-button-bar-overflow-dropdown__toggle');
        await toggleLocator.isPresent().then(async (result: boolean) => {
            if (result)
                await toggleLocator.isDisplayed().then(async (isDisplay: boolean) => {
                    if (isDisplay) {
                        await toggleLocator.click();
                        await $('[rx-view-component-id="bc681c89-5179-4256-bcd4-a506d1659121"] a').click();
                    }
                    else await $(this.selectors.clearButton).click();
                });
        });

    }

    async isResolutionCodeRequired(values: boolean): Promise<void> {
        await utilityCommon.switchSlider(this.selectors.resolutionCode, values);
    }

    async isResolutionDescriptionRequired(values: boolean): Promise<void> {
        await utilityCommon.switchSlider(this.selectors.resolutionDescription, values);
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
        await utilityCommon.setCKEditor(caseDescription, this.selectors.caseDescriptionGuid);
    }

    async setSupportCompany(values: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.supportCompany, values);
    }

    async createCaseTemplateWithAllFields(caseTemplate: ICaseTemplateUI): Promise<void> {
        //API call to create the flowset
        await apiHelper.apiLogin('qkatawazi');
        let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
        flowsetMandatoryFieldsData.flowsetName = caseTemplate.templateName;
        await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);
        await caseTemplateGrid.clickOnCreateCaseTemplateButton();
        await this.setTemplateName(caseTemplate.templateName);
        await this.setCaseSummary(caseTemplate.templateSummary);
        await this.setCompanyName(caseTemplate.company);
        await this.setCaseDescription(caseTemplate.templateDescription);
        await this.setFlowsetValue(caseTemplate.templateName);
        await this.setCaseStatusValue(caseTemplate.caseStatus);

        await this.setOwnerOrgDropdownValue(caseTemplate.ownerBusinessUnit);
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
        await changeAssignmentBlade.setDropDownValue('AssignedGroup', caseTemplate.supportGroup);
        await changeAssignmentBlade.setDropDownValue('Assignee', caseTemplate.assignee);
        //        await browser.wait(this.EC.invisibilityOf($(changeAssignemetOldBlade.selectors.assignToMeCheckBox)));
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeAssignmentButton)));
        await this.clickSaveCaseTemplate();
    }

    async isValuePresentInDropdown(DropDownName: string, value: string): Promise<boolean> {
        let guid;
        switch (DropDownName) {
            case "Label": {
                guid = this.selectors.label;
                break;
            }
            case "Priority": {
                guid = this.selectors.casePriority;
                break;
            }
            case "Category Tier 1": {
                guid = this.selectors.caseCategoryTier1;
                break;
            }
            case "Category Tier 2": {
                guid = this.selectors.caseCategoryTier2;
                break;
            }
            case "Category Tier 3": {
                guid = this.selectors.caseCategoryTier3;
                break;
            }
            case "Category Tier 4": {
                guid = this.selectors.caseCategoryTier4;
                break;
            }
            case "flowset": {
                guid = this.selectors.flowset;
                break;
            }
            case "caseStatus": {
                guid = this.selectors.caseStatus;
                break;
            }
            default: {
                console.log('Drop Down name does not match');
                break;
            }
        }
        return await utilityCommon.isValuePresentInDropDown(guid, value);
    }

    async flowsetOptionsPresent(list: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.flowset, list);
    }

    async getLobValue(): Promise<string> {
        return await $(`${this.selectors.lobValue} button`).isPresent().then(async (buttonLob) => {
            if (buttonLob) return await $(`${this.selectors.lobValue} button`).getText();
            else return await $(`${this.selectors.lobValue} input`).getAttribute("placeholder");
        });
    }
}

export default new CreateCaseTemplate();