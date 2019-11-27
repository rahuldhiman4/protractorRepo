import { $, ProtractorExpectedConditions, browser, protractor, element, by, $$ } from "protractor";
import utilCommon from '../../utils/ui/util.common';

class CreateKnowledgePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        clickOnReferenceTemplate: '[rx-view-component-id="6e402c66-fcdc-464b-b6e7-7e963d9c3a17"] .sectionsName',
        useSelectedTemplateButton: '[rx-view-component-id="6e402c66-fcdc-464b-b6e7-7e963d9c3a17"] .d-button',
        knowledgeTitleEditBox: '[rx-view-component-id="291bf2bb-1eac-404e-94ba-762a50da5ac9"] .ng-pristine',
        saveKnowlegeButton: '[rx-view-component-id="2fdb0ffb-560d-46b4-b7af-379d90bcb0a8"] span',
        viewArticleLink: '[rx-view-component-id="57f95ac6-4144-400f-a591-657ea98316dd"] span',
        activityTab: '[rx-view-component-id="3982f4ea-16a0-41aa-982e-879143a19b00"] .rx-tab a',
        knowledgeSet: '7f2de840-20ec-47e8-805f-4db8edc1b5f4',
    }

    async clickOnTemplate(TemplateName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.clickOnReferenceTemplate)));
        await element(by.cssContainingText(this.selectors.clickOnReferenceTemplate, TemplateName)).click();
    }

    async clickOnUseSelectedTemplateButton(UseSelectedTemplateButton: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.useSelectedTemplateButton)));
        await element(by.cssContainingText(this.selectors.useSelectedTemplateButton, UseSelectedTemplateButton)).click();
        await browser.wait(this.EC.titleContains('New Article - Business Workflows'), 50000);
    }

    async selectKnowledgeSet(knowledgeSet: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.knowledgeSet, knowledgeSet);
    }

    async addTextInKnowlegeTitleField(addTextKnowlegeTitleField: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeTitleEditBox)));
        await $(this.selectors.knowledgeTitleEditBox).sendKeys(addTextKnowlegeTitleField);
    }
    async clickOnUseSaveKnowledgeButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveKnowlegeButton)));
        await $(this.selectors.saveKnowlegeButton).click();
    }

    async clickOnviewArticleLinkButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.viewArticleLink)));
        await $(this.selectors.viewArticleLink).click();
    }

    async clickOnActivityTab(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($$(this.selectors.activityTab).last()));
        await $$(this.selectors.activityTab).last().click();
    }
}

export default new CreateKnowledgePage();
