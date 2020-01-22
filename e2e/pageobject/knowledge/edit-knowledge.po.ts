import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class EditKnowledgePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        statusChange: '.status-transition',
        statusSaveBtn: '[rx-view-component-id="e45ca390-e752-4bd5-97c7-69618d609d59"] .d-button',
        changeReviewerBtn: '[rx-view-component-id="6b2b2601-811e-4774-b09e-255fab00e547"] .d-button',
        assigneToMeReviewerAssign: '*.assign-to-me-component button',
        reviewerCompanyfldStatusBlade: '[rx-view-component-id="b4f529dc-f3b8-476a-b25d-40f5e6b71b5f"] .btn-default',
        reviewerBUfldStatusBlade: '[rx-view-component-id="bd3d17d2-074a-41e6-8d27-c5d47c6b6a63"] .btn-default',
        reviewerDepfldStatusBlade: '[rx-view-component-id="a70e47b4-b9fb-4a34-86ac-b263178e39ed"] .btn-default',
        reviewerGrpfldStatusBlade: '[rx-view-component-id="0605287c-c69c-45d9-b346-60a441174f8c"] .btn-default',
        reviewerfldStatusBlade: '[rx-view-component-id="8c7814b7-de3d-4067-8ea6-cf4d15943bf6"] .btn-default',
        reviewPendingBtn: '[rx-view-component-id="f0cf7f67-da22-4149-a54d-ec3b95fe05e6"] .d-button',
        editLinkKnowledgeMetadata: '[rx-view-component-id="56cc9627-6ef9-46f8-9b76-728349193ed2"] .btn-link',
        saveBtnEditMetadata: '[rx-view-component-id="7f856f67-5b84-47e0-b175-76a281e8a4fb"] .d-button_primary',
        knowledgeMetadataSection: '[rx-view-component-id="6cdbaf54-4c29-4ca0-ab73-aa165234f9ed"] .d-textfield',
        editLinkOnKA:'[rx-view-component-id="ee521675-2407-4b2a-9470-013bfb328b30"] .rx-record-editor-edit',
        saveButtonONKA:'[rx-view-component-id="813f61fe-28db-4d22-bfa5-4055e8a583fc"] button',
        unflagButton:'[rx-view-component-id="b54365bf-0ead-4c54-8c8b-42aced61690e"] button',
        falgButton:'[rx-view-component-id="89dd2264-1895-4a7b-a0a4-01a4834a403b"] button',
        unflagButtonOnBlade:'[rx-view-component-id="5707f17e-63f2-41f7-ac55-13a6937c83b9"] button',
        flagButtonOnBlade:'[rx-view-component-id="bd9d6e7a-1875-4299-9b63-5dc89eb2bfe9"] button',
        flagComment:'[rx-view-component-id="2b192056-a661-49b7-948f-4c75dbc4ffea"] textarea',
        flagBlade:'.modal-content',
        editRegionGuid : 'd5c6cfef-2d53-48df-a03a-1a3e8381eef5',
        editSiteGuid : 'aa218b2b-4fa3-4525-82f3-3e0f9bfc4193',
        knowledgeTitle:'[rx-view-component-id="cd9b041b-6a82-4322-8a07-165a370ad0dd"] input',

    }

    async setKnowledgeStatus(newStatus: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        await utilCommon.selectDropDownWithName('Status', newStatus);
        await $(this.selectors.statusSaveBtn).click();
        await utilCommon.waitUntilPopUpDisappear();
    }

    async getStatusValue():Promise<string>{
        await utilCommon.waitUntilPopUpDisappear();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        return await $(this.selectors.statusChange).getText();
    }

    async setKnowledgeStatusAndVerifyAssignmentNotAppear(newStatus: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        await utilCommon.selectDropDownWithName('Status', newStatus);
        expect(await $(this.selectors.assigneToMeReviewerAssign).isDisplayed()).toBeFalsy();
        await $(this.selectors.statusSaveBtn).click();
        await utilCommon.waitUntilPopUpDisappear();
    }

    async setKnowledgeStatusWithoutSave(newStatus: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        await utilCommon.selectDropDownWithName('Status', newStatus);
    }

    async clickSaveStatusBtn(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.statusSaveBtn)));
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusSaveBtn)));
        await $(this.selectors.statusSaveBtn).click();
    }

    async clickChangeAssignmentButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable(element(by.buttonText('Change Assignment'))));
        await element(by.buttonText('Change Assignment')).click();
    }

    async editKnowledgeMedataData(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.editLinkKnowledgeMetadata)));
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLinkKnowledgeMetadata)));
        await $(this.selectors.editLinkKnowledgeMetadata).click();
    }

    async saveKnowledgeMedataDataChanges(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.saveBtnEditMetadata)));
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveBtnEditMetadata)));
        await $(this.selectors.saveBtnEditMetadata).click();
        await utilCommon.waitUntilPopUpDisappear();
    }

    async verifyKnowledgeMetadata(fldName: String, fldVal: String): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeMetadataSection)));
        let fldsCount = await $$(this.selectors.knowledgeMetadataSection).count();
        for (let i = 0; i < fldsCount; i++) {
            let elem = await $$(this.selectors.knowledgeMetadataSection).get(i);
            if (await elem.$('.d-textfield__item').getText() == fldName) {
                expect (await elem.$('.d-textfield__rx-value').getText()).toBe(fldVal);
                break;
            }
        }
    }

    async selectRegionDropDownOption(fieldOption: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.editRegionGuid,fieldOption);
        }

    async selectSiteDropDownOption(fieldOption: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.editSiteGuid,fieldOption);
    }

    async updateRegionDropDownOption(guid: string, fieldOption: string): Promise<void> {
       await utilCommon.selectDropDown(this.selectors.editRegionGuid,fieldOption);
    }

    async updateSiteDropDownOption(guid: string, fieldOption: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.editSiteGuid,fieldOption);
    }

    async isChangeReviewerButtonPresent(): Promise<Boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.changeReviewerBtn)));
        return await $(this.selectors.changeReviewerBtn).isDisplayed();
    }

    async clickChangeReviewerBtn(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.changeReviewerBtn)));
        await $(this.selectors.changeReviewerBtn).click();
    }

    async isAssignToMeButtonPresent(): Promise<Boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneToMeReviewerAssign)));
        return await $(this.selectors.assigneToMeReviewerAssign).isDisplayed();
    }

    async isReviewerCompanyFieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerCompanyfldStatusBlade)));
        return await $(this.selectors.reviewerCompanyfldStatusBlade).getAttribute("disabled") == "true";
    }

    async isReviewerBusinessUnitFieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerBUfldStatusBlade)));
        return await $(this.selectors.reviewerBUfldStatusBlade).getAttribute("disabled") == "true";
    }

    async isReviewerDepartmentfieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerDepfldStatusBlade)));
        return await $(this.selectors.reviewerDepfldStatusBlade).getAttribute("disabled") == "true";
    }

    async isReviewerGrpFieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerGrpfldStatusBlade)));
        return await $(this.selectors.reviewerGrpfldStatusBlade).getAttribute("disabled") == "true";
    }

    async isReviewerFieldDisbaledOnStatusChangeBlade(): Promise<Boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerfldStatusBlade)));
        return await $(this.selectors.reviewerfldStatusBlade).getAttribute("disabled") == "true";
    }

    async isReviewPendingButtonDisplayed(): Promise<Boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewPendingBtn)));
        return await $(this.selectors.reviewPendingBtn).isDisplayed();
    }

    async getCategoryTier1SelectedValue(fieldName:string):Promise<string>{
        return await utilCommon.getSelectedFieldValue(fieldName);
     }   

    async getRegionSelectedValue(fieldName:string):Promise<string>{
        return await utilCommon.getSelectedFieldValue(fieldName);
     }   

     async getSiteSelectedValue(fieldName:string):Promise<string>{
        return await utilCommon.getSelectedFieldValue(fieldName);
     }   

     async clickOnEditLink():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLinkOnKA)));
        await $(this.selectors.editLinkOnKA).click();
     }

     async isEditLinkDisplayedOnKA():Promise<boolean>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLinkOnKA)));
        return await $(this.selectors.editLinkOnKA).isDisplayed();
     }

     async clickOnSaveButtonOfKA():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButtonONKA)));
        await $(this.selectors.saveButtonONKA).click();
     }

     async changeKnowledgeTitle(value:string):Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.knowledgeTitle)));
        await $(this.selectors.knowledgeTitle).click();
        await $(this.selectors.knowledgeTitle).clear();
        await $(this.selectors.knowledgeTitle).sendKeys(value);
     }

     async clickOnUnFlagButton():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.unflagButton)));
        await $(this.selectors.unflagButton).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.flagBlade)));
     }

     async clickOnFlagButton():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.falgButton)));
        await $(this.selectors.falgButton).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.flagBlade)));
     }

     async setTextInTellUsMore(value:string):Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.flagComment)));
        await $(this.selectors.flagComment).clear();
        await $(this.selectors.flagComment).sendKeys(value);
     }

     async clickOnUnFlageButtonOnBlade():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.unflagButtonOnBlade)));
        await $(this.selectors.unflagButtonOnBlade).click();
        await browser.wait(this.EC.invisibilityOf($(this.selectors.flagBlade)));
        await utilCommon.waitUntilPopUpDisappear();
     }

     async clickOnFlageButtonOnBlade():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.flagButtonOnBlade)));
        await $(this.selectors.flagButtonOnBlade).click();
        await browser.wait(this.EC.invisibilityOf($(this.selectors.flagBlade)));
     }

}

export default new EditKnowledgePage();
