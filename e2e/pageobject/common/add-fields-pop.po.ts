import { $, browser, by, element, protractor, ProtractorExpectedConditions, $$ } from "protractor";

class AddField {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        fieldVariable: '.rx-data-dictionary-item-value',
        parentFields: '.modal-body .a-tree__content',
        okButtonOnEditor: '.modal-footer .btn-primary',
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
        let countParent = await $$('.modal-body .ui-tree-selectable .a-tree__label adapt-highlight[title]').count();
        for (let i =0; i<countParent; i++){
            let getTextofparent = await $$('.modal-body .ui-tree-selectable .a-tree__label adapt-highlight[title]').get(i).getText();
            console.log('getTextofparent>>>>>',getTextofparent);
            if (getTextofparent == fromTree){
              await $$('.modal-body .a-tree__toggle').get(i).click();  
              await browser.sleep(3000);//Added becoz of slownees open the parent tree
              break;
            }
        }

        let countChild = await $$('.modal-body .ui-tree-selectable .expression-node-label').count();
        for (let i =0; i<countChild; i++){
            let getTextofChild = await $$('.modal-body .ui-tree-selectable .expression-node-label').get(i).getText();
            console.log('getTextofparent>>>>>',getTextofChild);
            if (getTextofChild == value){
              await $$('.modal-body .ui-tree-selectable .d-icon-plus_circle').get(i).click();  
              break;
            }
        }
    }

    async clickOnOkButtonOfEditor(): Promise<void> {
        await $(this.selectors.okButtonOnEditor).click();
    }

    async clickOnCancelButtonOfEditor(): Promise<void> {
        await $(this.selectors.cancelButtonOnEditor).click();
    }
}

export default new AddField();