import { $, $$, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class QuickCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        smartSearchTextBox: '.smart-recorder-textarea',
        confirmedItemSelection: '.smart-recorder-confirmedItem_header',
        searchResult: '.smart-recorder__popup-item-email',
        caseTemplate: '.smart-recorder__popup-item-highlight',
        createCaseButton: '[rx-view-component-id="2b9a3989-5461-4196-9cd9-fe7a1cdf6eb2"] .smart-recorder__footer button.d-button_primary',
        gotoCaseButton: '[rx-view-component-id="529287cb-4d9d-4729-aa6c-5676980df72e"] button',
        validateButton: '[rx-view-component-id="390a77cd-518e-4d67-abb4-bc4d410ce3df"] button',
        pinValidateInput: '[rx-view-component-id="bfe9a8e0-26e7-43a5-9561-1c92539bdda3"] input',
        pinOk: '[rx-view-component-id="ea1b7291-a0de-47d6-9239-cccf6b850a86"] button',
        popUpMsgLocator: '.rx-growl-item__message',
        smartSearchText: '.smart-recorder-highlightPerfectMatch'
    }

    async setAndSelectRequesterName(name: string): Promise<void> {
        name = "@" + name;
        await browser.wait(this.EC.visibilityOf($(this.selectors.smartSearchTextBox)));
        await $(this.selectors.smartSearchTextBox).sendKeys(name);
        await browser.wait(this.EC.visibilityOf($$(this.selectors.searchResult).first()));
        await $$(this.selectors.searchResult).first().click();
    }

    async setCaseSummary(summary: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.smartSearchTextBox)));
        await $(this.selectors.smartSearchTextBox).sendKeys(summary);
    }

    async getRequester(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($$(this.selectors.smartSearchText).first()));
        return await $$(this.selectors.smartSearchText).first().getText();
    }

    async validatePersonAndHisRelation(relationType: string): Promise<string> {
        let employee: string;
        let elementCount = await $$(this.selectors.confirmedItemSelection).count();
        for (let i = 0; i < elementCount; i++) {
            let actualRelationType = await $$(this.selectors.confirmedItemSelection).get(i).$('button').getText();
            if (actualRelationType == relationType) {
                employee = await $$(this.selectors.confirmedItemSelection).get(i).$('.smart-recorder-confirmedItem-selection+div').getText();
                break;
            }
        }
        return employee;
    }

    async isSummOrDescPopulatedAtSmartTextArea(text: string): Promise<number> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.smartSearchTextBox)));
        let flag: number = (await $(this.selectors.smartSearchTextBox).getText()).search(text);
        //-1 is returned as a flag, if text fetched through the locator doesn't consist of the 'text' passed
        return flag;
    }

    async verifyQuickCasePageAsEmpty(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.smartSearchTextBox)));
        await expect($(this.selectors.smartSearchTextBox).getText()).toEqual("");
    }

    async isCreateButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.createCaseButton)));
        return await $(this.selectors.createCaseButton).getAttribute("disabled") == "true";
    }

    async createCaseButton(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.createCaseButton)));
        await $(this.selectors.createCaseButton).click();        
    }

    async gotoCaseButton(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.gotoCaseButton)));
        await $(this.selectors.gotoCaseButton).click();
        await utilCommon.waitUntilSpinnerToHide();        
    }

    async getPopUpMessage() {
        await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)));
        return await $(this.selectors.popUpMsgLocator).getText();
    }
}

export default new QuickCasePage();