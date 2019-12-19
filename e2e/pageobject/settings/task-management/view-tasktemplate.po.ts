import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class ViewTaskTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        manageDynamicField: '[rx-view-component-id="60aedaf2-92a3-433f-8024-34e26e71350c"] button',
        dynamicFieldTitle: '.simple-field .d-textfield__item',
        processnameValue: '[rx-view-component-id="5e792424-a4d7-4235-8715-be24149be51b"] p',
        copyTaskButton: '[rx-view-component-id="e2ec0e87-e65d-4926-9efc-25e3ad329e52"] button',
        templateName: '[rx-view-component-id="72010a6d-c0d7-433a-ab9d-3203fb373518"] span',
        templateStatus: '[rx-view-component-id="d17d9cf8-a5ac-47de-acae-a4b69e086855"] p',
        summaryValue: '[rx-view-component-id="80087f51-1b1f-4b47-9fde-36aed981db13"] p',
        taskTypeValue: '[rx-view-component-id="27f3842f-613a-4439-a29c-bedd51b0eecd"] p',
        taskDescriptionValue: '[rx-view-component-id="cce67ce7-e6a5-4ed6-aa50-c57ea75d2854"] .show-less-wrapper',
        taskCompanyValue: '[rx-view-component-id="2717de6b-2e4e-47d2-a39e-b5ade14ea3e9"] p',
        categoryTier1Value: '[rx-view-component-id="d64a99a4-e878-47b7-86f2-b6dfb7cd4652"] p',
        categoryTier2Value: '[rx-view-component-id="c427cb37-5018-4bc6-b951-46f31a679d93"] p',
        categoryTier3Value: '[rx-view-component-id="118170eb-e94d-4056-9d0b-cb944ff96ebb"] p',
        editProcessLink: '[rx-view-component-id="bb9a3cc7-a8e9-4291-a447-f3a5c33afd1e"] button',
        ownerCompanyValue: '[rx-view-component-id="37dd629c-6d13-4e6d-b70e-90b91dd5b484"] p',
        ownerGroupValue: '[rx-view-component-id="f02e4c7b-93f9-4b35-af23-f522d56daa4b"] p',
        editLink: '[rx-view-component-id="0ff4dfc7-09f3-4d12-bc32-5c9426f6cc6c"] .rx-record-editor-edit',
    }


    async getDynamicFieldTitle(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.dynamicFieldTitle)));
        return await $(this.selectors.dynamicFieldTitle).getText();
    }

    async clickOnManageDynamicFieldLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.manageDynamicField)));
        await $(this.selectors.manageDynamicField).click();
    }

    async getOwnerCompanyValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.ownerCompanyValue)));
        return await $(this.selectors.ownerCompanyValue).getText();
    }

    async getOwnerGroupValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.ownerGroupValue)));
        return await $(this.selectors.ownerGroupValue).getText();
    }

    async getProcessNameValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.processnameValue)));
        return await $(this.selectors.processnameValue).getText();
    }

    async getTemplateName(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.templateName)));
        return await $(this.selectors.templateName).getText();
    }

    async getTemplateStatus(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.templateStatus)));
        return await $(this.selectors.templateStatus).getText();
    }

    async clickOnCopyTemplate(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.copyTaskButton)));
        await $(this.selectors.copyTaskButton).click();
    }

    async clickOnEditProcessLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editProcessLink)));
        await $(this.selectors.editProcessLink).click();
    }

    async clickOnEditLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLink)));
        await $(this.selectors.editLink).click();
    }

    async getSummaryValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.summaryValue)));
        return await $(this.selectors.summaryValue).getText();
    }

    async getTaskTypeValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskTypeValue)));
        return await $(this.selectors.taskTypeValue).getText();
    }

    async getTaskDescriptionNameValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskDescriptionValue)));
        return await $(this.selectors.taskDescriptionValue).getText();
    }

    async getTaskCompanyNameValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskCompanyValue)));
        return await $(this.selectors.taskCompanyValue).getText();
    }

    async getCategoryTier1Value(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier1Value)));
        return await $(this.selectors.categoryTier1Value).getText();
    }

    async getCategoryTier2Value(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier2Value)));
        return await $(this.selectors.categoryTier2Value).getText();
    }

    async getCategoryTier3Value(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier3Value)));
        return await $(this.selectors.categoryTier3Value).getText();
    }
}

export default new ViewTaskTemplate();