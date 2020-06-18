import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../utils/utility.common';

class PreviewKnowledge {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        knowledgeTitle: '[rx-view-component-id="05394582-02a7-4211-823e-9230fe094aa9"] h3',
        knowledgeSection: '.doc-editor-read-mode p',
        knowledgeArticleID: '.d-icon-lightbulb_o',
        backButton: '[rx-view-component-id="75d55491-37d4-40f2-83ef-35019670e355"] button',
        goToArticleButton: '[rx-view-component-id="5c11d82c-8269-41fc-a93f-374252adc4c2"] button',
        statusOfKA: '[rx-view-component-id="09044fe7-3bcd-48e9-98f3-96c482b37b77"] .status-transition'
    }
    async getKnowledgeArticleTitle(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeTitle)));
        return await $(this.selectors.knowledgeTitle).getText();
    }

    async isStatusOfKADisplay(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusOfKA)));
        return await $(this.selectors.statusOfKA).isDisplayed();
    }

    async isBackButtonDisplay(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.backButton)));
        return await $(this.selectors.backButton).isDisplayed();
    }

    async clickGoToArticleButton(): Promise<void> {
        await $(this.selectors.goToArticleButton).click();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes'); // please remove this after defect fix DRDMV-22182
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