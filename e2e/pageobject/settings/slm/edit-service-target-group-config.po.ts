import { $, $$, element, by } from "protractor";

class BusinessTimeSegmentConfigEditPage {

    selectors = {
        svtGroupName: 'input[ng-model*="groupName"]',
        svtSelect: '.slm-group__list i',
        saveButton: 'button[ng-click*="submitForm"]',
        closeButton: '.slm-modal-footer button',
        selectAvailabelServiceTargetIcon: '.slm-group-list-item__icon-container i',
        serviceTargetInGroup: '.slm-group-list-item__description'
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