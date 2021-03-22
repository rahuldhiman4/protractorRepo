import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import SlmExpressionBuilder from './slm-expressionbuilder.pop.po';

class ServiceTargetConfig {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        serviceTargetBlade: '[rx-view-definition-guid="b33e03d8-128d-4c42-8a5e-93d67bebd0b7"]',
        createServiceTargetButton: '[rx-view-component-id="5a771a32-973d-4c3f-a90a-280c36890dea"] button',
        svtTitle: '[rx-view-component-id="36abb115-44c8-4089-a7c4-18e6835758fc"] input',
        companyGuid: '64642abd-53f9-472c-8c22-906355edc22d',
        selectGoalTypeGuid: '9efb3f48-3bc1-4af8-91c4-b4fa3597814a',
        selectGoalType: '[rx-view-component-id="9efb3f48-3bc1-4af8-91c4-b4fa3597814a"] button',
        dataSourceGuid: 'a2780b54-1b51-48e7-a9ae-f387e87b55a5',
        svtDescriptionField: '[rx-view-component-id="bbff56c3-aae3-4050-a377-5d37aaeb1ce9"] textarea',
        goalTypeSelectedValue: '[rx-view-component-id="9efb3f48-3bc1-4af8-91c4-b4fa3597814a"] button div',
        dropDownOption: 'button.dropdown-item',
        buildExpressionLink: 'button[aria-label="Build Expression"]',
        timer: 'input.adapt-counter-input',
        segments: '.adapt-accordion .card',
        segmentsArrow: '.adapt-accordion .card .tab-caret',
        saveSVTButton: '[rx-view-component-id="a54fb374-2287-4a40-bcca-f950d088d098"] button',
        cancelSVTButton: '[rx-view-component-id="c310b9eb-f57b-4be7-918d-2f84459e8c86"] button',
        closeSVTButton: '[rx-view-component-id="c310b9eb-f57b-4be7-918d-2f84459e8c86"] button',
        qualificationBuilder: '[rx-view-definition-guid="9648b7db-6a58-4dcf-9bd0-5bcf69ef2364"] .content-outlet',
        searchField: '[rx-view-definition-guid="9648b7db-6a58-4dcf-9bd0-5bcf69ef2364"] input.adapt-search-field',
        field: '[rx-view-definition-guid="9648b7db-6a58-4dcf-9bd0-5bcf69ef2364"] .bwf-field-selector_field',
        saveButton: '[rx-view-component-id="1dd13374-edae-4f26-ad13-a0b5e7ba4346"] button',
        operatorButton: '[rx-view-definition-guid="9648b7db-6a58-4dcf-9bd0-5bcf69ef2364"] .bwf-expression-operators button',
        valueDD: 'optionLoader.selectedOption',
        valueSearch: ' input[type="search"]',
        addButton: '.d-textfield__label .margin-top-10 button',
        expressionBuilderBtn: '[rx-view-component-id="1f691b31-30f7-4feb-b4f2-8972a616f2fe"] button',
        termsAndConditionsFieldGuid: '94891fe1-781f-4f94-bcce-12425862d97d',
        selectStatusField: '[rx-view-component-id="db4792dc-4198-416c-b8ea-6afec63491ea"] button',
        selectBusinessEntity: `//button//div[text()='Select Business Entity']/parent::button`,
        fieldNameLabel: `//*[contains(@class,'form-control-label')]//span`,
        noMileStonesPresentText: '.adapt-accordion .card .no-record-found',
        addNewMileStoneBtn: '.adapt-accordion .card button.bwf-button-link span.d-icon-left-plus_circle',
        goalTypeDropDownInput: '[rx-view-component-id="f80b3d35-e0e4-497b-9656-e01210244572"] button',
        errorMsg: 'p.form-control-feedback'
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

    async getError(errorMsg: string): Promise<string> {
        return await $(this.selectors.errorMsg).isPresent().then(async (result) => {
            if (result) {
                return (await element(by.cssContainingText(this.selectors.errorMsg, errorMsg)).getText()).trim();
            } else {
                return null;
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

        await $(this.selectors.svtTitle).sendKeys(svtTitleStr);
        await this.selectCompany(company);
        await this.selectDataSource(dataSource);
        await $$(this.selectors.buildExpressionLink).first().click();
    }

    async enterSVTTitle(svtTitleStr: string): Promise<void> {
        await $(this.selectors.svtTitle).sendKeys(svtTitleStr);
    }

    async selectCompany(company: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyGuid, company);
    }

    async selectDataSource(dataSource: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.dataSourceGuid, dataSource);
    }

    async clickBuildExpressionLink(): Promise<void> {
        await $$(this.selectors.buildExpressionLink).first().click();
    }

    async selectGoalType(svtGoalType: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.selectGoalTypeGuid, svtGoalType);
    }

    async selectStatus(svtStatus: string): Promise<void> {
        await $(this.selectors.selectStatusField).click();
        await element(by.cssContainingText(this.selectors.dropDownOption, svtStatus)).click();
    }

    async enterSVTDescription(svtDesc: string): Promise<void> {
        await $(this.selectors.svtDescriptionField).clear();
        await $(this.selectors.svtDescriptionField).sendKeys(svtDesc);
    }

    async clearSVTDescription(): Promise<void> {
        await $(this.selectors.svtDescriptionField).clear();
    }


    async isTermsAndConditionsFieldMandatory(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.termsAndConditionsFieldGuid)
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

    async selectExpressionForMeasurement(measurementExp: number, field: string, operator: string, fieldvalue: string, DropDown?: string) {
        //        browser.sleep(2000);
        await $$(this.selectors.segments).get(1).$$(this.selectors.buildExpressionLink).get(measurementExp).click();
        //        browser.sleep(2000);
        await SlmExpressionBuilder.clearSelectedExpression();
        await SlmExpressionBuilder.selectExpressionQualification(field, operator, fieldvalue, DropDown);
        //  await SlmExpressionBuilder.clickOnAddExpressionButton(fieldAttribute);
        await SlmExpressionBuilder.clickOnSaveExpressionButton();
    }

    async selectExpressionForMeasurementForTask(measurementExp: number, field: string, operator: string, fieldvalue: string, DropDown?: string) {
        //        browser.sleep(2000);
        await $$(this.selectors.segments).get(1).$$(this.selectors.buildExpressionLink).get(measurementExp).click();
        //        browser.sleep(2000);
        await SlmExpressionBuilder.selectExpressionQualificationForTask(field, operator, fieldvalue, DropDown);
        //  await SlmExpressionBuilder.clickOnAddExpressionButton(fieldAttribute);
        await SlmExpressionBuilder.clickOnSaveExpressionButtonForTask();
    }

    async clickOnSaveSVTButton() {
        await $(this.selectors.saveSVTButton).click();
    }

    async clickOnCancelSVTButton() {
        await $(this.selectors.cancelSVTButton).click();
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

    async getGoalTypeSelectedValue(): Promise<string> {
        return await $(this.selectors.goalTypeSelectedValue).getText();
    }

    async selectGoalTypeCheckbox(checkboxLabel: string): Promise<void> {
        let chkBoxVal = $$('.checkbox__label input+ div.checkbox__item > span+ span');
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
        let chkBoxVal = $$('span.checkbox__label input + div.checkbox__item span + span');
        for (let i: number = 1; i <= (await chkBoxVal).length; i++) {
            let val = await chkBoxVal.get(i).getText();
            if (val == checkboxLabel) {
                await chkBoxVal.get(i).click();
                break;
            }
        }
    }

    async isGoalCheckboxDisabled(checkboxLabel: string): Promise<boolean> {
        let chkBoxVal = $$('.checkbox__label input');
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
        let chkBox = $$('div.checkbox__item span +span');
        let chkBoxVal = $$('span.checkbox__label input');
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
        return await element(by.xpath(this.selectors.selectBusinessEntity)).getAttribute("aria-disabled") == "true" ? true : false;
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

    async clickAddNewMileStoneBtn(): Promise<void> {
        await $(this.selectors.addNewMileStoneBtn).click();
    }

    async clickOnGoalTypeDropDown(): Promise<void> {
        await $(this.selectors.selectGoalType).click();
    }

    async clearGoalTypeDropDownOption(): Promise<void> {
        await $(this.selectors.goalTypeDropDownInput).clear();
    }

    async isGoalTypeOptionPresentInDropDown(goalType: string): Promise<boolean> {
        await $(this.selectors.goalTypeDropDownInput).clear();
        await $(this.selectors.goalTypeDropDownInput).sendKeys(goalType);
        let values = await $$(this.selectors.dropDownOption).count();
        if (values >= 1) { return true; } else { return false; }
    }



}

export default new ServiceTargetConfig();