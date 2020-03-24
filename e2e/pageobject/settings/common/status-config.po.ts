import { $, $$, protractor,ElementFinder, browser, ProtractorExpectedConditions } from "protractor";
import utilCommon from "../../../utils/util.common";

class StatusConfigPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editLifeCycleButton: 'button.btn-edit-status-transition',
        localizeButton: '.status-name_label button',
        newStatusInput: '.default-locale-title input',
        settingPanelButtons: '.status-setting-panel .action-button',
        localizeMenuButtons: '.status-settings_button-bar button'
    }

    async setCompanyDropdown(company: string, page: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.companyDropdown)));
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
        await utilCommon.selectDropDown(companyGuid, company);
    }

    async isEditLifeCycleBtnDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.editLifeCycleButton)));
        return await $(this.selectors.editLifeCycleButton).getAttribute("disabled") == "true";
    }

    async clickEditLifeCycleLink(): Promise<void> {
        await $(this.selectors.editLifeCycleButton).click();
    }

    async addCustomStatus(status1: string, status2: string, newStatus: string): Promise<void> {
        let status = false;
        let statusLocator: ElementFinder[]  = await $$('.v-line');        
        for (let i: number = 0; i < await statusLocator.length; i++) {
            let newLocator: ElementFinder = statusLocator[i];
            if (await newLocator.getText() == newStatus) {
                status = true;
                break;
            }
        }
        if (!status) {
            let modelId: string = undefined;
            let statusesLineLocator = $$('.joint-type-standard');
            for (let i: number = 0; i < await statusesLineLocator.count(); i++) {
                let lineElement = await statusesLineLocator.get(i);
                let label: string = await lineElement.$('path[joint-selector="line"]').getAttribute('data-label');
                if (label == `${status1}--${status2}`) {
                    modelId = await lineElement.getAttribute('model-id');
                    break;
                }
            }
            await browser.actions().mouseMove($(`path[data-label="${status1}--${status2}"]`)).perform();
            await $(`[data-tool-name="add-new-status"][model-id="${modelId}"]`).click();
            await $(this.selectors.localizeButton).click();
            await $(this.selectors.newStatusInput).clear();
            await $(this.selectors.newStatusInput).sendKeys(newStatus);
            await $$(this.selectors.localizeMenuButtons).first().click();
            await $$(this.selectors.settingPanelButtons).first().click();
        }
    }
}

export default new StatusConfigPage();