import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class CreateAcknowledgmentTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="310bbc87-54ee-4994-9a1e-93b1982155f2"] input',
        templateNameGuid: '310bbc87-54ee-4994-9a1e-93b1982155f2',
        companyGuid: 'e879f953-52d1-49ff-ab73-5df103d1d8de',
        statusGuid: '3cfbfd34-19ff-4ddb-818b-23b19c859dbe',
        labelGuid: 'a0774e28-42c2-4132-9da4-0063545e791f',
        description: '[rx-view-component-id="13cf801e-fc2f-4d74-a57b-77e4ebf2bde6"] input',
        subject: '[rx-view-component-id="187510cc-9804-46e2-bbda-0cdba1d6c83c"] textarea',
        subjectGuid: '187510cc-9804-46e2-bbda-0cdba1d6c83c',
        body: '.cke_wysiwyg_div',
        saveButton: '[rx-view-component-id="093a0eeb-c1e0-4ed8-945f-da46d9bbde88"] button',
        cancelButton: '[rx-view-component-id="9aeef4d7-1a10-4ffd-aa3a-22665c32883c"] button',
        lineOfBusiness: '[rx-view-component-id="14c47289-52da-433a-b297-de2e8a7402a0"] input',
        locale: '[rx-view-component-id="0d297e32-1ea0-4b91-8d3c-7195cc7e0cc7"] button',
        lobValue: '[rx-view-component-id="14c47289-52da-433a-b297-de2e8a7402a0"] .pull-left'
    }

    async setTemplateName(templateName: string): Promise<void> {
        await $(this.selectors.templateName).sendKeys(templateName);
    }

    async selectCompanyDropDown(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyGuid, value);
    }

    async islineOfBusinessDisabled(): Promise<string> {
        return await $(this.selectors.lineOfBusiness).getAttribute("disabled");
    }

    async isLocaleDisabled(): Promise<string> {
        return await $('[rx-view-component-id="0d297e32-1ea0-4b91-8d3c-7195cc7e0cc7"] button').getAttribute("aria-disabled");
    }

    async isCompanyRequired(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isTemplateNameRequired(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.templateNameGuid);
    }

    async isStatusRequired(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.statusGuid);
    }

    async isSubjectRequired(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.subjectGuid);
    }

    async selectStatusDropDown(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusGuid, value);
    }

    async selectLabelDropDown(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.labelGuid, value);
    }

    async setDescription(descriptionText: string): Promise<void> {
        await $(this.selectors.description).sendKeys(descriptionText);
    }

    async setSubject(subject: string): Promise<void> {
        await $(this.selectors.subject).sendKeys(subject);
    }

    async setBody(body: string): Promise<void> {
        await $(this.selectors.body).sendKeys(body);
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new CreateAcknowledgmentTemplateBlade();
