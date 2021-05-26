import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class RelationshipConfigsPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addRelationshipButton: 'button.bwf-admin-console-action',
        relations: '.adapt-accordion .card',
        header: '.ellipsis span',
        relationshipFields: 'input',
        saveButton: '.bwf-footer button.btn-primary',
        relationshipNameOrReverseRelationshipName: '.textfield__wrapper input',
        relationCard: 'adapt-accordion button.card-title'
    }

    async isAddRelationButtonDisabled(): Promise<boolean> {
        return await $(this.selectors.addRelationshipButton).getAttribute('disabled') == 'true';
    }

    async isRelationshipNameFieldEnabled(headerName: string): Promise<boolean> {
        let allRelationCount: number = await $$(this.selectors.relations).count();
        let status: boolean = false;
        for (let i = 0; i < allRelationCount; i++) {
            let relation = await $$(this.selectors.relations).get(i);
            let nm: string = await relation.$(this.selectors.header).getText();
            if (nm == headerName) {
                await (await relation.$(this.selectors.header)).click();
                status = await (await relation.$$(this.selectors.relationshipFields).first()).isEnabled();
                break;
            }
        }
        return status;
    }

    async setRelationshipName(headerName: string, name: string): Promise<void> {
        let allRelationCount: number = await $$(this.selectors.relations).count();
        for (let i = 0; i < allRelationCount; i++) {
            let relation = await $$(this.selectors.relations).get(i);
            let nm: string = await relation.$(this.selectors.header).getText();
            if (nm == headerName) {
                await (await relation.$(this.selectors.header)).click();
                await (await relation.$$(this.selectors.relationshipFields).first()).clear();
                await (await relation.$$(this.selectors.relationshipFields).first()).sendKeys(name);
                break;
            }
        }
    }

    async saveConfig(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }

    async getReverseRelationShipName(relationName: string): Promise<string> {
        let allRelationCount: number = await $$(this.selectors.relations).count();
        for (let i = 0; i < allRelationCount; i++) {
            let relation = await $$(this.selectors.relations).get(i);
            let nm: string = await relation.$(this.selectors.header).getText();
            if (nm == relationName) {
                let reverseRelationValue = await relation.$$(this.selectors.relationshipNameOrReverseRelationshipName).last().getAttribute('value');
                await (await relation.$(this.selectors.header)).click();
                return reverseRelationValue;
            }
        }
    }

    async isRelationshipPresent(relationName: string): Promise<boolean> {
        let allRelationCount: number = await $$(this.selectors.relations).count();
        let status = false;
        for (let i = 0; i < allRelationCount; i++) {
            let relation = await $$(this.selectors.relations).get(i);
            let nm: string = await relation.$(this.selectors.header).getText();
            if (nm == relationName) {
                await (await relation.$(this.selectors.header)).click();

                status = await relation.$$(this.selectors.relationshipNameOrReverseRelationshipName).first().getAttribute('value') == relationName;
                break;
            }
        }
        return status;
    }

    async clickAddRelationshipButton(): Promise<void>{
        await $(this.selectors.addRelationshipButton).click();
    }

    async setNewRelationshipName(relationshipName: string): Promise<void>{
        await $$(this.selectors.relations).last().$$(this.selectors.relationshipNameOrReverseRelationshipName).first().sendKeys(relationshipName);
    }

    async setNewReverseRelationshipName(reverseRelationshipName: string): Promise<void>{
        await $$(this.selectors.relations).last().$$(this.selectors.relationshipNameOrReverseRelationshipName).last().sendKeys(reverseRelationshipName);
    }

    async setNewRelationshipStatus(status: string): Promise<void> {
        await $$(this.selectors.relations).last().$$('.dropdown-toggle').last().click();
        await element(by.cssContainingText('.adapt-accordion .card .dropdown-item', status)).click();
    }

    async clickFirstCardTitle(): Promise<void> {
        await $$(this.selectors.relationCard).first().click();
    }
}

export default new RelationshipConfigsPage();