import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"
import gridUtil from '../../utils/util.grid'
import util from '../../utils/util.common'

class AddRelationshipPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        searchBox: 'searchText',
        gridId: 'a23405b6-d85c-4581-a35f-c8da5aefcf0e',
        nextButton: '[rx-view-component-id="f6ae4d2f-0400-46cf-8eab-481c3dbaccfd"] button',
        relationshipTypeGridId: '8ecbe002-6180-403e-b019-acde4dff5f90',
        saveButton: '[rx-view-component-id="31187c71-2606-4a43-9000-59fe25972725"] button'
    }

    async searchAndSelectPerson(personName: string): Promise<void> {
        await gridUtil.searchAndSelectAllCheckBox(this.selectors.gridId, personName);
    }

    async clickNextButton() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.nextButton)));
        await $(this.selectors.nextButton).click();
    }

    async selectRelationshipType(relationshipType: string) {
        await util.selectDropDown(this.selectors.relationshipTypeGridId, relationshipType);
    }

    async clickSaveButton() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async addPerson(name: string, relation: string) {
        await this.searchAndSelectPerson(name);
        await this.clickNextButton();
        await this.selectRelationshipType(relation);
        await this.clickSaveButton();
    }
}

export default new AddRelationshipPage();