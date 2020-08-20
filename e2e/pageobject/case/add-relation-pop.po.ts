import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../utils/utility.grid';
import utilityCommon from '../../utils/utility.common';

class AddRelationshipPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        nextButton: '[rx-view-component-id="f6ae4d2f-0400-46cf-8eab-481c3dbaccfd"], [rx-view-component-id="621dbc14-dfcd-45c6-8e49-1c7836132e6b"] button',
        saveButton: '[rx-view-component-id="31187c71-2606-4a43-9000-59fe25972725"], [rx-view-component-id="49f9b271-8e47-46cf-9689-45ce551d726c"] button'
    }

    async searchAndSelectPerson(personName: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(personName, 'c1c0bd18-b86f-4fff-b29b-f519393d0c8d').catch(async (error) => {
            if (error) await utilityGrid.searchAndSelectGridRecord(personName, 'a23405b6-d85c-4581-a35f-c8da5aefcf0e');
        });
    };

    async clickNextButton() {
        await $(this.selectors.nextButton).click();
    }

    async selectRelationshipType(relationshipType: string) {
        await utilityCommon.selectDropDown('e2dc9466-aa5d-41d9-9515-8a047c7b9737', relationshipType).catch(async (error) => {
            if (error) await utilityCommon.selectDropDown('8ecbe002-6180-403e-b019-acde4dff5f90', relationshipType);
        });
    }

    async clickSaveButton() {
        await $(this.selectors.saveButton).click();
    }

    async addPerson(name: string, relation: string) {
        await this.searchAndSelectPerson(name);
        await this.clickNextButton();
        await this.selectRelationshipType(relation);
        await this.clickSaveButton();
    }

    async isRelationshipPresentInDropdown(relationshipName: string): Promise<boolean> {
        return await utilityCommon.isValuePresentInDropDown('e2dc9466-aa5d-41d9-9515-8a047c7b9737', relationshipName);
    }
}

export default new AddRelationshipPage();