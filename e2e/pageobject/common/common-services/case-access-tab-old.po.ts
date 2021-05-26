import utilityCommon from "../../../utils/utility.common";
import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
class CaseOldAccessTab {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        confidentialSupportGroupGuid: 'b1606736-7480-4368-aac6-a8273f0ff0d5',
        dropdownList: '.rx-select__option-content div',
        searchInputField: '[placeholder="Filter options"]',
        supportGroupAccess :'[rx-view-component-id="1101ae47-297b-429f-ac0e-ac48d666899d"] button.btn-title',
        supportGroupSearchBox: '[rx-view-component-id="1101ae47-297b-429f-ac0e-ac48d666899d"] input[type="text"]',
        confidentialSupportGroupAccess: '[rx-view-component-id="34ea58f1-269e-4235-870d-41ba90c46e4d"] button.btn-title',
        confidentialSupportGroup: '[aria-label="Support Group"]',
        confidentialSupportGroupAssignToMe: '[rx-view-component-id="34ea58f1-269e-4235-870d-41ba90c46e4d"] input[type="checkbox"]',
        addConfidentialSupportGroup: '[rx-view-component-id="34ea58f1-269e-4235-870d-41ba90c46e4d"] .input-group-btn button',
        dropdownElement: '[rx-view-component-id="34ea58f1-269e-4235-870d-41ba90c46e4d"] strong',
        confidentialFieldSearchBox: '[rx-view-component-id="34ea58f1-269e-4235-870d-41ba90c46e4d"] input[type="text"]',
        deleteConfidentialsSupportGroup: '[rx-view-component-id="34ea58f1-269e-4235-870d-41ba90c46e4d"] .d-icon-cross',
        confidentialValueText: '[class="badge-content"] span.badge-text',
        removeSupportWarningYes: '[rx-view-component-id="34ea58f1-269e-4235-870d-41ba90c46e4d"] .inline-btn-wrapper button[btn-type="primary"]',
        supportGroupWarningText: '[rx-view-component-id="34ea58f1-269e-4235-870d-41ba90c46e4d"] .alert-content',
    }
    async isConfidentialSupportGroupValueTextDisplayed(SupportGroup: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.confidentialValueText, SupportGroup)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.confidentialValueText, SupportGroup)).isDisplayed();
            } else return false;
        });
    }

    async clickConfidentialSupportGroupAccess(): Promise<void> {
        await $(this.selectors.confidentialSupportGroupAccess).click();
    }
    async clickSupportGroupAccess(): Promise<void> {
        await $(this.selectors.supportGroupAccess).click();
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

    async clickDeleteConfidentialSupportGroup(): Promise<void> {
        await $(this.selectors.deleteConfidentialsSupportGroup).click();
        await $(this.selectors.removeSupportWarningYes).click();
    }

    async clickConfidentialWriteSupportGroupAccess(): Promise<void> {
        await $(this.selectors.confidentialSupportGroupAssignToMe).click();
    }

    async clickAddConfidentialSupportGroup(): Promise<void> {
        await $(this.selectors.addConfidentialSupportGroup).click();
    }

    async selectConfidentialSupportGroupDropDown(drop: string): Promise<void> {
        await $(this.selectors.confidentialFieldSearchBox).clear();
        await $(this.selectors.confidentialFieldSearchBox).sendKeys(drop);
        await element(by.cssContainingText(this.selectors.dropdownElement, drop)).click();

    }

    async isConfidentialSupportGroupDropDownPresent(drop: string): Promise<boolean> {
        await $(this.selectors.confidentialSupportGroup).click();
        return await element(by.cssContainingText(this.selectors.dropdownElement, drop)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.dropdownElement, drop)).isDisplayed();
            } else return false;
        });
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
                    let option = element(by.cssContainingText(this.selectors.dropdownList, entityValue));
                    option.click();
                }
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

}
export default new CaseOldAccessTab();