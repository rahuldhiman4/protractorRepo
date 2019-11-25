import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class ViewTask {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        taskTypeValue: '[rx-view-component-id="057f2521-313b-40c9-be56-829827512abf"] p',
        editButton: '.edit-link ',
        viewCase: '[rx-view-component-id="036a7325-43e3-47e6-bb50-7f8d9fe8d118"] button',
        categoryTier1Value: '[rx-view-component-id="909ad3ad-6706-4d46-bb5a-bc48fa6ca98e"] p',
        categoryTier2Value: '[rx-view-component-id="49d231d9-ee81-4d7c-90af-d7ca785a32d4"] p',
        categoryTier3Value: '[rx-view-component-id="c8858fb5-5b21-4e0d-a947-c0130a72b51a"] p',
        categoryTier4Value: '[rx-view-component-id="ff1636f8-4efe-4447-9c04-f32799904f2b"] p',
        labelValue: '[rx-view-component-id="4c2784af-c080-4630-8f16-d9e6b07e87a2"] p',
        descriptionValue: '[rx-view-component-id="6053a7e8-5194-420b-965a-1c3bfe3ad0a1"] .show-less-wrapper',
        processnameValue: '[rx-view-component-id="7260c238-9e41-4d31-90de-2d46443117b4"] p',
        taskIdText: '[rx-view-component-id="75371088-cfeb-4554-a939-2fe7b2aa098b"] .text-field',
        taskIcon: '[rx-view-component-id="75371088-cfeb-4554-a939-2fe7b2aa098b"] [ng-if="icon"]',
        taskPriority: '[rx-view-component-id="75371088-cfeb-4554-a939-2fe7b2aa098b"] .selection-field',
        taskTimeDetails: '[rx-view-component-id="75371088-cfeb-4554-a939-2fe7b2aa098b"] .date-info',
        caseIdText: '.rx-record-preview-card__field .rx-record-preview-card__value',
        caseSummary:'[class="rx-record-preview-card__field ng-enter-prepare"]',
        taskSummary: '[rx-view-component-id="fa66e566-757c-4d10-a850-9ea3bd037707"] p',
        caseStatus: '[rx-view-component-id="1437179f-34be-4cb3-8f85-cf0ac6a83394"] .status-transition',
        requesterName: '[rx-view-component-id="3a7ac43c-0c25-4a46-abc6-9d59c2da09f7"] [class="person-name person-link"]',
        requesterContact: '[rx-view-component-id="3a7ac43c-0c25-4a46-abc6-9d59c2da09f7"] .ac-link-person-phone',
        requesterMail: '[rx-view-component-id="3a7ac43c-0c25-4a46-abc6-9d59c2da09f7"] .ac-link-person-email-disabled',
        assigneeName: '[rx-view-component-id="1801d8c6-4997-4253-b716-809b39909598"] .person-main',
        assignGroupText: '[rx-view-component-id="2193d81d-8ea7-457f-8a8e-9d0378a7a43a"] .d-textfield__label',
        assignCompany: '[rx-view-component-id="5cb6b3e9-1f3b-412f-a757-fb9c2a462e32"] .d-textfield__label',
    }

    async clickOnEditTask(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editButton)));
        await $(this.selectors.editButton).click();
    }

    async isTaskIdTextDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskIdText)));
        return await  $(this.selectors.taskIdText).isDisplayed();
    }

    async isTaskIconDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskIcon)));
        return await  $(this.selectors.taskIcon).isDisplayed();
    }

    async isTaskPriorityDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskPriority)));
        return await  $(this.selectors.taskPriority).isDisplayed();
    }

    async isTaskTimeDetailsDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskTimeDetails)));
        return await  $(this.selectors.taskTimeDetails).isDisplayed();
    }

    async isTaskSummaryDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskSummary)));
        return await  $(this.selectors.taskSummary).isDisplayed();
    }

    async isCaseSummaryDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.caseSummary)));
        return await  $(this.selectors.caseSummary).isDisplayed();
    }

    async isCaseIdDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.caseIdText)));
        return await  $(this.selectors.caseIdText).isDisplayed();
    }

    async isCaseStatusDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.caseStatus)));
        return await  $(this.selectors.caseStatus).isDisplayed();
    }

    async isEditLinkDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.editButton)));
        return await  $(this.selectors.editButton).isDisplayed();
    }

    async isViewCaseLinkDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.viewCase)));
        return await  $(this.selectors.viewCase).isDisplayed();
    }

    async isRequesterNameDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterName)));
        return await  $(this.selectors.requesterName).isDisplayed();
    }

    async isRequesterContactDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterContact)));
        return await  $(this.selectors.requesterContact).isDisplayed();
    }

    async isRequesterMailDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterMail)));
        return await  $(this.selectors.requesterMail).isDisplayed();
    }

    async isCategoryTier1ValueDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier1Value)));
        return await  $(this.selectors.categoryTier1Value).isDisplayed();
    }

    async isCategoryTier2ValueDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier2Value)));
        return await  $(this.selectors.categoryTier2Value).isDisplayed();
    }

    async isCategoryTier3ValueDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier3Value)));
        return await  $(this.selectors.categoryTier3Value).isDisplayed();
    }

    async isAssigneeNameDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneeName)));
        return await  $(this.selectors.assigneeName).isDisplayed();
    }

    async isAssignCompanyDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignCompany)));
        return await  $(this.selectors.assignCompany).isDisplayed();
    }

    async isAssignGroupTextDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignGroupText)));
        return await  $(this.selectors.assignGroupText).isDisplayed();
    }

    async clickOnViewCase(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.viewCase)));
        await $(this.selectors.viewCase).click();
    }

    async getCategoryTier1Value(): Promise<string> {
        await browser.wait(this.EC.presenceOf($(this.selectors.categoryTier1Value)));
        return await $(this.selectors.categoryTier1Value).getText();
    }

    async getCategoryTier2Value(): Promise<string> {
        await browser.wait(this.EC.presenceOf($(this.selectors.categoryTier2Value)));
        return await $(this.selectors.categoryTier2Value).getText();
    }

    async getCategoryTier3Value(): Promise<string> {
        await browser.wait(this.EC.presenceOf($(this.selectors.categoryTier3Value)));
        return await $(this.selectors.categoryTier3Value).getText();
    }

    async getCategoryTier4Value(): Promise<string> {
        await browser.wait(this.EC.presenceOf($(this.selectors.categoryTier4Value)));
        return await $(this.selectors.categoryTier4Value).getText();
    }

    async getLabelValue(): Promise<string> {
        await browser.wait(this.EC.presenceOf($(this.selectors.labelValue)));
        return await $(this.selectors.labelValue).getText();
    }

    async getDescriptionValue(): Promise<string> {
        await browser.wait(this.EC.presenceOf($(this.selectors.descriptionValue)));
        return await $(this.selectors.descriptionValue).getText();
    }

    async getTaskTypeValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskTypeValue)));
        return await $(this.selectors.taskTypeValue).getText();
    }

    async getProcessNameValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.processnameValue)));
        return await $(this.selectors.processnameValue).getText();
    }

    async getTaskID(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskIdText)));
        return await $(this.selectors.taskIdText).getText();
    }
}

export default new ViewTask();