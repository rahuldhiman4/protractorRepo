import { $, $$, by, element, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class KnowledgeAccessTab {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        knowledgeAccessSupportGroup: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] span.badge-text',
        knowledeAccessSupportGroupCrossIcon: 'ux-access-manager[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] div.bfw-badge >span.d-icon-cross',
        removeKnowledgeAccessOptionYes: '.alert-warning button[btn-type="primary"]',
        removeKnowledgeAccessOptionNo: '.alert-warning button[btn-type="secondary"]',
        closeKnowledgeAccessBlade: '[rx-view-component-id="0d8d9c7d-7e85-4277-9452-64fbba8df10d"] button',
        assignmentDropDownList: '.flex-column bwf-select-with-pagination',
        selectOptions: '.dropdown-item span',
        addSupportGroupAccess: 'button.add-btn-center',
        isWriteAccessCheckbox: 'input.checkbox__input',
        agentAccess: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] .bwf-access-manager .access-group .btn-title',
        agents: '.dropdown-item .popup-template',
        searchInput: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] .bwf-flexi-type-ahead input.rx-form-control',
        agentAddButton: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] .bwf-access-manager .add-btn-center-type-ahead',
        agentNameOrSupportGroupName: '.rx-case-access-name',
        assignWriteAccess: '.access-group-checkbox .checkbox__input',
    }

    async clickKnowledgeAccessYesOption(): Promise<void> {
        //await browser.wait(this.EC.elementToBeClickable($(this.selectors.removeKnowledgeAccessOptionYes)), 5000);
        await $(this.selectors.removeKnowledgeAccessOptionYes).click();
    }

    async clickKnowledgeAccessNoOption(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.removeKnowledgeAccessOptionNo)), 2000);
        await $(this.selectors.removeKnowledgeAccessOptionNo).click();
    }

    async clickRemoveKnowledgeAccess(knowledgeAccessGroup: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeAccessSupportGroup)), 2000);
        let options = await $$(this.selectors.knowledgeAccessSupportGroup).count();
        for (let i = 0; i < options; i++) {
            let knowledgeAccess = await $$(this.selectors.knowledgeAccessSupportGroup).get(i).getText();
            if (knowledgeAccess.includes(knowledgeAccessGroup)) {
                await $$(this.selectors.knowledeAccessSupportGroupCrossIcon).get(i).click();
            }
        }
    }

    async clickCloseKnowledgeAccessBlade(): Promise<void> {
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
        await element(by.cssContainingText(this.selectors.selectOptions, supportGroup)).click();
    }

    async selectDepartment(department: string): Promise<void> {
        const departmentDropdown = await $$(this.selectors.assignmentDropDownList).get(6);
        await departmentDropdown.$('button').click();
        await departmentDropdown.$('input').sendKeys(department);
        await element(by.cssContainingText(this.selectors.selectOptions, department)).click();
    }

    async clickAddSupportGroupAccessButton(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.addSupportGroupAccess)), 3000);
        await $$(this.selectors.addSupportGroupAccess).get(7).click();
    }

    async selectSupportGroupWriteAccess(): Promise<void> {
        //await browser.wait(this.EC.elementToBeClickable($(this.selectors.isWriteAccessCheckbox)), 3000);
        await $$(this.selectors.isWriteAccessCheckbox).last().click();
    }

    async clickOnAccessButton(agentName: string): Promise<void> {
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

    async isAccessBtnDisplayed(agentName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.agentAccess, agentName)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.agentAccess, agentName)).isDisplayed();
            else return false;
        });
    }

    async isSupportGroupWriteAccessDisplayed(supportGroupText: string): Promise<boolean> {
        return await element(by.css(`span[aria-label="${supportGroupText}"] ~ span.d-icon-pencil`)).isPresent().then(async (result) => {
            if (result) return await element(by.css(`span[aria-label="${supportGroupText}"] ~ span.d-icon-pencil`)).isDisplayed();
            else return false;
        });
    }

    async isSupportGroupReadAccessDisplayed(supportGroupText: string): Promise<boolean> {
        return await element(by.css(`span[aria-label="${supportGroupText}"] ~ span.d-icon-eye`)).isPresent().then(async (result) => {
            if (result) return await element(by.css(`span[aria-label="${supportGroupText}"] ~ span.d-icon-eye`)).isDisplayed();
            else return false;
        });
    }

    async isKnowledgeAccessEntityAdded(agentNameOrSupportGroupName: string): Promise<boolean> {
        return await $(`.bfw-badge .badge-text[aria-label="${agentNameOrSupportGroupName}"]`).isPresent().then(async (result) => {
            if (result) return await $(`.bfw-badge .badge-text[aria-label="${agentNameOrSupportGroupName}"]`).isDisplayed();
            else return false;
        });
    }

    async clickOnReadAccessAddButton(dropdownName: string): Promise<void> {
        switch (dropdownName) {
            case "Add Business Unit": {
                await $$(this.selectors.addSupportGroupAccess).get(5).click();                
                break;
            }
            case "Add Support Department": {
                await $$(this.selectors.addSupportGroupAccess).get(6).click();                
                break;
            }
            case "Add Support Group": {
                await $$(this.selectors.addSupportGroupAccess).get(7).click();                
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
                await $$(this.selectors.addSupportGroupAccess).get(5).click();
                break;
            }
            case "Add Support Department": {
                await $$(this.selectors.assignWriteAccess).get(2).click();
                await $$(this.selectors.addSupportGroupAccess).get(6).click();
                break;
            }
            case "Add Support Group": {
                await $$(this.selectors.assignWriteAccess).get(3).click();
                await $$(this.selectors.addSupportGroupAccess).get(7).click();
                break;
            }
            default: {
                console.log('Drop down values does not match');
                break;
            }
        }
    }
}

export default new KnowledgeAccessTab();