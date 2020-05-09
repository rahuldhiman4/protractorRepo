import { $, protractor, ProtractorExpectedConditions, $$, element, by, browser } from "protractor";
class EditNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        cancelButton: '[rx-view-component-id="2a50e7b7-b260-4749-ad9d-1d7cb65b5d95"] button',
        header: '.modal-title',
        saveButton: '[rx-view-component-id="50e25982-5452-4f20-ac79-5682de7cb467"] button',
        clickOnEmailTab: 'li.rx-tab a',
        editButtonOnEmailTab:'[rx-view-component-id="0306ec1b-e16e-416d-952d-b39c3a8336f0"] button',
        selectCheckBoxEmailTab:'[rx-view-component-id="66f56078-f1e0-4946-a41c-f0624ba3b4a8"] .ui-grid-selection-row-header-buttons',
        selectAlertSubjectCheckbox: '[rx-view-component-id="2c84ca97-2ff6-4325-ae14-3f2ed0c556ac"] .ui-grid-selection-row-header-buttons',
        editCheckbox: 'button.d-icon-left-pencil',
        clickableField: 'div.cke_contents.cke_reset span',
        cancelAlertMessageTextButton: '[rx-view-component-id="780514cc-7344-44a5-88af-5af509619ab0"] button'
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

    async openAlertEditMessageText(): Promise<void>{
        await $(this.selectors.selectAlertSubjectCheckbox).click();
        await $$(this.selectors.editCheckbox).first().click();
    }

    async isFieldClickable(fieldName: string): Promise<boolean>{
        let fieldLocator = await element(by.cssContainingText(this.selectors.clickableField, fieldName));
        let attributeValue: string = undefined;
        await browser.wait(this.EC.visibilityOf(fieldLocator), 10000).then(async () => {
            attributeValue = await fieldLocator.getAttribute('class');
        });
        return attributeValue == 'clickable_class';
    }

    async cancelAlertMessageText(): Promise<void>{
        await $(this.selectors.cancelAlertMessageTextButton).click();
    }

    async openEmailBodyEditMessageText(): Promise<void>{
        await this.selectCheckBoxOfBody();
        await $$(this.selectors.editCheckbox).last().click();
    }
}
export default new EditNotificationTemplate();