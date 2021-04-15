import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import utilityGrid from '../../../utils/utility.grid';

class EditFlowsetPage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        processExecutionTypeGuid: '275b58b7-85e0-4d56-9d39-215f3551d471',
        functionGuid: '37ec6a5a-d6ba-4825-ab89-6fa4175c0751',
        processnameGuid: 'e2da86d2-692a-4f0a-8278-8989b27aa9e5',
        processMappingSaveBtn: '[rx-view-component-id="106495e9-95f6-4d94-b9c8-f71c5a76f09d"] button',
        editProcessMappingSaveBtn: '[rx-view-component-id="0d0e544e-e9e4-4854-ae72-6599a7ae38cd"] button',
        flowsetName: '[rx-view-component-id="4304c07c-602a-4a07-b05b-0406aa6747be"] input',
        descriptionField: '[rx-view-component-id="a825a900-6197-430c-ae9e-197291a6ff01"] textarea',
        processStatusGuid: 'b48823c7-8eb0-4b30-bd9a-b44e53fcc195',
        status: '[rx-view-component-id="046e725c-0b9a-440d-9c96-77a730cf23f3"] button',
        addAssociateCategoryBtn: '[rx-view-component-id="88810c80-2be6-4052-bd3c-40dbc782f046"] button',
        saveButton: '[rx-view-component-id="ec655846-3db8-4072-beef-2dab6438e0e3"] button',
        addNewMapping: '[rx-view-component-id="1d59b685-ac65-4ac6-a39b-268596c8ae9c"] button',
        companyValue: '[rx-view-component-id="2303bffc-b2c5-4cd2-a55a-bac22b61d516"] button',
        processMappingConsoleGuid: '0e25a330-f284-4892-9777-84ae2a5583ff',
        selectProcessNameDropDown: '[rx-view-component-id="af88dc8f-11a0-4172-bff1-3ef81f96e252"] button',
        dropDownOption: '[rx-view-component-id="e2da86d2-692a-4f0a-8278-8989b27aa9e5"] [ class="dropdown-item ng-tns-c137-73 ng-star-inserted"]',
        cancelFlowsetBtn: '[rx-view-component-id="e65c4830-eb0f-4080-a56b-82d635272ac1"] button'
    }

    async isFlowsetNameDisabled(): Promise<boolean> {
        return await $(this.selectors.flowsetName).getAttribute("readonly") == "true";
    }

    async setFlowset(flowset: string): Promise<void> {
        await $(this.selectors.flowsetName).clear();
        await $(this.selectors.flowsetName).sendKeys(flowset);
    }

    async setDescription(description: string): Promise<void> {
        await $(this.selectors.descriptionField).clear();
        await $(this.selectors.descriptionField).sendKeys(description);
    }

    async selectFlowsetConfigStatus(status: string): Promise<void> {
        await utilityCommon.selectDropDown('046e725c-0b9a-440d-9c96-77a730cf23f3', status);
    }

    async selectProcessMapingStatus(status: string): Promise<void> {
        await utilityCommon.selectDropDown('b48823c7-8eb0-4b30-bd9a-b44e53fcc195', status);
    }

    async selectProcessStatus(status: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.processStatusGuid, status);
    }

    async selectProcessExecutionType(process: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.processExecutionTypeGuid, process);
    }

    async selectFunction(functionName: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.functionGuid, functionName);
    }

    async getStatusvalue(): Promise<string> {
        return await $(this.selectors.status).getText();
    }

    async isStatusFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.status).getAttribute("aria-disabled") == "true";
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

    async isProcessPresentOnGrid(processMappingName: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(processMappingName, this.selectors.processMappingConsoleGuid);
    }

    async searchAndOpenProcessMapping(processMappingName: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(processMappingName, this.selectors.processMappingConsoleGuid);
    }

    async isAddNewMappingBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.addNewMapping).getAttribute("disabled") == "true";
    }

    async isProcessExecutionTypePresent(processType: string): Promise<boolean> {
        return (await utilityGrid.getFirstGridRecordColumnValue("Process Execution Type", this.selectors.processMappingConsoleGuid)) == processType;
    }

    async clickOnAddNewMappingBtn(): Promise<void> {
        await $(this.selectors.addNewMapping).click();
    }

    async getComapanyValue(): Promise<string> {
        return await $(this.selectors.companyValue).getText();
    }

    async selectProcess(processName: string): Promise<void> {
        await $(this.selectors.selectProcessNameDropDown).click();
        await utilityCommon.searchAndSelectProcessInSelectProcessPopup(processName);
    }

    async isProcessPresent(processName: string): Promise<boolean> {
        await $(this.selectors.selectProcessNameDropDown).click();
        let isPresent = await utilityCommon.isProcessPresentInSelectProcessPopup(processName);
        await $(this.selectors.selectProcessNameDropDown).click();
        return isPresent;
    }

    async clickCancelFlowsetBtn(): Promise<void> {
        await $(this.selectors.cancelFlowsetBtn).click();
    }

}

export default new EditFlowsetPage();