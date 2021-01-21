import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
class CaseOldAccessTab {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        confidentialSupportGroupAccess: '.ac-label-manage-support',
        confidentialSupportGroup: '.ac-confidential-group-field [id="btn-select"]',
        confidentialSupportGroupAssignToMe: '[class="d-checkbox__item ac-label-assign-confidential-write"]',
        addConfidentialSupportGroup: '[ng-if="enableAddSupportGroup"]',
        dropdownElement: '.ac-confidential-group-field .options li',
        confidentialFieldSearchBox: '.field input[placeholder="Search for Support Groups"]',
        deleteConfidentialsSupportGroup: '[class="rx-case-access-group-list ac-access-group-list"] .d-icon-cross',
        confidentialValueText: '.rx-case-access-name',
        removeSupportWarningYes: '.ac-remove-group-yes',
        supportGroupWarningText: '[class="rx-case-access-remove ac-group-not-unique"] .rx-case-access-remove-text',
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

    async isConfidentialSupportGroupAccess(): Promise<boolean> {
        return await $(this.selectors.confidentialSupportGroupAccess).isPresent().then(async (link) => {
            if (link) {
                return await $(this.selectors.confidentialSupportGroupAccess).isDisplayed();
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
        await $$(this.selectors.confidentialSupportGroupAssignToMe).get(1).click();
    }

    async clickAddConfidentialSupportGroup(): Promise<void> {
        await $$(this.selectors.addConfidentialSupportGroup).get(1).click();
    }

    async selectConfidentialSupportGroupDropDown(drop: string): Promise<void> {
        await $$(this.selectors.confidentialFieldSearchBox).get(1).sendKeys(drop);
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

}
export default new CaseOldAccessTab();