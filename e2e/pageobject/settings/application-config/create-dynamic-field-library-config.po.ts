import { $,$$, protractor, ProtractorExpectedConditions } from "protractor";

class CreateDynamicFieldLibrary {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        title: '[class="d-textfield__label d-textfield__item1"]',
        cancelButton: '[rx-view-component-id="39134e3e-3a8c-40cd-8a20-b4c90ca7fce9"] button',

    }

    async verifyTitle(value: string): Promise<boolean> {
        let dynamicFields: number = await $$(this.selectors.title).count();
        for (let i = 0; i < dynamicFields; i++) {
            let field = await (await $$(this.selectors.title).get(i).getText()).trim();
            if (value == field) {
                return true;
            }
        }
        return false;
    }

    async cancelButton(): Promise<void> {
        await $(this.selectors.title).click();
    }
}

export default new CreateDynamicFieldLibrary();