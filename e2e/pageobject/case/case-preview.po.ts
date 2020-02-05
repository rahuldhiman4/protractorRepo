import { $, protractor, ProtractorExpectedConditions } from "protractor";

class CasePreview {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        header: '.dialog-header-confirm h3',
        viewCaseButton: '[rx-view-component-id="fbfc234b-c34f-4aab-ac54-b3a9eddecebf"] button',
        caseSummary: '[rx-view-component-id="2b082dbf-495a-4a0c-aadb-cf78555bbfb0"] span',
        caseId: '[rx-view-component-id="6934b23e-3403-4b21-b4aa-a7a10283c8eb"] .title',
        priority: '[rx-view-component-id="6934b23e-3403-4b21-b4aa-a7a10283c8eb"] .selection-field',
        caseStatus: '[rx-view-component-id="6bbd4072-3626-49a4-8813-b1a456674fc7"] .status-transition',
        requesterName: '[rx-view-component-id="a108323b-b110-41ed-9ad8-9dc7b0258c77"]  a[title]',
        requestPhoneNumber: '[rx-view-component-id="a108323b-b110-41ed-9ad8-9dc7b0258c77"] .ac-link-person-phone',
        requesterEmailId: '[rx-view-component-id="a108323b-b110-41ed-9ad8-9dc7b0258c77"] .ac-link-person-email-disabled',
        requesterSite: '[rx-view-component-id="a108323b-b110-41ed-9ad8-9dc7b0258c77"] .ac-text-site-value',
        caseTemplate: '[rx-view-component-id="ffb8da80-b878-4b11-8aec-3bd146aab6c0"] p',
        description: '[rx-view-component-id="c5be61e7-f05b-4e30-91d0-e67a32125ff9"] .show-less-wrapper div',
        categoryTier1: '[rx-view-component-id="8668462b-3aac-4f43-8793-fc49aafbd5c6"] p',
        categoryTier2: '[rx-view-component-id="1068f2e1-1d3a-48a4-a0ed-ef1a8631ddc1"] p',
        categoryTier3: '[rx-view-component-id="1f32a2f6-ed6c-4b73-be36-c2990cb5a882"] p',
        assignee: '[rx-view-component-id="7e86cba3-c1f9-4478-bf59-ee986a3ca5dd"] a[title]',
        assignedGroup: '[rx-view-component-id="2dfc8f80-2665-4e87-af2d-3d4d1137144d"] .d-textfield__rx-value',
        assignedCompany: '[rx-view-component-id="3c3eaad4-9b00-48f0-b1d8-f3881e21e3bc"] .d-textfield__rx-value',
        createNewCaseButton: '[rx-view-component-id="e8e6eafe-d19c-4eeb-ab37-8ff302505579"] button',
    }

    async clickOnViewCaseButton(): Promise<void> {
        await $(this.selectors.viewCaseButton).click();
    }

    async isTitleDisplayed(): Promise<boolean> {
        let titleText = await $(this.selectors.header).getText();
        return titleText == "Case Preview" ? true : false;
    }

    async isCaseSummaryDisplayed(caseSummary: string): Promise<boolean> {
        let caseSummaryText = await $(this.selectors.caseSummary).getText();
        return caseSummaryText == caseSummary ? true : false;
    }

    async isCaseIdDisplayed(): Promise<boolean> {
        return await $(this.selectors.caseId).isDisplayed();
    }

    async isPriorityDisplayed(priority: string): Promise<boolean> {
        let priorityText = await $(this.selectors.priority).getText();
        return priorityText == priority ? true : false;
    }

    async isCaseStatusDisplayed(status: string): Promise<boolean> {
        let statusText = await $(this.selectors.caseStatus).getText();
        return statusText == status ? true : false;
    }

    async isRequesterNameDisplayed(requesterName: string): Promise<boolean> {
        let requesterNameText = await $(this.selectors.requesterName).getText();
        return requesterNameText == requesterName ? true : false;
    }

    async isRequesterPhoneDisplayed(requestPhoneNumber: string): Promise<boolean> {
        let requestPhoneNumberText = await $(this.selectors.requestPhoneNumber).getText();
        return requestPhoneNumberText == requestPhoneNumber ? true : false;
    }

    async isRequesterEmailIdDisplayed(requesterEmailId: string): Promise<boolean> {
        let requesterEmailIdText = await $(this.selectors.requesterEmailId).getText();
        return requesterEmailIdText == requesterEmailId ? true : false;
    }

    async isRequesterSiteDisplayed(requesterSite: string): Promise<boolean> {
        let requesterSiteText = await $(this.selectors.requesterSite).getText();
        return requesterSiteText == requesterSite ? true : false;
    }

    async isCaseTemplateDisplayed(caseTemplate: string): Promise<boolean> {
        let caseTemplateText = await $(this.selectors.caseTemplate).getText();
        return caseTemplateText == caseTemplate ? true : false;
    }

    async isDescriptionDisplayed(description: string): Promise<boolean> {
        let descriptionText = await $(this.selectors.description).getText();
        return descriptionText.includes(description);
    }

    async isViewCaseButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.viewCaseButton).isDisplayed();
    }

    async iscreateNewCaseButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.createNewCaseButton).isDisplayed();
    }

    async isCategoryTier1Displayed(categoryTier1: string): Promise<boolean> {
        let categoryTier1Text = await $(this.selectors.categoryTier1).getText();
        console.log('This is caterogry tier1=' + categoryTier1Text);
        return categoryTier1Text == categoryTier1 ? true : false;
    }

    async isCategoryTier2Displayed(categoryTier2: string): Promise<boolean> {
        let categoryTier2Text = await $(this.selectors.categoryTier2).getText();
        return categoryTier2Text == categoryTier2 ? true : false;
    }

    async isCategoryTier3Displayed(categoryTier3: string): Promise<boolean> {
        let categoryTier3Text = await $(this.selectors.categoryTier3).getText();
        return categoryTier3Text == categoryTier3 ? true : false;
    }

    async isAssigneeDisplayed(assignee: string): Promise<boolean> {
        let assigneeText = await $(this.selectors.assignee).getText();
        return assigneeText == assignee ? true : false;
    }

    async isAssignedGroupDisplayed(assignedGroup: string): Promise<boolean> {
        let assignedGroupText = await $(this.selectors.assignedGroup).getText();
        return assignedGroupText == assignedGroup ? true : false;
    }

    async isAssignedCompanyDisplayed(assignedCompany: string): Promise<boolean> {
        let assignedCompanyText = await $(this.selectors.assignedCompany).getText();
        return assignedCompanyText == assignedCompany ? true : false;
    }

    async isCreateNewCaseButton(): Promise<boolean> {
        return await $(this.selectors.viewCaseButton).isDisplayed();
    }



}

export default new CasePreview();