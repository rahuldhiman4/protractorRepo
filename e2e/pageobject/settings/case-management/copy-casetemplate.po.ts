import utilityGrid from "e2e/utils/utility.grid";
import { $, $$, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from "../../../utils/util.common";

class CopyCaseTemplate {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="432c5f23-8c50-490d-9e94-8912ac4cd5e1"] input',
        saveButton: '[rx-view-component-id="fee3e577-173c-4dec-8265-ec81580ed26d"] button',
        caseCategoryTier1ValueOnCopy: '[rx-view-component-id="83fbf8aa-8cf3-4672-94b5-b569f978b880"] .dropdown-toggle',
        caseCategoryTier2ValueOnCopy: '[rx-view-component-id="60c2bb3a-6278-4056-a400-3c3816f4084d"] .dropdown-toggle',
        caseCategoryTier3ValueOnCopy: '[rx-view-component-id="b544a068-bb95-4915-b6cc-217bfa458564"] .dropdown-toggle',
        casePriorityValueOnCopy: '[rx-view-component-id="98327bc1-9ada-48f9-ab88-9787ddecd409"] .dropdown-toggle',
        caseSummaryValueOnCopy: '[rx-view-component-id="9aac1caa-d110-450e-a9a2-d87168ec6162"] .form-control',
        statusReasonValueOnCopy: '[rx-view-component-id="b6a6fc24-c3e7-4565-b2d2-848dd4a6747b"] .dropdown-toggle',
        caseCompanyValueOnCopy: '[rx-view-component-id="127214a1-bfc0-4a8c-acb7-cd2be137fa3c"] .dropdown-toggle',
        FlowsetValueOnCopy: '[rx-view-component-id="2e16954b-fa7e-45d6-ae31-fb285c270090"] .dropdown-toggle',
        templateStatusValueOnCopy: '[rx-view-component-id="3bebf8c9-1396-487a-b9ea-bf1e39d4d475"] .dropdown-toggle',
        identityValidationValueOnCopy: '[rx-view-component-id="768c4f0a-309f-4e7f-ba88-a0ef9a169d6f"] .rx-select__search-button-title',
        assignmentMethodValueOnCopy: '[rx-view-component-id="1930b678-6f96-41a3-a127-a483fc8ffd26"] .rx-select__search-button-title',
        taskFailureConfigurationValueOnCopy: '[rx-view-component-id="317fe9a4-3ca7-4a55-a647-18163fd4a572"] .rx-select__search-button-title',
        allowCaseReopenValueOnCopy: '[rx-view-component-id="cd24485f-5719-48e3-8d76-4320f5d13c4c"] .dropdown-toggle',
        caseStatusValueOnCopy: '[rx-view-component-id="6b1d1112-129e-4c27-82b2-2248f12dc09a"] .dropdown-toggle',
        resolutionCodeValueOnCopy: '[rx-view-component-id="f5b64175-c39b-4b6b-a6c4-956038a232b3"] input',
        resoltuionDescriptionValueOnCopy: '[rx-view-component-id="8f8159e2-d647-4c46-ae71-ff56f1a81a0b"] input',
        caseDescriptionValueOnCopy: '[rx-view-component-id="9023c12e-819f-4964-8079-b11cd6c0b860"] .cke_wysiwyg_div p',
        copyInstruction: '[rx-view-component-id="162ce9d1-22d1-42a6-8360-f3d1c8dc3a20"] ul span',
        companyDropDown: '127214a1-bfc0-4a8c-acb7-cd2be137fa3c',
        cancelButton: '[rx-view-component-id="be371341-8b3f-4433-93fa-33d242984010"] button',
        OwnerCompanyValueOnCopy: '[rx-view-component-id="a611e56c-cf79-482b-81dc-4c591d2a8843"] .dropdown-toggle',
        ownerGroupValueOnCopy: '[rx-view-component-id="a6e62e56-9bda-40af-8bce-29ad062b76f5"] button',
        ownerGroupDropdown: 'a6e62e56-9bda-40af-8bce-29ad062b76f5',
        departmentValueOnCopy: '[rx-view-component-id="6c570cf5-7f7b-4141-bd17-755e202e7095"] .dropdown-toggle',
        supportCompanyValueOnCopy: '[rx-view-component-id="a370b52e-3949-429a-b49c-e10200f7ab2c"] .dropdown-toggle',
        supportOrganizationValueOnCopy: '[rx-view-component-id="a370b52e-3949-429a-b49c-e10200f7ab2c"] .dropdown-toggle',
        supportGroupValueOnCopy: '[rx-view-component-id="a370b52e-3949-429a-b49c-e10200f7ab2c"] .dropdown-toggle',
        assigneeValueOnCopy: '[rx-view-component-id="a370b52e-3949-429a-b49c-e10200f7ab2c"] .dropdown-toggle',
    }

    async setTemplateName(templateNameValue: string): Promise<void> {
        let element = await $(this.selectors.templateName);
        //        await browser.wait(this.EC.visibilityOf(element));
        await element.clear();
        await element.sendKeys(templateNameValue);
    }

    async getCopyCaseTemplateInstruction(): Promise<string> {
        let textInstruction;
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.copyInstruction)));
        let alltext: number = await $$(this.selectors.copyInstruction).count();
        for (let i = 0; i < alltext; i++) {
            let textInst = await $$(this.selectors.copyInstruction).get(i);
            let nm: string = await textInst.getText();
            textInstruction = textInstruction + nm;
        }
        return textInstruction;
    }

    async setOwnerGroupDropdownValue(ownerGroup: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ownerGroupDropdown, ownerGroup);
    }

    async clickSaveCaseTemplate(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async getValueOfCaseSummary(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseSummaryValueOnCopy)));
        return await $(this.selectors.caseSummaryValueOnCopy).getAttribute('value');
    }

    async getValueOfCaseCompany(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseCompanyValueOnCopy)));
        return await $(this.selectors.caseCompanyValueOnCopy).getText();
    }

    async getValueOfSupportCompany(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.supportCompanyValueOnCopy)));
        return await $$(this.selectors.supportCompanyValueOnCopy).get(0).getText();
    }

    async getValueOfSupportGroup(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.supportGroupValueOnCopy)));
        return await $$(this.selectors.supportGroupValueOnCopy).get(2).getText();
    }

    async getValueOfBuisnessUnit(): Promise<string> {
        return await $$(this.selectors.supportOrganizationValueOnCopy).get(1).getText();
    }

    async getValueOfDepartement(): Promise<string> {
        return await $(this.selectors.departmentValueOnCopy).getText();
    }

    async getValueOfAssignee(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneeValueOnCopy)));
        return await $$(this.selectors.assigneeValueOnCopy).get(3).getText();
    }

    async getValueOfFlowset(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.FlowsetValueOnCopy)));
        return await $(this.selectors.FlowsetValueOnCopy).getText();
    }

    async getValueOfStatusReason(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.statusReasonValueOnCopy)));
        return await $(this.selectors.statusReasonValueOnCopy).getText();
    }

    async getValueOfTemplateStatus(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.templateStatusValueOnCopy)));
        return await $(this.selectors.templateStatusValueOnCopy).getText();
    }

    async isOwnerGroupEmpty(): Promise<boolean> {
        let element = await $(this.selectors.ownerGroupValueOnCopy)
        let value = await element.getAttribute('aria-label');
        if (value == '') {
            return true;
        } else { return false; }
    }

    async getValueOfOwnerGroup(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.ownerGroupValueOnCopy)));
        return await $(this.selectors.ownerGroupValueOnCopy).getText();
    }

    async isOwnerCompanyEmpty(): Promise<boolean> {
        let element = await $(this.selectors.OwnerCompanyValueOnCopy)
        let value = await element.getAttribute('aria-label');
        if (value == '') {
            return true;
        } else { return false; }
    }

    async getValueOfOwnerCompany(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.OwnerCompanyValueOnCopy)));
        return await $(this.selectors.OwnerCompanyValueOnCopy).getText();
    }

    async getValueOfIdentityValidation(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.identityValidationValueOnCopy)));
        return await $(this.selectors.identityValidationValueOnCopy).getText();
    }

    async getValueOfAssignementMethod(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignmentMethodValueOnCopy)));
        return await $(this.selectors.assignmentMethodValueOnCopy).getText();
    }

    async getValueOfTaskFailureConfiguration(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskFailureConfigurationValueOnCopy)));
        return await $(this.selectors.taskFailureConfigurationValueOnCopy).getText();
    }

    async getValueOfAllowReopen(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.allowCaseReopenValueOnCopy)));
        return await $(this.selectors.allowCaseReopenValueOnCopy).getText();
    }

    async getValueOfResolutionCode(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.resolutionCodeValueOnCopy)));
        return await $(this.selectors.resolutionCodeValueOnCopy).getAttribute('aria-checked') == 'true' ? true : false;
    }

    async getValueOfResolutionDescription(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.resoltuionDescriptionValueOnCopy)));
        return await $(this.selectors.resoltuionDescriptionValueOnCopy).getAttribute('aria-checked') == 'true' ? true : false;
    }

    async getValueOfcaseStatus(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseStatusValueOnCopy)));
        return await $(this.selectors.caseStatusValueOnCopy).getText();
    }

    async isValueOfCasePriorityPresent(priorityValue: string): Promise<boolean> {
        //        return await browser.wait(this.EC.or(async () => {
        return await $(this.selectors.casePriorityValueOnCopy).getAttribute('aria-label') == priorityValue;
        //            return value;
        //        }), 3000);
    }

    async getValueOfCaseDescription(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseDescriptionValueOnCopy)));
        return await $(this.selectors.caseDescriptionValueOnCopy).getText();
    }

    async getValueofCaseCategoryTier1(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseCategoryTier1ValueOnCopy)));
        return await $(this.selectors.caseCategoryTier1ValueOnCopy).getText();
    }
    async getValueofCaseCategoryTier2(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseCategoryTier2ValueOnCopy)));
        return await $(this.selectors.caseCategoryTier2ValueOnCopy).getText();
    }
    async getValueofCaseCategoryTier3(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseCategoryTier3ValueOnCopy)));
        return await $(this.selectors.caseCategoryTier3ValueOnCopy).getText();
    }

    async setCompanyName(companyValue: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyDropDown, companyValue);
    }

    async clickCancelCaseTemplate(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }
}

export default new CopyCaseTemplate();