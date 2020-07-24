import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
class CaseAccessTab {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        agentAccess: '.bwf-access-manager .access-group .btn-title',
        agents: '.dropdown-menu button',
        searchInput: '.flex-row input.form-control',
        agentAddButton: '.agent-wrapper .input-group-btn .btn-secondary',
        dropDownType: '.flex-column .dropdown-toggle',
        supportGroup: '.flex-item .ac-support-group-field button',
        dropdownList: 'button[role="option"] span',
        searchSupportGroup: '[placeholder="Search for Support Groups"]',
        searchInputField: '[placeholder="Filter options"]',
        assignWriteAccess: '.access-group-checkbox .checkbox__input',
        addButton: '.input-group-btn button',
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
        await $(this.selectors.assignWriteAccess).click();
        await $$(this.selectors.agentAddButton).click();
    }

    async selectSupportGroupWriteAccess(): Promise<void> {
        await $$(this.selectors.assignWriteAccess).get(2).click();
    }

    async isCaseAccessEntityAdded(agentNameOrSupportGroupName: string): Promise<boolean> {
        return await $(`.bfw-badge .badge-text[aria-label="${agentNameOrSupportGroupName}"]`).isPresent().then(async (result) => {
            if (result) return await $(`.bfw-badge .badge-text[aria-label="${agentNameOrSupportGroupName}"]`).isDisplayed();
            else return false;
        });
    }

    async selectCompany(companyValue: string, dropDownList: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType, dropDownList)).click();
        await $(this.selectors.searchInputField).sendKeys(companyValue);
        let option = await element(by.cssContainingText(this.selectors.dropdownList, companyValue));
        await option.click();
    }

    async selectSupportGroup(SupportValue: string, dropDownList: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType, dropDownList)).click();
        await $(this.selectors.searchInputField).sendKeys(SupportValue);
        let option = await element(by.cssContainingText(this.selectors.dropdownList, SupportValue));
        await option.click();
    }

    async selectBusinessUnit(businessUnitValue: string, dropDownList: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType, dropDownList)).click();
        await $(this.selectors.searchInputField).sendKeys(businessUnitValue);
        let option = await element(by.cssContainingText(this.selectors.dropdownList, businessUnitValue));
        await option.click();
    }

    async selectDepartment(DepartmentValue: string, dropDownList: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType, dropDownList)).click();
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

    async clickOnWriteAccessAddButton(dropdownName: string): Promise<void> {
        switch (dropdownName) {
            case "Add Business Unit": {
                await $$(this.selectors.assignWriteAccess).get(1).click();
                await $$(this.selectors.addButton).get(0).click();
                break;
            }
            case "Add Support Department": {
                await $$(this.selectors.assignWriteAccess).get(2).click();
                await $$(this.selectors.addButton).get(1).click();
                break;
            }
            case "Add Support Group": {
                await $$(this.selectors.assignWriteAccess).get(3).click();
                await $$(this.selectors.addButton).get(2).click();
                break;
            }
            default: {
                console.log('Drop down values does not match');
                break;
            }
        }
    }

    async isSupportGroupWriteAccessDisplayed(supportGroupText: string): Promise<boolean> {
        return await element(by.xpath(`//*[@aria-label="${supportGroupText}"]//../span[contains(@class,'d-icon-pencil')]`)).isPresent().then(async (result) => {
            if (result) return await element(by.xpath(`//*[@aria-label="${supportGroupText}"]//../span[contains(@class,'d-icon-pencil')]`)).isDisplayed();
            else return false;
        });
    }

    async isSupportGroupReadAccessDisplayed(supportGroupText: string): Promise<boolean> {
        return await element(by.xpath(`//*[@aria-label="${supportGroupText}"]//../span[contains(@class,'d-icon-eye')]`)).isPresent().then(async (result) => {
            if (result) return await element(by.xpath(`//*[@aria-label="${supportGroupText}"]//../span[contains(@class,'d-icon-eye')]`)).isDisplayed();
            else return false;
        });
    }

    async deleteAccess(accessValue: string): Promise<void> {
        await element(by.css('span.badge-content')).click();
        await element(by.css(`span[aria-label="Remove,${accessValue}"]`)).click();
        await $('.alert-warning button.btn-primary').click();
    }
}
export default new CaseAccessTab();