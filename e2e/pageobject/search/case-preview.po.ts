import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class SearchCasePreview {

    selectors = {
        fieldLabels: '.clearfix label',
        caseSummary: '[rx-view-component-id="2b082dbf-495a-4a0c-aadb-cf78555bbfb0"]  span',
        caseId: '[rx-view-component-id="6934b23e-3403-4b21-b4aa-a7a10283c8eb"] .title ',
        casePriority: '[rx-view-component-id="6934b23e-3403-4b21-b4aa-a7a10283c8eb"] .selection-field',
        caseStatus: '.status-transition span',
        requesterName: '[rx-view-component-id="a108323b-b110-41ed-9ad8-9dc7b0258c77"] .person-name a',
        requesterCompany: '.person-organization .text-secondary',
        requesterPhone: '[rx-view-component-id="a108323b-b110-41ed-9ad8-9dc7b0258c77"] .person-phone-link',
        requesterEmail: '.bwf-button-link-wrapper .bwf-button-link',
        requesterSite: '.bwf-person-site .person-site-text',
        source: '[rx-view-component-id="669b71fd-6e23-4625-91f6-139208e47538"] .read-only-content',
        caseSite: '[rx-view-component-id="974e5fdd-5992-4f87-a640-267c4cc3daae"] .read-only-content',
        assigneeName: '[rx-view-component-id="7e86cba3-c1f9-4478-bf59-ee986a3ca5dd"] .person-name a',
        assignedGroup: '[rx-view-component-id="2dfc8f80-2665-4e87-af2d-3d4d1137144d"] .read-only-content',
        assignedCompany: '[rx-view-component-id="3c3eaad4-9b00-48f0-b1d8-f3881e21e3bc"] .read-only-content',
        gotoCaseButton: '[rx-view-component-id="529287cb-4d9d-4729-aa6c-5676980df72e"] button',
        caseDescription: '[rx-view-component-id="c5be61e7-f05b-4e30-91d0-e67a32125ff9"] .collapse-block div'
    }

    async isFieldLabeltDisplayed(labelName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.fieldLabels, labelName)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.fieldLabels, labelName)).isDisplayed();
            } else return false;
        });
    }

    async isCaseSummarytDisplayed(caseSummary: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.caseSummary, caseSummary)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.caseSummary, caseSummary)).isDisplayed();
            } else return false;
        });
    }

    async isCaseIdDisplayed(caseId: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.caseId, caseId)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.caseId, caseId)).isDisplayed();
            } else return false;
        });
    }

    async isCasePriorityDisplayed(casePriority: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.casePriority, casePriority)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.casePriority, casePriority)).isDisplayed();
            } else return false;
        });
    }

    async isCaseStatusDisplayed(caseStatus: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.caseStatus, caseStatus)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.caseStatus, caseStatus)).isDisplayed();
            } else return false;
        });
    }

    async isRequesterNameDisplayed(requesterName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.requesterName, requesterName)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.requesterName, requesterName)).isDisplayed();
            } else return false;
        });
    }

    async isRequesterCompanyDisplayed(requesterCompany: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.requesterCompany, requesterCompany)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.requesterCompany, requesterCompany)).isDisplayed();
            } else return false;
        });
    }

    async isRequesterPhoneDisplayed(requesterPhone: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.requesterPhone, requesterPhone)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.requesterPhone, requesterPhone)).isDisplayed();
            } else return false;
        });
    }

    async isRequesterEmailDisplayed(requesterEmail: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.requesterEmail, requesterEmail)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.requesterEmail, requesterEmail)).isDisplayed();
            } else return false;
        });
    }

    async isRequesterSiteValueDisplayed(requesterSiteValue: string): Promise<boolean> {
        let requesterSiteValueText = await $$(this.selectors.requesterSite).getText();
        return await requesterSiteValueText.includes(requesterSiteValue);
    }

    async isSourceValueDisplayed(sourceVal: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.source, sourceVal)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.source, sourceVal)).isDisplayed();
            } else return false;
        });
    }

    async isCaseSiteValueDisplayed(caseSiteVal: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.caseSite, caseSiteVal)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.caseSite, caseSiteVal)).isDisplayed();
            } else return false;
        });
    }

    async isAssigneeNameDisplayed(assigneeName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.assigneeName, assigneeName)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.assigneeName, assigneeName)).isDisplayed();
            } else return false;
        });
    }

    async isAassignedGroupValueDisplayed(assignedGroupVal: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.assignedGroup, assignedGroupVal)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.assignedGroup, assignedGroupVal)).isDisplayed();
            } else return false;
        });
    }

    async isAssignedCompanyValueDisplayed(assignedCompanyVal: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.assignedCompany, assignedCompanyVal)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.assignedCompany, assignedCompanyVal)).isDisplayed();
            } else return false;
        });
    }

    async isGotoCaseButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.gotoCaseButton).isPresent().then(async (link) => {
            if (link) {
                return await $(this.selectors.gotoCaseButton).isDisplayed();
            } else return false;
        });
    }

    async clickOnGotoCaseButton(): Promise<void> {
        await $(this.selectors.gotoCaseButton).click();
    }

    async isCaseDescriptionDisplayed(caseDescription:string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.caseDescription, caseDescription)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.caseDescription, caseDescription)).isDisplayed();
            } else return false;
        });
    }

}
export default new SearchCasePreview();