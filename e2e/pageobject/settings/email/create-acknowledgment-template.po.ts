import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class CreateAcknowledgmentTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="310bbc87-54ee-4994-9a1e-93b1982155f2"] input',
        templateNameGuid: '310bbc87-54ee-4994-9a1e-93b1982155f2',
        companyGuid: '92c503a8-8b80-49bc-88f1-8a2626b3f594',
        statusGuid: '3cfbfd34-19ff-4ddb-818b-23b19c859dbe',
        labelGuid: '44510e3a-6542-432a-82b1-433dd0cbf49f',
        description: '[rx-view-component-id="13cf801e-fc2f-4d74-a57b-77e4ebf2bde6"] input',
        subject: '[rx-view-component-id="d239e3ac-7386-4bdc-866d-095d700eed62"] input',
        subjectGuid: 'd239e3ac-7386-4bdc-866d-095d700eed62',
        body: '.cke_wysiwyg_div',
        saveButton: '[rx-view-component-id="093a0eeb-c1e0-4ed8-945f-da46d9bbde88"] button',
        cancelButton: '[rx-view-component-id="9aeef4d7-1a10-4ffd-aa3a-22665c32883c"] button',
        lineOfBusiness: '[rx-view-component-id="14c47289-52da-433a-b297-de2e8a7402a0"] input',
        locale: '[rx-view-component-id="62a33fa8-7786-46e6-aa43-ce75e06a3338"] .btn-default',
    }

    async setTemplateName(templateName: string): Promise<void> {
        await $(this.selectors.templateName).sendKeys(templateName);
    }

    async selectCompanyDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyGuid, value);
    }

    async islineOfBusinessDisabled(): Promise<string> {
       return await $(this.selectors.lineOfBusiness).getAttribute("disabled");
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
        return await utilCommon.isRequiredTagToField(this.selectors.subjectGuid);
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
