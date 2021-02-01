import { $, $$, by, element, ElementFinder, Key, protractor, ProtractorExpectedConditions } from "protractor";
import { DropDownType } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

class ChangeAssignmentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        changeAssignmentComponent: 'bwf-change-assignment button',
        assignButton: '.modal-footer .btn-primary',
        searchAsignee: '[class="search-input"] .adapt-search-field-wrapper input',
        assignee: '.person__info .name',
        supportGroupName: '.person__info',
    }

    //May not required. Test steps need to change
    async isAssignToMeCheckBoxSelected(): Promise<boolean> {
        return await $('.checkbox__input').isSelected();
    }

    //Will remain same
    async getCompanyDefaultValue(guid?: string): Promise<string> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        return await $$(locator).get(0).getText();
    }

    ////Will remain same
    async getAssignedGroupDefaultValue(guid?: string): Promise<string> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        return await $$(locator).get(2).getText();
    }

    //Updated
    async getAssigneeValue(guid?: string): Promise<string> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        return await $$(locator).get(3).getText();
    }

    //May not required now
    async isSearchInputBoxPresent(): Promise<boolean> {
        return await $(this.selectors.searchAsignee).isDisplayed();
    }

    //Will remain same
    async isCompanyDrpDwnDisplayed(guid?: string): Promise<boolean> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        return await $$(locator).get(0).isDisplayed();
    }

    //Will remain same
    async isSupporOrgDrpDwnDisplayed(guid?: string): Promise<boolean> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        return await $$(locator).get(1).isDisplayed();
    }

    //Will remain same
    async isAssignedGroupDrpDwnDisplayed(guid?: string): Promise<boolean> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        return await $$(locator).get(2).isDisplayed();
    }

    async isAssigneeDrpDwnDisplayed(guid?: string): Promise<boolean> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        return await $$(locator).get(3).isDisplayed();
    }

    //deprecated now
    async clickOnAssignButton(): Promise<void> {
        await $(this.selectors.assignButton).click();
    }

    //deprecated now
    async getCountOfSupportGroup(): Promise<number> {
        return await $$(this.selectors.supportGroupName).count();
    }

    //deprecated now
    async clickOnSupportGroup(name: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.supportGroupName, name)).click();
    }

    //deprecated now
    async getTextOfSupportGroup(name: string): Promise<string> {
        return await element(by.cssContainingText(this.selectors.supportGroupName, name)).getText();
    }

    async isAssignButtonDisabled(): Promise<Boolean> {
        return await $(this.selectors.assignButton).getAttribute("disabled") == "true";
    }

    //deprecated now
    async clickOnAssignToMeCheckBox(): Promise<void> {
        await $('.manual-select-sg-msg').click();
    }

    //deprecated now
    async clickOnCancelButton(): Promise<void> {
        await $('.modal-footer .btn-secondary').click();
    }

    async selectCompany(company: string, guid?: string): Promise<void> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        const dropDownElement = await $$(locator).get(0);
        await utilityCommon.selectDropDown(dropDownElement, company, DropDownType.WebElement);
    }

    async selectSupportOrg(supportOrg: string, guid?: string): Promise<void> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        const dropDownElement = await $$(locator).get(1);
        await utilityCommon.selectDropDown(dropDownElement, supportOrg, DropDownType.WebElement);
    }

    async selectAssignedGroup(assignedGroup: string, guid?: string): Promise<void> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        const dropDownElement = await $$(locator).get(2);
        await utilityCommon.selectDropDown(dropDownElement, assignedGroup, DropDownType.WebElement);
    }

    async selectAssignee(assignee: string, guid?: string): Promise<void> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        const dropDownElement = await $$(locator).get(3);
        await utilityCommon.selectDropDown(dropDownElement, assignee, DropDownType.WebElement);
    }

    async setAssignee(company: string, supportOrg: string, assignedGroup: string, assignee: string, guid?: string): Promise<void> {
        await this.selectCompany(company, guid);
        await this.selectSupportOrg(supportOrg, guid);
        await this.selectAssignedGroup(assignedGroup, guid);
        await this.selectAssignee(assignee, guid);
    }

    async selectNoneCompany(guid?: string): Promise<void> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        const dropDownElement = await $$(locator).get(0);
        await utilityCommon.selectDropDown(dropDownElement, 'None', DropDownType.WebElement);
    }

    async isAgentListSorted(): Promise<boolean> {
        // use apurva's getAllDropDownValueMethod
        let arr: string[] = [], copy: string[] = [];
        let agentRecords: number = await $$('div[aria-label*="name"]').count();
        for (let i = 0; i < agentRecords; i++) {
            let ab: string = await $$('div[aria-label*="name"]').get(i).getText();
            arr[i] = ab;
        }
        copy = Object.assign([], arr);
        copy = copy.sort();
        arr = arr.sort();
        return arr.length === copy.length && arr.every(
            (value, index) => (value === copy[index])
        );
    }

    // write separate method for this operation
    async setAssigneeOnBlade(company: string, bu: string, group: string, assignee: string): Promise<void> {
        await this.selectCompany(company);
        await this.selectSupportOrg(bu);
        await this.selectAssignedGroup(group);
        await this.selectAssigneeOnBlade(assignee);
        await this.clickOnAssignButton();
    }

    // write separate method for this operation
    async selectAssigneeOnBlade(name: string): Promise<void> {
        await $(this.selectors.searchAsignee).click();
        await $(this.selectors.searchAsignee).sendKeys(name + Key.ENTER);
        await element(by.cssContainingText(this.selectors.assignee, name)).click();
    }

    async selectAssignToSupportGroupOnBlade(): Promise<void> {
        await $('.d-icon-users_circle').isPresent().then(async (result) => {
            if (result) await element(by.cssContainingText(this.selectors.assignee, 'Assign to Support Group')).click();
        });
    }

    async clickAssignToMeBtn(guid?: string): Promise<void> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        await $$(locator).get(4).click();
    }

    async isSupporOrgPresentInDropDown(supportOrg: string, guid?: string): Promise<boolean> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        const dropDownElement = await $$(locator).get(1);
        return await utilityCommon.isValuePresentInDropDown(dropDownElement, supportOrg);
    }

    async isAssigneePresentInDropDown(assignee: string, guid?: string): Promise<boolean> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        const dropDownElement = await $$(locator).get(3);
        return await utilityCommon.isValuePresentInDropDown(dropDownElement, assignee);
    }

    async isPersonAvailableOnAssignBlade(name: string): Promise<boolean> {
        await $(this.selectors.searchAsignee).click();
        await $(this.selectors.searchAsignee).clear();
        await $(this.selectors.searchAsignee).sendKeys(name + Key.ENTER);
        return await element(by.cssContainingText(this.selectors.assignee, name)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.assignee, name)).isDisplayed();
            else return false;
        });
    }

    // remove
    async isValuePresentInDropdown(dropDownLabel: string, dropDownValue: string): Promise<boolean> {
        let elementDropdown: ElementFinder = await element(by.cssContainingText('.assignment-component-wrapper bwf-select-with-pagination button', `Select ${dropDownLabel}`));
        return await utilityCommon.isValuePresentInDropDown(elementDropdown, dropDownValue);
    }
}

export default new ChangeAssignmentBlade();