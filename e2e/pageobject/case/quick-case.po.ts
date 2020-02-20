import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class QuickCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        smartSearchTextBox: '.smart-recorder-textarea',
        confirmedItemSelection: '.smart-recorder-confirmedItem_header',
        searchResult: '.smart-recorder__popup-item-email',
        caseTemplate: '.smart-recorder__popup-item-col .smart-recorder__popup-item-highlight',
        gotoCaseButton: '[rx-view-component-id="529287cb-4d9d-4729-aa6c-5676980df72e"] button',
        validateButton: '[rx-view-component-id="390a77cd-518e-4d67-abb4-bc4d410ce3df"] button',
        pinValidateInput: '[rx-view-component-id="bfe9a8e0-26e7-43a5-9561-1c92539bdda3"] input',
        pinOk: '[rx-view-component-id="ea1b7291-a0de-47d6-9239-cccf6b850a86"] button',
        popUpMsgLocator: '.rx-growl-item__message',
        inputBox: '.smart-recorder-textarea',
        smartSearchText: '.smart-recorder-highlightPerfectMatch',
        gotoCaseButton__preview: '[rx-view-component-id="529287cb-4d9d-4729-aa6c-5676980df72e"] button',
        createCaseButton: '.smart-recorder__footer button.d-button_primary',
        requesters: '.smart-recorder__popup-item',
        pinFirstRecommendedCase: '(//*[contains(text(), "Recommended Cases")]/..//i)[1]',
        requester: '[rx-view-component-id="2b9a3989-5461-4196-9cd9-fe7a1cdf6eb2"] .ac-person-full-name'
    }

    async pinRecommendedKnowledgeArticles(numberOfArticles: number): Promise<void> {
        for (let i = 0; i < numberOfArticles; i++) {
            await $$('.km-group').get(1).$$('i[role="checkbox"]').get(i).click();
        }
    }

    async pinRecommendedCases(numberOfCases: number): Promise<void> {
        for (let i = 0; i < numberOfCases; i++) {
            await $$('.km-group').get(2).$$('i[role="checkbox"]').get(i).click();
        }
    }

    async selectRequesterName(name: string): Promise<void> {
        let namenew = "@" + name;
        // await browser.wait(this.EC.visibilityOf($(this.selectors.inputBox)));
        await $(this.selectors.inputBox).sendKeys(namenew);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.requesters)), 3000);
        await $$(this.selectors.requesters).first().click();
    }

    async setCaseSummary(summary: string): Promise<void> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.smartSearchTextBox)));
        await $(this.selectors.smartSearchTextBox).sendKeys(summary);
    }

    async getRequester(): Promise<string> {
        //await browser.wait(this.EC.visibilityOf($$(this.selectors.smartSearchText).first()));
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
        // await browser.wait(this.EC.visibilityOf($(this.selectors.smartSearchTextBox)));
        let flag: number = (await $(this.selectors.smartSearchTextBox).getText()).search(text);
        //-1 is returned as a flag, if text fetched through the locator doesn't consist of the 'text' passed
        return flag;
    }

    async getTextOfSummaryTextBox(): Promise<string> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.smartSearchTextBox)));
        return await $(this.selectors.smartSearchTextBox).getText();
    }

    async isCreateButtonDisabled(): Promise<boolean> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.createCaseButton)));
        return await $(this.selectors.createCaseButton).getAttribute("disabled") == "true";
    }

    async createCaseButton(): Promise<void> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.createCaseButton)));
        await $(this.selectors.createCaseButton).click();
    }

    async gotoCaseButton(): Promise<void> {
        // await browser.wait(this.EC.visibilityOf($(this.selectors.gotoCaseButton)));
        await $(this.selectors.gotoCaseButton).click();
        // await utilCommon.waitUntilSpinnerToHide();
    }

    async getPopUpMessage() {
        // await browser.wait(this.EC.visibilityOf($(this.selectors.popUpMsgLocator)));
        return await $(this.selectors.popUpMsgLocator).getText();
    }

    async pinFirstRecommendedCase(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.pinFirstRecommendedCase))));
        await element(by.xpath(this.selectors.pinFirstRecommendedCase)).click();
    }

    async saveCase(): Promise<void> {
        await $(this.selectors.createCaseButton).click();
        // await browser.wait(this.EC.visibilityOf($(this.selectors.gotoCaseButton__preview)));
    }

    async selectCaseTemplate(templateName: string): Promise<void> {
        await $(this.selectors.inputBox).sendKeys('!');
        await $(this.selectors.inputBox).sendKeys(templateName);
        await browser.wait(this.EC.or(async () => {
            let count = await $$(this.selectors.caseTemplate).count();
            return count >= 1;
        }), 2000);
        await browser.element(by.cssContainingText(this.selectors.caseTemplate, templateName)).click();
    }

    async validatePin(): Promise<void> {
        // await browser.wait(this.EC.visibilityOf($(this.selectors.validateButton)));
        await $(this.selectors.validateButton).click();
        // await browser.wait(this.EC.visibilityOf($(this.selectors.pinValidateInput)));
        await $(this.selectors.pinValidateInput).sendKeys("1234");
        await $(this.selectors.pinOk).click();

    }
}

export default new QuickCasePage();