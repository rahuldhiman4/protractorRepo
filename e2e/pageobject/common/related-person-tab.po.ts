import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../utils/utility.common';

class RelatedPersonPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addRelatedPerson: '[rx-view-component-id="024990d7-6511-4839-a2eb-3479acf62505"], [rx-view-component-id="e5d26a5b-f2d1-40ab-bd30-22252beebf77"] button',
        relatedPersonName: '[rx-view-component-id="6bfe26e7-5065-4db7-a317-18e14a37cd30"] .person-name a',
        personRelationship: '[rx-view-component-id="6bfe26e7-5065-4db7-a317-18e14a37cd30"] .person-relationship .person-info',
        relatedPersonsName: '.person-name a',
        allRelatedPersons: '.list-group-item',
        relatedPersonNames: ' .person-name a',
        relations: ' .person-relationship p',
        personOrganization: ' .person-organization',
        emailLink: ' .person-info-list button.btn',
        site: ' .bwf-person-site',
        phoneNumber: ' .bwf-person-phone',
        removePersonCrossIcon: ' .close.close-button',
    }

    async addRelatedPerson(): Promise<void> {
        await $(this.selectors.addRelatedPerson).click();
    }

    async getPersonName(): Promise<string> {
        return await $(this.selectors.relatedPersonName).getText();
    }

    async getPersonRelationshipName(): Promise<string> {
        return await $(this.selectors.personRelationship).getText();
    }

    async isPersonRelatedHasCorrectRelation(relatedName: string, relation: string): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedPersons)), 6000);
        let status: boolean = false;
        let allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            let rel: string = (await (await person.$(this.selectors.relations)).getText()).trim();
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
        let allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        let stat: boolean = false;
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if (nm == personName) {
                person = await $$(this.selectors.allRelatedPersons).get(i);
                stat = await person.$$(this.selectors.emailLink).isEnabled();
                break;
            }
        }
        return stat;
    }

    async removeRelatedPerson(personName: string): Promise<void> {
        let allCasesNum: number = await $$(this.selectors.allRelatedPersons).count();
        for (let i = 0; i < allCasesNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await (await person.$(this.selectors.relatedPersonNames)).getText();
            if (nm == personName) {
                await (await person.$(this.selectors.removePersonCrossIcon)).click();
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
                break;
            }
        }
    }

    async isRelatedPersonPresent(personName: string): Promise<boolean> {
        let status: boolean = false;
        if (await (await $(this.selectors.allRelatedPersons)).isPresent()) {
            let allCasesNum: number = await $$(this.selectors.allRelatedPersons).count();
            for (let i = 0; i < allCasesNum; i++) {
                let nm: string = await $$(this.selectors.allRelatedPersons).get(i).$(this.selectors.relatedPersonNames).getText();
                if (nm == personName) {
                    status = true;
                    break;
                }
            }
        }
        return status;
    }

    async isRemoveRelatedPersonIconEnabled(personName: string): Promise<boolean> {
        let allCasesNum: number = await $$(this.selectors.allRelatedPersons).count();
        let status: boolean = undefined;
        for (let i = 0; i < allCasesNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if (nm == personName) {
                status = await person.$('button.close-button').isPresent();
                break;
            }
        }
        return status;
    }

    async clickRelatedPersonEmail(personName: string): Promise<void> {
        let allPersonNum: number = await $$(this.selectors.allRelatedPersons).count();
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedPersons).get(i);
            let nm: string = await person.$(this.selectors.relatedPersonNames).getText();
            if (nm == personName) {
                person = await $$(this.selectors.allRelatedPersons).get(i);
                await person.$(this.selectors.emailLink).click();
                break;
            }
        }
    }
}

export default new RelatedPersonPage();