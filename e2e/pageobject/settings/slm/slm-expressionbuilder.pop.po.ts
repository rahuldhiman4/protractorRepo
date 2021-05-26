import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import { DropDownType } from '../../../utils/constants';

class SlmExpressionBuilder {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    expressionBuilderSelectors = {
        searchField: 'input.adapt-search-field',
        selectField: 'div.bwf-field-selector_field',
        selectOperator: '.bwf-expression-operators button',
        selectFieldOption: '.rx-select__option-content',
        getExpressionFieldName: 'span[type="FIELD"]',
        getExpressionOperator: 'span[type="OPERATOR"]',
        getExpressionFieldValue: 'span[type="VALUE"]',
        saveSVTExpressionButton: '[rx-view-component-id="46c33f50-2695-45c7-8a11-db8d7fccd581"] button',
        cancelSVTExpressionButton: '[rx-view-component-id="ac2d52d1-e0e3-427e-9e35-40d20b91e35c"] button',
        saveTaskSVTExpressionButton: '[rx-view-component-id="377c4912-0248-4099-bb96-30a94b3abf1b"] button',
        isPartialExpression: 'div[class*="bwf-invalid-expression"]',
        expandExpressionField: '.d-icon-triangle_right',
        selectFirstLevelExpressionField: 'div.bwf-field-selector_field',
        selectSecondLevelExpressionField: '.bwf-field-selector_child-container .bwf-field-selector_field',
        clearExpression: 'div.cke_enable_context_menu',
        fieldSearch: '[rx-view-component-id="2979b946-c150-43d3-86d5-892f6f9b229f"] input'
    }

    async getExpressionFieldAvailable(expressionField: string): Promise<string> {
        let expressionFields: string = `//div[@class="record_field"][text()="${expressionField}"]`;
        return await element(by.xpath(expressionFields)).getText();
    }

    async getExpressionFieldAvailableAll(data: string[]): Promise<boolean> {
        let arr: string[] = [];
        let drpDwnvalue: number = await $$(this.expressionBuilderSelectors.selectFirstLevelExpressionField).count();
        for (let i = 0; i < drpDwnvalue; i++) {
            let ab: string = await $$(this.expressionBuilderSelectors.selectFirstLevelExpressionField).get(i).getText();
            arr[i] = ab;
        }
        arr = arr.sort();
        data = data.sort();
        return arr.length === data.length && arr.every(
            (value, index) => (value === data[index])
        );
    }

    async getFirstLevelExpressionField(firstLevelExpression: string): Promise<string> {
        await $(this.expressionBuilderSelectors.searchField).clear();
        await $(this.expressionBuilderSelectors.searchField).sendKeys(firstLevelExpression);
        return await $(this.expressionBuilderSelectors.selectFirstLevelExpressionField).getText();
    }
    async clearSearchField(): Promise<void> {
        await $(this.expressionBuilderSelectors.fieldSearch).clear();
    }

    async getFirstLevelExpressionFieldAll(data: string[]): Promise<boolean> {
        let arr: string[] = [];
        let drpDwnvalue: number = await $$(this.expressionBuilderSelectors.selectFirstLevelExpressionField).count();
        for (let i = 0; i < drpDwnvalue; i++) {
            let ab: string = await $$(this.expressionBuilderSelectors.selectFirstLevelExpressionField).get(i).getText();
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
        let firstLevelField: string = "";

        for (let i: number = 0; i < data.length; i++) {
            await $(this.expressionBuilderSelectors.searchField).clear();
            await $(this.expressionBuilderSelectors.searchField).sendKeys(data[i]);
            firstLevelField = await $('.col-sm-4 [class="bwf-field-selector_field"]').getText();

            if (firstLevelField.trim() == firstLevelExpression) {
                if (i == 0) {
                    await $('.d-icon-triangle_right').click();
                }
                await $$(this.expressionBuilderSelectors.selectField).last().getText();
                arr.push(await $$(this.expressionBuilderSelectors.selectField).last().getText());
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

    async selectSecondLevelExpressionField(secondLevelExpression: string): Promise<void> {
        await $(this.expressionBuilderSelectors.searchField).sendKeys(secondLevelExpression);
        await $('.d-icon-triangle_right').click();
        await $$(this.expressionBuilderSelectors.selectField).last().click();
    }

    async getExpressionFieldOperatorAvailable(operator: string): Promise<string> {
        let expressionOperatorVal = `operator ux-expression-editor-button-${operator}`;
        return await element(by.class(expressionOperatorVal)).getText();
    }

    async getExpressionFieldOperatorAvailableAll(data: string[]): Promise<boolean> {
        let arr: string[] = [];
        let expressionOperator: string = '.bwf-expression-operators button';
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
        await $(this.expressionBuilderSelectors.searchField).sendKeys(field);
        await browser.sleep(3000);
        await browser.wait(this.EC.elementToBeClickable($(this.expressionBuilderSelectors.selectField)), 4000);
        let allOptionsCount = await $$(this.expressionBuilderSelectors.selectField).count();
        for (let i: number = 0; i <= allOptionsCount; i++) {
            let optionName = await $$(this.expressionBuilderSelectors.selectField).get(i).getText();
            if (optionName === field) {
                await $$(this.expressionBuilderSelectors.selectField).get(i).click();
                break;
            }
        }
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

    async selectExpressionQualification(field: string, operator: string, fieldvalue: string, DropDown?: string): Promise<void> {
        await this.selectFields(field);
        await this.selectOperator(operator);
        await this.selectFieldOption(field, fieldvalue, DropDown);
    }

    async selectExpressionQualificationForTask(field: string, operator: string, fieldvalue: string, DropDown?: string): Promise<void> {
        await this.selectFields(field);
        await this.selectOperator(operator);
        await this.selectFieldOption(field, fieldvalue, DropDown);
    }

    async selectFirstLevelExpressionQualification(field: string, operator: string, fieldvalue: string, DropDown?: string): Promise<void> {
        await this.selectFields(field);
        await this.selectOperator(operator);
        await this.selectFieldOption(field, fieldvalue, DropDown);
    }

    async selectSecondLevelExpressionQualification(firstLevelAssociationfield: string, secondLevelAssociationfield: string, operator: string, fieldvalue: string, DropDown?: string): Promise<void> {
        await browser.sleep(2000);
        await this.selectSecondLevelExpressionField(secondLevelAssociationfield);
        await this.selectOperator(operator);
        await this.selectFieldOption(secondLevelAssociationfield, fieldvalue, DropDown);
    }

    async selectFieldOption(field: string, fieldOptionValue: string, DropDown?: string): Promise<void> {
        let addBtn = ' button.bwf-add-button';
        if (DropDown == "Direct") {
            await utilityCommon.selectDropDown(await $(".bwf-expression-values button[role='listbox']"), fieldOptionValue, DropDownType.WebElement);
        } else if (DropDown == "Search") {
            await utilityCommon.selectDropDown(field, fieldOptionValue, DropDownType.Label);
        } else if (DropDown == "link") {
            await $('input[aria-label="Requester"]').sendKeys(fieldOptionValue);
            await $('span[class="popup-person"]').click();
        } else if (DropDown == "Text") {
            await $('.bwf-expression-values input').sendKeys(fieldOptionValue);
        }
        await $(addBtn).click();
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

    async clickOnCancelExpressionButton() {
        await $(this.expressionBuilderSelectors.cancelSVTExpressionButton).click();
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
