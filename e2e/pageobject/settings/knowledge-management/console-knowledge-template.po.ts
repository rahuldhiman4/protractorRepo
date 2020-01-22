import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class ConsoleKnowledgeArticleTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        newKATemplateButton: '[rx-view-component-id="d8f72555-2ef4-47bd-a411-fe6c749c670c"] button',
        blade: '.modal-content',
        cancelButton: '[rx-view-component-id="65530a7e-0b78-471c-b355-4196f98a3baa"] button',
        saveButton: '[rx-view-component-id="03d04373-17d2-4b19-af55-1a26e04ee7f1"] button'
    }

    async clickCreateNewKATemplate(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.newKATemplateButton)));
        await $(this.selectors.newKATemplateButton).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.blade)));
    }
}
export default new ConsoleKnowledgeArticleTemplate();