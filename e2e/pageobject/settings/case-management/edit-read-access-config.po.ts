import { $, $$, browser, protractor, ProtractorExpectedConditions } from "protractor";

class ReadAccessConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        supportGroup: '[rx-view-component-id="59fae521-483b-4d6a-93ed-84c88919351a"] .d-textfield__label',
        editName: '[rx-view-component-id="5aa348b9-f853-4b0f-bbff-a23d2e153f6a"] input',
        defaultToggle: '[rx-view-component-id="fa6bad05-195e-4df6-a7f1-daf55b2e0571"] button',
        saveButton: '[rx-view-component-id="5ea49da6-8472-4848-a29e-917a0932ea24"] button'
    }

    async isAccessMappingNameDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.supportGroup)));
        return await $(this.selectors.editName).getAttribute("readonly") == "true";
    }

    async isDefaultToggleBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.supportGroup)));
        let readProperty1: string = await $$(this.selectors.defaultToggle).get(0).getAttribute("disabled");
        let readProperty2: string = await $$(this.selectors.defaultToggle).get(1).getAttribute("disabled");
        return (readProperty1 == "true" && readProperty2 == "true")
    }

    async isSaveBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

}

export default new ReadAccessConfigEditPage();