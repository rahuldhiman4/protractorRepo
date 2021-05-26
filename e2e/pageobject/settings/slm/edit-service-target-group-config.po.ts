import { $, $$, element, by } from "protractor";

class BusinessTimeSegmentConfigEditPage {

    selectors = {
        svtGroupName: '[rx-view-component-id="ec6c5279-a6da-4777-b1eb-2b9cf191d1ee"] input',
        svtSelect: '[rx-view-component-id="f872bc67-2370-4538-871c-5d228b9dd9aa"] button',
        saveButton: '[rx-view-component-id="aa1df32c-323b-4a6d-a34d-7503d23d346b"] button',
        cancelButton: '[rx-view-component-id="59cb600c-a580-4b25-b50a-02da50e79fbf"] button',
        selectAvailabelServiceTargetIcon: '[rx-view-component-id="f872bc67-2370-4538-871c-5d228b9dd9aa"] div.checkbox',
        serviceTargetInGroup: '[rx-view-component-id="76fd6f88-70a6-4867-bc8e-7cf91f77426b"] .checkbox__item'
    }

    async isSVTGroupNameDisabled(): Promise<boolean> {
        return await $(this.selectors.svtGroupName).getAttribute('readonly') == 'true';
    }

    async selectAvailableServiceTarget(serviceTarget: string): Promise<void> {
        await $(this.selectors.selectAvailabelServiceTargetIcon).click();
    }

    async getServiceTargetInGroup(): Promise<string> {
       return await $(this.selectors.serviceTargetInGroup).getText();
    }

    async isSVTSelectRadioBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.svtSelect).getAttribute('disabled') == 'true';
    }

    async isSaveBtnEnabled(): Promise<boolean> {
        return await $$(this.selectors.saveButton).first().isEnabled();
    }

    async clickcancel(): Promise<void> {
        await $$(this.selectors.cancelButton).last().click();
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).first().click();
    }

}

export default new BusinessTimeSegmentConfigEditPage();