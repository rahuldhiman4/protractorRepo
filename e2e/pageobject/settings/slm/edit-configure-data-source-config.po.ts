import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import { DropDownType } from '../../../utils/constants';
import utilityCommon from '../../../utils/utility.common';

class EditDataSourceConfigurationPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        dataSourceHeading: 'div.dp-header .dp-title',
        fieldNameLabel: '[rx-view-definition-guid="a223e02e-83fb-42d9-8ea4-a11488eab4a5"] .form-control-label span',
        showAdvancedSettingsLink: 'button[aria-label="Show Advanced Settings"]',
        buildExpressionBtn: 'button[aria-label="Build Expression"]',
        associationName: 'button[aria-label="Association Name"]',
        saveButton: '[rx-view-component-id="9f9e345e-b1d9-41d5-b4da-3a0a437ed179"] button',
        closeButton: '[rx-view-component-id="f4e0420d-d6c6-4ebd-b68e-7eaf897bb3aa"] button',
        fieldValues: `//*[contains(@class,'form-control-label')]//span[1]`,
        companyfieldValue: `//*[contains(@class,'form-control-label')]//span[1]/ancestor::adapt-rx-control-label/following-sibling::div//button//*[contains(@class,'rx-select__search-button-title')]`,
        companyfield: `//*[contains(@class,'form-control-label')]//span[1]`,
        useEndTimeCheckbox: `//span[contains(@class,'form-control-label')]//span[1]//ancestor::div[contains(@class,"row")]//input[@type="checkbox"]`,
    }

    async getDataSourceConfigurationHeading(): Promise<string> {
        return await $(this.selectors.dataSourceHeading).getText();
    }

    async clickDataSourceLink(dataSourceLink: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.showAdvancedSettingsLink, dataSourceLink)).click();
    }

    async isDataSourceFieldRequired(fieldName: string): Promise<boolean> {
        let fieldNameRequiredTag = await element(by.cssContainingText(this.selectors.fieldNameLabel, fieldName));
        return await utilityCommon.isRequiredTagPresent(fieldNameRequiredTag);
    }

    async isBuildExpressionBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.buildExpressionBtn).getAttribute("disabled") == "true";
    }

    async isAssociationNameDisabled(): Promise<boolean> {
        return await $(this.selectors.associationName).getAttribute("disabled") == "true";
    }

    async isSaveBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

    async getDatSourceFieldValue(fieldName: string): Promise<string> {
        let fldsCount = await $$(this.selectors.fieldValues).count();
        for (let i = 0; i < fldsCount; i++) {
            let elem = await $$(this.selectors.fieldValues).get(i);
            if (await elem.getAttribute("aria-label") == fieldName) {
                return await elem.getAttribute("value");
            }
        }
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

    async getDatSourceCompanyFieldValue(): Promise<string> {
        return await $(this.selectors.companyfieldValue).getText();
    }

    async isDatSourceCompanyFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.companyfield).getAttribute('aria-disabled') == 'true';
    }

    async isDatSourceAdvancedFieldsDisabled(fieldName: string): Promise<boolean> {
        let fieldRecords = await element(by.xpath(`//*[contains(@class,'form-control-label')]//span[text()=${fieldName}]/ancestor::adapt-rx-control-label/following-sibling::div//button`));
        return await fieldRecords.getAttribute("aria-disabled") == "true" ? true : false;
    }

    async getDatSourceAdvancedFieldValue(fieldName: string): Promise<string> {
        let fieldRecords = await element(by.xpath(`//*[contains(@class,'form-control-label')]//span[text()=${fieldName}]/ancestor::adapt-rx-control-label/following-sibling::div//button//*[contains(@class,'rx-select__search-button-title')]`));
        return await fieldRecords.getText();
    }

    async clearDatSourceAdvancedFieldSelection(fieldName: string): Promise<string> {
        let fieldRecords = await $(`.record-registration-form .d-textfield__label [title='${fieldName}']`);
        return await fieldRecords.$(' .glyphicon-remove').click();
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.closeButton).click();
    }

    async selectDataSourceFieldOption(fieldName: string, fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(fieldName, fieldOption, DropDownType.Label);// can use DropDownType.Name
    }

    async isUseEndTimeCheckboxAlreadySelected(): Promise<boolean> {
        return await $(this.selectors.useEndTimeCheckbox).getAttribute("checked") == "true" ? true : false;
    }

}

export default new EditDataSourceConfigurationPage();
