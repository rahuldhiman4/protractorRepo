import { $, $$, ProtractorExpectedConditions, browser, protractor, element, by } from "protractor";

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
    }

    expressionSelectors = {
        qualificationBuilder: 'ux-qualification-builder',
        searchField: 'searchText',
        field: '.record_field',
        saveButton: '[rx-view-component-id="46c33f50-2695-45c7-8a11-db8d7fccd581"] button',
        operatorButton: '[rx-id="operator-displayValue"]',
        valueDD: 'optionLoader.selectedOption',
        valueSearch: ' input[type="search"]',
        dropDownOption: '.ui-select__rx-choice',
        addButton: '.d-textfield__label .margin-top-10 button',
    }

    async createServiceTargetConfig(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.createServiceTargetButton)));
        await $(this.selectors.createServiceTargetButton).click();
        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.svtTitle))));
        await element(by.model(this.selectors.svtTitle)).sendKeys('SVT From Protractor');
        await $(this.selectors.selectCompanyDD).click();
        await element(by.cssContainingText(this.selectors.dropDownOption, 'Petramco')).click();
        await $(this.selectors.selectDataSourceDD).click();
        await element(by.cssContainingText(this.selectors.dropDownOption, 'Case Management')).click();
        await $$(this.selectors.buildExpressionLink).first().click();
        await this.createExpression('Category Tier 1', 'Accounts Payable');
        await $$(this.selectors.timer).last().sendKeys('1');
        browser.sleep(2000);
        await $$(this.selectors.segmentsArrow).get(1).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.segments)));
        browser.sleep(2000);
        await $$(this.selectors.segments).get(1).$$(this.selectors.buildExpressionLink).first().click();
        await this.createExpression('Status', 'Assigned');
        browser.sleep(2000);
        await $$(this.selectors.segments).get(1).$$(this.selectors.buildExpressionLink).get(1).click();
        await this.createExpression('Status', 'Resolved');
        browser.sleep(2000);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveSVTButton)));
        await $(this.selectors.saveSVTButton).click();
    }
    
    async createExpression(fieldName:string, value:string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.expressionSelectors.saveButton)));
        let qBuilder = await $(this.expressionSelectors.qualificationBuilder);
        await qBuilder.element(by.model(this.expressionSelectors.searchField)).sendKeys(fieldName);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        await browser.wait(this.EC.or(async ()=>{
            let count = await $$(this.expressionSelectors.field).count();
            return count >= 1;
        }))
        await element(by.cssContainingText(this.expressionSelectors.field, fieldName)).click();
        await element(by.cssContainingText(this.expressionSelectors.operatorButton, '=')).click();
        if(fieldName=='Status'){
            await element(by.model('selectedValue')).click();
            element(by.cssContainingText('option', value)).click();
              browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
              await browser.wait(this.EC.elementToBeClickable($$('.margin-top-10 button').first()));
              await $$('.margin-top-10 button').first().click();      
        } else {
            await element(by.model(this.expressionSelectors.valueDD)).click();
            await qBuilder.$(this.expressionSelectors.valueSearch).sendKeys(value);
            await browser.wait(this.EC.or(async ()=>{
                let count = await $$(this.expressionSelectors.dropDownOption).count();
                return count >= 2;
            }))
            await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText(this.expressionSelectors.dropDownOption, value))));
            await element(by.cssContainingText(this.expressionSelectors.dropDownOption, value)).click();
            await browser.wait(this.EC.elementToBeClickable($(this.expressionSelectors.addButton)));
            await $(this.expressionSelectors.addButton).click();
        }
        await browser.wait(this.EC.elementToBeClickable($(this.expressionSelectors.saveButton)));
        await $(this.expressionSelectors.saveButton).click();
    }
    
    async getPopUpMessage() {
        await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)));
        let message = await $(this.selectors.popUpMsgLocator).getText();
        await browser.wait(this.EC.invisibilityOf($(this.selectors.popUpMsgLocator)));
        return message;
    }
}

export default new ServiceTargetConfig();