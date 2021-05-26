import { $, $$, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
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
        fieldValues: `.form-group button`,
        displayNameField: `.form-control-label span`,
        displayNameFieldValues: `.form-group input`,
        companyfieldValue: `//*[contains(@class,'form-control-label')]//span[1]/ancestor::adapt-rx-control-label/following-sibling::div//button//*[contains(@class,'rx-select__search-button-title')]`,
        companyfield: `//*[contains(@class,'form-control-label')]//span[1]`,
        useEndTimeCheckbox: '.checkbox__input',
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

    async clickBuildExpressionBtn(): Promise<void> {
        await $(this.selectors.buildExpressionBtn).click();
    }

    async isAssociationNameDisabled(): Promise<boolean> {
        return await $(this.selectors.associationName).getAttribute("disabled") == "true";
    }

    async isSaveBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

    async isDataSourceDisplayNameFieldDisabled(fieldName: string): Promise<boolean> {
        let fldsCount = await $$(this.selectors.displayNameFieldValues).count();
        for (let i = 0; i < fldsCount; i++) {
            let displayNametext = await $$(this.selectors.displayNameField).get(i).getText();
            let elem = await $$(this.selectors.displayNameFieldValues).get(i);
            if (displayNametext == fieldName) {
                return await elem.getAttribute("disabled") ? true : false;
            }
        }
    }

    async isDataSourceFieldDisabled(fieldName: string): Promise<boolean> {
        let fldsCount = await $$(this.selectors.fieldValues).count();
        for (let i = 0; i < fldsCount; i++) {
            let elem = await $$(this.selectors.fieldValues).get(i);
            if (await elem.getAttribute("aria-label") == fieldName) {
                return await elem.getAttribute("aria-disabled")== "true"? true : false;
            }
        }
    }

    async getDataSourceInputFieldValue(fieldName: string): Promise<string> {
        let fldsCount = await $$(this.selectors.displayNameFieldValues).count();
        for (let i = 0; i < fldsCount; i++) {
            let elem = await $$(this.selectors.displayNameFieldValues).get(i);
            let displayNametext = await $$(this.selectors.displayNameField).get(i).getText();
            if (displayNametext == fieldName) {
                return await elem.getAttribute("value");
            }
        }
    }

    async getDataSourceFieldValue(fieldName: string): Promise<string> {
        let fldsCount = await $$(this.selectors.fieldValues).count();
        for (let i = 0; i < fldsCount; i++) {
            let elem = await $$(this.selectors.fieldValues).get(i);
            if (await elem.getAttribute("aria-label") == fieldName) {
                console.log(">><><",await elem.getAttribute("value"));
                return await elem.getAttribute("value");
            }
        }
    }

    async getDatSourceCompanyFieldValue(): Promise<string> {
        return await element(by.xpath(this.selectors.companyfieldValue)).getText();
    }

    async isDatSourceCompanyFieldDisabled(): Promise<boolean> {
        return await element(by.xpath(this.selectors.companyfield)).getAttribute('aria-disabled') == 'true';
    }

    async isDatSourceAdvancedFieldsDisabled(fieldName: string): Promise<boolean> {
        let fieldRecords = await element(by.xpath(`//*[contains(@class,'form-control-label')]//span[text()='${fieldName}']/ancestor::adapt-rx-control-label/following-sibling::div//button`));
        return await fieldRecords.getAttribute("aria-disabled") == "true" ? true : false;
    }

    async getDatSourceAdvancedFieldValue(fieldName: string): Promise<string> {
        let fieldRecords = await element(by.xpath(`//*[contains(@class,'form-control-label')]//span[text()='${fieldName}']/ancestor::adapt-rx-control-label/following-sibling::div//button//*[contains(@class,'rx-select__search-button-title')]`));
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

    async clickEndTimeCheckbox(): Promise<void> {
        await $(this.selectors.useEndTimeCheckbox).click();
    }

    async selectDataSourceNoneOption(dropDownIdentifier: string):Promise<void>{
        const dropDown: ElementFinder[] = await $$('adapt-rx-select');
        for (let i: number = 0; i < dropDown.length; i++) {
            await dropDown[i].$('.form-control-label').isPresent().then(async (result) => {
                if (result) {
                    let dropDownLabelText: string = await dropDown[i].$('.form-control-label').getText();
                    if (dropDownLabelText === dropDownIdentifier) {
                        await dropDown[i].$('button').click();
                        try {
                            await element(by.cssContainingText('[role="option"] i', 'None')).click();
                        } catch (ex) {
                            console.log(`Dropdown option not present: None`, ex);
                            await dropDown[i].$('button').click();
                        }
                    }
                }
            });
        }
    }

}

export default new EditDataSourceConfigurationPage();
