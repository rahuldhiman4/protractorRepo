import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';
import utilGrid from '../../..//utils/util.grid';

class CreateEmailTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="a01af9fa-da73-44e5-a304-8f8c7632b1a0"] input',
        company: '[rx-view-component-id="af048482-fdf7-4650-ab4b-75e262e00445"] .ui-select-toggle',
        moduleName: '[rx-view-component-id="8107085d-334f-4d50-beb9-ad10d8911144"] .ui-select-toggle',
        statusGuid: 'a1e0042f-41e7-4c80-9cd8-014786f346e6',
        labelGuid: '38ba050c-eb47-44a7-9efc-c724302560bf',
        description: '[rx-view-component-id="f7437c9e-1ed7-4aac-974a-e4d4a643ee35"] input',
        localeGuid: '71db023a-4979-4f58-a026-6aeda2edd96b',
        localizeMessage: '[rx-view-component-id="88ea24dd-ddad-489f-904a-89e43f80f5e6"] button',
        searchButtonClick: '.rx-toggle-search-button',
        editButton: '[rx-view-component-id="08ce786a-01bb-410a-9ce2-7d10dccc28e2"] button',
        editMessageTextBladeSaveButton: '[rx-view-component-id="498a2cf3-8866-4303-996a-61dc33e4a400"] button',
        editMessageTextBladeCancelButton: '[rx-view-component-id="780514cc-7344-44a5-88af-5af509619ab0"] button',
        editMessageTextBladeBody: '.cke_wysiwyg_div',
        saveButton: '[rx-view-component-id="2a376fd7-bf9c-459b-bdf1-52456c5f972c"] button',
        cancelButton: '[rx-view-component-id="8fe0e727-14ac-4773-ba4d-03835070e907"] button',
        gridGuid: '8b59641c-2fca-4d96-8395-03e232cf05de',
    }


    async getSelectedGridRecordValue(columnHeader: string): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.gridGuid, columnHeader);
    }

    async clickOnGridSearchIcon(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchButtonClick)));
        await $(this.selectors.searchButtonClick).click();
    }

    async searchOnGridConsole(value: string): Promise<void> {
        await utilGrid.searchOnGridConsole(value);
        await utilCommon.waitUntilSpinnerToHide();
    }

    async searchAndSelectGridRecord(value:string): Promise<void> {
        await utilGrid.searchAndSelectGridRecord(value);
    }

    async updateTemplateName(templateName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        await $(this.selectors.templateName).clear();
        await $(this.selectors.templateName).sendKeys(templateName);
    }

    async isModuleNameDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.moduleName)));
        return await $(this.selectors.moduleName).getAttribute("disabled")=="true";
    }
    
    async isCompanyDropDownDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.company)));
        return await $(this.selectors.company).getAttribute("disabled")=="true";
    }

    async isLocalizedMessageButtonDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.localizeMessage)));
        return await $(this.selectors.localizeMessage).isDisplayed();
    }

    async selectStatusDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, value);
    }

    async selectLabelDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.labelGuid, value);
    }

    async updateDescription(descriptionText: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.description)));
        await $(this.selectors.description).clear();
        await $(this.selectors.description).sendKeys(descriptionText);
    }

    async selectlocaleDropDown(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.localeGuid, value);
    }

    async updateEditMessageTextBladeBody(body: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editMessageTextBladeBody)));
        await $(this.selectors.editMessageTextBladeBody).clear();
        await $(this.selectors.editMessageTextBladeBody).sendKeys(body);
    }

    async clickOnEditMessageTextBladeCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editMessageTextBladeCancelButton)));
        await $(this.selectors.editMessageTextBladeCancelButton).click();
    }


    async clickOnSaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }
}

export default new CreateEmailTemplateBlade();
