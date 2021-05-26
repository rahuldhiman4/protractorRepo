import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
import { IAutomatedStatusTransitionConfigUI } from '../../../data/interface/template.interface';

class AutomatedStatusTransitionConfigCreatePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        name: '[rx-view-component-id="aff3dedf-fc28-480a-9014-8a3bfc5091ec"] input',
        nameGuid: 'aff3dedf-fc28-480a-9014-8a3bfc5091ec',
        companyGuid: '896946e9-8da3-435b-93b1-28a25a90668a',
        fromStatusGuid: 'c6f4a14a-1efe-435e-b04d-5f7e7055e7bc',
        fromStatus: '[rx-view-component-id="c6f4a14a-1efe-435e-b04d-5f7e7055e7bc"] .dropdown-toggle',
        toStatusGuid: 'a596199c-daa0-41c9-91eb-cfab6d140cbd',
        changeStatusAfter: '[rx-view-component-id="ad284e33-4443-43a3-948a-4b3e81f89b08"] input',
        changeStatusAfterGuid: 'ad284e33-4443-43a3-948a-4b3e81f89b08',
        saveButton: '[rx-view-component-id="7ab1dc87-1489-41c8-b910-6ae40b1e5e87"] button',
        label: '[rx-view-component-id="3dee9321-1250-4f24-8087-bdbffbcf3f63"] .dropdown-toggle',
        labelGuid: '3dee9321-1250-4f24-8087-bdbffbcf3f63',
        cancelButton: '[rx-view-component-id="25d8d454-8a06-423c-aed5-0cfd25e4cbe2"] button',
        flowsetGuid: 'e131ba62-cde5-4c44-8249-1e5bb1b321ce',
        fromStatusReasonGuid: '49178f00-fd4d-4bd2-8ce0-f9912af5caf2',
        toStatusReasonGuid: '422772e5-851f-4a96-aad1-7445ff75b519',
        categoryTier1: '6500c9a2-5bf8-4613-9c27-f66a71cffae6',
        categoryTier2: '57b5b1cc-fefe-49f9-aac0-182745294a1a',
        categoryTier3: 'd5675baf-0b9a-44c4-80aa-316af5a38b22',
        categoryTier4: 'a7304073-97ae-4fd1-8061-1d56bafcc203',
        lobValue: '[rx-view-component-id="6b1b5eda-4725-4fda-890a-57ad98995b33"] .pull-left'
    }

    async setName(name: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await $(this.selectors.name).sendKeys(name);
    }

    async setCategoryTier1Value(value: string): Promise<void> {
        await utilityCommon.selectDropDown('d84b98ad-9983-41e2-b6f2-6c5b9d404b7c', value).catch(async (error) => {
            if (error) await utilityCommon.selectDropDown(this.selectors.categoryTier1, value);
        });
    }

    async setCategoryTier2Value(categoryTier2: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier2, categoryTier2);
    }

    async setCategoryTier3Value(categoryTier3: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier3, categoryTier3);
    }

    async setCategoryTier4Value(categoryTier4: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier4, categoryTier4);
    }

    async setLabelValue(label: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.labelGuid, label);
    }

    async isNameRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.nameGuid);
    }

    async setCompany(companyName: string): Promise<void> {
        return await utilityCommon.selectDropDown(this.selectors.companyGuid, companyName);
    }

    async isCompanyRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.companyGuid);
    }

    async isFromStatusRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.fromStatusGuid);
    }

    async isToStatusRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.toStatusGuid);
    }

    async isChangeStatusAferRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.changeStatusAfterGuid);
    }

    async setFromStatus(status: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await utilityCommon.selectDropDown(this.selectors.fromStatusGuid, status);
    }

    async isFromStatusEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        return await $(this.selectors.fromStatus).getAttribute('aria-disabled') == "false";
    }

    async setToStatus(status: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await utilityCommon.selectDropDown(this.selectors.toStatusGuid, status);
    }

    async setChangeStatusAfter(days: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.label)));
        await $(this.selectors.changeStatusAfter).sendKeys(days);
    }

    async saveConfig(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async createAutomatedStatusTransition(data: IAutomatedStatusTransitionConfigUI): Promise<void> {
        await this.setName(data.name);
        await this.setCompany(data.company);
        await this.setFromStatus(data.fromStatus);
        await this.setToStatus(data.toStatus);
        await this.setChangeStatusAfter(data.changeStatusAfter.toString());
        await this.saveConfig();
    } 

    async setFromStatusReason(reason: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.fromStatusReasonGuid, reason);
    }

    async setToStatusReason(reason: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.toStatusReasonGuid, reason);
    }

    async setFlowset(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.flowsetGuid, value);
    }

    async isFlowsetDrpdownValueDisplayed(value: string[]): Promise<void> {
        await utilityCommon.isAllDropDownValuesMatches(this.selectors.flowsetGuid, value);
    }

    async clickCancelBtn(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new AutomatedStatusTransitionConfigCreatePage();