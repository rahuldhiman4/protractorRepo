import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"
import util from "../../utils/ui/util.common";

class Copytaskpage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        sourceProcessname: '[rx-view-component-id="9f29e10e-dedf-4bab-8372-5b40002d999a"] input',
        toggleBox: '[rx-view-component-id="6c10fd9d-675a-44ec-abbf-bf9f694099a8"] .d-icon-circle_slash_o',
        toggleBox1: '6c10fd9d-675a-44ec-abbf-bf9f694099a8',
        processname: '[ng-model="process.name"] .rx-input',
        templateStatus: '09db292a-212a-433e-8c20-a92f8c4e5168',
        saveCopyTemplate: '[rx-view-component-id="5001f6ea-4438-4485-bdd2-c952a12a1a34"] button',
        templateName: '[rx-view-component-id="2e4ef0dc-9b73-4c8f-afe6-221ddf0594c7"] input',
        taskSummary: '[rx-view-component-id="c19d336e-7339-4970-b69a-100108d672fd"] input',
        sourceProcessNameValue: '[rx-view-component-id="9f29e10e-dedf-4bab-8372-5b40002d999a"] input',
    }

    async unSelectCopyExistingProcess(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.sourceProcessNameValue)));
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.toggleBox)));
        await $(this.selectors.toggleBox).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.processname)));
        return await $(this.selectors.processname).getAttribute('disabled');
    }

    async setTemplateName(input: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.templateName)));
        await $(this.selectors.templateName).clear();
        await $(this.selectors.templateName).sendKeys(input);
    }

    async setTaskSummary(input: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskSummary)));
        await $(this.selectors.taskSummary).clear();
        await $(this.selectors.taskSummary).sendKeys(input);
    }

    async getProcessName(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.processname)));
        return await $(this.selectors.processname).getText();
    }

    async clickSaveCopytemplate(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.saveCopyTemplate)));
        $(this.selectors.saveCopyTemplate).click();
    }

    async selectTemplateStatus(status: string): Promise<void> {
        await util.selectDropDown(this.selectors.templateStatus, status);
    }
}

export default new Copytaskpage();