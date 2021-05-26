import { $, browser, protractor, ProtractorExpectedConditions, element, by } from "protractor";
import utilityCommon from "../../../utils/utility.common";
import consoleNoteTemplate from './console-notestemplate.po';

class createNotesTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="438e2c9d-b937-4ab5-8718-7ddb98073ee6"] input',
        status: 'a6f36df8-bb54-405f-ab71-7ac3b4b3e71d',
        company: '8072a3c4-6972-4760-86be-d5526dac8c8d',
        language: '951065ca-a003-4465-aed5-9623a689fd4f',
        insertField: '.cke_button__rtfexpressioneditor_icon',
        body: '.cke_wysiwyg_div',
        saveButton: '[rx-view-component-id="d735ac20-de9c-4b76-a226-2d9c577d4bd0"] button',
        cancelButton: '[rx-view-component-id="85dcb9ba-5367-4f65-8613-920291ce4786"] button',
        statusDD: '[rx-view-component-id="a6f36df8-bb54-405f-ab71-7ac3b4b3e71d"] button',
        companyDD: '[rx-view-component-id="8072a3c4-6972-4760-86be-d5526dac8c8d"] button',
        languageDD: '[rx-view-component-id="951065ca-a003-4465-aed5-9623a689fd4f"] button',
        fieldValueInBody:'[rx-view-component-id="55da6dac-fe85-435e-9937-5b917d4b7971"] .cke_wysiwyg_div span',
        lobValue: '[rx-view-component-id="efe5a0b6-8fd5-4677-9048-0cdb8a6e661e"] .rx-select__search-button-title'
    }

    async setTemplateName(templateNameValue: string): Promise<void> {
        await $(this.selectors.templateName).clear();
        await $(this.selectors.templateName).sendKeys(templateNameValue);
    }

    async setStatusValue(statusValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.status, statusValue);
    }

    async setCompanyValue(companyValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.company, companyValue);
    }

    async setLanguageValue(languageValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.language, languageValue);
    }

    async setLabelValue(labelValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.status, labelValue);
    }

    async setBody(bodyValue: string): Promise<void> {
        await $(this.selectors.body).sendKeys(bodyValue);
    }

    async clickOnInsertFieldLink(): Promise<void> {
        await $(this.selectors.insertField).click();
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async isSaveButtonDisabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }

    async createNotesTemplate(companyValue: string): Promise<string> {
        await consoleNoteTemplate.clickOnCreateNotesTemplate();
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await this.setTemplateName(randomStr);
        await this.setCompanyValue(companyValue);
        await this.setStatusValue('Active');
        await this.setLanguageValue('English (United States)');
        await this.setBody("This is new notes template " + randomStr);
        await this.clickOnSaveButton();
    //    await utilityCommon.closePopUpMessage();
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.settingsButton)));
        return randomStr;
    }

    async isCreateNotesTemplateUIPresent(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.templateName)));
        let a: boolean = await $(this.selectors.templateName).isDisplayed();
//        await browser.wait(this.EC.visibilityOf($(this.selectors.insertField)));
        let b: boolean = await $(this.selectors.insertField).isDisplayed();
//        await browser.wait(this.EC.visibilityOf($(this.selectors.body)));
        let c: boolean = await $(this.selectors.body).isDisplayed();
//        await browser.wait(this.EC.visibilityOf($(this.selectors.cancelButton)));
        let d: boolean = await $(this.selectors.cancelButton).isDisplayed();
//        await browser.wait(this.EC.visibilityOf($(this.selectors.statusDD)));
        let e: boolean = await $(this.selectors.statusDD).isDisplayed();
//        await browser.wait(this.EC.visibilityOf($(this.selectors.companyDD)));
        let f: boolean = await $(this.selectors.companyDD).isDisplayed();
//        await browser.wait(this.EC.visibilityOf($(this.selectors.languageDD)));
        let g: boolean = await $(this.selectors.languageDD).isDisplayed();
        await $(this.selectors.cancelButton).click();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.settingsButton)));
        return (a == b == c == d == e == f == g == true);
    }

    async isDynamicFieldDisplayedInBody(value:string):Promise<boolean>{
        return await element(by.cssContainingText(this.selectors.fieldValueInBody, value)).isDisplayed();
    }

    async clickCancelButton():Promise<void>{
        await $(this.selectors.cancelButton).click();
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}
export default new createNotesTemplate();