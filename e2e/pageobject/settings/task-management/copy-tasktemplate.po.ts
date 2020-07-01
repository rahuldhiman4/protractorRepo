import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import util from "../../../utils/util.common";

class Copytaskpage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        sourceProcessname: '[rx-view-component-id="9f29e10e-dedf-4bab-8372-5b40002d999a"] input',
        toggleBox: '[rx-view-component-id="6c10fd9d-675a-44ec-abbf-bf9f694099a8"] .d-icon-circle_slash_o',
        toggleBox1: '6c10fd9d-675a-44ec-abbf-bf9f694099a8',
        processName: '[ng-model="process.name"] .rx-input',
        newProcessName: '[rx-view-component-id="85c0b484-4b35-4c68-955b-73f6949b56d2"] input',
        templateStatus: '09db292a-212a-433e-8c20-a92f8c4e5168',
        saveCopyTemplate: '[rx-view-component-id="5001f6ea-4438-4485-bdd2-c952a12a1a34"] button',
        cancelCopyTemplate: '[rx-view-component-id="3f760e5f-70e9-4fbf-8b05-cd7d460f8818"] button',
        templateName: '[rx-view-component-id="2e4ef0dc-9b73-4c8f-afe6-221ddf0594c7"] input',
        taskSummary: '[rx-view-component-id="c19d336e-7339-4970-b69a-100108d672fd"] input',
        sourceProcessNameValue: '[rx-view-component-id="9f29e10e-dedf-4bab-8372-5b40002d999a"] input',
        companyGiud: 'f62bd26b-c464-4dff-ab7b-e4446d1cbf99',
        clearProcessBundleId: '[title="Process Bundle ID"] [rx-id="clear-selection-button"] i',
        processBundle: '5f30b3d4-caa2-4c28-8af6-cebf094bc2e8',
        ownerGuid: '61278673-8106-419c-83e4-a9e00f12f835',
        ownerGroupValueOnCopy: '[rx-view-component-id="61278673-8106-419c-83e4-a9e00f12f835"] .ui-select-match-text',
        buisnessUnitGuid: 'a81cc2df-7b89-4367-81f7-f0ad5e786ca2',
    }

    async unSelectCopyExistingProcess(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.sourceProcessNameValue)));
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.toggleBox)));
        await $(this.selectors.toggleBox).click();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.processName)));
        return await $(this.selectors.processName).getAttribute('disabled');
    }

    async setTemplateName(input: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.templateName)));
        await $(this.selectors.templateName).clear();
        await $(this.selectors.templateName).sendKeys(input);
    }

    async isOwnerGroupEmpty(): Promise<boolean> {
        let element = await $(this.selectors.ownerGroupValueOnCopy)
        let value = await element.getAttribute('aria-label');
        if (value == '') {
            return true;
        } else { return false; }
    }

    async setTaskSummary(input: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskSummary)));
        await $(this.selectors.taskSummary).clear();
        await $(this.selectors.taskSummary).sendKeys(input);
    }

    async setNewProcessName(input: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.newProcessName)));
        await $(this.selectors.newProcessName).clear();
        await $(this.selectors.newProcessName).sendKeys(input);
    }

    async getProcessName(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.processName)));
        return await $(this.selectors.processName).getText();
    }

    async getSourceProcessName(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.sourceProcessname)));
        return await $(this.selectors.sourceProcessname).getAttribute('value');
    }

    async clickSaveCopytemplate(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.saveCopyTemplate)));
        await $(this.selectors.saveCopyTemplate).click();
    }

    async clickCancelCopytemplate(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.saveCopyTemplate)));
        await $(this.selectors.cancelCopyTemplate).click();
    }

    async selectTemplateStatus(status: string): Promise<void> {
        await util.selectDropDown(this.selectors.templateStatus, status);
    }

    async selectBundles(value: string): Promise<void> {
        await util.selectDropDown(this.selectors.processBundle, value);
    }

    async selectTaskCompany(companyName: string): Promise<void> {
        await util.selectDropDown(this.selectors.companyGiud, companyName);
    }

    async selectOwnerGroup(ownerGroup: string): Promise<void> {
        await util.selectDropDown(this.selectors.ownerGuid, ownerGroup);
    }

    async selectBuisnessUnitGroup(ownerGroup: string): Promise<void> {
        await util.selectDropDown(this.selectors.buisnessUnitGuid, ownerGroup);
    }
}

export default new Copytaskpage();