import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../../utils/util.grid';
import utilCommon from '../../../utils/util.common';

class NotificationTemplateGridPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        copyTemplate: '[rx-view-component-id="d4a5bf08-5793-487f-af3a-7f77ead94c9a"] .d-button_link',
        searchButton: '.d-icon-search',
        selectTemplateCheckBox: '.ui-grid-icon-ok',
        copyTemplateWindow: '.modal-title',
        companyDropDownCopyTempWindow: ".modal-content [title='Company']",
        companyDropDownValueCopyTempWindow: ".modal-content .ui-select-choices-row-inner *",
        clearCompanyDropDownCopyTempWindow: ".modal-content [class*=glyphicon-remove]",
        tempNameCopyTempWindow: ".modal-content [class*='d-textfield__input field']",
        saveButton: "[rx-view-component-id='50e25982-5452-4f20-ac79-5682de7cb467'] button",
        createNotificationTemplate: "[rx-view-component-id='750e4190-378a-4f76-b7a7-1b37e0baa5e0'] button",
        searchBox: "[rx-view-component-id='adabdd0a-24fb-4d75-a265-ce0d72aeccb1'] [rx-id='search-text-input']",
        guid: 'adabdd0a-24fb-4d75-a265-ce0d72aeccb1',
        deleteButton: '[rx-view-component-id="5dffa163-d72d-4af5-9751-76252d6cd21a"] button'
    }

    async isCopyTemplateButtonDisabled(): Promise<boolean> {
        return await $(this.selectors.copyTemplate).getAttribute("disabled") == "true";
    }

    async selectTemplate() {
        await $$(this.selectors.selectTemplateCheckBox).first().click();
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
        await $(this.selectors.companyDropDownCopyTempWindow).$('input').sendKeys(company);
        await $$(this.selectors.companyDropDownValueCopyTempWindow).first().click();
    }

    async clearCompanyDropDownValPresentInCopyTempWindow() {
        await $(this.selectors.clearCompanyDropDownCopyTempWindow).click();
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

    async isCopyTemplateButtonDisabledInCopyTempWindow(): Promise<Boolean> {
        return await element(by.buttonText('Create Copy')).getAttribute("disabled") == "true";
    }

    async clickCopyTemplateButtonInCopyTempWindow() {
        element(by.buttonText('Create Copy')).click();
        await $(this.selectors.saveButton).click();
    }

    async addGridColumns(columns: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.guid, columns);
    }

    async removeGridColumns(columns: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.guid, columns);
    }

    async areColumnHeaderMatches(columns: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.guid, columns);
    }

    async deleteTemplate(): Promise<void> {
        await $(this.selectors.deleteButton).click();
        await utilCommon.clickOnWarningOk();
    }

    async isGridColumnSorted(columnName: string ): Promise<boolean> {
        return await utilGrid.isGridColumnSorted(columnName, 'ascending', this.selectors.guid);
    }

    async clickCopyTmplate() {
        await $(this.selectors.copyTemplate).click();
    }

    async getValueOnAssignmentConfigGrid(columnName: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.guid, columnName);
    }
    
    async isAddNotificationTemplateBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.createNotificationTemplate).isPresent();
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