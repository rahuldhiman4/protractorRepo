import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class StatusConfigPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editLifeCycleButton: 'button.font-weight-bold',
        localizeButton: 'button.btn-localize',
        newStatusInput: '.modal input',
        statusAddModalBtns: '.modal-content .status-settings_button-bar button',
        settingPanelButtons: '.footer button[adapt-button]',
        localizedBtn: '.rx-template-editor-text-fields .d-icon-field_text_mapmarker',
        localizeMenuButtons: '.modal button[adapt-button]',
        status: '.v-line',
        deleteButton: 'button.bwf-pl-zero',
        backButton: '.config-title button',
        defaultStatusLifeCycle: '.flowchart-title .cc-title',
        flowsetGuid: '1bb469bb-ef02-4134-ad87-b92002bc8e12',
        saveButton: '[class="d-button d-button_primary d-icon-left-undefined d-button_small"]',
        cancelButton: '.footer button[btn-type="secondary"]',
        companydefaultvalue: '[class="ui-select-match-text pull-left"]',
        mandatoryCheckBox: '.d-checkbox__item',
        manageLink: '[class="d-button d-button_link d-icon-left-pencil d-button_small"]',
        addStatusReason: '.d-icon-left-plus_circle',
        localizeStatusReasonButton: '.d-icon-field_text_mapmarker',
    }

    async clickOnMandatoryCheckbox(): Promise<void> {
        await $(this.selectors.mandatoryCheckBox).click();
    }

    async setStatusReason(newStatus: string): Promise<void> {
        await $(this.selectors.manageLink).click();
        await $(this.selectors.addStatusReason).click();
        await $(this.selectors.localizeButton).click();
        await $(this.selectors.newStatusInput).clear();
        await $(this.selectors.newStatusInput).sendKeys(newStatus);
        await $$(this.selectors.localizeMenuButtons).first().click();
        await browser.wait(this.EC.elementToBeClickable($$(this.selectors.statusAddModalBtns).first()), 5000);
        await $$(this.selectors.statusAddModalBtns).first().click();
        await this.saveSetting();
    }


    async saveSetting(): Promise<void> {
        await browser.sleep(2000); // Wait To Load the Setting Panel Buttons.
        //await utilityCommon.scrollToElement(await $$(this.selectors.settingPanelButtons).first());
        await $$(this.selectors.settingPanelButtons).first().click();
    }


    async selectFlowset(flowset: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.flowsetGuid, flowset);
    }

    async clickOnSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async getDefaultCompanyValue(): Promise<string> {
        return await $(this.selectors.companydefaultvalue).getText();
    }

    async getTitleValue(page: string): Promise<string> {
        let companyGuid: string = undefined;
        switch (page) {
            case "task": {
                companyGuid = 'ef86f20f-5c37-4d27-acf6-4c3e1134aa64';
                break;
            }
            case "case": {
                companyGuid = '5c2ff90b-4535-42fd-963e-8b1098833b56';
                break;
            }
            case "knowledge": {
                companyGuid = '8ccbb02e-7037-476f-b53d-ca2885dfdf0b';
                break;
            }
            default: {
                console.log(page, ' is not a valid parameter');
                break;
            }
        }
        return await $(`[rx-view-component-id="${companyGuid}"] span`).getText();
    }

    async clickEditStatus(status: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.status, status)).click();
        await browser.wait(this.EC.visibilityOf($('.status-settings-wrapper .settings__status-name')), 5000);
    }

    async getDefaultStatus(status: string): Promise<string> {
        return await element(by.cssContainingText(this.selectors.status, status)).getText();
    }

    async getStatusLifeCycle(): Promise<string> {
        return await $(this.selectors.defaultStatusLifeCycle).getText();
    }

    async isDeleteButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.deleteButton).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.deleteButton).isDisplayed();
            else return false;
        });
    }

    async clickOnDeleteButton(): Promise<void> {
        await $(this.selectors.deleteButton).click();
    }

    async isCompanyRequiredText(page: string): Promise<boolean> {
        let companyGuid: string = undefined;
        switch (page) {
            case "task": {
                companyGuid = '6f415311-8708-4f63-9d1a-b373bad77377';
                break;
            }
            case "case": {
                companyGuid = '11a8a316-3947-4479-8840-10436c8d6810';
                break;
            }
            case "knowledge": {
                companyGuid = '9244f298-b811-47f1-98f4-455761459dc9';
                break;
            }
            default: {
                console.log(page, ' is not a valid parameter');
                break;
            }
        }
        return await utilityCommon.isRequiredTagToField(companyGuid);
    }

    async clickOnBackButton(): Promise<void> {
        await $(this.selectors.backButton).click();
    }

    async setCompanyDropdown(company: string, page: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.companyDropdown)));
        let companyGuid: string = undefined;
        switch (page) {
            case "task": {
                companyGuid = '5acc7fed-e1de-4130-8b95-cf2ad2097947';
                break;
            }
            case "case": {
                companyGuid = '431d76e0-365b-407a-8394-9d658febc61a';
                break;
            }
            case "knowledge": {
                companyGuid = '9dfb4eea-5edf-4a18-920f-84d7990ca11b';
                break;
            }
            default: {
                console.log(page, ' is not a valid parameter');
                break;
            }
        }
        await utilityCommon.selectDropDown(companyGuid, company);
    }

    async isEditLifeCycleBtnDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.editLifeCycleButton)));
        return await $(this.selectors.editLifeCycleButton).getAttribute("disabled") == "true";
    }

    async clickEditLifeCycleLink(): Promise<void> {
        await $(this.selectors.editLifeCycleButton).click();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
    }

    async renameExistingStatus(newStatus: string): Promise<void> {
        await $(this.selectors.localizeButton).click();
        await $(this.selectors.newStatusInput).clear();
        await $(this.selectors.newStatusInput).sendKeys(newStatus);
        await $$(this.selectors.localizeMenuButtons).first().click();
        await this.saveSetting();
    }

    async updateExistingStatusName(name: string): Promise<void> {
        await $(this.selectors.localizeButton).click();
        await $(this.selectors.newStatusInput).clear();
        await $(this.selectors.newStatusInput).sendKeys(name);
        await $$(this.selectors.localizeMenuButtons).first().click();
    }

    async cancelSettingChange(): Promise<void> {
        await $$(this.selectors.settingPanelButtons).last().click();
    }

    async addCustomStatus(status1: string, status2: string, newStatus: string): Promise<void> {
        let status = false;
        let statusLocator: ElementFinder[] = await $$('.v-line');
        for (let i: number = 0; i < await statusLocator.length; i++) {
            let newLocator: ElementFinder = statusLocator[i];
            if (await newLocator.getText() == newStatus) {
                status = true;
                break;
            }
        }
        if (!status) {
            let modelId: string = undefined;
            let label: string = undefined;
            let statusesLineLocator = $$('.joint-type-standard');
            for (let i: number = 0; i < await statusesLineLocator.count(); i++) {
                let lineElement = await statusesLineLocator.get(i);
                try { label = await lineElement.$('path[joint-selector="line"]').getAttribute('data-label'); }
                catch (ex) { console.log('Searching for the Status Locator'); }
                if (label == `${status1}--${status2}`) {
                    modelId = await lineElement.getAttribute('model-id');
                    break;
                }
            }
            await browser.actions().mouseMove($(`path[data-label="${status1}--${status2}"]`)).perform();
            await $(`[data-tool-name="add-new-status"][model-id="${modelId}"]`).click();
            await $(this.selectors.localizeButton).click();
            await $$(this.selectors.newStatusInput).first().clear();
            await $$(this.selectors.newStatusInput).first().sendKeys(newStatus);
            await $$(this.selectors.localizeMenuButtons).first().click();
            await this.saveSetting();
        }
    }
}

export default new StatusConfigPage();