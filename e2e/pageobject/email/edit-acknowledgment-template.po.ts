import { ProtractorExpectedConditions, protractor, browser, $, $$, element, by, Key } from "protractor"
import commonUtils from "../../utils/util.common";
import utilsGrid from "../../utils/util.grid";
import { resolve } from 'path';
import utilCommon from '../../utils/util.common';

class EditAcknowledgementTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="a01af9fa-da73-44e5-a304-8f8c7632b1a0"] input',
        description: '[rx-view-component-id="f7437c9e-1ed7-4aac-974a-e4d4a643ee35"] input',
        moduleName: '[rx-view-component-id="8107085d-334f-4d50-beb9-ad10d8911144"]  .ui-select-match-text',
        company: '[rx-view-component-id="af048482-fdf7-4650-ab4b-75e262e00445"]  .ui-select-match-text',
        status: '[rx-view-component-id="a1e0042f-41e7-4c80-9cd8-014786f346e6"]  .ui-select-match-text',
        searchButton: '.rx-toggle-search-button',
        searchGuid: '8b59641c-2fca-4d96-8395-03e232cf05de'


    }

    async getTemplateName(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        var newInput = $(this.selectors.templateName);
        $(this.selectors.templateName).click();
        let templateName = await newInput.getAttribute('value');
        return templateName;
    }

    async getDescription(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.description)));
        var newInput = $(this.selectors.description);
        $(this.selectors.description).click();
        let templateName = await newInput.getAttribute('value');
        return templateName;
    }

    async getModuleName(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.moduleName)));
        return $(this.selectors.moduleName).getText();
    }

    async getCompanyName(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.company)));
        return $(this.selectors.company).getText();
    }

    async getStatusValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.status)));
        return $(this.selectors.status).getText();
    }

    async getSubjectMessageValue(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchButton)));
        $(this.selectors.searchButton).click();
        await utilsGrid.searchAndSelectFirstCheckBox('8b59641c-2fca-4d96-8395-03e232cf05de', 'subject')
        return await utilsGrid.getSelectedGridRecordValue('8b59641c-2fca-4d96-8395-03e232cf05de', 'Message');
    }

    async getBodyMessageValue(): Promise<string> {
        return await utilsGrid.getSelectedGridRecordValue('8b59641c-2fca-4d96-8395-03e232cf05de', 'Message');
    }


    async searchAndSelectEmailTemplate(value: string): Promise<void> {
        await utilsGrid.searchAndSelectFirstCheckBoxWOGrid(value);
    }

    async searchAndSelectBody(value: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchButton)));
        $(this.selectors.searchButton).click();
        await utilsGrid.searchAndSelectGridRecord(value, '8b59641c-2fca-4d96-8395-03e232cf05de');

    }

}

export default new EditAcknowledgementTemplate();