import { $, $$, browser, protractor, ProtractorExpectedConditions, element, by } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class AssignmentConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editAssignmentMappingFields: '[rx-view-component-id="64a33e3d-2657-4b94-b357-ab0192d7f187"] .form-control-label span',
        editName: '[rx-view-component-id="b268be04-346e-424c-be99-7ad16da78037"] input',
        defaultToggle: '[rx-view-component-id="7ca691fd-c299-411f-90fa-9639cbe083c1"] button',
        saveButton: '[rx-view-component-id="0661b9a6-3c08-455c-9972-a2b6f9ca2c0e"] button',
        assignee: '[rx-view-component-id="6ea0773a-64a8-47c7-ae17-a265d2ee72f8"] .dropdown-toggle',
        companyDrpDwn: '7caa75fa-dfd6-4eca-8dec-2ef096eb6722',
        assigneeGuid: '6ea0773a-64a8-47c7-ae17-a265d2ee72f8',
        defaultToggleGuid: '7ca691fd-c299-411f-90fa-9639cbe083c1',
        cancelButton: '[rx-view-component-id="83133eec-6274-4b89-bdff-b5880658ef4b"] button',
        categoryTier2Guid: '9df40e9c-d285-4dfd-9fb3-a7500fa996b0',
        categoryTier3Guid: '97db4cf9-62d6-4237-918c-04dff857eb9e',
        categoryTier4Guid: 'ac87041f-3b96-497a-b314-d540908378df',
        labelValue: '[rx-view-component-id="42098f05-304f-4c07-b5c1-4d12e1f9c717"] .dropdown-toggle',
        labelGuid: '42098f05-304f-4c07-b5c1-4d12e1f9c717',
        lobValue: '[rx-view-component-id="c18c4e95-a388-44a5-91d2-249888ea7d40"] .rx-select__search-button-title'
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

    async setCompany(company: string) {
        await utilityCommon.selectDropDown(this.selectors.companyDrpDwn, company);
    }

    async clickonSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async areAllFieldsPresentOnUI(data: string[]): Promise<boolean> {
        let arr: string[] = [];
        let fieldsCount: number = await $$(this.selectors.editAssignmentMappingFields).count();
        for (let i = 0; i < fieldsCount; i++) {
            let labelTxt: string = await $$(this.selectors.editAssignmentMappingFields).get(i).getText();
            if(labelTxt != '(required)') {
                arr[i] = labelTxt;
            }
        }
        arr = arr.sort();
        arr = arr.filter(v => v != '');
        data = data.sort();
        return arr.length === data.length && arr.every(
            (value, index) => (value === data[index])
        );
    }

    async setAssignmentMappingName(templateName: string): Promise<void> {
        await $(this.selectors.editName).clear();
        await $(this.selectors.editName).sendKeys(templateName);
    }

    async setAssignee(assignee: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.assigneeGuid, assignee);
    }

    async setDefaultToggleButton(value: boolean): Promise<void> {
        await utilityCommon.selectToggleButton(this.selectors.defaultToggleGuid, value);
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async setCategoryTier2(categoryTier2: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier2Guid, categoryTier2);
    }

    async setCategoryTier3(categoryTier3: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier3Guid, categoryTier3);
    }

    async setLabel(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.labelGuid, value);
    }

    async getCategoryTier4(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.categoryTier4Guid}"] .rx-select__search-button-title`).getText();
    }

    async isLabelValueDisplayed(labelName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.labelValue, labelName)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.labelValue, labelName)).isDisplayed();
            else return false;
        });
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new AssignmentConfigEditPage();