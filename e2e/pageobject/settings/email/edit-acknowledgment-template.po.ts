import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';
import utilsGrid from "../../../utils/util.grid";

class EditAcknowledgementTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="a01af9fa-da73-44e5-a304-8f8c7632b1a0"] input',
        description: '[rx-view-component-id="f7437c9e-1ed7-4aac-974a-e4d4a643ee35"] input',
        moduleName: '[rx-view-component-id="8107085d-334f-4d50-beb9-ad10d8911144"]  .ui-select-match-text',
        company: '[rx-view-component-id="af048482-fdf7-4650-ab4b-75e262e00445"]  .ui-select-match-text',
        status: '[rx-view-component-id="a1e0042f-41e7-4c80-9cd8-014786f346e6"]  .ui-select-match-text',
        searchButton: '.rx-toggle-search-button',
        searchGuid: '8b59641c-2fca-4d96-8395-03e232cf05de',
        statusGuid: 'a1e0042f-41e7-4c80-9cd8-014786f346e6',
        labelGuid: '38ba050c-eb47-44a7-9efc-c724302560bf',
        localeGuid: '71db023a-4979-4f58-a026-6aeda2edd96b',
        localizeMessage: '[rx-view-component-id="88ea24dd-ddad-489f-904a-89e43f80f5e6"] button',
        editButton: '.rx-button-bar-action-buttons__inner .rx-action-button_clear button',
        body: '.cke_wysiwyg_div',
        editMessageTextBladeSubjectMessage: '[rx-view-component-id="2edd6ab4-d1e5-456e-879c-f8ca22bfbb32"] textarea',
        newLocalizeMessageEmailMessageSubject: '[rx-view-component-id="31bcbb1a-0420-481c-8233-d9d9e117b230"] input',
        newLocalizeMessageEmailMessageLocalizeDropDownGuid: '1389f79d-65df-4090-9bd5-76bd2981a775',
        saveButton: '.rx-action-button_primary .d-button_primary',
        cancelButton: '.rx-button-bar-action-buttons__inner .d-button_secondary',
        gridGuid: '8b59641c-2fca-4d96-8395-03e232cf05de',
    }

    async getTemplateName(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        var newInput = $(this.selectors.templateName);
        $(this.selectors.templateName).click();
        let templateName = await newInput.getAttribute('value');
        return templateName;
    }

    async getDescription(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.description)));
        var newInput = $(this.selectors.description);
        $(this.selectors.description).click();
        let templateName = await newInput.getAttribute('value');
        return templateName;
    }

    async getModuleName(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.moduleName)));
        return $(this.selectors.moduleName).getText();
    }

    async getCompanyName(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.company)));
        return $(this.selectors.company).getText();
    }

    async getStatusValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.status)));
        return $(this.selectors.status).getText();
    }

    async getSubjectMessageValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchButton)));
        $(this.selectors.searchButton).click();
        await utilsGrid.searchAndSelectFirstCheckBox('8b59641c-2fca-4d96-8395-03e232cf05de', 'subject')
        return await utilsGrid.getSelectedGridRecordValue('8b59641c-2fca-4d96-8395-03e232cf05de', 'Message');
    }

    async getBodyMessageValue(): Promise<string> {
        return await utilsGrid.getSelectedGridRecordValue('8b59641c-2fca-4d96-8395-03e232cf05de', 'Message');
    }

    async searchAndSelectEmailTemplate(value: string): Promise<void> {
        await utilsGrid.searchAndSelectFirstCheckBoxWOGrid(value);
    }

    async searchAndSelectBody(value: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchButton)));
        $(this.selectors.searchButton).click();
        await utilsGrid.searchAndSelectGridRecord(value, '8b59641c-2fca-4d96-8395-03e232cf05de');
    }

    async clickOnLocalizeMessageButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.localizeMessage)));
        await $(this.selectors.localizeMessage).click();
    }

    async selectLocalizeDropDownOfNewLocalizedEmailMessage(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.newLocalizeMessageEmailMessageLocalizeDropDownGuid, value);
    }

    async setSubjectOfNewLocalizedEmailMessage(subject: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.newLocalizeMessageEmailMessageSubject)));
        await $(this.selectors.newLocalizeMessageEmailMessageSubject).sendKeys(subject);
    }

    async setBody(body: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.body)));
        await $(this.selectors.body).sendKeys(body);
    }

    async clickOnGridEditButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editButton)));
        await $(this.selectors.editButton).click();
    }

    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilsGrid.getSelectedGridRecordValue(this.selectors.gridGuid, columnHeader);
    }

    async clickOnGridSearchIcon(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchButton)));
        await $(this.selectors.searchButton).click();
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilsGrid.searchOnGridConsole(value);
        await utilCommon.waitUntilSpinnerToHide();
    }

    async searchAndSelectGridRecord(value: string): Promise<void> {
        await utilsGrid.searchAndSelectGridRecord(value);
    }

    async updateTemplateName(templateName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        await $(this.selectors.templateName).clear();
        await $(this.selectors.templateName).sendKeys(templateName);
    }

    async isModuleNameDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.moduleName)));
        return await $(this.selectors.moduleName).getAttribute("disabled") == "true";
    }

    async isCompanyDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.company)));
        return await $(this.selectors.company).getAttribute("disabled") == "true";
    }

    async isLocalizedMessageButtonDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.localizeMessage)));
        return await $(this.selectors.localizeMessage).isDisplayed();
    }

    async selectStatusDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, value);
    }

    async selectLabelDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.labelGuid, value);
    }

    async updateDescription(descriptionText: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.description)));
        await $(this.selectors.description).clear();
        await $(this.selectors.description).sendKeys(descriptionText);
    }

    async selectlocaleDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.localeGuid, value);
    }

    async updateEditMessageTextBladeBody(body: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.body)));
        await $(this.selectors.body).clear();
        await $(this.selectors.body).sendKeys(body);
    }

    async updateEditMessageTextBladeSubject(subject: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editMessageTextBladeSubjectMessage)));
        await $(this.selectors.editMessageTextBladeSubjectMessage).clear();
        await $(this.selectors.editMessageTextBladeSubjectMessage).sendKeys(subject);
    }
    // 
    async clickOnEditMessageTextBladeCancelButtonForBody(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }
    // 
    async clickOnEditMessageTextBladeSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        return await $(this.selectors.saveButton).isEnabled();
    }

    async clearGridSearchBox(): Promise<void> {
        await utilsGrid.clearGridSearchBox();
        await utilCommon.waitUntilSpinnerToHide();
    }
}

export default new EditAcknowledgementTemplate();