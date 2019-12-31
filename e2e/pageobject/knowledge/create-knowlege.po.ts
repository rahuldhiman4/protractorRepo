import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class CreateKnowledgePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createKnowledgeTitle: '[rx-view-component-id="cebb7cbd-0e7b-48a2-9944-c11d3ba255d0"] span',
        knowledgeId: '.d-icon-lightbulb_o',
        backButton: '[rx-view-component-id="88ec72f0-2c65-4640-9455-54b6db3517f2"] button',
        clickOnReferenceTemplate: '[rx-view-component-id="6e402c66-fcdc-464b-b6e7-7e963d9c3a17"] .sectionsName',
        knowledgeTitleEditBox: '[rx-view-component-id="291bf2bb-1eac-404e-94ba-762a50da5ac9"] .ng-pristine',
        saveKnowlegeButton: '[rx-view-component-id="2fdb0ffb-560d-46b4-b7af-379d90bcb0a8"] .d-button',
        viewArticleLink: '[rx-view-component-id="57f95ac6-4144-400f-a591-657ea98316dd"] span',
        activityTab: '[rx-view-component-id="3982f4ea-16a0-41aa-982e-879143a19b00"] .rx-tab a',
        knowledgeSet: '7f2de840-20ec-47e8-805f-4db8edc1b5f4',
        assignToMeBtn: '[rx-view-component-id="8cb384cb-598d-46f4-a858-08111a6c51bd"] .assign-to-me-component .d-button',
        docEditorSection: '.doc-editor__section',
        knowledgeMetadataSection: '[rx-view-component-id="830947fd-773e-4a70-860a-98893c9b36b4"] .d-textfield',
        knowledgeSetRequiedtext: '[name="knowledgeSet"]',
        authorRequiredText: '[rx-view-component-id="cbf446b0-c8f6-433e-9a8e-b9a30f7ab79c"] .d-textfield__input',
    }

    async clickOnTemplate(TemplateName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.clickOnReferenceTemplate)));
        await element(by.cssContainingText(this.selectors.clickOnReferenceTemplate, TemplateName)).click();
    }

    async clickOnUseSelectedTemplateButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable(element(by.buttonText('Use selected Template'))));
        await element(by.buttonText('Use selected Template')).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.docEditorSection)));
    }

    async selectKnowledgeSet(knowledgeSet: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.knowledgeSet, knowledgeSet);
    }

    async addTextInKnowlegeTitleField(addTextKnowlegeTitleField: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeTitleEditBox)));
        await $(this.selectors.knowledgeTitleEditBox).sendKeys(addTextKnowlegeTitleField);
    }
    async clickOnSaveKnowledgeButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveKnowlegeButton)));
        await $(this.selectors.saveKnowlegeButton).click();
        await utilCommon.waitUntilPopUpDisappear();
    }

    async verifyAssignmentFieldsPresentAndDisabled(fldName: String): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeMetadataSection)));
        let fldsCount = await $$(this.selectors.knowledgeMetadataSection).count();
        for (let i = 0; i < fldsCount; i++) {
            let elem = await $$(this.selectors.knowledgeMetadataSection).get(i);
            if (await elem.$('.d-textfield__item').getText() == fldName) {
                expect (await elem.$('.btn-default').getAttribute("disabled") == "true").toBeTruthy();
                break;
            }
        }
    }

    async clickOnviewArticleLinkButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.viewArticleLink)));
        await $(this.selectors.viewArticleLink).click();
    }

    async clickOnActivityTab(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($$(this.selectors.activityTab).last()));
        await $$(this.selectors.activityTab).last().click();
    }

    async isKnowledgeTitleRequired(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeTitleEditBox)));
        return await $(this.selectors.knowledgeTitleEditBox).getAttribute("required")=="true";
    }

    async isKnowledgeSetRequired(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeSetRequiedtext)));
        return await $(this.selectors.knowledgeSetRequiedtext).getAttribute("required")=="true";
    }

    async isAuthorRequired(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($$(this.selectors.authorRequiredText).last()));
        return await $(this.selectors.knowledgeSetRequiedtext).getAttribute("is-required") == "true";
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveKnowlegeButton)));
       return await $(this.selectors.saveKnowlegeButton).isEnabled();
    }

    async clickChangeAssignmentButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable(element(by.buttonText('Change Assignment'))));
        await element(by.buttonText('Change Assignment')).click();
    }

    async clickAssignToMeButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignToMeBtn)));
        await $(this.selectors.assignToMeBtn).click();
    }

    async clickBackButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.backButton)));
        await $(this.selectors.backButton).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.saveKnowlegeButton)));
    }

    async getKnowledgeId(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeId)));
      return  await $(this.selectors.knowledgeId).getText();
    }

    async getCreateKnowledgeTitle(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.createKnowledgeTitle)));
        return await $(this.selectors.createKnowledgeTitle).getText();
    }
}

export default new CreateKnowledgePage();
