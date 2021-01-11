import { $, $$, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import utilityGrid from '../../../utils/utility.grid';

class EditAcknowledgementTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="a01af9fa-da73-44e5-a304-8f8c7632b1a0"] input',
        description: '[rx-view-component-id="f7437c9e-1ed7-4aac-974a-e4d4a643ee35"] input',
        moduleName: '[rx-view-component-id="8107085d-334f-4d50-beb9-ad10d8911144"] button',
        company: '[rx-view-component-id="af048482-fdf7-4650-ab4b-75e262e00445"] button',
        status: '[rx-view-component-id="a1e0042f-41e7-4c80-9cd8-014786f346e6"]  button',
        searchButton: '[rx-view-component-id="8b59641c-2fca-4d96-8395-03e232cf05de"] input[type="search"]',
        searchGuid: '8b59641c-2fca-4d96-8395-03e232cf05de',
        statusGuid: 'a1e0042f-41e7-4c80-9cd8-014786f346e6',
        labelGuid: '38ba050c-eb47-44a7-9efc-c724302560bf',
        localeGuid: '71db023a-4979-4f58-a026-6aeda2edd96b',
        localizeMessage: '[rx-view-component-id="88ea24dd-ddad-489f-904a-89e43f80f5e6"] button',
        editButton: '.d-icon-left-pencil',
        body: '.cke_wysiwyg_div',
        editMessageTextBladeSubjectMessage: '[rx-view-component-id="2edd6ab4-d1e5-456e-879c-f8ca22bfbb32"] textarea',
        newLocalizeMessageEmailMessageSubject: '[rx-view-component-id="31bcbb1a-0420-481c-8233-d9d9e117b230"] input',
        newLocalizeMessageEmailMessageLocalizeDropDownGuid: '1389f79d-65df-4090-9bd5-76bd2981a775',
        saveButton: '.rx-action-button_primary .d-button_primary',
        cancelButton: '.rx-button-bar-action-buttons__inner .d-button_secondary',
        gridGuid: '8b59641c-2fca-4d96-8395-03e232cf05de',
        msgCheckBox: '[rx-view-component-id="8b59641c-2fca-4d96-8395-03e232cf05de"] .ui-grid-row-header-cell',
        editPencilButton: '[rx-view-component-id="8b59641c-2fca-4d96-8395-03e232cf05de"] .d-icon-left-pencil',
        statusField: '[rx-view-component-id="a1e0042f-41e7-4c80-9cd8-014786f346e6"] .ui-select-match',
        lobValue: '[rx-view-component-id="88459fe5-ba0c-445f-b99d-838351677590"] .pull-left'
    }

    async getTemplateName(): Promise<string> {
        let newInput = $(this.selectors.templateName);
        await $(this.selectors.templateName).click();
        let templateName = await newInput.getAttribute('value');
        return templateName;
    }

    async getDescription(): Promise<string> {
        let newInput = $(this.selectors.description);
        await $(this.selectors.description).click();
        let templateName = await newInput.getAttribute('value');
        return templateName;
    }

    async getModuleName(): Promise<string> {
        return await $(this.selectors.moduleName).getText();
    }

    async getCompanyName(): Promise<string> {
        return await $(this.selectors.company).$('.ui-select-match-text').getText();
    }

    async getStatusValue(): Promise<string> {
        return await $(this.selectors.status).getText();
    }

    async getSubjectMessageValue(): Promise<string> {
       await  $(this.selectors.searchButton).click();
        await utilityGrid.searchAndSelectGridRecord('subject', '8b59641c-2fca-4d96-8395-03e232cf05de');
        return await utilityGrid.getFirstGridRecordColumnValue('Message','8b59641c-2fca-4d96-8395-03e232cf05de');
    }

    async getBodyMessageValue(): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue('Message','8b59641c-2fca-4d96-8395-03e232cf05de');
    }

    async searchAndSelectEmailTemplate(value: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(value);
    }

    async searchAndSelectBody(value: string): Promise<void> {
        await $(this.selectors.searchButton).click();
        await utilityGrid.searchAndSelectGridRecord(value, '8b59641c-2fca-4d96-8395-03e232cf05de');
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
        await $(this.selectors.searchButton).click();
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilityGrid.searchRecord(value);
    }

    async searchAndSelectGridRecord(value: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(value);
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
    
    async clickOnEditMessageTextBladeSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
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
    async isLocaleDropDownValueDisplayed(arr:string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.localeGuid,arr);
    }

    async isLocalizedMessageButtonEnabled(): Promise<boolean>{
        return $(this.selectors.localizeMessage).isEnabled();
    }

    async isTemplateNameEnabled(): Promise<boolean>{
        return await $(this.selectors.templateName).getAttribute('readonly') =='false';
    }

    async isStatusFieldEnabled(): Promise<boolean>{
        return await $(this.selectors.statusField).getAttribute('readonly') =='false';
    }

    async clickOnBodyCheckbox(): Promise<void>{
        await $$(this.selectors.msgCheckBox).first().click();
    }

    async clickOnSubjectCheckbox(): Promise<void>{
        await $$(this.selectors.msgCheckBox).last().click();
    }

    async isEditButtonEnabled(): Promise<boolean>{
        return await $(this.selectors.editPencilButton).isEnabled();
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new EditAcknowledgementTemplate();