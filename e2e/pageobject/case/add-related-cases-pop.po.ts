import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

class AddRelatedCasesPopupPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        nextButton: '[rx-view-component-id="48ad2e74-734b-47a6-b76c-6ecaefd0f237"] button',
        saveButton: '[rx-view-component-id="c0cc2c91-9a2e-4fa3-b18c-374be23d15cf"] button'
    }

    async clickNextButton() {
        await $(this.selectors.nextButton).click();
    }

    async clickSaveButton() {
        await $(this.selectors.saveButton).click();
    }

    async searchAndSelectEntity(caseId: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(caseId);
    }

    async selectRelationshipType(relationshipType: string) {
        await utilityCommon.selectDropDown('58316efa-4c99-4f8b-9bf7-bfdf2a3aa3d7', relationshipType);
    }

    async addRelatedCase(caseId: string, relation: string) {
        await this.searchAndSelectEntity(caseId);
        await this.clickNextButton();
        await this.selectRelationshipType(relation);
        await this.clickSaveButton();
    }
}

export default new AddRelatedCasesPopupPage();