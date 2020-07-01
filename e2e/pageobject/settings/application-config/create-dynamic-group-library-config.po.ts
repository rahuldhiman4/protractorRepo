import { $,By, element, protractor, ProtractorExpectedConditions } from "protractor";

class CreateDynamicGroupLibrary {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        title: '.ac-link-add-new-field',
        addDynamicField: '[rx-view-component-id="a7cd73fd-b1e3-4598-9b6a-e25d860028b1"] a',
    }

    async verifyTitle(value: string): Promise<boolean> {
        return await element(By.cssContainingText(this.selectors.title, value)).isPresent();
    }

    async clickOnAddDynamicField(): Promise<void> {
        await $(this.selectors.addDynamicField).click();
    }

}

export default new CreateDynamicGroupLibrary();