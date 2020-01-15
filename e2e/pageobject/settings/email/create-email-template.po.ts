import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class CreateEmailTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="310bbc87-54ee-4994-9a1e-93b1982155f2"] input',
        companyGuid: 'd240380a-1de2-4b28-9082-81e96fc21415',
        statusGuid: '3cfbfd34-19ff-4ddb-818b-23b19c859dbe',
        labelGuid: 'a0774e28-42c2-4132-9da4-0063545e791f',
        description: '[rx-view-component-id="13cf801e-fc2f-4d74-a57b-77e4ebf2bde6"] input',
        subject: '[rx-view-component-id="187510cc-9804-46e2-bbda-0cdba1d6c83c"] textarea',
        body: '.cke_wysiwyg_div',
        saveButton: '[rx-view-component-id="093a0eeb-c1e0-4ed8-945f-da46d9bbde88"] button',
        cancelButton: '[rx-view-component-id="9aeef4d7-1a10-4ffd-aa3a-22665c32883c"] button',
    }

    async setTemplateName(templateName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        await $(this.selectors.templateName).sendKeys(templateName);
    }

    async selectCompanyDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyGuid, value);
    }

    async selectStatusDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, value);
    }

    async selectLabelDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.labelGuid, value);
    }

    async setDescription(descriptionText: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.description)));
        await $(this.selectors.description).sendKeys(descriptionText);
    }

    async setSubject(subject: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.subject)));
        await $(this.selectors.subject).sendKeys(subject);
    }

    async setBody(body: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.body)));
        await $(this.selectors.body).sendKeys(body);
    }

    async clickOnSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }
}

export default new CreateEmailTemplateBlade();
