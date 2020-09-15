import { $, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilityGrid from '../../utils/utility.grid';
import utilityCommon from '../../utils/utility.common';

class PersonProfilePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        personName: '[rx-view-component-id="bfa03a3b-cc7c-4d33-95d5-2c63a882aaeb"] .ac-person-full-name, .ac-person-full-name',
        personImage: 'button[aria-label="Profile menu"] span.a-profile__avatar',
        managerImage: '[rx-view-component-id="6f4a19be-2c96-4c58-b9c7-a49e2beb0c7b"] img',
        companyName: '[rx-view-component-id="bfa03a3b-cc7c-4d33-95d5-2c63a882aaeb"] .person-organization, .person-organization .text-secondary',
        phone: '[rx-view-component-id="d8be57c9-ee7c-4b08-84af-90c9a552b919"] .person-phone-link',
        email: '[rx-view-component-id="d8be57c9-ee7c-4b08-84af-90c9a552b919"] .person-link button, [rx-view-component-id="db6003d9-b50d-4c4a-be8b-9648afecce23"] .bwf-person-email button',
        site: '[rx-view-component-id="d8be57c9-ee7c-4b08-84af-90c9a552b919"] .person-site-text',
        managerName: '[rx-view-component-id="6f4a19be-2c96-4c58-b9c7-a49e2beb0c7b"] .person-name a',
        activityNotes: '.activity-feed-note textarea',
        assignedCasesGuid: '08bd2811-37eb-43a3-a1fe-de845fe6c5a6',
        requestedCaseGuid: '934faa1d-0932-4141-9a6e-7f6ac1726427',
        logTitle: '.activity-title',
        tabLocator: 'button.nav-link',
        tab: 'button[role="tab"] span.nav-link-wrapper',
        employeeType: '[rx-view-component-id="4ce8b56c-f9f4-4259-bbeb-62f15a7255b7"] .read-only-content, [rx-view-component-id="6ae2d2ca-a0c7-48d4-9c03-9714081518bf"] .read-only-content',
        jobTitle: '[rx-view-component-id="4457754f-8879-44d0-aec3-01e45e5fd1f1"] .read-only-content',
        personType: '[rx-view-component-id="bfa03a3b-cc7c-4d33-95d5-2c63a882aaeb"] .person-type span',
        loginId: '[rx-view-component-id="a97bb771-1f17-49a1-a043-dc778e5e0658"] .read-only-content, [rx-view-component-id="00e01e18-c688-4c97-b103-0eeed0f71f83"] .read-only-content',
        functionalRoles: '[rx-view-component-id="88f61dee-a8a7-4a06-b0c8-6fcd060cf7d1"] .read-only-content',
        corporateId: '[rx-view-component-id="5aa010cd-978c-4556-a25f-889e1f140b35"] .read-only-content',
        relatedCasesDisplayId: '.case-card .case-summary__meta-data__display-id'
    }

    async getCaseViewCount(TitleText: string): Promise<number> {
        return await element.all(by.cssContainingText(this.selectors.logTitle, TitleText)).count();
    }

    async clickOnTab(tabName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText(this.selectors.tab, tabName))), 7000);
        await element(by.cssContainingText(this.selectors.tab, tabName)).click();
    }

    async getPersonName(): Promise<string> {
        return await $(this.selectors.personName).getText();
    }

    async isPersonProfileImageDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.personImage)), 6000);
        let len: string = await $(this.selectors.personImage).getAttribute("style");
        return len.includes('url');
    }

    async isPersonManagerImageDisplayed(): Promise<boolean> {
        let len: string = await $(this.selectors.managerImage).getAttribute("src");
        return len.length - 34 > 0;
    }

    async getCompany(): Promise<string> {
        return await $(this.selectors.companyName).getText();
    }

    async getContactNumber(): Promise<string> {
        return await $(this.selectors.phone).getText();
    }

    async getEmail(): Promise<string> {
        return await $(this.selectors.email).getText();
    }

    async getManagerName(): Promise<string> {
        return await $(this.selectors.managerName).getText();
    }

    async getSite(): Promise<string> {
        return await $(this.selectors.site).getText();
    }

    async clickOnManagerLink(): Promise<void> {
        await $(this.selectors.managerName).click();
    }

    async isActivityNotesDisplayed(): Promise<boolean> {
        return await $(this.selectors.activityNotes).isPresent();
    }

    async isCasePresentOnRequestedCases(caseId: string): Promise<boolean> {
        await utilityGrid.clearFilter();
        await utilityGrid.searchRecord(caseId);
        return caseId == await utilityGrid.getFirstGridRecordColumnValue("Case ID", this.selectors.requestedCaseGuid);
    }

    async isCasePresentOnAssignedCases(caseId: string): Promise<boolean> {
        await utilityGrid.clearFilter(this.selectors.assignedCasesGuid);
        await utilityGrid.searchRecord(caseId, this.selectors.assignedCasesGuid);
        return caseId == await utilityGrid.getFirstGridRecordColumnValue("Case ID", this.selectors.assignedCasesGuid);
    }

    async addRequestedCaseGridColumn(columnNames: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnNames, this.selectors.requestedCaseGuid);
    }

    async removeRequestedCaseGridColumn(columnNames: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnNames, this.selectors.requestedCaseGuid);
    }

    async addAssignedCaseGridColumn(columnNames: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columnNames, this.selectors.assignedCasesGuid);
    }

    async removeAssignedCaseGridColumn(columnNames: string[]): Promise<void> {
        await utilityGrid.removeGridColumn(columnNames, this.selectors.assignedCasesGuid);
    }

    async areRequestedCaseColumnMatches(columnNames: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnNames, this.selectors.requestedCaseGuid);
    }

    async areAssignedCaseColumnMatches(columnNames: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columnNames, this.selectors.assignedCasesGuid);
    }

    async isRequestedCasesColumnsSortedAscending(columnName: string): Promise<boolean> {
        await utilityGrid.clearFilter();
        return await utilityGrid.isGridColumnSorted(columnName, "asc", this.selectors.requestedCaseGuid);
    }

    async isAssignedCasesColumnsSortedAscending(columnName: string): Promise<boolean> {
        await utilityGrid.clearFilter();
        return await utilityGrid.isGridColumnSorted(columnName, "asc", this.selectors.assignedCasesGuid);
    }

    async getEmployeeTypeValue(): Promise<string> {
        return await $(this.selectors.employeeType).getText();
    }

    async getJobTitle(): Promise<string> {
        return await $(this.selectors.jobTitle).getText();
    }

    async getPersonType(): Promise<string> {
        return await $(this.selectors.personType).getText();
    }

    async getLoginID(): Promise<string> {
        return await $(this.selectors.loginId).getText();
    }

    async getFunctionalRoles(): Promise<string> {
        return await $(this.selectors.functionalRoles).getText();
    }

    async isVIPTagPresent(): Promise<boolean> {
        return await $('.d-icon-vip').isPresent();
    }

    async getCorporateID(): Promise<string> {
        return await $(this.selectors.corporateId).getText();
    }

    async isCaseAvailableOnRelatedCases(caseId: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.relatedCasesDisplayId, caseId)).isPresent().then( async (result) => {
            if(result) return await element(by.cssContainingText(this.selectors.relatedCasesDisplayId, caseId)).isDisplayed();
        })
    }

    async isFieldLabelDisplayed(labelName: string): Promise<boolean> {
        let guid: string = undefined;
        switch (labelName) {
            case "Employee": {
                guid = '173d2bf1-5758-45ed-ae16-fdbf6a62d981, bfa03a3b-cc7c-4d33-95d5-2c63a882aaeb';
                break;
            }
            case "Job Title": {
                guid = 'fb7bf28b-a603-433c-9e48-6f42bbb60cab, 4457754f-8879-44d0-aec3-01e45e5fd1f1';
                break;
            }
            case "Corporate ID": {
                guid = 'e7274572-2e82-49fa-961f-d406853c452d, 5aa010cd-978c-4556-a25f-889e1f140b35';
                break;
            }
            case "Type": {
                guid = '6ae2d2ca-a0c7-48d4-9c03-9714081518bf, 4ce8b56c-f9f4-4259-bbeb-62f15a7255b7';
                break;
            }
            case "Login ID": {
                guid = '00e01e18-c688-4c97-b103-0eeed0f71f83, a97bb771-1f17-49a1-a043-dc778e5e0658';
                break;
            }
            case "FunctionalRoles": {
                guid = '1e8964a0-27b2-40b2-a957-00c247d48346, 88f61dee-a8a7-4a06-b0c8-6fcd060cf7d1';
                break;
            }
            case "Site": {
                guid = 'db6003d9-b50d-4c4a-be8b-9648afecce23, d8be57c9-ee7c-4b08-84af-90c9a552b919';
                break;
            }

            default: {
                console.log(labelName, ' is not a valid parameter');
                break;
            }
        }
        return await utilityCommon.isFieldLabelDisplayed(guid, labelName);
    }
}

export default new PersonProfilePage();