import { $, browser, protractor, ProtractorExpectedConditions } from 'protractor';
class ViewCaseTemplate {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        identityValidationValue: '[rx-view-component-id="dead2a5c-4753-40c6-9709-4b8ea9c454fd"] .d-textfield__rx-value',
        templateName: '[rx-view-component-id="08a1650a-ac21-405a-8362-ddd780425a75"] span',
        caseTemplateId: '.text-field',
        CaseCompanyvalue: '[rx-view-component-id="39db6cc5-79ae-4934-a4bc-74765278fcda"] p',
        flowsetValue: '[rx-view-component-id="2fe19a48-630b-4380-8b17-cbff70023a89"] p',
        editButton: '[rx-view-component-id="672c4706-9ce0-46be-9a3a-a639ded79b23"] .rx-record-editor-edit',

    }

    async getIdentityValdationValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.identityValidationValue)));
        return await $(this.selectors.identityValidationValue).getText();
    }

    async getCaseTemplateId(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseTemplateId)));
        return await $(this.selectors.caseTemplateId).getText();
    }

    async getCaseTemplateNameValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        return await $(this.selectors.templateName).getText();
    }

    async getCaseCompanyValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.CaseCompanyvalue)));
        return await $(this.selectors.CaseCompanyvalue).getText();
    }

    async getFlowsetValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.flowsetValue)));
        return await $(this.selectors.flowsetValue).getText();
    }

    async clickOnEditCaseTemplateButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editButton)));
        return await $(this.selectors.editButton).click();
    }

}

export default new ViewCaseTemplate();
