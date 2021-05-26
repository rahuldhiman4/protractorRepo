import { $, browser, protractor, ProtractorExpectedConditions, element, by, $$ } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import ckeditorValidationPo from '../../../pageobject/common/ck-editor/ckeditor-validation.po';

class EditTaskTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        manageProcessLink: '[rx-view-component-id="60aedaf2-92a3-433f-8024-34e26e71350c"] button',
        taskCompany: '3d1b6f6b-3dfa-4ff7-80f1-cef32c2c93e0',
        editMetadataLink: '[rx-view-component-id="8b8bfec6-0ee2-42a3-be4b-ac4f37d060f1"] button',
        ownerCompany: 'fa0f139c-5998-4544-9a3e-6dcac497611c',
        templateStatusGuid: '279fd957-576d-4428-b503-a1330cbd9498',
        ownerGroup: 'fc285db1-c1e2-450c-96fd-3f074259f9c6',
        businessGuid: 'c81e8931-af24-4c9f-8fd5-fb2ea12c77dc',
        taskTypeValue: '[rx-view-component-id="cee6d303-5db9-4b3a-98e1-3096ffebf363"] button',
        cancelButton: '[rx-view-component-id="7c66f7cb-612d-4ef5-b3f5-79f6d96b0083"] button',
        saveButton: '[rx-view-component-id="6649c51c-e27e-4026-ab4a-de5f40216ea9"] button',
        descriptionGuid: 'd8841534-3cc3-464c-b05e-5200d668d859',
        summary: '[rx-view-component-id="e1aaa2da-51a0-41a0-a806-6a935fa27d94"] input',
        taskCategoryDrpDown1: '905759fe-32c2-4a61-a262-749265285bf3',
        taskCategoryDrpDown2: 'afa2e3f2-8cba-46be-821c-3bf3150ebebe',
        taskCategoryDrpDown3: 'b95868c7-6b36-4e92-9114-34e3fd97456d',
        taskCategoryDrpDown4: 'c73223d0-aa49-4f1c-bee2-048f10e208f2',
        priority: '0cf493f2-9e6b-4f23-bf3e-ba210c2baef8',
        saveMetadata: '[rx-view-component-id="39f08c8c-48ad-450e-b5f2-f379a4432666"] button',
        cancelMetadata: '[rx-view-component-id="209049eb-ef6d-4ddd-8ee4-257ff7a878e5"] button',
        label: 'e820992c-e571-4729-b7cd-6c52eda13dd5',
        templateStatusAttribute: '[rx-view-component-id="279fd957-576d-4428-b503-a1330cbd9498"] button',
        mangeDynamicField: '[rx-view-component-id="60aedaf2-92a3-433f-8024-34e26e71350c"] .d-icon-left-pencil',
        dynamicField: '[rx-view-component-id="60aedaf2-92a3-433f-8024-34e26e71350c"] .d-textfield__item',
        taskTypeValueDisabled: '[rx-view-component-id="cee6d303-5db9-4b3a-98e1-3096ffebf363"] button',
        processNameValue: '[rx-view-component-id="534ab8af-7e9d-49a9-8cab-c3ab1aa38c91"] input',
        taskDescription: 'b9b752cf-8cef-4598-9a8d-85748b13f0d7',
        templateStatus: '[rx-view-component-id="279fd957-576d-4428-b503-a1330cbd9498"] .dropdown',
        labelValue: '[rx-view-component-id="e820992c-e571-4729-b7cd-6c52eda13dd5"] button'
    }

    async selectPriorityValue(priority: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.priority, priority);
    }

    async isAutomatedTaskTypeDisabled(): Promise<boolean> {
        return await $(this.selectors.taskTypeValueDisabled).getAttribute('aria-disabled') == 'true' ? true : false;
    }

    async isProcessNameDisabled(): Promise<boolean> {
        return await $(this.selectors.processNameValue).getAttribute('readOnly') == 'true' ? true : false;
    }

    async selectTaskCategoryTier1(category1: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.taskCategoryDrpDown1, category1);
    }

    async selectTaskCategoryTier1_v(category1: string): Promise<void> {
        await $('[rx-view-component-id="905759fe-32c2-4a61-a262-749265285bf3"] .dropdown-toggle').click();
        await browser.sleep(2000);
        await (await element(by.cssContainingText('[rx-view-component-id="905759fe-32c2-4a61-a262-749265285bf3"] button.dropdown-item', category1))).click();
    }

    async selectTaskCategoryTier2(category2: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.taskCategoryDrpDown2, category2);
    }

    async selectTaskCategoryTier2_v(category2: string): Promise<void> {
        await $('[rx-view-component-id="afa2e3f2-8cba-46be-821c-3bf3150ebebe"] .dropdown-toggle').click();
        await browser.sleep(2000);
        await (await element(by.cssContainingText('[rx-view-component-id="afa2e3f2-8cba-46be-821c-3bf3150ebebe"] button.dropdown-item', category2))).click();
    }

    async selectTaskCategoryTier3(category3: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.taskCategoryDrpDown3, category3);
    }

    async selectTaskCategoryTier3_v(category3: string): Promise<void> {
        await $('[rx-view-component-id="b95868c7-6b36-4e92-9114-34e3fd97456d"] .dropdown-toggle').click();
        await browser.sleep(2000);
        await (await element(by.cssContainingText('[rx-view-component-id="b95868c7-6b36-4e92-9114-34e3fd97456d"] button.dropdown-item', category3))).click();
    }

    async selectTaskCategoryTier4(category4: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.taskCategoryDrpDown4, category4);
    }

    async selectTaskCategoryTier4_v(category4: string): Promise<void> {
        await $('[rx-view-component-id="c73223d0-aa49-4f1c-bee2-048f10e208f2"] .dropdown-toggle').click();
        await browser.sleep(2000);
        await (await element(by.cssContainingText('[rx-view-component-id="c73223d0-aa49-4f1c-bee2-048f10e208f2"] button.dropdown-item', category4))).click();
    }

    async selectLabel(label: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.label, label);
    }

    async getLabelValue(): Promise<string> {
        return await $(this.selectors.labelValue).getText();
    }

    async selectTaskCompany(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.taskCompany, company);
    }

    async selectOwnerCompany(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.ownerCompany, company);
    }

    async selectTemplateStatus(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.templateStatusGuid, company);
    }

    async selectOwnerGroup(group: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.ownerGroup, group);
    }

    async selectBusinessUnit(business: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.businessGuid, business);
    }

    async clickOnSaveButton() {
        await $(this.selectors.saveButton).click();
    }

    async clickOnSaveMetadata() {
        await $(this.selectors.saveMetadata).click();
    }

    async clickOnEditMetadataLink() {
        await $(this.selectors.editMetadataLink).click();
    }

    async setDescription(input: string) {
        await utilityCommon.setCKEditor(input, this.selectors.descriptionGuid);
    }

    async setSummary(input: string) {
        await $(this.selectors.summary).clear();
        await $(this.selectors.summary).sendKeys(input);
    }

    async getTaskTypeValueAttribute(attribute: string): Promise<string> {
        return await $(this.selectors.taskTypeValue).getAttribute(attribute);
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).isPresent().then(async (present) => {
            if (present) await $(this.selectors.cancelButton).click();
        })
    }

    async getTaskTypeValue(): Promise<string> {
        return await $(this.selectors.taskTypeValue).getText();
    }

    async isProcessNamePresentInTask(): Promise<boolean> {
        return await $(this.selectors.processNameValue).isDisplayed();
    }

    async isManageProcessLinkDisplayed(): Promise<boolean> {
        return await $(this.selectors.manageProcessLink).isDisplayed();
    }

    async isTemplateStatusDisabled(): Promise<boolean> {
        return (await $(this.selectors.templateStatusAttribute).getAttribute("aria-disabled")) == 'true';
    }

    async clickOnCancelMetadataButton() {
        await $(this.selectors.cancelMetadata).click();
    }

    async isMangeDynamicFieldLinkDisplayed(): Promise<boolean> {
        return await $(this.selectors.mangeDynamicField).isPresent().then(async (present) => {
            if (present) return await $(this.selectors.mangeDynamicField).isDisplayed();
            else return false;
        });
    }

    async isDynamicFieldPresent(dynamic: string): Promise<boolean> {
        let dynamicFields: number = await $$(this.selectors.dynamicField).count();
        for (let i = 0; i < dynamicFields; i++) {
            let field = await $$(this.selectors.dynamicField).get(i).getText();
            if (dynamic == field) {
                return true;
            }
        }
        return false;
    }

    async isCaseSummaryReadOnly(): Promise<boolean> {
        return await $(this.selectors.summary).getAttribute('readonly') == 'true' ? true : false;
    }

    async isImageDisplayedInCKE(value: string): Promise<boolean> {
        return await ckeditorValidationPo.isImageDisplayedInCKE(value, this.selectors.taskDescription);
    }

    async isTaskSummaryFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.summary).getAttribute('readonly') == 'true';
    }

    async isTemplateStatusFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.templateStatus).getAttribute('disabled') == 'true';
    }

    async isSaveTemplateBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }

    async isSaveTemplateMetadataBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.saveMetadata).isEnabled();
    }

    async getTaskCategoryTier4(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.taskCategoryDrpDown4}"] .rx-select__search-button-title`).getText();
    }


}

export default new EditTaskTemplate();