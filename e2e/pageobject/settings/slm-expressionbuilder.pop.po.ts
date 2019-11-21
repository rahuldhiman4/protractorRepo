import { element, by, ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class SlmExpressionBuilder {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    expressionBuilderSelectors = {
        qualificationBuilder: 'ux-qualification-builder',
        searchField: 'searchText',
        selectField: '.record_field',
        selectOperator: '.operator ux-expression-editor-button-',
        selectFieldOption: '.ui-select-choices-row-inner',
        selectCategoryTierOptionDropDown: 'optionLoader.selectedOption',
        selectCategoryTierOption: '.ui-select-choices-row-inner',
        getExpressionFieldName: 'span[type="FIELD"]',
        getExpressionOperator: 'span[type="OPERATOR"]',
        getExpressionFieldValue: 'span[type="VALUE"]',
        saveSVTExpressionButton: '[rx-view-component-id="46c33f50-2695-45c7-8a11-db8d7fccd581"] button',
        popUpMsgLocator: '.rx-growl-item__message',
        isPartialExpression: 'div[class*="invalid_expression"]'
    }

    async getExpressionFieldAvailable(expressionField: string): Promise<string> {
        var expressionFields: string = `//div[@class="record_field"][text()="${expressionField}"]`;
        await browser.wait(this.EC.elementToBeClickable($(expressionFields)));
        return await $(expressionFields).getText();
    }

    async getExpressionFieldOperatorAvailable(operator: string): Promise<string> {
        let expressionOperatorVal = `operator ux-expression-editor-button-${operator}`;
        console.log(expressionOperatorVal);
        await browser.wait(this.EC.elementToBeClickable($(expressionOperatorVal)));
        return await element(by.class(expressionOperatorVal)).getText();
    }

    async selectFields(field: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.expressionBuilderSelectors.saveSVTExpressionButton)));
        let qBuilder = await $(this.expressionBuilderSelectors.qualificationBuilder);
        await qBuilder.element(by.model(this.expressionBuilderSelectors.searchField)).sendKeys(field);
        await qBuilder.$(this.expressionBuilderSelectors.selectField).click();
    }

    async selectOperator(operator: string): Promise<void> {
        let expressionOperatorVal = `operator ux-expression-editor-button-${operator}`;
        await browser.wait(this.EC.elementToBeClickable(element(by.className(expressionOperatorVal))));
        await element(by.className(expressionOperatorVal)).click();
    }

    async selectFieldValue(fieldvalue: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.expressionBuilderSelectors.selectFieldOption)));
        await $(this.expressionBuilderSelectors.selectFieldOption).sendKeys(fieldvalue);
        await $(this.expressionBuilderSelectors.selectFieldOption).click();
    }

    async selectExpressionQualification(field: string, operator: string, fieldAttribute: string, fieldvalue: string): Promise<void> {
        await this.selectFields(field);
        await this.selectOperator(operator);
        await this.selectFieldOption(fieldAttribute, fieldvalue);
    }

    async selectFieldOption(fieldAttribute: string, fieldOptionValue: string): Promise<void> {
        var ref1: string = '"' + "showField ==" + "'" + fieldAttribute + "'" + '"';
        var attributeRef = await $(`div[ng-show=${ref1}]`);
        var selectDropDown = '.ui-select-match';
        var selectDropDownOption = '.ui-select-choices-row-inner';
        var clickOnOptionFieldDropDown = await attributeRef.$(selectDropDown);
        var selectFieldOptionFromDropDown = `div[ng-show=${ref1}]` + " .ui-select-choices-row-inner";
        var addBtn = 'Add';

        switch (fieldAttribute) {
            case "NAMED_LIST":
                var attr = `"showField =='${fieldAttribute}'"`;
                const attributeName = await $(`div[ng-if=${attr}]`);
                await browser.wait(this.EC.elementToBeClickable(attributeName.$(selectDropDown)));
                await $(attributeName.$(selectDropDown)).click();
                let option = element(by.cssContainingText(attributeName.$(selectDropDownOption), fieldOptionValue));
                await browser.wait(this.EC.elementToBeClickable(option));
                await option.click();
                let addButton = `[${attributeName}] button`;
                await browser.wait(this.EC.elementToBeClickable(element(by.css(addButton))));
                element(by.cssContainingText(addButton, addBtn)).click();

                break;
            case "STATUS":
                await browser.wait(this.EC.elementToBeClickable($('[aria-hidden="false"] select[ng-model="selectedValue"]')));
                await $('[aria-hidden="false"] select[ng-model="selectedValue"]').click();
                element(by.cssContainingText('option', fieldOptionValue)).click();
                browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
                break;
            case "SELECTION":
                await browser.wait(this.EC.elementToBeClickable($('[aria-hidden="false"] select[ng-model="selectedValue"]')));
                await $('[aria-hidden="false"] select[ng-model="selectedValue"]').click();
                element(by.cssContainingText('option', fieldOptionValue)).click();
                browser.actions().sendKeys(protractor.Key.ESCAPE).perform();

                // await element(by.model('selectedValue')).click();
                // element(by.cssContainingText('option', fieldOptionValue)).click();

                break;
            case "DATE_TIME":
                await browser.wait(this.EC.elementToBeClickable(element(by.css("input[ng-model='date']"))));
                await element(by.css("input[ng-model='date']")).sendKeys(fieldOptionValue);
                break;
            case "ASSOCIATION":
                await browser.wait(this.EC.elementToBeClickable(clickOnOptionFieldDropDown));
                await clickOnOptionFieldDropDown.click();
                option = element(by.cssContainingText(selectFieldOptionFromDropDown, fieldOptionValue));
                await browser.wait(this.EC.elementToBeClickable(option));
                await option.click();
                break;
            case "PERSON":
                await browser.wait(this.EC.elementToBeClickable(element(by.model('personGroupListCtrl.ngModel'))));
                await element(by.model('personGroupListCtrl.ngModel')).sendKeys(fieldOptionValue);
                await browser.wait(this.EC.elementToBeClickable(element(by.className('uib-typeahead-match active'))));
                await element(by.className('uib-typeahead-match active')).click();

                break;
        }
    }

    async getSelectedExpression(): Promise<string> {
        let actualFieldName, actualOperator, actualFieldValue;
        await browser.wait(this.EC.visibilityOf($(this.expressionBuilderSelectors.getExpressionFieldName)));
        actualFieldName = await $(this.expressionBuilderSelectors.getExpressionFieldName).getText();
        actualOperator = await $(this.expressionBuilderSelectors.getExpressionOperator).getText();
        actualFieldValue = await $(this.expressionBuilderSelectors.getExpressionFieldValue).getText();

        let expression = actualFieldName + actualOperator + actualFieldValue;
        return expression;
    }

    async isSaveExpressionButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf(element(this.expressionBuilderSelectors.saveSVTExpressionButton)));
        return await $(this.expressionBuilderSelectors.saveSVTExpressionButton).isDisplayed();
    }

    async clickOnAddExpressionButton(fieldAttribute: string) {
        var ref1: string = '"' + "showField ==" + "'" + fieldAttribute + "'" + '"';
        var addButtonVal = `div[ng-show=${ref1}]` + " button";

        if (fieldAttribute == "STATUS") {
            let ref1: string = '"' + "showField==" + "'" + fieldAttribute + "'" + '"';
            let addButtonVal = `div[ng-show=${ref1}]` + " button";
            let option = element(by.cssContainingText(addButtonVal, 'Add'));
            await browser.wait(this.EC.elementToBeClickable(option));
            await option.click();
        } else if (fieldAttribute == "NAMED_LIST") {
            let ref1: string = '"' + "showField==" + "'" + fieldAttribute + "'" + '"';
            let addButtonVal = `div[ng-if=${ref1}]` + " button";
            let option = element(by.cssContainingText(addButtonVal, 'Add'));
            await browser.wait(this.EC.elementToBeClickable(option));
            await option.click();
        } else {
            let option = element(by.cssContainingText(addButtonVal, 'Add'));
            await browser.wait(this.EC.elementToBeClickable(option));
            await option.click();
        }
    }

    async clickOnSaveExpressionButton() {
        await browser.wait(this.EC.visibilityOf($(this.expressionBuilderSelectors.saveSVTExpressionButton)));
        await $(this.expressionBuilderSelectors.saveSVTExpressionButton).click();
    }

    async isInvalidExpression(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf(element(this.expressionBuilderSelectors.isPartialExpression)));
        return await $(this.expressionBuilderSelectors.isPartialExpression).isDisplayed();
    }
}

export default new SlmExpressionBuilder();

