import { By, element, protractor, ProtractorExpectedConditions } from "protractor";

class CreateDynamicGroupLibrary {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        title: '[rx-view-definition-guid="0cd67b2e-7c63-4f35-815b-0f00e8b2d934"] .d-textfield__label',
        addDynamicField: '[rx-view-component-id="a7cd73fd-b1e3-4598-9b6a-e25d860028b1"] a',
    }

    async verifyTitle(value: string): Promise<boolean> {
        return await element(By.cssContainingText(this.selectors.title, value)).isDisplayed();
    }

    async clickOnAddDynamicField(): Promise<void> {
        await element(this.selectors.title).click();
    }

}

export default new CreateDynamicGroupLibrary();