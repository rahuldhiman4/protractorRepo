import { element, by } from "protractor";

class EditKnowledgeSet {

    selectors = {
        listedApplicationNames: '.rx-record-preview-card__value'
    }

    async isApplicationNameListed(applicationName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.listedApplicationNames, applicationName)).isPresent().then(async (result) => {
            if (result)
                return await element(by.cssContainingText(this.selectors.listedApplicationNames, applicationName)).isDisplayed();
        });
    }

}

export default new EditKnowledgeSet();