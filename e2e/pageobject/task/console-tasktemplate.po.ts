import { element, by, ProtractorExpectedConditions, protractor, browser, $, $$ } from "protractor"

class TaskTemplateGridPage{

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        manualTaskTemplateButton: '[rx-view-component-id="6843466b-bf58-47d1-baf4-97b3c9be4598"] button',
        automationtaskTemplateButton: '[rx-view-component-id="847d80e6-19ca-46ef-b01a-5a3581f784d7"] button',
        externalTaskTemplateButton: '[rx-view-component-id="df859ce0-47e3-4b61-937d-8d7ff3b64c0a"] button',
        copyTaskTemplate: '[rx-view-component-id="48afba80-4d39-4c1a-a420-1c01992cd937"] button'
    }

    async clickOnManualTaskTemplateButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.manualTaskTemplateButton)));
        await $(this.selectors.manualTaskTemplateButton).click();  
    }

    async clickOnAutomationTaskTemplateButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.automationtaskTemplateButton)));
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
}
export default new TaskTemplateGridPage();