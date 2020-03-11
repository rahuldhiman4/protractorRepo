import { $, protractor, ProtractorExpectedConditions, $$ } from "protractor";
class EditNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        cancelButton: '[rx-view-component-id="2a50e7b7-b260-4749-ad9d-1d7cb65b5d95"] button',
        header: '.modal-title',
        saveButton: '[rx-view-component-id="50e25982-5452-4f20-ac79-5682de7cb467"] button',
        clickOnEmailTab: 'li.rx-tab a',
        editButtonOnEmailTab:'[rx-view-component-id="0306ec1b-e16e-416d-952d-b39c3a8336f0"] button',
        selectCheckBoxEmailTab:'[rx-view-component-id="66f56078-f1e0-4946-a41c-f0624ba3b4a8"] .ui-grid-selection-row-header-buttons',
      
    }

    async selectCheckBoxOfBody():Promise<void>{
        await $$(this.selectors.selectCheckBoxEmailTab).get(1).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async getHeaderText(): Promise<string> {
        return await $(this.selectors.header).getText();
    }

    async clickOnEmailTab():Promise<void>{
         await $(this.selectors.clickOnEmailTab).click();
    }

    async clickOnEditButtonOfEmailTab():Promise<void>{
        await $(this.selectors.editButtonOnEmailTab).click();
    }
}
export default new EditNotificationTemplate();