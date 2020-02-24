import { $, $$, browser, protractor, ProtractorExpectedConditions, by } from "protractor";
import utilCommon from '../../utils/util.common'

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
        relatedPersonNames: ' .person-name a',
        relations: ' .person-relationship p',
        personOrganization: ' .person-organization',
        emailLink: ' .list-email, [rx-view-component-id="6bfe26e7-5065-4db7-a317-18e14a37cd30"] .ac-link-person-email',
        site: ' .ac-text-site-value',
        phoneNumber: ' .ac-link-person-phone',
        removePersonCrossIcon: ' .close.close-button',
    }

    async addRelatedPerson(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addRelatedPerson)));
        await $(this.selectors.addRelatedPerson).click();
    }

    async getPersonName(): Promise<string> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.relatedPersonName)));
        return await $(this.selectors.relatedPersonName).getText();
    }

    async getPersonRelationshipName(): Promise<string> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personRelationship)));
        return await $(this.selectors.personRelationship).getText();
    }

    async isPersonRelatedHasCorrectRelation(relatedName: string, relation: string): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        let status: boolean = false;
        let allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            let rel: string = await person.$(this.selectors.relations).getText();
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
        }), 3000);
    }

    async clickRelatedPersonName(personName: string): Promise<void> {
        let allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if (nm == personName) {
                person = await $$(this.selectors.allRelatedPersons).get(i);
                await person.$(this.selectors.relatedPersonNames).click();
                break;
            }
        }
    }

    async getRelatedPersonCompanyName(personName: string): Promise<string> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        let allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        let companyName: string;
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if (nm == personName) {
                person = await $$(this.selectors.allRelatedPersons).get(i);
                companyName = await person.$(this.selectors.personOrganization).getText();
                break;
            }
        }
        return companyName;
    }

    async getRelatedPersonRelationship(personName: string): Promise<string> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        let allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        let relationships: string;
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if (nm == personName) {
                person = await $$(this.selectors.allRelatedPersons).get(i);
                relationships = await person.$(this.selectors.relations).getText();
                break;
            }
        }
        return relationships;
    }

    async getRelatedPersonPhoneNumber(personName: string): Promise<string> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        let allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        let phone: string;
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if (nm == personName) {
                person = await $$(this.selectors.allRelatedPersons).get(i);
                phone = await person.$(this.selectors.phoneNumber).getText();
                break;
            }
        }
        return phone;
    }

    async getRelatedPersonEmail(personName: string): Promise<string> {
        let allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        let email: string;
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if (nm == personName) {
                person = await $$(this.selectors.allRelatedPersons).get(i);
                email = await person.$(this.selectors.emailLink).getText();
                break;
            }
        }
        return email;
    }

    async getRelatedPersonSite(personName: string): Promise<string> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        let allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        let site: string;
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if (nm == personName) {
                person = await $$(this.selectors.allRelatedPersons).get(i);
                site = await person.$(this.selectors.site).getText();
                break;
            }
        }
        return site;
    }

    async isEmailLinkNotPresent(personName: string): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        let allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        let stat: boolean = false;
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if (nm == personName) {
                person = await $$(this.selectors.allRelatedPersons).get(i);
                stat = await person.$$(this.selectors.emailLink).getAttribute("ng-if") == "!showLink";
                break;
            }
        }
        return stat;
    }

    async removeRelatedPerson(personName: string): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        let allCasesNum: number = await $$(this.selectors.allRelatedPersons).count();
        for (let i = 0; i < allCasesNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if (nm == personName) {
                await person.$(this.selectors.removePersonCrossIcon).click();
                break;
            }
        }
        await utilCommon.clickOnWarningOk();
    }

    async isRelatedPersonPresent(personName: string): Promise<boolean> {
        let status: boolean = false;
//        await browser.wait(this.EC.visibilityOf($(this.selectors.addRelatedPerson)));
        if (await $(this.selectors.allRelatedPersons).isPresent) {
            let allCasesNum: number = await $$(this.selectors.allRelatedPersons).count();
            for (let i = 0; i < allCasesNum; i++) {
                //let person = await $$(this.selectors.allRelatedPersons).get(i);
                let nm: string = await $$(this.selectors.allRelatedPersons).get(i).$(this.selectors.relatedPersonNames).getText();
                if (nm == personName) {
                    status = true;
                    break;
                }
            }
        }
        return status;
    }

    async isRemoveRelatedPersonIconPresent(personName: string): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)));
        let allCasesNum: number = await $$(this.selectors.allRelatedPersons).count();
        let status: boolean;
        for (let i = 0; i < allCasesNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if (nm == personName) {
                status = await person.$(this.selectors.removePersonCrossIcon).isPresent();
                break;
            }
        }
        return status;
    }

}

export default new RelatedPersonPage();