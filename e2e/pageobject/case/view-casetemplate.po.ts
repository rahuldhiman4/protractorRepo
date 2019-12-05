import { ProtractorExpectedConditions, protractor, browser, $ } from 'protractor';
class ViewCaseTemplate {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        identityValidationValue: '[rx-view-component-id="dead2a5c-4753-40c6-9709-4b8ea9c454fd"] .d-textfield__rx-value',
        templateName: '[rx-view-component-id="08a1650a-ac21-405a-8362-ddd780425a75"] span'
       
    }

    async getIdentityValdationValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.identityValidationValue)));
        return await $(this.selectors.identityValidationValue).getText();
    }

    async getCaseTemplateNameValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        return await $(this.selectors.templateName).getText();
    }

}

export default new ViewCaseTemplate();
