import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilityCommon from '../../utils/utility.common';

class ViewTask {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dropDownOption: '[rx-view-component-id="8b4cef48-0a4c-4ec1-bc4c-cce47179c964"] .dropdown_select__menu-content button',
        statusDropDown: '8b4cef48-0a4c-4ec1-bc4c-cce47179c964',
        saveStatus: '[rx-view-component-id="6759ba60-df0d-4d5e-8eb9-5101490fd4d4"] button',
        cancleStatus: '[rx-view-component-id="debcdc88-fb42-4003-96d6-1eeb807206b7"] button',
        allStatus: '.dropdown_select__menu .dropdown-item',
        updateStatusDropDown: '[rx-view-component-id="8b4cef48-0a4c-4ec1-bc4c-cce47179c964"] button',
        taskTypeValue: '[rx-view-component-id="057f2521-313b-40c9-be56-829827512abf"] .read-only-content',
        editButton: '[rx-view-component-id="14e8cc41-ae6a-41e1-8932-850fbeec57d0"] .justify-content-end button[btn-type="tertiary"]',
        categoryTier1Value: '[rx-view-component-id="4591e595-2d43-4218-9245-9d4de0adbc48"] .read-only-content',
        categoryTier2Value: '[rx-view-component-id="caeb4c73-8107-4a5c-a966-7628469e48fc"] .read-only-content',
        categoryTier3Value: '[rx-view-component-id="291c9c82-e9b3-4b3c-bb1f-4e23d11ff39e"] .read-only-content',
        categoryTier4Value: '[rx-view-component-id="9130bb4f-acd8-4a36-bf99-7fd38469b3fc"] .read-only-content',
        labelValue: '[rx-view-component-id="db352c84-3f9f-4209-aa3c-426fcc118305"] .read-only-content',
        descriptionValue: '[rx-view-component-id="6053a7e8-5194-420b-965a-1c3bfe3ad0a1"] .collapse-block div [style="position: relative;"]',
        processnameValue: '[rx-view-component-id="7260c238-9e41-4d31-90de-2d46443117b4"] .read-only-content',
        statusReason: '[rx-view-component-id="7cdf9e18-c230-4098-8872-ddce9f005373"] .read-only-content',
        taskIdText: '[rx-view-component-id="75371088-cfeb-4554-a939-2fe7b2aa098b"] .text-field',
        viewCaseLink: '[rx-view-component-id="036a7325-43e3-47e6-bb50-7f8d9fe8d118"] button',
        taskIcon: '[rx-view-component-id="75371088-cfeb-4554-a939-2fe7b2aa098b"] i',
        taskPriority: '[rx-view-component-id="75371088-cfeb-4554-a939-2fe7b2aa098b"] .selection-field',
        taskTimeDetails: '[rx-view-component-id="75371088-cfeb-4554-a939-2fe7b2aa098b"] .date-info',
        caseIdText: '.rx-record-preview-card__field .rx-record-preview-card__value',
        caseSummary: '.rx-card-fields .rx-card-field-value',
        taskSummary: '[rx-view-component-id="fa66e566-757c-4d10-a850-9ea3bd037707"] span',
        taskStatus: '[rx-view-component-id="1437179f-34be-4cb3-8f85-cf0ac6a83394"] span:not([class])',
        requesterName: '[rx-view-component-id="3a7ac43c-0c25-4a46-abc6-9d59c2da09f7"] .person-name .person-link',
        requesterContact: '[rx-view-component-id="3a7ac43c-0c25-4a46-abc6-9d59c2da09f7"] .person-phone-link',
        requesterMail: '[rx-view-component-id="3a7ac43c-0c25-4a46-abc6-9d59c2da09f7"] .bwf-person-email button',
        assigneeName: '[rx-view-component-id="691c7524-167e-434b-acac-c11571c53409"] .person-main .person-name',
        assignGroupText: '[rx-view-component-id="2193d81d-8ea7-457f-8a8e-9d0378a7a43a"] label',
        assignCompany: '[rx-view-component-id="691c7524-167e-434b-acac-c11571c53409"] .read-only-content',
        taskStatusGuid: 'aea81ee2-85d9-4bb6-adb4-08c29028d45d',
        attachmentName: 'bwf-attachment-viewer .bwf-attachment-container__file-name',
        showMoreLessAttachmentLink: 'bwf-attachment-viewer button.ng-star-inserted span',
        saveAdhocTask: '[rx-view-component-id="a19228d0-81a9-4b19-9cb3-b5bd9550966f"] button',
        attachmentFile: '.justify-content-start .bwf-attachment-container__file-name',
        attachmentpath: '.rx-attachment-view .d-icon-cross',
        showMore: 'bwf-attachment-viewer .btn-link .ng-star-inserted',
        dynamicFieldsName: '[rx-view-component-id="4c988a95-b148-475f-b91c-9788d8e6c0cb"] label',
        dynamicFieldsValue: '[rx-view-component-id="4c988a95-b148-475f-b91c-9788d8e6c0cb"] .read-only-content',
        assignmentSection: '[rx-view-component-id="a202d36e-32db-4093-9c92-c4f7a514f3d7"] .person-badge',
        assignedGroupValue: '[rx-view-component-id="2193d81d-8ea7-457f-8a8e-9d0378a7a43a"] .read-only-content',
        assignedCompanyValue: '[rx-view-component-id="5cb6b3e9-1f3b-412f-a757-fb9c2a462e32"] .read-only-content',
        businessUnitValue: '[rx-view-component-id="4ad9dc88-aa95-4fb7-8128-7df004dfca8f"] .read-only-content',
        departmentValue: '[rx-view-component-id="411571a0-2577-4403-bcf2-3999dc84f5df"] .read-only-content',
        manageDynamicField: '[rx-view-component-id="7ac78e56-c471-4e50-bca8-53568ad6e4af"] button',
        emailLink: '[rx-view-component-id="b721ed87-8e6b-4279-9e21-d4348c6a4599"] button',
        tab: 'button[role="tab"] span.nav-link-wrapper',
        showMoreTaskDescription: '.bwf-description-read-state button',
        showApproversBanner: '.rx-runtime-view-canvas-item-margin [rx-view-component-id="f9c9f21d-b80d-42d5-af13-131965888afc"]',
        pendingApprovalsInfo: '[rx-view-component-id="c64c5d07-86a0-46bb-a085-181a760a756c"] span[aria-label="Status of case approvals"] span',
        showApproversLink: '.show-approvers-button-container',
        approvalButtons: '.approval-buttons span',
        approveButton: '.d-icon-left-check_shield',
        rejectButton: '.d-icon-left-cross_circle',
        assignee: '[rx-view-component-id="1801d8c6-4997-4253-b716-809b39909598"]',
        contactPersonName: '[rx-view-component-id="811367b2-5b83-402a-b44f-9c9ca668fee8"] .person-name .person-link',
        inprogressErrorMsg: '[rx-view-component-id="a1072f99-4036-4e2e-8e62-e72b2ba22344"] p',
        statusDropdown: '[rx-view-component-id="1437179f-34be-4cb3-8f85-cf0ac6a83394"] button',
        editAssignment: '.edit-button button',
        assignToMe: '.assign-to-me button',
    }

    async clickShowMoreTaskDescription(): Promise<void> {
        await $(this.selectors.showMoreTaskDescription).click();
    }

    async clickEmailLink(): Promise<void> {
        await $(this.selectors.emailLink).click();
    }

    async getTaskSummaryValue(): Promise<string> {
        return await $(this.selectors.taskSummary).getText();
    }

    async getPriorityValue(): Promise<string> {
        return await $(this.selectors.taskPriority).getText();
    }

    async isAttachedDocumentPresent(fileName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.attachmentFile, fileName)).isPresent();
    }

    async clickOnAttachedDocumentFile(fileName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.attachmentFile, fileName)).click();
    }

    async clickOnRequesterEmail(): Promise<void> {
        await $(this.selectors.requesterMail).click();
    }

    async clickOnChangeStatus(): Promise<void> {
        await $(this.selectors.taskStatus).click();
    }
    //need to remove this method - Use updateStatusBladePo.changeStatus
    async changeTaskStatus(statusValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.statusDropDown, statusValue);
    }

    async getUpdateTaskStatusDrpdownValue(no: number): Promise<string> {
        return await $$(this.selectors.allStatus).get(no).getText();
    }

    async clickOnEditTask(): Promise<void> {
        await $(this.selectors.editButton).click();
    }

    async isTaskIdTextDisplayed(): Promise<boolean> {
        return await $(this.selectors.taskIdText).isDisplayed();
    }

    async isTaskIconDisplayed(): Promise<boolean> {
        return await $(this.selectors.taskIcon).isDisplayed();
    }

    async isTaskPriorityDisplayed(): Promise<boolean> {
        return await $(this.selectors.taskPriority).isDisplayed();
    }

    async isTaskTimeDetailsDisplayed(): Promise<boolean> {
        return await $(this.selectors.taskTimeDetails).isDisplayed();
    }

    async isTaskSummaryDisplayed(): Promise<boolean> {
        return await $(this.selectors.taskSummary).isDisplayed();
    }

    async isCaseSummaryDisplayed(): Promise<boolean> {
        return await $(this.selectors.caseSummary).isDisplayed();
    }

    async isCaseViewLinkDisplayed(): Promise<boolean> {
        try {
            return await $(this.selectors.viewCaseLink).isEnabled();
        } catch (error) {
            return false;
        }
    }

    async istaskStatusDisplayed(): Promise<boolean> {
        return await $(this.selectors.taskStatus).isDisplayed();
    }

    async getTaskStatusValue(): Promise<string> {
        return (await $(this.selectors.taskStatus).getText()).trim();
    }

    async isEditLinkDisplayed(): Promise<boolean> {
        return await $(this.selectors.editButton).isDisplayed();
    }

    async isViewCaseLinkDisplayed(): Promise<boolean> {
        return await $(this.selectors.viewCaseLink).isDisplayed();
    }

    async isRequesterNameDisplayed(): Promise<boolean> {
        return await $(this.selectors.requesterName).isDisplayed();
    }

    async isRequesterContactDisplayed(): Promise<boolean> {
        return await $(this.selectors.requesterContact).isDisplayed();
    }

    async isRequesterMailDisplayed(): Promise<boolean> {
        return await $(this.selectors.requesterMail).isDisplayed();
    }

    async isAssigneeNameDisplayed(): Promise<boolean> {
        return await $(this.selectors.assigneeName).isDisplayed();
    }

    async isAssignCompanyDisplayed(): Promise<boolean> {
        return await $(this.selectors.assignCompany).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.assignCompany).isDisplayed();
            } else {
                console.log("Flowset not present");
                return false;
            }
        });
    }

    async isAssignGroupTextDisplayed(): Promise<boolean> {
        return await $(this.selectors.assignGroupText).isDisplayed();
    }

    async clickOnTab(tabName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.tab, tabName)).click();
    }

    async clickOnViewCase(): Promise<void> {
        await $(this.selectors.viewCaseLink).click();
    }

    async getCategoryTier1Value(): Promise<string> {
        return await $(this.selectors.categoryTier1Value).getText();
    }

    async getCategoryTier2Value(): Promise<string> {
        return await $(this.selectors.categoryTier2Value).getText();
    }

    async getCategoryTier3Value(): Promise<string> {
        return await $(this.selectors.categoryTier3Value).getText();
    }

    async getCategoryTier4Value(): Promise<string> {
        return await $(this.selectors.categoryTier4Value).getText();
    }

    async getLabelValue(): Promise<string> {
        return await $(this.selectors.labelValue).getText();
    }

    async getDescriptionValue(): Promise<string> {
        return await $(this.selectors.descriptionValue).getText();
    }

    async getTaskTypeValue(): Promise<string> {
        return await $(this.selectors.taskTypeValue).getText();
    }

    async getProcessNameValue(): Promise<string> {
        return await $(this.selectors.processnameValue).getText();
    }

    async getStatusReason(): Promise<string> {
        return await $(this.selectors.statusReason).getText();
    }

    async isProcessNameValue(): Promise<boolean> {
        return await $(this.selectors.processnameValue).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.processnameValue).getText() ? true : false;
            } else {
                console.log("Flowset not present");
                return false;
            }
        });
    }

    async getTaskID(): Promise<string> {
        return await $(this.selectors.taskIdText).getText();

    }

    async isAttachedFileNamePresent(fileName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.attachmentName, fileName)).isPresent();
    }

    async clickOnAttachments(attachmentName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.attachmentName, attachmentName)).click();
    }

    async clickOnSaveViewAdhoctask(): Promise<void> {
        await $(this.selectors.saveAdhocTask).click();
    }

    async getShowMoreLessAttachmentsLinkText(label?: string): Promise<string> {
        if (label) {
            let dynamicAttachment = await $$('[rx-view-component-id="4c988a95-b148-475f-b91c-9788d8e6c0cb"] .form-group').count();
            for (let i = 0; i < dynamicAttachment; i++) {
                let fieldName = await $$('[rx-view-component-id="4c988a95-b148-475f-b91c-9788d8e6c0cb"] .form-group label').get(i).getText();
                if (fieldName == label) {
                    return await $$('[rx-view-component-id="4c988a95-b148-475f-b91c-9788d8e6c0cb"] .form-group').get(i).$(this.selectors.showMore).getText();
                }
            }
        } else {
            return await $$(this.selectors.showMore).first().getText();
        }
    }

    async clickShowMoreShowLessLink(label?: string): Promise<void> {
        if (label) {
            let dynamicAttachment = await $$('[rx-view-component-id="4c988a95-b148-475f-b91c-9788d8e6c0cb"] .form-group').count();
            for (let i = 0; i < dynamicAttachment; i++) {
                let fieldName = await $$('[rx-view-component-id="4c988a95-b148-475f-b91c-9788d8e6c0cb"] .form-group label').get(i).getText();
                if (fieldName == label) {
                    await $$('[rx-view-component-id="4c988a95-b148-475f-b91c-9788d8e6c0cb"] .form-group').get(i).$(this.selectors.showMore).click();
                    break;
                }
            }
        } else {
            await $$(this.selectors.showMore).first().click();
        }
    }

    async clickOnDownloadFile(fileName: string): Promise<void> {
        let fileCount: number = await $$('span.bwf-attachment-container__file-name').count();
        for (let i = 0; i < fileCount; i++) {
            let fileNameText = await $$('span.bwf-attachment-container__file-name').get(i).getText();
            if (fileName == fileNameText) {
                await $$('span.bwf-attachment-container__file-name').get(i).click();
            }
        }
    }

    async isFileDisplayed(fileName: string): Promise<boolean> {
        let fileCount: number = await $$('span.bwf-attachment-container__file-name').count();
        for (let i = 0; i < fileCount; i++) {
            let fileNameText = await $$('span.bwf-attachment-container__file-name').get(i).getText();
            if (fileName == fileNameText) {
                return true;
            }
        }
        return false;
    }

    async getDynamicFieldName(fieldName: string): Promise<string> {
        let dynamicFields: number = await $$('.fields-container label').count();
        for (let i = 0; i < dynamicFields; i++) {
            let field = await $$('.fields-container label').get(i).getText();
            if (fieldName == field) {
                return await $$('.fields-container label').get(i).getText();
            }
        }
        return null;
    }

    async getDynamicFieldValue(fieldName: string): Promise<string> {
        let dynamicFields: number = await $$('.fields-container label').count();
        for (let i = 0; i < dynamicFields; i++) {
            let field = await $$('.fields-container label').get(i).getText();
            if (fieldName == field) {
                return await $$('.fields-container .read-only-content').get(i).getText();
            }
        }
        return null;
    }

    async getAssigneeText(): Promise<string> {
        return await $(this.selectors.assigneeName).getText();
    }

    async isDynamicFieldPresent(fieldName: string): Promise<boolean> {
        let dynamicFields: number = await $$(this.selectors.dynamicFieldsName).count();
        for (let i = 0; i < dynamicFields; i++) {
            let field = await (await $$(this.selectors.dynamicFieldsName).get(i).getText()).trim();
            if (fieldName == field) {
                return true;
            }
        }
        return false;
    }
    async isDynamicFieldSectionPresent(): Promise<boolean> {
        return await $(this.selectors.dynamicFieldsName).isPresent();
    }

    async isAssignmentSectionDisplayed(): Promise<boolean> {
        return await $(this.selectors.assignmentSection).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.assignmentSection).isDisplayed();
            } else {
                console.log("Assignment not present");
                return false;
            }
        });
    }

    async isShowApproversBannerDisplayed(): Promise<boolean> {
        return await $(this.selectors.showApproversBanner).isPresent().then(async (link) => {
            if (link) {
                return await $(this.selectors.showApproversBanner).isDisplayed();
            } else return false;
        });
    }

    async clickShowApproversLink(): Promise<void> {
        await $(this.selectors.showApproversBanner).$(this.selectors.showApproversLink).click();
    }

    async getShowPendingApproversInfo(): Promise<string> {
        return await $(this.selectors.pendingApprovalsInfo).getAttribute('aria-label');
    }

    async getApprovedApproversInfo(): Promise<string> {
        return await $$(this.selectors.pendingApprovalsInfo).last().getAttribute('aria-label');
    }

    async isApprovalButtonsPresent(buttonText: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.approvalButtons, buttonText)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.approvalButtons, buttonText)).isDisplayed();
            else return false;
        });
    }

    async clickOnApproveLink(): Promise<void> {
        await $(this.selectors.approveButton).click();
    }

    async clickOnRejectLink(): Promise<void> {
        await $(this.selectors.rejectButton).click();
    }

    async getRequesterName(): Promise<string> {
        return await $(this.selectors.requesterName).getText();
    }

    async getContactPersonName(): Promise<string> {
        return await $(this.selectors.contactPersonName).getText();
    }

    async clickOnEmailAddress(emailAddress: string): Promise<void> {
        await element(by.css(`button[aria-label*="${emailAddress}"]`)).click();
    }

    async clickOnRequesterName(): Promise<void> {
        return await $(this.selectors.requesterName).click();
    }

    async clickOnContactName(): Promise<void> {
        return await $(this.selectors.contactPersonName).click();
    }

    async getErrorMsgOfInprogressStatus(): Promise<string> {
        return await $(this.selectors.inprogressErrorMsg).getText();
    }

    async isChangeStatusButtonDisabled(): Promise<boolean> {
        return await $(this.selectors.statusDropdown).getAttribute("disabled") == "true";
    }

    async isDynamicFieldDisplayed(fieldName: string): Promise<boolean> {
        return await element(by.cssContainingText('[class="d-textfield ng-star-inserted"] label', fieldName)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText('[class="d-textfield ng-star-inserted"] label', fieldName)).isDisplayed();
            else return false;
        })
    }

    async isEditAssignmentDisabled(): Promise<boolean> {
        return await $(this.selectors.editAssignment).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.editAssignment).getAttribute("disabled") == "true";
            } else return false;
        });
    }

    async isEditAssignmentDisplayed(): Promise<boolean> {
        return await $(this.selectors.editAssignment).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.editAssignment).isDisplayed();
            } else return false;
        });
    }


    async isAssignToMeDisabled(): Promise<boolean> {
        return await $(this.selectors.assignToMe).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.assignToMe).getAttribute("disabled") == "true";
            } else return false;
        });
    }
}

export default new ViewTask();
