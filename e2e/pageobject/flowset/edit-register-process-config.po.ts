import { $, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../utils/util.grid';
import utilCommon from '../../utils/util.common';

class EditRegisterProcessPage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        aliasName: '[rx-view-component-id="1b614b5b-402f-441b-8f5d-a034c7ebaef1"] input',
        description: '[rx-view-component-id="f89ac9af-1e00-4bf3-9acc-79886e541b4d"] textarea',
        statusGuid: '82350ab4-c2fb-4c35-9481-b5db8e85aa6f',
        saveButton: '[rx-view-component-id="03d04373-17d2-4b19-af55-1a26e04ee7f1"] button',
        summaryField1: 'input[role="search"]',
        searchButton1: 'button[rx-id="submit-search-button"]',
    }

    async setAliasName(alias: string): Promise<void> {
        await $(this.selectors.aliasName).clear();
        await $(this.selectors.aliasName).sendKeys(alias);
    }

    async isAliasNamePresentOnGrid(alias: string): Promise<boolean> {
        await utilGrid.searchOnGridConsole(alias);
        return await element(by.cssContainingText('.ui-grid__link', alias)).getText() == alias ? true : false;
    }

    async searchAndGetDescription(description: string): Promise<string> {
        return await element(by.cssContainingText('.ui-grid-cell-contents', description)).getText();
    }

    async getDescription(description: string): Promise<string> {
        return await element(by.cssContainingText('.ui-grid-cell-contents', description)).getText();
    }

    async isProcessPresentOnGrid(process: string): Promise<boolean> {
        return await element(by.cssContainingText('.ui-grid-cell-contents', process)).getText() == process ? true : false;
    }

    async setDescription(description: string): Promise<void> {
        await $(this.selectors.description).clear();
        await $(this.selectors.description).sendKeys(description);
    }

    async selectStatus(status: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }
}

export default new EditRegisterProcessPage();