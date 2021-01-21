import { $, $$, by, element, Key, protractor, ProtractorExpectedConditions, ElementFinder } from "protractor";
import utilityCommon from '../../utils/utility.common';

class ChangeAssignmentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        changeAssignmentButton: '[rx-view-component-id="6041cce1-05bd-458d-b097-eb310507cae3"] button',
        assignButton: '.modal-footer .btn-primary',
        assignmentDropDownList: '.flex-wrap bwf-select-with-pagination, .change-assignment-component-wrapper adapt-rx-select',
        selectOptions: '.dropdown-item span,.default-support-group .popup-person',
        cancelButton: '.modal-footer .btn-secondary',
        multipleSuppGrpMsg: '.manual-select-sg-msg',
        assignToMeCheckBox: '.checkbox__input',
        searchAsignee: '[class="search-input"] .adapt-search-field-wrapper input',
        assignee: '.person__info .name',
        filterDropdowns: '.flex-wrap button.dropdown-toggle',
        businessUnit: 'selectedBusinessUnitId',
        supportGroupName: '.person__info',
        department: 'selectedDepartmentId',
        supportGroup: 'selectedSupportGroupId',
        agentName: 'div[aria-label*="name"]',
        assignToMeBtn: 'bwf-assign-to-me button'
    }

    //May not required. Test steps need to change
    async isAssignToMeCheckBoxSelected(): Promise<boolean> {
        return await $(this.selectors.assignToMeCheckBox).isSelected();
    }

    //Will remain same
    async getCompanyDefaultValue(): Promise<string> {
        return await $$(this.selectors.filterDropdowns).get(0).getText();
    }

    ////Will remain same
    async getSupportGroupDefaultValue(): Promise<string> {
        return await $$(this.selectors.filterDropdowns).get(3).getText();
    }

    //May not required now
    async isSearchInputBoxPresent(): Promise<boolean> {
        return await $(this.selectors.searchAsignee).isDisplayed();
    }

    //Will remain same
    async isCompanyDrpDwnDisplayed(): Promise<boolean> {
        return await $$(this.selectors.filterDropdowns).get(0).isDisplayed();
    }

    //Will remain same
    async isBuisnessUnitDrpDwnDisplayed(): Promise<boolean> {
        return await $$(this.selectors.filterDropdowns).get(1).isDisplayed();
    }

    //Will remain same
    async isDepartmentDrpDwnDisplayed(): Promise<boolean> {
        return await $$(this.selectors.filterDropdowns).get(2).isDisplayed();
    }

    //Will remain same
    async isSupportGroupDrpDwnDisplayed(): Promise<boolean> {
        return await $$(this.selectors.filterDropdowns).get(3).isDisplayed();
    }

    async isAssigneeListPresent(): Promise<boolean> {
        return await $$(this.selectors.filterDropdowns).get(3).isDisplayed();
    }

    //Updated
    async getAssigneeName(): Promise<string> {
        return await $$(this.selectors.filterDropdowns).get(3).getText();
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
        await $(this.selectors.assignToMeCheckBox).click();
    }

    //deprecated now
    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async selectCompany(companyValue: string): Promise<void> {
        const companyDropDown = await $$(this.selectors.assignmentDropDownList).get(0);
        await companyDropDown.$('button').click();
        await companyDropDown.$('input').sendKeys(companyValue);
        let option = await element(by.cssContainingText(this.selectors.selectOptions, companyValue));
        await option.click();
    }

    async selectBusinessUnit(businessUnit: string): Promise<void> {
        const businessUnitDropDown = await $$(this.selectors.assignmentDropDownList).get(1);
        await businessUnitDropDown.$('button').click();
        await businessUnitDropDown.$('input').sendKeys(businessUnit);
        await element(by.cssContainingText(this.selectors.selectOptions, businessUnit)).click();
    }

    async selectDepartment(department: string): Promise<void> {
        const departmentDropdown = await $$(this.selectors.assignmentDropDownList).get(2);
        await departmentDropdown.$('button').click();
        await departmentDropdown.$('input').sendKeys(department);
        let option = await element(by.cssContainingText(this.selectors.selectOptions, department));
        await option.click();
    }

    async selectSupportGroup(supportGroup: string): Promise<void> {
        const supportGroupDropDown = await $$(this.selectors.assignmentDropDownList).get(2);
        await supportGroupDropDown.$('button').click();
        await supportGroupDropDown.$('input').sendKeys(supportGroup);
        let option = await element(by.cssContainingText(this.selectors.selectOptions, supportGroup));
        await option.click();
    }

    async selectAssignee(name: string): Promise<void> {
        const supportGroupDropDown = await $$(this.selectors.assignmentDropDownList).get(3);
        await supportGroupDropDown.$('button').click();
        await supportGroupDropDown.$('input').sendKeys(name);
        let option = await element(by.cssContainingText('.support-agent-list .popup-person' , name));
        await option.click();
    }

    async setAssignee(company: string, bu: string, group: string, assignee: string): Promise<void> {
        await this.selectCompany(company);
        await this.selectBusinessUnit(bu);
        await this.selectSupportGroup(group);
        await this.selectAssignee(assignee);
    }

    async isAgentListSorted(): Promise<boolean> {
        let arr: string[] = [], copy: string[] = [];
        let agentRecords: number = await $$(this.selectors.agentName).count();
        for (let i = 0; i < agentRecords; i++) {
            let ab: string = await $$(this.selectors.agentName).get(i).getText();
            arr[i] = ab;
        }
        copy = Object.assign([], arr);
        copy = copy.sort();
        arr = arr.sort();
        return arr.length === copy.length && arr.every(
            (value, index) => (value === copy[index])
        );
    }

    async setAssigneeOnBlade(company: string, bu: string, group: string, assignee: string): Promise<void> {
        await this.selectCompany(company);
        await this.selectBusinessUnit(bu);
        await this.selectSupportGroup(group);
        await this.selectAssigneeOnBlade(assignee);
        await this.clickOnAssignButton();
    }

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

    async isAssignmentFieldsDisabled(): Promise<boolean> {
        let stat = false;
        for (let i = 0; i < (await $$(this.selectors.assignmentDropDownList)).length; i++) {
            if (!(await ($$(this.selectors.assignmentDropDownList).get(i).$('button').isEnabled()))) stat = true;
            else {
                stat = false;
                break;
            }
        }
        return stat;
    }

    async clickAssignToMeBtn(): Promise<void> {
        await $(this.selectors.assignToMeBtn).click();
    }

    async businessUnitOptionsPresent(businessUnit: string): Promise<boolean> {
        const businessUnitDropDown = await $$(this.selectors.assignmentDropDownList).get(1);
        await businessUnitDropDown.$('button').click();
        await businessUnitDropDown.$('input').sendKeys(businessUnit);
        let count =await $$(this.selectors.selectOptions).count();
        if (count >= 1) { return true; } else { return false; }
    }

    async isValuePresentInDropdown(dropDownLabel: string, dropDownValue: string): Promise<boolean> {
        let elementDropdown:ElementFinder = await element(by.cssContainingText('.assignment-component-wrapper bwf-select-with-pagination button', `Select ${dropDownLabel}`));
        return await utilityCommon.isValuePresentInDropDown(elementDropdown, dropDownValue);
    }

    async isPersonAvailableOnAssignBlade(name: string): Promise<boolean> {
        await $(this.selectors.searchAsignee).click();
        await $(this.selectors.searchAsignee).clear();
        await $(this.selectors.searchAsignee).sendKeys(name + Key.ENTER);
        return await element(by.cssContainingText(this.selectors.assignee, name)).isPresent().then(async (result) => {
            if(result) return await element(by.cssContainingText(this.selectors.assignee, name)).isDisplayed();
            else return false;
        });
    }

    async selectNoneCompany(): Promise<void> {
        const companyDropDown = await $$(this.selectors.assignmentDropDownList).get(0);
        await companyDropDown.$('button').click();
        let option = await element(by.cssContainingText(this.selectors.selectOptions, 'None'));
        await option.click();
    }

    async isAssigneeDisplayed(name: string): Promise<boolean> {
        await $(this.selectors.searchAsignee).click();
        await $(this.selectors.searchAsignee).clear();
        await $(this.selectors.searchAsignee).sendKeys(name + Key.ENTER);
        return await element(by.cssContainingText(this.selectors.assignee, name)).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText(this.selectors.assignee, name)).isDisplayed();
            else return false;
        });
    }
}

export default new ChangeAssignmentBlade();