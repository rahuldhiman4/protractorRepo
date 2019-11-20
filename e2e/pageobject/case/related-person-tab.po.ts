import { ProtractorExpectedConditions, protractor, browser, element, by, $, $$ } from "protractor"

class RelatedPersonPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addRelatedPerson: '[rx-view-component-id="024990d7-6511-4839-a2eb-3479acf62505"] button',
    }

    async addRelatedPerson(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addRelatedPerson)));
        await $(this.selectors.addRelatedPerson).click();
    }

}

export default new RelatedPersonPage();
