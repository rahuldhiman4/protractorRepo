import { $, protractor, ProtractorExpectedConditions } from "protractor";
import changeAssignmentBladePo from '../common/change-assignment.po';
import utilityCommon from '../../utils/utility.common';

class StatusBladKnowledgeArticle {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        statusChange: '[rx-view-component-id="dc403f44-1bde-406f-a3bf-00128644a011"] .status-transition',
        statusSaveBtn: '[rx-view-component-id="e45ca390-e752-4bd5-97c7-69618d609d59"] button',
        changeReviwerButton: '[rx-view-component-id="6b2b2601-811e-4774-b09e-255fab00e547"] button',
        saveButtonOnReviewer: '[rx-view-component-id="e45ca390-e752-4bd5-97c7-69618d609d59"] button',
        statusChangeDrpDwnGuid: '6f8e4177-cad6-4d59-9467-074b688aa06e',
    }

    async setKnowledgeStatusWithReviewerDetails(knowledgeStatus:string, company: string, reviewerBusinessUnit: string, reviewerSupportGroup: string, reviewer: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        await utilityCommon.selectDropDown(this.selectors.statusChangeDrpDwnGuid, knowledgeStatus);
        await changeAssignmentBladePo.setDropDownValue('AssignedGroup', reviewerSupportGroup);
        await changeAssignmentBladePo.setDropDownValue('Assignee', reviewer);
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
