import { ProtractorExpectedConditions, protractor, browser, $, $$ } from "protractor"

class RelatedPersonPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addRelatedPerson: '[rx-view-component-id="024990d7-6511-4839-a2eb-3479acf62505"], [rx-view-component-id="e5d26a5b-f2d1-40ab-bd30-22252beebf77"] button',
        relatedPersonName: '[rx-view-component-id="6bfe26e7-5065-4db7-a317-18e14a37cd30"] .person-name a',
        personRelationship: '[rx-view-component-id="6bfe26e7-5065-4db7-a317-18e14a37cd30"] .person-relationship .person-info',
        relatedPersons: 'person in persons',
        relatedPersonsName: ' .person-name a',
        relatedPersonRelationship: '.person-relationship p',
        allRelatedPersons: '.person-info-card.person-list',
        relatedPersonNames: '.person-name a',
        relations: ' .person-relationship p',
        personOrganization: ' .person-organization',
        emailLink: ' .list-email',
        site: ' .ac-text-site-value',
        phoneNumber: ' .ac-link-person-phone'
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

    async clickRelatedPersonName(personName:string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        var allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        for (var i = 0; i < allPersonNum; i++) {
            var person = await $$(this.selectors.allRelatedPersons).get(i);
            var nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if(nm==personName){
                await person.$(this.selectors.relatedPersonNames).click();
            }
        }
    }

    async getRelatedPersonCompanyName(personName:string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        var allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        let companyName:string;
        for (var i = 0; i < allPersonNum; i++) {
            var person = await $$(this.selectors.allRelatedPersons).get(i);
            var nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if(nm==personName){
                companyName= await person.$(this.selectors.personOrganization).getText();
                break;
            }
        }
        return companyName;
    }

    async getRelatedPersonRelationship(personName:string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        var allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        let relationships:string;
        for (var i = 0; i < allPersonNum; i++) {
            var person = await $$(this.selectors.allRelatedPersons).get(i);
            var nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if(nm==personName){
                relationships= await person.$(this.selectors.relations).getText();
                break;
            }
        }
        return relationships;
    }

    async getRelatedPersonPhoneNumber(personName:string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        var allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        let phone:string;
        for (var i = 0; i < allPersonNum; i++) {
            var person = await $$(this.selectors.allRelatedPersons).get(i);
            var nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if(nm==personName){
                phone= await person.$(this.selectors.phoneNumber).getText();
                break;
            }
        }
        return phone;
    }

    async getRelatedPersonEmail(personName:string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        var allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        let email:string;
        for (var i = 0; i < allPersonNum; i++) {
            var person = await $$(this.selectors.allRelatedPersons).get(i);
            var nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if(nm==personName){
                email= await person.$(this.selectors.emailLink).getText();
                break;
            }
        }
        return email;
    }

    async getRelatedPersonSite(personName:string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        var allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        let site:string;
        for (var i = 0; i < allPersonNum; i++) {
            var person = await $$(this.selectors.allRelatedPersons).get(i);
            var nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if(nm==personName){
                site= await person.$(this.selectors.site).getText();
                break;
            }
        }
        return site;
    }

    async isEmailLinkNotPresent(personName:string): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        var allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        let stat:boolean = false;
        for (var i = 0; i < allPersonNum; i++) {
            var person = await $$(this.selectors.allRelatedPersons).get(i);
            var nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if(nm==personName){
                stat = await $$(this.selectors.emailLink).get(i).getAttribute("ng-if")=="!showLink";
                break;
            }
        }
        return stat;
    }

}

export default new RelatedPersonPage();