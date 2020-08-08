import { $, $$, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common'

class ReadAccessConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        supportGroup: '[rx-view-component-id="59fae521-483b-4d6a-93ed-84c88919351a"] .d-textfield__label',
        editName: '[rx-view-component-id="5aa348b9-f853-4b0f-bbff-a23d2e153f6a"] input',
        defaultToggle: '[rx-view-component-id="fa6bad05-195e-4df6-a7f1-daf55b2e0571"] button',
        saveButton: '[rx-view-component-id="5ea49da6-8472-4848-a29e-917a0932ea24"] button',
        companyField: '[rx-view-component-id="2d60a97e-67aa-41fe-94f9-72e83556789b"] span.form-control',
        companyGuid: '2d60a97e-67aa-41fe-94f9-72e83556789b',
        cancelButton: '[rx-view-component-id="4161aa6c-2565-4f6e-85af-088df3db222e"] button',
        defaultToggleGuid: 'fa6bad05-195e-4df6-a7f1-daf55b2e0571',
        flowsetGuid: '15430b06-186f-4dde-985c-2308d8a21a5d',
        priorityGuid: '732d1377-9873-476d-a5ee-bee0eb9ee5f3',
        supportGroupGuid: '59fae521-483b-4d6a-93ed-84c88919351a',
        businessUnitGuid: '2d897e8d-c447-4a0f-b494-50c0eb0fc3ac',
    }

    async isAccessMappingNameDisabled(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.supportGroup)));
        return await $(this.selectors.editName).getAttribute("readonly") == "true";
    }

    async isDefaultToggleBtnDisabled(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.supportGroup)));
        let readProperty1: string = await $$(this.selectors.defaultToggle).get(0).getAttribute("disabled");
        let readProperty2: string = await $$(this.selectors.defaultToggle).get(1).getAttribute("disabled");
        return (readProperty1 == "true" && readProperty2 == "true")
    }

    async isSaveBtnDisabled(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

    async isCompanyFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.companyField).getAttribute("disabled") == "true";
    }

    async selectCompany(company: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async clickOnSave(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancel(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async setDefaultToggleButton(value: boolean): Promise<void> {
        await utilCommon.selectToggleButton(this.selectors.defaultToggleGuid, value);
    }

    async selectFlowset(flowsetName: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.flowsetGuid, flowsetName);
    }

    async selectPriority(priority: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.priorityGuid, priority);
    }

    async clearAccessMappingName(): Promise<void> {
        await $(this.selectors.editName).clear();
    }

    async setAccessMappingName(mappingName: string): Promise<void> {
        await $(this.selectors.editName).sendKeys(mappingName);
    }

    async selectSupportGroup(supportGroup:string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.supportGroupGuid,supportGroup);
     }

     async selectBusinessUnit(businessUnit:string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.businessUnitGuid,businessUnit);
     }

}

export default new ReadAccessConfigEditPage();