import { $, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import { DropDownType } from '../../../utils/constants';
import utilityCommon from '../../../utils/utility.common';

class ApplicationConfiguration {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        applicationConfigurationLink: 'a.no-href-link',
        selectConfigurationDropDownArrow: 'span[class="arrow-icon d-icon-right-angle_down"]',
        configurationDefaultValue: '[class="d-textfield_required d-textfield"] input',
        addConfigurationValueButton: '[class="col-md-8"] span[class="d-icon-left-plus_circle"]',
        configurationValueText: '.form-group input',
        saveButton: 'div[class="float-right"] button[btn-type="primary"]',
        cancelButton: 'div[class="float-right"] button[btn-type="secondary"]',
        removeButton: '.d-icon-left-cross',
        columnValue: '[class="card-title rx-ellipsis"]',
        configurationHeaderValue: 'div[class="col-md-8"] div[class="header"]',
        companyDropDown: '[rx-view-component-id="31c2f4cd-d23a-434c-843d-cabe10afa08b"] button',
    }

    async isCompanyListMatches(companyList: string[]): Promise<void> {
        let companyDDElement = await $(this.selectors.companyDropDown);
        await utilityCommon.isAllDropDownValuesMatches(companyDDElement, companyList, DropDownType.WebElement);
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

    async selectCompany(companyValue: string): Promise<void> {
        let companyDDElement = await $(this.selectors.companyDropDown);
        await utilityCommon.selectDropDown(companyDDElement, companyValue, DropDownType.WebElement);
    }

    async clickApplicationConfiguration(value: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.applicationConfigurationLink, value)).click();
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