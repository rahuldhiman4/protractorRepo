import { $, $$, by, element, browser, protractor, ProtractorExpectedConditions } from "protractor";

class KnowledgeAccessTab {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        knowledgeAccessSupportGroup: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] span.rx-case-access-name',
        knowledeAccessSupportGroupCrossIcon: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] span.rx-case-access-name ~ span.d-icon-cross',
        removeKnowledgeAccessOptionYes: 'button.ac-remove-group-yes',
        removeKnowledgeAccessOptionNo: 'button.ac-remove-group-no',
        closeKnowledgeAccessBlade: '[rx-view-component-id="0d8d9c7d-7e85-4277-9452-64fbba8df10d"] button',
        assignmentDropDownList: '.flex-column bwf-select-with-pagination',
        selectOptions: '.dropdown-item span',
        addSupportGroupAccess: 'button.add-btn-center',
        isWriteAccessCheckbox: 'input.ac-assign-support-group-write-group + span',
        agentAccess: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] .bwf-access-manager .access-group .btn-title',
        agents: '.dropdown-item .popup-template',
        searchInput: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] .bwf-flexi-type-ahead input.rx-form-control',
        agentAddButton: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] .bwf-access-manager .add-btn-center-type-ahead',
        agentNameOrSupportGroupName: '.rx-case-access-name',
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
   
    async clickCloseKnowledgeAccessBlade():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.closeKnowledgeAccessBlade)), 3000);
        await $(this.selectors.closeKnowledgeAccessBlade).click();
    }

    async selectCompany(companyValue: string): Promise<void> {
        const companyDropDown = await $$(this.selectors.assignmentDropDownList).get(4);
        await companyDropDown.$('button').click();
        await companyDropDown.$('input').sendKeys(companyValue);
        let option = await element(by.cssContainingText(this.selectors.selectOptions, companyValue));
        await option.click();
    }

    async selectBusinessUnit(businessUnit: string): Promise<void> {
        const businessUnitDropDown = await $$(this.selectors.assignmentDropDownList).get(5);
        await businessUnitDropDown.$('button').click();
        await businessUnitDropDown.$('input').sendKeys(businessUnit);
        await element(by.cssContainingText(this.selectors.selectOptions, businessUnit)).click();
    }

    async selectSupportGroup(supportGroup: string): Promise<void> {
        const supportGroupDropDown = await $$(this.selectors.assignmentDropDownList).get(7);
        await supportGroupDropDown.$('button').click();
        await supportGroupDropDown.$('input').sendKeys(supportGroup);
        let option = await element(by.cssContainingText(this.selectors.selectOptions, supportGroup));
        await option.click();
    }

    async clickAddSupportGroupAccessButton():Promise<void>{
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.addSupportGroupAccess)), 3000);
        await $$(this.selectors.addSupportGroupAccess).get(7).click();
    }

    async selectSupportGroupWriteAccess():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.isWriteAccessCheckbox)), 3000);
        await $(this.selectors.isWriteAccessCheckbox).click();
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
}

export default new KnowledgeAccessTab();