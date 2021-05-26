import { $, browser, protractor, ProtractorExpectedConditions, ElementFinder } from "protractor";
import utilityCommon from '../../../utils/utility.common';
class AutomatedStatusTransitionConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editName: '[rx-view-component-id="268f80d9-bafd-4eb0-af14-6f840f15fa17"] input',
        saveButton: '[rx-view-component-id="ad37ab48-7323-4dd3-b878-2a848311fa57"] button',
        cancelButton: '[rx-view-component-id="4a9c6994-7143-4cb9-9d77-e0382cc01491"] button',
        toStatus: '[rx-view-component-id="18a875d9-0e3a-42ac-8085-5c2f1aec04c8"] .dropdown-toggle',
        fromStatus: '[rx-view-component-id="6218d0e9-8755-4a5a-8a50-6c6e4b1ebfd3"] .dropdown-toggle',
        flowset: '[rx-view-component-id="9e76dbfc-8005-4b5a-a9b9-6820cf79fa65"] .dropdown-toggle',
        fromStatusReason: '[rx-view-component-id="8b38b3d9-8cd2-4bb1-ac94-a42f76de75ad"] .dropdown-toggle',
        toStatusReason: '[rx-view-component-id="686f9161-6776-4426-a8f8-1ad05bc7eaac"] .dropdown-toggle',
        changeDaysAfter: '[rx-view-component-id="81484296-7ca4-41b4-bd62-e233986b24fc"] .form-control',
        categoryTier1: '[rx-view-component-id="e78322fc-5c16-4699-920e-d0af369f1719"] .dropdown-toggle',
        categoryTier2: '[rx-view-component-id="bfa271cf-ba9b-48c3-9af3-eaa01e416d53"] .dropdown-toggle',
        categoryTier3: '[rx-view-component-id="518f4331-cb1b-4e4c-8bef-7bf235ad9a8a"] .dropdown-toggle',
        categoryTier4: '[rx-view-component-id="bdcc44f0-2f65-472f-85b5-8b64cbc3ff7f"] .dropdown-toggle',
        enableToggleGuid: '2309d963-493b-41b2-8ace-89a9d64281ca',
        lineofbusinessValue: '[rx-view-component-id="f49ae3e3-d357-4f09-9123-58bcaf46b808"] input.d-textfield__input',
        lobValue: '[rx-view-component-id="f49ae3e3-d357-4f09-9123-58bcaf46b808"] .pull-left'
    } 

    async isAutomatedStatusTransitionNameEnabled(): Promise<boolean> {
        let nameElement: ElementFinder = await $(this.selectors.editName);
        //        await browser.wait(this.EC.visibilityOf(nameElement));
        return await nameElement.getAttribute('readonly') == 'true' ? false : true;
    }

    async isAutomatedStatusTransitionSaveBtnEnabled(): Promise<boolean> {
        let saveButton = await $(this.selectors.saveButton);
        //        await browser.wait(this.EC.visibilityOf(saveButton));
        return await saveButton.isEnabled();
    }

    async clickCancel(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async isToStatusFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.toStatus).isEnabled();
    }

    async isToStatusReasonFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.toStatusReason).isEnabled();
    }

    async isFromStatusReasonFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.fromStatusReason).isEnabled();
    }

    async isFromStatusFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.fromStatus).isEnabled();
    }

    async isNumberOfDaysFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.changeDaysAfter).isEnabled();
    }

    async isFlowsetFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.flowset).isEnabled();
    }

    async isCategoryTier1FieldEnabled(): Promise<boolean> {
        return await $(this.selectors.categoryTier1).isEnabled();
    }

    async isCategoryTier2FieldEnabled(): Promise<boolean> {
        return await $(this.selectors.categoryTier2).isEnabled();
    }

    async isCategoryTier3FieldEnabled(): Promise<boolean> {
        return await $(this.selectors.categoryTier3).isEnabled();
    }

    async isCategoryTier4FieldEnabled(): Promise<boolean> {
        return await $(this.selectors.categoryTier4).isEnabled();
    }


    async saveConfiguration(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async selectEnableToggle(enableStatus: boolean): Promise<void> {
        await utilityCommon.selectToggleButton(this.selectors.enableToggleGuid, enableStatus);
    }

    async updateConfigurationName(configName:string): Promise<void> {
        await $(this.selectors.editName).clear();
        await $(this.selectors.editName).sendKeys(configName);
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new AutomatedStatusTransitionConfigEditPage();