import { $, $$, by, element, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common'
import { resolve } from 'path';

class EditKnowledgePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        statusChange: 'ux-status-transition .status-transition',
        statusSaveBtn: '[rx-view-component-id="e45ca390-e752-4bd5-97c7-69618d609d59"] button',
        statusCancelBtn: '[rx-view-component-id="cf381d41-6377-4ee2-9cbc-87b59207eb3d"] button',
        changeReviewerBtn: '[rx-view-component-id="f8c32272-6166-4001-a2dc-60762b5f6d69"] button',
        assigneToMeReviewerAssign: '[rx-view-component-id="7b202136-47a8-4234-b369-c300297055c6"] button',
        reviewerCompanyfldStatusBlade: '[rx-view-component-id="b4f529dc-f3b8-476a-b25d-40f5e6b71b5f"] button',
        reviewerBUfldStatusBlade: '[rx-view-component-id="bd3d17d2-074a-41e6-8d27-c5d47c6b6a63"] button',
        reviewerDepfldStatusBlade: '[rx-view-component-id="a70e47b4-b9fb-4a34-86ac-b263178e39ed"] button',
        reviewerGrpfldStatusBlade: '[rx-view-component-id="0605287c-c69c-45d9-b346-60a441174f8c"] button',
        reviewerfldStatusBlade: '[rx-view-component-id="8c7814b7-de3d-4067-8ea6-cf4d15943bf6"] button',
        reviewPendingBtn: '[rx-view-component-id="f0cf7f67-da22-4149-a54d-ec3b95fe05e6"] button',
        editLinkKnowledgeMetadata: '[rx-view-component-id="56cc9627-6ef9-46f8-9b76-728349193ed2"] .float-right button',
        saveBtnEditMetadata: '[rx-view-component-id="15dcacfb-8cb2-49b7-a5db-fe0e16b311dc"] button',
        knowledgeMetadataSection: '[rx-view-component-id="6cdbaf54-4c29-4ca0-ab73-aa165234f9ed"] .d-textfield',
        saveButtonONKA: '[rx-view-component-id="813f61fe-28db-4d22-bfa5-4055e8a583fc"] button',
        editRegionGuid: 'd5c6cfef-2d53-48df-a03a-1a3e8381eef5',
        editSiteGuid: 'aa218b2b-4fa3-4525-82f3-3e0f9bfc4193',
        statusChangeDrpDwnGuid: '6f8e4177-cad6-4d59-9467-074b688aa06e',
        knowledgeTitle: '[rx-view-component-id="cd9b041b-6a82-4322-8a07-165a370ad0dd"] input',
        statusChnageBlade: '.dp-wrapper',
        knowledgeReviewHeader: '[rx-view-component-id="1d906e6a-cf0e-4358-94e8-d86ff0733068"] span',
        knowledgeRevierGroup: '[rx-view-component-id="0b622151-c917-4d1c-97e4-3a9b7f082e2d"] button',
        KnowledgeReviewer: '[rx-view-component-id="387dfda7-4f77-4df0-9ac0-6f4fb83b6fe7"] button',
        knowledgeReviewerValue: '[rx-view-component-id="387dfda7-4f77-4df0-9ac0-6f4fb83b6fe7"] button',
        siteValue: '[rx-view-component-id="ff94cecf-1b32-46c2-a207-cd3e426d52f7"] button',
        removeRegionValues: '[rx-view-component-id="d5c6cfef-2d53-48df-a03a-1a3e8381eef5"] .glyphicon-remove',
        articleEditOption: '[rx-view-component-id="1592eebc-8777-48cc-ae6c-d2b82a60a972"] button',
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
        categoryTier1Guid: '2e629e99-f2fa-48a2-910b-0652a6bf032f',
        categoryTier2Guid: '7e8a318c-2948-4b54-a8b6-049146bdf6c9',
        categoryTier3Guid: 'f2703b24-f357-46f7-83bc-e216f6d33cb0',
        regionGuid: '6c3548bc-bd52-4da6-b365-f546ca7bd744',
        siteGuid: '6c3548bc-bd52-4da6-b365-f546ca7bd744',
        uploadAttachmentField : '[rx-view-component-id="1f42f6d7-99cc-4c07-9249-94172d98d526"] input[type="file"]',
        closedTip: '.bwf-attachment-container__remove .d-icon-cross',
        closedStatusChangeGuid: 'b71875a3-b23a-4fc4-8f0f-0e29f2e6eb74',
    }

    async setKnowledgeStatus(newStatus: string): Promise<void> {
        await $(this.selectors.statusChange).click();
        await utilityCommon.selectDropDown(this.selectors.statusChangeDrpDwnGuid, newStatus);
        await $(this.selectors.statusSaveBtn).click();
    }

    async setClosedKnowledgeStatus(newStatus: string): Promise<void> {
        await $(this.selectors.statusChange).click();
        await utilityCommon.selectDropDown(this.selectors.closedStatusChangeGuid, newStatus);
        await $(this.selectors.statusSaveBtn).click();
    }

    async getStatusValue(): Promise<string> {
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
        await element(by.buttonText('Change Assignment')).click();
    }

    async saveKnowledgeMedataDataChanges(): Promise<void> {
        await $(this.selectors.saveBtnEditMetadata).click();
    }

    async verifyKnowledgeMetadata(fldName: String, fldVal: String): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeMetadataSection)));
        let fldsCount = await $$(this.selectors.knowledgeMetadataSection).count();
        for (let i = 0; i < fldsCount; i++) {
            let elem = await $$(this.selectors.knowledgeMetadataSection).get(i);
            if (await elem.$('.d-textfield__item').getText() == fldName) {
                expect(await elem.$('.d-textfield__rx-value').getText()).toBe(fldVal);
                break;
            }
        }
    }

    async selectRegionDropDownOption(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.editRegionGuid, fieldOption);
    }

    async selectSiteDropDownOption(fieldOption: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.editSiteGuid, fieldOption);
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
        return $(this.selectors.assigneToMeReviewerAssign).isPresent().then(async (link) => {
            if (link) {
                return $(this.selectors.assigneToMeReviewerAssign).isDisplayed();
            } else return false;
        });
    }

    async clickAssignToMeReviewerBlade(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneToMeReviewerAssign)));
         await $(this.selectors.assigneToMeReviewerAssign).click();
    }

    async isReviewerCompanyFieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        return await $(this.selectors.reviewerCompanyfldStatusBlade).getAttribute("disabled") == "true";
    }

    async isReviewerBusinessUnitFieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerBUfldStatusBlade)));
        return await $(this.selectors.reviewerBUfldStatusBlade).getAttribute("disabled") == "true";
    }

    async isReviewerDepartmentfieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerDepfldStatusBlade)));
        return await $(this.selectors.reviewerDepfldStatusBlade).getAttribute("disabled") == "true";
    }

    async isReviewerGrpFieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerGrpfldStatusBlade)));
        return await $(this.selectors.reviewerGrpfldStatusBlade).getAttribute("disabled") == "true";
    }

    async isReviewerFieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerfldStatusBlade)));
        return await $(this.selectors.reviewerfldStatusBlade).getAttribute("disabled") == "true";
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

    async getCategoryTier1SelectedValue(fieldName: string): Promise<string> {
        return await utilCommon.getSelectedFieldValue(fieldName);
    }

    async getRegionSelectedValue(fieldName: string): Promise<string> {
        return await utilCommon.getSelectedFieldValue(fieldName);
    }

    async getSiteSelectedValue(fieldName: string): Promise<string> {
        return await utilCommon.getSelectedFieldValue(fieldName);
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
        return await $(this.selectors.knowledgeReviewerValue).getText()
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
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleDescription)));
        await $(this.selectors.articleDescription).clear();
        await $(this.selectors.articleDescription).sendKeys(articleDesc);
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

    async isMinorEditSaveButtonEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButtonONKA)));
        return await $(this.selectors.saveButtonONKA).getAttribute("disabled") == 'true';

    }

    async isMajorEditSaveButtonEnabled(): Promise<boolean> {
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

    async removeAttachment(): Promise<void> {
        await $(this.selectors.closedTip).click();
    }

    async removeCategoryTier1(): Promise<void> {
        await utilityCommon.clearDropDown(this.selectors.categoryTier1Guid,'None');
    }
    
    async removeCategoryTier2(): Promise<void> {
        await utilityCommon.clearDropDown(this.selectors.categoryTier2Guid,'None');
    }
    
    async removeCategoryTier3(): Promise<void> {
        await utilityCommon.clearDropDown(this.selectors.categoryTier3Guid,'None');
    }

    async removeSiteValue(): Promise<void> {
        await utilityCommon.clearDropDown('ff94cecf-1b32-46c2-a207-cd3e426d52f7','Clear');
    }

    async removeRegionValue(): Promise<void> {
        await utilityCommon.clearDropDown('6c3548bc-bd52-4da6-b365-f546ca7bd744','Clear');
    }
}

export default new EditKnowledgePage();
