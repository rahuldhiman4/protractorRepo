import { $, browser, by, element, protractor, ProtractorExpectedConditions, $$ } from "protractor";

class ApplicationConfiguration {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        applicationConfiguration: 'ul[class="list-unstyled"] span',
        selectConfigurationDropDownArrow: 'span[class="arrow-icon d-icon-right-angle_down"]',
        configurationDefaultValue: '[class="d-textfield_required d-textfield"] input',
        addConfigurationValueButton: '[class="col-md-8"] span[class="d-icon-left-plus_circle"]',
        configurationValueText: '.form-group input',
        companyDropDown: '.btn-secondary',
        companyDropdownList: 'button.dropdown-item',
        saveButton: 'div[class="float-right"] button[btn-type="primary"]',
        cancelButton: 'div[class="float-right"] button[btn-type="secondary"]',
        removeButton: '.d-icon-left-cross',
        columnValue: '[class="card-title rx-ellipsis"]',
        configurationHeaderValue: 'div[class="col-md-8"] div[class="header"]',
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