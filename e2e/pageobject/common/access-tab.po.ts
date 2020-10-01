import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser, ElementFinder } from "protractor";
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
class AccessTab {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        caseAccess: '.bwf-access-manager .access-group .btn-title',
        agents: '.dropdown-menu button',
        dropdownList: 'button[role="option"] span',
        searchInputField: '[placeholder="Filter options"]',
        resetToDefault: 'button[aria-label="Reset to Default"]',
        confidentialSupportGroupGuid: 'b1606736-7480-4368-aac6-a8273f0ff0d5',
        removeAccessOptionYes: '.alert-warning button[btn-type="primary"]',
        removeAccessOptionNo: '.alert-warning button[btn-type="secondary"]',
        closeKnowledgeAccessBlade: '[rx-view-component-id="0d8d9c7d-7e85-4277-9452-64fbba8df10d"] button',
        knowledgeAccess: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] .bwf-access-manager .access-group .btn-title',
        confidencialAccess: '[rx-view-component-id="b1606736-7480-4368-aac6-a8273f0ff0d5"] .bwf-access-manager .access-group .btn-title',
    }

    async clickToExpandAccessEntitiySearch(accessName: string, moduleName:string): Promise<void> {
        switch (moduleName) {
            case "Confidential Group": {
                await element(by.cssContainingText(this.selectors.confidencialAccess, accessName)).click();                
                break;
            }
            case "Case": {
                await element(by.cssContainingText(this.selectors.caseAccess, accessName)).click();
                break;
            }
            case "Knowledge": {
                await element(by.cssContainingText(this.selectors.knowledgeAccess, accessName)).click();
                break;
            }
            default: {
                console.log('Access Name does not match');
                break;
            }
        }
    }

    async selectAccessEntityDropDown(entityValue: string, dropDownList: string, isConfidential?: boolean): Promise<void> {
        let dropDownListRows = 'ux-access-manager .support-group-form div.d-flex.flex-row';
        let dropDownListCount: number = await $$('ux-access-manager .support-group-form div.d-flex.flex-row').count();
        if (isConfidential) {
            await utilityCommon.selectDropDown(this.selectors.confidentialSupportGroupGuid, entityValue);
        }
        else {
            for (let i: number = 0; i < dropDownListCount; i++) {
                let dropDownName = await $$(dropDownListRows).get(i).$('.dropdown-toggle').getText();
                if (dropDownName == dropDownList) {
                    await $$(dropDownListRows).get(i).$('.dropdown-toggle').click();
                    await $(this.selectors.searchInputField).sendKeys(entityValue);
                    let option = await element(by.cssContainingText(this.selectors.dropdownList, entityValue));
                    await option.click();
                }
            }
        }
    }

    async isAccessTypeOfEntityDisplayed(accessEntityName:string, accessType: string): Promise<boolean> {
        switch (accessType) {
            case "Read": {
                return await element(by.css(`span[aria-label="${accessEntityName}"] ~ span.d-icon-eye`)).isPresent().then(async (result) => {
                    if (result) return await element(by.css(`span[aria-label="${accessEntityName}"] ~ span.d-icon-eye`)).isDisplayed();
                    else return false;
                });
                break;
            }
            case "Write": {
                return await element(by.css(`span[aria-label="${accessEntityName}"] ~ span.d-icon-pencil`)).isPresent().then(async (result) => {
                    if (result) return await element(by.css(`span[aria-label="${accessEntityName}"] ~ span.d-icon-pencil`)).isDisplayed();
                    else return false;
                });
                break;
            }
            default: {
                console.log('Entity does not match');
                break;
            }
        }
    }

    async selectAgent(agentName: string,agentInput:string): Promise<void> {
        let agentList = '.bwf-flexi-type-ahead';
        let agentCount: number = await $$('.bwf-flexi-type-ahead').count();
        for (let i: number = 0; i < agentCount; i++) {
            let accessName = await $$(agentList).get(i).$('.form-control-label').getText();
            if (accessName == agentInput) {
                await $$(agentList).get(i).$('input.form-control').clear();
                await $$(agentList).get(i).$('input.form-control').sendKeys(agentName);
                await $$(this.selectors.agents).first().click();
            }
        }
    }

    async clickAccessEntitiyAddButton(dropdownName: string): Promise<void> {
        let accessList = 'ux-access-manager .access-group div.d-flex.flex-row';
        let accessCount: number = await $$('ux-access-manager .access-group div.d-flex.flex-row').count();
        for (let i: number = 0; i < accessCount; i++) {
            let accessName = await $$(accessList).get(i).$('.form-control-label').getText();
            if (accessName == dropdownName) {
                return await $$(accessList).get(i).$('.input-group-btn button').click();
            }
        }
    }

    async clickAssignWriteAccessCheckbox(dropdownName: string): Promise<void> {
        let accessList = 'ux-access-manager .access-group div.d-flex.flex-row';
        let accessCount: number = await $$('ux-access-manager .access-group div.d-flex.flex-row').count();
        for (let i: number = 0; i < accessCount; i++) {
            let accessName = await $$(accessList).get(i).$('.form-control-label').getText();
            if (accessName == dropdownName) {
                return await $$(accessList).get(i).$('input.checkbox__input').click();
            }
        }
    }

    async clickAccessRemoveWarningBtn(btnName:string): Promise<void> {
        if(btnName == "Yes") await $(this.selectors.removeAccessOptionYes).click();
        else await $(this.selectors.removeAccessOptionNo).click();
    }

    async clickCloseKnowledgeAccessBlade(): Promise<void> {
        await $(this.selectors.closeKnowledgeAccessBlade).click();
    }

    async isAccessEntityDisplayed(entityName: string,moduleName:string): Promise<boolean> {
        switch (moduleName) {
            case "Confidential Group": {
                return await element(by.cssContainingText(this.selectors.confidencialAccess, entityName)).isPresent().then(async (result) => {
                    if (result) return await element(by.cssContainingText(this.selectors.confidencialAccess, entityName)).isDisplayed();
                    else return false;
                });                
                break;
            }
            case "Case": {
                return await element(by.cssContainingText(this.selectors.caseAccess, entityName)).isPresent().then(async (result) => {
                    if (result) return await element(by.cssContainingText(this.selectors.caseAccess, entityName)).isDisplayed();
                    else return false;
                });                
                break;
            }
            case "Knowledge": {
                return await element(by.cssContainingText(this.selectors.knowledgeAccess, entityName)).isPresent().then(async (result) => {
                    if (result) return await element(by.cssContainingText(this.selectors.knowledgeAccess, entityName)).isDisplayed();
                    else return false;
                });                
                break;
            }
            default: {
                console.log('Access Name does not match');
                break;
            }
        }
    }

    async clickRemoveAccess(accessGroupName: string,isKnowledgeAccess?: boolean): Promise<void> {
        let entityAccessName:string = 'span.badge-text';
        let accessCrossIcon:string = 'ux-access-manager div.bfw-badge >span.d-icon-cross';
        if (isKnowledgeAccess) {
            entityAccessName = '[rx-view-component-id= "a99704e0-5441-4ddc-8357-bd4fc7d078d4"] span.badge-text';
            accessCrossIcon = 'ux-access-manager[rx-view-component-id= "a99704e0-5441-4ddc-8357-bd4fc7d078d4"] div.bfw-badge >span.d-icon-cross';
        }
        let options = await $$(entityAccessName).count();
        for (let i = 0; i < options; i++) {
            let accessName = await $$(entityAccessName).get(i).getText();
            if (accessName.includes(accessGroupName)) {
                await $$(accessCrossIcon).get(i).click();
            }
        }
    }

    async clickOnResetToDefault(): Promise<void> {
        await $(this.selectors.resetToDefault).click();
    }
}
export default new AccessTab();