import { $, $$, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class EditFlowsetPage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        flowsetName: '[rx-view-component-id="4304c07c-602a-4a07-b05b-0406aa6747be"] input',
        descriptionField: '[rx-view-component-id="a825a900-6197-430c-ae9e-197291a6ff01"] textarea',
        statusGuid: '046e725c-0b9a-440d-9c96-77a730cf23f3',
        status: '[rx-view-component-id="046e725c-0b9a-440d-9c96-77a730cf23f3"] .ui-select-toggle',
        addAssociateCategoryBtn: '[rx-view-component-id="88810c80-2be6-4052-bd3c-40dbc782f046"] button',
        saveButton: '[rx-view-component-id="ec655846-3db8-4072-beef-2dab6438e0e3"] button',
        tab: '.nav-tabs a',
        addNewMapping: '[rx-view-component-id="1d59b685-ac65-4ac6-a39b-268596c8ae9c"] button',
        selectCompanyField: '[rx-view-component-id="1a170338-889d-47ef-a878-4d174bd88783"] .ac-company-field button',
        selectAgentField: '[rx-view-component-id="1a170338-889d-47ef-a878-4d174bd88783"] .d-textfield__label input',
        associateResolutionCode: '[rx-view-component-id="3d0801f0-7f99-4967-a71a-6347f25c8427"] button',
        addResolutionCode: '[rx-view-component-id="80823193-b62b-425d-aae6-3a6191dea8bc"] button',
        companyValue: '[rx-view-component-id="2303bffc-b2c5-4cd2-a55a-bac22b61d516"] .ui-select-toggle',
    }

    async isFlowsetNameDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.flowsetName)));
        return await $(this.selectors.flowsetName).getAttribute("disabled") == "true";
    }

    async setFlowset(flowset:string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.flowsetName)));
        await $(this.selectors.flowsetName).clear();
        await $(this.selectors.flowsetName).sendKeys(flowset);
    }

    async setDescription(description:string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.descriptionField)));
        await $(this.selectors.descriptionField).clear();
        await $(this.selectors.descriptionField).sendKeys(description);
    }

    async selectStatus(status: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async getStatusvalue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.status)));
        return await $(this.selectors.status).getText();
    }

    async isStatusFieldDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.status)));
        return await $(this.selectors.status).getAttribute("disabled") == "true";
    }

    async isAddAssociationBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addAssociateCategoryBtn)));
        return await $(this.selectors.addAssociateCategoryBtn).getAttribute("disabled") == "true";
    }

    async isSaveBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

    async clickSaveBtn(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
        await utilCommon.waitUntilPopUpDisappear();
    }

    async navigateToProcessTab(): Promise<void> {
        let locator = $$(this.selectors.tab).get(1);
        await browser.wait(this.EC.elementToBeClickable(locator));
        await locator.click();
    }

    async isAddNewMappingBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addNewMapping)));
        return await $(this.selectors.addNewMapping).getAttribute("disabled") == "true";
    }

    async navigateToCaseAccessTab(): Promise<void> {
        let locator = $$(this.selectors.tab).get(2);
        await browser.wait(this.EC.elementToBeClickable(locator));
        await locator.click();
    }

    async isSelectCompanyFldDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.selectCompanyField)));
        return await $(this.selectors.selectCompanyField).getAttribute("disabled") == "true";
    }

    async isSelectAgentFldDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.selectAgentField)));
        return await $(this.selectors.selectAgentField).getAttribute("disabled") == "true";
    }

    async navigateToResolutionCodesTab(): Promise<void> {
        let locator = $$(this.selectors.tab).get(3);
        await browser.wait(this.EC.elementToBeClickable(locator));
        await locator.click();
    }

    async isAssociateResolutionCodeBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.associateResolutionCode)));
        return await $(this.selectors.associateResolutionCode).getAttribute("disabled") == "true";
    }

    async isAddResolutionCodeBtnDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addResolutionCode)));
        return await $(this.selectors.addResolutionCode).getAttribute("disabled") == "true";
    }

    async getComapanyValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.companyValue)));
        return await $(this.selectors.companyValue).getText();
    }

}

export default new EditFlowsetPage();