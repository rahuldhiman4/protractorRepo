import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions, ElementFinder } from "protractor";
import SlmExpressionBuilder from './slm-expressionbuilder.pop.po';
import utilityCommon from '../../../utils/utility.common';

class ServiceTargetConfig {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        serviceTargetBlade: '[rx-view-definition-guid="b33e03d8-128d-4c42-8a5e-93d67bebd0b7"]',
        createServiceTargetButton: '[rx-view-component-id="8985f5e9-f984-43d1-b6cd-ce780f64a71b"] button',
        svtTitle: '[rx-view-component-id="2fe41278-97db-4bd9-a723-72e9d6356920"] input',
        selectCompanyDD: '[rx-view-component-id="dcbb867a-fba4-437b-81e4-bf1ec7568350"] button',
        selectGoalType: '[rx-view-component-id="f80b3d35-e0e4-497b-9656-e01210244572"] button',
        selectDataSourceDD: '[rx-view-component-id="57908aad-eb55-43da-bb24-3255f0ce8c59"] button',
        svtDescriptionField: '[rx-view-component-id="5425c08c-4806-4f23-8a28-4c436309d773"] input',
        goalTypeSelectedValue: `//*[@rx-view-definition-guid="b33e03d8-128d-4c42-8a5e-93d67bebd0b7"]//*[contains(@class,'form-control-label')]//span`,
        dropDownOption: 'button.dropdown-item',
        buildExpressionLink: '[rx-view-component-id="1f691b31-30f7-4feb-b4f2-8972a616f2fe"] button',
        timer: 'input.adapt-counter-input',
        segments: '.adapt-accordion .card',
        segmentsArrow: '.adapt-accordion .card .tab-caret',
        saveSVTButton: '[rx-view-component-id="8f3dd3cd-1443-4296-9061-ad90e17f1dc2"] button',
        closeSVTButton: '[rx-view-component-id="3876db88-86b9-49d3-bcbf-0e47ca0b5ca4"] button',
        qualificationBuilder: '[rx-view-definition-guid="9648b7db-6a58-4dcf-9bd0-5bcf69ef2364"] .content-outlet',
        searchField: '[rx-view-definition-guid="9648b7db-6a58-4dcf-9bd0-5bcf69ef2364"] input.adapt-search-field',
        field: '[rx-view-definition-guid="9648b7db-6a58-4dcf-9bd0-5bcf69ef2364"] .bwf-field-selector_field',
        saveButton: '[rx-view-component-id="1dd13374-edae-4f26-ad13-a0b5e7ba4346"] button',
        operatorButton: '[rx-view-definition-guid="9648b7db-6a58-4dcf-9bd0-5bcf69ef2364"] .bwf-expression-operators button',
        valueDD: 'optionLoader.selectedOption',
        valueSearch: ' input[type="search"]',
        addButton: '.d-textfield__label .margin-top-10 button',
        expressionBuilderBtn: '[rx-view-component-id="1f691b31-30f7-4feb-b4f2-8972a616f2fe"] button',
        termsAndConditionsField: 'textarea.form-control',
        selectStatusField: '[rx-view-component-id="dc8c4074-db37-4910-96c0-b16d2be23b7e"] button',
        selectBusinessEntity: `//button//div[text()='Select Business Entity']`,
        fieldNameLabel: `//*[@rx-view-definition-guid="b33e03d8-128d-4c42-8a5e-93d67bebd0b7"]//*[contains(@class,'form-control-label')]//span`,
        noMileStonesPresentText: '.adapt-accordion .card .no-record-found',
        addNewMileStoneBtn: '.adapt-accordion .card button.bwf-button-link span.d-icon-left-plus_circle',
        goalTypeDropDownInput: '[rx-view-component-id="f80b3d35-e0e4-497b-9656-e01210244572"] button'
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
        await $$(this.selectors.segmentsArrow).first().click();
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
        let chkBoxVal = $$('.d-checkbox__label input + span.d-checkbox__item');
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
        let chkBoxVal = $$('.d-checkbox__label input + span');
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
        let chkBoxVal = $$('.d-checkbox__label input');
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
        let chkBox = $$('.d-checkbox__label span');
        let chkBoxVal =  $$('.d-checkbox__label input');
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
        let chkBoxVal = $$('.d-checkbox__label input');
        let isDisabledAttr: boolean;
        switch (checkboxLabel) {
            case "Goal Time": {
                isDisabledAttr = await chkBoxVal.first().getAttribute("checked") == "true" ? true : false;
                break;
            }
            case "Start Time": {
                isDisabledAttr = await chkBoxVal.get(1).getAttribute("checked") == "true" ? true : false;
                break;
            }
            case "Business Entity": {
                isDisabledAttr = await chkBoxVal.get(2).getAttribute("checked") == "true" ? true : false;
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
        let chkBox = $$('span.d-textfield__item');
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
        return await utilityCommon.isRequiredTagToField(fieldNameRequiredTag);
    }

    async selectMilestone() {
        await $$(this.selectors.segmentsArrow).last().click();
    }

    async clickAddNewMileStoneBtn():Promise<void>{
        await $(this.selectors.addNewMileStoneBtn).click();
    }

    async clickOnGoalTypeDropDown():Promise<void>{
        await $(this.selectors.selectGoalType).click();
    }

    async clearGoalTypeDropDownOption():Promise<void>{
        await $(this.selectors.goalTypeDropDownInput).clear();
    }

    async isGoalTypeOptionPresentInDropDown(goalType: string): Promise<boolean> {
        await $(this.selectors.goalTypeDropDownInput).clear();
        await $(this.selectors.goalTypeDropDownInput).sendKeys(goalType);
        let values= await $$(this.selectors.dropDownOption).count();
        if (values >= 1) { return true; } else { return false; }
    } 



}

export default new ServiceTargetConfig();