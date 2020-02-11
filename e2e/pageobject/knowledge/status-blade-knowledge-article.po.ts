import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';
import changeAssignmentBladePo from '../common/change-assignment-blade.po';

class StatusBladKnowledgeArticle {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        statusChange: '.status-transition',
        statusSaveBtn: '[rx-view-component-id="e45ca390-e752-4bd5-97c7-69618d609d59"] .d-button',
        changeReviwerButton: '[rx-view-component-id="6b2b2601-811e-4774-b09e-255fab00e547"] button',
        saveButtonOnReviewer: '[rx-view-component-id="e45ca390-e752-4bd5-97c7-69618d609d59"] button',
    }

    async setKnowledgeStatusAsSMEReview(company: string, reviewerSupportGroup: string, reviewer: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        await utilCommon.selectDropDownWithName('Status', "SME Review");
        await $(this.selectors.changeReviwerButton).click();
        await changeAssignmentBladePo.selectCompany(company)
        await changeAssignmentBladePo.selectSupportGroup(reviewerSupportGroup);
        await changeAssignmentBladePo.selectAssignee(reviewer);
        await changeAssignmentBladePo.clickOnAssignButton();
        await $(this.selectors.saveButtonOnReviewer).click();
    }

}   

export default new StatusBladKnowledgeArticle();
