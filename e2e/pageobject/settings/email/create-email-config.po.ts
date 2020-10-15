import utilCommon from '../../../utils/util.common';
import { $ } from 'protractor';

export class CreateEmailConfig {
    selectors = {
        addNewEmailConfiguration: '[rx-view-component-id="703593bc-16dd-4763-a8d7-b55777b0b76d"] button',
        emailIDGuid: 'b03a890b-d896-4a12-b8a5-53f2abbf1872',
        emailIDTextbox: '[rx-view-component-id="b03a890b-d896-4a12-b8a5-53f2abbf1872"] input',
        companyGuid: 'd70b8fc7-342e-42ee-9936-9bbf991bbed6',
        statusGuid: '1b16dff3-02e8-4a2a-8d37-31811b872afd',
        descriptionField: '[rx-view-component-id="6f83d1ad-52d5-4542-810a-8e7f1266a8a3"] textarea',
        saveButton: '[rx-view-component-id="cb16fd71-146e-4e5f-9e18-854ddd185d5e"] button',
        cancelButton: '[rx-view-component-id="daad4496-bc8a-4de8-8a2e-cc7665ff8813"] button',
    }

    async setDescription(description: string): Promise<void> {
        await $(this.selectors.descriptionField).clear();
        await $(this.selectors.descriptionField).sendKeys(description);
    }

    async clickSave(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickCancel(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async setEmailID(emailID: string): Promise<void> {
        await $(this.selectors.emailIDTextbox).clear();
        await $(this.selectors.emailIDTextbox).sendKeys(emailID);
    }

    async selectDefaultEmail(boolean: string): Promise<void> {
        let newLocator: string = `.d-button-group__item button[aria-label="${boolean}"]`
        await $(newLocator).click();
    }

    async selectCompany(emailID: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyGuid, emailID);
    }

    async selectStatus(emailID: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, emailID);
    }
}

export default new CreateEmailConfig();