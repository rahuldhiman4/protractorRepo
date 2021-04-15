import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityCommon from "../../../utils/utility.common";

class CreateTemplateMapping {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        mappingName: '[rx-view-component-id="97d922c1-cc3e-4b98-88fb-229dbbf7a8b2"] input',
        mappingNameGuid: '97d922c1-cc3e-4b98-88fb-229dbbf7a8b2',
        companyGuid: '6c096a04-0a92-4e53-90e5-73fc6537ad2a',
        datasetGuid: '12798ede-7608-4923-8807-38c5f3f3c554',
        enabledmappingGuid: '644ed7fa-2185-473b-9a2e-225e3b46a54c',
        enabledmappingRequired: '644ed7fa-2185-473b-9a2e-225e3b46a54c',
        caseCreatedAutomatically: '[rx-view-component-id="e42ebfc1-af21-46fd-9872-d47325c25ec4"] input',
        caseCreatedAutomaticallyGuid: 'e42ebfc1-af21-46fd-9872-d47325c25ec4',
        caseCreatedByAgent: '[rx-view-component-id="18f85849-68bb-4084-91bb-b81c458720d8"] input',
        caseCreatedByAgentGuid: '18f85849-68bb-4084-91bb-b81c458720d8',
        saveButton: '[rx-view-component-id="e7bedc27-5dc2-4332-a5c7-a008361615f7"] button',
        cancelButton: '[rx-view-component-id="cc49b0ee-725c-4c6d-b69b-3512164d5b38"] button',
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
        await $(`[rx-view-component-id="644ed7fa-2185-473b-9a2e-225e3b46a54c"] button[aria-pressed= ${booleanValue}`).click();
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
        return await utilityCommon.isRequiredTagToField('644ed7fa-2185-473b-9a2e-225e3b46a54c');
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

export default new CreateTemplateMapping();
