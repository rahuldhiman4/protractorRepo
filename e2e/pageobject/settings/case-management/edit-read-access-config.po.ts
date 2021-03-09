import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class ReadAccessConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editName: '[rx-view-component-id="5aa348b9-f853-4b0f-bbff-a23d2e153f6a"] input',
        defaultToggle: '[rx-view-component-id="fa6bad05-195e-4df6-a7f1-daf55b2e0571"] button',
        saveButton: '[rx-view-component-id="5ea49da6-8472-4848-a29e-917a0932ea24"] button',
        companyField: '[rx-view-component-id="2d60a97e-67aa-41fe-94f9-72e83556789b"] .disabled',
        companyGuid: '2d60a97e-67aa-41fe-94f9-72e83556789b',
        cancelButton: '[rx-view-component-id="4161aa6c-2565-4f6e-85af-088df3db222e"] button',
        defaultToggleGuid: 'fa6bad05-195e-4df6-a7f1-daf55b2e0571',
        flowsetGuid: 'cf6a98ad-ac7b-49ab-9df1-f9531905290e',
        priorityGuid: '732d1377-9873-476d-a5ee-bee0eb9ee5f3',
        supportGroupGuid: '3a1b5bb1-5d8e-460c-adc4-df2871e03f64',
        businessUnitGuid: 'bbc67a21-674b-4a0a-baf8-5c39e1c0f995',
        categoryTier4Guid: '236c2bd3-b189-4531-8791-f06319a3a312',
        labelValue: '[rx-view-component-id="41784500-6e79-465a-9cb9-6fd4038c53e8"] .dropdown-toggle',
        labelGuid: '41784500-6e79-465a-9cb9-6fd4038c53e8',
        lobValue: '[rx-view-component-id="0969d589-7252-44ba-9080-8513dad09ec7"] .rx-select__search-button-title'
    }

    async isAccessMappingNameDisabled(): Promise<boolean> {
        return await $(this.selectors.editName).getAttribute("readonly") == "true";
    }

    async isDefaultToggleBtnDisabled(): Promise<boolean> {
        let readProperty1: string = await $$(this.selectors.defaultToggle).get(0).getAttribute("disabled");
        let readProperty2: string = await $$(this.selectors.defaultToggle).get(1).getAttribute("disabled");
        return (readProperty1 == "true" && readProperty2 == "true")
    }

    async isSaveBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

    async isCompanyFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.companyField).isPresent();
    }

    async selectCompany(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async clickOnSave(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancel(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async setDefaultToggleButton(value: boolean): Promise<void> {
        await utilityCommon.selectToggleButton(this.selectors.defaultToggleGuid, value);
    }

    async selectFlowset(flowsetName: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.flowsetGuid, flowsetName);
    }

    async setLabel(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.labelGuid, value);
    }


    async selectPriority(priority: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.priorityGuid, priority);
    }

    async clearAccessMappingName(): Promise<void> {
        await $(this.selectors.editName).clear();
    }

    async setAccessMappingName(mappingName: string): Promise<void> {
        await $(this.selectors.editName).sendKeys(mappingName);
    }

    async selectSupportGroup(supportGroup: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.supportGroupGuid, supportGroup);
    }

    async selectSupportOrg(businessUnit: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.businessUnitGuid, businessUnit);
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

export default new ReadAccessConfigEditPage();