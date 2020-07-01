import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilityCommon from '../../utils/utility.common';

class CreateKnowledgePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createKnowledgeHeader: '[rx-view-component-id="cebb7cbd-0e7b-48a2-9944-c11d3ba255d0"] p',
        knowledgeTitleEditBox: '[rx-view-component-id="291bf2bb-1eac-404e-94ba-762a50da5ac9"] input',
        saveKnowlegeButton: '[rx-view-component-id="2fdb0ffb-560d-46b4-b7af-379d90bcb0a8"] button',
        knowledgeSet: '80a2cd78-e9a5-4997-b7bb-6fadf918bd3e',
        assignToMeBtn: '[rx-view-component-id="8cb384cb-598d-46f4-a858-08111a6c51bd"] button',
        knowledgeMetadataSection: '[rx-view-component-id="789f2b42-5a5f-4926-8ddd-c2b90fbb7e5e"] .adapt-select',
        knowledgeSetRequiedtext: '[rx-view-component-id="80a2cd78-e9a5-4997-b7bb-6fadf918bd3e"] .adapt-select',
        authorRequiredText: '[rx-view-component-id="0a50ea72-5fe9-4488-9547-de0a7eb38dee"] .adapt-select',
        attachmentField: '[rx-view-component-id="bf6900ad-d67a-4705-b907-3caa50b640c7"] .d-icon-paperclip',
        templateHeading: '[rx-view-component-id="8569cbb0-91e3-4a14-a71a-133e49bb798e"] .template-name',
        templateSection: '[rx-view-component-id="8569cbb0-91e3-4a14-a71a-133e49bb798e"] .template-sections',
        regionGuid: '17b172fd-28d5-4553-bd22-b59695953287',
        siteGuid: 'ba9870e4-81f4-45ea-b034-9aff10bc3ab7',
        categoryTier1Guid: 'b51fcb01-f3d1-4da2-a42d-ffc5873a21b3',
        categoryTier2Guid: '6f480482-c224-4742-b941-bce655d40fde',
        categoryTier3Guid: '2774b518-00ab-4e02-bb23-95bdb0285840',
        categoryTier4Guid: 'd0bd4f0d-a53e-4c67-8419-016a926a7651',
        reference: '.cke_editable p',
        discardButton: '[rx-view-component-id="0b2d73c8-de57-460b-909c-17e2ae50ea5b"] button',
        knowledgeSetValue: '[rx-view-component-id="80a2cd78-e9a5-4997-b7bb-6fadf918bd3e"] button',
        knowledgeTemplateStyle: '[rx-view-component-id="8569cbb0-91e3-4a14-a71a-133e49bb798e"] .create-ka-template__style-label',
        knowledgePreview: '[rx-view-component-id="8569cbb0-91e3-4a14-a71a-133e49bb798e"] .create-ka-template',
        selectDifferentTemplate: '[rx-view-component-id="8569cbb0-91e3-4a14-a71a-133e49bb798e"] .group-buttons button.btn-secondary',
        changeTemplate: '[rx-view-component-id="64e29650-ca7f-4b3d-a2af-826be22f8e0f"] button',
        categoryTier1Value: '[rx-view-component-id="b51fcb01-f3d1-4da2-a42d-ffc5873a21b3"] button',
        categoryTier2Value: '[rx-view-component-id="6f480482-c224-4742-b941-bce655d40fde"] button',
        categoryTier3Value: '[rx-view-component-id="2774b518-00ab-4e02-bb23-95bdb0285840"] button',
        templatePreview: '.create-ka-template__preview',
        backBtn: '[rx-view-component-id="75d55491-37d4-40f2-83ef-35019670e355"] button',
        imageIcon: '[rx-view-component-id="7591fcfd-3d96-4155-a450-33c6e591dc2c"] .cke_toolgroup .cke_button__image',
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
        return await element(by.cssContainingText(this.selectors.templateHeading, value)).isPresent();
    }

    async clickOnDiscardButton(): Promise<void> {
        await $(this.selectors.discardButton).click();
    }

    async isKnowledgeStyleTemplateDisplayed(): Promise<boolean> {
        return await $(this.selectors.knowledgeTemplateStyle).isDisplayed();
    }

    async getKnowledgeSetValue(): Promise<string> {
        return await (await $(this.selectors.knowledgeSetValue).getText()).trim();
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

    async clickOnTemplate(templateName: string): Promise<void> {
        let templateLocator = await $$(this.selectors.templateHeading);
        for (let i = 0; i < templateLocator.length; i++) {
            if (await templateLocator[i].getText() == templateName) {
                await $$(this.selectors.templateSection).get(i).click();
                break;
            }
        }
    }

    async   clickOnUseSelectedTemplateButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable(element(by.buttonText('Use selected Template'))));
        await element(by.buttonText('Use selected Template')).click();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.docEditorSection)));
    }

    async setReferenceValue(value: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.reference)));
        await browser.waitForAngularEnabled(false);
        await browser.sleep(4000);
        await browser.switchTo().frame(element(by.css("iframe.cke_wysiwyg_frame")).getWebElement());
        await $(this.selectors.reference).sendKeys(value);
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async selectKnowledgeSet(knowledgeSet: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.knowledgeSet, knowledgeSet);
    }

    async addTextInKnowlegeTitleField(addTextKnowlegeTitleField: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeTitleEditBox)));
        await $(this.selectors.knowledgeTitleEditBox).sendKeys(addTextKnowlegeTitleField);
    }

    async clickOnSaveKnowledgeButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveKnowlegeButton)));
        await $(this.selectors.saveKnowlegeButton).click();
        //        await utilCommon.closePopUpMessage();
    }

    async isAssignmentFieldDisabled(fldName: String): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeMetadataSection)));
        let fldsCount = await $$(this.selectors.knowledgeMetadataSection).count();
        for (let i = 0; i < fldsCount; i++) {
            let elem = await $$(this.selectors.knowledgeMetadataSection).get(i);
            if (await elem.$('.adapt-select-label-wrapper').getText() == fldName) {
                return await elem.getAttribute("aria-disabled") == "true" ? true : false;
            }
        }
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
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.categoryTier1Guid, fieldName);
    }

    async isCategoryTier2FieldLabelDisplayed(fieldName: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.categoryTier2Guid, fieldName);
    }

    async isCategoryTier3FieldLabelDisplayed(fieldName: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.categoryTier3Guid, fieldName);
    }

    async isCategoryTier4FieldLabelDisplayed(fieldName: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.categoryTier4Guid, fieldName);
    }

    async getValueOfCategoryTier1(): Promise<string> {
        return (await $(this.selectors.categoryTier1Value).getText()).trim();
    }

    async getValueOfCategoryTier2(): Promise<string> {
        return (await $(this.selectors.categoryTier2Value).getText()).trim();
    }

    async getValueOfCategoryTier3(): Promise<string> {
        return (await $(this.selectors.categoryTier3Value).getText()).trim();
    }

    async selectCategoryTier1Option(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier1Guid, fieldOption);
    }

    async selectCategoryTier2Option(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier2Guid, fieldOption);
    }

    async selectCategoryTier3Option(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier3Guid, fieldOption);
    }

    async selectCategoryTier4Option(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier4Guid, fieldOption);
    }


    async selectRegionDropDownOption(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.regionGuid, fieldOption);
    }

    async selectSiteDropDownOption(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.siteGuid, fieldOption);
    }

    async getCreateKnowledgeHeader(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.createKnowledgeTitle)));
        return await $(this.selectors.createKnowledgeHeader).getText();
    }

    async isTemplateDescriptionPresent(description: string): Promise<boolean> {
        return await element(by.cssContainingText('.template-description', description)).isPresent().then( async (result) => {
            if(result) return await element(by.cssContainingText('.template-description', description)).isDisplayed();
        });
    }

    async isSectionTitleVisibleOnPreview(title: string): Promise<boolean> {
        return await element(by.cssContainingText('.section-title', title)).isPresent().then( async (result) => {
            if(result) return await element(by.cssContainingText('.section-title', title)).isDisplayed();
        });
    }

    async clickBackBtn(): Promise<void> {
        await $(this.selectors.backBtn).click();
    }

    async isTemplatePreviewPresent(): Promise<boolean> {
        return await $(this.selectors.templatePreview).isPresent();
    }

    async clickOnImageIcon(): Promise<void> {
        await $(this.selectors.imageIcon).click();
    }
}

export default new CreateKnowledgePage();
