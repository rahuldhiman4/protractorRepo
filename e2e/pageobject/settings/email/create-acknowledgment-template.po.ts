import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class CreateAcknowledgmentTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="310bbc87-54ee-4994-9a1e-93b1982155f2"] input',
        templateNameGuid: '310bbc87-54ee-4994-9a1e-93b1982155f2',
        companyGuid: 'd240380a-1de2-4b28-9082-81e96fc21415',
        statusGuid: '3cfbfd34-19ff-4ddb-818b-23b19c859dbe',
        labelGuid: 'a0774e28-42c2-4132-9da4-0063545e791f',
        description: '[rx-view-component-id="13cf801e-fc2f-4d74-a57b-77e4ebf2bde6"] input',
        subject: '[rx-view-component-id="187510cc-9804-46e2-bbda-0cdba1d6c83c"] textarea',
        subjectGuid: '187510cc-9804-46e2-bbda-0cdba1d6c83c',
        body: '.cke_wysiwyg_div',
        saveButton: '[rx-view-component-id="093a0eeb-c1e0-4ed8-945f-da46d9bbde88"] button',
        cancelButton: '[rx-view-component-id="9aeef4d7-1a10-4ffd-aa3a-22665c32883c"] button',
        moduleName: '[rx-view-component-id="4514a92a-336f-47f7-9b17-02831428d9a8"] .btn-default',
        locale: '[rx-view-component-id="0d297e32-1ea0-4b91-8d3c-7195cc7e0cc7"] .btn-default',
    }

    async setTemplateName(templateName: string): Promise<void> {
        await $(this.selectors.templateName).sendKeys(templateName);
    }

    async selectCompanyDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyGuid, value);
    }

    async isModuleDisabled(): Promise<string> {
       return await $(this.selectors.moduleName).getAttribute("disabled");
    }

    async isLocaleDisabled(): Promise<string> {
        return await $(this.selectors.locale).getAttribute("disabled");
    }

    async isCompanyRequired(): Promise<boolean> {
        return   await utilCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isTemplateNameRequired(): Promise<boolean> {
      return  await utilCommon.isRequiredTagToField(this.selectors.templateNameGuid);
    }

    async isStatusRequired(): Promise<boolean> {
        return  await utilCommon.isRequiredTagToField(this.selectors.statusGuid);
    }

    async isSubjectRequired(): Promise<boolean> {
        return   await utilCommon.isRequiredTagToField(this.selectors.subjectGuid);
    }

    async selectStatusDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, value);
    }

    async selectLabelDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.labelGuid, value);
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
}

export default new CreateAcknowledgmentTemplateBlade();
