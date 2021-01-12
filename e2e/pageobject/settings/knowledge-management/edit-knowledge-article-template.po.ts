import { $, protractor, ProtractorExpectedConditions } from "protractor";

class EditKnowledgeArticleTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        sectionTitle: 'div.card-block input',
        cancelButton: 'div.modal-footer .btn-secondary',
        lobValue: '[title="Line of Business"] .pull-left'
    }

    async getSectionTitleValue(sectionTitle: string): Promise<boolean> {
        return await $(this.selectors.sectionTitle).getAttribute('value') == sectionTitle ? true : false;
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}
export default new EditKnowledgeArticleTemplate();