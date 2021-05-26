import { $ } from 'protractor';

export class NewExclusiveSubject {
    selectors = {
        subject: '[rx-view-component-id="4f7c05a7-d79a-4357-8c6e-eb0d3f9604ac"] input',
        sortOrder: '[rx-view-component-id="06c5e480-ae49-457c-a388-725ce9be49c2"] input',
        saveButton: '[rx-view-component-id="5dd1eab6-4381-4265-acba-81633783a610"] button',
        cancelButton: '[rx-view-component-id="f4a68110-6616-4d19-8242-747b89810931"] button'
    }

    async setSubject(value: string): Promise<void> {
        await $(this.selectors.subject).clear();
        await $(this.selectors.subject).sendKeys(value);
    }

    async setSortOrder(sort: string): Promise<void> {
        await $(this.selectors.sortOrder).clear();
        await $(this.selectors.sortOrder).sendKeys(sort);
    }

    async selectGlobal(boolean: string): Promise<void> {
        //pass True or False
        let newLocator: string = `[rx-view-component-id="b23f309d-bb24-486d-a9c8-736af6f97c8a"] [aria-label="${boolean}"]`
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

export default new NewExclusiveSubject();