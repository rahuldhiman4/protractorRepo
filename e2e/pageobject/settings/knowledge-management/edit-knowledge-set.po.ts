import {$, element, by } from "protractor";

class EditKnowledgeSet {

    selectors = {
        listedApplicationNames: '.rx-record-preview-card__value',
        saveButton: '[rx-view-component-id="9845bc7c-ac13-4989-aba2-4751bbba8c6c"] button',
        knowledgeSetInput: '[rx-view-component-id="19901ec7-e019-4c63-a5c5-c02074086645"] input',
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

    async setKnowledgeSetName(name: string): Promise<void> {
        await $(this.selectors.knowledgeSetInput).sendKeys(name);
    }

}

export default new EditKnowledgeSet();