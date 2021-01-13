import { $ } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class NotificationEventCreatePage {

    selectors = {
        eventNameInput: '[rx-view-component-id="3dca5cb2-8539-4713-a3bb-25299b838936"] input',
        companyGuid: '0d3363e1-ee59-4efb-b482-8cb7dbfadf92',
        descriptionInput: '[rx-view-component-id="e1ac5aae-3afe-4852-865a-1bcbb8bb3601"] input',
        saveButton: '[rx-view-component-id="3509072f-cada-45c0-8a8e-82452e90ab98"] .btn-primary'
    }

    async setEventName(eventName: string): Promise<void> {
        await $(this.selectors.eventNameInput).clear();
        await $(this.selectors.eventNameInput).sendKeys(eventName);
    }

    async setCompanyValue(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async setDescription(description: string): Promise<void> {
        await $(this.selectors.descriptionInput).clear();
        await $(this.selectors.descriptionInput).sendKeys(description);
    }

    async saveEventConfig(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    

}

export default new NotificationEventCreatePage();