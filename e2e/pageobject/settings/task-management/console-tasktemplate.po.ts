import { $, browser, by, element, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class TaskTemplateGridPage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        manualTaskTemplateButton: '[rx-view-component-id="6843466b-bf58-47d1-baf4-97b3c9be4598"] button',
        automationtaskTemplateButton: '[rx-view-component-id="847d80e6-19ca-46ef-b01a-5a3581f784d7"] button',
        externalTaskTemplateButton: '[rx-view-component-id="df859ce0-47e3-4b61-937d-8d7ff3b64c0a"] button',
        copyTaskTemplate: '[rx-view-component-id="48afba80-4d39-4c1a-a420-1c01992cd937"] button',
        searchTemplate: '[rx-id="search-text-input"]',
        recommendedTemplateLink: '.ui-grid__link',
        recommendedTemplateCheckBox: '.ui-grid-icon-ok',
        filter: '.rx-search-filter__trigger',
        availableFilterDrpDown: '.d-accordion__title',
        applyFilter: '.rx-search-filter-heading__apply',
        removeFilter: '..d-tag-remove-button',
    }

    async setTaskSearchBoxValue(input: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchTemplate)));
        await $(this.selectors.searchTemplate).clear();
        await $(this.selectors.searchTemplate).sendKeys(input, Key.ENTER);
        await utilCommon.waitUntilPopUpDisappear();
    }

    async clickFirstLinkInTaskTemplateSearchGrid(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedTemplateLink)));
        await browser.sleep(3000);
        await $(this.selectors.recommendedTemplateLink).click();
    }
    async clickFirstCheckBoxInTaskTemplateSearchGrid(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.recommendedTemplateCheckBox)));
        await browser.sleep(3000);
        await $(this.selectors.recommendedTemplateCheckBox).click();
    }
    async clickOnManualTaskTemplateButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.manualTaskTemplateButton)));
        await $(this.selectors.manualTaskTemplateButton).click();
    }

    async clickOnAutomationTaskTemplateButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.automationtaskTemplateButton)));
        await browser.sleep(2000);
        await $(this.selectors.automationtaskTemplateButton).click();
    }

    async clickOnExtrnalTaskTemplateButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.externalTaskTemplateButton)));
        await $(this.selectors.externalTaskTemplateButton).click();
    }

    async clickOnCopyTaskTemplateButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.copyTaskTemplate)));
        await $(this.selectors.copyTaskTemplate).click();
    }

    async clickOnApplyFilter(filterName: string, filtervalue: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filter)));
        await $(this.selectors.filter).click();
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText(this.selectors.availableFilterDrpDown, filterName))));
        await element(by.cssContainingText(this.selectors.availableFilterDrpDown, filterName)).click();
        if (filterName.localeCompare('Task Type') == 0 || filterName.localeCompare('Template Status')) {
            const dropDown = await $(`[title="${filtervalue}"]`);
            await $(dropDown).click();
        } else {
            const dropDown = await $(`[title="${filterName}"]`);
            await $(dropDown).sendKeys(filtervalue, Key.ENTER);
        }
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.applyFilter)));
        await $(this.selectors.applyFilter).click();
    }

    async isFilterNamePresent(filterName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filter)));
        await $(this.selectors.filter).click();
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText(this.selectors.availableFilterDrpDown, filterName))));
        await element(by.cssContainingText(this.selectors.availableFilterDrpDown, filterName)).isDisplayed();
    }

    async isFilteredTemplateDisplayed(filterName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText(this.selectors.recommendedTemplateLink, filterName))));
        await element(by.cssContainingText(this.selectors.recommendedTemplateLink, filterName)).click();
    }
}
export default new TaskTemplateGridPage();