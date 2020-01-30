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
        ownerGroup:'[rx-view-component-id="80799a06-c36d-4638-819a-2633a42a89e1"] p',
        ownerCompany:'[rx-view-component-id="5c445c06-0bdc-4995-a226-05da344dcf30"] p',
        templateStatus:'[rx-view-component-id="e5e9bf3e-8135-4d53-b03f-484545a64a5a"] p',
        resolveCaseOnLastTaskCompletion:'[rx-view-component-id="e4956197-0230-4272-8fc4-87358bd084bf"] p',
        categoryTier4: '[rx-view-component-id="fbc0f516-1f57-44ad-82ab-f8bbbe1aa5f5"] p'
    }

    async getIdentityValdationValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.identityValidationValue)));
        return await $(this.selectors.identityValidationValue).getText();
    }

    async getOwnerGroupValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerGroup)));
        return await $(this.selectors.ownerGroup).getText();
    }

    async getOwnerCompanyValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerCompany)));
        return await $(this.selectors.ownerCompany).getText();
    }

    async getTemplateStatusValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateStatus)));
        return await $(this.selectors.templateStatus).getText();
    }

    async getCaseTemplateId(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseTemplateId)));
        return await $(this.selectors.caseTemplateId).getText();
    }

    async getCaseTemplateNameValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        return await $(this.selectors.templateName).getText();
    }

    async getResolveCaseOnLastTaskCompletionValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.resolveCaseOnLastTaskCompletion)));
        return await $(this.selectors.resolveCaseOnLastTaskCompletion).getText();
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

    async getCategoryTier4(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier4)));
        return await $(this.selectors.categoryTier4).getText();
    }

}

export default new ViewCaseTemplate();
