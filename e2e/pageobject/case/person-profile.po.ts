import { ProtractorExpectedConditions, protractor, browser, $$, $ } from "protractor"

class PersonProfilePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        tabLocator: '[rx-view-component-id="a8207936-a379-4f6c-b450-90facc6b893c"] a',
        personName: '[rx-view-component-id="bfa03a3b-cc7c-4d33-95d5-2c63a882aaeb"] .ac-person-full-name',
    }

    async navigateToRelatedCase(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($$(this.selectors.tabLocator).get(2)));
        await $$(this.selectors.tabLocator).get(2).click();
    }

    async getPersonName(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.personName)));
        return await $(this.selectors.personName).getText();
    }
}

export default new PersonProfilePage();