import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import updateStatusBlade from '../../pageobject/common/update.status.blade.po';

class ViewCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        categoryTier1Value: '[rx-view-component-id="593784cc-6bce-4bfd-82e1-7ca55aa28517"] .read-only-content',
        categoryTier2Value: '[rx-view-component-id="7beae951-8345-4f97-9cac-48933083928f"] .read-only-content',
        categoryTier3Value: '[rx-view-component-id="68d56b74-b9ad-444e-8dfc-ddec1e16897f"] .read-only-content',
        categoryTier4Value: '[rx-view-component-id="aa75da42-eeb4-4a6f-946b-74d5316b7641"] .read-only-content',
        reOpenCase: '[rx-view-component-id="2d51cf41-f176-4e20-bc48-f2741bcbbcb0"] button',
        stopWatching: '[rx-view-component-id="a62c849f-5bb0-480f-9811-50def59d82d0"] button',
        statusChange: '[rx-view-component-id="48bbcbbf-564c-4d46-8dc2-1e7670c187ff"] .status-transition',
        addTaskButton: '[rx-view-component-id="db1c57fc-c332-40fa-b1c0-759e21d9ad5c"] button',
        addTaskButtonGuid: '[rx-view-component-id="db1c57fc-c332-40fa-b1c0-759e21d9ad5c"]',
        editLink: '.float-right [class="btn btn-link btn-sm ng-star-inserted"]',
        caseIdText: '[rx-view-component-id="7b47ca08-e9d4-4656-8f96-3bc751c098b0"] .title',
        requesterName: '[rx-view-component-id="81d4a02e-dbed-4d6d-a298-2d68cfaeb91a"] .person-main a',
        requesterPhoneNo: '[rx-view-component-id="81d4a02e-dbed-4d6d-a298-2d68cfaeb91a"] .person-phone-link',
        requesterEmail: '[rx-view-component-id="81d4a02e-dbed-4d6d-a298-2d68cfaeb91a"] .bwf-button-link',
        contactPersonDrpDwn: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] .d-icon-angle_down',
        contactPersonName: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] .person-main a',
        contactPersonContact: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] .person-phone-link',
        contactPersonEmail: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] .bwf-button-link',
        descriptionText: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] .bwf-read-only-content',
        assigneeText: '[rx-view-component-id="dfe65f6f-7aea-476c-8042-f3aa34e3fb04"] .person-link',
        assignedGroupText: '[rx-view-component-id="66c1bbab-901d-42ed-b5e6-a04cb54d559f"] .read-only-content',
        departmentText: '[rx-view-component-id="795da3b4-6442-4b07-b6e1-7ce7c9987352"] .read-only-content',
        businessUnitText: '[rx-view-component-id="f14326b0-0c70-4827-8a02-95e82527409a"] .read-only-content',
        assignedCompanyText: '[rx-view-component-id="8b4d78f0-fbda-420c-928f-3dee49fde4fc"] .read-only-content',
        attachmentsLink: '[rx-view-component-id="43357d0a-a8ec-497a-a7e6-f77e45dad719"] button',
        addToWatchlist: '[rx-view-component-id="df24e195-e4f2-4114-af3f-e8a07691bdfd"] button',
        caseSummary: '[rx-view-component-id="8ebc1637-af05-4a08-b873-4f810c4981b9"] p',
        caseSite: '[rx-view-component-id="4a58cc3b-e699-4357-a68a-482163d6cbbe"] .read-only-content',
        inprogressErrorMsg: '[rx-view-component-id="dd40ce76-9d16-4c6a-b1a1-16fe6aa6721f"] p',
        label: '[rx-view-component-id="2415f5bb-1b76-4359-a034-ff16f8e26f7b"] .read-only-content',
        resolutionCodeText: '[rx-view-component-id="32eeffe4-f5c1-4fc8-9c91-25946cc86d66"] button',
        resolutionDescriptionText: '[rx-view-component-id="923de542-50b0-482f-a370-3823d0c07645"] .bwf-read-only-content',
        resolutionCodeValue: '[rx-view-component-id="32eeffe4-f5c1-4fc8-9c91-25946cc86d66"] button',
        resolutionDescriptionValue: '[rx-view-component-id="923de542-50b0-482f-a370-3823d0c07645"] .bwf-read-only-content',
        priority: '[rx-view-component-id="7b47ca08-e9d4-4656-8f96-3bc751c098b0"] .selection-field',
        emailLink: '[rx-view-component-id="58a437ec-fc5b-4721-a583-1d6c80cfe6a6"] button',
        addedTaskFromCaseTemplate: '.task-summary-wrapper .task-summary__name',
        taskCardArrow: '[class="d-icon-angle_right task-list__task-card__preview-icon"]',
        attachmentFile: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] .bwf-attachment-container__file-name',
        caseTemplate: '[rx-view-component-id="a3fed42a-3de2-4df8-880f-a7528c3999e6"] .read-only-content',
        sourceValue: '[rx-view-component-id="8abd013f-26cd-4aa5-a3bb-63b063d3a7ec"] .read-only-content',
        showMore: '.rx-attachment-show-text',
        dynamicFieldsName: '[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .form-group label',
        dynamicFieldsValue: '[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .read-only-content',
        slaProgressBar: '.progress-bar',
        tab: '.nav-item button',
    }

    async isGroupNameDisplayed(groupName: string): Promise<boolean> {
        return await $(`[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .group-container__name__title[title=${groupName}]}`).isDisplayed();
    }

    async isAttachedDocumentPresent(fileName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.attachmentFile, fileName)).isPresent();
    }

    async clickOnAttachedDocumentFile(fileName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.attachmentFile, fileName)).click();
    }

    async clickOnEmailLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailLink)));
        await $(this.selectors.emailLink).click();
        //await browser.wait(this.EC.visibilityOf($('.modal-content')), 2000); // wait until compose email appears (api is not involved hence EC wait)
    }

    async clickOnRequestersEmail(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.requesterEmail)));
        await $(this.selectors.requesterEmail).click();
    }

    async isEmailLinkPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailLink)));
        return await $(this.selectors.emailLink).isPresent();
    }

    async selectResolutionCodeDropDown(resolutionCode: string): Promise<void> {
        await updateStatusBlade.selectResolutionCode(resolutionCode);
    }

    async getResolutionCodeValue(): Promise<string> {
        return await $(this.selectors.resolutionCodeValue).getText();
    }

    async getResolutionDescription(): Promise<string> {
        return await $(this.selectors.resolutionDescriptionValue).getText();
    }

    async isCaseReopenLinkPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.presenceOf($('[rx-view-component-id="2d51cf41-f176-4e20-bc48-f2741bcbbcb0"]')));
        return await $(this.selectors.reOpenCase).isPresent();
        // let presentInDom: boolean = await $(this.selectors.reOpenCase).isPresent();
        // if (presentInDom) {
        //     await browser.wait(this.EC.visibilityOf($(this.selectors.reOpenCase)), 5000);
        // }
        // return presentInDom;
    }

    async clickOnReopenCaseLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.reOpenCase)));
        await $(this.selectors.reOpenCase).click();
        //        await utilCommon.waitUntilPopUpDisappear();
    }

    async getErrorMsgOfInprogressStatus(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.inprogressErrorMsg)));
        return await $(this.selectors.inprogressErrorMsg).getText();
    }

    async getlabel(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.inprogressErrorMsg)));
        return await $(this.selectors.label).getText();
    }

    async getPriorityValue(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.priority)));
        return await $(this.selectors.priority).getText();
    }

    async getCategoryTier1Value(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier1Value)));
        return await $(this.selectors.categoryTier1Value).getText();
    }

    async getCategoryTier2Value(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier2Value)));
        return await $(this.selectors.categoryTier2Value).getText();
    }

    async getCategoryTier3Value(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier3Value)));
        return await $(this.selectors.categoryTier3Value).getText();
    }

    async getCategoryTier4Value(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier4Value)));
        return await $(this.selectors.categoryTier4Value).getText();
    }

    async getTextOfStatus(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.editLink)));
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.statusChange)));
        return await $(this.selectors.statusChange).getText();
    }

    async clickOnStatus(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
    }

    async clickAddToWatchlistLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addToWatchlist)));
        await $(this.selectors.addToWatchlist).click();
    }

    async getAddToWatchlistLinkText(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addToWatchlist)));
        return await $(this.selectors.addToWatchlist).getText();
    }

    async isEditLinkDisplay(): Promise<boolean> {
        return await $(this.selectors.editLink).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.editLink).isDisplayed();
            else return false;
        });
    }

    async clickEditCaseButton(): Promise<void> {        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLink)));
        await $(this.selectors.editLink).click();
        //        await browser.wait(this.EC.visibilityOf($(editCasePage.selectors.cancelBtn)));
    }

    async clickAddTaskButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addTaskButton)),3000);
        await $(this.selectors.addTaskButton).click();
    }

    async isAddtaskButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addTaskButton)),3000);
        return await $(this.selectors.addTaskButtonGuid).getAttribute("innerText") ? true : false;
    }

    async openTaskCard(taskCardNumber: number): Promise<void> {
        await $$(this.selectors.taskCardArrow).get(taskCardNumber - 1).click();
    }

    async getCaseID(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseIdText)));
        return await (await $(this.selectors.caseIdText).getText()).trim();
    }

    async getRequesterName(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterName)));
        return await $(this.selectors.requesterName).getText();
    }

    async getRequesterPhoneNo(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterPhoneNo)));
        return (await $(this.selectors.requesterPhoneNo).getText()).trim();
    }

    async getRequesterEmail(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterEmail)));
        return await (await $(this.selectors.requesterEmail).getText()).trim();
    }

    async getContactPersonName(): Promise<string> {
        //       await browser.wait(this.EC.visibilityOf($(this.selectors.contactPersonName)));
        return await $(this.selectors.contactPersonName).getText();
    }

    async getCaseSummary(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseSummary)));
        return await $(this.selectors.caseSummary).getText();
    }

    async getCaseSite(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseSite)));
        return await $(this.selectors.caseSite).getText();
    }

    async getContactPersonerPhoneNo(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.contactPersonContact)));
        return await (await $(this.selectors.contactPersonContact).getText()).trim();
    }

    async getContactPersonalEmail(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.contactPersonEmail)));
        return await (await $(this.selectors.contactPersonEmail).getText()).trim();
    }

    async clickStopWatchingLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.stopWatching)));
        await $(this.selectors.stopWatching).click();
    }

    async getStopWatchingLinkText(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.stopWatching)));
        return await $(this.selectors.stopWatching).getText();
    }

    async clickOnContactPersonerDrpDwn(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.contactPersonDrpDwn)));
        await $(this.selectors.contactPersonDrpDwn).click();
    }

    async clickAttachmentsLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachmentsLink)));
        await $(this.selectors.attachmentsLink).click();
    }

    async getCaseDescriptionText(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.descriptionText)));
        return await (await $(this.selectors.descriptionText).getText()).trim();
    }

    async getAssigneeText(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneeText)));
        return await $(this.selectors.assigneeText).getText();
    }

    async getAssignedGroupText(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignedGroupText)));
        return await $(this.selectors.assignedGroupText).getText();
    }

    async getDepartmentText(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.departmentText)));
        return await $(this.selectors.departmentText).getText();
    }

    async getBusinessUnitText(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.businessUnitText)));
        return await $(this.selectors.businessUnitText).getText();
    }

    async getAssignedCompanyText(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignedCompanyText)));
        return await $(this.selectors.assignedCompanyText).getText();
    }

    async isTextPresent(text: string): Promise<boolean> {
        let textLocator = `(//p[contains(@title,'${text}')])`;
        return await element(by.xpath(textLocator)).isPresent();
    }

    async isCoreTaskPresent(taskSummary: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText(this.selectors.addedTaskFromCaseTemplate, taskSummary))));
        return await element(by.cssContainingText(this.selectors.addedTaskFromCaseTemplate, taskSummary)).isDisplayed();
    }

    async clickOnTaskLink(taskSummary: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.addedTaskFromCaseTemplate, taskSummary)).click();
    }

    async getCaseStatusValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        return await $(this.selectors.statusChange).getText();
    }

    async clickOnTab(tabName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.tab, tabName)).click();
    }

    async getCaseTemplateText(): Promise<string> {
        return await $(this.selectors.caseTemplate).getText();
    }

    async getSourceValue(): Promise<string> {
        return await $(this.selectors.sourceValue).getText();
    }
    async getShowMoreLessAttachmentsLinkText(): Promise<string> {
        return await $(this.selectors.showMore).getText();
    }

    async clickShowMoreLink(): Promise<void> {
        return await $(this.selectors.showMore).click();
    }

    async isFileDisplayed(fileName: string): Promise<boolean> {
        return await $(`.rx-attachment-view-thumbnail [alt=${fileName}]`).isDisplayed();
    }

    async getSlaBarColor(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBar)));
        return await $(this.selectors.slaProgressBar).getCssValue('background-color');
    }

    async clickOnDownloadFile(fileName: string): Promise<void> {
        await $(`div[aria-label="Download attachment ${fileName}"]`).click();
    }

    async isDynamicFieldDisplayed(fieldName: string): Promise<boolean> {
        let dynamicFieldLocator = `[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .form-group label[title="${fieldName}"]`;
        return await $(dynamicFieldLocator).isPresent().then(async (result) => {
            if (result) return await $(dynamicFieldLocator).isDisplayed();
            else {
                console.log('dynamic field is not present');
                return false;
            }
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
        return null;
    }
}

export default new ViewCasePage();