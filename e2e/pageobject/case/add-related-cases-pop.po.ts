import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"
import gridUtil from '../../utils/util.grid'
import util from '../../utils/util.common'

class AddRelatedCasesPopupPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        nextButton: '[rx-view-component-id="48ad2e74-734b-47a6-b76c-6ecaefd0f237"] button',
        saveButton: '[rx-view-component-id="c0cc2c91-9a2e-4fa3-b18c-374be23d15cf"] button'
    }

    async clickNextButton() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.nextButton)));
        await $(this.selectors.nextButton).click();
    }

    async clickSaveButton() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async searchAndSelectPerson(caseId: string): Promise<void> {
        await gridUtil.searchAndSelectAllCheckBoxWOGrid(caseId);
    }

    async selectRelationshipType(relationshipType: string) {
        await util.selectDropDownWithName("Relationship Type", relationshipType);
    }

    async addRelatedCase(caseId: string, relation: string) {
        await this.searchAndSelectPerson(caseId);
        await this.clickNextButton();
        await this.selectRelationshipType(relation);
        await this.clickSaveButton();
    }
}

export default new AddRelatedCasesPopupPage();