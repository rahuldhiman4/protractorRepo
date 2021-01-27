import utilityCommon from '../../../utils/utility.common';
import { $, by, element, protractor, ProtractorExpectedConditions } from 'protractor';

class LobManagementConsole {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        description: '[rx-view-component-id="1a01949f-09d1-4669-927b-436cb235cd1b"] textarea',
        name: '[rx-view-component-id="edc20274-25e9-47c4-915d-b040bcaefbc3"] input',
        statusGuid: '3ff3ba0c-cb35-4d56-a00f-e07584e9b9b6',
        saveButton: '[rx-view-component-id="50cdff94-a333-48d6-a006-3deb0ac46631"] button',
        cancelButton: '[rx-view-component-id="42d7971f-f8a5-4b85-acfe-990f7bcdb5ba"] button',
        tab: '[rx-view-component-id="29ec57f5-3759-4125-a6be-6f053045e087"] li a[data-toggle="tab"]',
        lobBundleName: '[rx-view-component-id="a2b20912-c87d-4a4a-b5fd-2ce2086ca2ce"] .left-align-label .btn-link'
    }

    async setLobName(lobName: string): Promise<void> {
        await $(this.selectors.name).clear();
        await $(this.selectors.name).sendKeys(lobName);
    }

    async setLobDescription(lobDescription: string): Promise<void> {
        await $(this.selectors.description).clear();
        await $(this.selectors.description).sendKeys(lobDescription);
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async selectStatus(status: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async isTabPresent(giventab: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.tab, giventab)).isPresent().then(async (result) => {
            if (result) return element(by.cssContainingText(this.selectors.tab, giventab)).isDisplayed();
            else return null;
        });
    }

    async isLobBundleDisabled(): Promise<string> {
        return await $(this.selectors.lobBundleName).getAttribute('disabled');
    }

}

export default new LobManagementConsole();