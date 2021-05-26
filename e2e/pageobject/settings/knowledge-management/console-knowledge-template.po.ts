import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class ConsoleKnowledgeArticleTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        newKATemplateButton: '[rx-view-component-id="d8f72555-2ef4-47bd-a411-fe6c749c670c"] button',
    }

    async clickCreateNewKATemplate(): Promise<void> {
        await $(this.selectors.newKATemplateButton).click();
    }

    async isCreateNewKATemplateEnabled(): Promise<boolean> {
       return await $(this.selectors.newKATemplateButton).isEnabled();
    }
}
export default new ConsoleKnowledgeArticleTemplate();