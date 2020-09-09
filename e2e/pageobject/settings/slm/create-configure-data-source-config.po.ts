import { $$, $, browser, protractor, ProtractorExpectedConditions, element, by } from "protractor";
import utilCommon from '../../../utils/util.common';

class CreateDataSourceConfigurationPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        dataSourceHeading: '.modal-header h3',
        fieldNameLabel: 'span.d-textfield__item',
        displayNameInputField: '.record-registration-form .d-textfield__input',
        showAdvancedSettingsLink: '.record-registration-form button.btn-link',
        saveButton: '.slm-modal-footer button.d-button_primary',
        closeButton: '.slm-modal-footer button.d-button_secondary',
        fieldValues: '.record-registration-form .d-textfield__label input',
        useEndTimeCheckbox: '.d-checkbox__input + .d-checkbox__item',
        regularExpSaveButton: '.controls button.d-button_primary',
        dropdownBox: '.ui-select-toggle',
        dropDownInput: 'input[type="search"]',
        dropDownOption: '.ui-select-choices-row-inner *',
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
        let fieldRecords = await $(`.record-registration-form .ui-select-container[title='${fieldName}']`);
        let fieldRecordEntity = await fieldRecords.$('.ui-select-toggle');
        return await fieldRecordEntity.getAttribute("aria-disabled") == "true" ? true : false;
    }

    async isDatSourceFieldDisabled(fieldName: string): Promise<boolean> {
        let fldsCount = await $$(this.selectors.fieldValues).count();
        for (let i = 0; i < fldsCount; i++) {
            let elem = await $$(this.selectors.fieldValues).get(i);
            if (await elem.getAttribute("aria-label") == fieldName) {
                return await elem.getAttribute("aria-readonly") == "true" ? true : false;
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