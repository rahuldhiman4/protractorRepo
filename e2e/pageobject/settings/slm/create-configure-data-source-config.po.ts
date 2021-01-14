import { $$, $, browser, protractor, ProtractorExpectedConditions, element, by } from "protractor";
import utilCommon from '../../../utils/util.common';

class CreateDataSourceConfigurationPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        dataSourceHeading: 'fieldset[role="document"] .dp-header span',
        fieldNameLabel: '[rx-view-definition-guid="f957c4e9-b20b-4a04-a69c-7f7b2efa9d95"] .form-control-label span',
        displayNameInputField: '[rx-view-component-id="80a8ade0-5e29-4d4f-b0e2-7d301b1b5c30"] input[placeholder="Enter Display Name"]',
        showAdvancedSettingsLink: '[rx-view-component-id="80a8ade0-5e29-4d4f-b0e2-7d301b1b5c30"] button[aria-label="Show Advanced Settings"]',
        saveButton: '[rx-view-component-id="fde65b3a-a200-4ca8-921e-12959a970c3e"] button',
        closeButton: '[rx-view-component-id="640ba779-7dfb-4843-b0f0-4b05c89d166b"] button',
        fieldValues: `//*[contains(@class,'form-control-label')]//span[1]`,
        useEndTimeCheckbox: `//span[contains(@class,'form-control-label')]//span[1]//ancestor::div[contains(@class,"row")]//input[@type="checkbox"]`,
        regularExpSaveButton: '.modal-footer .btn-primary',
        dropdownBox: 'div.form-group div.dropdown button',
        dropDownInput: 'input.adapt-rx-search__input',
        dropDownOption: 'button div.rx-select__option-content',
    }

    async getAddDataSourceConfigurationHeading(): Promise<string> {
        return await $(this.selectors.dataSourceHeading).getText();
    }

    async isDataSourceFieldRequired(fieldName: string): Promise<boolean> {
        let fieldNameRequiredTag = await element(by.cssContainingText(this.selectors.fieldNameLabel, fieldName));
        return await utilCommon.isRequiredTagToFieldElement(fieldNameRequiredTag);
    }

    async selectDataSourceFieldOption(fieldName: string, fieldOption: string): Promise<void> {
        await utilCommon.selectDropDownWithName(fieldName, fieldOption);
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
        let fldsCount = await element(by.xpath(this.selectors.fieldValues)).count();
        for (let i = 0; i < fldsCount; i++) {
            let elem = await $$(this.selectors.fieldValues).get(i);
            if (await elem.getAttribute("disabled") == fieldName) {
                return await elem.getAttribute("disabled") ? true : false;
            }
        }
    }

    async isDatSourceFieldDisabled(fieldName: string): Promise<boolean> {
        let fldsCount = await element(by.xpath(this.selectors.fieldValues)).count();
        for (let i = 0; i < fldsCount; i++) {
            let elem = await $$(this.selectors.fieldValues).get(i);
            if (await elem.getAttribute("disabled") == fieldName) {
                return await elem.getAttribute("disabled") ? true : false;
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
        return await utilCommon.isDropDownOptionsMatches(fieldName, dropdownOptions, fieldValue);
    }

    async isUseEndTimeCheckboxAlreadySelected(): Promise<boolean> {
        return await $(this.selectors.useEndTimeCheckbox).getAttribute("checked")  == "true" ? true : false;
      }  

}

export default new CreateDataSourceConfigurationPage();