import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';
class CreateFlowset {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        companyGuid: 'c5db0b0e-50d7-4b53-ba38-4d7fe43988ba',
        company: '[rx-view-component-id="c5db0b0e-50d7-4b53-ba38-4d7fe43988ba"] .ui-select-toggle',
        flowsetNameGuid: '14b20169-66a4-476a-aa28-edbbbb4d7f31',
        flowset: '[rx-view-component-id="14b20169-66a4-476a-aa28-edbbbb4d7f31"] .d-textfield__input',
        descriptionGuid: '8dde5faf-fa57-4e4a-b6f7-59ae242e1022',
        description: '[rx-view-component-id="8dde5faf-fa57-4e4a-b6f7-59ae242e1022"] .d-textfield__input',
        statusGuid: '49fb02c5-5dae-4b47-86e3-17739e6cff7d',
        savebutton: '[rx-view-component-id="ccdcd13c-0191-4e0c-a7b7-27d7d67f74cf"] button',
        cancelButton: '[rx-view-component-id="59a7093f-3289-4e3d-90ce-a7908a840de4"] button',
        status: '[rx-view-component-id="49fb02c5-5dae-4b47-86e3-17739e6cff7d"] [class="ui-select-match-text pull-left"]',
    }

    async isCompanyTitleDisplayed(company: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.companyGuid, company);
    }

    async isCompanyRequiredTextDisplayed(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.company)));
        return await ($(this.selectors.company)).getAttribute("required");
    }

    async isFlowsetRequiredTextDisplayed(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.flowset)));
        return await ($(this.selectors.flowset)).getAttribute("required");
    }

    async isDescriptionRequiredTextDisplayed(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.description)));
        return await ($(this.selectors.description)).getAttribute("required");
    }

    async isStatusRequiredTextDisplayed(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.statusGuid)));
        return await ($(this.selectors.statusGuid)).getAttribute("required");
    }

    async isFlowsetNameTitleDisplayed(flowset: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.flowsetNameGuid, flowset);
    }

    async isDescriptionTitleDisplayed(description: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.descriptionGuid, description);
    }

    async isStatusTitleDisplayed(status: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.statusGuid, status);
    }

    async selectCompany(company: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async setFlowsetname(flowset: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.flowset)));
        await ($(this.selectors.flowset)).sendKeys(flowset);
    }

    async setDescription(description: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.description)));
        await ($(this.selectors.description)).sendKeys(description);
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

}

export default new CreateFlowset();