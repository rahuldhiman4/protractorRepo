import { $, browser, by, element, protractor, ProtractorExpectedConditions, $$ } from "protractor";

class ApplicationConfiguration {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        applicationConfiguration: '.column-pill-text',
        selectConfigurationDropDownArrow: '.arrow-pointer',
        configurationDefaultValue: '[class="d-textfield_required d-textfield"] input',
        addConfigurationValueButton: '.configuration-values-list-wrapper .d-icon-left-plus_circle',
        configurationValueText: '[class="d-textfield_required d-textfield"] input',
        companyDropDown: '.ui-select-match span',
        companyDropdownList: '.ui-select-choices-row-inner',
        saveButton: '[class="rx-record-grid-column-editor-action-buttons"] .ac-button-save',
        cancelButton: '[class="rx-record-grid-column-editor-action-buttons"] .ac-button-cancel',
        removeButton: '.ac-text-remove',
        columnValue: '[class="column-name"]',
        configurationHeaderValue: '.rx-record-grid-column-editor-data-header .cv-heading-wrapper',
    }

    async setConfigurationValueText(value: string): Promise<void> {
        await $(this.selectors.configurationValueText).sendKeys(value);
    }

    async getColoumnValue(): Promise<string> {
        return await $(this.selectors.columnValue).getText();
    }

    async getconfigurationHeaderValue(): Promise<string> {
        return await $(this.selectors.configurationHeaderValue).getText();
    }

    async selectCompany(value: string): Promise<void> {
        await $(this.selectors.companyDropDown).click();
        await element(by.cssContainingText(this.selectors.companyDropdownList, value)).click();
    }

    async clickApplicationConfiguration(value: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.applicationConfiguration, value)).click();
    }

    async clickConfigurationDropDownArrow(): Promise<void> {
        await $(this.selectors.selectConfigurationDropDownArrow).click();
    }

    async clickAddConfigurationValue(): Promise<void> {
        await $(this.selectors.addConfigurationValueButton).click();
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async clickRemoveButton(): Promise<void> {
        await $(this.selectors.removeButton).click();
    }

    async getConfigurationDefaultValue(): Promise<string> {
        return await $(this.selectors.configurationDefaultValue).getText();
    }

    async isConfigValuesDisplayed(configName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.columnValue, configName)).isPresent().then(async (ele) => {
            if (ele) {
                return await element(by.cssContainingText(this.selectors.columnValue, configName)).isDisplayed();
            } else return false;
        });
    }
}

export default new ApplicationConfiguration();