import { $, $$, browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../utils/utility.common';

class ViewCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        categoryTier1Value: '[rx-view-component-id="59769557-4b17-4a1a-952f-63e9418fb7ff"] .read-only-content',
        categoryTier2Value: '[rx-view-component-id="0aa422df-d89a-40ac-8956-c4f5480b2e36"] .read-only-content',
        categoryTier3Value: '[rx-view-component-id="f59cd305-9f35-4d39-891e-8824a97724e2"] .read-only-content',
        categoryTier4Value: '[rx-view-component-id="7f7f2d24-1f78-427e-b972-f99e55f1d070"] .read-only-content',
        reOpenCase: '[rx-view-component-id="2d51cf41-f176-4e20-bc48-f2741bcbbcb0"] button',
        stopWatching: '[rx-view-component-id="a62c849f-5bb0-480f-9811-50def59d82d0"] button',
        statusChange: '[rx-view-component-id="48bbcbbf-564c-4d46-8dc2-1e7670c187ff"] .status-transition',
        addTaskButton: '[rx-view-component-id="db1c57fc-c332-40fa-b1c0-759e21d9ad5c"] button',
        addTaskButtonGuid: '[rx-view-component-id="db1c57fc-c332-40fa-b1c0-759e21d9ad5c"]',
        editLink: '[rx-view-component-id="06575c26-3fa8-4973-91da-ff11904aaf8e"] button.btn-sm[btn-type="tertiary"]',
        caseIdText: '[rx-view-component-id="7b47ca08-e9d4-4656-8f96-3bc751c098b0"] .title',
        requesterName: '[rx-view-component-id="81d4a02e-dbed-4d6d-a298-2d68cfaeb91a"] .person-main a',
        requesterPhoneNo: '[rx-view-component-id="81d4a02e-dbed-4d6d-a298-2d68cfaeb91a"] .person-phone-link',
        requesterEmail: '[rx-view-component-id="81d4a02e-dbed-4d6d-a298-2d68cfaeb91a"] .bwf-button-link',
        contactEmail: '[rx-view-component-id="81d4a02e-dbed-4d6d-a298-2d68cfaeb91a"] .bwf-button-link',
        contactPersonDrpDwn: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] .d-icon-angle_down',
        contactPersonName: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] .person-main a',
        contactPersonContact: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] .person-phone-link',
        contactPersonEmail: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] .bwf-button-link',
        descriptionText: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] label+div',
        assigneeText: '[rx-view-component-id="13635426-50b0-4b53-8026-a1682ab656e8"] .person-link',
        assignedGroupText: '[rx-view-component-id="66c1bbab-901d-42ed-b5e6-a04cb54d559f"] .read-only-content',
        departmentText: '[rx-view-component-id="795da3b4-6442-4b07-b6e1-7ce7c9987352"] .read-only-content',
        businessUnitText: '[rx-view-component-id="f14326b0-0c70-4827-8a02-95e82527409a"] .read-only-content',
        assignedCompanyText: '[rx-view-component-id="8b4d78f0-fbda-420c-928f-3dee49fde4fc"] .read-only-content',
        attachmentsLink: '[rx-view-component-id="43357d0a-a8ec-497a-a7e6-f77e45dad719"] button',
        addToWatchlistDropdown: '.button-container .dropdown button',
        addToWatchlist: '[rx-view-component-id="df24e195-e4f2-4114-af3f-e8a07691bdfd"] button',
        caseSummary: '[rx-view-component-id="8ebc1637-af05-4a08-b873-4f810c4981b9"] p span',
        caseSite: '[rx-view-component-id="4a58cc3b-e699-4357-a68a-482163d6cbbe"] .read-only-content',
        inprogressErrorMsg: '[rx-view-component-id="dd40ce76-9d16-4c6a-b1a1-16fe6aa6721f"] p',
        label: '[rx-view-component-id="2415f5bb-1b76-4359-a034-ff16f8e26f7b"] .read-only-content',
        resolutionCodeText: '[rx-view-component-id="155eb52a-4680-42a4-ae91-7505ab92eb31"] label',
        resolutionCodeValue: '[rx-view-component-id="155eb52a-4680-42a4-ae91-7505ab92eb31"] .read-only-content',
        resolutionDescriptionLabel: '[rx-view-component-id="923de542-50b0-482f-a370-3823d0c07645"] label',
        resolutionDescriptionValue: '[rx-view-component-id="923de542-50b0-482f-a370-3823d0c07645"] .collapse-block',
        priority: '[rx-view-component-id="7b47ca08-e9d4-4656-8f96-3bc751c098b0"] .selection-field',
        emailLink: '[rx-view-component-id="58a437ec-fc5b-4721-a583-1d6c80cfe6a6"] button',
        addedTaskFromCaseTemplate: '.task-summary__name',
        taskCardArrow: '[class="d-icon-angle_right task-list__task-card__preview-icon"]',
        attachmentFile: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] .bwf-attachment-container__file-name',
        caseTemplate: '[rx-view-component-id="a3fed42a-3de2-4df8-880f-a7528c3999e6"] .read-only-content',
        sourceValue: '[rx-view-component-id="8abd013f-26cd-4aa5-a3bb-63b063d3a7ec"] .read-only-content',
        showMore: 'bwf-attachment-viewer .btn-link .ng-star-inserted',
        dynamicFieldsName: '[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] label',
        dynamicFieldsValue: '[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .read-only-content',
        slaProgressBar: '.progress-bar',
        tab: '.nav-item button',
        showApproversBanner: '.rx-runtime-view-canvas-item-margin [rx-view-component-id="f288e1bb-9273-4ddd-98da-175d0c9b7413"]',
        pendingApprovalsInfo: '[rx-view-component-id="9766d3d3-3f7c-43fe-8237-473d88298daa"] span[aria-label="Status of case approvals"] span',
        showApproversLink: '[rx-view-component-id="3526bece-a540-4774-aa46-009075dbee5f"] button',
        showMoreDescription: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] button',
        approvalButtons: '.approval-buttons span',
        approveButton: '.d-icon-left-check_shield',
        rejectButton: '.d-icon-left-cross_circle',
        assignee: '[rx-view-component-id="13635426-50b0-4b53-8026-a1682ab656e8"]',
        taskCardName: '.task-list__task-card .task-summary__name',
        taskCountOnTaskCard: '.task-list__task-card .task-summary__adhoc-task-count',
        taskTab: '[rx-view-component-id="4c82d32f-5efd-437d-b020-a57910532aa0"] adapt-button',
        taskDisplayId: '[rx-view-component-id="beb9c44b-6bd5-4f68-b9b9-37d427d9d2e5"] .task-meta-data__display-id',
        description: '9d3ef0fc-c49f-425f-a9e1-52422ba87f4f',
        dynamicAttachmentValue: '[class="text-default bwf-attachment-container__file-name"]',
        text: 'p',
        refreshActivity: '.d-icon-left-refresh',
        flowset: '[rx-view-component-id="73fb70b0-2992-4dc5-b7ed-3d3d13cc4d6b"] .read-only-content',
        lineofbusiness: '[rx-view-component-id="694535e8-ab22-4ddc-8d2a-ceb017cf4fbf"] .read-only-content',
        recommendedCaseGuid: '[rx-view-component-id="1bd34505-c98c-4046-a129-5d3c09e87955"]',
        assigneeHierarchy: '.read-only-hierachy div.read-only-content',
        editAssignment: '.edit-button button',
        assignToMe: '.assign-to-me button'
    }

    async clickDescriptionShowMore(): Promise<void> {
        await $(this.selectors.showMoreDescription).click();
    }

    async getDynamicAttachmentValue(): Promise<string> {
        return await $(this.selectors.dynamicAttachmentValue).getText();
    }

    async isImageDisplayed(value: string): Promise<boolean> {
        return await $(`.bwf-description-read-state img[src="${value}"]`).isDisplayed();
    }

    async getStatusReason(value: string): Promise<string> {
        return await $(`[rx-view-component-id="73dd86e7-bae5-4782-a49d-8cffaeb01053"] div[title="${value}"]`).getText();
    }

    async isColorTextPresent(value: string): Promise<boolean> {
        return await $(`.bwf-description-read-state span[style="${value}"]`).isPresent();
    }
    async isGroupNameDisplayed(groupName: string): Promise<boolean> {
        return await $(`.group-container__name__title[title=${groupName}]`).isDisplayed();
    }

    async clickOnGroupName(groupName: string): Promise<void> {
        await $(`.group-container__name__title[title=${groupName}]`).click();
    }
    async isAttachedDocumentPresent(fileName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.attachmentFile, fileName)).isPresent();
    }

    async clickOnAttachedDocumentFile(fileName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.attachmentFile, fileName)).click();
    }

    async clickOnEmailLink(): Promise<void> {
        await $(this.selectors.emailLink).click();
    }

    async clickOnRequestersEmail(): Promise<void> {
        await $(this.selectors.requesterEmail).click();
    }

    async clickOnContactEmail(): Promise<void> {
        await $(this.selectors.contactEmail).click();
    }

    async isEmailLinkPresent(): Promise<boolean> {
        return await $(this.selectors.emailLink).isPresent();
    }

    async getResolutionCodeValue(): Promise<string> {
        return (await $(this.selectors.resolutionCodeValue).getText()).trim();
    }

    async getResolutionDescription(): Promise<string> {
        return (await $(this.selectors.resolutionDescriptionValue).getText()).trim();
    }

    async isCaseReopenLinkPresent(): Promise<boolean> {
        return await $(this.selectors.reOpenCase).isPresent();
    }

    async clickOnReopenCaseLink(): Promise<void> {
        await $(this.selectors.reOpenCase).click();
    }

    async isCaseReopenLinkDisabled(): Promise<boolean> {
        return await $(this.selectors.reOpenCase).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.reOpenCase).getAttribute("disabled") == "true";
            } else return false;
        });
    }

    async getErrorMsgOfInprogressStatus(): Promise<string> {
        return await $(this.selectors.inprogressErrorMsg).getText();
    }

    async getlabel(): Promise<string> {
        return await $(this.selectors.label).getText();
    }

    async getPriorityValue(): Promise<string> {
        return await $(this.selectors.priority).getText();
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

    async getTextOfStatus(): Promise<string> {
        return await $(this.selectors.statusChange).getText();
    }

    async clickOnStatus(): Promise<void> {
        await $(this.selectors.statusChange).click();
    }

    async clickAddToWatchlistLink(): Promise<void> {
        await browser.sleep(3000); // hardwait to stabilize dropdown button visibility
        await $('[rx-view-component-id="df24e195-e4f2-4114-af3f-e8a07691bdfd"] button').isDisplayed().then(async (present) => {
            if (!present) await $(this.selectors.addToWatchlistDropdown).click();
        });
        await $$('[rx-view-component-id="df24e195-e4f2-4114-af3f-e8a07691bdfd"] button').last().click();
    }

    async getAddToWatchlistLinkText(): Promise<string> {
        let text: string = undefined;
        return await $(this.selectors.addToWatchlistDropdown).isDisplayed().then(async (isDisplay) => {
            if (isDisplay) {
                await $(this.selectors.addToWatchlistDropdown).click();
                text = await $('.dropdown-menu  [rx-view-component-id="df24e195-e4f2-4114-af3f-e8a07691bdfd"] button').getText();
                await $(this.selectors.addToWatchlistDropdown).click();
                return text;
            } else text = await $('[rx-view-component-id="df24e195-e4f2-4114-af3f-e8a07691bdfd"] button span').getText();
        });
    }

    async isEditLinkDisplay(): Promise<boolean> {
        return await $(this.selectors.editLink).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.editLink).isDisplayed();
            else return false;
        });
    }

    async clickEditCaseButton(): Promise<void> {
        //await utilityCommon.scrollToElement($(this.selectors.editLink));
        await $(this.selectors.editLink).click();
    }

    async clickAddTaskButton(): Promise<void> {
        await $(this.selectors.addTaskButton).isPresent().then(async (link) => {
            if (link) {
                //await utilityCommon.scrollToElement($(this.selectors.addTaskButton));
                await $(this.selectors.addTaskButton).click();
            } else console.log('Add Task button not found');
        });

    }

    async isAddtaskButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.addTaskButtonGuid).getAttribute("innerText") ? true : false;
    }

    async openTaskCard(taskCardNumber: number): Promise<void> {
        await utilityCommon.scrollToElement($(this.selectors.taskCardArrow));
        await $$(this.selectors.taskCardArrow).get(taskCardNumber - 1).click();
    }

    async getCaseID(): Promise<string> {
        return await (await $(this.selectors.caseIdText).getText()).trim();
    }

    async getRequesterName(): Promise<string> {
        return await $(this.selectors.requesterName).getText();
    }

    async clickRequsterName() {
        await $(this.selectors.requesterName).click();
    }

    async getRequesterPhoneNo(): Promise<string> {
        return (await $(this.selectors.requesterPhoneNo).getText()).trim();
    }

    async getRequesterEmail(): Promise<string> {
        return await (await $(this.selectors.requesterEmail).getText()).trim();
    }

    async getContactPersonName(): Promise<string> {
        return await $(this.selectors.contactPersonName).getText();
    }

    async getCaseSummary(): Promise<string> {
        return await $(this.selectors.caseSummary).getText();
    }

    async getCaseSite(): Promise<string> {
        return await $(this.selectors.caseSite).getText();
    }

    async getContactPersonerPhoneNo(): Promise<string> {
        return await (await $(this.selectors.contactPersonContact).getText()).trim();
    }

    async getContactPersonalEmail(): Promise<string> {
        return await (await $(this.selectors.contactPersonEmail).getText()).trim();
    }

    async clickStopWatchingLink(): Promise<void> {
        await $(this.selectors.addToWatchlistDropdown).isDisplayed().then(async (isDisplay) => {
            if (isDisplay) {
                await $(this.selectors.addToWatchlistDropdown).click();
                await $('.dropdown-menu  [rx-view-component-id="a62c849f-5bb0-480f-9811-50def59d82d0"] button').click();
            } else await $(this.selectors.stopWatching).click();
        });
    }

    async getStopWatchingLinkText(): Promise<string> {
        let text: string = undefined;
        return await $(this.selectors.addToWatchlistDropdown).isDisplayed().then(async (isDisplay) => {
            if (isDisplay) {
                await $(this.selectors.addToWatchlistDropdown).click();
                text = await $('.dropdown-menu  [rx-view-component-id="a62c849f-5bb0-480f-9811-50def59d82d0"] button').getText();
                await $(this.selectors.addToWatchlistDropdown).click();
                return text;
            } else return await $('[rx-view-component-id="a62c849f-5bb0-480f-9811-50def59d82d0"] button span').getText();
        });
    }

    async clickOnContactPersonerDrpDwn(): Promise<void> {
        await $(this.selectors.contactPersonDrpDwn).click();
    }

    async clickAttachmentsLink(): Promise<void> {
        //await utilityCommon.scrollToElement($(this.selectors.attachmentsLink));
        await $(this.selectors.attachmentsLink).click();
    }

    async getCaseDescriptionText(): Promise<string> {
        return await (await $(this.selectors.descriptionText).getText()).trim();
    }

    async getAssigneeText(): Promise<string> {
        let valueassignee: boolean = await $(this.selectors.assignee + ' .person-link').isPresent();
        if (valueassignee == true) {
            return await $(this.selectors.assignee + ' .person-link').getText();
        } else {
            return await $(this.selectors.assignee + ' .ac-person-absent').getText();
        }
    }

    async getAssigneeHierarchy(): Promise<string> {
        return await $(this.selectors.assigneeHierarchy).getText();
    }

    async getAssignedGroupValue(): Promise<string> {
        let hirearchy = await this.getAssigneeHierarchy();
        return (hirearchy.split('>')[2]).trim();
    }

    async getDepartmentText(): Promise<string> {
        return await $(this.selectors.departmentText).getText();
    }

    async getBusinessUnitText(): Promise<string> {
        let hirearchy = await this.getAssigneeHierarchy();
        return (hirearchy.split('>')[1]).trim();
    }

    async getAssignedCompanyValue(): Promise<string> {
        let hirearchy = await this.getAssigneeHierarchy();
        return (hirearchy.split('>')[0]).trim();
    }

    async isTextPresent(textValue: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.text, textValue)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.text, textValue)).isDisplayed();
            } else return false;
        });;
    }

    async isCoreTaskPresent(taskSummary: string): Promise<boolean> {
        await browser.wait(this.EC.or(async () => {
            let count = await $$(this.selectors.addedTaskFromCaseTemplate).count();
            return count >= 1;
        }), 5000);
        return await element(by.cssContainingText(this.selectors.addedTaskFromCaseTemplate, taskSummary)).isDisplayed();
    }

    async clickOnTaskLink(taskSummary: string): Promise<void> {
        await browser.wait(this.EC.or(async () => {
            let count = await $$(this.selectors.addedTaskFromCaseTemplate).count();
            return count >= 1;
        }), 5000);
        await element(by.cssContainingText(this.selectors.addedTaskFromCaseTemplate, taskSummary)).click();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
    }

    async getCaseStatusValue(): Promise<string> {
        return await $(this.selectors.statusChange).getText();
    }

    async clickOnTab(tabName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText(this.selectors.tab, tabName))), 6000);
        await element(by.cssContainingText(this.selectors.tab, tabName)).click();
    }

    async getCaseTemplateText(): Promise<string> {
        return await $(this.selectors.caseTemplate).getText();
    }

    async getSourceValue(): Promise<string> {
        return await $(this.selectors.sourceValue).getText();
    }
    async getShowMoreLessAttachmentsLinkText(label?: string): Promise<string> {
        if (label) {
            let dynamicAttachment = await $$('[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .form-group').count();
            for (let i = 0; i < dynamicAttachment; i++) {
                let fieldName = await $$('[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .form-group label').get(i).getText();
                if (fieldName == label) {
                    return await $$('[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .form-group').get(i).$(this.selectors.showMore).getText();
                }
            }
        } else {
            return await $$(this.selectors.showMore).first().getText();
        }
    }

    async clickShowMoreShowLessLink(label?: string): Promise<void> {
        if (label) {
            let dynamicAttachment = await $$('[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .form-group').count();
            for (let i = 0; i < dynamicAttachment; i++) {
                let fieldName = await $$('[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .form-group label').get(i).getText();
                if (fieldName == label) {
                    await $$('[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .form-group').get(i).$(this.selectors.showMore).click();
                }
            }
        } else {
            await $$(this.selectors.showMore).first().click();
        }
    }

    async isFileDisplayed(fileName: string): Promise<boolean> {
        return await element(by.cssContainingText('span.bwf-attachment-container__file-name', fileName)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText('span.bwf-attachment-container__file-name', fileName)).isDisplayed();
            else return false;
        })
    }

    async getSlaBarColor(): Promise<string> {
        return await $(this.selectors.slaProgressBar).getCssValue('background-color');
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

    async isDynamicFieldDisplayed(fieldName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.dynamicFieldsName, fieldName)).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText(this.selectors.dynamicFieldsName, fieldName)).isDisplayed();
            else return false;
        });
    }

    async getValueOfDynamicFields(fieldName: string): Promise<string> {
        let dynamicFields: number = await $$(this.selectors.dynamicFieldsName).count();
        for (let i = 0; i < dynamicFields; i++) {
            let field = await $$(this.selectors.dynamicFieldsName).get(i).getText();
            if (fieldName == field) {
                return await $$(this.selectors.dynamicFieldsValue).get(i).getText();
            }
        }
        return undefined;
    }

    async isAssigneeNameDisplayed(): Promise<boolean> {
        return await $(this.selectors.assigneeText).isPresent().then(async (link) => {
            if (link) {
                return await $(this.selectors.assigneeText).isDisplayed();
            } else return false;
        });
    }

    async clickAssigneeLink(): Promise<void> {
        await $(this.selectors.assigneeText).click();
    }

    async clickContactPersonName(): Promise<void> {
        await $(this.selectors.contactPersonName).click();
    }

    async isShowApproversBannerDisplayed(): Promise<boolean> {
        return await $(this.selectors.showApproversBanner).isPresent().then(async (link) => {
            if (link) {
                return await $(this.selectors.showApproversBanner).isDisplayed();
            } else return false;
        });
    }

    async clickShowApproversLink(): Promise<void> {
        await $(this.selectors.showApproversLink).click();
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

    async isAddTaskButtonDisabled(): Promise<boolean> {
        return await $(this.selectors.addTaskButton).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.addTaskButton).getAttribute("disabled") == "true";
            } else return false;
        });
    }

    async getTaskCardCount(): Promise<number> {
        if (!(await $(this.selectors.taskCardName).isPresent())) return 0;
        else return await $$(this.selectors.taskCardName).count();
    }

    async isTaskCountPresentOnAnyTaskCard(): Promise<boolean> {
        return await $(this.selectors.taskCountOnTaskCard).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.taskCountOnTaskCard).isDisplayed();
            else return false;
        });
    }

    async isTaskCardPresent(taskCardName: string): Promise<boolean> {
        let taskNameLocator: ElementFinder = await element(by.cssContainingText(this.selectors.taskCardName, taskCardName));
        return await taskNameLocator.isPresent().then(async (result) => {
            if (result) return await taskNameLocator.isDisplayed();
            else return false;
        });
    }

    async clickOnTaskViewTypeBtn(tabName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.taskTab, tabName)).click();
    }

    async isTaskBoxColorCodeMatches(name: string, colorCode: string): Promise<boolean> {
        let taskListParentLocator = $$('.rotatable');
        let actualColorCodeValue = undefined;
        for (let i = 0; i < await taskListParentLocator.count(); i++) {
            if (await taskListParentLocator.get(i).$('.content').isPresent()) {
                let taskBoxContent = await taskListParentLocator.get(i).$('.content').getText();
                if (taskBoxContent == name || taskBoxContent == name + " Memory") {
                    actualColorCodeValue = await taskListParentLocator.get(i).$$('.body.outer').first().getAttribute('stroke');
                    break;
                }
            }
        }
        return colorCode == actualColorCodeValue;
    }

    async isAllTaskUnderStatusTitleMatches(taskStatus: string, expectedTaskCardNames: string[]): Promise<boolean> {
        let taskListParentLocator = $$('[rx-view-component-id="beb9c44b-6bd5-4f68-b9b9-37d427d9d2e5"] .task-list');
        let allTaskNames: string[] = [];
        for (let i = 0; i < await taskListParentLocator.count(); i++) {
            let tasksLocator = await taskListParentLocator.get(i).$$('a.task-summary__name');
            if (await taskListParentLocator.get(i).$('.task-list__title').getText() == taskStatus) {
                for (let j = 0; j < tasksLocator.length; j++) {
                    allTaskNames[j] = await taskListParentLocator.get(i).$$('a.task-summary__name').get(j).getText();
                }
                break;
            }
        }
        allTaskNames.sort();
        expectedTaskCardNames.sort();
        return allTaskNames.length === expectedTaskCardNames.length && allTaskNames.every(
            (value, index) => (value === expectedTaskCardNames[index])
        );
    }

    async getAllTasksDisplayId(): Promise<string[]> {
        let displayIds: string[] = await element.all(by.css(this.selectors.taskDisplayId))
            .map(async function (header) {
                return await header.getAttribute('innerText');
            });
        return displayIds;
    }

    async clickOnRefreshTaskList() {
        await $(this.selectors.refreshActivity).click();
    }

    async clickDynamicAttachmentValue(fileName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.dynamicAttachmentValue, fileName)).click();
    }

    async getFlowsetValue(): Promise<string> {
        return await $(this.selectors.flowset).getText();
    }

    async getLineOfBusinessValue(): Promise<string> {
        return await $(this.selectors.lineofbusiness).getText();
    }

    async isDuplicateFieldsAreNotPresentOnCase(): Promise<boolean> {
        let allFieldsText: string[] = [];
        let filtered: string[] = [];
        let recordsCount: number = await $$('rx-read-only-field label').count();
        for (let i = 0; i < recordsCount; i++) {
            let ab: string = await $$('rx-read-only-field label').get(i).getText();
            allFieldsText[i] = ab;
        }
        filtered = allFieldsText.filter(function (el) {
            return el != '';
        });
        filtered.sort();
        for (let i = 1; i < filtered.length; i++) {
            if (filtered[i - 1] == filtered[i])
                return false;
        }
        return true;
    }

    async clickFirstRecommendedCases(): Promise<void> {
        await $(this.selectors.recommendedCaseGuid).$$('.flex-column bwf-search-result-fields div span').first().click();
    }
    async isEditAssignmenetDisabled(): Promise<boolean> {
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

export default new ViewCasePage();