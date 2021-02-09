import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../../utils/utility.grid';
import utilityCommon from '../../../utils/utility.common';

class NotificationTemplateGridPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        copyTemplate: '[rx-view-component-id="d4a5bf08-5793-487f-af3a-7f77ead94c9a"] button',
        searchButton: '[btn-type="secondary"] .d-icon-search',
        selectTemplateCheckBox: 'input[type="radio"]',
        copyTemplateWindow: '.modal-title',
        companyGuid:"34d9572a-6eb0-41e0-8a1b-e51ea397dfc3",
        companyDropDownCopyTempWindow: '[rx-view-component-id="34d9572a-6eb0-41e0-8a1b-e51ea397dfc3"] button',
        companyDropDownValueCopyTempWindow: '[rx-view-component-id="34d9572a-6eb0-41e0-8a1b-e51ea397dfc3"] .dropdown-item',
        clearCompanyDropDownCopyTempWindow: '[role="listbox"] .d-icon-search',
        tempNameCopyTempWindow: '[rx-view-component-id="d56917a7-af1d-4eb2-94b7-3a2d6604bc3e"] input',
        createNotificationTemplate: "[rx-view-component-id='750e4190-378a-4f76-b7a7-1b37e0baa5e0'] button",
        searchBox: '[rx-view-component-id="adabdd0a-24fb-4d75-a265-ce0d72aeccb1"] input[type="search"]',
        guid: 'adabdd0a-24fb-4d75-a265-ce0d72aeccb1',
        deleteButton: '[rx-view-component-id="adabdd0a-24fb-4d75-a265-ce0d72aeccb1"] .d-icon-left-cross',
        notificationTemplateChk:'[rx-view-component-id="adabdd0a-24fb-4d75-a265-ce0d72aeccb1"] input[type="radio"]',
        createCopyBtn: '[rx-view-component-id="e40bc7e7-74c7-4cbd-9bff-207d176543b7"] button'
    }

    async isCopyTemplateButtonDisabled(): Promise<boolean> {
        return await $(this.selectors.copyTemplate).getAttribute("disabled") == "true";
    }

    async selectTemplate() {
        await $$(this.selectors.notificationTemplateChk).first().click();
    }

    async clickCopyTemplate() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.copyTemplate)), 3000);
        await $(this.selectors.copyTemplate).click();
    }

    async getTitleCopyNotificationTemplateWindow(): Promise<String> {
        return $(this.selectors.copyTemplateWindow).getText();
    }

    async isCompanyDropDownPresentInCopyTempWindow(): Promise<Boolean> {
        return await $(this.selectors.companyDropDownCopyTempWindow).isDisplayed();
    }

    async setCompanyDropDownValPresentInCopyTempWindow(company: string) {
        await $(this.selectors.companyDropDownCopyTempWindow).click();
        await $('.d-icon-search .form-control').sendKeys(company);
        await $$(this.selectors.companyDropDownValueCopyTempWindow).get(1).click();
    }

    async clearCompanyDropDownValPresentInCopyTempWindow() {
        await $(this.selectors.companyDropDownCopyTempWindow).click();
        await $$(this.selectors.companyDropDownValueCopyTempWindow).get(1).click();
    }

    async clickOnCreateNotificationTemplate(): Promise<void> {
        await $(this.selectors.createNotificationTemplate).click();
    }

    async isTemplateNameTxtBoxPresentInCopyTempWindow(): Promise<Boolean> {
        return await $(this.selectors.tempNameCopyTempWindow).isDisplayed();
    }

    async setTemplateNamePresentInCopyTempWindow(tempName: string) {
        await $(this.selectors.tempNameCopyTempWindow).clear();
        await $(this.selectors.tempNameCopyTempWindow).sendKeys(tempName);
    }

    async clearTemplateNamePresentInCopyTempWindow() {
        await $(this.selectors.tempNameCopyTempWindow).clear();
    }

    async isCopyTemplateButtonDisabledInCopyTempWindow(): Promise<Boolean> {
        return await element(by.buttonText('Create Copy')).getAttribute("disabled") == "true";
    }

    async clickCopyTemplateButtonInCopyTempWindow() {
        await $(this.selectors.createCopyBtn).click();
    }

    async addGridColumns(columns: string[]): Promise<void> {
        await utilityGrid.addGridColumn(columns,this.selectors.guid);
    }

    async removeGridColumns(columns: string[]): Promise<void> {
        await utilityGrid.removeGridColumn( columns,this.selectors.guid);
    }

    async areColumnHeaderMatches(columns: string[]): Promise<boolean> {
        return await utilityGrid.areColumnHeaderMatches(columns,this.selectors.guid);
    }

    async deleteTemplate(): Promise<void> {
        await $(this.selectors.deleteButton).click();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
    }

    async isGridColumnSorted(columnName: string ): Promise<boolean> {
        return await utilityGrid.isGridColumnSorted(columnName, 'ascending', this.selectors.guid);
    }

    async clickCopyTmplate() {
        await $(this.selectors.copyTemplate).click();
    }

    async getValueOnAssignmentConfigGrid(columnName: string): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue(columnName,this.selectors.guid);
    }
    
    async isAddNotificationTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.createNotificationTemplate).isPresent();
    }

    async isAddNotificationTemplateBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.createNotificationTemplate).isEnabled();
    }

    async isDeleteNotificationTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.deleteButton).isPresent();
    }

    async searchTemplate(tempName: string) {
        await $(this.selectors.searchBox).clear();
        await $(this.selectors.searchBox).sendKeys(tempName);
        await $(this.selectors.searchButton).click();
    }

    async clickAndOpenTemplate(tempName: string) {
        await element(by.cssContainingText("a[class='ui-grid__link']", tempName)).click();
    }

}

export default new NotificationTemplateGridPage();