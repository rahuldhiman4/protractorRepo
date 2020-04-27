import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
class CaseAccessTab {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        agentAccess: '.bwf-access-manager .access-group .btn-title',
        agents: 'div.popup-info',
        searchInput: '.flex-row input.form-control',
        agentAddButton: '.agent-wrapper .input-group-btn .btn-secondary',
        dropDownType: '.flex-column .dropdown-toggle',
        supportGroup: '.flex-item .ac-support-group-field button',
        dropdownList: 'button[role="option"] span',
        searchSupportGroup: '[placeholder="Search for Support Groups"]',
        searchInputField: '[placeholder="Filter options"]',
        agentAssignWriteAccess: '.access-group-checkbox .checkbox__input',
        addButton:'.input-group-btn button',
    }
    
    async clickOnSupportGroupAccessORAgentAccessButton(agentName: string): Promise<void> {
        // await $(this.selectors.agentAccess).click();
        await element(by.cssContainingText(this.selectors.agentAccess, agentName)).click();
    }

    async selectAndAddAgent(agentName: string): Promise<void> {
        await $$(this.selectors.searchInput).first().clear();
        await $$(this.selectors.searchInput).first().sendKeys(agentName);
        await $$(this.selectors.agents).first().click();
        await $$(this.selectors.agentAddButton).click();
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

    async selectCompany(companyValue: string,dropDownList:string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType,dropDownList)).click();
        await $(this.selectors.searchInputField).sendKeys(companyValue);
        let option = await element(by.cssContainingText(this.selectors.dropdownList, companyValue));
        await option.click();
    }

    async selectSupportGroup(SupportValue: string,dropDownList:string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType,dropDownList)).click();
        await $(this.selectors.searchInputField).sendKeys(SupportValue);
        let option = await element(by.cssContainingText(this.selectors.dropdownList, SupportValue));
        await option.click();
    }
    
    async selectBusinessUnit(businessUnitValue: string,dropDownList:string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType,dropDownList)).click();
        await $(this.selectors.searchInputField).sendKeys(businessUnitValue);
        let option = await element(by.cssContainingText(this.selectors.dropdownList, businessUnitValue));
        await option.click();
    }

    async selectDepartment(DepartmentValue: string,dropDownList:string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType,dropDownList)).click();
        await $(this.selectors.searchInputField).sendKeys(DepartmentValue);
        let option = await element(by.cssContainingText(this.selectors.dropdownList, DepartmentValue));
        await option.click();
    }

    async clickOnReadAccessAddButton(dropdownName: string): Promise<void> {
        switch (dropdownName) {
            case "Add Business Unit": {
                await $$(this.selectors.addButton).get(0).click();
                break;
            }
            case "Add Support Department": {
                await $$(this.selectors.addButton).get(1).click();
                break;
            }
            case "Add Support Group": {
                await $$(this.selectors.addButton).get(2).click();
                break;
            }
            default: {
                console.log('Drop down values does not match');
                break;
            }
        }
    }

}
export default new CaseAccessTab();