import { $, $$, by, element, Key, protractor, ProtractorExpectedConditions, browser } from "protractor";

class ChangeAssignmentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        changeAssignmentButton: '[rx-view-component-id="6041cce1-05bd-458d-b097-eb310507cae3"] button',
        assignButton: '.modal-footer .btn-primary',
        assignmentDropDownList: '.flex-wrap bwf-select-with-pagination,.flex-column bwf-select-with-pagination',
        selectOptions: '.dropdown-item span',
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
        addSupportGroupAccess: 'button.add-btn-center',
        isWriteAccessCheckbox: 'input.ac-assign-support-group-write-group + span',
        agentAccess: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] .bwf-access-manager .access-group .btn-title',
        agents: '.dropdown-item .popup-template',
        searchInput: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] .bwf-flexi-type-ahead input.rx-form-control',
        agentAddButton: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] .bwf-access-manager .add-btn-center-type-ahead',
        agentNameOrSupportGroupName: '.rx-case-access-name',
    }

    async isAssignToMeCheckBoxSelected(): Promise<boolean> {
        return await $(this.selectors.assignToMeCheckBox).isSelected();
    }

    async getCompanyDefaultValue(): Promise<string> {
        return await $$(this.selectors.filterDropdowns).get(0).getText();
    }

    async getSupportGroupDefaultValue(): Promise<string> {
        return await $$(this.selectors.filterDropdowns).get(3).getText();
    }

    async isSearchInputBoxPresent(): Promise<boolean> {
        return await $(this.selectors.searchAsignee).isDisplayed();
    }

    async isCompanyDrpDwnDisplayed(): Promise<boolean> {
        return await $$(this.selectors.filterDropdowns).get(0).isDisplayed();
    }

    async isBuisnessUnitDrpDwnDisplayed(): Promise<boolean> {
        return await $$(this.selectors.filterDropdowns).get(1).isDisplayed();
    }

    async isDepartmentDrpDwnDisplayed(): Promise<boolean> {
        return await $$(this.selectors.filterDropdowns).get(2).isDisplayed();
    }

    async isSupportGroupDrpDwnDisplayed(): Promise<boolean> {
        return await $$(this.selectors.filterDropdowns).get(3).isDisplayed();
    }

    async isAssigneeListPresent(): Promise<boolean> {
        return await $(this.selectors.assignee).isDisplayed();
    }

    async getAssigneeName(): Promise<string> {
        return await $(this.selectors.assignee).getText();
    }

    async clickOnAssignButton(): Promise<void> {
        await $(this.selectors.assignButton).click();
    }

    async getCountOfSupportGroup(): Promise<number> {
        return await $$(this.selectors.supportGroupName).count();
    }

    async clickOnSupportGroup(name: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.supportGroupName, name)).click();
    }

    async getTextOfSupportGroup(name: string): Promise<string> {
        return await element(by.cssContainingText(this.selectors.supportGroupName, name)).getText();
    }

    async isAssignButtonDisabled(): Promise<Boolean> {
        return await $(this.selectors.assignButton).getAttribute("disabled") == "true";
    }

    async clickOnAssignToMeCheckBox(): Promise<void> {
        await $(this.selectors.assignToMeCheckBox).click();
    }

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
        const supportGroupDropDown = await $$(this.selectors.assignmentDropDownList).get(3);
        await supportGroupDropDown.$('button').click();
        await supportGroupDropDown.$('input').sendKeys(supportGroup);
        let option = await element(by.cssContainingText(this.selectors.selectOptions, supportGroup));
        await option.click();
    }

    async selectAssignee(name: string): Promise<void> {
        await $(this.selectors.searchAsignee).click();
        await $(this.selectors.searchAsignee).sendKeys(name + Key.ENTER);
        await element(by.cssContainingText(this.selectors.assignee, name)).click();
    }

    async setAssignee(company: string, bu: string, group: string, assignee: string): Promise<void> {
        await this.selectCompany(company);
        await this.selectBusinessUnit(bu);
        await this.selectSupportGroup(group);
        await this.selectAssignee(assignee);
        await this.clickOnAssignButton();
    }

    async selectAssignToSupportGroup(): Promise<void> {
        await $('.d-icon-users_circle').isPresent().then(async (result) => {
            if (result) await element(by.cssContainingText(this.selectors.assignee, 'Assign to Support Group')).click();
        });
    }

    async selectCompanyKM(companyValue: string): Promise<void> {
        const companyDropDown = await $$(this.selectors.assignmentDropDownList).get(4);
        await companyDropDown.$('button').click();
        await companyDropDown.$('input').sendKeys(companyValue);
        let option = await element(by.cssContainingText(this.selectors.selectOptions, companyValue));
        await option.click();
    }

    async selectBusinessUnitKM(businessUnit: string): Promise<void> {
        const businessUnitDropDown = await $$(this.selectors.assignmentDropDownList).get(5);
        await businessUnitDropDown.$('button').click();
        await businessUnitDropDown.$('input').sendKeys(businessUnit);
        await element(by.cssContainingText(this.selectors.selectOptions, businessUnit)).click();
    }

    async selectSupportGroupKM(supportGroup: string): Promise<void> {
        const supportGroupDropDown = await $$(this.selectors.assignmentDropDownList).get(7);
        await supportGroupDropDown.$('button').click();
        await supportGroupDropDown.$('input').sendKeys(supportGroup);
        let option = await element(by.cssContainingText(this.selectors.selectOptions, supportGroup));
        await option.click();
    }

    async clickAddSupportGroupAccessButtonKM():Promise<void>{
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.addSupportGroupAccess)), 3000);
        await $$(this.selectors.addSupportGroupAccess).get(7).click();
    }

    async selectSupportGroupWriteAccessKM():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.isWriteAccessCheckbox)), 3000);
        await $(this.selectors.isWriteAccessCheckbox).click();
    }

    async clickOnSupportGroupAccessORAgentAccessButtonKM(agentName: string): Promise<void> {
        // await $(this.selectors.agentAccess).click();
        await element(by.cssContainingText(this.selectors.agentAccess, agentName)).click();
    }

    async selectAgentKM(agentName: string): Promise<void> {
        await $$(this.selectors.searchInput).first().clear();
        await $$(this.selectors.searchInput).first().sendKeys(agentName);
        await $$(this.selectors.agents).first().click();
        await $$(this.selectors.agentAddButton).first().click();
    }

    async isAgentNameOrSupportGroupNameDisplayedKM(agentNameOrSupportGroupName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.agentNameOrSupportGroupName, agentNameOrSupportGroupName)).isDisplayed();
    }
}

export default new ChangeAssignmentBlade();
