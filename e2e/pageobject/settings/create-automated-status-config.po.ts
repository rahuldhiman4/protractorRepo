import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"
import commonUtil from '../../utils/ui/util.common'

class AutomatedStatusTransitionConfigCreatePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        name: '[rx-view-component-id="aff3dedf-fc28-480a-9014-8a3bfc5091ec"] input',
        companyGuid: '896946e9-8da3-435b-93b1-28a25a90668a',
        fromStatusGuid: 'c6f4a14a-1efe-435e-b04d-5f7e7055e7bc',
        toStatusGuid: 'a596199c-daa0-41c9-91eb-cfab6d140cbd',
        changeStatusAfter: '[rx-view-component-id="ad284e33-4443-43a3-948a-4b3e81f89b08"] input',
        saveButton: '[rx-view-component-id="7ab1dc87-1489-41c8-b910-6ae40b1e5e87"] button',
        label: '[rx-view-component-id="35c243d5-d4a5-46df-aee5-7e7ce2deb445"] .ui-select-toggle'
    }

    async setName(name: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await $(this.selectors.name).sendKeys(name);
    }

    async setCompany(companyName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await commonUtil.selectDropDown(this.selectors.companyGuid, companyName);
    }

    async setFromStatus(status: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await commonUtil.selectDropDown(this.selectors.fromStatusGuid, status);
    }

    async setToStatus(status: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await commonUtil.selectDropDown(this.selectors.toStatusGuid, status);
    }

    async setChangeStatusAfter(days: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await $(this.selectors.changeStatusAfter).sendKeys(days);
    }

    async saveConfig(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async createAutomatedStatusTransition(data: Map<string, string>): Promise<void> {
        await this.setName(data['automatedStatusTransitionWithMandatoryFields'].name);
        await this.setCompany(data['automatedStatusTransitionWithMandatoryFields'].company);
        await this.setFromStatus(data['automatedStatusTransitionWithMandatoryFields'].fromStatus);
        await this.setToStatus(data['automatedStatusTransitionWithMandatoryFields'].toStatus);
        await this.setChangeStatusAfter(data['automatedStatusTransitionWithMandatoryFields'].changeStatusAfter);
        await this.saveConfig();
    }
}

export default new AutomatedStatusTransitionConfigCreatePage();