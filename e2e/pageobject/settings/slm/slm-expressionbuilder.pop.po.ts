import { $, browser, by, element, protractor, ProtractorExpectedConditions, $$, ElementFinder } from "protractor";

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
        saveTaskSVTExpressionButton: '[rx-view-component-id="377c4912-0248-4099-bb96-30a94b3abf1b"] button',
        popUpMsgLocator: '.rx-growl-item__message',
        isPartialExpression: 'div[class*="invalid_expression"]',
        expandExpressionField: '.d-icon-triangle_right',
        selectFirstLevelExpressionField: '.expanded_field',
        selectSecondLevelExpressionField: '.expanded_field .child_field',
        clearExpression: '.ux-qualification-editor',
        fieldSearch: '.d-textfield__input'
    }

    async getExpressionFieldAvailable(expressionField: string): Promise<string> {
        let expressionFields: string = `//div[@class="record_field"][text()="${expressionField}"]`;
        return await element(by.xpath(expressionFields)).getText();
    }

    async getExpressionFieldAvailableAll(data: string[]): Promise<boolean> {
        let arr: string[] = [];
        let expressionFields: string = `div.record_field`;
        let drpDwnvalue: number = await $$(expressionFields).count();
        for (let i = 0; i < drpDwnvalue; i++) {
            let ab: string = await $$(expressionFields).get(i).getText();
            arr[i] = ab;
        }
        arr = arr.sort();
        data = data.sort();
        return arr.length === data.length && arr.every(
            (value, index) => (value === data[index])
        );
    }

    async getFirstLevelExpressionField(firstLevelExpression: string): Promise<string> {
        let expressionFields: string = `div.expanded_field`;
        let qBuilder = await $(this.expressionBuilderSelectors.qualificationBuilder);
        await qBuilder.element(by.model(this.expressionBuilderSelectors.searchField)).clear();
        await qBuilder.element(by.model(this.expressionBuilderSelectors.searchField)).sendKeys(firstLevelExpression);
        return await $(expressionFields).getText();
    }
    async clearSearchField(): Promise<void> {
        await $$(this.expressionBuilderSelectors.fieldSearch).get(0).clear();
    }

    async getFirstLevelExpressionFieldAll(data: string[]): Promise<boolean> {
        let arr: string[] = [];
        let expressionFields: string = `div.expanded_field`;
        let drpDwnvalue: number = await $$(expressionFields).count();
        for (let i = 0; i < drpDwnvalue; i++) {
            let ab: string = await $$(expressionFields).get(i).getText();
            arr[i] = ab;
        }
        arr = arr.sort();
        data = data.sort();
        return arr.length === data.length && arr.every(
            (value, index) => (value === data[index])
        );
    }


    async areSecondLevelExpressionFieldsMatches(firstLevelExpression: string, data: string[]): Promise<boolean> {
        let arr: string[] = [];

        let listPrimaryOfFields: ElementFinder[] = await $$('.col-sm-4.variable_title li');
        for (let i: number = 0; i < listPrimaryOfFields.length; i++) {
            let field: ElementFinder = await listPrimaryOfFields[i].$('.expanded_field');
            let primaryElementText: string[] = (await field.getText()).split("\n");
            for (let k: number = 0; k < primaryElementText.length; k++) {
                if (primaryElementText[k].trim() == firstLevelExpression) {
                    let primaryFieldArrow: ElementFinder = await listPrimaryOfFields[i].$('.d-icon-triangle_right');
                    await primaryFieldArrow.click();
                    let listOFSecondaryFields: ElementFinder[] = await listPrimaryOfFields[i].$$('.expanded_field .child_field');
                    for (let j: number = 0; j < listOFSecondaryFields.length; j++) {
                        let v = await listOFSecondaryFields[j].getText();
                        arr.push(await listOFSecondaryFields[j].getText());
                    }
                }
            }
        }
        arr = arr.sort();
        data = data.sort();
        if ('Company' == firstLevelExpression) {
            console.log("my", arr);
            console.log("new", data);
        }
        return arr.length === data.length && arr.every(
            (value, index) => (value === data[index])
        );
    }

    async selectFirstLevelExpressionField(firstLevelExpression: string): Promise<void> {
        let qBuilder = await $(this.expressionBuilderSelectors.qualificationBuilder);
        let firstLevelExpressionField = `//div[@class='expanded_field'][text()='${firstLevelExpression}']/preceding-sibling::*[contains(@class,'d-icon-plus_circle')]`;
        await qBuilder.element(by.model(this.expressionBuilderSelectors.searchField)).clear();
        await qBuilder.element(by.model(this.expressionBuilderSelectors.searchField)).sendKeys(firstLevelExpression);
        let checkboxRows: ElementFinder[];
        let checkboxRows1: ElementFinder[];
        checkboxRows = await $$('.add_child_icon.icon.d-icon-plus_circle+.expanded_field');
        checkboxRows1 = await $$('.add_child_icon.icon.d-icon-plus_circle');
        for (let i = 0; i < checkboxRows.length; i++) {
            let attrVal = await checkboxRows[i].getAttribute('innerText');
            if (attrVal == firstLevelExpression) {
                await browser.sleep(2000);
                await browser.wait(this.EC.elementToBeClickable((checkboxRows1[i])), 5000);
                await checkboxRows1[i].click();
            }
        }
    }

    async selectSecondLevelExpressionField(firstLevelExpression: string, secondLevelExpression: string): Promise<void> {
        let listPrimaryOfFields: ElementFinder[] = await $$('.col-sm-4.variable_title li');
        for (let i: number = 0; i < listPrimaryOfFields.length; i++) {
            let field: ElementFinder = await listPrimaryOfFields[i].$('.expanded_field');
            let primaryElementText: string[] = (await field.getText()).split("\n");
            for (let k: number = 0; k < primaryElementText.length; k++) {
                if (primaryElementText[k].trim() == firstLevelExpression) {
                    let primaryFieldArrow: ElementFinder = await listPrimaryOfFields[i].$('.d-icon-triangle_right');
                    await primaryFieldArrow.click();
                    let listOFSecondaryFields: ElementFinder[] = await listPrimaryOfFields[i].$$('.expanded_field .child_field');
                    for (let j: number = 0; j < listOFSecondaryFields.length; j++) {
                        if (await listOFSecondaryFields[j].getText() == secondLevelExpression) {
                            await listOFSecondaryFields[j].click();
                        }
                    }
                }
            }
        }
    }

    async getExpressionFieldOperatorAvailable(operator: string): Promise<string> {
        let expressionOperatorVal = `operator ux-expression-editor-button-${operator}`;
        return await element(by.class(expressionOperatorVal)).getText();
    }

    async getExpressionFieldOperatorAvailableAll(data: string[]): Promise<boolean> {
        let arr: string[] = [];
        let expressionOperator: string = `div[ng-repeat='operator in operatorRow'] button`;
        let drpDwnvalue: number = await $$(expressionOperator).count();
        for (let i = 0; i < drpDwnvalue; i++) {
            let ab: string = await $$(expressionOperator).get(i).getText();
            arr[i] = ab;
        }
        arr = arr.sort();
        data = data.sort();
        return arr.length === data.length && arr.every(
            (value, index) => (value === data[index])
        );
    }

    async selectFields(field: string): Promise<void> {
        let qBuilder = await $(this.expressionBuilderSelectors.qualificationBuilder);
        await qBuilder.element(by.model(this.expressionBuilderSelectors.searchField)).sendKeys(field);
        await browser.sleep(3000);
        await browser.wait(this.EC.elementToBeClickable($(this.expressionBuilderSelectors.selectField)), 4000);
        await qBuilder.$(this.expressionBuilderSelectors.selectField).click();
    }

    async selectOperator(operator: string): Promise<void> {
        let expressionOperatorVal = `operator ux-expression-editor-button-${operator}`;
        await element(by.className(expressionOperatorVal)).click();
    }

    async selectFieldValue(fieldvalue: string): Promise<void> {
        await $(this.expressionBuilderSelectors.selectFieldOption).sendKeys(fieldvalue);
        await browser.wait(this.EC.elementToBeClickable($(this.expressionBuilderSelectors.selectFieldOption)), 2000);
        await $(this.expressionBuilderSelectors.selectFieldOption).click();
    }

    async selectExpressionQualification(field: string, operator: string, fieldAttribute: string, fieldvalue: string): Promise<void> {
        await this.selectFields(field);
        await this.selectOperator(operator);
        await this.selectFieldOption(fieldAttribute, fieldvalue);
    }

    async selectFirstLevelExpressionQualification(field: string, operator: string, fieldAttribute: string, fieldvalue: string): Promise<void> {
        await this.selectFirstLevelExpressionField(field);
        await this.selectOperator(operator);
        await this.selectFieldOption(fieldAttribute, fieldvalue);
        await this.clickOnAddExpressionButton(fieldAttribute);
    }

    async selectSecondLevelExpressionQualification(firstLevelAssociationfield: string, secondLevelAssociationfield: string, operator: string, fieldAttribute: string, fieldvalue: string): Promise<void> {
        let qBuilder = await $(this.expressionBuilderSelectors.qualificationBuilder);
        await browser.sleep(2000);
        await qBuilder.element(by.model(this.expressionBuilderSelectors.searchField)).clear();
        await qBuilder.element(by.model(this.expressionBuilderSelectors.searchField)).sendKeys(firstLevelAssociationfield);
        await browser.sleep(2000);
        await this.selectSecondLevelExpressionField(firstLevelAssociationfield, secondLevelAssociationfield);
        await this.selectOperator(operator);
        await this.selectFieldOption(fieldAttribute, fieldvalue);
        await this.clickOnAddExpressionButton(fieldAttribute);
    }

    async selectFieldOption(fieldAttribute: string, fieldOptionValue: string): Promise<void> {
        let ref1: string = '"' + "showField ==" + "'" + fieldAttribute + "'" + '"';
        let attributeRef = `div[ng-show=${ref1}]`;
        let attributeReference = await $(attributeRef);
        let selectDropDown = '.ui-select-match';
        let selectDropDownOption = '.ui-select-choices-row-inner';
        let clickOnOptionFieldDropDown = await attributeReference.$(selectDropDown);
        let selectFieldOptionFromDropDown = `div[ng-show=${ref1}]` + " .ui-select-choices-row-inner";
        let textField = 'input[type="text"]';
        let addBtn = 'Add';

        switch (fieldAttribute) {
            case "NAMED_LIST":
                let attr = `"showField =='${fieldAttribute}'"`;
                const attributeName = await $(`div[ng-if=${attr}]`);
                await attributeName.$(selectDropDown).click();
                let option = await element(by.cssContainingText('.ui-select-choices-row-inner div', fieldOptionValue));
                await browser.wait(this.EC.elementToBeClickable(option), 2000);
                await option.click();
                break;
            case "STATUS":
                await $('[aria-hidden="false"] select[ng-model="selectedValue"]').click();
                await element(by.cssContainingText('option', fieldOptionValue)).click();
                break;
            case "SELECTION":
                await $('[aria-hidden="false"] select[ng-model="selectedValue"]').click();
                await element(by.cssContainingText('option', fieldOptionValue)).click(); break;
            case "DATE_TIME":
                await element(by.css("input[ng-model='date']")).sendKeys(fieldOptionValue);
                break;
            case "ASSOCIATION":
                await browser.sleep(2000);
                await clickOnOptionFieldDropDown.click();
                option = await element(by.cssContainingText(selectFieldOptionFromDropDown, fieldOptionValue));
                await option.click();
                break;
            case "LABEL":
                    await browser.sleep(2000); //Need this wait till displayed label drop down
                    await $$('.ui-select-toggle[aria-label="Select box activate"]').get(0).click();
                    await element(by.cssContainingText('.ui-select-choices-row-inner div', fieldOptionValue)).click();
                    break;
            case "PERSON":
                await element(by.model('personGroupListCtrl.ngModel')).sendKeys(fieldOptionValue);
                await element(by.className('uib-typeahead-match active')).click();
                break;
            default:
                await attributeReference.$(textField).click();
                await attributeReference.$(textField).clear();
                await attributeReference.$(textField).sendKeys(fieldOptionValue);
        }
    }

    async getSelectedExpression(): Promise<string> {
        let actualFieldName, actualOperator, actualFieldValue;
        actualFieldName = await $(this.expressionBuilderSelectors.getExpressionFieldName).getText();
        actualOperator = await $(this.expressionBuilderSelectors.getExpressionOperator).getText();
        actualFieldValue = await $(this.expressionBuilderSelectors.getExpressionFieldValue).getText();

        let expression = actualFieldName + actualOperator + actualFieldValue;
        return expression;
    }

    async isSaveExpressionButtonDisabled(): Promise<boolean> {
        return await $(this.expressionBuilderSelectors.saveSVTExpressionButton).isDisplayed();
    }

    async clickOnAddExpressionButton(fieldAttribute: string) {
        let ref1: string = '"' + "showField ==" + "'" + fieldAttribute + "'" + '"';
        let addButtonVal = `div[ng-show=${ref1}] button`;

        if (fieldAttribute == "STATUS") {
            let ref1: string = '"' + "showField==" + "'" + fieldAttribute + "'" + '"';
            let addButtonVal = `div[ng-show=${ref1}] button`;
            await $(addButtonVal).click();
        } else if (fieldAttribute == "NAMED_LIST") {
            let ref1: string = '"' + "showField ==" + "'" + fieldAttribute + "'" + '"';
            let addButtonVal = `div[ng-if=${ref1}] button`;
            await $(addButtonVal).click();
        } else {
            await element(by.cssContainingText(addButtonVal, 'Add')).click();
        }
    }

    async clickOnSaveExpressionButton() {
        // await browser.wait(this.EC.visibilityOf($(this.expressionBuilderSelectors.saveSVTExpressionButton)), 2000);
        await $(this.expressionBuilderSelectors.saveSVTExpressionButton).click();
    }

    async clickOnSaveExpressionButtonForTask() {
        await $(this.expressionBuilderSelectors.saveTaskSVTExpressionButton).click();
    }


    async isInvalidExpression(): Promise<boolean> {
        return await $(this.expressionBuilderSelectors.isPartialExpression).isDisplayed();
    }

    async clearSelectedExpression() {
        await $(this.expressionBuilderSelectors.clearExpression).click();
        await $(this.expressionBuilderSelectors.clearExpression).clear();
    }

    async getExpressionFields(data: string[]): Promise<boolean> {
        let arr: string[] = [];
        let expressionFields: string = `div.record_field`;
        let drpDwnvalue: number = await $$(expressionFields).count();
        for (let i = 0; i < drpDwnvalue; i++) {
            let ab: string = await $$(expressionFields).get(i).getText();
            arr[i] = ab;
        }
        arr = arr.sort();
        data = data.sort();
        return arr.length === data.length && arr.every(
            (value, index) => (value === data[index])
        );
    }


}

export default new SlmExpressionBuilder();
