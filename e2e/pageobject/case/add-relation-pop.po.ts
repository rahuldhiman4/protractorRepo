import { $, protractor, ProtractorExpectedConditions } from "protractor";
import util from '../../utils/util.common';
import gridUtil from '../../utils/util.grid';

class AddRelationshipPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        nextButton: '[rx-view-component-id="f6ae4d2f-0400-46cf-8eab-481c3dbaccfd"], [rx-view-component-id="621dbc14-dfcd-45c6-8e49-1c7836132e6b"] button',
        saveButton: '[rx-view-component-id="31187c71-2606-4a43-9000-59fe25972725"], [rx-view-component-id="49f9b271-8e47-46cf-9689-45ce551d726c"] button'
    }

    async searchAndSelectPerson(personName: string): Promise<void> {
        await gridUtil.searchAndSelectGridRecord(personName);
    }

    async clickNextButton() {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.nextButton)));
        await $(this.selectors.nextButton).click();
    }

    async selectRelationshipType(relationshipType: string) {
        await util.selectDropDownWithName("Relationship Type", relationshipType);
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