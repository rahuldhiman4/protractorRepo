import { $, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class EditRegisterProcessPage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        aliasName: '[rx-view-component-id="1b614b5b-402f-441b-8f5d-a034c7ebaef1"] input',
        description: '[rx-view-component-id="f89ac9af-1e00-4bf3-9acc-79886e541b4d"] textarea',
        statusGuid: '82350ab4-c2fb-4c35-9481-b5db8e85aa6f',
        saveButton: '[rx-view-component-id="03d04373-17d2-4b19-af55-1a26e04ee7f1"] button',
        summaryField1: 'input[role="search"]',
        searchButton1: 'button[rx-id="submit-search-button"]',//not found
        cancelButton: '[rx-view-component-id="65530a7e-0b78-471c-b355-4196f98a3baa"] button'
    }

    async setAliasName(alias: string): Promise<void> {
        await $(this.selectors.aliasName).clear();
        await $(this.selectors.aliasName).sendKeys(alias);
    }
   
    async searchAndGetDescription(description: string): Promise<string> {
        return await element(by.cssContainingText('.at-data-cell', description)).getText();
    }

    async getDescription(description: string): Promise<string> {
        return await element(by.cssContainingText('.at-data-cell', description)).getText();
    }

    async setDescription(description: string): Promise<void> {
        await $(this.selectors.description).clear();
        await $(this.selectors.description).sendKeys(description);
    }

    async selectStatus(status: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

}

export default new EditRegisterProcessPage();