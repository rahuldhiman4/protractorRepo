import { $ } from "protractor";
import utilCommon from '../../../utils/util.common';

class NotificationEventCreatePage {

    selectors = {
        eventNameInput: '[rx-view-component-id="3dca5cb2-8539-4713-a3bb-25299b838936"] input',
        companyGuid: '0d3363e1-ee59-4efb-b482-8cb7dbfadf92',
        descriptionInput: '[rx-view-component-id="f9a1586b-c74d-489c-8430-c75b2a87d938"] textarea',
        saveButton: '[rx-view-component-id="69eae4f4-21df-448f-b227-6615d6d16879"] button'
    }

    async setEventName(eventName: string): Promise<void> {
        await $(this.selectors.eventNameInput).sendKeys(eventName);
    }

    async setCompanyValue(company: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyGuid, company);
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