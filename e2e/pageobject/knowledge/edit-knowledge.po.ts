import { $, ProtractorExpectedConditions, browser, protractor, element, by, $$ } from "protractor";
import utilCommon from '../../utils/ui/util.common';

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
        knowledgeMetadataSection: '[rx-view-component-id="6cdbaf54-4c29-4ca0-ab73-aa165234f9ed"] .d-textfield'
    }

    async setKnowledgeStatus(newStatus: string):Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        await utilCommon.selectDropDownWithName('Status',newStatus);
        await $(this.selectors.statusSaveBtn).click();
        await utilCommon.waitUntilSuccessMessageDisappear();
    }

    async setKnowledgeStatusAndVerifyAssignmentNotAppear(newStatus: string):Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        await utilCommon.selectDropDownWithName('Status',newStatus);
        expect (await $(this.selectors.assigneToMeReviewerAssign).isDisplayed()).toBeFalsy();
        await $(this.selectors.statusSaveBtn).click();
        await utilCommon.waitUntilSuccessMessageDisappear();
    }

    async setKnowledgeStatusWithoutSave(newStatus: string):Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        await utilCommon.selectDropDownWithName('Status',newStatus);
    }

    async clickSaveStatusBtn(): Promise<void>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.statusSaveBtn)));
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusSaveBtn)));
        await $(this.selectors.statusSaveBtn).click();
    }

    async clickChangeAssignmentButton(): Promise<void>{
        await browser.wait(this.EC.elementToBeClickable(element(by.buttonText('Change Assignment'))));
        await element(by.buttonText('Change Assignment')).click();
    }

    async editKnowledgeMedataData(): Promise<void>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.editLinkKnowledgeMetadata)));
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLinkKnowledgeMetadata)));
        await $(this.selectors.editLinkKnowledgeMetadata).click();
    }

    async saveKnowledgeMedataDataChanges(): Promise<void>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.saveBtnEditMetadata)));
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveBtnEditMetadata)));
        await $(this.selectors.saveBtnEditMetadata).click();
        await utilCommon.waitUntilSuccessMessageDisappear();
    }

    async verifyKnowledgeMetadata(fldName:String, fldVal:String):Promise<void>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.knowledgeMetadataSection)));
        let fldsCount = await $$(this.selectors.knowledgeMetadataSection).count();
        for(let i=0;i<fldsCount;i++){
            let elem = await $$(this.selectors.knowledgeMetadataSection).get(i);
            if(await elem.$('.d-textfield__item').getText()==fldName){
                expect (await elem.$('.d-textfield__rx-value').getText()).toBe(fldVal);
                break;
            }
        }
    }

    async isChangeReviewerButtonPresent():Promise<Boolean>
    {
        await browser.wait(this.EC.visibilityOf($(this.selectors.changeReviewerBtn)));
        return await $(this.selectors.changeReviewerBtn).isDisplayed();
    }

    async clickChangeReviewerBtn():Promise<void>
    {
        await browser.wait(this.EC.visibilityOf($(this.selectors.changeReviewerBtn)));
        await $(this.selectors.changeReviewerBtn).click();
    }

    async isAssignToMeButtonPresent():Promise<Boolean>
    {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneToMeReviewerAssign)));
        return await $(this.selectors.assigneToMeReviewerAssign).isDisplayed();
    }

    async isReviewerCompanyFieldDisbaledOnStatusChangeBlade():Promise<Boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerCompanyfldStatusBlade)));
        return await $(this.selectors.reviewerCompanyfldStatusBlade).getAttribute("disabled")=="true";
    }

    async isReviewerBusinessUnitFieldDisbaledOnStatusChangeBlade():Promise<Boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerBUfldStatusBlade)));
        return await $(this.selectors.reviewerBUfldStatusBlade).getAttribute("disabled")=="true";
    }

    async isReviewerDepartmentfieldDisbaledOnStatusChangeBlade():Promise<Boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerDepfldStatusBlade)));
        return await $(this.selectors.reviewerDepfldStatusBlade).getAttribute("disabled")=="true";
    }

    async isReviewerGrpFieldDisbaledOnStatusChangeBlade():Promise<Boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerGrpfldStatusBlade)));
        return await $(this.selectors.reviewerGrpfldStatusBlade).getAttribute("disabled")=="true";
    }

    async isReviewerFieldDisbaledOnStatusChangeBlade():Promise<Boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewerfldStatusBlade)));
        return await $(this.selectors.reviewerfldStatusBlade).getAttribute("disabled")=="true";
    }

    async isReviewPendingButtonDisplayed():Promise<Boolean>
    {
        await browser.wait(this.EC.visibilityOf($(this.selectors.reviewPendingBtn)));
        return await $(this.selectors.reviewPendingBtn).isDisplayed();
    }

}

export default new EditKnowledgePage();
