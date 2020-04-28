import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
class CaseAccessTab {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        agentAccess: '.bwf-access-manager .access-group .btn-title',
        agents: '.dropdown-menu button',
        searchInput: '.flex-row input.form-control',
        agentAddButton: '.input-group-btn .btn-secondary',
        company: '.flex-item .ac-company-field button',
        supportGroup: '.flex-item .ac-support-group-field button',
        dropdownList: '.options li',
        searchSupportGroup: '[placeholder="Search for Support Groups"]',
        searchOrganizationName: '[placeholder="Search Organizations"]',
        searchBusinessUnit: '[placeholder="Search for Business Unit"]',
        searchDepartment: '[placeholder="Search for Departments"]',
        businessUnit: '.flex-item .ac-business-unit-field button',
        department: '.flex-item .ac-support-department-field button',
        agentAssignWriteAccess: '.access-group-checkbox .checkbox__input',
    }
    
    async clickOnSupportGroupAccessORAgentAccessButton(agentName: string): Promise<void> {
        // await $(this.selectors.agentAccess).click();
        await element(by.cssContainingText(this.selectors.agentAccess, agentName)).click();
    }

    async selectAndAddAgent(agentName: string): Promise<void> {
        await $$(this.selectors.searchInput).first().clear();
        await $$(this.selectors.searchInput).first().sendKeys(agentName);
        await $$(this.selectors.agents).first().click();
        await $$(this.selectors.agentAddButton).get(3).click();
    }

    async selectAgentWithWriteAccess(agentName: string): Promise<void> {
        await $$(this.selectors.searchInput).first().clear();
        await $$(this.selectors.searchInput).first().sendKeys(agentName);
        await $$(this.selectors.agents).first().click();
        await $$(this.selectors.agentAssignWriteAccess).get(1).click();
        await $$(this.selectors.agentAddButton).get(3).click();
    }

    async isAgentNameOrSupportGroupNameDisplayed(agentNameOrSupportGroupName: string): Promise<boolean> {
        // return await element(by.cssContainingText(this.selectors.agentNameOrSupportGroupName, agentNameOrSupportGroupName)).isDisplayed();
        return await $(`.bfw-badge .mr-2[aria-label="${agentNameOrSupportGroupName}"]`).isDisplayed();
        
    }

    async selectCompany(companyValue: string): Promise<void> {
        await $(this.selectors.company).click();
        await $(this.selectors.searchOrganizationName).sendKeys(companyValue);
        let option = await element(by.cssContainingText(this.selectors.dropdownList, companyValue));
        await option.click();
    }

    async selectSupportGroup(SupportValue: string): Promise<void> {
        await $(this.selectors.supportGroup).click();
        await $(this.selectors.searchSupportGroup).sendKeys(SupportValue);
        let option = await element(by.cssContainingText(this.selectors.dropdownList, SupportValue));
        await option.click();
    }
    
    async selectBusinessUnit(businessUnitValue: string): Promise<void> {
        await $(this.selectors.businessUnit).click();
        await $(this.selectors.searchBusinessUnit).sendKeys(businessUnitValue);
        let option = await element(by.cssContainingText(this.selectors.dropdownList, businessUnitValue));
        await option.click();
    }

    async selectDepartment(DepartmentValue: string): Promise<void> {
        await $(this.selectors.department).click();
        await $(this.selectors.searchDepartment).sendKeys(DepartmentValue);
        let option = await element(by.cssContainingText(this.selectors.dropdownList, DepartmentValue));
        await option.click();
    }

}
export default new CaseAccessTab();