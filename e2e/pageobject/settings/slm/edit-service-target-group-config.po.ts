import { $, $$, element, by } from "protractor";

class BusinessTimeSegmentConfigEditPage {

    selectors = {
        svtGroupName: '[rx-view-component-id="f18247b4-ddb0-4292-ab09-2c4cd2e928d0"] input',
        svtSelect: '[rx-view-component-id="76fd6f88-70a6-4867-bc8e-7cf91f77426b"] input',
        saveButton: '[rx-view-component-id="e78f6759-c6c6-4063-be91-f39ed3640f5d"] button',
        closeButton: '[rx-view-component-id="27e9bed8-8fbf-416e-bd94-a399f4b9ec18"] button',
        selectAvailabelServiceTargetIcon: '[rx-view-component-id="76fd6f88-70a6-4867-bc8e-7cf91f77426b"] button',
        serviceTargetInGroup: '[rx-view-component-id="76fd6f88-70a6-4867-bc8e-7cf91f77426b"] .checkbox__item'
    }

    async isSVTGroupNameEnabled(): Promise<boolean> {
        return await $(this.selectors.svtGroupName).isEnabled();
    }

    async selectAvailableServiceTarget(serviceTarget: string): Promise<void> {
        await $(this.selectors.selectAvailabelServiceTargetIcon).click();
    }

    async getServiceTargetInGroup(): Promise<string> {
       return await $(this.selectors.serviceTargetInGroup).getText();
    }

    async isSVTSelectRadioBtnDisabled(): Promise<boolean> {
        return await $$(this.selectors.svtSelect).first().getAttribute('disabled') == 'true';
    }

    async isSaveBtnEnabled(): Promise<boolean> {
        return await $$(this.selectors.saveButton).first().isEnabled();
    }

    async clickClose(): Promise<void> {
        await $$(this.selectors.closeButton).last().click();
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).first().click();
    }

}

export default new BusinessTimeSegmentConfigEditPage();