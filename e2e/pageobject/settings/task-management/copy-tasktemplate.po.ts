import { $, $$, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
import ckeditorValidationPo from '../../../pageobject/common/ck-editor/ckeditor-validation.po';
import utilityCommon from "../../../utils/utility.common";

class Copytaskpage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        sourceProcessname: '[rx-view-component-id="9f29e10e-dedf-4bab-8372-5b40002d999a"] input',
        toggleBox: '[rx-view-component-id="6c10fd9d-675a-44ec-abbf-bf9f694099a8"] .d-icon-circle_slash_o',
        toggleBox1: '6c10fd9d-675a-44ec-abbf-bf9f694099a8',
        processName: '[rx-view-component-id="71e09acc-0077-4e55-9c24-7f6bdc90ce5d"] button',
        newProcessName: '[rx-view-component-id="eefdf45b-47af-48cb-8c8b-a82c73f7d5a4"] input',
        templateStatus: '09db292a-212a-433e-8c20-a92f8c4e5168',
        saveCopyTemplate: '[rx-view-component-id="5001f6ea-4438-4485-bdd2-c952a12a1a34"] button',
        cancelCopyTemplate: '[rx-view-component-id="3f760e5f-70e9-4fbf-8b05-cd7d460f8818"] button',
        templateName: '[rx-view-component-id="2e4ef0dc-9b73-4c8f-afe6-221ddf0594c7"] input',
        taskSummary: '[rx-view-component-id="c19d336e-7339-4970-b69a-100108d672fd"] input',
        sourceProcessNameValue: '[rx-view-component-id="9f29e10e-dedf-4bab-8372-5b40002d999a"] input',
        companyGiud: 'f62bd26b-c464-4dff-ab7b-e4446d1cbf99',
        ownerCompanyGiud: '440fe8fe-bf1e-4bb9-bee4-12ce466e9394',
        ownerGroupGuid: 'e5794ca0-c022-475f-95e3-132221b19e3b',
        ownerGroupValueOnCopy: '[rx-view-component-id="e5794ca0-c022-475f-95e3-132221b19e3b"] .dropdown-toggle',
        ownerBusinessUnitGuid: 'd4b7f9fd-5a48-4e56-be28-40133acaae54',
        showMoreDescriptionLink: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] button',
        rightAlignLocator: '[rx-view-component-id="b9b752cf-8cef-4598-9a8d-85748b13f0d7"] [style="text-align: right;"]',
    }

    async unSelectCopyExistingProcess(): Promise<string> {
        await $(this.selectors.toggleBox).click();
        return await $(this.selectors.processName).getAttribute('disabled');
    }

    async setTemplateName(input: string): Promise<void> {
        await $(this.selectors.templateName).clear();
        await $(this.selectors.templateName).sendKeys(input);
    }

    async isOwnerGroupEmpty(): Promise<boolean> {
        let element = await $(this.selectors.ownerGroupValueOnCopy)
        let value = await element.getAttribute('aria-label');
        if (value == '') {
            return true;
        } else { return false; }
    }

    async setTaskSummary(input: string): Promise<void> {
        await $(this.selectors.taskSummary).clear();
        await $(this.selectors.taskSummary).sendKeys(input);
    }

    async setNewProcessName(input: string): Promise<void> {
        await $(this.selectors.newProcessName).clear();
        await $(this.selectors.newProcessName).sendKeys(input);
    }

    async getProcessName(): Promise<string> {
        return await $(this.selectors.processName).getText();
    }

    async getSourceProcessName(): Promise<string> {
        return await $(this.selectors.sourceProcessname).getAttribute('value');
    }

    async clickSaveCopytemplate(): Promise<void> {
        await $(this.selectors.saveCopyTemplate).click();
    }

    async clickCancelCopytemplate(): Promise<void> {
        await $(this.selectors.cancelCopyTemplate).click();
    }

    async selectTemplateStatus(status: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.templateStatus, status);
    }

    async selectTaskCompany(companyName: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyGiud, companyName);
    }

    async selectOwnerCompany(companyName: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.ownerCompanyGiud, companyName);
    }

    async selectOwnerGroup(ownerGroup: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.ownerGroupGuid, ownerGroup);
    }

    async selectOwnerBusinessUnit(businessUnit: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.ownerBusinessUnitGuid, businessUnit);
    }

    async clickShowMoreDescriptionLink(): Promise<void> {
        return await $(this.selectors.showMoreDescriptionLink).click();
    }

    async isTextRightAlignInCkEditorTextArea(rightAlignText: string): Promise<boolean> {
        let rightAlignLocator: ElementFinder = await $$(this.selectors.rightAlignLocator).first();
        return await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText, rightAlignLocator);
    }

}

export default new Copytaskpage();