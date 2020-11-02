import { $, browser, by, element, protractor, ProtractorExpectedConditions, $$, Key } from "protractor";
import utilCommon from '../../../utils/util.common';


class CreateEmailTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="310bbc87-54ee-4994-9a1e-93b1982155f2"] input',
        templateGuid: '310bbc87-54ee-4994-9a1e-93b1982155f2',
        companyGuid: '92c503a8-8b80-49bc-88f1-8a2626b3f594',
        statusGuid: '3cfbfd34-19ff-4ddb-818b-23b19c859dbe',
        labelGuid: '44510e3a-6542-432a-82b1-433dd0cbf49f',
        descriptionGuid: '0fab6085-678b-442a-851d-25085b0bde8c',
        description: '[rx-view-component-id="0fab6085-678b-442a-851d-25085b0bde8c"] input',
        subjectGuid: '187510cc-9804-46e2-bbda-0cdba1d6c83c',
        subject: '[rx-view-component-id="187510cc-9804-46e2-bbda-0cdba1d6c83c"] textarea',
        body: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_editable',
        insertField: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_button__expressioneditor_icon',
        fieldValueInBody: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_wysiwyg_div span',
        tableIcon: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_toolbar .cke_button__table_icon',
        imageIcon: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_toolbar .cke_button__image_icon',
        linkIcon: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_toolbar .cke_button__link_icon',
        boldIcon: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_button__bold_icon',
        italicIcon: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_button__italic_icon',
        underLineIcon: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_button__underline_icon',
        leftAlignIcon: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_button__justifyleft_icon',
        centerAlignIcon: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_button__justifycenter_icon',
        rightAlignIcon: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_button__justifyright_icon',
        colorIcon: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_button__textcolor',
        fontType: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_combo__font',
        fontSize: '[rx-view-component-id="d898362f-92bb-495f-8d98-03f480c4864b"] .cke_combo__fontsize',
        saveButton: '[rx-view-component-id="093a0eeb-c1e0-4ed8-945f-da46d9bbde88"] button',
        cancelButton: '[rx-view-component-id="9aeef4d7-1a10-4ffd-aa3a-22665c32883c"] button',
        lineOfBusinessGuid: '14c47289-52da-433a-b297-de2e8a7402a0',
    }

    async setTemplateName(value: string): Promise<void> {
        await $(this.selectors.templateName).sendKeys(value);
    }

    async selectCompany(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.companyGuid, value);
    }

    async isCompanyRequiredTextPresent(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isTemplateRequiredTextPresent(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.templateGuid);
    }

    async islineOfBusinessRequiredTextPresent(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.lineOfBusinessGuid);
    }

    async isStatusRequiredTextPresent(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.statusGuid);
    }

    async isDescriptionRequiredTextPresent(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.descriptionGuid);
    }

    async isSubjectRequiredTextPresent(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.subjectGuid);
    }

    async selectStatusDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, value);
    }

    async selectLabelDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.labelGuid, value);
    }

    async setDescription(value: string): Promise<void> {
        await $(this.selectors.description).sendKeys(value);
    }

    async setSubject(value: string): Promise<void> {
        await $(this.selectors.subject).sendKeys(value);
    }

    async setFontBody(value: string): Promise<void> {
        await $(this.selectors.body).sendKeys(value);
    }
    async setBody(value: string): Promise<void> {
        await browser.sleep(1000); // required to load CKE component
        await $(this.selectors.body).sendKeys(Key.chord(Key.CONTROL, Key.END));
        await $(this.selectors.body).sendKeys(Key.ENTER);
        await $(this.selectors.body).sendKeys(value);
    }

    async clickOnInsertField(): Promise<void> {
        await $(this.selectors.insertField).click();
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async isDynamicFieldDisplayedInBody(value: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.fieldValueInBody, value)).isDisplayed();
    }

    async clickInTableRowOfEmailTemplate(row: number, column: number, summary: string): Promise<void> {
        let locator = `table[summary='${summary}'] tr`;
        let rowLocator = await $$(locator).get(row - 1);
        await rowLocator.$$('td').get(column - 1).click();
    }

    async setDataInEmailTemplateTable(row: number, column: number, value: string, summary: string): Promise<void> {
        let locator = `table[summary='${summary}'] tr`;
        let rowLocator = await $$(locator).get(row - 1);
        await rowLocator.$$('td').get(column - 1).sendKeys(value);
    }

    async clickOnTableIcon(): Promise<void> {
        await $(this.selectors.tableIcon).click();
        await browser.sleep(2000); // To Wait For Table Pop-up Gets Open.
    }

    async clickOnImageIcon(): Promise<void> {
        await $(this.selectors.imageIcon).click();
        await browser.sleep(2000); // To Wait For Image Pop-up Gets Open.
    }

    async clickOnLinkIcon(): Promise<void> {
        await $(this.selectors.linkIcon).click();
        await browser.sleep(2000); // To Wait Until Link Pop-Up Gets Open.
    }

    async clickOnBoldIcon(): Promise<void> {
        await $(this.selectors.boldIcon).click();
    }

    async clickOnItalicIcon(): Promise<void> {
        await $(this.selectors.italicIcon).click();
    }

    async clickOnUnderLineIcon(): Promise<void> {
        await $(this.selectors.underLineIcon).click();
    }

    async clickOnLeftAlignIcon(): Promise<void> {
        await $(this.selectors.leftAlignIcon).click();
    }

    async clickOnRightAlignIcon(): Promise<void> {
        await $(this.selectors.rightAlignIcon).click();
    }

    async clickOnCenterAlignIcon(): Promise<void> {
        await $(this.selectors.centerAlignIcon).click();
    }

    async selectColor(colorValue: string): Promise<void> {
        await $(this.selectors.colorIcon).click();
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('iframe.cke_panel_frame').getWebElement());
        let locator: string = `a[title="${colorValue}"]`;
        await browser.wait(this.EC.elementToBeClickable($(locator)), 2000);
        await $(locator).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async clickOnFontTypeIcon(): Promise<void> {
        await $(this.selectors.fontType).click();
    }

    async clickOnFontSizeIcon(): Promise<void> {
        await $(this.selectors.fontSize).click();
    }

    async selectFontTypeOrSize(value: string): Promise<void> {
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame($('.cke_panel.cke_combopanel iframe.cke_panel_frame').getWebElement());
        let locator = `a[title="${value}"]`;
        await browser.wait(this.EC.elementToBeClickable($(locator)), 4000);
        await $(locator).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

}
export default new CreateEmailTemplate();