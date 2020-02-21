import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class CaseAccessTab {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        agentAccess: '.row .d-icon-right-angle_down span',
        agents: '.dropdown-menu .uib-typeahead-match',
        searchInput: '.flex-container .d-textfield__label input',
        agentAddButton: '.ac-person-add',
        agentNameOrSupportGroupName: '.rx-case-access-name',
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


}
export default new CaseAccessTab();