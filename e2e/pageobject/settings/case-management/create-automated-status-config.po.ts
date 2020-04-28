import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon  from '../../../utils/util.common';

class AutomatedStatusTransitionConfigCreatePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        name: '[rx-view-component-id="aff3dedf-fc28-480a-9014-8a3bfc5091ec"] input',
        nameGuid: 'aff3dedf-fc28-480a-9014-8a3bfc5091ec',
        companyGuid: '896946e9-8da3-435b-93b1-28a25a90668a',
        fromStatusGuid: 'c6f4a14a-1efe-435e-b04d-5f7e7055e7bc',
        fromStatus: '[rx-view-component-id="c6f4a14a-1efe-435e-b04d-5f7e7055e7bc"] .ui-select-container',
        toStatusGuid: 'a596199c-daa0-41c9-91eb-cfab6d140cbd',
        changeStatusAfter: '[rx-view-component-id="ad284e33-4443-43a3-948a-4b3e81f89b08"] input',
        changeStatusAfterGuid: 'ad284e33-4443-43a3-948a-4b3e81f89b08',
        saveButton: '[rx-view-component-id="7ab1dc87-1489-41c8-b910-6ae40b1e5e87"] button',
        label: '[rx-view-component-id="35c243d5-d4a5-46df-aee5-7e7ce2deb445"] .ui-select-toggle',
        labelGuid: '0db3f64c-6dbf-4410-b6ae-6a8bf58296e6',
        cancelButton: '[rx-view-component-id="25d8d454-8a06-423c-aed5-0cfd25e4cbe2"] button',
        flowsetGuid: '0cfddbcb-0905-4c1b-a1a7-2baa548e1a9b',
        fromStatusReasonGuid: '49178f00-fd4d-4bd2-8ce0-f9912af5caf2',
        toStatusReasonGuid: '422772e5-851f-4a96-aad1-7445ff75b519',
        categoryTier2: '0ffc06aa-d9dd-4158-bb95-090b1a366577',
        categoryTier3: 'b9b68d67-302e-4e3c-815b-bdfd67698e7f',
        categoryTier4: '6f11bf75-31c3-4088-8e30-b539e385db0c',
    }

    async setName(name: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await $(this.selectors.name).sendKeys(name);
    }

    async setCategoryTier1Value(categoryTier1: string): Promise<void> {
        await utilCommon.selectDropDown('d84b98ad-9983-41e2-b6f2-6c5b9d404b7c', categoryTier1).catch(async (error) => {
            if(error) await utilCommon.selectDropDown('e352fa1a-9440-4a8c-a77d-e2030beec03b', categoryTier1);
        });
    }

    async setCategoryTier2Value(categoryTier2: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.categoryTier2, categoryTier2);
    }

    async setCategoryTier3Value(categoryTier3: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.categoryTier3, categoryTier3);
    }

    async setCategoryTier4Value(categoryTier4: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.categoryTier4, categoryTier4);
    }

    async setLabelValue(label: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.labelGuid, label);
    }

    async isNameRequiredText(): Promise<boolean> {
      return  await utilCommon.isRequiredTagToField(this.selectors.nameGuid);
    }

    async setCompany(companyName: string): Promise<void> {
        return   await utilCommon.selectDropDown(this.selectors.companyGuid, companyName);
    }

    async isCompanyRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isFromStatusRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.fromStatusGuid);
    }

    async isToStatusRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.toStatusGuid);
    }

    async isChangeStatusAferRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.changeStatusAfterGuid);
    }

    async setFromStatus(status: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await utilCommon.selectDropDown(this.selectors.fromStatusGuid, status);
    }

    async isFromStatusEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        return await $(this.selectors.fromStatus).isEnabled();
    }

    async setToStatus(status: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await utilCommon.selectDropDown(this.selectors.toStatusGuid, status);
    }

    async setChangeStatusAfter(days: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await $(this.selectors.changeStatusAfter).sendKeys(days);
    }

    async saveConfig(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
        //        await utilCommon.waitUntilPopUpDisappear();
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async createAutomatedStatusTransition(data: Map<string, string>): Promise<void> {
        await this.setName(data['automatedStatusTransitionWithMandatoryFields'].name);
        await this.setCompany(data['automatedStatusTransitionWithMandatoryFields'].company);
        await this.setFromStatus(data['automatedStatusTransitionWithMandatoryFields'].fromStatus);
        await this.setToStatus(data['automatedStatusTransitionWithMandatoryFields'].toStatus);
        await this.setChangeStatusAfter(data['automatedStatusTransitionWithMandatoryFields'].changeStatusAfter);
        await this.saveConfig();
    }

    async setFromStatusReason(reason: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.fromStatusReasonGuid, reason);
    }

    async setToStatusReason(reason: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.toStatusReasonGuid, reason);
    }

    async setFlowset(value: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.flowsetGuid, value);
    }

    async isFlowsetDrpdownValueDisplayed(value: string[]): Promise<void> {
        await utilCommon.isDrpDownvalueDisplayed(this.selectors.flowsetGuid, value);
    }

    async clickOCancelBtn(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

}

export default new AutomatedStatusTransitionConfigCreatePage();