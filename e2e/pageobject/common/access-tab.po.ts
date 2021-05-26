import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import { DropDownType } from "../../utils/constants";
import utilityCommon from '../../utils/utility.common';
class AccessTab {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        caseAccess: '.bwf-access-manager .access-group .btn-title',
        agents: '.dropdown-menu button',
        dropdownList: '.rx-select__option-content div',
        searchInputField: '[placeholder="Filter options"]',
        resetToDefault: 'button[aria-label="Reset to Default"]',
        confidentialSupportGroupGuid: '34ea58f1-269e-4235-870d-41ba90c46e4d',
        removeAccessOptionYes: '.alert-warning button[btn-type="primary"]',
        removeAccessOptionNo: '.alert-warning button[btn-type="secondary"]',
        closeKnowledgeAccessBlade: '[rx-view-component-id="0d8d9c7d-7e85-4277-9452-64fbba8df10d"] button',
        knowledgeAccess: '[rx-view-component-id="a99704e0-5441-4ddc-8357-bd4fc7d078d4"] .bwf-access-manager .access-group .btn-title',
        confidencialAccess: '[rx-view-component-id="b1606736-7480-4368-aac6-a8273f0ff0d5"] .bwf-access-manager .access-group .btn-title, [rx-view-component-id="34ea58f1-269e-4235-870d-41ba90c46e4d"] .bwf-access-manager .access-group .btn-title',
        entityDropDown: '.support-group-form button.dropdown-toggle',
        dropDownOption: '.dropdown_select__menu-content button',
        caseAccessGroup: '.bwf-access-manager .access-group',
        confidentialSupportGroup: '[aria-label="Support Group"]',
        dropdownElement: 'button.rx-select__option strong',
        supportGroupWarningText: '[rx-view-component-id="34ea58f1-269e-4235-870d-41ba90c46e4d"] .alert-content'
    }

    async clickToExpandAccessEntitiyByGroup(groupName: string) {
        let count = await $$(this.selectors.caseAccessGroup).count();
        for (let i = 0; i < count; i++) {
            let groupTitle = await $$(this.selectors.caseAccessGroup).get(i).$('.card-title').getText();
            if (groupTitle == groupName) {
                await $$(this.selectors.caseAccessGroup).get(i).$(this.selectors.caseAccess).click();
                break;
            }
        }
    }

    async clickToExpandAccessEntitiySearch(accessName: string, moduleName: string): Promise<void> {
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
            await utilityCommon.selectDropDown(await $('[rx-view-component-id="b1606736-7480-4368-aac6-a8273f0ff0d5"] button.dropdown-toggle,[rx-view-component-id="34ea58f1-269e-4235-870d-41ba90c46e4d"] button.dropdown-toggle'), entityValue, DropDownType.WebElement);
        }
        else {
            for (let i: number = 0; i < dropDownListCount; i++) {
                let dropDownName = await (await $$(dropDownListRows).get(i).$('.dropdown-toggle')).getText();
                if (dropDownName == dropDownList) {
                    await $$(dropDownListRows).get(i).$('.dropdown-toggle').click();
                    await $(this.selectors.searchInputField).sendKeys(entityValue);
                    let option = await element(by.cssContainingText(this.selectors.dropdownList, entityValue));
                    await option.click();
                }
            }
        }
    }

    async isAccessTypeOfEntityDisplayed(accessEntityName: string, accessType: string): Promise<boolean> {
        switch (accessType) {
            case "Read": {
                return await element(by.css(`span[aria-label="${accessEntityName}"] ~ span.d-icon-eye`)).isPresent().then(async (result) => {
                    if (result) return await element(by.css(`span[aria-label="${accessEntityName}"] ~ span.d-icon-eye`)).isDisplayed();
                    else return false;
                });
            }
            case "Write": {
                return await element(by.css(`span[aria-label="${accessEntityName}"] ~ span.d-icon-pencil`)).isPresent().then(async (result) => {
                    if (result) return await element(by.css(`span[aria-label="${accessEntityName}"] ~ span.d-icon-pencil`)).isDisplayed();
                    else return false;
                });
            }
            default: {
                console.log('Entity does not match');
                break;
            }
        }
    }

    async selectAgent(agentName: string, agentInput: string): Promise<void> {
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

    async isAgentPresent(agentName: string): Promise<boolean> {
        await $$('.person-field input').last().clear();
        await $$('.person-field input').last().sendKeys(agentName);
        return await $('.rx-typeahead-popup-content').isPresent().then(async (result) => {
            if (result) return await $('.rx-typeahead-popup-content').isDisplayed();
            else return false;
        })

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

    async clickAccessRemoveWarningBtn(btnName: string): Promise<void> {
        if (btnName == "Yes") await $(this.selectors.removeAccessOptionYes).click();
        else await $(this.selectors.removeAccessOptionNo).click();
    }

    async clickCloseKnowledgeAccessBlade(): Promise<void> {
        await $(this.selectors.closeKnowledgeAccessBlade).isPresent().then(async (result) => {
            if (result) {
                await $(this.selectors.closeKnowledgeAccessBlade).click();
            } else console.log('Knowledge access close button is missing');
        });
    }

    async isAccessEntityDisplayed(entityName: string, moduleName: string): Promise<boolean> {
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

    async clickRemoveAccess(accessGroupName: string, isKnowledgeAccess?: boolean): Promise<void> {
        let entityAccessName: string = 'span.badge-text';
        let accessCrossIcon: string = 'ux-access-manager div.bfw-badge >span.d-icon-cross';
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

    async isValuePresentInDropdown(dropDownList: string, entityValue: string): Promise<boolean> {
        let count: number;
        let dropDownListRows = 'ux-access-manager .support-group-form div.d-flex.flex-row';
        let dropDownListCount: number = await $$('ux-access-manager .support-group-form div.d-flex.flex-row').count();
        let dropDown;
        for (let i: number = 0; i < dropDownListCount; i++) {
            let dropDownName = await $$(dropDownListRows).get(i).$('.dropdown-toggle').getText();
            if (dropDownName == dropDownList) {
                dropDown = await $$(dropDownListRows).get(i).$('.dropdown-toggle');
                dropDown.click();
                await $(this.selectors.searchInputField).sendKeys(entityValue);
                count = await $$(this.selectors.dropDownOption).count();
                dropDown.click();
            }
        }
        if (count >= 1) { return true; } else { return false; }
    }

    async clickOnResetToDefault(): Promise<void> {
        await $(this.selectors.resetToDefault).click();
    }

    async isOptionsPresent(entityValue: string, dropDownList: string, isConfidential?: boolean): Promise<boolean> {
        let dropDownListRows = 'ux-access-manager .support-group-form div.d-flex.flex-row';
        let dropDownListCount: number = await $$('ux-access-manager .support-group-form div.d-flex.flex-row').count();
        if (isConfidential) {
            return await utilityCommon.isValuePresentInDropDown(this.selectors.confidentialSupportGroupGuid, entityValue);
        }
        else {
            for (let i: number = 0; i < dropDownListCount; i++) {
                let dropDownName = await $$(dropDownListRows).get(i).$('.dropdown-toggle').getText();
                if (dropDownName == dropDownList) {
                    await $$(dropDownListRows).get(i).$('.dropdown-toggle').click();
                    await $(this.selectors.searchInputField).sendKeys(entityValue);
                    let count = await $$(this.selectors.dropdownList).count();
                    if (count >= 1) { return true; } else { return false; }
                }
            }
        }
    }
    async isConfidentialSupportGroupDropDownPresent(drop: string): Promise<boolean> {
        await $(this.selectors.confidentialSupportGroup).click();
        return await element(by.cssContainingText(this.selectors.dropdownElement, drop)).isPresent().then(async (link) => {
            if (link) {
                let valuePresent = await element(by.cssContainingText(this.selectors.dropdownElement, drop)).isDisplayed();
                await $(this.selectors.confidentialSupportGroup).click();
                return valuePresent;
            } else {
                await $(this.selectors.confidentialSupportGroup).click();
                return false;
            }

        });
    }
    async isConfidentialSupportGroupAccessAbsent(): Promise<boolean> {
        return await $('[rx-view-component-id="34ea58f1-269e-4235-870d-41ba90c46e4d"] bwf-collapse[hidden]').isPresent().then(async (link) => {
            if (link) {
                return await $('[rx-view-component-id="34ea58f1-269e-4235-870d-41ba90c46e4d"] bwf-collapse[hidden]').isDisplayed();
            } else return false;
        });
    }
    async getSupportGroupWarningMessage(): Promise<string> {
        return await $(this.selectors.supportGroupWarningText).getText();
    }

}
export default new AccessTab();
