import { $, $$, browser, protractor, ProtractorExpectedConditions } from "protractor";

class AssignmentConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editAssignmentMappingFields: '[rx-view-component-id="64a33e3d-2657-4b94-b357-ab0192d7f187"] .d-textfield__item',
        editName: '[rx-view-component-id="b268be04-346e-424c-be99-7ad16da78037"] input',
        defaultToggle: '[rx-view-component-id="7ca691fd-c299-411f-90fa-9639cbe083c1"] button',
        saveButton: '[rx-view-component-id="0661b9a6-3c08-455c-9972-a2b6f9ca2c0e"] button',
        assignee: '[rx-view-component-id="50f4da8f-6473-4356-994f-67ebe94b100e"] .ui-select-toggle'
    }

    async isEditAssignmentNameDisabled(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.assignee)));
        return await $(this.selectors.editName).getAttribute("readonly") == "true";
    }

    async isSaveBtnDisabled(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

    async isDefaultToggleBtnDisabled(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.assignee)));
        let readProperty1: string = await $$(this.selectors.defaultToggle).get(0).getAttribute("disabled");
        let readProperty2: string = await $$(this.selectors.defaultToggle).get(1).getAttribute("disabled");
        return (readProperty1 == "true" && readProperty2 == "true");
    }

    async areAllFieldsPresentOnUI(data: string[]): Promise<boolean> {
        let arr: string[] = [];
        let fieldsCount: number  = await $$(this.selectors.editAssignmentMappingFields).count();
        for (let i = 0; i < fieldsCount; i++) {
            var labelTxt: string = await $$(this.selectors.editAssignmentMappingFields).get(i).getText();
            arr[i] = labelTxt;
        }
        arr = arr.sort();
        arr = arr.filter(v=>v!='');
        data = data.sort();
        return arr.length === data.length && arr.every(
            (value, index) => (value === data[index])
        );
}

}

export default new AssignmentConfigEditPage();