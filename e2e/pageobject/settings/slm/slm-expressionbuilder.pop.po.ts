import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import { DropDownType } from '../../../utils/constants';

class SlmExpressionBuilder {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    expressionBuilderSelectors = {
        qualificationBuilder: '[rx-view-definition-guid="7303cd72-d321-457f-9779-cbd2dc681bd9"] .content-outlet',
        searchField: '[rx-view-component-id="2979b946-c150-43d3-86d5-892f6f9b229f"] input',
        selectField: '[rx-view-component-id="2979b946-c150-43d3-86d5-892f6f9b229f"] .bwf-field-selector_field',
        selectOperator: '[rx-view-component-id="2979b946-c150-43d3-86d5-892f6f9b229f"] .bwf-expression-operators button',
        selectFieldOption: '[rx-view-component-id="2979b946-c150-43d3-86d5-892f6f9b229f"] .rx-select__option-content',
        selectCategoryTierOptionDropDown: '[rx-view-component-id="2979b946-c150-43d3-86d5-892f6f9b229f"]  button.dropdown-toggle',
        selectCategoryTierOption: '[rx-view-component-id="2979b946-c150-43d3-86d5-892f6f9b229f"] .rx-select__option-content',
        getExpressionFieldName: 'span[type="FIELD"]',
        getExpressionOperator: 'span[type="OPERATOR"]',
        getExpressionFieldValue: 'span[type="VALUE"]',
        saveSVTExpressionButton: '[rx-view-component-id="46c33f50-2695-45c7-8a11-db8d7fccd581"] button',
        saveTaskSVTExpressionButton: '[rx-view-component-id="377c4912-0248-4099-bb96-30a94b3abf1b"] button',
        isPartialExpression: 'div[class*="bwf-invalid-expression"]',
        expandExpressionField: '.d-icon-triangle_right',
        selectFirstLevelExpressionField: '[rx-view-component-id="2979b946-c150-43d3-86d5-892f6f9b229f"] .bwf-field-selector_field',
        selectSecondLevelExpressionField: '[rx-view-component-id="2979b946-c150-43d3-86d5-892f6f9b229f"] .bwf-field-selector_child-container .bwf-field-selector_field',
        clearExpression: 'div.cke_enable_context_menu',
        fieldSearch: '[rx-view-component-id="b7b2f1b7-c03c-4bcb-b5bf-fddfc34e563b"] input'
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
        let qBuilder = await $(this.expressionBuilderSelectors.qualificationBuilder);
        await qBuilder.$(this.expressionBuilderSelectors.searchField).clear();
        await qBuilder.$(this.expressionBuilderSelectors.searchField).sendKeys(firstLevelExpression);
        return await $(this.expressionBuilderSelectors.selectFirstLevelExpressionField).getText();
    }
    async clearSearchField(): Promise<void> {
        await $$(this.expressionBuilderSelectors.fieldSearch).get(0).clear();
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
        await qBuilder.$(this.expressionBuilderSelectors.searchField).clear();
        await qBuilder.$(this.expressionBuilderSelectors.searchField).sendKeys(firstLevelExpression);
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
        await qBuilder.$(this.expressionBuilderSelectors.searchField).sendKeys(field);
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

    async selectExpressionQualification(field: string, operator: string, fieldvalue: string,DropDown?: string): Promise<void> {
        await this.selectFields(field);
        await this.selectOperator(operator);
        await this.selectFieldOption(field, fieldvalue,DropDown);
    }

    async selectFirstLevelExpressionQualification(field: string, operator: string, fieldvalue: string,DropDown?: string): Promise<void> {
        await this.selectFirstLevelExpressionField(field);
        await this.selectOperator(operator);
        await this.selectFieldOption(field, fieldvalue,DropDown);
    }

    async selectSecondLevelExpressionQualification(firstLevelAssociationfield: string, secondLevelAssociationfield: string, operator: string, fieldAttribute: string, fieldvalue: string): Promise<void> {
        let qBuilder = await $(this.expressionBuilderSelectors.qualificationBuilder);
        await browser.sleep(2000);
        await qBuilder.$(this.expressionBuilderSelectors.searchField).clear();
        await qBuilder.$(this.expressionBuilderSelectors.searchField).sendKeys(firstLevelAssociationfield);
        await browser.sleep(2000);
        await this.selectSecondLevelExpressionField(firstLevelAssociationfield, secondLevelAssociationfield);
        await this.selectOperator(operator);
        await this.selectFieldOption(fieldAttribute, fieldvalue);
        await this.clickOnAddExpressionButton(fieldAttribute);
    }

    async selectFieldOption(field: string, fieldOptionValue: string, DropDown?: string): Promise<void> {
        let addBtn = ' button.bwf-add-button';
        if (DropDown == "Direct") {
            await utilityCommon.selectDropDown(await $(".bwf-expression-values button[role='listbox']"), fieldOptionValue,DropDownType.WebElement);
        } else if (DropDown == "Search"){
            await utilityCommon.selectDropDown(field, fieldOptionValue, DropDownType.Label);
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
