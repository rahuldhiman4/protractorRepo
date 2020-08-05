import { $, protractor, ProtractorExpectedConditions, element, by } from "protractor";
import utilityCommon from '../../utils/utility.common';

class PreviewKnowledge {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        knowledgeTitle: '[rx-view-component-id="05394582-02a7-4211-823e-9230fe094aa9"] h3',
        knowledgeSection: '.doc-editor-read-mode p',
        knowledgeArticleID: '.d-icon-lightbulb_o',
        backButton: '[rx-view-component-id="75d55491-37d4-40f2-83ef-35019670e355"] button',
        goToArticleButton: '[rx-view-component-id="5c11d82c-8269-41fc-a93f-374252adc4c2"] button',
        statusOfKA: '[rx-view-component-id="09044fe7-3bcd-48e9-98f3-96c482b37b77"] .status-transition',
        fieldLabels: '.clearfix label'
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

    async isFieldLabelDisplayed(labelName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.fieldLabels, labelName)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.fieldLabels, labelName)).isDisplayed();
            } else return false;
        });
    }
}
export default new PreviewKnowledge();