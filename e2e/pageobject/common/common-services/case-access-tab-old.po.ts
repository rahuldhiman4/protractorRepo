import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
class CaseOldAccessTab {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
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

}
export default new CaseOldAccessTab();