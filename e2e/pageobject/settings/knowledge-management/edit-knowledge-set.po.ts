import {$, element, by } from "protractor";

class EditKnowledgeSet {

    selectors = {
        listedApplicationNames: '.rx-record-preview-card__value',
        saveButton: '[rx-view-component-id="9845bc7c-ac13-4989-aba2-4751bbba8c6c"] button',
        cancelButton: '[rx-view-component-id="0720cb03-bcfd-405f-810f-85c5191b8de6"] button',
        knowledgeSetInput: '[rx-view-component-id="19901ec7-e019-4c63-a5c5-c02074086645"] input',
        lobValue: '[rx-view-component-id="728753d8c-c1a7-48f0-8e9d-7997762aedd4"] .pull-left'
    }

    async isApplicationNameListed(applicationName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.listedApplicationNames, applicationName)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.listedApplicationNames, applicationName)).isDisplayed();
            else return false;
        });
    }

    async removeApplicationAssociation(applicationID: string): Promise<void> {
        await element(by.xpath(`//span[contains(text(),"${applicationID}")]//../parent::ul/following-sibling::button`)).click();
    }

    async clickSaveButton():Promise<void>{
        await $(this.selectors.saveButton).click();
    }

    async clickCancelButton():Promise<void>{
        await $(this.selectors.cancelButton).click();
    }

    async setKnowledgeSetName(name: string): Promise<void> {
        await $(this.selectors.knowledgeSetInput).sendKeys(name);
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }

}

export default new EditKnowledgeSet();