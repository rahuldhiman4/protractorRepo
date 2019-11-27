import { ProtractorExpectedConditions, protractor, browser, $$ } from "protractor"

class PersonProfilePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        tabLocator: '[rx-view-component-id="a8207936-a379-4f6c-b450-90facc6b893c"] a'

    }

    async navigateToRelatedCase(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($$(this.selectors.tabLocator).get(2)));
        await $$(this.selectors.tabLocator).get(2).click();
    }
}

export default new PersonProfilePage();