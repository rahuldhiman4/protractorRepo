import { $$, $, protractor, ProtractorExpectedConditions, element, by } from "protractor";

class CreateKATemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        templateName: '[name="templateName"]',
        knowledgeSet: '[name="knowledgeSet"]',
        disabledEnabledCheck: 'div.templateAttributes div:nth-of-type(2) .d-checkbox__item',
        addsection:'.d-icon-left-plus_circle',
        sectionTitle:'.rx-template-editor-text-fields input',
        templateDescription:'.d-textfield textarea',
        saveButton: 'button[type="submit"]',
        removeSection:'.remove-button',
        cancelBtn: '.template-editor-action-buttons button.d-button_secondary',
        upArrowCollapse: '.d-icon-right-angle_up',
        downArrowExpand: '.d-icon-right-angle_down',
        expandCollapseAllBtn: '.expand-collapse-buttons button',
    }

    async setTemplateName(value:string): Promise<void> {
        await $(this.selectors.templateName).sendKeys(value);
    }

    async setDescription(value:string): Promise<void> {
        await $(this.selectors.templateDescription).sendKeys(value);
    }

    async setKnowledgeSetValue(value:string): Promise<void> {
        await $(this.selectors.knowledgeSet).click();
        let customXpath=`[title='${value}']`;
        await $(customXpath).click();
    }

    async clickOnDisableEnableCheckBox(): Promise<void> {
        await $(this.selectors.disabledEnabledCheck).click();
    }

    async clickOnAddSection(): Promise<void> {
        await $(this.selectors.addsection).click();
    }

    async setSectionTitle(value:string, position?: number):Promise<void>{
        if(position) await $$(this.selectors.sectionTitle).get(position-1).sendKeys(value);
        else await $(this.selectors.sectionTitle).sendKeys(value);
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
        if(position) return await $$(this.selectors.sectionTitle).get(position-1).isDisplayed();
        else return await $$(this.selectors.sectionTitle).get(0).isDisplayed();
    }

    async clickCollapseAll(): Promise<void> {
        await $$(this.selectors.expandCollapseAllBtn).get(1).click();
    }

    async clickExpandAll(): Promise<void> {
        await $$(this.selectors.expandCollapseAllBtn).get(0).click();
    }

    async getfieldLabel(fieldName: string): Promise<string> {
        let fieldLocator = `[aria-label="${fieldName}"] .d-textfield__item`;
        return await $(fieldLocator).getText();
    }
}
export default new CreateKATemplate();