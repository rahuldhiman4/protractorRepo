import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
class CreateFlowset {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        companyGuid: 'c5db0b0e-50d7-4b53-ba38-4d7fe43988ba',
        company: '[rx-view-component-id="c5db0b0e-50d7-4b53-ba38-4d7fe43988ba"] adapt-select',// done
        flowsetNameGuid: '14b20169-66a4-476a-aa28-edbbbb4d7f31',
        flowset: '[rx-view-component-id="14b20169-66a4-476a-aa28-edbbbb4d7f31"] .form-control',//done
        descriptionGuid: '8dde5faf-fa57-4e4a-b6f7-59ae242e1022',
        description: '[rx-view-component-id="8dde5faf-fa57-4e4a-b6f7-59ae242e1022"] textarea',//done
        statusGuid: '49fb02c5-5dae-4b47-86e3-17739e6cff7d',
        savebutton: '[rx-view-component-id="ccdcd13c-0191-4e0c-a7b7-27d7d67f74cf"] button',
        cancelButton: '[rx-view-component-id="59a7093f-3289-4e3d-90ce-a7908a840de4"] button',
        status: '[rx-view-component-id="49fb02c5-5dae-4b47-86e3-17739e6cff7d"] adapt-rx-select',
    }

    async isCompanyTitleDisplayed(company: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.companyGuid, company);
    } //rx-select-with-pagination locator not found in utility file

    async isCompanyRequiredTextDisplayed(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isFlowsetRequiredTextDisplayed(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.flowsetNameGuid);
    }

    async isDescriptionRequiredTextDisplayed(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.descriptionGuid);
    }

    async isStatusRequiredTextDisplayed(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.statusGuid);
    }

    async isFlowsetNameTitleDisplayed(flowset: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.flowsetNameGuid, flowset);
    }

    async isDescriptionTitleDisplayed(description: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.descriptionGuid, description);
    }

    async isStatusTitleDisplayed(status: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.statusGuid, status);
    }

    async selectCompany(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async setFlowsetname(flowset: string): Promise<void> {
        await ($(this.selectors.flowset)).sendKeys(flowset);
    }

    async setDescription(description: string): Promise<void> {
        await ($(this.selectors.description)).sendKeys(description);
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

    async clickCancelButton(): Promise<void> {
        await ($(this.selectors.cancelButton)).click();
    }

    async statusDropDownValuesDisplayed(statusValues: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.statusGuid, statusValues);
    }

}

export default new CreateFlowset();