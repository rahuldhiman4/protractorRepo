import { $, $$, by, element, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class EditKnowledgeAccess {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        knowledgeAccessSupportGroup: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] span.rx-case-access-name',
        knowledeAccessSupportGroupCrossIcon: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] span.rx-case-access-name ~ span.d-icon-cross',
        removeKnowledgeAccessOptionYes: 'button.ac-remove-group-yes',
        removeKnowledgeAccessOptionNo: 'button.ac-remove-group-no',
        agentAccess: '.row .d-icon-right-angle_down span',
        agents: '.dropdown-menu .uib-typeahead-match',
        searchInput: '.flex-container .d-textfield__label input',
        agentAddButton: '.ac-person-add',
        agentNameOrSupportGroupName: '.rx-case-access-name',
        company: '.flex-item .ac-company-field button',
        supportGroup: '.flex-item .ac-support-group-field button',
        businessUnit: '.flex-item .ac-business-unit-field button',
        dropdownList: '.options li',
        searchSupportGroup: '[placeholder="Search for Support Groups"]',
        searchBusinessUnit : '[placeholder="Search for Business Unit"]',
        searchOrganizationName: '[placeholder="Search Organizations"]',
        closeKnowledgeAccessBlade: '[rx-view-component-id="0d8d9c7d-7e85-4277-9452-64fbba8df10d"] button',
        isWriteAccessCheckbox: 'input.ac-assign-support-group-write-group + span',
        addSupportGroupAccess: 'button.ac-support-group-add'
    }

    async clickKnowledgeAccessYesOption(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.removeKnowledgeAccessOptionYes)), 2000);
        await $(this.selectors.removeKnowledgeAccessOptionYes).click();
    }

    async clickKnowledgeAccessNoOption(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.removeKnowledgeAccessOptionNo)), 2000);
        await $(this.selectors.removeKnowledgeAccessOptionNo).click();
    }

    async clickRemoveKnowledgeAccess(knowledgeAccessGroup: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeAccessSupportGroup)), 2000);
        await $(this.selectors.knowledgeAccessSupportGroup).click();
        let options = await $$(this.selectors.knowledgeAccessSupportGroup).count();
        for (let i = 0; i < options; i++) {
            let knowledgeAccess = await $$(this.selectors.knowledgeAccessSupportGroup).get(i).getText();
            if (knowledgeAccess.includes(knowledgeAccessGroup)) {
                await $$(this.selectors.knowledeAccessSupportGroupCrossIcon).get(i).click();
            }
        }
    }

    async clickOnSupportGroupAccessORAgentAccessButton(agentName: string): Promise<void> {
        // await $(this.selectors.agentAccess).click();
        await element(by.cssContainingText(this.selectors.agentAccess, agentName)).click();
    }

    async selectAgent(agentName: string): Promise<void> {
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
        // await browser.wait(this.EC.visibilityOf($(this.selectors.dropdownList)), 4000);
        let option = await element(by.cssContainingText(this.selectors.dropdownList, SupportValue));
        await option.click();
    }

    async selectBusinessUnit(bu: string): Promise<void> {
        await $(this.selectors.businessUnit).click();
        await $(this.selectors.searchBusinessUnit).sendKeys(bu);
        let option = await element(by.cssContainingText(this.selectors.dropdownList, bu));
        await option.click();
    }

    async clickCloseKnowledgeAccessBlade():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.closeKnowledgeAccessBlade)), 3000);
        await $(this.selectors.closeKnowledgeAccessBlade).click();
    }

    async clickAddSupportGroupAccessButton():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addSupportGroupAccess)), 3000);
        await $(this.selectors.addSupportGroupAccess).click();
    }

    async selectSupportGroupWriteAccess():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.isWriteAccessCheckbox)), 3000);
        await $(this.selectors.isWriteAccessCheckbox).click();
    }

}

export default new EditKnowledgeAccess();