import {$$, $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from "../../utils/util.grid";

class PersonProfilePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        personName: '[rx-view-component-id="bfa03a3b-cc7c-4d33-95d5-2c63a882aaeb"] .ac-person-full-name',
        personImage: '.d-n-nav__profile img',
        managerImage: '[rx-view-component-id="6f4a19be-2c96-4c58-b9c7-a49e2beb0c7b"] img',
        companyName: '[rx-view-component-id="bfa03a3b-cc7c-4d33-95d5-2c63a882aaeb"] .person-organization',
        phone: '[rx-view-component-id="d8be57c9-ee7c-4b08-84af-90c9a552b919"] .ac-link-person-phone',
        email: '[rx-view-component-id="d8be57c9-ee7c-4b08-84af-90c9a552b919"] .ac-link-person-email-disabled',
        site: '[rx-view-component-id="d8be57c9-ee7c-4b08-84af-90c9a552b919"] .ac-text-site-value',
        managerName: '[rx-view-component-id="6f4a19be-2c96-4c58-b9c7-a49e2beb0c7b"] .person-name a',
        tabs: '[rx-view-component-id="a8207936-a379-4f6c-b450-90facc6b893c"] a.rx-tab',
        activityNotes: '.activity-feed-note input[title]',
        requestedCasesGuid: 'cdba89ff-683c-42ba-9c2a-3adf4322504c',
        assignedCasesGuid: '08bd2811-37eb-43a3-a1fe-de845fe6c5a6',
        threeDots: '.d-icon-ellipsis',
        selectVisibleColumns: '.d-dropdown__menu-options-item a'

    }

    async navigateToTab(tabName: string): Promise<void> {
        let tabLocator = await element(by.cssContainingText(this.selectors.tabs, tabName));
        await browser.wait(this.EC.elementToBeClickable(tabLocator));
        await tabLocator.click();
    }

    async navigateToRelatedCase(): Promise<void> {
        await this.navigateToTab('Related Cases');
    }

    async getPersonName(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.personName)));
        return await $(this.selectors.personName).getText();
    }

    async isPersonProfileImageDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personImage)));
        let len: string = await $(this.selectors.personImage).getAttribute("src");
        return len.length - 34 > 0;
    }

    async isPersonManagerImageDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.managerImage)));
        let len: string = await $(this.selectors.managerImage).getAttribute("src");
        return len.length - 34 > 0;
    }

    async getCompany(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.phone)));
        return await $(this.selectors.companyName).getText();
    }

    async getContactNumber(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.phone)));
        return await $(this.selectors.phone).getText();
    }

    async getEmail(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.phone)));
        return await $(this.selectors.email).getText();
    }

    async getManagerName(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.managerName)));
        return await $(this.selectors.managerName).getText();
    }

    async getSite(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.phone)));
        return await $(this.selectors.site).getText();
    }

    async clickOnManagerLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.managerName)));
        await $(this.selectors.managerName).click();
    }

    async isActivityNotesDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.phone)));
        return await $(this.selectors.activityNotes).isPresent();
    }

    async isCasePresentOnRequestedCases(caseId: string): Promise<boolean> {
        await utilGrid.clearFilter();
        await utilGrid.searchOnGridConsole(caseId);
        return caseId == await utilGrid.getSelectedGridRecordValue(this.selectors.requestedCasesGuid, "Case ID");
    }

    async isCasePresentOnAssignedCases(caseId: string): Promise<boolean> {
        await utilGrid.clearFilter();
        await utilGrid.searchOnGridConsole(caseId);
        return caseId == await utilGrid.getSelectedGridRecordValue(this.selectors.assignedCasesGuid, "Case ID");
    }

    async isReqtab

    //async getAllGuidColumns

}

export default new PersonProfilePage();