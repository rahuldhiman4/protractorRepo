import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';
import navigationPage from "../../pageobject/common/navigation.po";
import createCasePo from "../../pageobject/case/create-case.po";

class QuickCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        drpdownHeader: '.dropdown-input__button',
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
        requester: '[rx-view-component-id="2b9a3989-5461-4196-9cd9-fe7a1cdf6eb2"] .ac-person-full-name',
        arrowFirstRecommendedCase: '[role="listitem"] .km-group-list-item__preview-icon',
        arrowFirstRecommendedKnowledge: '.km-group [role="listitem"] .km-group-list-item__preview-icon',
        roleDropDown: '.smart-recorder-confirmedItem-selection button',
        sourceValue: '.ui-select-toggle .ui-select-match-text',
        roleValue: '.smart-recorder-selectionItem li a',
        descriptionText: '.smart-input-label_big',
        resources: '.smart-search-placeholder-text',
        startOverButton: '.smart-recorder__footer button.d-button_secondary',
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

    async isRecommendedKnowledgeEmpty(): Promise<boolean> {
        return await $$('.km-group .km-group-list-item_empty').get(1).isPresent();
    }

    async isCaseSummaryPresentInRecommendedCases(caseSummary: string): Promise<boolean> {
        return await $$('.km-group').get(2).$$(`div[title="${caseSummary}"]`).isPresent();

    }

    async getDrpDownValueByIndex(indexValue: number): Promise<string> {
        return await $$(this.selectors.drpdownHeader).get(indexValue - 1).getText();
    }

    async selectDrpDownValueByIndex(value: string, indexValue: number): Promise<void> {
        await $$(this.selectors.drpdownHeader).get(indexValue - 1).click();
        let option = await element(by.cssContainingText('.dropdown-item', value));
        await browser.wait(this.EC.elementToBeClickable(option), 3000).then(async () => {
            await option.click();
        });
    }

    async selectRequesterName(name: string): Promise<void> {
        let namenew = "@" + name;
        //await $(this.selectors.inputBox).clear();
        // await browser.wait(this.EC.visibilityOf($(this.selectors.inputBox)));
        await $(this.selectors.inputBox).sendKeys(namenew);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.requesters)), 3000);
        await $$(this.selectors.requesters).first().click();
    }

    async setCaseSummary(summary: string): Promise<void> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.smartSearchTextBox)));
        await $(this.selectors.smartSearchTextBox).sendKeys(summary);
    }

    async clearInputBox(): Promise<void> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.smartSearchTextBox)));
        await $(this.selectors.inputBox).clear();
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

    async clickArrowFirstRecommendedCase(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.pinFirstRecommendedCase))));
        await element(by.xpath(this.selectors.arrowFirstRecommendedCase)).click();
    }

    async clickArrowFirstRecommendedKnowledge(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.pinFirstRecommendedCase))));
        await element(by.xpath(this.selectors.arrowFirstRecommendedKnowledge)).click();
    }

    async saveCase(): Promise<void> {
        await $(this.selectors.createCaseButton).click();
       // await browser.wait(this.EC.visibilityOf($(this.selectors.gotoCaseButton__preview)));
    }

    async selectCaseTemplate(templateName: string): Promise<boolean> {
        let success: boolean = false;
        for (let i: number = 0; i <= 5; i++) {
            browser.sleep(5 * 1000);
            let template: string = "!" + templateName;
            await $(this.selectors.inputBox).sendKeys(template);
            success = await browser.element(by.cssContainingText(this.selectors.caseTemplate, templateName)).isPresent().then(async (result) => {
                if (result) {
                    await browser.element(by.cssContainingText(this.selectors.caseTemplate, templateName)).click();
                    return true;
                } else false;
            });
            if (success) break;
            else {
                for (let j: number = 0; j < template.length; j++) {
                    await $(this.selectors.inputBox).sendKeys(protractor.Key.BACK_SPACE);
                }
                continue;
            }
        }
        return success;
    }

    async validatePin(): Promise<void> {
        // await browser.wait(this.EC.visibilityOf($(this.selectors.validateButton)));
        await $(this.selectors.validateButton).click();
        // await browser.wait(this.EC.visibilityOf($(this.selectors.pinValidateInput)));
        await $(this.selectors.pinValidateInput).sendKeys("1234");
        await $(this.selectors.pinOk).click();

    }

    async getDescriptionDetails(): Promise<string> {
        return await $(this.selectors.descriptionText).getAttribute('aria-label');
    }

    async getResourcesText(): Promise<string> {
        return await $(this.selectors.resources).getText();
    }

    async selectRoleValue(value: string): Promise<void> {
        await $(this.selectors.roleDropDown).click();
        await browser.element(by.cssContainingText(this.selectors.roleValue, value)).click();
    }

    async isValuePresentInSourceDropDown(value: string): Promise<boolean> {
        await $(this.selectors.sourceValue).click();
        let dropdownValues: number = await $(this.selectors.sourceValue).count();
        for (let i = 0; i < dropdownValues; i++) {
            let souceValue = await $(this.selectors.sourceValue).get(i).getText();
            if (souceValue == value) {
                return true;
            }
        }
        return false;
    }

    async selectSourceValue(value: string): Promise<void> {
        await $(this.selectors.sourceValue).click();
        await browser.element(by.cssContainingText(this.selectors.sourceValue, value)).click();
    }

    async getSelectedSourceValue(): Promise<string> {
        return await $(this.selectors.sourceValue).getText();
    }

    async clickStartOverButton(): Promise<void> {
        await $(this.selectors.startOverButton).click();
    }
}

export default new QuickCasePage();