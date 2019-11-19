import {by, $, $$, ProtractorExpectedConditions, browser, protractor, element } from "protractor";

class ChangeAssignmentBlade{
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        changeAssignmentButton: '[rx-view-component-id="6041cce1-05bd-458d-b097-eb310507cae3"] button',
        assignButton: '.rx-assignment-modal-footer button.d-button_primary',
        assignmentDropDownList: '.rx-assignment_modal_filters .rx-assignment-select',
        selectOptions: '.options-box .options li',
        cancelButton: '.rx-assignment-modal-footer button.d-button_secondary',
        assignToMeCheckBox: '.rx-assignment_assignToMe span',
        searchAsignee: '.d-icon-search input',
        assignee: '.rx-assignment-person-fullName',
    }

    async clickOnAssignButton():Promise<void>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignButton)));
        await $(this.selectors.assignButton).click();
    }

    async clickOnAssignToMeCheckBox():Promise<void>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignToMeCheckBox)));
        await $(this.selectors.assignToMeCheckBox).click();
    }

    async selectCompany(companyValue:string): Promise<void> {
        const companyDropDown = $$(this.selectors.assignmentDropDownList).get(0);
        await browser.wait(this.EC.elementToBeClickable(companyDropDown.$('button')));
        await companyDropDown.$('button').click();
        await browser.wait(this.EC.visibilityOf(companyDropDown.$('input')));
        await companyDropDown.$('input').sendKeys(companyValue);
        await browser.wait(this.EC.or(async ()=>{
            let count = await companyDropDown.$$(this.selectors.selectOptions).count();
            return count >= 1;
        }));
        var option=element(by.cssContainingText(this.selectors.selectOptions, companyValue));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
    }

    async selectBusinessUnit(businessUnit:string): Promise<void> {
        const businessUnitDropDown = $$(this.selectors.assignmentDropDownList).get(1);
        await browser.wait(this.EC.elementToBeClickable(businessUnitDropDown.$('button')));
        await businessUnitDropDown.$('button').click();
        await browser.wait(this.EC.visibilityOf(businessUnitDropDown.$('input')));
        await businessUnitDropDown.$('input').sendKeys(businessUnit);
        await browser.wait(this.EC.or(async ()=>{
            let count = await businessUnitDropDown.$$(this.selectors.selectOptions).count();
            return count >= 1;
        }));
        var option=element(by.cssContainingText(this.selectors.selectOptions, businessUnit));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
    }

    async selectDepartment(department:string): Promise<void> {
        const departmentDropdown = $$(this.selectors.assignmentDropDownList).get(2);
        await browser.wait(this.EC.elementToBeClickable(departmentDropdown.$('button')));
        await departmentDropdown.$('button').click();
        await browser.wait(this.EC.visibilityOf(departmentDropdown.$('input')));
        await departmentDropdown.$('input').sendKeys(department);
        await browser.wait(this.EC.or(async ()=>{
            let count = await departmentDropdown.$$(this.selectors.selectOptions).count();
            return count >= 1;
        }));
        var option=element(by.cssContainingText(this.selectors.selectOptions, department));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
    }

    async selectSupportGroup(supportGroup:string): Promise<void> {
        const supportGroupDropDown = $$(this.selectors.assignmentDropDownList).get(3);
        await browser.wait(this.EC.elementToBeClickable(supportGroupDropDown.$('button')));
        await supportGroupDropDown.$('button').click();
        await browser.wait(this.EC.visibilityOf(supportGroupDropDown.$('input')));
        await supportGroupDropDown.$('input').sendKeys(supportGroup);
        await browser.wait(this.EC.or(async ()=>{
            let count = await supportGroupDropDown.$$(this.selectors.selectOptions).count();
            return count >= 1;
        }))
        var option=element(by.cssContainingText(this.selectors.selectOptions, supportGroup));
        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
    }

    async selectAssignee(name:string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchAsignee)));
        await $(this.selectors.searchAsignee).sendKeys(name);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        await browser.wait(this.EC.or(async ()=>{
            let count = await $$(this.selectors.assignee).count();
            return count >= 2;
        }))
        await element(by.cssContainingText(this.selectors.assignee, name)).click();
    }
}

export default new ChangeAssignmentBlade();
