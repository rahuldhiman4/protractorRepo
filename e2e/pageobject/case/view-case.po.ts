import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import editCasePage from "../../pageobject/case/edit-case.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import utilCommon from '../../utils/util.common';
import updateStatusBlade from '../../pageobject/common/update.status.blade.po';

class ViewCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        categoryTier1Value: '[rx-view-component-id="593784cc-6bce-4bfd-82e1-7ca55aa28517"] p',
        categoryTier2Value: '[rx-view-component-id="7beae951-8345-4f97-9cac-48933083928f"] p',
        categoryTier3Value: '[rx-view-component-id="68d56b74-b9ad-444e-8dfc-ddec1e16897f"] p',
        categoryTier4Value: '[rx-view-component-id="aa75da42-eeb4-4a6f-946b-74d5316b7641"] p',
        reOpenCase: '[rx-view-component-id="2d51cf41-f176-4e20-bc48-f2741bcbbcb0"] button',
        saveUpdateStatus: '[rx-view-component-id="ee5dd503-a10e-4d22-9ac5-99c400892bb7"] button',
        cancelUpdateStatus: '[rx-view-component-id="7cffd3f8-5b84-4e7f-a4b3-6c0a3dd27855"] button',
        stopWatching: '[rx-view-component-id="a62c849f-5bb0-480f-9811-50def59d82d0"] button',
        statusChange: '[rx-view-component-id="48bbcbbf-564c-4d46-8dc2-1e7670c187ff"] .status-transition',
        statusChangeReason: '[rx-view-component-id="049c43a1-4cbd-482d-980d-5db4ed78f295"]',
        statusDropDown: '[rx-view-component-id="3c8d9278-fc1f-430c-b866-cdc9d217318b"]',
        statusDropDownGuid: '3c8d9278-fc1f-430c-b866-cdc9d217318b',
        statusChangeReasonGuid: '049c43a1-4cbd-482d-980d-5db4ed78f295',
        statusList: '[rx-view-component-id="3c8d9278-fc1f-430c-b866-cdc9d217318b"] .ui-select__rx-choice',
        statusDisplay: '[aria-label="Status activate"]',
        addTaskButton: '[rx-view-component-id="db1c57fc-c332-40fa-b1c0-759e21d9ad5c"] button',
        editLink: '.edit-link',
        searchInput: 'input[type="search"]',
        caseIdText: '[rx-view-component-id="7b47ca08-e9d4-4656-8f96-3bc751c098b0"] .title',
        requesterName: '[rx-view-component-id="81d4a02e-dbed-4d6d-a298-2d68cfaeb91a"] .person-main a',
        requesterPhoneNo: '[rx-view-component-id="81d4a02e-dbed-4d6d-a298-2d68cfaeb91a"] .ac-link-person-phone',
        requesterEmail: '[rx-view-component-id="81d4a02e-dbed-4d6d-a298-2d68cfaeb91a"] .ac-link-person-email',
        contactPersonDrpDwn: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] strong span',
        contactPersonName: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] .person-main a',
        contactPersonContact: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] .ac-link-person-phone',
        contactPersonEmail: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] .ac-link-person-email',
        flowsetText: '[rx-view-component-id="73fb70b0-2992-4dc5-b7ed-3d3d13cc4d6b"] .d-textfield__rx-value',
        descriptionText: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] div[ng-transclude]',
        assigneeText: '[rx-view-component-id="dfe65f6f-7aea-476c-8042-f3aa34e3fb04"] .person-link a',
        assignedGroupText: '[rx-view-component-id="66c1bbab-901d-42ed-b5e6-a04cb54d559f"] .d-textfield__rx-value',
        departmentText: '[rx-view-component-id="795da3b4-6442-4b07-b6e1-7ce7c9987352"] .d-textfield__rx-value',
        businessUnitText: '[rx-view-component-id="f14326b0-0c70-4827-8a02-95e82527409a"] .d-textfield__rx-value',
        assignedCompanyText: '[rx-view-component-id="8b4d78f0-fbda-420c-928f-3dee49fde4fc"] .d-textfield__rx-value',
        attachmentsLink: '[rx-view-component-id="58a437ec-fc5b-4721-a583-1d6c80cfe6a6"] button',
        addToWatchlist: '[rx-view-component-id="df24e195-e4f2-4114-af3f-e8a07691bdfd"] button',
        caseSummary: '[rx-view-component-id="8ebc1637-af05-4a08-b873-4f810c4981b9"] p',
        caseSite: '[rx-view-component-id="4a58cc3b-e699-4357-a68a-482163d6cbbe"] p',
        inprogressErrorMsg: '[rx-view-component-id="dd40ce76-9d16-4c6a-b1a1-16fe6aa6721f"] p',
        resolutionCodeText: '[rx-view-component-id="8eae4351-a5ac-4079-b77f-df2cc969a0d8"] .d-textfield__item',
        resolutionDescriptionText: '[rx-view-component-id="923de542-50b0-482f-a370-3823d0c07645"] .d-textfield__item',
        resolutionCodeSelect: '.ui-select__rx-choice',
        resolutionDescriptionTextBoxId: '[rx-view-component-id="d98df37c-7a96-43c3-bf69-2e6e735031ae"]',
        emptyResolutionDescriptionTextBox: '.d-textfield__label .ng-empty',
        priority: '.selection-field',
        emailLink:'[rx-view-component-id="58a437ec-fc5b-4721-a583-1d6c80cfe6a6"] button',
        addedTaskFromCaseTemplate:'.task-list__task-card a'
    }    
    
    async clickOnEmailLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailLink)));
        await ($(this.selectors.emailLink)).click();
        await utilCommon.waitUntilSpinnerToHide();
    }

    async clickOnRequestersEmail():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.requesterEmail)));
        await ($(this.selectors.requesterEmail)).click();
    }

    async isEmailLinkPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailLink)));
        return await ($(this.selectors.emailLink)).isPresent();
    }

    async isResolutionDescriptionTextBoxEmpty(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.resolutionDescriptionTextBoxId)));
        let statusstr = $(this.selectors.resolutionDescriptionTextBoxId);
        return await (statusstr.$(this.selectors.emptyResolutionDescriptionTextBox)).isPresent();
    }

    async selectResolutionCodeDropDown(resolutionCode: string): Promise<void> {
        await updateStatusBlade.selectResolutionCode(resolutionCode);
    }

    async isCaseReopenLinkPresent(): Promise<boolean> {
        await browser.wait(this.EC.presenceOf($('[rx-view-component-id="2d51cf41-f176-4e20-bc48-f2741bcbbcb0"]')));
        let presentInDom: boolean = await $(this.selectors.reOpenCase).isPresent();
        if (presentInDom) {
            await browser.wait(this.EC.visibilityOf($(this.selectors.reOpenCase)), 5000);
        }
        return presentInDom;
    }

    async clickOnCancelButtonOfUpdateStatus(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelUpdateStatus)));
        await $(this.selectors.cancelUpdateStatus).click();
    }

    async clickOnReopenCaseLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.reOpenCase)));
        await $(this.selectors.reOpenCase).click();
        await utilCommon.waitUntilPopUpDisappear();
    }

    async getErrorMsgOfInprogressStatus(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.inprogressErrorMsg)));
        return await $(this.selectors.inprogressErrorMsg).getText();
    }

    async getPriorityValue(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.priority)));
        return await $(this.selectors.priority).getText();
    }

    async getCategoryTier1Value(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier1Value)));
        return await $(this.selectors.categoryTier1Value).getText();
    }

    async getCategoryTier2Value(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier2Value)));
        return await $(this.selectors.categoryTier2Value).getText();
    }

    async getCategoryTier3Value(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier3Value)));
        return await $(this.selectors.categoryTier3Value).getText();
    }

    async getCategoryTier4Value(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier4Value)));
        return await $(this.selectors.categoryTier4Value).getText();
    }

    async getTextOfStatus(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.editLink)));
        await browser.wait(this.EC.visibilityOf($(this.selectors.statusChange)));
        return await $(this.selectors.statusChange).getText();
    }

    async clickOnStatus(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
    }

    async clickAddToWatchlistLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addToWatchlist)));
        await $(this.selectors.addToWatchlist).click();
    }

    async getAddToWatchlistLinkText(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addToWatchlist)));
        return await $(this.selectors.addToWatchlist).getText();
    }

    async clickSaveStatus(expectedStatus?: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveUpdateStatus)));
        await $(this.selectors.saveUpdateStatus).click();
        if (expectedStatus) {
            await browser.wait(this.EC.visibilityOf(element(by.cssContainingText(this.selectors.statusChange, expectedStatus))));
        }
        await utilCommon.waitUntilPopUpDisappear();
    }

    async isEditLinkDisplay(): Promise<boolean> {
        return await $(this.selectors.editLink).getAttribute("aria-hidden") == "false";
    }

    async clickOnstatusReason(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChangeReason)));
        await $(this.selectors.statusChangeReason).click();
    }

    async changeCaseStatus(statusValue: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        await updateStatusBlade.changeStatus(statusValue);
    }

    async allStatusOptionsPresent(list: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.statusDropDownGuid,list);
    }

    async clickEditCaseButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLink)));
        await $(this.selectors.editLink).click();
        await browser.wait(this.EC.visibilityOf($(editCasePage.selectors.cancelBtn)));
    }

    async setStatusReason(statusReasonValue: string): Promise<void> {
        await updateStatusBlade.setStatusReason(statusReasonValue);
    }

    async allStatusReasonOptionsPresent(list: string[]): Promise<boolean> {
        return await utilCommon.isDrpDownvalueDisplayed(this.selectors.statusChangeReasonGuid, list);
    }

    async isStatusReasonOptionDisplayed(statusValue: string): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChangeReason)));
        await $(this.selectors.statusChangeReason).click();
        const statusReason = $(this.selectors.statusChangeReason);
        await browser.wait(this.EC.elementToBeClickable(statusReason.$(this.selectors.searchInput)));
        await (statusReason.$(this.selectors.searchInput)).sendKeys(statusValue);
        return await element(by.cssContainingText((this.selectors.statusChangeReason + ' .ui-select__rx-choice'), statusValue)).isDisplayed();
    }

    async clearStatusReason(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChangeReason)));
        await $(this.selectors.statusChangeReason + " " + this.selectors.searchInput).clear();
    }

    async clickAddTaskButton() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addTaskButton)),3000);
        await $(this.selectors.addTaskButton).click();
    }

    async getCaseID(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.caseIdText)));
        return await $(this.selectors.caseIdText).getText();
    }

    async getRequesterName(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterName)));
        return await $(this.selectors.requesterName).getText();
    }

    async getRequesterPhoneNo(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterPhoneNo)));
        return await $(this.selectors.requesterPhoneNo).getText();
    }

    async getRequesterEmail(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterEmail)));
        return await $(this.selectors.requesterEmail).getText();
    }

    async getContactPersonName(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.contactPersonName)));
        return await $(this.selectors.contactPersonName).getText();
    }

    async getCaseSummary(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.caseSummary)));
        return await $(this.selectors.caseSummary).getText();
    }

    async getCaseSite(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.caseSite)));
        return await $(this.selectors.caseSite).getText();
    }

    async getContactPersonerPhoneNo(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.contactPersonContact)));
        return await $(this.selectors.contactPersonContact).getText();
    }

    async getContactPersonalEmail(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.contactPersonEmail)));
        return await $(this.selectors.contactPersonEmail).getText();
    }

    async clickStopWatchingLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.stopWatching)));
        await $(this.selectors.stopWatching).click();
    }

    async getStopWatchingLinkText(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.stopWatching)));
        return await $(this.selectors.stopWatching).getText();
    }

    async clickOnContactPersonerDrpDwn(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.contactPersonDrpDwn)));
        await $(this.selectors.contactPersonDrpDwn).click();
    }

    async clickAttachmentsLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachmentsLink)));
        await $(this.selectors.attachmentsLink).click();
    }

    async getFlowsetText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.flowsetText)));
        return await $(this.selectors.flowsetText).getText();
    }

    async getCaseDescriptionText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.descriptionText)));
        return await $(this.selectors.descriptionText).getText();
    }

    async getAssigneeText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneeText)));
        return await $(this.selectors.assigneeText).getText();
    }

    async getAssignedGroupText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignedGroupText)));
        return await $(this.selectors.assignedGroupText).getText();
    }

    async getDepartmentText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.departmentText)));
        return await $(this.selectors.departmentText).getText();
    }

    async getBusinessUnitText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.businessUnitText)));
        return await $(this.selectors.businessUnitText).getText();
    }

    async getAssignedCompanyText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignedCompanyText)));
        return await $(this.selectors.assignedCompanyText).getText();
    }

    async isCoreTaskPresent(taskSummary:string):Promise<boolean>{
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText(this.selectors.addedTaskFromCaseTemplate, taskSummary))));
        return await element(by.cssContainingText(this.selectors.addedTaskFromCaseTemplate, taskSummary)).isDisplayed();
    }

    async clickOnTaskLink(taskSummary:string):Promise<void>{
        await element(by.cssContainingText(this.selectors.addedTaskFromCaseTemplate, taskSummary)).click();  
    }

    async getCaseStatusValue():Promise<string>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        return await $(this.selectors.statusChange).getText();
    }
}

export default new ViewCasePage();