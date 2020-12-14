import utilityCommon from '../../../utils/utility.common';
import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilCommon from '../../../utils/util.common';
import utilGrid from '../../../utils/util.grid';

class EditFlowsetPage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        processExecutionTypeGuid: '275b58b7-85e0-4d56-9d39-215f3551d471',
        functionGuid: '37ec6a5a-d6ba-4825-ab89-6fa4175c0751',
        processnameGuid: '8ed57f59-49e6-4ef5-bc10-30fc55bc5556',
        processMappingSaveBtn: '[rx-view-component-id="106495e9-95f6-4d94-b9c8-f71c5a76f09d"] button',
        editProcessMappingSaveBtn: '[rx-view-component-id="0d0e544e-e9e4-4854-ae72-6599a7ae38cd"] button',
        flowsetName: '[rx-view-component-id="4304c07c-602a-4a07-b05b-0406aa6747be"] input',
        descriptionField: '[rx-view-component-id="a825a900-6197-430c-ae9e-197291a6ff01"] textarea',
        statusGuid: '046e725c-0b9a-440d-9c96-77a730cf23f3',
        processStatusGuid: 'b48823c7-8eb0-4b30-bd9a-b44e53fcc195',
        status: '[rx-view-component-id="046e725c-0b9a-440d-9c96-77a730cf23f3"] .ui-select-toggle',
        addAssociateCategoryBtn: '[rx-view-component-id="88810c80-2be6-4052-bd3c-40dbc782f046"] button',
        saveButton: '[rx-view-component-id="32a85bf4-f0e6-45ef-bb06-9564f9898416"] button',
        tab: '.nav-tabs a',
        addNewMapping: '[rx-view-component-id="1d59b685-ac65-4ac6-a39b-268596c8ae9c"] button',
        selectCompanyField: '[rx-view-component-id="1a170338-889d-47ef-a878-4d174bd88783"] .ac-company-field button',
        selectAgentField: '[rx-view-component-id="1a170338-889d-47ef-a878-4d174bd88783"] .d-textfield__label input',
        associateResolutionCode: '[rx-view-component-id="3d0801f0-7f99-4967-a71a-6347f25c8427"] button',
        addResolutionCode: '[rx-view-component-id="80823193-b62b-425d-aae6-3a6191dea8bc"] button',
        companyValue: '[rx-view-component-id="2303bffc-b2c5-4cd2-a55a-bac22b61d516"] .ui-select-toggle',
        processMappingConsoleGuid: '0e25a330-f284-4892-9777-84ae2a5583ff',
        confidentialSupportGroupAccess: '.ac-label-manage-support',
        supportGroupDropDown: '.flex-item .ac-confidential-group-field button',
        dropdownElement: '.ac-confidential-group-field .options li:last-of-type',
        confidentialFieldSearchBox: '.field input[placeholder="Search for Support Groups"]',
        addConfidentialSupportGroup: '[ng-if="enableAddSupportGroup"]',
        confidentialSupportGroupAssignToMe: '[class="d-checkbox__item ac-label-assign-confidential-write"]',
        supportGroupWarningText: '[class="rx-case-access-remove ac-group-not-unique"] .rx-case-access-remove-text',
    }

    async isFlowsetNameDisabled(): Promise<boolean> {
        return await $(this.selectors.flowsetName).getAttribute("readonly") == "true";
    }

    async selectProcessName(process: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.processnameGuid, process);
    }

    async selectConfidentialSupportGroup(supportGroup: string): Promise<void> {
        await $$(this.selectors.supportGroupDropDown).get(1).click();
        await $$(this.selectors.confidentialFieldSearchBox).get(3).sendKeys(supportGroup);
        await browser.sleep(1000); // Wait Until Searched Confidential Support Group Loaded.
        await element(by.cssContainingText(this.selectors.dropdownElement, supportGroup)).isPresent().then(async (result) => {
            if (result) {
                await browser.sleep(1000); // Wait Until Confidential Support Group Ready To Click.
                await element(by.cssContainingText(this.selectors.dropdownElement, supportGroup)).click()
            } else {
                console.log(supportGroup," this confidential support group not present");
            }

        });
}

    async clickConfidentialWriteSupportGroupAccess(): Promise<void> {
        await $$(this.selectors.confidentialSupportGroupAssignToMe).get(3).click();
    }

    async clickAddConfidentialSupportGroup(): Promise<void> {
        await $$(this.selectors.addConfidentialSupportGroup).get(3).click();
    }

    async clickConfidentialSupportGroupAccess(): Promise<void> {
        await $$(this.selectors.confidentialSupportGroupAccess).get(1).click();
    }

    async getSupportGroupWarningMessage(): Promise<string> {
        return await $(this.selectors.supportGroupWarningText).getText();
    }

    async setFlowset(flowset: string): Promise<void> {
        await $(this.selectors.flowsetName).clear();
        await $(this.selectors.flowsetName).sendKeys(flowset);
    }

    async setDescription(description: string): Promise<void> {
        await $(this.selectors.descriptionField).clear();
        await $(this.selectors.descriptionField).sendKeys(description);
    }

    async selectStatus(status: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async selectProcessStatus(status: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.processStatusGuid, status);
    }

    async selectProcessExecutionType(process: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.processExecutionTypeGuid, process);
    }

    async selectFunction(functionName: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.functionGuid, functionName);
    }

    async getStatusvalue(): Promise<string> {
        return await $(this.selectors.status).getText();
    }

    async isStatusFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.status).getAttribute("disabled") == "true";
    }

    async isAddAssociationBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.addAssociateCategoryBtn).getAttribute("disabled") == "true";
    }

    async isSaveBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

    async clickSaveBtn(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickSaveBtnOnProcessMapping(): Promise<void> {
        await $(this.selectors.processMappingSaveBtn).click();
    }

    async clickSaveBtnOnEditProcessMapping(): Promise<void> {
        await $(this.selectors.editProcessMappingSaveBtn).click();
    }

    async searchProcessMappingName(processMappingName: string): Promise<boolean> {
        await utilGrid.isGridRecordPresent(processMappingName, this.selectors.processMappingConsoleGuid);
        return await element(by.cssContainingText('[rx-view-component-id="0e25a330-f284-4892-9777-84ae2a5583ff"] .ui-grid__link', processMappingName)).isPresent().then(async (result) => {
            if (result) {
                return await element(by.cssContainingText('[rx-view-component-id="0e25a330-f284-4892-9777-84ae2a5583ff"] .ui-grid__link', processMappingName)).getText() == processMappingName ? true : false;
            } else {
                console.log("Mapping not present");
                return false;
            }
        });
    }

    async searchAndOpenProcessMapping(processMappingName: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(processMappingName, this.selectors.processMappingConsoleGuid);
    }

    async isAddNewMappingBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.addNewMapping).getAttribute("disabled") == "true";
    }

    async isProcessExecutionTypePresent(process: string): Promise<boolean> {
        return await element(by.cssContainingText('[rx-view-component-id="0e25a330-f284-4892-9777-84ae2a5583ff"] .ui-grid-cell-contents', process)).isPresent().then(async (result) => {
            if (result) {
                return await element(by.cssContainingText('[rx-view-component-id="0e25a330-f284-4892-9777-84ae2a5583ff"] .ui-grid-cell-contents', process)).getText() == process ? true : false;
            } else {
                console.log("Process not present");
                return false;
            }
        });
    }

    async clickOnAddNewMappingBtn(): Promise<void> {
        await $(this.selectors.addNewMapping).click();
    }

    async isSelectCompanyFldDisabled(): Promise<boolean> {
        return await $(this.selectors.selectCompanyField).getAttribute("disabled") == "true";
    }

    async isSelectAgentFldDisabled(): Promise<boolean> {
        return await $(this.selectors.selectAgentField).getAttribute("disabled") == "true";
    }

    async isAssociateResolutionCodeBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.associateResolutionCode).getAttribute("disabled") == "true";
    }

    async isAddResolutionCodeBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.addResolutionCode).getAttribute("disabled") == "true";
    }

    async getComapanyValue(): Promise<string> {
        return await $(this.selectors.companyValue).getText();
    }

}

export default new EditFlowsetPage();