import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityCommon from "../../../utils/utility.common";

class EditCategorizationMapping {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        mappingName: '[rx-view-component-id="98677225-d939-438d-8c4a-b3c541491ea1"] input',
        mappingNameGuid: '98677225-d939-438d-8c4a-b3c541491ea1',
        companyGuid: '4f7308fd-f036-42c9-a6db-4bdf87a8d336',
        datasetGuid: '3372f0b8-e577-41bc-9c68-37a890a299b3',
        enabledmappingGuid: 'be8c1b72-d8a0-4501-91e2-81bc94500acd',
        enabledmappingRequiredText: '[rx-view-component-id="be8c1b72-d8a0-4501-91e2-81bc94500acd"] button',
        caseCreatedAutomatically: '[rx-view-component-id="a0050bbb-ef5f-4551-8fac-54facca6d310"] input',
        caseCreatedAutomaticallyGuid: 'a0050bbb-ef5f-4551-8fac-54facca6d310',
        caseCreatedByAgent: '[rx-view-component-id="c15e8a38-b2bc-48bb-bca7-c44427562bca"] input',
        caseCreatedByAgentGuid: 'c15e8a38-b2bc-48bb-bca7-c44427562bca',
        saveButton: '[rx-view-component-id="da09580b-6c62-4ecc-b6fc-778a96a4b345"] button',
        cancelButton: '[rx-view-component-id="2ebd9a8b-2ac8-4277-b7d0-4ed9cac87517"] button',
        maximumValueErrorMessage: '.rx-feedback-alert.text-danger',

    }

    async updateMappingName(mapping: string): Promise<void> {
        await $(this.selectors.mappingName).clear();
        await $(this.selectors.mappingName).sendKeys(mapping);
    }

    async getCompanyDisabledAttribute(): Promise<string> {
      return  await $(this.selectors.companyGuid).getAttribute("readonly");
    }

    async updateDataSet(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.datasetGuid, company);
    }

    async clickEnabledMapping(booleanValue: boolean): Promise<void> {
        await $(`[rx-view-component-id="c7760d77-0af6-44af-9965-879a3d06423a"] button[aria-pressed= ${booleanValue}`).click();
    }

    async updateConfidentialsLevelOfCategorization(auto: string): Promise<void> {
        await $(this.selectors.caseCreatedAutomatically).clear();
        await $(this.selectors.caseCreatedAutomatically).sendKeys(auto);
    }

    async updateConfidentialsLevelByAgent(auto: string): Promise<void> {
        await $(this.selectors.caseCreatedByAgent).clear();
        await $(this.selectors.caseCreatedByAgent).sendKeys(auto);
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();;
    }

    async isMappingRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.mappingNameGuid)
    }

    async isCompanyTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.companyGuid)
    }

    async isDatasetTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.datasetGuid)
    }

    async isEnableMappingRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.enabledmappingGuid)
    }

    async isConfidentialsLevelOfCategorizationTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.caseCreatedAutomaticallyGuid)
    }

    async isConfidentialsLevelByAgentRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.caseCreatedByAgentGuid)
    }

    async getMaximumValueErrorMessage(): Promise<string> {
        return await $(this.selectors.maximumValueErrorMessage).getText();
    }
}

export default new EditCategorizationMapping();
