import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import utilityGrid from '../../../utils/utility.grid';

class CreateEmailTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="e7893fa6-ebfd-4e5f-b997-efcd337caa8b"] input',
        company: '[rx-view-component-id="e75104bf-e0a8-41db-ad84-31b9ef05fd9f"] button',
        moduleName: '[rx-view-component-id="8107085d-334f-4d50-beb9-ad10d8911144"] button',
        statusGuid: '2b5a61a3-16f8-4d1f-9a60-558c4575ed3a',
        labelGuid: 'dc8431e8-b40a-43fd-88fe-8d7dc884c069',
        description: '[rx-view-component-id="13687881-a1ff-4198-a22a-4d2583307e48"] input',
        localeGuid: 'c1ebf410-826a-434a-9f42-e8c44ed8dcdb',
        localizeMessage: '[rx-view-component-id="d80f1ed8-5f3a-4ad1-bd5a-aa4b68879cc2"] button',
        searchButtonClick: '[rx-view-component-id="8b59641c-2fca-4d96-8395-03e232cf05de"] .d-icon-search',
        editButton: '.d-icon-left-pencil',
        body: '.cke_wysiwyg_div',
        editMessageTextBladeSubjectMessage: '[rx-view-component-id="87825f39-f76b-4a2b-9d04-1e521562dc00"] input',
        newLocalizeMessageEmailMessageSubject: '[rx-view-component-id="31bcbb1a-0420-481c-8233-d9d9e117b230"] input',
        newLocalizeMessageEmailMessageLocalizeDropDownGuid: '1389f79d-65df-4090-9bd5-76bd2981a775',
        saveButton: '[rx-view-component-id="2a376fd7-bf9c-459b-bdf1-52456c5f972c"] button',
        editBodySaveButton: '[rx-view-component-id="498a2cf3-8866-4303-996a-61dc33e4a400"] button',
        editSubjectSaveButton: '[rx-view-component-id="cd6ddce5-4729-4cc9-a5a4-6f76e967de03"] button',
        localizeMessageSaveButton: '[rx-view-component-id="1ff4ce55-6547-451c-b7ef-afe1c93dd194"] button',
        cancelButton: 'rx-action-button .btn-secondary',
        gridGuid: '8b59641c-2fca-4d96-8395-03e232cf05de',
        msgCheckBox: '[rx-view-component-id="8b59641c-2fca-4d96-8395-03e232cf05de"] span.radio__label',
        editPencilButton: '[rx-view-component-id="8b59641c-2fca-4d96-8395-03e232cf05de"] .d-icon-left-pencil',
        statusField: '[rx-view-component-id="2b5a61a3-16f8-4d1f-9a60-558c4575ed3a"] button',
        attachLink: 'bwf-button-link button',
        removeAttachment: 'bwf-attachment-viewer .d-icon-cross',
        AttachedfileName: 'bwf-attachment-viewer .bwf-attachment-container__file-name',
        lobValue: '[rx-view-component-id="c6cbd5e4-3897-493c-a7e0-455c8262e198"] .rx-select__search-button-title'
    }

    async clickOnLocalizeMessageButton(): Promise<void> {
        await $(this.selectors.localizeMessage).click();
    }

    async selectLocalizeDropDownOfNewLocalizedEmailMessage(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.newLocalizeMessageEmailMessageLocalizeDropDownGuid, value);
    }

    async setSubjectOfNewLocalizedEmailMessage(subject: string): Promise<void> {
        await $(this.selectors.newLocalizeMessageEmailMessageSubject).sendKeys(subject);
    }

    async setBody(body: string): Promise<void> {
        await $(this.selectors.body).sendKeys(body);
    }

    async clickOnGridEditButton(): Promise<void> {
        await $(this.selectors.editButton).click();
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnHeader,this.selectors.gridGuid);
    }

    async clickOnGridSearchIcon(): Promise<void> {
        await $(this.selectors.searchButtonClick).click();
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilityGrid.searchRecord(value,this.selectors.gridGuid);
    }

    async searchAndSelectGridRecord(value: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(value, this.selectors.gridGuid);
    }

    async isModuleNameDisabled(): Promise<boolean> {
        return await $('[rx-view-component-id="2a3f6607-4335-4540-aedf-f71a47c6b575"] button').getAttribute('aria-disabled')=="true";
    }

    async isCompanyDropDownDisabled(): Promise<boolean> {
        return await $('[rx-view-component-id="e75104bf-e0a8-41db-ad84-31b9ef05fd9f"] button').getAttribute('aria-disabled')=="true";
    }

    async isLocalizedMessageButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.localizeMessage).isDisplayed();
    }

    async selectStatusDropDown(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusGuid, value);
    }

    async selectLabelDropDown(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.labelGuid, value);
    }

    async updateDescription(descriptionText: string): Promise<void> {
        await $(this.selectors.description).clear();
        await $(this.selectors.description).sendKeys(descriptionText);
    }

    async selectlocaleDropDown(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.localeGuid, value);
    }

    async updateEditMessageTextBladeBody(body: string): Promise<void> {
        await $(this.selectors.body).clear();
        await $(this.selectors.body).sendKeys(body);
    }

    async updateEditMessageTextBladeSubject(subject: string): Promise<void> {
        await $(this.selectors.editMessageTextBladeSubjectMessage).clear();
        await $(this.selectors.editMessageTextBladeSubjectMessage).sendKeys(subject);
    }

    async clickOnEditMessageTextBladeCancelButtonForBody(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async clickEditBodySaveButton(): Promise<void> {
        await $(this.selectors.editBodySaveButton).click();
    }

    async clickEditSubjectSaveButton(): Promise<void> {
        await $(this.selectors.editSubjectSaveButton).click();
    }

    async clickLocalizeMessageSaveButton(): Promise<void> {
        await $(this.selectors.localizeMessageSaveButton).click();
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }

    async clearGridSearchBox(): Promise<void> {
        await utilityGrid.clearSearchBox();
    }

    async isLocalizedMessageButtonEnabled(): Promise<boolean> {
        return $(this.selectors.localizeMessage).isEnabled();
    }

    async isTemplateNameEnabled(): Promise<boolean> {
        return await $(this.selectors.templateName).getAttribute('readonly') == 'false';
    }

    async isStatusFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.statusField).getAttribute('aria-disabled') == 'false';
    }

    async clickOnBodyCheckbox(): Promise<void> {
        await $$(this.selectors.msgCheckBox).first().click();
    }

    async clickOnSubjectCheckbox(): Promise<void> {
        await $$(this.selectors.msgCheckBox).last().click();
    }

    async isEditButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.editPencilButton).isEnabled();
    }

    async clickOnAttachLink(): Promise<void> {
        await $(this.selectors.attachLink).click();
    }

    async removeAttachedDocument(removeattachmentNumber: number): Promise<void> {
        await $$(this.selectors.removeAttachment).get(removeattachmentNumber - 1).click();
    }

    async isAttachedFileNameDisplayed(fileName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.AttachedfileName, fileName)).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText(this.selectors.AttachedfileName, fileName)).isDisplayed();
            else return false;
        });
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new CreateEmailTemplateBlade();
