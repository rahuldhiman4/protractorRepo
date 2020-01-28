import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';
class CreateFlowset {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        companyGuid: '838b3d55-e82c-4d5e-859b-4144ad048254',
        company: '[rx-view-component-id="838b3d55-e82c-4d5e-859b-4144ad048254"] .ui-select-toggle',
        ProcessNameGuid: '7fc0ca1d-6fa7-418c-826a-4a09c9dccf87',
        ApplicationServiceGuid: 'ec882563-a0bc-446a-ba86-12723ab22d2e',
        ApplicationService: '[rx-view-component-id="ec882563-a0bc-446a-ba86-12723ab22d2e"] .d-textfield__input',
        statusGuid: '45a46475-2f0b-403f-9cf4-0a6a69f60647',
        savebutton: '[rx-view-component-id="45fa1365-5971-459f-b22c-61de5e675745"] button',
        cancelButton: '[rx-view-component-id="4cf8efdd-2374-43fc-942c-2048c2f5f931"] button',
        status: '[rx-view-component-id="45a46475-2f0b-403f-9cf4-0a6a69f60647"] [class="ui-select-match-text pull-left"]',
        processAliasname: '[rx-view-component-id="ed363e9c-1814-4c7d-bc7e-1841ecb21c97"] input',
        processAliasGuid: 'ed363e9c-1814-4c7d-bc7e-1841ecb21c97',
        description: '[rx-view-component-id="920e06e9-5389-4e30-8c6c-74eefa0d19fb"] textarea',
        descriptionGuid: '920e06e9-5389-4e30-8c6c-74eefa0d19fb'
    }

    async isCompanyRequiredTextDisplayed(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.company)));
        return await ($(this.selectors.company)).getAttribute("required");
    }

    async isProcessRequiredTextDisplayed(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.ProcessNameGuid)));
        return await ($(this.selectors.ProcessNameGuid)).getAttribute("required");
    }

    async isApplicationServiceRequiredTextDisplayed(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.ApplicationService)));
        return await ($(this.selectors.ApplicationService)).getAttribute("required");
    }

    async isStatusRequiredTextDisplayed(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.statusGuid)));
        return await ($(this.selectors.statusGuid)).getAttribute("required");
    }

    async isProcessAliasRequiredTextDisplayed(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.processAliasname)));
        return await ($(this.selectors.processAliasname)).getAttribute("required");
    }

    async isDescriptionRequiredTextDisplayed(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.description)));
        return await ($(this.selectors.description)).getAttribute("required");
    }

    async isCompanyTitleDisplayed(company: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.companyGuid, company);
    }

    async isProcessNameTitleDisplayed(process: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.ProcessNameGuid, process);
    }

    async isApplicationTitleDisplayed(Application: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.ApplicationServiceGuid, Application);
    }

    async isStatusTitleDisplayed(status: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.statusGuid, status);
    }

    async isProcessAliasTitleDisplayed(processAlias: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.processAliasGuid, processAlias);
    }

    async isDescriptionTitleDisplayed(description: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.descriptionGuid, description);
    }

    async selectCompany(company: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async selectProcessName(process: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ProcessNameGuid,process);
    }

    async selectApplicationService(application: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ApplicationServiceGuid,application);
    }

    async selectStatus(status: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async clickOnStatus(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.status)));
        await ($(this.selectors.status)).click;
    }
    async clickSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.savebutton)));
        await ($(this.selectors.savebutton)).click();
        await utilCommon.waitUntilPopUpDisappear();
    }

    async clickCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await ($(this.selectors.cancelButton)).click();
    }

    async statusDropDownValuesDisplayed(statusValues: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.statusGuid, statusValues);
    }

    async setDescription(description:string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.description)));
        await ($(this.selectors.description)).clear();
        await ($(this.selectors.description)).sendKeys(description);
    }

    async setAliasName(alias:string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.processAliasname)));
        await ($(this.selectors.processAliasname)).clear();
        await ($(this.selectors.processAliasname)).sendKeys(alias);
    }

       


}

export default new CreateFlowset();