import { $, $$, browser, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";

class ChangeAssignmentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        changeAssignmentButton: '[rx-view-component-id="6041cce1-05bd-458d-b097-eb310507cae3"] button',
        assignButton: '.rx-assignment-modal-footer button.d-button_primary',
        assignmentDropDownList: '.rx-assignment_modal_filters .rx-assignment-select',
        selectOptions: '.options-box .options li',
        cancelButton: '.rx-assignment-modal-footer button.d-button_secondary',
        multipleSuppGrpMsg: '.manual-select-sg-msg',
        assignToMeCheckBox: '.rx-assignment_assignToMe span',
        searchAsignee: '.d-icon-search input',
        assignee: '.rx-assignment-person-fullName',
        company: 'selectedOrganizationId',
        businessUnit: 'selectedBusinessUnitId',
        department: 'selectedDepartmentId',
        supportGroup: 'selectedSupportGroupId',
    }

    async isAssignToMeCheckBoxSelected(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignToMeCheckBox)));
        return await $(this.selectors.assignToMeCheckBox).isSelected();
    }

    async getCompanyDefaultValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.company))));
        return await element(by.model(this.selectors.company)).getText();
    }

    async isAssignToMeCheckBoxPresent(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignToMeCheckBox)));
        return await $(this.selectors.assignToMeCheckBox).isDisplayed();
    }

    async isCompanyDrpDwnDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.company))));
        return await element(by.model(this.selectors.company)).isDisplayed();
    }

    async isBuisnessUnitDrpDwnDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.businessUnit))));
        return await element(by.model(this.selectors.businessUnit)).isDisplayed();
    }

    async isDepartmentDrpDwnDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.department))));
        return await element(by.model(this.selectors.department)).isDisplayed();
    }

    async isSupportGroupDrpDwnDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.supportGroup))));
        return await element(by.model(this.selectors.supportGroup)).isDisplayed();
    }

    async isAssigneeListPresent(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignee)));
        return await $(this.selectors.assignee).isDisplayed();
    }

    async clickOnAssignButton(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignButton)));
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignButton)));
        await $(this.selectors.assignButton).click();
        await browser.wait(this.EC.invisibilityOf($(this.selectors.assignToMeCheckBox)));
    }

    async isAssignButtonDisabled(): Promise<Boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignButton)));
        return await $(this.selectors.assignButton).getAttribute("disabled") == "true";
    }

    async clickOnAssignToMeCheckBox(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignToMeCheckBox)));
        await $(this.selectors.assignToMeCheckBox).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async verifyMultipleSupportGrpMessageDisplayed(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.multipleSuppGrpMsg)));
        expect(await $(this.selectors.multipleSuppGrpMsg).getText()).toBe('You belong to multiple support groups. Select a specific support group to continue.');
    }

    async selectCompany(companyValue: string): Promise<void> {
        const companyDropDown = await $$(this.selectors.assignmentDropDownList).get(0);
        await browser.wait(this.EC.elementToBeClickable(companyDropDown.$('button')));
        await companyDropDown.$('button').click();
        await browser.wait(this.EC.visibilityOf(companyDropDown.$('input')));
        await companyDropDown.$('input').sendKeys(companyValue);
        await browser.wait(this.EC.or(async () => {
            let count = await companyDropDown.$$(this.selectors.selectOptions).count();
            return count >= 1;
        }));
        var option = await element(by.cssContainingText(this.selectors.selectOptions, companyValue));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
    }

    async selectBusinessUnit(businessUnit: string): Promise<void> {
        const businessUnitDropDown = await $$(this.selectors.assignmentDropDownList).get(1);
        await browser.wait(this.EC.elementToBeClickable(businessUnitDropDown.$('button')));
        await businessUnitDropDown.$('button').click();
        await browser.wait(this.EC.visibilityOf(businessUnitDropDown.$('input')));
        await businessUnitDropDown.$('input').sendKeys(businessUnit);
        await browser.wait(this.EC.or(async () => {
            let count = await businessUnitDropDown.$$(this.selectors.selectOptions).count();
            return count >= 1;
        }));
        var option = await element(by.cssContainingText(this.selectors.selectOptions, businessUnit));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
    }

    async selectDepartment(department: string): Promise<void> {
        const departmentDropdown = await $$(this.selectors.assignmentDropDownList).get(2);
        await browser.wait(this.EC.elementToBeClickable(departmentDropdown.$('button')));
        await departmentDropdown.$('button').click();
        await browser.wait(this.EC.visibilityOf(departmentDropdown.$('input')));
        await departmentDropdown.$('input').sendKeys(department);
        await browser.wait(this.EC.or(async () => {
            let count = await departmentDropdown.$$(this.selectors.selectOptions).count();
            return count >= 1;
        }));
        var option = await element(by.cssContainingText(this.selectors.selectOptions, department));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
    }

    async selectSupportGroup(supportGroup: string): Promise<void> {
        const supportGroupDropDown = await $$(this.selectors.assignmentDropDownList).get(3);
        await browser.wait(this.EC.elementToBeClickable(supportGroupDropDown.$('button')));
        await supportGroupDropDown.$('button').click();
        await browser.wait(this.EC.visibilityOf(supportGroupDropDown.$('input')));
        await supportGroupDropDown.$('input').sendKeys(supportGroup);
        await browser.wait(this.EC.or(async () => {
            let count = await supportGroupDropDown.$$(this.selectors.selectOptions).count();
            return count >= 1;
        }))
        var option = await element(by.cssContainingText(this.selectors.selectOptions, supportGroup));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
    }

    async selectAssignee(name: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchAsignee)));
        await $(this.selectors.searchAsignee).sendKeys(name + Key.ENTER);
        await browser.wait(this.EC.or(async () => {
            let count = await $$(this.selectors.assignee).count();
            return count >= 2;
        }));
        var option = await element(by.cssContainingText(this.selectors.assignee, name));
        await browser.wait(this.EC.elementToBeClickable(option)).then(async function () {
            await option.click();
        });
    }

    async setAssignee(company: string, group: string, assignee: string): Promise<void> {
        await this.selectCompany(company);
        await this.selectSupportGroup(group);
        await this.selectAssignee(assignee);
        await this.clickOnAssignButton();
    }

    async setAssigneeGroup(group: string): Promise<void> {
        await this.selectSupportGroup(group);
        await browser.wait(this.EC.or(async () => {
            let count = await $$(this.selectors.assignee).count();
            return count >= 1;
        }))
        let name = "Assign to Support Group";
        var option = await element(by.cssContainingText(this.selectors.assignee, name));
        await browser.wait(this.EC.visibilityOf(option));
        await browser.wait(this.EC.elementToBeClickable(option));
        await element(by.cssContainingText(this.selectors.assignee, name)).click();
        await this.clickOnAssignButton();
    }
}

export default new ChangeAssignmentBlade();
