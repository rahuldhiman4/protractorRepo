import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class EditDataSourceConfigurationPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        dataSourceHeading: '.modal-header h3',
        fieldNameLabel: 'span.d-textfield__item',
        showAdvancedSettingsLink: '.record-registration-form button.btn-link',
        buildExpressionBtn: '.modal-body .d-textfield__label button',
        associationName: 'associationModel',
        saveButton: '.slm-modal-footer button.d-button_primary',
        closeButton: '.slm-modal-footer button.d-button_secondary',
        fieldValues: '.record-registration-form .d-textfield__label input',
        advancedFieldValues: '.record-registration-form .d-textfield__label span',
        companyfieldValue: '.record-registration-form .d-textfield__label .ui-select-match-text',
        companyfield: '.record-registration-form .d-textfield__label .ui-select-toggle',
    }

    async getDataSourceConfigurationHeading(): Promise<string> {
        return await $(this.selectors.dataSourceHeading).getText();
    }

    async clickDataSourceLink(dataSourceLink: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.showAdvancedSettingsLink, dataSourceLink)).click();
    }

    async isDataSourceFieldRequired(fieldName: string): Promise<boolean> {
        let fieldNameRequiredTag = await element(by.cssContainingText(this.selectors.fieldNameLabel, fieldName));
        return await utilCommon.isRequiredTagToFieldElement(fieldNameRequiredTag);
    }

    async isBuildExpressionBtnDisabled(): Promise<boolean> {
        return await $(this.selectors.buildExpressionBtn).getAttribute("disabled") == "true";
    }

    async isAssociationNameDisabled(): Promise<boolean> {
        return await element(by.model(this.selectors.associationName)).getAttribute("disabled") == "true";
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
        let fieldRecords = await $(`.record-registration-form .ui-select-container[title='${fieldName}']`);
        let fieldRecordEntity = await fieldRecords.$('.ui-select-toggle');
        return await fieldRecordEntity.getAttribute("aria-disabled") == "true" ? true : false;
    }

    async getDatSourceAdvancedFieldValue(fieldName: string): Promise<string> {
        let fieldRecords = await $(`.record-registration-form .d-textfield__label [title='${fieldName}']`);
        return await fieldRecords.$('span.ui-select-match-text').getText();
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
        await utilCommon.selectDropDownWithName(fieldName, fieldOption);
    }


}

export default new EditDataSourceConfigurationPage();
