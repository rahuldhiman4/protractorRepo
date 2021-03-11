import { $, $$, by, element, ElementFinder, Key, protractor, ProtractorExpectedConditions } from "protractor";
import { DropDownType } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

class ChangeAssignmentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        changeAssignmentComponent: 'bwf-change-assignment button',
        assignButton: 'rx-runtime-view-modal button.btn-primary',
        searchAsignee: '[class="search-input"] .adapt-search-field-wrapper input',
        assignee: '.person__info .name',
        knowledgeReviewGuid: 'b56b4649-9f86-4ba9-a8a5-56d9c000cc89',
        assigneeHierarchy: '.read-only-hierachy div.read-only-content',
        assigneeValue: '.assignment-read-only .person-main a'
    }

    async isDropDownDisplayed(dropDownName: string, guid?: string): Promise<boolean> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        let dropDownElement: ElementFinder;
        switch (dropDownName) {
            case "Company": {
                dropDownElement = await $$(locator).get(0);
                break;
            }
            case "SupportOrg": {
                dropDownElement = await $$(locator).get(1);
                break;
            }
            case "AssignedGroup": {
                dropDownElement = await $$(locator).get(2);
                break;
            }
            case "Assignee": {
                dropDownElement = await $$(locator).get(3);
                break;
            }
            default: {
                console.log('Dropdown Not Available');
                break;
            }
        }
        return await dropDownElement.isDisplayed();
    }

    async isFieldDisabled(dropDownName: string, guid?: string): Promise<boolean> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        switch (dropDownName) {
            case "Company": {
                return await $$(locator).get(0).getAttribute("aria-disabled") == "true";
            }
            case "SupportOrg": {
                return await $$(locator).get(1).getAttribute("aria-disabled") == "true";
            }
            case "AssignedGroup": {
                return await $$(locator).get(2).getAttribute("aria-disabled") == "true";
            }
            case "Assignee": {
                return await $$(locator).get(3).getAttribute("aria-disabled") == "true";
            }
            case "AssignToMe": {
                return await $$(locator).get(4).getAttribute("aria-disabled") == "true";
            }
            default: {
                console.log('Dropdown Not Available');
                break;
            }
        }
    }

    async setDropDownValue(dropDownName: string, dropDownValue: string, guid?: string): Promise<void> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        let dropDownElement: ElementFinder;
        switch (dropDownName) {
            case "Company": {
                dropDownElement = await $$(locator).get(0);
                break;
            }
            case "SupportOrg": {
                dropDownElement = await $$(locator).get(1);
                break;
            }
            case "AssignedGroup": {
                dropDownElement = await $$(locator).get(2);
                break;
            }
            case "Assignee": {
                dropDownElement = await $$(locator).get(3);
                break;
            }
            default: {
                console.log('Dropdown Not Available');
                break;
            }
        }
        await utilityCommon.selectDropDown(dropDownElement, dropDownValue, DropDownType.WebElement);
    }

    async getDropDownValue(dropDownName: string, guid?: string): Promise<string> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        let dropDownElement: ElementFinder;
        switch (dropDownName) {
            case "Company": {
                dropDownElement = await $$(locator).get(0);
                break;
            }
            case "SupportOrg": {
                dropDownElement = await $$(locator).get(1);
                break;
            }
            case "AssignedGroup": {
                dropDownElement = await $$(locator).get(2);
                break;
            }
            case "Assignee": {
                dropDownElement = await $$(locator).get(3);
                break;
            }
            default: {
                console.log('Dropdown Not Available');
                break;
            }
        }
        return await dropDownElement.getText();
    }

    async isValuePresentInDropDown(dropDownName: string, dropDownValue: string, guid?: string): Promise<boolean> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        let dropDownElement: ElementFinder;
        switch (dropDownName) {
            case "Company": {
                dropDownElement = await $$(locator).get(0);
                break;
            }
            case "SupportOrg": {
                dropDownElement = await $$(locator).get(1);
                break;
            }
            case "AssignedGroup": {
                dropDownElement = await $$(locator).get(2);
                break;
            }
            case "Assignee": {
                dropDownElement = await $$(locator).get(3);
                break;
            }
            default: {
                console.log('Dropdown Not Available');
                break;
            }
        }
        return await utilityCommon.isValuePresentInDropDown(dropDownElement, dropDownValue);
    }

    async isAllValuePresentInDropDown(dropDownName: string, dropDownValueArr: string[], guid?: string): Promise<boolean> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        let dropDownElement: ElementFinder;
        switch (dropDownName) {
            case "Company": {
                dropDownElement = await $$(locator).get(0);
                break;
            }
            case "SupportOrg": {
                dropDownElement = await $$(locator).get(1);
                break;
            }
            case "AssignedGroup": {
                dropDownElement = await $$(locator).get(2);
                break;
            }
            case "Assignee": {
                dropDownElement = await $$(locator).get(3);
                break;
            }
            default: {
                console.log('Dropdown Not Available');
                break;
            }
        }
        return await utilityCommon.isAllDropDownValuesMatches(dropDownElement, dropDownValueArr, DropDownType.WebElement);
    }

    async isAssignToMeCheckBoxSelected(): Promise<boolean> {
        return await $('.checkbox__input').isSelected();
    }

    //May not required now
    async isSearchInputBoxPresent(): Promise<boolean> {
        return await $(this.selectors.searchAsignee).isDisplayed();
    }

    //deprecated now
    async clickOnAssignButton(): Promise<void> {
        await $(this.selectors.assignButton).click();
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

    async setAssignee(company: string, supportOrg: string, assignedGroup: string, assignee: string, guid?: string): Promise<void> {
        await this.setDropDownValue('Company', company, guid);
        await this.setDropDownValue('SupportOrg', supportOrg, guid);
        await this.setDropDownValue('AssignedGroup', assignedGroup, guid);
        await this.setDropDownValue('Assignee', assignee, guid);
    }

    // write separate method for this operation
    async setAssigneeOnBlade(company: string, bu: string, group: string, assignee: string): Promise<void> {
        await this.setDropDownValue('Company', company);
        await this.setDropDownValue('SupportOrg', bu);
        //await this.setDropDownValue('AssignedGroup', group);
        await this.setDropDownValue('Assignee', assignee);
        await this.clickOnAssignButton();
    }

    async clickAssignToMeBtn(guid?: string): Promise<void> {
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        await $$(locator).get(4).click();
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

    async isDropDownListSorted(dropDownName: string, guid?: string): Promise<boolean> {
        let arr: string[] = [], copy: string[] = [];
        arr = await this.getAllDropDownValues(dropDownName, guid);
        copy = Object.assign([], arr);
        copy = copy.sort();
        arr = arr.sort();
        return arr.length === copy.length && arr.every(
            (value, index) => (value === copy[index])
        );
    }

    async getAllDropDownValues(dropDownName: string, guid?: string): Promise<string[]> {
        let dropDownElement: ElementFinder;
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        switch (dropDownName) {
            case "Company": {
                dropDownElement = await $$(locator).get(0);
                break;
            }
            case "SupportOrg": {
                dropDownElement = await $$(locator).get(1);
                break;
            }
            case "AssignedGroup": {
                dropDownElement = await $$(locator).get(2);
                break;
            }
            case "Assignee": {
                dropDownElement = await $$(locator).get(3);
                break;
            }
            default: {
                console.log('Dropdown Not Available');
                break;
            }
        }
        return utilityCommon.getAllDropDownValues(dropDownElement, DropDownType.WebElement);
    }

    async isFullHierarchyPresent(dropDownName: string, OrgValue: string, hierarchyName: string, guid?: string): Promise<boolean> {
        let dropDownElement: ElementFinder;
        let locator = this.selectors.changeAssignmentComponent;
        if (guid) locator = `bwf-change-assignment[rx-view-component-id="${guid}"] button`;
        switch (dropDownName) {
            case "Company": {
                dropDownElement = await $$(locator).get(0);
                break;
            }
            case "SupportOrg": {
                dropDownElement = await $$(locator).get(1);
                break;
            }
            case "AssignedGroup": {
                dropDownElement = await $$(locator).get(2);
                break;
            }
            case "Assignee": {
                dropDownElement = await $$(locator).get(3);
                break;
            }
            default: {
                console.log('Dropdown Not Available');
                break;
            }
        }

        await dropDownElement.click();
        await $$('input').last().sendKeys(OrgValue);
        return await element(by.cssContainingText('.dropdown-item', hierarchyName)).isPresent().then(async (result) => {
            if(result) return await element(by.cssContainingText('.dropdown-item', hierarchyName)).isDisplayed();
            else return false;
        });
    }

    async getAssigneeHierarchy(): Promise<string> {
        return await $(this.selectors.assigneeHierarchy).getText();
    }

    async getSupportOrgText(): Promise<string> {
        let hirearchy = await this.getAssigneeHierarchy();
        return (hirearchy.split('>')[1]).trim();
    }

    async getAssignedCompanyText(): Promise<string> {
        let hirearchy = await this.getAssigneeHierarchy();
        return (hirearchy.split('>')[0]).trim();
    }

    async getAssignedGroupText(): Promise<string> {
        let hirearchy = await this.getAssigneeHierarchy();
        return (hirearchy.split('>')[2]).trim();
    }

    async getAssigneeValue(): Promise<string> {
        return await $(this.selectors.assigneeValue).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.assigneeValue).getText();
            else return await $(".assignment-read-only .person-main p").getText();;
        });
    }
}

export default new ChangeAssignmentBlade();
