import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class CreateKnowledgePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createKnowledgeTitle: '[rx-view-component-id="cebb7cbd-0e7b-48a2-9944-c11d3ba255d0"] span',
        knowledgeId: '.d-icon-lightbulb_o',
        backButton: '[rx-view-component-id="88ec72f0-2c65-4640-9455-54b6db3517f2"] button',
        clickOnReferenceTemplate: '[rx-view-component-id="6e402c66-fcdc-464b-b6e7-7e963d9c3a17"] .sectionsName',
        knowledgeTitleEditBox: '[rx-view-component-id="291bf2bb-1eac-404e-94ba-762a50da5ac9"] input',
        saveKnowlegeButton: '[rx-view-component-id="2fdb0ffb-560d-46b4-b7af-379d90bcb0a8"] .d-button',
        viewArticleLink: '[rx-view-component-id="57f95ac6-4144-400f-a591-657ea98316dd"] span',
        knowledgeSet: '7f2de840-20ec-47e8-805f-4db8edc1b5f4',
        assignToMeBtn: '[rx-view-component-id="8cb384cb-598d-46f4-a858-08111a6c51bd"] .assign-to-me-component .d-button',
        docEditorSection: '.doc-editor__section .d-textfield__label',
        knowledgeMetadataSection: '[rx-view-component-id="830947fd-773e-4a70-860a-98893c9b36b4"] .d-textfield',
        knowledgeSetRequiedtext: '[name="knowledgeSet"]',
        authorRequiredText: '[rx-view-component-id="0a50ea72-5fe9-4488-9547-de0a7eb38dee"] .d-textfield__input',
        attachmentField: '[rx-view-component-id="bf6900ad-d67a-4705-b907-3caa50b640c7"] .d-icon-paperclip',
        templateHeading: '[rx-view-component-id="6e402c66-fcdc-464b-b6e7-7e963d9c3a17"] .templateName',
        regionGuid: '17b172fd-28d5-4553-bd22-b59695953287',
        siteGuid: 'ba9870e4-81f4-45ea-b034-9aff10bc3ab7',
        editRegionGuid: '[rx-view-component-id="d5c6cfef-2d53-48df-a03a-1a3e8381eef5"]',
        editSiteGuid: '[rx-view-component-id="aa218b2b-4fa3-4525-82f3-3e0f9bfc4193"]',
        documentRegionGuid: '[rx-view-component-id="cec69daa-b696-415b-b2ab-ebec81251d10"]',
        documentSiteGuid: '[rx-view-component-id="904078f1-17f1-4ac6-ab8a-a2f6e661f01d"]',
        editDocumentRegionGuid: '[rx-view-component-id="836aa6d7-1d77-46b4-b270-50d7d25424ba"]',
        editDocumentSiteGuid: '[rx-view-component-id="6b73d5aa-fdeb-4d10-aa35-14e842e35a95"]',
        knowledgeHamburgerGuid: '[rx-view-component-id="a9dfa448-2900-4a2b-a230-503f4a0ac12e"]',
        documentHamburgerGuid: '[rx-view-component-id="5d1f94a9-693e-4dbf-896f-3b9689f95a42"]',
        knowledgeArticleGridConsoleGuid: '[rx-view-component-id="0df18e99-4315-457c-aef0-3abc96fb08ee"]',
        categoryTier1Guid: 'b51fcb01-f3d1-4da2-a42d-ffc5873a21b3',
        categoryTier2Guid: '6f480482-c224-4742-b941-bce655d40fde',
        categoryTier3Guid: '2774b518-00ab-4e02-bb23-95bdb0285840',
        categoryTier4Guid: 'd0bd4f0d-a53e-4c67-8419-016a926a7651',
        createKAHeading: '[rx-view-component-id="cebb7cbd-0e7b-48a2-9944-c11d3ba255d0"] p',
        reference: '.doc-editor__section .cke_editable',
        templateName: '.templateName',
        discardButton: '[rx-view-component-id="0b2d73c8-de57-460b-909c-17e2ae50ea5b"] button',
        knowledgeSetValue: '[rx-view-component-id="7f2de840-20ec-47e8-805f-4db8edc1b5f4"] .ui-select-match-text',
        knowledgeTemplateStyle: '.create-ka-template__style-label',
        knowledgePreview: '.create-ka-template__preview',
        selectDifferentTemplate: '.create-ka-template__back-button',
        changeTemplate: '[rx-view-component-id="64e29650-ca7f-4b3d-a2af-826be22f8e0f"] button',
        categoryTier1Value:'[rx-view-component-id="b51fcb01-f3d1-4da2-a42d-ffc5873a21b3"] .ui-select-match-text',
        categoryTier2Value:'[rx-view-component-id="6f480482-c224-4742-b941-bce655d40fde"] .ui-select-match-text',
        categoryTier3Value:'[rx-view-component-id="2774b518-00ab-4e02-bb23-95bdb0285840"] .ui-select-match-text',
    }

    async clickChangeTemplateButton(): Promise<void> {
        await $(this.selectors.changeTemplate).click();
    }

    async clickOnSelectDifferentTemplate(): Promise<void> {
        await $(this.selectors.selectDifferentTemplate).click();
    }

    async getTemplatePreviewText(): Promise<string> {
        return await $(this.selectors.knowledgePreview).getText();
    }

    async isTemplatePresent(value: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.createKAHeading)));
        return await element(by.cssContainingText(this.selectors.templateName, value)).isPresent();
    }

    async clickOnDiscardButton(): Promise<void> {
        await $(this.selectors.discardButton).click();
    }

    async isKnoledgeSetTemplateIsDisplayed(): Promise<boolean> {
        return await $(this.selectors.knowledgeTemplateStyle).isDisplayed();
    }

    async getKnowledgeSetValue(): Promise<string> {
        return await $(this.selectors.knowledgeSetValue).getText();
    }

    async getKnowledgeArticleTitleValue(): Promise<string> {
        return await $(this.selectors.knowledgeTitleEditBox).getAttribute('value');
    }

    async isAttachDocumentBladeDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachmentField)));
        let attribute = await $(this.selectors.attachmentField).getAttribute('ng-click');
        return attribute == 'openDocumentLibrary()' ? true : false
    }

    async isDocumentTemplatePresent(documentheading: string): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.clickOnReferenceTemplate)));
        return await element(by.cssContainingText(this.selectors.templateHeading, documentheading)).isPresent();
    }

    async clickOnTemplate(TemplateName: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.clickOnReferenceTemplate)));
        await element(by.cssContainingText(this.selectors.clickOnReferenceTemplate, TemplateName)).click();
    }

    async   clickOnUseSelectedTemplateButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable(element(by.buttonText('Use selected Template'))));
        await element(by.buttonText('Use selected Template')).click();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.docEditorSection)));
    }

    async setReferenceValue(value: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.reference)));
        await $(this.selectors.reference).sendKeys(value);
    }

    async selectKnowledgeSet(knowledgeSet: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.knowledgeSet, knowledgeSet);
    }

    async addTextInKnowlegeTitleField(addTextKnowlegeTitleField: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeTitleEditBox)));
        await $(this.selectors.knowledgeTitleEditBox).sendKeys(addTextKnowlegeTitleField);
    }

    async clickOnSaveKnowledgeButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveKnowlegeButton)));
        await $(this.selectors.saveKnowlegeButton).click();
        //        await utilCommon.waitUntilPopUpDisappear();
    }

    async isAssignmentFieldDisabled(fldName: String): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeMetadataSection)));
        let fldsCount = await $$(this.selectors.knowledgeMetadataSection).count();
        for (let i = 0; i < fldsCount; i++) {
            let elem = await $$(this.selectors.knowledgeMetadataSection).get(i);
            if (await elem.$('.d-textfield__item').getText() == fldName) {
                return await elem.$('.btn-default').getAttribute("disabled") == "true" ? true : false;
            }
        }
    }

    async clickOnviewArticleLinkButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.viewArticleLink)));
        await $(this.selectors.viewArticleLink).click();
        //        await browser.wait(this.EC.or(async () => {
        //            let count = await browser.getAllWindowHandles().then(async function (handles) {
        //                return handles.length;
        //            });
        //            return count >= 2;
        //        }));
    }

    async isKnowledgeTitleRequired(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeTitleEditBox)));
        return await $(this.selectors.knowledgeTitleEditBox).getAttribute("required") == "true";
    }

    async isKnowledgeSetRequired(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeSetRequiedtext)));
        return await $(this.selectors.knowledgeSetRequiedtext).getAttribute("required") == "true";
    }

    async isAuthorRequired(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($$(this.selectors.authorRequiredText).last()));
        return await $(this.selectors.authorRequiredText).getAttribute("is-required") == "true";
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveKnowlegeButton)));
        return await $(this.selectors.saveKnowlegeButton).isEnabled();
    }

    async clickChangeAssignmentButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable(element(by.buttonText('Change Assignment'))));
        await element(by.buttonText('Change Assignment')).click();
    }

    async clickAssignToMeButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignToMeBtn)));
        await $(this.selectors.assignToMeBtn).click();
    }

    async isCategoryTier1FieldLabelDisplayed(fieldName: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.categoryTier1Guid, fieldName);
    }

    async isCategoryTier2FieldLabelDisplayed(fieldName: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.categoryTier2Guid, fieldName);
    }

    async isCategoryTier3FieldLabelDisplayed(fieldName: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.categoryTier3Guid, fieldName);
    }

    async isCategoryTier4FieldLabelDisplayed(fieldName: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.categoryTier4Guid, fieldName);
    }

    async getValueOfCategoryTier1():Promise<string>{
        return $(this.selectors.categoryTier1Value).getText();
    }

    async getValueOfCategoryTier2():Promise<string>{
        return $(this.selectors.categoryTier2Value).getText();
    }

    async getValueOfCategoryTier3():Promise<string>{
        return $(this.selectors.categoryTier3Value).getText();
    }

    async selectCategoryTier1Option(fieldOption: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.categoryTier1Guid, fieldOption);
    }

    async selectCategoryTier2Option(fieldOption: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.categoryTier2Guid, fieldOption);
    }

    async selectCategoryTier3Option(fieldOption: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.categoryTier3Guid, fieldOption);
    }

    async selectCategoryTier4Option(fieldOption: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.categoryTier4Guid, fieldOption);
    }

    async clickOnDropDownOption(guid: string): Promise<void> {
        let category = await $(`[rx-view-component-id='${guid}'] div.ui-select-match`);
        await category.click();
    }

    async selectRegionDropDownOption(fieldOption: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.regionGuid, fieldOption);
    }

    async selectSiteDropDownOption(fieldOption: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.siteGuid, fieldOption);
    }

    async selectKnowledgeTemplate(fieldName: string): Promise<void> {
        let templateName = `[rx-view-component-id='6e402c66-fcdc-464b-b6e7-7e963d9c3a17'] [title='${fieldName}']`;
        //        await browser.wait(this.EC.elementToBeClickable($(templateName)));
        await $(templateName).click();
    }

    async clickBackButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.backButton)));
        await $(this.selectors.backButton).click();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.saveKnowlegeButton)));
    }

    async getKnowledgeId(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeId)));
        return await $(this.selectors.knowledgeId).getText();
    }

    async getCreateKnowledgeTitle(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.createKnowledgeTitle)));
        return await $(this.selectors.createKnowledgeTitle).getText();
    }

    async setValueInRTF(fieldName: string, value: string): Promise<void> {
        await $(`[aria-label=${fieldName}] div`).sendKeys(value);
    }
}

export default new CreateKnowledgePage();
