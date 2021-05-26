import { $, protractor, ProtractorExpectedConditions } from "protractor";

class ReviewCommentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        tellUsComment: '[rx-view-component-id="2b192056-a661-49b7-948f-4c75dbc4ffea"] textarea',
        approvedButton: '[rx-view-component-id="88d0eeb0-1863-4445-89a9-27b8a75cdc0b"] button',
        rejectedButton: '[rx-view-component-id="af270b66-6cb7-4e50-b806-84d17e3e7301"] button',
        cancelButton: '[rx-view-component-id="c703f100-ad49-46ea-8081-7bf7e669bf4f"] button'
    }
    async clickApprovedButton(): Promise<void> {
        await $(this.selectors.approvedButton).click();
    }

    async isApprovedButtonDisplay(): Promise<boolean> {
        return await $(this.selectors.approvedButton).isDisplayed();
    }

    async setTextInTellUsMore(value: string): Promise<void> {
        await $(this.selectors.tellUsComment).clear();
        await $(this.selectors.tellUsComment).sendKeys(value);
    }

    async isTellUsMoreDisplayed(): Promise<boolean> {
        return await $(this.selectors.tellUsComment).isDisplayed();
    }

    async clickRejectedButton(): Promise<void> {
        await $(this.selectors.rejectedButton).click();
    }

    async isRejectedButtonDisplay(): Promise<boolean> {
        return await $(this.selectors.rejectedButton).isDisplayed();
    }

    async isCancelButtonDisplay(): Promise<boolean> {
        return await $(this.selectors.cancelButton).isDisplayed();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }
}

export default new ReviewCommentBlade();
