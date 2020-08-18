import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import SlmExpressionBuilder from './slm-expressionbuilder.pop.po';

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
        termsAndConditionsField: 'textarea[aria-label="Terms and Condition"]'
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

    async selectGoal(goalTime: string) {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.segmentsArrow)));
        await $$(this.selectors.timer).last().sendKeys(goalTime);
    }

    async selectMileStone() {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.segmentsArrow)));
        //        browser.sleep(3000);
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
        //        browser.sleep(2000);
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveSVTButton)));
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




}

export default new ServiceTargetConfig();