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
        await utilityGrid.searchAndSelectGridRecord(personName);
    }

    async clickNextButton() {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.nextButton)));
        await $(this.selectors.nextButton).click();
    }

    async selectRelationshipType(relationshipType: string) {
        await utilityCommon.selectDropDown('e2dc9466-aa5d-41d9-9515-8a047c7b9737', relationshipType).catch(async (error) => {
                if(error) await utilityCommon.selectDropDown('8ecbe002-6180-403e-b019-acde4dff5f90', relationshipType);
            });
    }

    async clickSaveButton() {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async addPerson(name: string, relation: string) {
        await this.searchAndSelectPerson(name);
        await this.clickNextButton();
        await this.selectRelationshipType(relation);
        await this.clickSaveButton();
    }
}

export default new AddRelationshipPage();