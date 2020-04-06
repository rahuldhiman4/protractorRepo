import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class PreviewKnowledge {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        knowledgeTitle: '[rx-view-component-id="05394582-02a7-4211-823e-9230fe094aa9"] h3',
        knowledgeSection: '.doc-editor-read-mode p',
        knowledgeArticleID: '.d-icon-lightbulb_o',
        viewArticle: '[rx-view-component-id="57f95ac6-4144-400f-a591-657ea98316dd"] button',
        backButton: '[rx-view-component-id="88ec72f0-2c65-4640-9455-54b6db3517f2"] button',
        statusOfKA: '[rx-view-component-id="09044fe7-3bcd-48e9-98f3-96c482b37b77"] .status-transition'

    }
    async getKnowledgeArticleTitle(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeTitle)));
        return await $(this.selectors.knowledgeTitle).getText();
    }

    async isViewArticleLInkDisplay(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.viewArticle)));
        return await $(this.selectors.viewArticle).isDisplayed();
    }

    async clickOnViewArticleLink(): Promise<void> {
        await $(this.selectors.viewArticle).click();
    }

    async isStatusOfKADisplay(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusOfKA)));
        return await $(this.selectors.statusOfKA).isDisplayed();
    }

    async isBackButtonDisplay(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.backButton)));
        return await $(this.selectors.backButton).isDisplayed();
    }

    async clickOnBackButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.backButton)));
        await $(this.selectors.backButton).click();
    }

    async getKnowledgeArticleSection(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeSection)));
        return await $(this.selectors.knowledgeSection).getText();
    }

    async getKnowledgeArticleID(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeArticleID)));
        return await $(this.selectors.knowledgeArticleID).getText();
    }

    async isKnowledgeArticleID(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeArticleID)));
        return await $(this.selectors.knowledgeArticleID).isDisplayed();
    }
}
export default new PreviewKnowledge();