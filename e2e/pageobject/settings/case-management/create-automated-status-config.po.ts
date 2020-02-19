import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import commonUtil from '../../../utils/util.common';

class AutomatedStatusTransitionConfigCreatePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        name: '[rx-view-component-id="aff3dedf-fc28-480a-9014-8a3bfc5091ec"] input',
        companyGuid: '896946e9-8da3-435b-93b1-28a25a90668a',
        fromStatusGuid: 'c6f4a14a-1efe-435e-b04d-5f7e7055e7bc',
        toStatusGuid: 'a596199c-daa0-41c9-91eb-cfab6d140cbd',
        changeStatusAfter: '[rx-view-component-id="ad284e33-4443-43a3-948a-4b3e81f89b08"] input',
        saveButton: '[rx-view-component-id="7ab1dc87-1489-41c8-b910-6ae40b1e5e87"] button',
        label: '[rx-view-component-id="35c243d5-d4a5-46df-aee5-7e7ce2deb445"] .ui-select-toggle',
        cancelButton: '[rx-view-component-id="25d8d454-8a06-423c-aed5-0cfd25e4cbe2"] button',
        flowsetGuid: '0cfddbcb-0905-4c1b-a1a7-2baa548e1a9b',
        fromStatusReasonGuid: '49178f00-fd4d-4bd2-8ce0-f9912af5caf2',
        toStatusReasonGuid: '422772e5-851f-4a96-aad1-7445ff75b519'
    }

    async setName(name: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await $(this.selectors.name).sendKeys(name);
    }

    async setCompany(companyName: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await commonUtil.selectDropDown(this.selectors.companyGuid, companyName);
    }

    async setFromStatus(status: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await commonUtil.selectDropDown(this.selectors.fromStatusGuid, status);
    }

    async setToStatus(status: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await commonUtil.selectDropDown(this.selectors.toStatusGuid, status);
    }

    async setChangeStatusAfter(days: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await $(this.selectors.changeStatusAfter).sendKeys(days);
    }

    async saveConfig(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
//        await commonUtil.waitUntilPopUpDisappear();
//        await commonUtil.waitUntilSpinnerToHide();
    }

    async createAutomatedStatusTransition(data: Map<string, string>): Promise<void> {
        await this.setName(data['automatedStatusTransitionWithMandatoryFields'].name);
        await this.setCompany(data['automatedStatusTransitionWithMandatoryFields'].company);
        await this.setFromStatus(data['automatedStatusTransitionWithMandatoryFields'].fromStatus);
        await this.setToStatus(data['automatedStatusTransitionWithMandatoryFields'].toStatus);
        await this.setChangeStatusAfter(data['automatedStatusTransitionWithMandatoryFields'].changeStatusAfter);
        await this.saveConfig();
    }

    async setFromStatusReason(reason: string): Promise<void>{
        await commonUtil.selectDropDown(this.selectors.fromStatusReasonGuid, reason);
    }

    async setToStatusReason(reason: string): Promise<void>{
        await commonUtil.selectDropDown(this.selectors.toStatusReasonGuid, reason);
    }
	
	async setFlowset(value: string): Promise<void>{
        await commonUtil.selectDropDown(this.selectors.flowsetGuid, value);
    }
	
	
	async clickOCancelBtn(): Promise<void>{
        await $(this.selectors.cancelButton).click();
    }

}

export default new AutomatedStatusTransitionConfigCreatePage();