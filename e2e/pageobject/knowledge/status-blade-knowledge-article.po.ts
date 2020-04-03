import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';
import changeAssignmentBladePo from '../common/change-assignment-blade.po';

class StatusBladKnowledgeArticle {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        statusChange: '.adapt-counter-label-wrapper .status-transition',
        statusSaveBtn: '[rx-view-component-id="e45ca390-e752-4bd5-97c7-69618d609d59"] button',
        changeReviwerButton: '[rx-view-component-id="6b2b2601-811e-4774-b09e-255fab00e547"] button',
        saveButtonOnReviewer: '[rx-view-component-id="e45ca390-e752-4bd5-97c7-69618d609d59"] button',
    }

    async setKnowledgeStatusWithReviewerDetails(knowledgeStatus:string, company: string, reviewerSupportGroup: string, reviewer: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        await utilCommon.selectDropDownWithName('Status', knowledgeStatus);
        await $(this.selectors.changeReviwerButton).click();
        await changeAssignmentBladePo.selectCompany(company)
        await changeAssignmentBladePo.selectSupportGroup(reviewerSupportGroup);
        await changeAssignmentBladePo.selectAssignee(reviewer);
        await changeAssignmentBladePo.clickOnAssignButton();
        await $(this.selectors.saveButtonOnReviewer).click();
    }

    async clickChangeReviewerBtn():Promise<void>{
        await $(this.selectors.changeReviwerButton).click();
    }

    async isChangeReviewerButtonPresent(): Promise<Boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.changeReviewerBtn)));
        return await $(this.selectors.changeReviwerButton).isDisplayed();
    }
}   

export default new StatusBladKnowledgeArticle();
