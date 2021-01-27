import { $, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class CreateFlowset {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        companyGuid: '838b3d55-e82c-4d5e-859b-4144ad048254',
        searchIcon:' button[rx-id="search-button"]',///done
        searchProcessTxtbox: '.input-group-sm input',//done
        selectProcess: '.rx-bundle button span',//done
        processName: '[rx-view-component-id="7fc0ca1d-6fa7-418c-826a-4a09c9dccf87"] button',//done
        company: '[rx-view-component-id="838b3d55-e82c-4d5e-859b-4144ad048254"] rx-select-with-pagination',//done
        ProcessNameGuid: '7fc0ca1d-6fa7-418c-826a-4a09c9dccf87',
        ApplicationServiceGuid: 'ec882563-a0bc-446a-ba86-12723ab22d2e',
        ApplicationService: '[rx-view-component-id="ec882563-a0bc-446a-ba86-12723ab22d2e"] adapt-select',
        statusGuid: '45a46475-2f0b-403f-9cf4-0a6a69f60647',
        savebutton: '[class="btn btn-primary btn-sm ng-star-inserted"]',//done
        cancelButton: '[class="btn btn-secondary btn-sm ng-star-inserted"]',//done
        status: '[rx-view-component-id="45a46475-2f0b-403f-9cf4-0a6a69f60647"] adapt-rx-select',//done
        processAliasname: 'input[type="text"]',
        processAliasGuid: 'ed363e9c-1814-4c7d-bc7e-1841ecb21c97',
        description: '[rx-view-component-id="920e06e9-5389-4e30-8c6c-74eefa0d19fb"] textarea',
        descriptionGuid: '920e06e9-5389-4e30-8c6c-74eefa0d19fb'
    }

    async isCompanyRequiredTextDisplayed(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isProcessRequiredTextDisplayed(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.ProcessNameGuid);
    }

    async isStatusRequiredTextDisplayed(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.statusGuid);
    }

    async isProcessAliasRequiredTextDisplayed(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.processAliasGuid);
    }

    async isDescriptionRequiredTextDisplayed(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.descriptionGuid);
    }

    async isCompanyTitleDisplayed(company: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.companyGuid, company);
    }

    async isProcessNameTitleDisplayed(process: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.ProcessNameGuid, process);
    }

    async isApplicationTitleDisplayed(Application: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.ApplicationServiceGuid, Application);
    }

    async isStatusTitleDisplayed(status: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.statusGuid, status);
    }

    async isProcessAliasTitleDisplayed(processAlias: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.processAliasGuid, processAlias);
    }

    async isDescriptionTitleDisplayed(description: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.descriptionGuid, description);
    }

    async selectCompany(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async selectProcessName(process: string): Promise<void> {
        await $(this.selectors.processName).click();
        await $(this.selectors.searchIcon).click();
        await $(this.selectors.searchProcessTxtbox).sendKeys(process);
        await element(by.cssContainingText(this.selectors.selectProcess, process)).click();
    }

    async selectApplicationService(application: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.ApplicationServiceGuid, application);
    }

    async selectStatus(status: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async clickOnStatus(): Promise<void> {
        await ($(this.selectors.status)).click;
    }
    async clickSaveButton(): Promise<void> {
        await ($(this.selectors.savebutton)).click();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.savebutton).isEnabled();
    }

    async isErrorMsgPresent(msg:string): Promise<boolean> {
        return await utilityCommon.isPopUpMessagePresent(msg);
    }

    async clickCancelButton(): Promise<void> {
        await ($(this.selectors.cancelButton)).click();
    }

    async statusDropDownValuesDisplayed(statusValues: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.statusGuid, statusValues);
    }

    async setDescription(description: string): Promise<void> {
        await ($(this.selectors.description)).clear();
        await ($(this.selectors.description)).sendKeys(description);
    }

    async setAliasName(alias: string): Promise<void> {
        await ($(this.selectors.processAliasname)).clear();
        await ($(this.selectors.processAliasname)).sendKeys(alias);
    }
}

export default new CreateFlowset();