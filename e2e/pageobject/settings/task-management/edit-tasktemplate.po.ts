import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class EditTaskTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        manageProcessLink: '[rx-view-component-id="60aedaf2-92a3-433f-8024-34e26e71350c"] button',
        taskCompany: '3d1b6f6b-3dfa-4ff7-80f1-cef32c2c93e0',
        editMetadataLink: '[rx-view-component-id="8b8bfec6-0ee2-42a3-be4b-ac4f37d060f1"] .edit-link',
        ownerCompany: 'fa0f139c-5998-4544-9a3e-6dcac497611c',
        templateStatus: '279fd957-576d-4428-b503-a1330cbd9498',
        ownerGroup: '908e526e-917a-4360-94e9-768362f6a573',
        taskTypeValue: '[rx-view-component-id="cee6d303-5db9-4b3a-98e1-3096ffebf363"] .ui-select-container',
        cancelButton: '[rx-view-component-id="7c66f7cb-612d-4ef5-b3f5-79f6d96b0083"] button',
        processNameValue: '[rx-view-component-id="880bd8d5-1b16-4c74-a377-4135919c362a"] input',
        saveButton: '[rx-view-component-id="6649c51c-e27e-4026-ab4a-de5f40216ea9"] button',
        description: '[rx-view-component-id="d8841534-3cc3-464c-b05e-5200d668d859"] textarea',
        summary: '[rx-view-component-id="e1aaa2da-51a0-41a0-a806-6a935fa27d94"] input',
        taskCategoryDrpDown1: 'cab2e62d-090e-4281-985d-2f021bb01a9f',
        taskCategoryDrpDown2: '27a4fb75-0d9c-417b-9638-698f371ec4ec',
        taskCategoryDrpDown3: '414723be-a5c7-4271-b9b0-d76f07023682',
        saveMetadata: '[rx-view-component-id="39f08c8c-48ad-450e-b5f2-f379a4432666"] button',
        cancelMetadata: '[rx-view-component-id="209049eb-ef6d-4ddd-8ee4-257ff7a878e5"] button',
        templateStatusAttribute: '[rx-view-component-id="279fd957-576d-4428-b503-a1330cbd9498"] .btn-default',
    }

    async selectTaskCategoryTier1(category1: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.taskCategoryDrpDown1, category1);
    }

    async selectTaskCategoryTier2(category2: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.taskCategoryDrpDown2, category2);
    }

    async selectTaskCategoryTier3(category3: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.taskCategoryDrpDown3, category3);
    }

    async selectTaskCompany(company: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.taskCompany, company);
    }

    async selectOwnerCompany(company: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ownerCompany, company);
    }

    async selectTemplateStatus(company: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.templateStatus, company);
    }

    async selectOwnerGroup(group: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ownerGroup, group);
    }

    async clickOnSaveButton() {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
//        await utilCommon.waitUntilPopUpDisappear();
    }

    async clickOnSaveButtonWithoutWait() {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnSaveMetadata() {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveMetadata)));
        await $(this.selectors.saveMetadata).click();
    }

    async clickOnEditMetadataLink() {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editMetadataLink)));
        await $(this.selectors.editMetadataLink).click();
    }

    async setDescription(input: string) {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.description)));
        await $(this.selectors.description).clear();
        await $(this.selectors.description).sendKeys(input);
    }

    async setSummary(input: string) {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.summary)));
        await $(this.selectors.summary).clear();
        await $(this.selectors.summary).sendKeys(input);
    }

    async getTaskTypeValueAttribute(attribute: string): Promise<string> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.taskTypeValue)));
        return await $(this.selectors.taskTypeValue).getAttribute(attribute);
    }

    async clickOnCancelButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async getTaskTypeValue(): Promise<string> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.taskTypeValue)));
        return await $(this.selectors.taskTypeValue).getText();
    }

    async isProcessNamePresentInTask(): Promise<boolean> {
//        await browser.wait(this.EC.presenceOf($(this.selectors.processNameValue)));
        return await $(this.selectors.processNameValue).isDisplayed();
    }

    async isManageProcessLinkDisplayed(): Promise<boolean> {
//        await browser.wait(this.EC.presenceOf($(this.selectors.manageProcessLink)));
        return await $(this.selectors.manageProcessLink).isDisplayed();
    }

    async isTemplateStatusDisabled(): Promise<boolean> {
//        await browser.wait(this.EC.presenceOf($(this.selectors.templateStatusAttribute)));
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelMetadata)));
        return (await $(this.selectors.templateStatusAttribute).getAttribute("disabled")) =='true';
    }

    async clickOnCancelMetadataButton() {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelMetadata)));
        await $(this.selectors.cancelMetadata).click();
    }
}

export default new EditTaskTemplate();