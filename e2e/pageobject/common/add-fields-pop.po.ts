import { $, browser, by, element, protractor, ProtractorExpectedConditions, $$ } from "protractor";

class AddField {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        fieldVariable: '.expression-node-label',
        plusSymbol: 'button.d-icon-plus_circle',
        parentFields: 'rx-data-dictionary-node adapt-highlight',
        okButtonOnEditor: '.modal-footer .btn-primary',
        cancelButtonOnEditor: 'button[rx-id="cancel-button"]',
        addField: '.rx-expression-editor-dictionary h5',
        groupName: 'div.data-dictionary-container  span.a-tree__toggle',
        allNodesParent: '[rx-id="node"]',
        nodeName: 'adapt-highlight',
        nodeButton: 'button'
    }

    async getHeaderOfAddfield(): Promise<string> {
        return await $(this.selectors.addField).getText();
    }

    async navigateToDynamicFieldInCaseTemplate(caseTemplate: string): Promise<void> {
        await $('.data-dictionary-container input[role="searchbox"]').clear();
        await $('.data-dictionary-container input[role="searchbox"]').sendKeys(caseTemplate);
    }

    async navigateToDynamicFieldInTaskTemplate(fromTemplate: string) {
        await $('.data-dictionary-container input[role="searchbox"]').clear();
        await $('.data-dictionary-container input[role="searchbox"]').sendKeys(fromTemplate);
    }

    async clickOnCase(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable(await $$(this.selectors.parentFields).get(1)), 6000);
        await $$(this.selectors.parentFields).get(1).click();
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
        let taskBoxesCount: number = await $$(this.selectors.fieldVariable).count();
        for (let i: number = 0; i < taskBoxesCount; i++) {
            if (await $$(this.selectors.fieldVariable).get(i).getText() == value) {
                await $$(this.selectors.plusSymbol).get(i).click();
                break;
            }
        }
    }

    async clickOnGroupName(groupvalue: string): Promise<void> {
        let taskBoxesCount: number = await $$(this.selectors.parentFields).count();
        for (let i: number = 0; i < taskBoxesCount; i++) {
            if (await $$(this.selectors.parentFields).get(i).getText() == groupvalue) {
                await $$(this.selectors.groupName).get(i).click();
                break;
            }
        }
    }

    async isCaseTemplatePresent(caseTemplateValue: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.parentFields, caseTemplateValue)).isPresent();
    }
    async setValueOfField(fromTree: string, value: string): Promise<void> {
        let countParent = await $$('.modal-body .ui-tree-selectable .a-tree__label adapt-highlight[title]').count();
        for (let i = 0; i < countParent; i++) {
            let getTextofparent = await $$('.modal-body .ui-tree-selectable .a-tree__label adapt-highlight[title]').get(i).getText();
            console.log('getTextofparent>>>>>', getTextofparent);
            if (getTextofparent == fromTree) {
                await $$('.modal-body .a-tree__toggle').get(i).click();
                await browser.sleep(3000);//Added becoz of slownees open the parent tree
                break;
            }
        }

        let countChild = await $$('.modal-body .ui-tree-selectable .expression-node-label').count();
        for (let i = 0; i < countChild; i++) {
            let getTextofChild = await $$('.modal-body .ui-tree-selectable .expression-node-label').get(i).getText();
            console.log('getTextofparent>>>>>', getTextofChild);
            if (getTextofChild == value) {
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