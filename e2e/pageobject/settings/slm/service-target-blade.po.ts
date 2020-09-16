import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions, ElementFinder } from "protractor";
import SlmExpressionBuilder from './slm-expressionbuilder.pop.po';
import utilCommon from '../../../utils/util.common';

class ServiceTargetConfig {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        serviceTargetBlade: '.modal-open .d-action-blade .modal-dialog',
        createServiceTargetButton: '.d-icon-left-plus',
        svtTitle: 'recordData[field.svtTitle.id].value',
        selectCompanyDD: '.ui-select-match[placeholder="Select Company"]',
        selectGoalType: '.ui-select-match[placeholder="Select Goal Type"]',
        selectDataSourceDD: '.ui-select-match[placeholder="Select Data Source"]',
        svtDescriptionField: 'recordData[field.svtDescription.id].value',
        goalTypeSelectedValue: '.ui-select-match-text',
        dropDownOption: '.ui-select-choices-row',
        buildExpressionLink: '.d-button_link',
        timer: '.d-counter__input',
        segments: '[id^="accordiongroup"][id$="panel"]',
        segmentsArrow: '[id^="accordiongroup"][id$="tab"] .glyphicon',
        saveSVTButton: '.modal-footer button.d-button_primary',
        closeSVTButton: '.modal-footer button.d-button_secondary',
        qualificationBuilder: 'ux-qualification-builder',
        searchField: 'searchText',
        field: '.record_field',
        saveButton: '[rx-view-component-id="46c33f50-2695-45c7-8a11-db8d7fccd581"] button',
        operatorButton: '[rx-id="operator-displayValue"]',
        valueDD: 'optionLoader.selectedOption',
        valueSearch: ' input[type="search"]',
        addButton: '.d-textfield__label .margin-top-10 button',
        expressionBuilderBtn: 'button.d-textfield__item',
        termsAndConditionsField: 'textarea[aria-label="Terms and Condition"]',
        selectStatusField: '.ui-select-match[placeholder="Select Status field"]',
        selectBusinessEntity: '.ui-select-match[placeholder="Select Business Entity"]',
        fieldNameLabel: 'span.d-textfield__item',
        noMileStonesPresentText: '.slm-group-list-item_empty',
        addNewMileStoneBtn: 'button.d-icon-left-plus_circle',
    }

    async isServiceTargetBladeDisplayed(): Promise<boolean> {
        return await $(this.selectors.serviceTargetBlade).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.serviceTargetBlade).isDisplayed();
            } else {
                return false;
            }
        });
    }

    async clickCreateSVTButton(): Promise<void> {
        await $(this.selectors.createServiceTargetButton).click();
    }

    async createServiceTargetConfig(svtTitleStr: string, company: string, dataSource: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.createServiceTargetButton)));
        await $(this.selectors.createServiceTargetButton).click();
        //        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.svtTitle))));
        await element(by.model(this.selectors.svtTitle)).sendKeys(svtTitleStr);
        await $(this.selectors.selectCompanyDD).click();
        await element(by.cssContainingText(this.selectors.dropDownOption, company)).click();
        await $(this.selectors.selectDataSourceDD).click();
        await element(by.cssContainingText(this.selectors.dropDownOption, dataSource)).click();
        await $$(this.selectors.buildExpressionLink).first().click();
    }

    async enterSVTTitle(svtTitleStr: string): Promise<void> {
        await element(by.model(this.selectors.svtTitle)).sendKeys(svtTitleStr);
    }

    async selectCompany(company: string): Promise<void> {
        await $(this.selectors.selectCompanyDD).click();
        await element(by.cssContainingText(this.selectors.dropDownOption, company)).click();
    }

    async selectDataSource(dataSource: string): Promise<void> {
        await $(this.selectors.selectDataSourceDD).click();
        await element(by.cssContainingText(this.selectors.dropDownOption, dataSource)).click();
    }

    async clickBuildExpressionLink(): Promise<void> {
        await $$(this.selectors.buildExpressionLink).first().click();
    }

    async selectGoalType(svtGoalType: string): Promise<void> {
        await $(this.selectors.selectGoalType).click();
        await element(by.cssContainingText(this.selectors.dropDownOption, svtGoalType)).click();
    }

    async selectStatus(svtStatus: string): Promise<void> {
        await $(this.selectors.selectStatusField).click();
        await element(by.cssContainingText(this.selectors.dropDownOption, svtStatus)).click();
    }

    async enterSVTDescription(svtDesc: string): Promise<void> {
        await element(by.model(this.selectors.svtDescriptionField)).sendKeys(svtDesc);
    }

    async clearSVTDescription(): Promise<void> {
        await element(by.model(this.selectors.svtDescriptionField)).clear();
    }


    async isTermsAndConditionsFieldMandatory(): Promise<boolean> {
        return await $(this.selectors.termsAndConditionsField).getAttribute("required") == 'true';
    }

    async clickOnBuildExpression(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.expressionBuilderBtn)));
        await $$(this.selectors.expressionBuilderBtn).first().click();
    }

    async selectGoal(goalTime: string, goalType?: string) {
        switch (goalType) {
            case "Days": {
                await $$(this.selectors.timer).first().clear();
                await $$(this.selectors.timer).first().sendKeys(goalTime);
                break;
            }
            case "Hours": {
                await $$(this.selectors.timer).get(1).clear();
                await $$(this.selectors.timer).get(1).sendKeys(goalTime);
                break;
            }
            default: {
                await $$(this.selectors.timer).last().clear();
                await $$(this.selectors.timer).last().sendKeys(goalTime);
                break;
            }
        }
    }

    async selectGoalTab() {
        await $$(this.selectors.segmentsArrow).get(0).click();
    }

    async selectMeasurement() {
        await $$(this.selectors.segmentsArrow).get(1).click();
    }

    async selectExpressionForMeasurement(measurementExp: number, field: string, operator: string, fieldAttribute: string, fieldvalue: string) {
        //        browser.sleep(2000);
        await $$(this.selectors.segments).get(1).$$(this.selectors.buildExpressionLink).get(measurementExp).click();
        //        browser.sleep(2000);
        await SlmExpressionBuilder.clearSelectedExpression();
        await SlmExpressionBuilder.selectExpressionQualification(field, operator, fieldAttribute, fieldvalue);
        await SlmExpressionBuilder.clickOnAddExpressionButton(fieldAttribute);
        await SlmExpressionBuilder.clickOnSaveExpressionButton();
    }

    async selectExpressionForMeasurementForTask(measurementExp: number, field: string, operator: string, fieldAttribute: string, fieldvalue: string) {
        //        browser.sleep(2000);
        await $$(this.selectors.segments).get(1).$$(this.selectors.buildExpressionLink).get(measurementExp).click();
        //        browser.sleep(2000);
        await SlmExpressionBuilder.selectExpressionQualification(field, operator, fieldAttribute, fieldvalue);
        await SlmExpressionBuilder.clickOnAddExpressionButton(fieldAttribute);
        await SlmExpressionBuilder.clickOnSaveExpressionButtonForTask();
    }

    async clickOnSaveSVTButton() {
        await $(this.selectors.saveSVTButton).click();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        if (await $(this.selectors.saveSVTButton).getAttribute("disabled")) {
            return false;
        } else {
            return true;
        }
    }

    async isCloseButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.closeSVTButton).isEnabled();
    }

    async clickCloseButton(): Promise<void> {
        await $(this.selectors.closeSVTButton).click();
    }

    async getGoalTypeSelectedValue(svtGoalType: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.goalTypeSelectedValue, svtGoalType)).isDisplayed();
    }

    async selectGoalTypeCheckbox(checkboxLabel: string): Promise<void> {
        let chkBoxVal: any = await $$('.d-checkbox__label input + span.d-checkbox__item');
        switch (checkboxLabel) {
            case "Goal Time": {
                await chkBoxVal.first().click();
                break;
            }
            case "Start Time": {
                await chkBoxVal.get(1).click();
                break;
            }
            case "Business Entity": {
                await chkBoxVal.get(2).click();
                break;
            }
            default: {
                console.log("Error: Goal Type checkbox are not enabled.");
                break;
            }
        }
    }

    async selectMeasurementCheckbox(checkboxLabel: string): Promise<void> {
        let chkBoxVal: any = await $$('.d-checkbox__label input + span');
        for (let i: number = 1; i <= (await chkBoxVal).length; i++) {
            let val = await chkBoxVal.get(i).getText();
            if (val == checkboxLabel) {
                console.log("val is :" + val);
                await chkBoxVal.get(i).click();
                break;
            }
        }
    }

    async isGoalCheckboxDisabled(checkboxLabel: string): Promise<boolean> {
        let chkBoxVal: any = await $$('.d-checkbox__label input');
        let isDisabledAttr: boolean;
        switch (checkboxLabel) {
            case "Goal Time": {
                isDisabledAttr = await chkBoxVal.first().getAttribute("disabled") == "true" ? true : false;
                break;
            }
            case "Start Time": {
                isDisabledAttr = await chkBoxVal.get(1).getAttribute("disabled") == "true" ? true : false;
                break;
            }
            case "Business Entity": {
                isDisabledAttr = await chkBoxVal.get(2).getAttribute("disabled") == "true" ? true : false;
                break;
            }
            default: {
                console.log("Error: Goal Type checkbox are not enabled.");
                break;
            }
        }
        return isDisabledAttr;
    }

    async isMeasurementCheckboxDisabled(checkboxLabel: string): Promise<boolean> {
        let chkBox: any = await $$('.d-checkbox__label span');
        let chkBoxVal: any = await $$('.d-checkbox__label input');
        let cnt: number = 0;
        for (let i: number = 1; i <= (await chkBox).length; i++) {
            let val = await chkBox.get(i).getText();
            if (val == checkboxLabel) {
                cnt++;
                break;
            }
        }
        return await chkBoxVal.get(cnt).getAttribute("disabled") == "true" ? true : false;;
    }

    async isGoalCheckboxSelected(checkboxLabel: string): Promise<boolean> {
        let chkBoxVal: any = await $$('.d-checkbox__label input');
        let isDisabledAttr: boolean;
        switch (checkboxLabel) {
            case "Goal Time": {
                isDisabledAttr = await chkBoxVal.get(1).getAttribute("checked") == "true" ? true : false;
                break;
            }
            case "Start Time": {
                isDisabledAttr = await chkBoxVal.get(2).getAttribute("checked") == "true" ? true : false;
                break;
            }
            case "Business Entity": {
                isDisabledAttr = await chkBoxVal.get(3).getAttribute("checked") == "true" ? true : false;
                break;
            }
            default: {
                console.log("Error: Goal Type checkbox are not enabled.");
                break;
            }
        }
        return isDisabledAttr;
    }

    async isBusinessEntityDisabled(): Promise<boolean> {
        return await $(this.selectors.selectBusinessEntity).getAttribute("readonly") == "true" ? true : false;
    }

    async isGoalTypeCountersDisabled(goalType: string): Promise<boolean> {
        let chkBox: any = await $$('span.d-textfield__item');
        let cnt: number = 0;
        for (let i: number = 1; i <= (await chkBox).length; i++) {
            let val = await chkBox.get(i).getText();
            if (val == goalType) {
                cnt++;
                break;
            }
        }
        return await $$('span.d-textfield__item + input').get(cnt).getAttribute("disabled") == "true" ? true : false;
    }

    async isServiceTargetFieldRequired(fieldName: string): Promise<boolean> {
        let fieldNameRequiredTag = await element(by.cssContainingText(this.selectors.fieldNameLabel, fieldName));
        return await utilCommon.isRequiredTagToFieldElement(fieldNameRequiredTag);
    }

    async selectMilestone() {
        await $$(this.selectors.segmentsArrow).last().click();
    }

    async clickAddNewMileStoneBtn():Promise<void>{
        await $(this.selectors.addNewMileStoneBtn).click();
    }




}

export default new ServiceTargetConfig();