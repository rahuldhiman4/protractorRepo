import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
import { DropDownType } from '../../../utils/constants';
import utilityCommon from '../../../utils/utility.common';

class CreateDataSourceConfigurationPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        dataSourceHeading: 'fieldset[role="document"] .dp-header span',
        fieldNameLabel: '[rx-view-definition-guid="f957c4e9-b20b-4a04-a69c-7f7b2efa9d95"] .form-control-label span',
        displayNameInputField: '[rx-view-component-id="80a8ade0-5e29-4d4f-b0e2-7d301b1b5c30"] input[placeholder="Enter Display Name"]',
        showAdvancedSettingsLink: '[rx-view-component-id="80a8ade0-5e29-4d4f-b0e2-7d301b1b5c30"] button[aria-label="Show Advanced Settings"]',
        saveButton: '[rx-view-component-id="fde65b3a-a200-4ca8-921e-12959a970c3e"] button',
        closeButton: '[rx-view-component-id="640ba779-7dfb-4843-b0f0-4b05c89d166b"] button',
        fieldValues: ".form-control-label span",
        useEndTimeCheckbox: `//span[contains(@class,'form-control-label')]//span[1]//ancestor::div[contains(@class,"row")]//input[@type="checkbox"]`,
        regularExpSaveButton: '.modal-footer .btn-primary',
        dropdownBox: 'div.form-group div.dropdown button',
        dropDownInput: 'input.adapt-rx-search__input',
        dropDownOption: 'button div.rx-select__option-content',
        selectDropdown: '[rx-view-component-id="80a8ade0-5e29-4d4f-b0e2-7d301b1b5c30"] .dropdown .btn-secondary'
    }

    async getAddDataSourceConfigurationHeading(): Promise<string> {
        return await $(this.selectors.dataSourceHeading).getText();
    }

    async isDataSourceFieldRequired(fieldName: string): Promise<boolean> {
        let fieldLocator:ElementFinder = undefined;
        let locator = await $$('[rx-view-component-id="80a8ade0-5e29-4d4f-b0e2-7d301b1b5c30"] .form-control-label .form-control-required');
        switch (fieldName) {
            case "Display Name": {
                fieldLocator = locator[0];
                break;
            }
            case "Application Name": {
                fieldLocator = locator[1];
                break;
            }
            case "Record Definition Name": {
                fieldLocator = locator[2];
                break;
            }
            case "Company Field": {
                fieldLocator = locator[3];
                break;
            }
            default: {
                console.log(fieldName, ' is not a valid parameter');
                return false;
            }
        }
        return await utilityCommon.isRequiredTagPresent(fieldLocator, 'hello');
}

    async selectDataSourceFieldOption(fieldName: string, fieldOption: string): Promise<void> {
        let fieldLocator:ElementFinder = undefined;
        let locator = await $$('[rx-view-component-id="80a8ade0-5e29-4d4f-b0e2-7d301b1b5c30"] .dropdown .btn-secondary');
        switch (fieldName) {
            case "Application Name": {
                fieldLocator = locator[0];
                break;
            }
            case "Record Definition Name": {
                fieldLocator = locator[1];
                break;
            }
            case "Company Field": {
                fieldLocator = locator[2];
                break;
            }
            case "Association Name": {
                fieldLocator = locator[3];
                break;
            }
            case "Create Qualification View": {
                fieldLocator = locator[4];
                break;
            }
            case "Edit Qualification View": {
                fieldLocator = locator[5];
                break;
            }
            case "Assigned Group": {
                fieldLocator = locator[6];
                break;
            }
            case "Dynamic Business Entity": {
                fieldLocator = locator[7];
                break;
            }
            case "Dynamic Start Time Field": {
                fieldLocator = locator[8];
                break;
            }
            case "Dynamic End Time Field": {
                fieldLocator = locator[9];
                break;
            }
            case "Dynamic Goal Time Field": {
                fieldLocator = locator[10];
                break;
            }
            case "Category Field": {
                fieldLocator = locator[11];
                break;
            }
            default: {
                console.log(fieldName, ' is not a valid parameter');
                break;
            }
        }
        await utilityCommon.selectDropDown(fieldLocator, fieldOption, DropDownType.WebElement);
    }

    async clickDataSourceLink(dataSourceLink: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.showAdvancedSettingsLink, dataSourceLink)).click();
    }

    async setDataSourceDisplayName(dataSourceDisplayName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.displayNameInputField)), 4000);
        await $(this.selectors.displayNameInputField).clear();
        await $(this.selectors.displayNameInputField).sendKeys(dataSourceDisplayName);
    }

    async isSaveBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.closeButton).click();
    }

    async isDatSourceAdvancedFieldsDisabled(fieldName: string): Promise<boolean> {
        let fldsCount = await $$('.form-group').count();
        for (let i = 0; i < fldsCount; i++) {
            let label = await $$('.form-group').get(i).$(".form-control-label").getText();
            if (await  label == fieldName) {
                return await $$('.form-group').get(i).$("[placeholder]").getAttribute("aria-disabled") ? true : false;
            }
        }
    }

    async clickUseEndTimeCheckbox(): Promise<void> {
        await $(this.selectors.useEndTimeCheckbox).click();
    }

    async clickRegularExpressionSaveButton(): Promise<void> {
        await $(this.selectors.regularExpSaveButton).click();
    }

    async isDataSourceDropDownOptionsMatches(fieldName: string, dropdownOptions: string[], fieldValue: string): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(fieldName, dropdownOptions, DropDownType.Label, fieldValue);//no relevance found
    }

    async isUseEndTimeCheckboxAlreadySelected(): Promise<boolean> {
        return await $(this.selectors.useEndTimeCheckbox).getAttribute("checked") == "true" ? true : false;
    }

}

export default new CreateDataSourceConfigurationPage();