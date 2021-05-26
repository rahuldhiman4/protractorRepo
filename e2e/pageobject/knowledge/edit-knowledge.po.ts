import { $, $$, by, element, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../utils/utility.common'
import { resolve } from 'path';

class EditKnowledgePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        statusChange: 'ux-status-transition span',
        statusSaveBtn: '[rx-view-component-id="e45ca390-e752-4bd5-97c7-69618d609d59"] button',
        statusCancelBtn: '[rx-view-component-id="cf381d41-6377-4ee2-9cbc-87b59207eb3d"] button',
        changeReviewerBtn: '[rx-view-component-id="f8c32272-6166-4001-a2dc-60762b5f6d69"] button',
        assigneToMeReviewerAssign: '[rx-view-component-id="7b202136-47a8-4234-b369-c300297055c6"] button',
        reviewerCompanyfldStatusBlade: '[rx-view-component-id="6f8e4177-cad6-4d59-9467-074b688aa06e"] adapt-select',
        reviewerBUfldStatusBlade: '[rx-view-component-id="bd3d17d2-074a-41e6-8d27-c5d47c6b6a63"] adapt-select',
        reviewerDepfldStatusBlade: '[rx-view-component-id="a70e47b4-b9fb-4a34-86ac-b263178e39ed"] adapt-select',
        reviewerGrpfldStatusBlade: '[rx-view-component-id="0605287c-c69c-45d9-b346-60a441174f8c"] adapt-select',
        reviewerfldStatusBlade: '[rx-view-component-id="f3c31aef-c282-4198-b94b-908af66aeae2"] bwf-select-with-pagination.ng-dirty button',
        reviewPendingBtn: '[rx-view-component-id="f0cf7f67-da22-4149-a54d-ec3b95fe05e6"] button',
        editLinkKnowledgeMetadata: '[rx-view-component-id="56cc9627-6ef9-46f8-9b76-728349193ed2"] .float-right button',
        saveBtnEditMetadata: '[rx-view-component-id="15dcacfb-8cb2-49b7-a5db-fe0e16b311dc"] button',
        cancelBtnEditMetadata: '[rx-view-component-id="ac1bd253-5d63-4175-b8a1-56293d1ef4d9"] button',
        knowledgeMetadataSection: '[rx-view-component-id="56cc9627-6ef9-46f8-9b76-728349193ed2"] label',
        saveButtonONKA: '[rx-view-component-id="813f61fe-28db-4d22-bfa5-4055e8a583fc"] button',
        editRegionGuid: 'c46cafd9-8481-4ffc-812d-3f6ba1308e66',
        editSiteGuid: 'b9ea351a-18bf-4048-86f4-a9c5d1307d6b',
        editSiteGroupGuid:'4380db45-e177-4005-a9a2-b308cdb38706',
        statusChangeDrpDwnGuid: '6f8e4177-cad6-4d59-9467-074b688aa06e',
        knowledgeTitle: '[rx-view-component-id="cd9b041b-6a82-4322-8a07-165a370ad0dd"] input',
        statusChnageBlade: '.dp-wrapper',
        knowledgeReviewHeader: '[rx-view-component-id="1d906e6a-cf0e-4358-94e8-d86ff0733068"] span',
        knowledgeRevierGroup: '[rx-view-component-id="0b622151-c917-4d1c-97e4-3a9b7f082e2d"] button',
        KnowledgeReviewer: '[rx-view-component-id="387dfda7-4f77-4df0-9ac0-6f4fb83b6fe7"] button',
        knowledgeReviewerValue: '[rx-view-component-id="b56b4649-9f86-4ba9-a8a5-56d9c000cc89"] button',
        siteValue: '[rx-view-component-id="ff94cecf-1b32-46c2-a207-cd3e426d52f7"] button',
        removeRegionValues: '[rx-view-component-id="d5c6cfef-2d53-48df-a03a-1a3e8381eef5"] .glyphicon-remove',
        articleEditOption: '[rx-view-component-id="1592eebc-8777-48cc-ae6c-d2b82a60a972"] adapt-button',
        articleMinorEditOptionHelpText: '[rx-view-component-id="27c1d328-8b58-4f1f-9b78-61d99f18dcc6"] p',
        articleMajorEditOptionHelpText: '[rx-view-component-id="3ba9e93b-6d48-4e15-ab0a-ca19f12b5a41"] p',
        articleCancelButton: '[rx-view-component-id="b7af03ad-d6dd-4db5-86f6-b459ca1fed71"] button',
        articleTitle: '[rx-view-component-id="cd9b041b-6a82-4322-8a07-165a370ad0dd"] input',
        articleDescription: '[rx-view-component-id="52856b97-e17e-444d-a556-fa0ad35eb3c8"] .doc-editor__section-content',
        articleMajorEditSaveButton: '[rx-view-component-id="8173a0e5-75f9-48bf-aeec-b5e9cef72de9"] button',
        knowledgeMetadataSaveButton: '[rx-view-component-id="15dcacfb-8cb2-49b7-a5db-fe0e16b311dc"] button',
        selectIsExternalGUID: '660f2cd8-9439-4954-9638-0064fbcb0e28',
        keywordValue: '[rx-view-component-id="51e52d59-3acd-49b3-8291-e10558985fa1"] input',
        attachmentField: '[rx-view-component-id="1f42f6d7-99cc-4c07-9249-94172d98d526"] .d-icon-paperclip',
        categoryTier1Guid: '548abb7f-fba4-45ff-99b1-892b3f2a4259',
        categoryTier2Guid: '500df0db-3051-4dbd-b0d2-047dd3ecad6f',
        categoryTier3Guid: 'b37cdfba-76b4-46af-a635-dfbf36a8dec9',
        regionGuid: 'c46cafd9-8481-4ffc-812d-3f6ba1308e66',
        siteGuid: '04ce12b3-98c9-4239-9aa7-35b6fc950178',
        uploadAttachmentField: '[rx-view-component-id="1f42f6d7-99cc-4c07-9249-94172d98d526"] input[type="file"]',
        closedTip: '.bwf-attachment-container__remove .d-icon-cross',
        closedStatusChangeGuid: 'b71875a3-b23a-4fc4-8f0f-0e29f2e6eb74',
        changeAssignment: '[rx-view-component-id="3da1754d-3c41-4b04-9e1c-f5f5a6b3226f"] button',
        lobSection: '[rx-view-component-id="0cfb311c-db00-4b54-93dd-6c03e301e3ab"] adapt-select'
    }

    async setKnowledgeStatus(newStatus: string): Promise<void> {
        await $(this.selectors.statusChange).click();
        await browser.sleep(500); // "may" required to let the status blade appear
        await utilityCommon.selectDropDown(this.selectors.statusChangeDrpDwnGuid, newStatus);
        await $(this.selectors.statusSaveBtn).click();
    }

    async setClosedKnowledgeStatus(newStatus: string): Promise<void> {
        await $(this.selectors.statusChange).click();
        await utilityCommon.selectDropDown(this.selectors.closedStatusChangeGuid, newStatus);
        await $(this.selectors.statusSaveBtn).click();
    }

    async getStatusValue(): Promise<string> {
        console.log('Statusvalue', await $(this.selectors.statusChange).getText());
        return await $(this.selectors.statusChange).getText();
    }

    async isStatusChangeBladePresent(): Promise<boolean> {
        await $(this.selectors.statusChange).click();
        return await $(this.selectors.statusChnageBlade).isPresent();
    }

    async setKnowledgeStatusAndVerifyAssignmentNotAppear(newStatus: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        await utilityCommon.selectDropDown(this.selectors.statusChangeDrpDwnGuid, newStatus);
        await $(this.selectors.statusSaveBtn).click();
    }

    async setKnowledgeStatusWithoutSave(newStatus: string): Promise<void> {
        await $(this.selectors.statusChange).click();
        await utilityCommon.selectDropDown(this.selectors.statusChangeDrpDwnGuid, newStatus);
    }

    async setClosedKnowledgeStatusWithoutSave(newStatus: string): Promise<void> {
        await $(this.selectors.statusChange).click();
        await utilityCommon.selectDropDown(this.selectors.closedStatusChangeGuid, newStatus);
    }

    async clickSaveStatusBtn(): Promise<void> {
        await $(this.selectors.statusSaveBtn).click();
    }

    async clickCancelStatusBtn(): Promise<void> {
        await $(this.selectors.statusCancelBtn).click();
    }

    async clickChangeAssignmentButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable(element(by.buttonText('Change Assignment'))));
        await $(this.selectors.changeAssignment).click();
    }

    async saveKnowledgeMedataDataChanges(): Promise<void> {
        await $(this.selectors.saveBtnEditMetadata).click();
    }

    async cancelKnowledgeMedataDataChanges(): Promise<void> {
        await $(this.selectors.cancelBtnEditMetadata).click();
    }

    async getKnowledgeMetaDataValue(fldName: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeMetadataSection)));
        let fldsCount = await $$(this.selectors.knowledgeMetadataSection).count();
        for (let i = 0; i < fldsCount; i++) {
            if (await $$(this.selectors.knowledgeMetadataSection).get(i).getText() == fldName) {
                return await $$('[rx-view-component-id="56cc9627-6ef9-46f8-9b76-728349193ed2"] .read-only-content').get(i).getAttribute("title");
            }
        }
    }

    async selectRegionDropDownOption(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.editRegionGuid, fieldOption);
    }

    async selectSiteDropDownOption(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.editSiteGuid, fieldOption);
    }
    async selectSiteGroupDropDownOption(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.editSiteGroupGuid, fieldOption);
    }

    async updateRegionDropDownOption(guid: string, fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.editRegionGuid, fieldOption);
    }

    async updateSiteDropDownOption(guid: string, fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.editSiteGuid, fieldOption);
    }

    async isChangeReviewerButtonPresent(): Promise<Boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.changeReviewerBtn)));
        return await $(this.selectors.changeReviewerBtn).isDisplayed();
    }

    async clickChangeReviewerBtn(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.changeReviewerBtn)));
        await $(this.selectors.changeReviewerBtn).click();
    }

    async isAssignToMeReviewerBladePresent(): Promise<Boolean> {
        return await $(this.selectors.assigneToMeReviewerAssign).isPresent().then(async (link) => {
            if (link) {
                return await $(this.selectors.assigneToMeReviewerAssign).isDisplayed();
            } else return false;
        });
    }

    async clickAssignToMeReviewerBlade(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneToMeReviewerAssign)));
        await $(this.selectors.assigneToMeReviewerAssign).click();
    }

    async isReviewerCompanyFieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        return await $(this.selectors.reviewerCompanyfldStatusBlade).getAttribute("aria-disabled") == "true";
    }

    async isReviewerBusinessUnitFieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerBUfldStatusBlade)));
        return await $(this.selectors.reviewerBUfldStatusBlade).getAttribute("aria-readonly") == "true";
    }

    async isReviewerDepartmentfieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerDepfldStatusBlade)));
        return await $(this.selectors.reviewerDepfldStatusBlade).getAttribute("aria-readonly") == "true";
    }

    async isReviewerGrpFieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerGrpfldStatusBlade)));
        return await $(this.selectors.reviewerGrpfldStatusBlade).getAttribute("aria-readonly") == "true";
    }

    async isReviewerFieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerfldStatusBlade)));
        return await $(this.selectors.reviewerfldStatusBlade).getAttribute("aria-disabled") == "true";
    }

    async isReviewerFieldDisabledInEdit(): Promise<boolean> {
        return await $(this.selectors.KnowledgeReviewer).getAttribute("disabled") == "true";
    }

    async isReviewerGroupFieldDisabledInEdit(): Promise<boolean> {
        return await $(this.selectors.KnowledgeReviewer).getAttribute("disabled") == "true";
    }

    async isReviewPendingButtonDisplayed(): Promise<Boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewPendingBtn)));
        return await $(this.selectors.reviewPendingBtn).isDisplayed();
    }

    async getCategoryTier1SelectedValue(): Promise<string> {
        return await utilityCommon.getSelectedFieldValue('548abb7f-fba4-45ff-99b1-892b3f2a4259');
    }
    async getLineOfBusinessValue(): Promise<string> {
        return await utilityCommon.getSelectedFieldValue('0cfb311c-db00-4b54-93dd-6c03e301e3ab');
    }

    async getRegionSelectedValue(fieldName: string): Promise<string> {
        return await utilityCommon.getSelectedFieldValue(fieldName);
    }

    async getSiteSelectedValue(fieldName: string): Promise<string> {
        return await utilityCommon.getSelectedFieldValue(fieldName);
    }

    async getSelectedFieldValue(fieldName: string): Promise<string> {
        let fieldLocator = await $$('adapt-rx-select');
        let fieldValue: string = undefined;
        for (let i: number = 0; i < fieldLocator.length; i++) {
            if (await fieldLocator[i].$('.form-control-label span').getText() == fieldName) {
                fieldValue = await fieldLocator[i].$('.rx-select__search-button-title').getText();
            }
        }
        return fieldValue;
    }

    async clickOnSaveButtonOfKA(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButtonONKA)));
        await $(this.selectors.saveButtonONKA).click();
    }

    async changeKnowledgeTitle(value: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeTitle)));
        await $(this.selectors.knowledgeTitle).click();
        await $(this.selectors.knowledgeTitle).clear();
        await $(this.selectors.knowledgeTitle).sendKeys(value);
    }

    async getKnowledgeReviewHeader(): Promise<string> {
        return await $(this.selectors.knowledgeReviewHeader).getText();
    }

    async getReviewerValue(): Promise<string> {
        return await $$(this.selectors.knowledgeReviewerValue).get(1).getText()
    }

    async isArticleEditOptionDisplayed(editOption: string): Promise<boolean> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleEditOption)),2000);
        return await element(by.cssContainingText(this.selectors.articleEditOption, editOption)).isDisplayed();
    }

    async isArticleEditOptionDisabled(editOption: string): Promise<boolean> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleEditOption)),2000);
        return await element(by.cssContainingText(this.selectors.articleEditOption, editOption)).isPresent();
    }

    async selectArticleEditOption(editOption: string): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleEditOption)),2000);
        await element(by.cssContainingText(this.selectors.articleEditOption, editOption)).click();
    }

    async isHelpTextMinorEditOptionDisplayed(): Promise<boolean> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleMinorEditOptionHelpText)),2000);
        return await $(this.selectors.articleMinorEditOptionHelpText).isPresent();
    }

    async isHelpTextForMajorEditOptionDisplayed(): Promise<boolean> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleMajorEditOptionHelpText)),2000);
        return await $(this.selectors.articleMajorEditOptionHelpText).isPresent();
    }

    async getHelpTextForMinorEditOptionDisplayed(): Promise<string> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleMinorEditOptionHelpText)),2000);
        return await $(this.selectors.articleMinorEditOptionHelpText).getText();
    }

    async getHelpTextForMajorEditOptionDisplayed(): Promise<string> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleMajorEditOptionHelpText)),2000);
        return await $(this.selectors.articleMajorEditOptionHelpText).getText();
    }

    async clickArticleCancelButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButtonOnKA)));
        await $(this.selectors.articleCancelButton).click();
    }

    async updateKnowledgeArticleTitle(articleTitle: string): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleTitle)));
        await $(this.selectors.articleTitle).clear();
        await $(this.selectors.articleTitle).sendKeys(articleTitle);
    }
    async updateKnowledgeArticleDescription(articleDesc: string): Promise<void> {
        await utilityCommon.setCKEditor(articleDesc);
    }

    async clickArticleMajorEditSaveButton(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleMajorEditSaveButton)));
        await $(this.selectors.articleMajorEditSaveButton).click();
    }

    async clickSaveKnowledgeMetadata(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeMetadataSaveButton)));
        await $(this.selectors.knowledgeMetadataSaveButton).click();
    }

    async selectIsExternalOption(isExternalOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.selectIsExternalGUID, isExternalOption);
    }

    async enterKeyword(keyword: string): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.keywordValue)));
        await $(this.selectors.keywordValue).clear();
        await $(this.selectors.keywordValue).sendKeys(keyword);
        await $(this.selectors.keywordValue).sendKeys(protractor.Key.ENTER);
    }

    async isMinorEditSaveButtonDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButtonONKA)));
        return await $(this.selectors.saveButtonONKA).getAttribute("disabled") == 'true';

    }

    async isMajorEditSaveButtonDisabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier1Drpbox)));
        return await $(this.selectors.articleMajorEditSaveButton).getAttribute("disabled") == 'true';

    }

    async isAttachDocumentBladeDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachmentField)));
        let attribute = await $(this.selectors.attachmentField).getAttribute('ng-click');
        return attribute == 'openDocumentLibrary()' ? true : false
    }

    async setCategoryTier1(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier1Guid, fieldOption);
    }

    async setCategoryTier2(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier2Guid, fieldOption);
    }

    async setCategoryTier3(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier3Guid, fieldOption);
    }

    async addAttachment(fileToUpload: string[]): Promise<void> {
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        console.log(absPathArray);
        await $(this.selectors.uploadAttachmentField).sendKeys(absPathArray.join('\n'));
    }

    async removeAttachment(): Promise<void> {
        await $(this.selectors.closedTip).click();
    }

    async removeCategoryTier1(): Promise<void> {
        await utilityCommon.clearDropDown(this.selectors.categoryTier1Guid, 'None');
    }

    async removeCategoryTier2(): Promise<void> {
        await utilityCommon.clearDropDown(this.selectors.categoryTier2Guid, 'None');
    }

    async removeCategoryTier3(): Promise<void> {
        await utilityCommon.clearDropDown(this.selectors.categoryTier3Guid, 'None');
    }

    async removeSiteValue(): Promise<void> {
        await utilityCommon.clearDropDown('04ce12b3-98c9-4239-9aa7-35b6fc950178', 'None');
    }

    async removeRegionValue(): Promise<void> {
        await utilityCommon.clearDropDown('c46cafd9-8481-4ffc-812d-3f6ba1308e66', 'None');
    }
    async isValuePresentInDropdown(DropDownName: string, value: string): Promise<boolean> {
        let guid;
        switch (DropDownName) {
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
            default: {
                console.log('Drop Down name does not match');
                break;
            }
        }
        return await utilityCommon.isValuePresentInDropDown(guid, value);
    }

    async isLobSectionEnabled(): Promise<boolean> {
        return await $(this.selectors.lobSection).isEnabled();
    }
}

export default new EditKnowledgePage();
