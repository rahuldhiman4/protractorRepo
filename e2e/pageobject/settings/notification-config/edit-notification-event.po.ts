import { $ } from "protractor";

class NotificationEventCreatePage {

    selectors = {
        eventNameInput: '[rx-view-component-id="47a3d787-5e4f-43da-bf38-742ec9c974b8"] input',
        descriptionInput: '[rx-view-component-id="bd5aaea8-eced-4fbe-8eb3-bed5dfb17ca3"] input',
        saveButton: '[rx-view-component-id="36a4c7aa-003f-4d22-8555-d63588b7eeb6"] .btn-primary',
        cancelButton: '[rx-view-component-id="36a4c7aa-003f-4d22-8555-d63588b7eeb6"] .btn-secondary',
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