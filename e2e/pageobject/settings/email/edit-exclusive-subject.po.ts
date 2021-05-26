import { $ } from 'protractor';

export class EditExclusiveSubject {
    selectors = {
        subject: '[rx-view-component-id="4716ea2f-f4dc-4ce6-a0d0-e9506750d9e7"] input',
        saveButton: '[rx-view-component-id="23e77bba-cc92-4bc5-84c0-72db8e236271"] button',
        cancelButton: '[rx-view-component-id="3383be14-cff1-473c-a5e3-1bed488a4516"] button'
    }

    async setSubject(value: string): Promise<void> {
        await $(this.selectors.subject).clear();
        await $(this.selectors.subject).sendKeys(value);
    }

    async selectGlobal(boolean: string): Promise<void> {
        //pass True or False
        let newLocator: string = `[rx-view-component-id="a3da1b33-0ba3-463c-8edb-394eeb415e31"] .d-button-group__item button[aria-label="${boolean}"]`
        await $(newLocator).click();
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
     return await $(this.selectors.saveButton).isEnabled();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }
}

export default new EditExclusiveSubject();