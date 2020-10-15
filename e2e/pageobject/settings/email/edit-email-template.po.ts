import { $, browser, element, by, protractor, ProtractorExpectedConditions, $$ } from "protractor";
import utilCommon from '../../../utils/util.common';
import utilGrid from '../../../utils/util.grid';

class CreateEmailTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="a01af9fa-da73-44e5-a304-8f8c7632b1a0"] input',
        company: '[rx-view-component-id="af048482-fdf7-4650-ab4b-75e262e00445"] .ui-select-toggle',
        moduleName: '[rx-view-component-id="8107085d-334f-4d50-beb9-ad10d8911144"] .ui-select-toggle',
        statusGuid: 'a1e0042f-41e7-4c80-9cd8-014786f346e6',
        labelGuid: '73d1ec34-830a-4e9b-9d7a-484ff73bbdb4',
        description: '[rx-view-component-id="f7437c9e-1ed7-4aac-974a-e4d4a643ee35"] input',
        localeGuid: '71db023a-4979-4f58-a026-6aeda2edd96b',
        localizeMessage: '[rx-view-component-id="88ea24dd-ddad-489f-904a-89e43f80f5e6"] button',
        searchButtonClick: '.rx-toggle-search-button',
        editButton: '.rx-button-bar-action-buttons__inner .rx-action-button_clear button',
        body: '.cke_wysiwyg_div',
        editMessageTextBladeSubjectMessage: '[rx-view-component-id="2edd6ab4-d1e5-456e-879c-f8ca22bfbb32"] textarea',
        newLocalizeMessageEmailMessageSubject: '[rx-view-component-id="31bcbb1a-0420-481c-8233-d9d9e117b230"] input',
        newLocalizeMessageEmailMessageLocalizeDropDownGuid: '1389f79d-65df-4090-9bd5-76bd2981a775',
        saveButton: '[rx-view-component-id="2a376fd7-bf9c-459b-bdf1-52456c5f972c"] button',
        editBodySaveButton: '[rx-view-component-id="498a2cf3-8866-4303-996a-61dc33e4a400"] button',
        editSubjectSaveButton: '[rx-view-component-id="cd6ddce5-4729-4cc9-a5a4-6f76e967de03"] button',
        localizeMessageSaveButton: '[rx-view-component-id="1ff4ce55-6547-451c-b7ef-afe1c93dd194"] button',
        cancelButton: '.rx-button-bar-action-buttons__inner .d-button_secondary',
        gridGuid: '8b59641c-2fca-4d96-8395-03e232cf05de',
        msgCheckBox: '[rx-view-component-id="8b59641c-2fca-4d96-8395-03e232cf05de"] .ui-grid-row-header-cell',
        editPencilButton: '[rx-view-component-id="8b59641c-2fca-4d96-8395-03e232cf05de"] .d-icon-left-pencil',
        statusField: '[rx-view-component-id="a1e0042f-41e7-4c80-9cd8-014786f346e6"] .ui-select-match',
        attachLink: '.rx-attachment-attach-icon button',
        removeAttachment: '.rx-attachment-view-remove',
        AttachedfileName: '.rx-attachment-view-name'
    }

    async clickOnLocalizeMessageButton(): Promise<void> {
        await $(this.selectors.localizeMessage).click();
    }

    async selectLocalizeDropDownOfNewLocalizedEmailMessage(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.newLocalizeMessageEmailMessageLocalizeDropDownGuid, value);
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
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid, columnHeader);
    }

    async clickOnGridSearchIcon(): Promise<void> {
        await $(this.selectors.searchButtonClick).click();
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilGrid.searchOnGridConsole(value);
    }

    async searchAndSelectGridRecord(value: string): Promise<void> {
        await utilGrid.searchAndSelectGridRecord(value);
    }

    async isModuleNameDisabled(): Promise<boolean> {
        return await $(this.selectors.moduleName).getAttribute("disabled") == "true";
    }

    async isCompanyDropDownDisabled(): Promise<boolean> {
        return await $(this.selectors.company).getAttribute("disabled") == "true";
    }

    async isLocalizedMessageButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.localizeMessage).isDisplayed();
    }

    async selectStatusDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, value);
    }

    async selectLabelDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.labelGuid, value);
    }

    async updateDescription(descriptionText: string): Promise<void> {
        await $(this.selectors.description).clear();
        await $(this.selectors.description).sendKeys(descriptionText);
    }

    async selectlocaleDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.localeGuid, value);
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
        await utilGrid.clearGridSearchBox();
    }

    async isLocalizedMessageButtonEnabled(): Promise<boolean> {
        return $(this.selectors.localizeMessage).isEnabled();
    }

    async isTemplateNameEnabled(): Promise<boolean> {
        return await $(this.selectors.templateName).getAttribute('readonly') == 'false';
    }

    async isStatusFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.statusField).getAttribute('readonly') == 'false';
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
}

export default new CreateEmailTemplateBlade();
