import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from "../../../utils/utility.common";

class editNotesTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        status: '6333057d-5f6a-4d5d-b862-a07db2f9997e',
        company: 'cdcad966-c707-404e-8aad-a71dc60930f2',
        language: 'f541b151-ebf5-4534-a36f-e9fd3aafde91',
        label: '54ccbb24-f8e2-43cf-bb34-f943e579a13e',
        localizedMessageButton: '[rx-view-component-id="d01e8c76-89c3-4259-ad53-9409a740030e"] button',
        insertField: '[rx-view-component-id="9373799a-664e-4027-8bb1-9b2fcc9cd593"] .cke_button__expressioneditor',
        body: '.cke_wysiwyg_div',
        statusValue: '[rx-view-component-id="6333057d-5f6a-4d5d-b862-a07db2f9997e"] .rx-select__search-button-title',
        bodyUpdateValue: '.cke_wysiwyg_div p,.cke_wysiwyg_div',
        saveButton: '[rx-view-component-id="7cfbf19a-7366-4d4f-b686-be6b6befaf82"] button',
        cancelButton: '[rx-view-component-id="020cadc5-e0da-4ed3-99d3-6ad0bef712bc"] button',
        localMessageVerification: '[rx-view-component-id="965fcbd6-27d1-40ae-b024-84c41629e47e"] p',
        editStatus: '[rx-view-component-id="6333057d-5f6a-4d5d-b862-a07db2f9997e"] .disabled',
        readOnlyDescription: '[rx-view-component-id="9373799a-664e-4027-8bb1-9b2fcc9cd593"] .cke_editable',
        lobValue: '[rx-view-component-id="fab9f375-8bc8-424a-997d-529eecd287f9"] .rx-select__search-button-title'
    }

    async changeStatusValue(statusValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.status, statusValue);
    }

    async changeCompanyValue(companyValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.company, companyValue);
    }

    async changeLanguageValue(languageValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.language, languageValue);
    }

    async changeLabelValue(labelValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.label, labelValue);
    }

    async updateBody(bodyValue: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.body)));
        await $(this.selectors.body).sendKeys(bodyValue);
    }

    async clickOnInsertFieldLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.insertField)));
        await $(this.selectors.insertField).click();
    }

    async clickOnSaveButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
        //        await utilityCommon.closePopUpMessage();
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.settingsButton)));
    }

    async clickOnCancelButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.settingsButton)));
    }

    async getStatusValue(): Promise<string> {
        //        await await browser.wait(this.EC.visibilityOf($(this.selectors.statusValue)));
        return await $(this.selectors.statusValue).getText();
    }

    async getBodyValue(): Promise<string> {
        //        await browser.wait(this.EC.invisibilityOf($(this.selectors.localMessage)));
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.bodyUpdateValue)));
        return await $(this.selectors.bodyUpdateValue).getText();
    }

    async getLocaleNotPresentMessage(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.localMessageVerification)));
        return await $(this.selectors.localMessageVerification).getText();
    }

    async isStatusFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.editStatus).isPresent();
        
    }

    async isDescriptionFieldDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        return await $(this.selectors.readOnlyDescription).getAttribute('contenteditable') == 'false';
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new editNotesTemplate();