import { $, protractor, ProtractorExpectedConditions, $$, browser, element, by } from 'protractor';

class TemplateAccessTab {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        removeSupportWarningYes: '.ac-remove-group-yes',
        agentAccess: '[rx-view-component-id="30ed35ec-487c-4bc2-8e96-2b3565d77adc"] .access-group .btn-link',
        dropDownType: '[rx-view-component-id="30ed35ec-487c-4bc2-8e96-2b3565d77adc"] .rx-select__search-button-title',
        searchType: '[placeholder="Filter options"]',
        suppGrupList: '.bwf-selection-group.ac-support-group-field li',
        dropdownList: '.rx-select__option-content div',
        buisnessUnitList: '.bwf-selection-group.ac-business-unit-field li',
        addButton: '.support-group-form button[class*="add"]',
        assignWriteAccess: '.checkbox__input',
    }

    async clickOnAccessButton(agentName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.agentAccess, agentName)).click();
    }
    
    async selectCompany(companyValue: string, dropDownList: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType, dropDownList)).click();
        await $(this.selectors.searchType).sendKeys(companyValue);
        await element(by.cssContainingText(this.selectors.dropdownList, companyValue)).click();
    }
    
    async selectSupportGroup(SupportValue: string, dropDownList: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType, dropDownList)).click();
        await $(this.selectors.searchType).sendKeys(SupportValue);
        await element(by.cssContainingText(".rx-select__option-content", SupportValue)).isDisplayed().then(async (displayed) => {
            if (displayed) await element(by.cssContainingText(".rx-select__option-content", SupportValue)).click();
        });
    }
    
    async selectBusinessUnit(businessUnitValue: string, dropDownList: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dropDownType, dropDownList)).click();
        await $(this.selectors.searchType).sendKeys(businessUnitValue);
        await element(by.cssContainingText("li[ng-repeat*='option']", businessUnitValue)).isDisplayed().then(async (displayed) => {
            if (displayed) await element(by.cssContainingText(".is-open li[ng-repeat*='option']", businessUnitValue)).click();
        });
    }
    
    async clickOnReadAccessAddButton(dropdownName: string): Promise<void> {
        switch (dropdownName) {
            case "Add Business Unit": {
                await $(this.selectors.addButton).click();
                break;
            }
            case "Add Support Department": {
                await $(this.selectors.addButton).click();
                break;
            }
            case "Add Support Group": {
                await $$(this.selectors.addButton).get(1).click();
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
                await $(this.selectors.addButton).click();
                break;
            }
            case "Add Support Department": {
                await $$(this.selectors.assignWriteAccess).get(1).click();
                await $(this.selectors.addButton).click();
                break;
            }
            case "Add Support Group": {
                await $$(this.selectors.assignWriteAccess).get(2).click();
                await $(this.selectors.addButton).click();
                break;
            }
            default: {
                console.log('Drop down values does not match');
                break;
            }
        }
    }
    
    async deleteTemplateAccess(accessName: string): Promise<void> {
        let crossIcon = await $$('.access-group-list .badge-text');
        for (let i: number = 0; i < crossIcon.length; i++) {
            let templateAccessName = await crossIcon[i].getText();
            if (templateAccessName == accessName) {
                await $$('[class="d-icon-cross"]').get(i).click();
            }
        }
        await $(this.selectors.removeSupportWarningYes).click();
    }
    
    async isSupportGroupWriteAccessDisplayed(supportGroupText: string): Promise<boolean> {
        let accessParent = await $$('.badge-content');
        let status = false;
        for(let i=0; i<accessParent.length; i++) {
            if(await accessParent[i].$('.badge-text').getText() == supportGroupText) {
                status = await accessParent[i].$('.d-icon-pencil').isPresent();
                break;
            }
        }
        return status;
    }

    async isSupportGroupReadAccessDisplayed(supportGroupText: string): Promise<boolean> {
        let accessParent = await $$('.badge-content');
        let status = false;
        for(let i=0; i<accessParent.length; i++) {
            if(await accessParent[i].$('.badge-text').getText() == supportGroupText) {
                status = await accessParent[i].$('.d-icon-eye').isPresent();
                break;
            }
        }
        return status;
    }
}

export default new TemplateAccessTab();