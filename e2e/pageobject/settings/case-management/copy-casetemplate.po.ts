import { ICaseTemplate } from 'e2e/data/ui/interface/caseTemplate.interface';
import { $, $$, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from "../../../utils/util.common";

class CopyCaseTemplate {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="432c5f23-8c50-490d-9e94-8912ac4cd5e1"] input',
        saveButton: '[rx-view-component-id="fee3e577-173c-4dec-8265-ec81580ed26d"] button',
        caseCategoryTier1ValueOnCopy: '[rx-view-component-id="c8ce4fd2-d864-4544-baf7-4b27b59c12c3"] .ui-select-match-text',
        caseCategoryTier2ValueOnCopy: '[rx-view-component-id="42e3edda-f057-41e2-8160-7a9482e847dc"] .ui-select-match-text',
        caseCategoryTier3ValueOnCopy: '[rx-view-component-id="bb675d8f-82bc-497b-8b99-dfc1baa1dd41"] .ui-select-match-text',
        casePriorityValueOnCopy: '[rx-view-component-id="98327bc1-9ada-48f9-ab88-9787ddecd409"] .ui-select-match-text',
        caseSummaryValueOnCopy: '[rx-view-component-id="e3cb1a92-1e94-477d-93fa-b63b29c1c129"] .d-textfield__rx-value',
        statusReasonValueOnCopy: '[rx-view-component-id="cfde7589-436d-4835-aab8-f5d71e04f91a"] .d-textfield__rx-value',
        caseCompanyValueOnCopy: '[rx-view-component-id="127214a1-bfc0-4a8c-acb7-cd2be137fa3c"] .ui-select-match-text',
        FlowsetValueOnCopy: '[rx-view-component-id="e29c6d30-5ac3-4f18-a4c6-9192017d46ed"] .ui-select-match-text',
        templateStatusValueOnCopy: '[rx-view-component-id="3bebf8c9-1396-487a-b9ea-bf1e39d4d475"] .ui-select-match-text',
        OwnerCompanyValueOnCopy: '[rx-view-component-id="84efe67b-c540-4fd9-9a7a-724e9390656a"] .ui-select-match-text',
        ownerGroupValueOnCopy: '[rx-view-component-id="b3ebc604-b7dc-4090-90a5-9515d1ea7f3e"] .ui-select-match-text',
        supportCompanyValueOnCopy: '[rx-view-component-id="cc7e2480-5376-436d-b1aa-90bad27dbf64"] .ui-select-match-text',
        assigneeValueOnCopy: '[rx-view-component-id="318537b2-ab00-45d2-a14b-7ffef9987933"] .ui-select-match-text',
        supportGroupValueOnCopy: '[rx-view-component-id="c02d322f-c661-4aeb-8036-94bee6821baa"] .ui-select-match-text',
        identityValidationValueOnCopy: '[rx-view-component-id="768c4f0a-309f-4e7f-ba88-a0ef9a169d6f"] .ui-select-match-text',
        assignmentMethodValueOnCopy: '[rx-view-component-id="1930b678-6f96-41a3-a127-a483fc8ffd26"] .ui-select-match-text',
        taskFailureConfigurationValueOnCopy: '[rx-view-component-id="317fe9a4-3ca7-4a55-a647-18163fd4a572"] .ui-select-match-text',
        allowCaseReopenValueOnCopy: '[rx-view-component-id="cd24485f-5719-48e3-8d76-4320f5d13c4c"] .ui-select-match-text',
        caseStatusValueOnCopy: '[rx-view-component-id="6b1d1112-129e-4c27-82b2-2248f12dc09a"] .ui-select-match-text',
        resolutionCodeValueOnCopy: '[rx-view-component-id="c3d9b91a-0198-4b61-b13a-59d46d3b0103"] .d-textfield__rx-value',
        resoltuionDescriptionValueOnCopy: '[rx-view-component-id="b5b2d17e-e6b1-44e9-bbd5-23d74b3f1a2a"] .d-textfield__rx-value',
        caseDescriptionValueOnCopy: '[rx-view-component-id="3b3506af-b9a2-47bd-88f7-032092bc1264"] [ux-bind-html]',
        ownerGroupDropdown: 'b3ebc604-b7dc-4090-90a5-9515d1ea7f3e',
        copyInstruction: '[rx-view-component-id="162ce9d1-22d1-42a6-8360-f3d1c8dc3a20"] ul span',
        businessUnitValueOnCopy: '[rx-view-component-id="0bfe6a89-2484-44d1-bae8-9353753f78fa"] .ui-select-match-text',
        departmentValueOnCopy: '[rx-view-component-id="6c570cf5-7f7b-4141-bd17-755e202e7095"] .ui-select-match-text',
        companyDropDown: '127214a1-bfc0-4a8c-acb7-cd2be137fa3c',
        cancelButton: '[rx-view-component-id="be371341-8b3f-4433-93fa-33d242984010"] button',
    }

    async setTemplateName(templateNameValue: string): Promise<void> {
        let element = $(this.selectors.templateName);
        //        await browser.wait(this.EC.visibilityOf(element));
        await element.clear();
        await element.sendKeys(templateNameValue);
    }

    async getCopyCaseTemplateInstruction(): Promise<string> {
        var textInstruction;
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.copyInstruction)));
        var alltext: number = await $$(this.selectors.copyInstruction).count();
        for (var i = 0; i < alltext; i++) {
            var textInst = await $$(this.selectors.copyInstruction).get(i);
            var nm: string = await textInst.getText();
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
        return await $(this.selectors.caseSummaryValueOnCopy).getText();
    }

    async getValueOfCaseCompany(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseCompanyValueOnCopy)));
        return await $(this.selectors.caseCompanyValueOnCopy).getText();
    }

    async getValueOfSupportCompany(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.supportCompanyValueOnCopy)));
        return await $(this.selectors.supportCompanyValueOnCopy).getText();
    }

    async getValueOfSupportGroup(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.supportGroupValueOnCopy)));
        return await $(this.selectors.supportGroupValueOnCopy).getText();
    }

    async getValueOfBuisnessUnit(): Promise<string> {
        return await $(this.selectors.businessUnitValueOnCopy).getText();
    }

    async getValueOfDepartement(): Promise<string> {
        return await $(this.selectors.departmentValueOnCopy).getText();
    }

    async getValueOfAssignee(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneeValueOnCopy)));
        return await $(this.selectors.assigneeValueOnCopy).getText();
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
        return await $(this.selectors.resolutionCodeValueOnCopy).getText() == "Yes" ? true : false;
    }

    async getValueOfResolutionDescription(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.resoltuionDescriptionValueOnCopy)));
        return await $(this.selectors.resoltuionDescriptionValueOnCopy).getText() == "Yes" ? true : false;
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