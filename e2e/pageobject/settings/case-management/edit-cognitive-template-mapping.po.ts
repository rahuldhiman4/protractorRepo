import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityCommon from "../../../utils/utility.common";

class EditTemplateMapping {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        mappingName: '[rx-view-component-id="033b6b93-1159-4471-ad84-05f2b99b869a"] input',
        mappingNameGuid: '033b6b93-1159-4471-ad84-05f2b99b869a',
        companyGuid: '70f0c36d-c155-43f0-837c-48977710b8ee',
        datasetGuid: '6af46bf0-d2db-4cc1-8686-91f90d6c503e',
        enabledmappingGuid: 'd0f55567-9833-471f-88bf-d6cde326386c',
        enabledmappingRequiredText: 'd0f55567-9833-471f-88bf-d6cde326386c',
        caseCreatedAutomatically: '[rx-view-component-id="cbb7ba8d-6636-4337-841a-fda0f10f18aa"] input',
        caseCreatedAutomaticallyGuid: 'cbb7ba8d-6636-4337-841a-fda0f10f18aa',
        caseCreatedByAgent: '[rx-view-component-id="63e0c9b9-6592-4de1-972e-cf151854a261"] input',
        caseCreatedByAgentGuid: '63e0c9b9-6592-4de1-972e-cf151854a261',
        saveButton: '[rx-view-component-id="a14c053b-7d3f-4d9e-8554-aa79d8402081"] button',
        cancelButton: '[rx-view-component-id="0c27cc95-5cd4-4c3d-a750-4bfaac79aa87"] button',
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
        await utilityCommon.selectToggleButton('d0f55567-9833-471f-88bf-d6cde326386c',booleanValue);
    }

    async updateValueOfCasesCreatedAutomatically(auto: string): Promise<void> {
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
        return await utilityCommon.isRequiredTagToField(this.selectors.enabledmappingRequiredText)
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

export default new EditTemplateMapping();
