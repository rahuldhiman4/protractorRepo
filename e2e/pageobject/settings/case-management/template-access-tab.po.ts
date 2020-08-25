import { $, protractor, ProtractorExpectedConditions, $$, browser, element, by } from 'protractor';

class TemplateAccessTab {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        removeSupportWarningYes: '.ac-remove-group-yes',
        agentAccess: '.rx-case-access .rx-case-access-block .d-icon-right-angle_down',
        dropDownType: '.flex-item .dropdown-toggle',
        searchCompany: '[placeholder="Search Organizations"]',
        searchBuisnessUnit: '[placeholder="Search for Business Unit"]',
        searchSupportGroup: '[placeholder="Search for Support Groups"]',
        suppGrupList: '.bwf-selection-group.ac-support-group-field li',
        companyList: '.bwf-selection-group.ac-company-field li[role="button"]',
        buisnessUnitList: '.bwf-selection-group.ac-business-unit-field li',
        addBuisnessUnit: 'button.ac-business-unit-add',
        addSuppGrup: 'button.ac-support-group-add',
        addDepartment: 'ac-support-department-add',
        assignWriteAccess: '.d-checkbox__item.ac-message-assign-write-group',
    }

    async clickOnAccessButton(agentName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.agentAccess, agentName)).click();
    }
    
    async selectCompany(companyValue: string, dropDownList: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType, dropDownList)).click();
        await $(this.selectors.searchCompany).sendKeys(companyValue);
        await element(by.cssContainingText(this.selectors.companyList, companyValue)).click();
    }
    
    async selectSupportGroup(SupportValue: string, dropDownList: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType, dropDownList)).click();
        await $(this.selectors.searchSupportGroup).sendKeys(SupportValue);
        await element(by.cssContainingText("li[ng-repeat*='option']", SupportValue)).isPresent().then(async () => {
            await element(by.cssContainingText(".is-open li[ng-repeat*='option']", SupportValue)).click();
        });
    }
    
    async selectBusinessUnit(businessUnitValue: string, dropDownList: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType, dropDownList)).click();
        await $(this.selectors.searchBuisnessUnit).sendKeys(businessUnitValue);
        await element(by.cssContainingText("li[ng-repeat*='option']", businessUnitValue)).isPresent().then(async () => {
            await element(by.cssContainingText(".is-open li[ng-repeat*='option']", businessUnitValue)).click();
        });
    }
    
    async clickOnReadAccessAddButton(dropdownName: string): Promise<void> {
        switch (dropdownName) {
            case "Add Business Unit": {
                await $(this.selectors.addBuisnessUnit).click();
                break;
            }
            case "Add Support Department": {
                await $(this.selectors.addDepartment).click();
                break;
            }
            case "Add Support Group": {
                await $(this.selectors.addSuppGrup).click();
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
                await $$(this.selectors.assignWriteAccess).get(0).click();
                await $(this.selectors.addBuisnessUnit).click();
                break;
            }
            case "Add Support Department": {
                await $$(this.selectors.assignWriteAccess).get(1).click();
                await $(this.selectors.addDepartment).click();
                break;
            }
            case "Add Support Group": {
                await $$(this.selectors.assignWriteAccess).get(2).click();
                await $(this.selectors.addSuppGrup).click();
                break;
            }
            default: {
                console.log('Drop down values does not match');
                break;
            }
        }
    }
    
    async deleteTemplateAccess(accessName: string): Promise<void> {
        let crossIcon = await $$('.rx-case-access-name');
        for (let i: number = 0; i < crossIcon.length; i++) {
            let templateAccessName = await crossIcon[i].getText();
            if (templateAccessName == accessName) {
                await $$('[class="d-icon-cross"]').get(i).click();
            }
        }
        await $(this.selectors.removeSupportWarningYes).click();
    }
    
    async isSupportGroupWriteAccessDisplayed(supportGroupText: string): Promise<boolean> {
        let accessList = '.rx-case-access-group-list li';
        let accessCount: number = await $$('.rx-case-access-group-list li').count();
        for (let i: number = 0; i < accessCount; i++) {
            let accessName = await $$(accessList).get(i).$('.rx-case-access-name').getText();
            if (accessName == supportGroupText) {
                return await $$(accessList).get(i).$('[class*="d-icon-pencil"]');
            }
        }
    }

    async isSupportGroupReadAccessDisplayed(supportGroupText: string): Promise<boolean> {
        let accessList = '.rx-case-access-group-list li';
        let accessCount: number = await $$('.rx-case-access-group-list li').count();
        for (let i: number = 0; i < accessCount; i++) {
            let accessName = await $$(accessList).get(i).$('.rx-case-access-name').getText();
            if (accessName == supportGroupText) {
                return await $$(accessList).get(i).$('[class*="d-icon-eye"]');
            }
        }
    }
}

export default new TemplateAccessTab();