import { $, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
import ckeditorValidationPo from '../../../pageobject/common/ck-editor/ckeditor-validation.po';
import util from "../../../utils/util.common";

class Copytaskpage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        sourceProcessname: '[rx-view-component-id="9f29e10e-dedf-4bab-8372-5b40002d999a"] input',
        toggleBox: '[rx-view-component-id="6c10fd9d-675a-44ec-abbf-bf9f694099a8"] .d-icon-circle_slash_o',
        toggleBox1: '6c10fd9d-675a-44ec-abbf-bf9f694099a8',
        processName: '[ng-model="process.name"] .rx-input',
        newProcessName: '[rx-view-component-id="e8a2406c-6991-4ea1-bfdf-bde29abe2ef7"] input',
        templateStatus: '09db292a-212a-433e-8c20-a92f8c4e5168',
        saveCopyTemplate: '[rx-view-component-id="5001f6ea-4438-4485-bdd2-c952a12a1a34"] button',
        cancelCopyTemplate: '[rx-view-component-id="3f760e5f-70e9-4fbf-8b05-cd7d460f8818"] button',
        templateName: '[rx-view-component-id="2e4ef0dc-9b73-4c8f-afe6-221ddf0594c7"] input',
        taskSummary: '[rx-view-component-id="c19d336e-7339-4970-b69a-100108d672fd"] input',
        sourceProcessNameValue: '[rx-view-component-id="9f29e10e-dedf-4bab-8372-5b40002d999a"] input',
        companyGiud: 'f62bd26b-c464-4dff-ab7b-e4446d1cbf99',
        ownerCompanyGiud: '87ec3995-3350-4e3f-ab19-0f1e7846fbd7',
        ownerGroupGuid: '61278673-8106-419c-83e4-a9e00f12f835',
        ownerGroupValueOnCopy: '[rx-view-component-id="61278673-8106-419c-83e4-a9e00f12f835"] .ui-select-match-text',
        ownerBusinessUnitGuid: 'a81cc2df-7b89-4367-81f7-f0ad5e786ca2',
        showMoreDescriptionLink: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] button.more',
        rightAlignLocator: '[rx-view-component-id="b9b752cf-8cef-4598-9a8d-85748b13f0d7"] div.cke_wysiwyg_div'
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
        await util.selectDropDown(this.selectors.templateStatus, status);
    }

    async selectTaskCompany(companyName: string): Promise<void> {
        await util.selectDropDown(this.selectors.companyGiud, companyName);
    }

    async selectOwnerCompany(companyName: string): Promise<void> {
        await util.selectDropDown(this.selectors.ownerCompanyGiud, companyName);
    }

    async selectOwnerGroup(ownerGroup: string): Promise<void> {
        await util.selectDropDown(this.selectors.ownerGroupGuid, ownerGroup);
    }

    async selectOwnerBusinessUnit(businessUnit: string): Promise<void> {
        await util.selectDropDown(this.selectors.ownerBusinessUnitGuid, businessUnit);
    }

    async clickShowMoreDescriptionLink(): Promise<void> {
        return await $(this.selectors.showMoreDescriptionLink).click();
    }

    async isTextRightAlignInCkEditorTextArea(rightAlignText: string): Promise<boolean> {
        let rightAlignLocator: ElementFinder = await $(this.selectors.rightAlignLocator);
        return await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText, rightAlignLocator);
    }
}

export default new Copytaskpage();