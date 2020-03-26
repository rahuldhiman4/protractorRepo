import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class CaseAccessTab {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        agentAccess: '.row .d-icon-right-angle_down span',
        agents: '.dropdown-menu .uib-typeahead-match',
        searchInput: '.flex-container .d-textfield__label input',
        agentAddButton: '.ac-person-add',
        agentNameOrSupportGroupName: '.rx-case-access-name',
        company: '.flex-item .ac-company-field button',
        supportGroup: '.flex-item .ac-support-group-field button',
        dropdownList: '.options li',
        searchSupportGroup: '[placeholder="Search for Support Groups"]',
        searchOrganizationName: '[placeholder="Search Organizations"]',
    }

    async clickOnSupportGroupAccessORAgentAccessButton(agentName: string): Promise<void> {
        await $(this.selectors.agentAccess).click();
        await element(by.cssContainingText(this.selectors.agentAccess, agentName)).click();
    }

    async selectAndAddAgent(agentName: string): Promise<void> {
        await $$(this.selectors.searchInput).first().clear();
        await $$(this.selectors.searchInput).first().sendKeys(agentName);
        await $$(this.selectors.agents).first().click();
        await $$(this.selectors.agentAddButton).first().click();
    }

    async isAgentNameOrSupportGroupNameDisplayed(agentNameOrSupportGroupName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.agentNameOrSupportGroupName, agentNameOrSupportGroupName)).isDisplayed();
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

}
export default new CaseAccessTab();