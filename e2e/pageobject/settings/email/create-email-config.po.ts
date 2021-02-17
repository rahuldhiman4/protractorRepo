import utilityCommon from '../../../utils/utility.common';
import { $ } from 'protractor';

export class CreateEmailConfig {
    selectors = {
        emailIDGuid: 'b122f3d6-7447-4ed4-add0-4f462480129d',
        emailIDTextbox: '[rx-view-component-id="b122f3d6-7447-4ed4-add0-4f462480129d"] input',
        companyGuid: 'bbaa8c70-3c86-4960-9184-13c8fff61a03',
        statusGuid: '1b16dff3-02e8-4a2a-8d37-31811b872afd',
        descriptionField: '[rx-view-component-id="f6c0270c-ebfb-479f-b6b5-bac3f4ac8faf"] textarea',
        saveButton: '[rx-view-component-id="cb16fd71-146e-4e5f-9e18-854ddd185d5e"] button',
        cancelButton: '[rx-view-component-id="daad4496-bc8a-4de8-8a2e-cc7665ff8813"] button',
        incomingMailBoxNameGuid: '2bd6a6db-bbba-489e-a1f2-7bb4cc07f69a',
        lob: '[rx-view-component-id="15cb2eb7-6089-46c4-8de5-ea9e974b12a2"] button div',
        lobValue: '[rx-view-component-id="15cb2eb7-6089-46c4-8de5-ea9e974b12a2"] .pull-left'
    }

    async setDescription(description: string): Promise<void> {
        await $(this.selectors.descriptionField).clear();
        await $(this.selectors.descriptionField).sendKeys(description);
    }

    async clickSave(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async isLineOfBusinessEnabled(): Promise<boolean> {
      return  await $(this.selectors.lob).isEnabled();
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
        await utilityCommon.selectDropDown(this.selectors.companyGuid, emailID);
    }

    async selectStatus(emailID: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusGuid, emailID);
    }

    async selectIncomingMailBoxName(emailID: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.incomingMailBoxNameGuid, emailID);
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lob).getText();
    }
}

export default new CreateEmailConfig();