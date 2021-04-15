import { $ } from "protractor";

class NotificationEventCreatePage {

    selectors = {
        eventNameInput: '[rx-view-component-id="bbf60c0a-1fa9-49f2-8505-e85e5e2b23b6"] input',
        descriptionInput: '[rx-view-component-id="2d3d41dc-cd5c-4364-9880-e336c452d46b"] textarea',
        saveButton: '[rx-view-component-id="9a11a8a9-68d4-4ef2-9d48-4a11edcb55ba"] button',
        cancelButton: '[rx-view-component-id="8d104a08-f329-41f7-a843-f47581937923"] button',
    }

    async setEventName(eventName: string): Promise<void> {
        await $(this.selectors.eventNameInput).clear();
        await $(this.selectors.eventNameInput).sendKeys(eventName);
    }

    async setDescription(description: string): Promise<void> {
        await $(this.selectors.descriptionInput).clear();
        await $(this.selectors.descriptionInput).sendKeys(description);
    }

    async saveEventConfig(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async cancelEventConfig(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }
    

}

export default new NotificationEventCreatePage();