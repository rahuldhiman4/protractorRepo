import { $, $$, protractor, ProtractorExpectedConditions } from "protractor";

class RelationshipConfigsPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        addRelationshipButton: '.d-icon-left-plus',
        relations: '[ng-repeat="relation in relations"]',
        header: '.column-name',
        relationshipFields: 'input',
        saveButton: '.relationships-footer button[ng-click="submit()"]',
    }

    async isAddRelationButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.addRelationshipButton).isEnabled();
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
                let reverseRelationValue = await relation.$('.ac-reverse-relationship-name').getAttribute('value');
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
                status = await relation.$('.ac-relationship-name').getAttribute('value') == relationName;
                break;
            }
        }
        return status;
    }

}

export default new RelationshipConfigsPage();