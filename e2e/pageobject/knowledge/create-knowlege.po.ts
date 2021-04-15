import { DropDownType } from "../../utils/constants";
import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../utils/utility.common';

class CreateKnowledgePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createKnowledgeHeader: '[rx-view-component-id="cebb7cbd-0e7b-48a2-9944-c11d3ba255d0"] p',
        knowledgeTitleEditBox: '[rx-view-component-id="291bf2bb-1eac-404e-94ba-762a50da5ac9"] input',
        saveKnowlegeButton: '[rx-view-component-id="2fdb0ffb-560d-46b4-b7af-379d90bcb0a8"] button',
        knowledgeSet: '80a2cd78-e9a5-4997-b7bb-6fadf918bd3e',
        assignToMeBtn: '[rx-view-component-id="47343ecd-1617-4f52-9fbd-9f4a6f259760"] bwf-assign-to-me button',
        knowledgeMetadataSection: '[rx-view-component-id="789f2b42-5a5f-4926-8ddd-c2b90fbb7e5e"] .adapt-select',
        knowledgeSetRequiedtext: '[rx-view-component-id="80a2cd78-e9a5-4997-b7bb-6fadf918bd3e"]  adapt-rx-select',
        authorRequiredText: '[rx-view-component-id="0a50ea72-5fe9-4488-9547-de0a7eb38dee"] .adapt-select',
        attachmentField: '[rx-view-component-id="bf6900ad-d67a-4705-b907-3caa50b640c7"] .d-icon-paperclip',
        templateHeading: '[rx-view-component-id="8569cbb0-91e3-4a14-a71a-133e49bb798e"] .template-name',
        templateSection: '[rx-view-component-id="8569cbb0-91e3-4a14-a71a-133e49bb798e"] .template-sections',
        regionGuid: 'a0e3703d-7655-4861-9a72-13168852b998',
        siteGuid: 'd71842ad-8244-4e00-a03c-b583a98245ba',
        categoryTier1Guid: '082c0d4d-2425-4549-a13f-3f462843559f',
        categoryTier2Guid: '214299c9-ba6d-44fb-8f0e-9a1ebefe280f',
        categoryTier3Guid: '8250e409-b774-45b5-91d2-89b620560263',
        categoryTier4Guid: '5140f73c-3581-47ff-914a-82ad05e06b6b',
        referenceGuid: '7591fcfd-3d96-4155-a450-33c6e591dc2c',
        discardButton: '[rx-view-component-id="0b2d73c8-de57-460b-909c-17e2ae50ea5b"] button',
        knowledgeSetValue: '[rx-view-component-id="80a2cd78-e9a5-4997-b7bb-6fadf918bd3e"] button',
        knowledgeTemplateStyle: '[rx-view-component-id="8569cbb0-91e3-4a14-a71a-133e49bb798e"] .create-ka-template__style-label',
        knowledgePreview: '[rx-view-component-id="8569cbb0-91e3-4a14-a71a-133e49bb798e"] .create-ka-template',
        selectDifferentTemplate: '[rx-view-component-id="8569cbb0-91e3-4a14-a71a-133e49bb798e"] .group-buttons button.btn-secondary',
        changeTemplate: '[rx-view-component-id="64e29650-ca7f-4b3d-a2af-826be22f8e0f"] button',
        categoryTier1Value: '[rx-view-component-id="082c0d4d-2425-4549-a13f-3f462843559f"] button',
        categoryTier2Value: '[rx-view-component-id="214299c9-ba6d-44fb-8f0e-9a1ebefe280f"] button',
        categoryTier3Value: '[rx-view-component-id="8250e409-b774-45b5-91d2-89b620560263"] button',
        templatePreview: '.create-ka-template__preview',
        backBtn: '[rx-view-component-id="75d55491-37d4-40f2-83ef-35019670e355"] button',
        imageIcon: '[rx-view-component-id="7591fcfd-3d96-4155-a450-33c6e591dc2c"] .cke_toolgroup .cke_button__image',
        lineOfBusiness: '[rx-view-component-id="9bcf3768-1f60-4b44-a300-3bad90b22651"] button[btn-type="tertiary"]',
        useSelectedTemplateBtn: '[rx-view-component-id="8569cbb0-91e3-4a14-a71a-133e49bb798e"] .btn-primary',
        siteGrpGuid: 'f161abec-d0d4-487d-9099-7879f66ae01a'
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

    async clickOnUseSelectedTemplateButton(): Promise<void> {
        await $(this.selectors.useSelectedTemplateBtn).click();
    }

    async setReferenceValue(value: string): Promise<void> {
        await utilityCommon.setCKEditor(value, this.selectors.referenceGuid);
    }

    async selectKnowledgeSet(knowledgeSet: string): Promise<void> {
        await utilityCommon.selectDropDown("Knowledge Set(required)", knowledgeSet, DropDownType.Label);
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
                return await elem.getAttribute("aria-readonly") == "true" ? true : false;
            }
        }
    }

    async isAssignedToFieldDisabled(fldName: String): Promise<boolean> {
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
    async selectSiteGroupDropDownOption(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.siteGrpGuid, fieldOption);
    }
    async getCreateKnowledgeHeader(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.createKnowledgeTitle)));
        return await $(this.selectors.createKnowledgeHeader).getText();
    }

    async isTemplateDescriptionPresent(description: string): Promise<boolean> {
        return await element(by.cssContainingText('.template-description', description)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText('.template-description', description)).isDisplayed();
        });
    }

    async isSectionTitleVisibleOnPreview(title: string): Promise<boolean> {
        return await element(by.cssContainingText('.section-title', title)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText('.section-title', title)).isDisplayed();
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
    async getValueOfLineOFBusiness(): Promise<string> {
        return (await $(this.selectors.lineOfBusiness).getText()).trim();
    }

    async isLineOfBusinessDisable(): Promise<boolean> {
        return await $(this.selectors.lineOfBusiness).isDisplayed();
    }
    async isValuePresentInDropdown(DropDownName: string, value: string): Promise<boolean> {
        let guid;
        switch (DropDownName) {
            case "Knowledge Set": {
                guid = this.selectors.knowledgeSet;
                break;
            }
            case "Category Tier 1": {
                guid = this.selectors.categoryTier1Guid;
                break;
            }
            case "Category Tier 2": {
                guid = this.selectors.categoryTier2Guid;
                break;
            }
            case "Category Tier 3": {
                guid = this.selectors.categoryTier3Guid;
                break;
            }
            case "Category Tier 4": {
                guid = this.selectors.categoryTier4Guid;
                break;
            }
            default: {
                console.log('Drop Down name does not match');
                break;
            }
        }
        return await utilityCommon.isValuePresentInDropDown(guid, value);
    }

}

export default new CreateKnowledgePage();
