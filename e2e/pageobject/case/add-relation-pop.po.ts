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
        await utilityGrid.searchAndSelectGridRecord(personName, 'c603c227-0725-4592-847c-494f61887c4a').catch(async (error) => {
            if (error) await utilityGrid.searchAndSelectGridRecord(personName, '55206483-aa9d-4625-a38b-2c02c33e98ff');
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