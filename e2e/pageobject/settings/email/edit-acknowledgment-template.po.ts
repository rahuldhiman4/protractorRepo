import { $, $$, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import utilityGrid from '../../../utils/utility.grid';

class EditAcknowledgementTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="e7893fa6-ebfd-4e5f-b997-efcd337caa8b"] input',
        description: '[rx-view-component-id="13687881-a1ff-4198-a22a-4d2583307e48"] input',
        moduleName: '[rx-view-component-id="2a3f6607-4335-4540-aedf-f71a47c6b575"] button',
        company: '[rx-view-component-id="e75104bf-e0a8-41db-ad84-31b9ef05fd9f"] button',
        status: '[rx-view-component-id="2b5a61a3-16f8-4d1f-9a60-558c4575ed3a"]  button div',
        searchButton: '[rx-view-component-id="8b59641c-2fca-4d96-8395-03e232cf05de"] input[type="search"]',
        searchGuid: '8b59641c-2fca-4d96-8395-03e232cf05de',
        statusGuid: '2b5a61a3-16f8-4d1f-9a60-558c4575ed3a',
        labelGuid: '3dc8431e8-b40a-43fd-88fe-8d7dc884c069',
        localeGuid: 'c1ebf410-826a-434a-9f42-e8c44ed8dcdb',
        localizeMessage: '[rx-view-component-id="d80f1ed8-5f3a-4ad1-bd5a-aa4b68879cc2"] button',
        editButton: '.d-icon-left-pencil',
        body: '.cke_wysiwyg_div',
        editMessageTextBladeSubjectMessage: '[rx-view-component-id="87825f39-f76b-4a2b-9d04-1e521562dc00"] input',
        newLocalizeMessageEmailMessageSubject: '[rx-view-component-id="31bcbb1a-0420-481c-8233-d9d9e117b230"] input',
        newLocalizeMessageEmailMessageLocalizeDropDownGuid: '1389f79d-65df-4090-9bd5-76bd2981a775',
        saveButton: '.rx-action-button_primary .btn-primary',
        cancelButton: '[rx-view-component-id="8fe0e727-14ac-4773-ba4d-03835070e907"] button',
        gridGuid: '8b59641c-2fca-4d96-8395-03e232cf05de',
        msgCheckBox: '[rx-view-component-id="8b59641c-2fca-4d96-8395-03e232cf05de"] span.radio__label',
        editPencilButton: '[rx-view-component-id="8b59641c-2fca-4d96-8395-03e232cf05de"] .d-icon-left-pencil',
        statusField: '[rx-view-component-id="2b5a61a3-16f8-4d1f-9a60-558c4575ed3a"] button',
        lobValue: '[rx-view-component-id="c6cbd5e4-3897-493c-a7e0-455c8262e198"] button div'
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
        return await $(this.selectors.company).getText();
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
        await utilityGrid.searchRecord(value,this.selectors.gridGuid);
    }

    async searchAndSelectGridRecord(value: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(value,this.selectors.gridGuid);
    }

    async isModuleNameDisabled(): Promise<boolean> {
        return await $(this.selectors.moduleName).getAttribute("aria-disabled") == "true";
    }

    async isCompanyDropDownDisabled(): Promise<boolean> {
        return await $(this.selectors.company).getAttribute("aria-disabled") == "true";
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
        return await $(this.selectors.statusField).getAttribute('aria-disabled') =='false';
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