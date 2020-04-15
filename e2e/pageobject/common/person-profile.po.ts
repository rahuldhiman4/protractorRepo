import { $, $$, by, element, protractor, ProtractorExpectedConditions, promise, browser } from "protractor";
import utilGrid from "../../utils/util.grid";
import utilityGrid from '../../utils/utility.grid';

class PersonProfilePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        personName: '[rx-view-component-id="bfa03a3b-cc7c-4d33-95d5-2c63a882aaeb"] .ac-person-full-name',
        personImage: 'button[aria-label="Profile menu"] span.a-profile__avatar',
        managerImage: '[rx-view-component-id="6f4a19be-2c96-4c58-b9c7-a49e2beb0c7b"] img',
        companyName: '[rx-view-component-id="bfa03a3b-cc7c-4d33-95d5-2c63a882aaeb"] .person-organization',
        phone: '[rx-view-component-id="d8be57c9-ee7c-4b08-84af-90c9a552b919"] .person-phone-link',
        email: '[rx-view-component-id="d8be57c9-ee7c-4b08-84af-90c9a552b919"] .person-link button',
        site: '[rx-view-component-id="d8be57c9-ee7c-4b08-84af-90c9a552b919"] .person-site-text',
        managerName: '[rx-view-component-id="6f4a19be-2c96-4c58-b9c7-a49e2beb0c7b"] .person-name a',
        activityNotes: '.activity-feed-note textarea',
        assignedCasesGuid: '08bd2811-37eb-43a3-a1fe-de845fe6c5a6',
        requestedCaseGuid: '934faa1d-0932-4141-9a6e-7f6ac1726427',
        logTitle: '.activity-title',
        tabLocator: 'button.nav-link',
    }

    async getCaseViewCount(TitleText: string): Promise<number> {
        return await element.all(by.cssContainingText(this.selectors.logTitle, TitleText)).count();
    }

    async clickOnTab(tabName: string): Promise<void> {
        switch (tabName) {
            case "Related Persons": {
                await $$(this.selectors.tabLocator).get(0).click();
                break;
            }
            case "Requested Cases": {
                await $$(this.selectors.tabLocator).get(1).click();
                break;
            }
            case "Assigned Cases": {
                await $$(this.selectors.tabLocator).get(2).click();
                break;
            }
            case "Support Groups": {
                await $$(this.selectors.tabLocator).get(3).click();
                break;
            }
            case "Related Cases": {
                await $$(this.selectors.tabLocator).get(4).click();
                break;
            }
            default: {
                console.log(tabName, ' is not a valid tab name');
                break;
            }
        }
    }

    async getPersonName(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.personName)));
        return await $(this.selectors.personName).getText();
    }

    async isPersonProfileImageDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personImage)));
        let len: string = await $(this.selectors.personImage).getAttribute("style");
        return await len.includes('url');
    }

    async isPersonManagerImageDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.managerImage)));
        let len: string = await $(this.selectors.managerImage).getAttribute("src");
        return len.length - 34 > 0;
    }

    async getCompany(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.phone)));
        return await $(this.selectors.companyName).getText();
    }

    async getContactNumber(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.phone)));
        return await $(this.selectors.phone).getText();
    }

    async getEmail(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.phone)));
        return await $(this.selectors.email).getText();
    }

    async getManagerName(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.managerName)));
        return await $(this.selectors.managerName).getText();
    }

    async getSite(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.phone)));
        return await $(this.selectors.site).getText();
    }

    async clickOnManagerLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.managerName)));
        await $(this.selectors.managerName).click();
    }

    async isActivityNotesDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.phone)));
        return await $(this.selectors.activityNotes).isPresent();
    }

    async isCasePresentOnRequestedCases(caseId: string): Promise<boolean> {
        await utilityGrid.clearFilter();
        await utilityGrid.searchRecord(caseId);
        return caseId == await utilityGrid.getFirstGridRecordColumnValue("Case ID", this.selectors.requestedCaseGuid);
    }

    async isCasePresentOnAssignedCases(caseId: string): Promise<boolean> {
        await utilityGrid.clearFilter();
        await utilityGrid.searchRecord(caseId);
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

}

export default new PersonProfilePage();