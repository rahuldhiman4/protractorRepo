import { $, $$ } from "protractor";

class BusinessTimeSegmentConfigEditPage {

    selectors = {
        svtGroupName: 'input[ng-model*="groupName"]',
        svtSelect: '.slm-group__list i',
        saveButton: 'button[ng-click*="submitForm"]',
        closeButton: '.slm-modal-footer button'
    }

    async isSVTGroupNameEnabled(): Promise<boolean> {
        return await $(this.selectors.svtGroupName).isEnabled();
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

}

export default new BusinessTimeSegmentConfigEditPage();