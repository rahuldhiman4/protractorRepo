import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import SlmExpressionBuilder from './slm-expressionbuilder.pop.po';

class ServiceTargetConfig {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createServiceTargetButton: '.d-icon-left-plus',
        svtTitle: 'recordData[field.svtTitle.id].value',
        selectCompanyDD: '.ui-select-match[placeholder="Select Company"]',
        selectDataSourceDD: '.ui-select-match[placeholder="Select Data Source"]',
        dropDownOption: '.ui-select-choices-row',
        buildExpressionLink: '.d-button_link',
        timer: '.d-counter__input',
        segments: '[id^="accordiongroup"][id$="panel"]',
        segmentsArrow: '[id^="accordiongroup"][id$="tab"] .glyphicon',
        saveSVTButton: '.modal-footer button.d-button_primary',
        popUpMsgLocator: '.rx-growl-item__message',
        qualificationBuilder: 'ux-qualification-builder',
        searchField: 'searchText',
        field: '.record_field',
        saveButton: '[rx-view-component-id="46c33f50-2695-45c7-8a11-db8d7fccd581"] button',
        operatorButton: '[rx-id="operator-displayValue"]',
        valueDD: 'optionLoader.selectedOption',
        valueSearch: ' input[type="search"]',
        addButton: '.d-textfield__label .margin-top-10 button',
        expressionBuilderBtn: 'button.d-textfield__item',
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

    async clickOnBuildExpression():Promise<void> {
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


    async getPopUpMessage() {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)));
        let message = await $(this.selectors.popUpMsgLocator).getText();
        //        await browser.wait(this.EC.invisibilityOf($(this.selectors.popUpMsgLocator)));
        return message;
    }

    async clickOnSaveSVTButton() {
        //        browser.sleep(2000);
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveSVTButton)));
        await $(this.selectors.saveSVTButton).click();
    }
}

export default new ServiceTargetConfig();