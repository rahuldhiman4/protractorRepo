import { resolve } from "path";
import { $, $$, browser, by, element, ElementFinder, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';
import ckEditorOpsPo from '../common/ck-editor/ckeditor-ops.po';

class ActivityTabPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        //        activityNoteCKEditor: '[rx-view-component-id="76b9d8a2-54ef-4b24-a086-fc6ff745449d"] bwf-rich-text-editor[style="display: block;"], bwf-rich-text-editor[style="display: block;"]',
        activityNoteTextArea: '.cke_enable_context_menu',
        activityCkEditorGuid: '76b9d8a2-54ef-4b24-a086-fc6ff745449d',
        addNoteBox: '.textfield__wrapper .form-control[placeholder="Add a note"]',
        personPopup: 'button .popup-template',
        personPopupCkEditor: '.cke_autocomplete_panel li',
        addNotePostButton: '.activity-feed-note-buttons__right .btn-primary',
        addNoteCancelButton: '.activity-feed-note-buttons__right .btn-secondary',
        addNoteNotesTemplate: '.activity-note .d-icon-note_pencil',
        activityLog: '.activity__body .activity-title, .activity__body [style="position: relative;"], .activity__body .field, .activity__body .value, .activity__body div',
        filterButton: '.d-icon-filter',
        filterCheckbox: '.checkbox__label span',
        filterAuthor: '.dropdown [placeholder="Enter name, email, login ID or employee ID"]',
        filterPopupApplyOrClearButton: '.filter-options button span',
        FilterPopUp: '.bwf-activity-log-filter button[aria-expanded]',
        filterApplyButtonEnableDisabled: '.filter-options button[disabled="disabled"]',
        filterApplyBtn: '.filter-options button',
        filterLists: '.a-tag-active .bwf-text-overflow-ellipsis, .a-tag-active .bwf-text-overflow-ellipsis span',
        nMoreButton: '.bwf-show-more .dropdown-toggle span',
        removeIconFilterList: '.d-flex .close-inverse',
        activityTab: '.nav-link-wrapper',
        appliedActivityFilter: '.a-tag .bwf-text-overflow-ellipsis',
        authorCloseButton: '.d-icon-cross[aria-label="Clear Author"]',
        imgPersonProfilePopUp: '.person-image img[src]',
        namePersonProfilePopUp: '.popup-info .popup-person',
        companyPersonProfilePopUp: '.popup-info .popup-organization',
        emailPersonProfilePopUp: '.popup-info .popup-email',
        phoneNumberPersonProfilePopUp: '.popup-info .popup-phone-number',
        attachmentLink: '.bwf-attachment-button button',
        emailReply: '.bwf-button-link[aria-label="Reply"]',
        emailReplyAll: '.bwf-button-link[aria-label="Reply All"]',
        dwpRatingText: 'bwf-activity-dwp-survey .activity-title',
        dwpSurveyText: '.dwp-answer strong, .dwp-answer div, .dwp-answer',
        viewSurveyBtn: '.dwp-survey-list button',
        dwpQuestions: '.list-of-questions strong',
        dwpAnswers: '.dwp-survey-details .types-of-answers',
        closeButton: '.dp-footer button',
        dwpIcon: 'bwf-activity-dwp-survey .activity__icon',
        dwpFeedback: '.dp-content .dwp-comment',
        logItems: '.activity  .activity__body',
        AttachedfileName: '.activity__wrapper .bwf-attachment-container__file-name',
        refreshButton: '.bwf-button-link[aria-label="Refresh"]',
        attachmentField: '.attachment-button input[type="file"]',
        showMoreEmailActivity: '.activity__wrapper button[aria-label="Show more"]',
        expandAllAttachmentActivity: '.activity__wrapper .d-icon-plus',
        allTaskActivity: 'div.activity__body div',
        taskActivity: '.fields .value',
        showMoreLink: 'button[aria-label="Show more"]',
        emailBodyImage: '.email-body img',
        publicCheckbox: '.checkbox__label input',
        logTitle: '.activity-title',
        showLessLink: 'button[aria-label="Show less"]',
        showMoreLinkForAttachment: '.rx-attachment-show-text[aria-label="Show more attachments"]',
        showLessLinkForAttachment: '.activity__wrapper .flex-wrap button span',
        lockIcon: '.d-icon-lock',
        activityLogList: '.activity .activity__wrapper',
        linkIcon: '.cke_toolbar .cke_button__link_icon',
        boldIcon: '.cke_button__bold_icon',
        italicIcon: '.cke_button__italic_icon',
        underLineIcon: '.cke_button__underline_icon',
        leftAlignIcon: '.cke_button__justifyleft_icon',
        centerAlignIcon: '.cke_button__justifycenter_icon',
        rightAlignIcon: '.cke_button__justifyright_icon',
        colorIcon: '.cke_button__textcolor',
        numberIcon: '.cke_button__numberedlist_icon',
        bulletIcon: '.cke_button__bulletedlist_icon',
        addNotePublicCheckBoxToolTip: '.d-icon-question_circle_o',
        maximizeMinimizeicon: '.cke_button__maximize_icon',
        maximizeMinimizeWindow: '.cke_button__maximize',
        boldTextCkEditorTextArea: '.cke_enable_context_menu strong',
        italicTextCkEditorTextArea: '.cke_enable_context_menu em',
        underlineTextCkEditorTextArea: '.cke_enable_context_menu u',
        colorTextCkEditorTextArea: '.cke_enable_context_menu span',
        alignmentTextCkEditorTextArea: '.cke_enable_context_menu',
        numberListCkEditorTextArea: '.cke_enable_context_menu ol li',
        bulletListTextCkEditorTextArea: '.cke_enable_context_menu ul li',
        linkTextCkEditorTextArea: '.cke_enable_context_menu a',
        activityLogBody: '.activity__wrapper .collapse-block div div[style="position: relative;"]',
        showApproversLink: '.activity__wrapper button.btn-sm',
        alertTooltipMessage: '.alert-content',
        alertTooltipIcon: '.d-icon-info_circle',
        rightAlign: 'p[style="text-align: right;"],div[style="text-align: right;"]'
    }

    async isLockIconDisplayedInActivity(activityNumber: number): Promise<boolean> {
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.lockIcon).isPresent().then(async (result) => {
            if (result) return await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.lockIcon).isDisplayed();
            else return false;
        });
    }

    async isTitleTextDisplayedInActivity(caseActivityLogTitleText: string, activityNumber: number): Promise<boolean> {
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.logTitle).isPresent().then(async (result) => {
            if (result) {
                let logtitleText = await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.logTitle).getText();
                return logtitleText.includes(caseActivityLogTitleText);
            }
            else return false;
        });
    }

    async isBodyDisplayedInActivity(caseActivityLogTitleText: string, activityNumber: number): Promise<boolean> {
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).element(by.cssContainingText('.activity__body', caseActivityLogTitleText)).isDisplayed();
    }

    async isAddNoteTextDisplayedInActivity(bodyText: string, activityNumber: number): Promise<boolean> {
        let getTextmsg = await $$('.activity__wrapper .collapse-block div div[style="position: relative;"]').get(activityNumber - 1).getText();
        if (getTextmsg.trim().includes(bodyText)) {
            return true;
        } else return false;
    }

    async isLogIconDisplayedInActivity(iconName: string, activityNumber: number): Promise<boolean> {
        switch (iconName) {
            case "note_pencil": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-note_pencil').isDisplayed();
                break;
            }

            case "pencil": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-pencil').isDisplayed();
                break;
            }

            case "comments": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-comments').isDisplayed();
                break;
            }

            case "unflag": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-flag_o').isDisplayed();
                break;
            }

            case "flag": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-flag').isDisplayed();
                break;
            }

            case "filePlus": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-file_plus_o').isPresent();
            }

            case "arrow_exclamation_circle": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-list_arrow_exclamation_circle').isPresent();
            }

            case "squares_arrows": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-squares_arrows').isPresent();
                break;
            }

            case "files_change": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-files_change_o').isPresent();
            }

            case "check_circle": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-check_circle').isPresent();
            }

            case "right-refresh": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-right-refresh').isPresent();
            }

            case "arrow_squares": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-arrow_squares').isPresent();
            }

            case "envelope": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-envelope_o').isPresent();
            }

            case "lock_shield": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-lock_shield').isPresent();
            }

            default: {
                console.log('No such a match');
                break;
            }
        }
    }

    async clickShowMoreLinkInActivity(activityNumber: number): Promise<boolean> {
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.showMoreLink).isPresent().then(async (link) => {
            if (link) {
                await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.showMoreLink).click();
                return true;
            } else return false;
        });
    }

    async clickShowLessLinkInActivity(activityNumber: number): Promise<boolean> {
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.showLessLink).isDisplayed().then(async (link) => {
            if (link) {
                await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.showLessLink).click();
                return true;
            } else return false;
        });
    }

    async clickShowMoreLinkInAttachmentActivity(activityNumber: number): Promise<boolean> {
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.flex-wrap button span').isPresent().then(async (link) => {
            if (link) {
                let showMoreTextName = await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.flex-wrap button span').getText();
                if (showMoreTextName.trim().includes('more')) {
                    await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.flex-wrap button').click();
                    return true;
                }
            } else return false;
        });
    }

    async clickShowLessLinkInAttachmentActivity(activityNumber: number): Promise<boolean> {
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.showLessLinkForAttachment).isPresent().then(async (link) => {
            if (link) {
                let showLessTextName = await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.showLessLinkForAttachment).getText();
                if (showLessTextName.trim().includes('Show less')) {
                    await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.flex-wrap button').click();
                    return true;
                }
            } else return false;
        });
    }

    async clickOnShowMore(): Promise<void> {
        await $$(this.selectors.showMoreLink).first().click();
    }

    async isImageDisplayedInActivity(value: string): Promise<boolean> {
        let locator = `.activity .email-body img[src='${value}']`;
        let imageIsDisplayed: boolean = await $(locator).isDisplayed();
        return imageIsDisplayed;
    }

    async isLinkDisplayedInActivity(value: string): Promise<boolean> {
        return await $(`a[href='${value}']`).isDisplayed();
    }

    async clickOnHyperlink(value: string): Promise<void> {
        let locator = `.activity .email-body a[href='${value}']`;
        await $(locator).click();
    }

    async getTextOfTD(tabValue: string): Promise<string> {
        let locator = `.activity .email-body table ${tabValue}`;
        return await $$(locator).first().getText();
    }

    async getTextOnActivityTable(rowNumber: number, columnNumber: number): Promise<string> {
        let row = await $$('.activity .email-body table tr').get(rowNumber - 1);
        let cellText = await row.$$('td').get(columnNumber - 1).getText();
        return cellText;
    }

    async getColorFontStyleOfText(rowNumber: number, columnNumber: number, value: string): Promise<string> {
        let row = await $$('.activity .email-body table tr').get(rowNumber - 1);
        let cell = await row.$$('td').get(columnNumber - 1);
        let locator = `span[style='${value}']`;
        return await cell.$(locator).getAttribute('innerHTML');
    }

    async addAttachment(fileToUpload: string[]): Promise<void> {
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        console.log(absPathArray);
        await $(this.selectors.attachmentField).sendKeys(absPathArray.join('\n'));
    }

    async isFileAttachedOnActivity(): Promise<boolean> {
        return $(this.selectors.AttachedfileName).isPresent();
    }

    async isAttachedFileNameDisplayed(fileName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.AttachedfileName, fileName)).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText(this.selectors.AttachedfileName, fileName)).isDisplayed();
            else return false;
        });
    }

    async clickAndDownloadAttachmentFile(fileName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.AttachedfileName, fileName)).click();
    }

    async getTaskActivity(fileName: string): Promise<string> {
        return await element(by.cssContainingText(this.selectors.allTaskActivity, fileName)).getText();
    }

    async getAllTaskActivity(fileName: string): Promise<string> {
        return await (await element(by.cssContainingText(this.selectors.taskActivity, fileName)).getText()).trim();
    }

    async clickOnReply(): Promise<void> {
        await $$(this.selectors.emailReply).first().click();
    }

    async clickOnReplyAll(): Promise<void> {
        await $$(this.selectors.emailReplyAll).first().click();
    }

    async getFirstPostContent(): Promise<string> {
        return await $$(this.selectors.logItems).first().getText();
    }

    async isActivityBlank(): Promise<boolean> {
        return !await $(this.selectors.logItems).isPresent();
    }

    async clickOnRefreshButton(): Promise<void> {
        await $(this.selectors.refreshButton).click();
    }

    async getEmailTitle(): Promise<string> {
        let emailTitle = await $$('.activity .activity-title').first().getText();
        return emailTitle;
    }

    async getEmailTemplateDetails(): Promise<string> {
        let templateUsed = await $$('.activity .template').first().getText();
        return templateUsed;
    }

    async getRecipientInTo(): Promise<string> {
        let toRecipient = await $$('.activity .to-list').first().getText();
        return toRecipient;
    }

    async getRecipientInCc(): Promise<string> {
        let ccRecipient = await $$('.activity .cc-list').first().getText();
        return ccRecipient;
    }

    async getEmailSubject(): Promise<string> {
        let subject = await $$('.activity .subject').first().getText();
        return subject;
    }

    async getEmailBody(): Promise<string> {
        let emailBody = await $$('.activity .email-body').first().getText();
        return emailBody;
    }

    async getAttachmentCount(): Promise<number> {
        return await $$(this.selectors.AttachedfileName).count();
    }

    async clickShowMoreForEmailActivity(): Promise<void> {
        await $(this.selectors.showMoreEmailActivity).click();
    }

    async clickPlusIconOnMultipleAttachmentInActivity(): Promise<void> {
        await $(this.selectors.expandAllAttachmentActivity).click();
    }

    async getemailAttachmentFileName(): Promise<string> {
        let fileName = await $(this.selectors.AttachedfileName).getText();
        return fileName;
    }

    async getActivityReplyNotesText(textToMatch: string): Promise<boolean> {
        return await $(this.selectors.emailReply).isPresent().then(async (result) => {
            if (result) return (await $(this.selectors.emailReply).getText()).includes(textToMatch) ? true : false;
            else return false;
        });
    }

    async getActivityReplyAllNotesText(textToMatch: string): Promise<boolean> {
        return await $(this.selectors.emailReplyAll).isPresent().then(async (result) => {
            if (result) return (await $(this.selectors.emailReplyAll).getText()).includes(textToMatch) ? true : false;
            else return false;
        });
    }

    async getApprovalActivityText(textToMatch: string): Promise<boolean> {
        let elem = $('div.d-icon-check_circle + div');
        let value = await elem.getText();
        return value.includes(textToMatch) ? true : false;
    }

    async getApprovalRejectionActivityText(textToMatch: string): Promise<boolean> {
        let elem = $('div.d-icon-cross_circle + div');
        let value = await elem.getText();
        return value.includes(textToMatch) ? true : false;
    }

    async getApprovalErrorActivityText(textToMatch: string): Promise<boolean> {
        let elem = $('.d-icon-exclamation_triangle + div');
        let value = await elem.getText();
        return value.includes(textToMatch) ? true : false;
    }


    async isApprovalActivityDisplayed(textToMatch: string): Promise<boolean> {
        return await element(by.cssContainingText('div.d-icon-check_circle + div', textToMatch)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText('div.d-icon-check_circle + div', textToMatch)).isDisplayed();
        })
    }

    async removeFilterList(): Promise<void> {
        await $$(this.selectors.removeIconFilterList).first().click();
    }

    async isfilterPresent(): Promise<boolean> {
        return await $(this.selectors.appliedActivityFilter).isPresent();
    }

    async isfilterListDisplayed(filterList: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.filterLists, filterList)).isPresent();
    }

    async getTextFromFilterList(filterList: string): Promise<string> {
        return await element(by.cssContainingText(this.selectors.filterLists, filterList)).getText();
    }

    async clickOnNmoreLink(): Promise<void> {
        await $(this.selectors.nMoreButton).click();
    }

    async closeNmoreLink(): Promise<void> {
        await element(by.cssContainingText(this.selectors.activityTab, 'Activity')).click();
    }

    async getTextOfNmoreLink(): Promise<string> {
        return await $(this.selectors.nMoreButton).getText();
    }

    async isFilterPopUpDisplayed(): Promise<string> {
        return await $(this.selectors.FilterPopUp).getAttribute('aria-expanded');
    }

    async clickActivityNoteTextBox(): Promise<void> {
        await $(this.selectors.addNoteBox).click();
        await browser.sleep(1500);
    }

    async addActivityNote(addNoteText: string): Promise<void> {
        let searchBoxdisplay = await $(this.selectors.addNoteBox).isPresent();
        if (searchBoxdisplay == true) {
            await this.clickActivityNoteTextBox();
        }
        await ckEditorOpsPo.updateCKEditor(addNoteText);
    }

    async addPersonInActivityNote(tagPerson: string): Promise<void> {
        await this.addActivityNote(`@${tagPerson}`)
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personPopupCkEditor)), 10000);
        await $$(this.selectors.personPopupCkEditor).first().click();
    }

    async clearActivityNote(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.activityNoteTextArea)), 10000).then(async () => {
            await $(this.selectors.activityNoteTextArea).clear();
        });
    }

    async getPersonCount(tagPerson: string): Promise<number> {
        await this.clickActivityNoteTextBox();
        await this.addActivityNote(tagPerson);
        return await $$(this.selectors.personPopupCkEditor).count();
    }

    async clickOnPostButton(): Promise<void> {
        await $(this.selectors.addNotePostButton).click();
        await utilCommon.waitUntilSpinnerToHide();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.addNoteCancelButton).click();
    }

    async clickOnNotesTemplate(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteNotesTemplate)), 5000);
        await $(this.selectors.addNoteNotesTemplate).click();
    }

    async clickOnFilterButton(): Promise<void> {
        await $(this.selectors.filterButton).click();
    }

    async checkFilterApplyButtonIsDisabledOrEnabled(): Promise<number> {
        return await $$(this.selectors.filterApplyButtonEnableDisabled).count();
    }

    async isApplyFilterButtonEnabled(): Promise<boolean> {
        return await $$(this.selectors.filterApplyBtn).last().isEnabled();
    }

    async getTextTaskFilterOption(filterCheckBox: string): Promise<string> {
        return await element(by.cssContainingText(`${this.selectors.filterCheckbox}[class*='ng']`, filterCheckBox)).getText();
    }

    async isAuthorSearchBoxVisible(): Promise<boolean> {
        return await $(this.selectors.filterAuthor).isDisplayed();
    }

    async getTextOfFilterTaskOptions(filterCheckBoxText: string): Promise<string> {
        return await element(by.cssContainingText(`${this.selectors.filterCheckbox}[class*='ng']`, filterCheckBoxText)).getText();
    }

    async selectFilterCheckBox(filterCheckBoxText: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.filterCheckbox, filterCheckBoxText)).click();
    }

    async applyActivityFilter(filterCheckbox: string): Promise<void> {
        await this.clickOnFilterButton();
        await this.selectFilterCheckBox(filterCheckbox);
        await this.clickOnFilterApplyButton();
    }

    async addAuthorOnFilter(AuthorName: string): Promise<void> {
        await $(this.selectors.filterAuthor).click();
        await $(this.selectors.filterAuthor).sendKeys(AuthorName);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personPopup)), 8000);
        await $(this.selectors.personPopup).click();
    }

    async clearAuthorSearchBoxOnFilter(): Promise<void> {
        await $(this.selectors.filterAuthor).clear();
    }

    async removeAuthorFromFilter(): Promise<void> {
        await $(this.selectors.authorCloseButton).click();
    }

    async isAuthorBoxEmpty(): Promise<boolean> {
        return await $(this.selectors.filterAuthor).getAttribute('value') == "" ? true : false;
    }

    async searchAuthorOnFilter(AuthorName: string): Promise<void> {
        await $(this.selectors.filterAuthor).click();
        await $(this.selectors.filterAuthor).sendKeys(AuthorName);
    }

    async isImgPresentOnUserPopUp(): Promise<boolean> {
        return await $(this.selectors.imgPersonProfilePopUp).isPresent();
    }
    async isPersonNamePresentOnUserPopUp(personName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.namePersonProfilePopUp, personName)).isPresent();
    }

    async isEmailPresentOnUserPopUp(email: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.emailPersonProfilePopUp, email)).isPresent();
    }

    async isCompanyPresentOnUserPopUp(company: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.companyPersonProfilePopUp, company)).isPresent();
    }

    async isPhoneNumberPresentOnUserPopUp(phoneNumber: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.phoneNumberPersonProfilePopUp, phoneNumber)).isPresent();
    }

    async clickOnFilterApplyButton(): Promise<void> {
        await element(by.cssContainingText(this.selectors.filterPopupApplyOrClearButton, 'Apply')).click();
    }

    async clickOnFilterClearButton(): Promise<void> {
        await element(by.cssContainingText(this.selectors.filterPopupApplyOrClearButton, 'Clear')).click();
    }

    async getTextOfFilterTask(): Promise<string> {
        return await $(this.selectors.filterAuthor).getText();
    }

    async isTextPresentInActivityLog(caseActivityLogText: string): Promise<boolean> {
        let activityValue: string = "";
        let countVal = await $$(this.selectors.activityLog).count();
        for (let i: number = 0; i < countVal; i++) {
            activityValue = activityValue + await $$(this.selectors.activityLog).get(i).getText();
        }
        return await activityValue.includes(caseActivityLogText);
    }

    async isTextPresentInNote(bodyText: string): Promise<boolean> {
        let status: boolean = undefined;
        await browser.wait(this.EC.visibilityOf($$('[class="activity ng-star-inserted"] bwf-activity-general-notes').first()), 3000).then(async () => {
            let activityText = await $$('[class="activity ng-star-inserted"] bwf-activity-general-notes').first();
            let value = await activityText.getText();
            status = value.includes(bodyText) ? true : false;
        }).catch(async () => {
            console.log('Notes is not present');
            status = false;
        });
        return status;
    }

    async getCaseViewCount(TitleText: string): Promise<number> {
        return await (await element.all(by.cssContainingText(this.selectors.logTitle, TitleText))).length;
    }

    async clickOnHyperlinkFromActivity(activityNumber: number, linkText: string): Promise<void> {
        await $$(this.selectors.activityLogList).get(activityNumber - 1).element(by.cssContainingText('.activity__wrapper div a', linkText)).click();
    }

    async scrollToActivity(activityNumber: number): Promise<void> { //Operates on activity scroll bar.
        await browser.executeScript("arguments[0].scrollIntoView();", $$('.activity .activity__wrapper').get(activityNumber - 1).getWebElement());
    }

    async isHyperlinkOfActivityDisplay(bodyText: string, authorText: string): Promise<boolean> {
        let bodyTextActivityElement: ElementFinder[] = await $$('.activity__wrapper .collapse-block div');
        for (let i = 0; i < bodyTextActivityElement.length; i++) {
            let bodyTextActivity = await bodyTextActivityElement[i].getText();
            if (bodyTextActivity.includes(bodyText)) {
                return await element(by.cssContainingText('.activity__wrapper .collapse-block div a', authorText)).isPresent().then(async (link) => {
                    if (link) return await element(by.cssContainingText('.activity__wrapper .collapse-block div a', authorText)).isDisplayed();
                    else return false;
                });
            }
        }
    }

    async clickOnAttachLink(): Promise<void> {
        await $(this.selectors.attachmentLink).click();
    }

    async isPersonLinkPresent(): Promise<boolean> {
        return await $(this.selectors.activityLog).isDisplayed();
    }

    async isLinkedTextPresentInBodyOfFirstActivity(value: string): Promise<boolean> {
        return await element(by.cssContainingText('.activity__wrapper .collapse-block div a', value)).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText('.activity__wrapper .collapse-block div a', value)).isDisplayed();
            else return false;
        });
    }

    async openSurveyReport(): Promise<void> {
        await $(this.selectors.viewSurveyBtn).click();
    }

    async isViewSurveyInformationLinkPresent(): Promise<boolean> {
        return await $(this.selectors.viewSurveyBtn).isPresent();
    }

    async getAllSurveyTextOnActivityTab(): Promise<string> {
        let allText: number = await $$(this.selectors.dwpSurveyText).count();
        let dwpActivityText = "";
        for (let i: number = 0; i < allText; i++) {
            let ele = await $$(this.selectors.dwpSurveyText).get(i);
            dwpActivityText = dwpActivityText + await ele.getText();
        }
        return dwpActivityText;
    }

    async getRatingTextOnActivityTab(): Promise<string> {
        return await $(this.selectors.dwpRatingText).getText();
    }


    async getSurveyQuestionTextOnSurveyInfo(index: number): Promise<string> {
        let question = await $$(this.selectors.dwpQuestions).get(index - 1);
        return await question.getText();
    }

    async getSurveyAnswerTextOnSurveyInfo(index: number): Promise<string> {
        let answer = await $$(this.selectors.dwpAnswers).get(index - 1);
        return await answer.getText();
    }

    async closeSurveyInformation(): Promise<void> {
        await $(this.selectors.closeButton).click();
    }

    async getComplexSurveyModalTitle(): Promise<string> {
        return await $('.dp-title').getText();
    }

    async getRatingText(): Promise<string> {
        return await $('.dwp-survey-details .activity-title').getText();
    }

    async getDWPIconClassAttribute(): Promise<string> {
        return await $(this.selectors.dwpIcon).getAttribute("class");
    }

    async getDWPFeedback(): Promise<string> {
        return await $(this.selectors.dwpFeedback).getText();
    }

    async isOnlySurveyRecordFiltered(): Promise<boolean> {
        return await $$(this.selectors.logItems).count() === 1;
    }

    async isComplexSurveyOrderIsThird(): Promise<boolean> {
        let activityLog = await $$('[rx-view-component-id="76b9d8a2-54ef-4b24-a086-fc6ff745449d"] .activity__body').get(2);
        let textValue = await activityLog.getText();
        return textValue.includes('View Survey Information');
    }

    async clickAttachedFile(fileName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.AttachedfileName, fileName)).click();
    }

    async getCountAttachedFiles(fileName: string): Promise<number> {
        return await element.all(by.cssContainingText(this.selectors.AttachedfileName, fileName)).count();
    }

    async clickPublicCheckbox(): Promise<void> {
        await element(by.css(this.selectors.publicCheckbox)).click();
    }

    async isAttachmentInActivity(bodyText: string): Promise<boolean> {
        let attachmentText = await $$('.activity .pt-2 .bwf-attachment-container__file-name').first();
        let value = await attachmentText.getText();
        return value.includes(bodyText) ? true : false;
    }

    async clickMaximizeMinimizeIcon(): Promise<void> {
        await $(this.selectors.maximizeMinimizeicon).click();
    }

    async isPublicCheckBoxToolTipIconDisplayed(): Promise<boolean> {
        return await $(this.selectors.addNotePublicCheckBoxToolTip).isPresent().then(async (link) => {
            if (link) return await $(this.selectors.addNotePublicCheckBoxToolTip).isDisplayed();
            else return false;
        });
    }

    async clickOnLinkIcon(): Promise<void> {
        await $(this.selectors.linkIcon).click();
        await browser.sleep(2000);
    }

    async clickOnBoldIcon(): Promise<void> {
        await $(this.selectors.boldIcon).click();
    }

    async clickOnItalicIcon(): Promise<void> {
        await $(this.selectors.italicIcon).click();
    }

    async clickOnUnderLineIcon(): Promise<void> {
        await $(this.selectors.underLineIcon).click();
    }

    async clickOnLeftAlignIcon(): Promise<void> {
        await $(this.selectors.leftAlignIcon).click();
    }

    async clickOnRightAlignIcon(): Promise<void> {
        await $(this.selectors.rightAlignIcon).click();
    }

    async clickOnCenterAlignIcon(): Promise<void> {
        await $(this.selectors.centerAlignIcon).click();
    }

    async setInsertRemoveNumberList(value: string): Promise<void> {
        await $(this.selectors.activityNoteTextArea).sendKeys(Key.CONTROL, Key.END);
        await $(this.selectors.activityNoteTextArea).sendKeys(Key.ENTER);
        await $(this.selectors.numberIcon).click();
        await $(this.selectors.activityNoteTextArea).sendKeys(value);
    }

    async setInsertRemoveBulletedList(value: string): Promise<void> {
        await $(this.selectors.activityNoteTextArea).sendKeys(Key.CONTROL, Key.END);
        await $(this.selectors.activityNoteTextArea).sendKeys(Key.ENTER);
        await $(this.selectors.bulletIcon).click();
        await $(this.selectors.activityNoteTextArea).sendKeys(value);
    }

    async selectColor(colorValue: string): Promise<void> {
        await $(this.selectors.colorIcon).click();
        await browser.waitForAngularEnabled(false);
        await browser.switchTo().frame(await $('iframe.cke_panel_frame').getWebElement());
        let locator: string = `a[title="${colorValue}"]`;
        await browser.wait(this.EC.elementToBeClickable($(locator)), 2000);
        await $(locator).click();
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
    }

    async getTextCkEditorTextArea(): Promise<string> {
        return await $(this.selectors.activityNoteTextArea).getText();
    }

    async isCkEditorDisplayed(): Promise<boolean> {
        return await $(this.selectors.activityNoteTextArea).isPresent().then(async (link) => {
            if (link) return await $(this.selectors.activityNoteTextArea).isDisplayed();
            else return false;
        });
    }

    async isBoldTextDisplayedInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.boldTextCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText(this.selectors.boldTextCkEditorTextArea, bodyText)).isDisplayed();
            else return false;
        });
    }

    async isItalicTextDisplayedInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.italicTextCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText(this.selectors.italicTextCkEditorTextArea, bodyText)).isDisplayed();
            else return false;
        });
    }

    async isUnderlineTextDisplayedInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return await element.all(by.cssContainingText(this.selectors.underlineTextCkEditorTextArea, bodyText)).get(0).isPresent().then(async (link) => {
            if (link) return await element.all(by.cssContainingText(this.selectors.underlineTextCkEditorTextArea, bodyText)).get(0).isDisplayed();
            else return false;
        });
    }

    async isColorTextDisplayedInCkEditorTextArea(colorCode: string, bodyText: string): Promise<boolean> {
        return await $(`.cke_enable_context_menu span[style="${colorCode}"]`).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText(this.selectors.colorTextCkEditorTextArea, bodyText)).isDisplayed();
            else return false;
        });
    }

    async isTextLeftAlignInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.alignmentTextCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText(this.selectors.alignmentTextCkEditorTextArea, bodyText)).isDisplayed();
            else return false;
        });
    }

    async isTextRightAlignInCkEditorTextArea(bodyText: string): Promise<boolean> {
        let rightAlignmentElement = await $(this.selectors.alignmentTextCkEditorTextArea).$('div[style="text-align: right;"]');
        return await ckEditorOpsPo.isTextRightAlignInCkEditorTextArea(bodyText, rightAlignmentElement);
    }

    async isTextCenterAlignInCkEditorTextArea(bodyText: string): Promise<boolean> {
        let centerAlignmentElement = await $(this.selectors.alignmentTextCkEditorTextArea).$('div[style="text-align: center;"]');
        return await ckEditorOpsPo.isTextCenterAlignInCkEditorTextArea(bodyText, centerAlignmentElement);
    }

    async isNumberListDisplayedInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.numberListCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText(this.selectors.numberListCkEditorTextArea, bodyText)).isDisplayed();
            else return false;
        });
    }

    async isBulletListDisplayedInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.bulletListTextCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText(this.selectors.bulletListTextCkEditorTextArea, bodyText)).isDisplayed();
            else return false;
        });
    }

    async isLinkDisplayedInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.linkTextCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) return await element(by.cssContainingText(this.selectors.linkTextCkEditorTextArea, bodyText)).isDisplayed();
            else return false;
        });
    }

    async getTextCkEditorMinimizeOrMiximize(): Promise<string> {
        return await $(this.selectors.maximizeMinimizeWindow).getAttribute('title');
    }


    async isBoldTextDisplayedInActivity(bodyText: string, activityNumber: number): Promise<boolean> {
        let getTextmsg = await $$(this.selectors.activityLogBody).get(activityNumber - 1).$('strong').getText();
        if (getTextmsg.trim().includes(bodyText)) {
            return true;
        } else return false;
    }

    async isItalicTextDisplayedInActivity(bodyText: string, activityNumber: number): Promise<boolean> {
        let getTextmsg = await $$(this.selectors.activityLogBody).get(activityNumber - 1).$('em').getText();
        if (getTextmsg.trim().includes(bodyText)) {
            return true;
        } else return false;
    }

    async isUnderlineTextDisplayedInActivity(bodyText: string, activityNumber: number): Promise<boolean> {
        let getTextmsg = await $$(this.selectors.activityLogBody).get(activityNumber - 1).$('u').getText();
        if (getTextmsg.trim().includes(bodyText)) {
            return true;
        } else return false;
    }

    async isColorTextDisplayedInActivity(colorCode: string, bodyText: string, activityNumber: number): Promise<boolean> {
        let getTextmsg = await $$(this.selectors.activityLogBody).get(activityNumber - 1).$(`span[style="${colorCode}"]`).getText();
        if (getTextmsg.trim().includes(bodyText)) {
            return true;
        } else return false;
    }

    async isLeftAlignTextDisplayedInActivity(bodyText: string, activityNumber: number): Promise<boolean> {
        let getTextmsg = await $$(this.selectors.activityLogBody).get(activityNumber - 1).$('div').getText();
        if (getTextmsg.trim().includes(bodyText)) {
            return true;
        } else return false;
    }

    async isRightAlignTextDisplayedInActivity(bodyText: string, activityNumber: number): Promise<boolean> {
        let getTextmsg = await $$(this.selectors.activityLogBody).get(activityNumber - 1).$(this.selectors.rightAlign).getText();
        if (getTextmsg.trim().includes(bodyText)) {
            return true;
        } else return false;
    }

    async isCenterAlignTextDisplayedInActivity(bodyText: string, activityNumber: number): Promise<boolean> {
        let getTextmsg = await $$(this.selectors.activityLogBody).get(activityNumber - 1).$('div[style="text-align: center;"]').getText();
        if (getTextmsg.trim().includes(bodyText)) {
            return true;
        } else return false;
    }

    async isNumberListTextDisplayedInActivity(bodyText: string, activityNumber: number): Promise<boolean> {
        let getTextmsg = await $$(this.selectors.activityLogBody).get(activityNumber - 1).$$('ol li').first().getText();
        if (getTextmsg.trim().includes(bodyText)) {
            return true;
        } else return false;
    }

    async isBulletListTextDisplayedInActivity(bodyText: string, activityNumber: number): Promise<boolean> {
        let getTextmsg = await $$(this.selectors.activityLogBody).get(activityNumber - 1).$$('ul li').first().getText();
        if (getTextmsg.trim().includes(bodyText)) {
            return true;
        } else return false;
    }

    async isHyperLinkLTextDisplayedInActivity(httpHyperlink: string, linkText: string, activityNumber: number): Promise<boolean> {
        return await $$(this.selectors.activityLogBody).get(activityNumber - 1).$(`a[href="${httpHyperlink}"]`).isPresent().then(async (link) => {
            if (link) {
                let getTextlink = await $$(this.selectors.activityLogBody).get(activityNumber - 1).$(`a[href="${httpHyperlink}"]`).getText();
                return getTextlink.trim().includes(linkText);
            } else return false;
        });
    }

    async isNoteTemplateLinkDisplayedInCkEditor(notesTemplateText: string, activityNumber: number): Promise<boolean> {
        return await $$(this.selectors.activityNoteTextArea).get(activityNumber - 1).$('a').isPresent().then(async (link) => {
            if (link) {
                let getTextNotesTemplate = await $$(this.selectors.activityNoteTextArea).get(activityNumber - 1).$$('p').first().getText();
                return getTextNotesTemplate.trim().includes(notesTemplateText)
            } else return false;
        });
    }

    async clickShowApproversLink(showApproversLinkLabel: string): Promise<void> {
        await $(this.selectors.showApproversLink).click();
    }

    async getGrantedReadAccessCount(accessName: string): Promise<number> {
        return await element.all(by.cssContainingText(this.selectors.activityLog, accessName)).count();
    }

    async getRevokedReadAccessCount(accessName: string): Promise<number> {
        return await element.all(by.cssContainingText('.activity__body .fields span', accessName)).count();
    }


    async isTableSummaryDisplayedInCkEditorTextArea(tableSummary: string): Promise<boolean> {
        let locator = `table[summary='${tableSummary}']`;
        return await element(by.css(locator)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.css(locator)).isDisplayed();
            } else return false;
        });
    }

    async isTableCaptionDisplayedInCkEditorTextArea(tableSummary: string, tableCaption: string): Promise<boolean> {
        let locator = `table[summary='${tableSummary}'] caption`;
        return await element(by.css(locator)).isPresent().then(async (result) => {
            if (result) {
                let tableCaptionText = await element(by.css(locator)).getText();
                return tableCaptionText.includes(tableCaption);
            }
            else return false;
        });
    }

    async isCKImageDisplayedInActivity(value: string): Promise<boolean> {
        let locator = `.activity img[src='${value}']`;
        let imageIsDisplayed: boolean = await $(locator).isDisplayed();
        return imageIsDisplayed;
    }

    async getInfoTooltipMessage(): Promise<string> {
        return await $(this.selectors.alertTooltipMessage).getText();
    }

    async isInfoTooltipIconDisplayed(): Promise<boolean> {
        return await $(this.selectors.alertTooltipIcon).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.alertTooltipIcon).isDisplayed();
            else return false;
        })
    }
}

export default new ActivityTabPage();