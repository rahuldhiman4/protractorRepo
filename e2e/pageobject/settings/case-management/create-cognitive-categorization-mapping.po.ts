import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityCommon from "../../../utils/utility.common";

class CreateCategorizationMapping {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        mappingName: '[rx-view-component-id="7004c922-d5cb-4331-90cb-6521e2689b49"] input',
        mappingNameGuid: '7004c922-d5cb-4331-90cb-6521e2689b49',
        companyGuid: '8a8d1e53-ea2b-41fc-8802-bc52816d69b8',
        datasetGuid: '01f2d7f9-8b72-4744-a7c3-c2bc6ee29fe6',
        enabledmappingGuid: 'c7760d77-0af6-44af-9965-879a3d06423a',
        enabledmappingRequired: '[rx-view-component-id="c7760d77-0af6-44af-9965-879a3d06423a"] button',
        caseCreatedAutomatically: '[rx-view-component-id="fc7311b8-2860-4bab-ba26-2c89426c20d0"] input',
        caseCreatedAutomaticallyGuid: 'fc7311b8-2860-4bab-ba26-2c89426c20d0',
        caseCreatedByAgent: '[rx-view-component-id="dd334f2c-5f89-4230-bb94-0147984a3e6e"] input',
        caseCreatedByAgentGuid: 'dd334f2c-5f89-4230-bb94-0147984a3e6e',
        saveButton: '[rx-view-component-id="1371fc4f-c111-457f-807b-93bfe73a5474"] button',
        cancelButton: '[rx-view-component-id="3470b89f-4c59-456b-ace7-768770016907"] button',
        maximumValueErrorMessage: '.rx-feedback-alert.text-danger',
    }

    async setMappingName(mapping: string): Promise<void> {
        await $(this.selectors.mappingName).sendKeys(mapping);
    }

    async selectCompany(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async selectDataSet(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.datasetGuid, company);
    }

    async clickEnabledMapping(booleanValue: boolean): Promise<void> {
        await $(`[rx-view-component-id="c7760d77-0af6-44af-9965-879a3d06423a"] button[aria-pressed= ${booleanValue}`).click();
    }

    async setConfidentialsLevelOfCategorization(auto: string): Promise<void> {
        await $(this.selectors.caseCreatedAutomatically).clear();
        await $(this.selectors.caseCreatedAutomatically).sendKeys(auto);
    }

    async setConfidentialsLevelByAgent(auto: string): Promise<void> {
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
        return await utilityCommon.isRequiredTagToField(this.selectors.datasetGuid)
    }

    async isConfidentialsLevelOfCategorizationTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.caseCreatedAutomaticallyGuid)
    }

    async isConfidentialsLevelByAgentRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.caseCreatedByAgentGuid)
    }

    async isSaveButtonDisabled(): Promise<string> {
        return await $(this.selectors.saveButton).getAttribute("disabled");
    }

    async getMaximumValueErrorMessage(): Promise<string> {
        return await $(this.selectors.maximumValueErrorMessage).getText();
    }
}

export default new CreateCategorizationMapping();
