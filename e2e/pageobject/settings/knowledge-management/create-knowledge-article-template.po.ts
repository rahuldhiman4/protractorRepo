import { $$, $, protractor, ProtractorExpectedConditions, element, by } from "protractor";

class CreateKATemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        templateName: 'input[autofocus]',
        disabledEnabledCheck: 'div.template-attributes div:nth-of-type(2) [type="checkbox"]',
        addsection: 'div.editor-button-group .btn-link',
        sectionTitle: 'div.card-block input',
        templateDescription: 'textarea.ng-star-inserted',
        saveButton: 'button.btn-primary',
        removeSection: '.d-icon-left-cross_adapt',
        cancelBtn: 'div.modal-footer .btn-secondary',
        upArrowCollapse: '.tab-caret',
        downArrowExpand: '.tab-caret',
        expandCollapseAllBtn: '.editor-button-toggle button',
        lobValue: '[aria-label="Line of Business"] .rx-select__search-button-title',
        field: 'label.form-control-label span'
    }

    async setTemplateName(value: string): Promise<void> {
        await $(this.selectors.templateName).sendKeys(value);
    }

    async setDescription(value: string): Promise<void> {
        await $(this.selectors.templateDescription).sendKeys(value);
    }

    async clickOnDisableEnableCheckBox(): Promise<void> {
        await $(this.selectors.disabledEnabledCheck).click();
    }

    async clickOnAddSection(): Promise<void> {
        await $(this.selectors.addsection).click();
    }

    async setSectionTitle(value: string, position?: number): Promise<void> {
        if (position) {
            await $$(this.selectors.sectionTitle).get(position - 1).clear();
            await $$(this.selectors.sectionTitle).get(position - 1).sendKeys(value);
        }
        else {
            await $(this.selectors.sectionTitle).clear();
            await $(this.selectors.sectionTitle).sendKeys(value);
            }
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickRemoveSection(): Promise<void> {
        await $(this.selectors.removeSection).click();
    }

    async clickCancelBtn(): Promise<void> {
        await $(this.selectors.cancelBtn).click();
    }

    async collapseFirstSection(): Promise<void> {
        await $(this.selectors.upArrowCollapse).click();
    }

    async expandFirstSection(): Promise<void> {
        await $(this.selectors.downArrowExpand).click();
    }

    async isSectionVisible(position?: number): Promise<boolean> {
        if (position) return await $$(this.selectors.sectionTitle).get(position - 1).isDisplayed();
        else return await $$(this.selectors.sectionTitle).get(0).isDisplayed();
    }

    async clickCollapseAll(): Promise<void> {
        await $$(this.selectors.expandCollapseAllBtn).get(1).click();
    }

    async clickExpandAll(): Promise<void> {
        await $$(this.selectors.expandCollapseAllBtn).get(0).click();
    }

    async getfieldLabel(fieldName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.field, fieldName)).isPresent().then(async (result) => {
            if (result) {
                return await element(by.cssContainingText(this.selectors.field, fieldName)).isDisplayed();
            } else return false;
        });
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}
export default new CreateKATemplate();