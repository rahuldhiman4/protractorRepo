import { $, browser, by, element, protractor, ProtractorExpectedConditions, $$ } from "protractor";

class AddField {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        fieldVariable: '.rx-data-dictionary-item-value',
        parentFields: '.rx-tree-node-parent',
        okButtonOnEditor: '.rx-expression-editor-action-buttons .d-button_primary',
        cancelButtonOnEditor: '.rx-expression-editor-action-buttons .d-button_secondary',
        addField: '.rx-expression-editor-dictionary h5',
        groupName: '.rx-data-dictionary-item div'
    }

    async getHeaderOfAddfield(): Promise<string> {
        return await $(this.selectors.addField).getText();
    }

    async navigateToDynamicFieldInCaseTemplate(caseTemplate: string) {
        let option = await element.all(by.cssContainingText(this.selectors.parentFields, 'Additional Fields from Case Template')).click();
        let templateName = await element.all(by.cssContainingText(this.selectors.parentFields, caseTemplate)).click();
    }

    async navigateToDynamicFieldInTaskTemplate(fromTemplate: string) {
        let option = await element(by.cssContainingText(this.selectors.parentFields, 'Additional Fields from Task Template'));
        await option.click();
        let templateName = await element(by.cssContainingText(this.selectors.parentFields, fromTemplate));
        await templateName.click();
    }

    async clickOnCase(): Promise<void> {
        await $$(this.selectors.parentFields).first().click();
    }

    async navigateToAssociationsInCase() {
        await $$(this.selectors.parentFields).first().click();
        let associations = await element(by.cssContainingText(this.selectors.parentFields, 'Associations'));
        await associations.click();
    }

    async navigateToAssociationsInTask() {
        let option = await element(by.cssContainingText(this.selectors.parentFields, 'Task'));
        await option.click();
        let associations = await element(by.cssContainingText(this.selectors.parentFields, 'Associations'));
        await associations.click();
    }

    async isAssocitionDisplayed(value: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.parentFields, value)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.parentFields, value)).isDisplayed();
            else return false;
        });

    }

    async clickOnAssocitionAndSelectField(association: string, fieldValue: string): Promise<void> {
        let option = await element(by.cssContainingText(this.selectors.parentFields, association));
        await option.click();
        await this.selectDynamicField(fieldValue);
    }

    async isDynamicFieldPresentInTemplate(value: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.fieldVariable, value)).isPresent();
    }

    async selectDynamicField(value: string): Promise<void> {
        let fieldValue = await element(by.cssContainingText(this.selectors.fieldVariable, value));
        await browser.actions().mouseMove(fieldValue).doubleClick().perform();

    }

    async clickOnGroupName(groupvalue: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.groupName, groupvalue)).click();
    }

    async isCaseTemplatePresent(caseTemplateValue: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.parentFields, caseTemplateValue)).isPresent();
    }
    async setValueOfField(fromTree: string, value: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.parentFields, fromTree)).click();
        let fieldValue = await element(by.cssContainingText(this.selectors.fieldVariable, value));
        await browser.actions().mouseMove(fieldValue).doubleClick().perform();
    }

    async clickOnOkButtonOfEditor(): Promise<void> {
        await $(this.selectors.okButtonOnEditor).click();
    }

    async clickOnCancelButtonOfEditor(): Promise<void> {
        await $(this.selectors.cancelButtonOnEditor).click();
    }
}

export default new AddField();