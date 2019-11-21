import { ProtractorExpectedConditions, protractor, browser, $, $$ } from "protractor"

class RelatedPersonPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addRelatedPerson: '[rx-view-component-id="024990d7-6511-4839-a2eb-3479acf62505"] button',
        relatedPersonName: '[rx-view-component-id="6bfe26e7-5065-4db7-a317-18e14a37cd30"] .person-name a',
        personRelationship: '[rx-view-component-id="6bfe26e7-5065-4db7-a317-18e14a37cd30"] .person-relationship .person-info',
        relatedPersons: 'person in persons',
        relatedPersonsName: ' .person-name a',
        relatedPersonRelationship: '.person-relationship p',
        allRelatedPersons: '.person-info-card.person-list',
        relatedPersonNames: '.person-name a',
        relations: '.person-relationship p',
    }

    async addRelatedPerson(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addRelatedPerson)));
        await $(this.selectors.addRelatedPerson).click();
    }

    async getPersonName(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.relatedPersonName)));
        return await $(this.selectors.relatedPersonName).getText();
    }

    async getPersonRelationshipName(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personRelationship)));
        return await $(this.selectors.personRelationship).getText();
    }

    async isPersonRelatedHasCorrectRelation(relatedName: string, relation: string): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        var status: boolean = false;
        var allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        for (var i = 0; i < allPersonNum; i++) {
            var person = await $$(this.selectors.allRelatedPersons).get(i);
            var nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            var rel: string = await person.$(this.selectors.relations).getText();
            if (nm == relatedName && rel == relation) {
                status = true;
                break;
            }
        }
        return status;
    }

    async waitUntilNewRelatedPersonAdded(expectedCount: number): Promise<void> {
        await browser.wait(this.EC.or(async () => {
            let count = await $$(this.selectors.allRelatedPersons).count();
            return count >= expectedCount;
        }));
    }
}

export default new RelatedPersonPage();