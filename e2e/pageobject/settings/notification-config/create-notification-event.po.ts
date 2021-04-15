import { $ } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class NotificationEventCreatePage {

    selectors = {
        eventNameInput: '[rx-view-component-id="f03dfbfc-f14f-4a82-89a2-12333c11bcc6"] input',
        companyGuid: 'ddcc4de1-4507-4b2f-92c1-7dbdde873a65',
        descriptionInput: '[rx-view-component-id="e93a2f93-ba5c-433d-b1a0-7dd79c000ab7"] textarea',
        saveButton: '[rx-view-component-id="2ed4dab4-ff30-4cb2-a836-042847927b08"] button'
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