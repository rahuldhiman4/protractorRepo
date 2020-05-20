import { resolve } from "path";
import { $, $$, browser, by, element, ElementFinder, Key, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class ActivityTabPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        activityNoteCKEditor: 'bwf-rich-text-editor[style="display: block;"]',
        activityNoteTextArea: '.cke_enable_context_menu',
        addNoteBox: '.textfield__wrapper .form-control[placeholder="Add a note"]',
        personPopup: '.dropdown-menu .popup-template',
        personPopupCkEditor: '.cke_autocomplete_panel li',
        addNotePostButton: '.activity-feed-note-buttons__right .btn-primary',
        addNoteCancelButton: '.activity-feed-note-buttons__right .btn-secondary',
        addNoteNotesTemplate: '.activity-note .d-icon-note_pencil',
        activityLog: '.activity__body .activity-title, .activity__body [style="position: relative;"], .activity__body .field, .activity__body .value',
        filterButton: '.d-icon-filter',
        filterCheckbox: '.checkbox__label span',
        filterAuthor: '.dropdown input[placeholder="Enter name, email, or login ID"]',
        filterPopupApplyOrClearButton: '.filter-options button span',
        FilterPopUp: '.bwf-activity-log-filter button[aria-expanded]',
        filterApplyButtonEnableDisabled: '.filter-options button[disabled="disabled"]',
        filterLists: '.a-tag-active .bwf-text-overflow-ellipsis',
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
        refreshButton: '.tab-content .bwf-button-link[aria-label="Refresh"]',
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
        alignmentTextCkEditorTextArea: '.cke_enable_context_menu div',
        numberListCkEditorTextArea: '.cke_enable_context_menu ol li',
        bulletListTextCkEditorTextArea: '.cke_enable_context_menu ul li',
        linkTextCkEditorTextArea: '.cke_enable_context_menu a',
    }

    async isLockIconDisplayedInActivity(activityNumber: number): Promise<boolean> {
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.lockIcon).isDisplayed().then(async (result) => {
            if (result) return true;
            else return false;
        });
    }

    async isTitleTextDisplayedInActivity(caseActivityLogTitleText: string, activityNumber: number): Promise<boolean> {
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).element(by.cssContainingText(this.selectors.logTitle, caseActivityLogTitleText)).isDisplayed().then(async (result) => {
            if (result) return true;
            else return false;
        });
    }

    async isBodyDisplayedInActivity(caseActivityLogTitleText: string, activityNumber: number): Promise<boolean> {
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).element(by.cssContainingText('.body', caseActivityLogTitleText)).isDisplayed().then(async (result) => {
            if (result) return true;
            else return false;
        });
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
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-note_pencil').isDisplayed().then(async (result) => {
                    if (result) return true;
                    else return false;
                });
                break;
            }

            case "pencil": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-pencil').isDisplayed().then(async (result) => {
                    if (result) return true;
                    else return false;
                });
                break;
            }

            case "comments": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-comments').isDisplayed().then(async (result) => {
                    if (result) return true;
                    else return false;
                });
                break;
            }

            case "unflag": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.d-icon-flag_o').isDisplayed().then(async (result) => {
                    if (result) return true;
                    else return false;
                });
                break;
            }

            case "flag": {
                return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('d-icon-flag').isDisplayed().then(async (result) => {
                    if (result) return true;
                    else return false;
                });
                break;
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
            if (link) {
                await element(by.cssContainingText(this.selectors.AttachedfileName, fileName)).isDisplayed();
                return true;
            } else return false;
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
        //        await utilCommon.waitUntilSpinnerToHide();
        // await element(by.xpath("(//div[contains(@class,'d-icon-reply')])[1]")).click();
        await $$(this.selectors.emailReply).first().click();
    }

    async clickOnReplyAll(): Promise<void> {
        await $$(this.selectors.emailReplyAll).first().click();
    }

    async getFirstPostContent(): Promise<string> {
        //        await utilCommon.waitUntilSpinnerToHide();
        return await $$(this.selectors.logItems).first().getText();
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
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailAttachmentFileName)), 5000);
        let fileName = await $(this.selectors.AttachedfileName).getText();
        return fileName;
    }

    async getActivityNotesText(textToMatch: string): Promise<boolean> {
        var elem = element(by.xpath("//div[contains(@class,'d-icon-note_pencil')]/following-sibling::div"));
        //        browser.wait(this.EC.elementToBeClickable(elem));
        var value = await elem.getText();
        //        await utilCommon.waitUntilSpinnerToHide();
        return value.includes(textToMatch) ? true : false;

    }

    async removeFilterList(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.removeIconFilterList)));
        await $(this.selectors.removeIconFilterList).click();
    }

    async isfilterPresent(): Promise<boolean> {
        return await $(this.selectors.appliedActivityFilter).isPresent();
    }

    async isfilterListDisplayed(filterList: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterLists)));
        return await element(by.cssContainingText(this.selectors.filterLists, filterList)).isPresent();
    }

    async getTextFromFilterList(filterList: string): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterLists)));
        return await element(by.cssContainingText(this.selectors.filterLists, filterList)).getText();
    }

    async clickOnNmoreLink(): Promise<void> {
        //        await browser.sleep(1000);
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.nMoreButton)));
        await $(this.selectors.nMoreButton).click();
    }

    async closeNmoreLink(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.activityTab)));
        await element(by.cssContainingText(this.selectors.activityTab, 'Activity')).click();
        //        utilCommon.waitUntilSpinnerToHide();
    }

    async getTextOfNmoreLink(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.nMoreButton)));
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
        await $(this.selectors.activityNoteCKEditor).isPresent().then(async (result) => {
            if (result) {
                await browser.wait(this.EC.elementToBeClickable($(this.selectors.activityNoteTextArea)), 10000).then(async () => {
                    await $(this.selectors.activityNoteTextArea).sendKeys(addNoteText);
                });
            }
        });
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
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNotePostButton)));
        await $(this.selectors.addNotePostButton).click();
        await utilCommon.waitUntilSpinnerToHide();
    }

    async clickOnCancelButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteCancelButton)));
        await $(this.selectors.addNoteCancelButton).click();
    }

    async clickOnNotesTemplate(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteNotesTemplate)));
        await $(this.selectors.addNoteNotesTemplate).click();
    }

    async clickOnFilterButton(): Promise<void> {
        //        await browser.sleep(5000);
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterButton)));
        await $(this.selectors.filterButton).click();
    }

    async checkFilterApplyButtonIsDisabledOrEnabled(): Promise<number> {
        return await $$(this.selectors.filterApplyButtonEnableDisabled).count();
    }

    async getTextTaskFilterOption(filterCheckBox: string): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterCheckbox)));
        return await element(by.cssContainingText(`${this.selectors.filterCheckbox}[class*='ng']`, filterCheckBox)).getText();
    }

    async isAuthorSearchBoxVisible(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterAuthor)));
        return $(this.selectors.filterAuthor).isDisplayed();
    }

    async getTextOfFilterTaskOptions(filterCheckBoxText: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.filterCheckbox)));
        return await element(by.cssContainingText(`${this.selectors.filterCheckbox}[class*='ng']`, filterCheckBoxText)).getText();
    }

    async selectFilterCheckBox(filterCheckBoxText: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterCheckbox)));
        await element(by.cssContainingText(this.selectors.filterCheckbox, filterCheckBoxText)).click();
    }

    async addAuthorOnFilter(AuthorName: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterAuthor)));
        await $(this.selectors.filterAuthor).click();
        await $(this.selectors.filterAuthor).sendKeys(AuthorName);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personPopup)), 3000);
        await $(this.selectors.personPopup).click();
    }

    async clearAuthorSearchBoxOnFilter(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterAuthor)));
        await $(this.selectors.filterAuthor).clear();
    }

    async removeAuthorFromFilter(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.authorCloseButton)));
        await $(this.selectors.authorCloseButton).click();
    }

    async isAuthorBoxEmpty(): Promise<boolean> {
        return await $(this.selectors.filterAuthor).getAttribute('value') == "" ? true : false;

    }

    async searchAuthorOnFilter(AuthorName: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterAuthor)));
        await $(this.selectors.filterAuthor).click();
        await $(this.selectors.filterAuthor).sendKeys(AuthorName);
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personPopup)));
    }

    async isImgPresentOnUserPopUp(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.imgPersonProfilePopUp)));
        return await $(this.selectors.imgPersonProfilePopUp).isPresent();
    }
    async isPersonNamePresentOnUserPopUp(personName: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.namePersonProfilePopUp)));
        return await element(by.cssContainingText(this.selectors.namePersonProfilePopUp, personName)).isPresent();
    }

    async isEmailPresentOnUserPopUp(email: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailPersonProfilePopUp)));
        return await element(by.cssContainingText(this.selectors.emailPersonProfilePopUp, email)).isPresent();
    }

    async isCompanyPresentOnUserPopUp(company: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.companyPersonProfilePopUp)));
        return await element(by.cssContainingText(this.selectors.companyPersonProfilePopUp, company)).isPresent();
    }

    async isPhoneNumberPresentOnUserPopUp(phoneNumber: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.phoneNumberPersonProfilePopUp)));
        return await element(by.cssContainingText(this.selectors.phoneNumberPersonProfilePopUp, phoneNumber)).isPresent();
    }

    async clickOnFilterApplyButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterPopupApplyOrClearButton)));
        await element(by.cssContainingText(this.selectors.filterPopupApplyOrClearButton, 'Apply')).click();
        //        utilCommon.waitUntilSpinnerToHide();
    }

    async clickOnFilterClearButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterPopupApplyOrClearButton)));
        await element(by.cssContainingText(this.selectors.filterPopupApplyOrClearButton, 'Clear')).click();
        //        await browser.wait(this.EC.or(async () => {
        //            await $$(this.selectors.appliedActivityFilter).count() == 0;
        //        }));
    }

    async getTextOfFilterTask(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.FilterTask)));
        return await $(this.selectors.filterAuthor).getText();
    }

    async isTextPresentInActivityLog(caseActivityLogText: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterButton)));
        let activityValue: string = "";
        let countVal = await $$(this.selectors.activityLog).count();
        for (let i: number = 0; i < countVal; i++) {
            activityValue = activityValue + await $$(this.selectors.activityLog).get(i).getText();
        }
        return await activityValue.includes(caseActivityLogText);
    }

    async isTextPresentInNote(bodyText: string): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($$('[class="activity ng-star-inserted"] bwf-activity-general-notes').first()), 3000)
            .catch(async () => {
                console.log('Notes is not present');
                return false;
            });
        let activityText = await $$('[class="activity ng-star-inserted"] bwf-activity-general-notes').first();
        let value = await activityText.getText();
        return value.includes(bodyText) ? true : false;
    }

    async getCaseViewCount(TitleText: string): Promise<number> {
        return await (await element.all(by.cssContainingText(this.selectors.logTitle, TitleText))).length;
    }

    async clickOnHyperlinkFromActivity(activityNumber: number, linkText: string): Promise<void> {
        await $$(this.selectors.activityLogList).get(activityNumber - 1).element(by.cssContainingText('.activity__wrapper div a', linkText)).click();
    }

    async isHyperlinkOfActivityDisplay(bodyText: string, authorText: string): Promise<boolean> {
        let bodyTextActivityElement: ElementFinder[] = await $$('.activity__wrapper .collapse-block div');
        for (let i = 0; i < bodyTextActivityElement.length; i++) {
            let bodyTextActivity = await bodyTextActivityElement[i].getText();
            if (bodyTextActivity.includes(bodyText)) {
                return await element(by.cssContainingText('.activity__wrapper .collapse-block div a', authorText)).isPresent().then(async (link) => {
                    if (link) {
                        return await element(by.cssContainingText('.activity__wrapper .collapse-block div a', authorText)).isDisplayed();
                    } else return false;
                });
            }
        }
    }

    async clickOnAttachLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachmentLink)));
        await $(this.selectors.attachmentLink).click();
    }

    async isPersonLinkPresent(): Promise<boolean> {
        return await $(this.selectors.activityLog).isDisplayed();
    }

    async isLinkedTextPresentInBodyOfFirstActivity(value: string): Promise<boolean> {
        return await element(by.cssContainingText('.activity__wrapper .collapse-block div a', value)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText('.activity__wrapper .collapse-block div a', value)).isDisplayed();
            } else return false;
        });
    }

    async openSurveyReport(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.viewSurveyBtn)));
        await $(this.selectors.viewSurveyBtn).click();
    }

    async isViewSurveyInformationLinkPresent(): Promise<boolean> {
        return await $(this.selectors.viewSurveyBtn).isPresent();
    }

    async getAllSurveyTextOnActivityTab(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.dwpSurveyText)));
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
        let question = $$(this.selectors.dwpQuestions).get(index - 1);
        //        await browser.wait(this.EC.visibilityOf(question));
        return await question.getText();
    }

    async getSurveyAnswerTextOnSurveyInfo(index: number): Promise<string> {
        let answer = $$(this.selectors.dwpAnswers).get(index - 1);
        //        await browser.wait(this.EC.visibilityOf(answer));
        return await answer.getText();
    }

    async closeSurveyInformation(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.closeButton)));
        await $(this.selectors.closeButton).click();
        //        await browser.wait(this.EC.invisibilityOf($('.modal-dialog')));
    }

    async getComplexSurveyModalTitle(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($('.modal-title')));
        return await $('.dp-title').getText();
    }

    async getRatingText(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($('.rating')));
        return await $('.dwp-survey-details .activity-title').getText();
    }

    async getDWPIconClassAttribute(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.dwpIcon)));
        return await $(this.selectors.dwpIcon).getAttribute("class");
    }

    async getDWPFeedback(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.dwpFeedback)));
        return await $(this.selectors.dwpFeedback).getText();
    }

    async isOnlySurveyRecordFiltered(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.logItems)));
        return await $$(this.selectors.logItems).count() === 1;
    }

    async isComplexSurveyOrderIsThird(): Promise<boolean> {
        //        await utilCommon.waitUntilSpinnerToHide();
        //        await browser.wait(this.EC.visibilityOf(element(by.xpath("(//div[@class='log-item__content'])[3]//div[text()='View Survey Information']"))));
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
            if (link) {
                await $(this.selectors.addNotePublicCheckBoxToolTip).isDisplayed();
                return true;
            } else return false;
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
        return await $(this.selectors.activityNoteCKEditor).getText();
    }

    async isCkEditorDisplayed(): Promise<boolean> {
        return await $(this.selectors.activityNoteCKEditor).isPresent().then(async (link) => {
            if (link) {
                return await $(this.selectors.activityNoteCKEditor).isDisplayed();
            } else return false;
        });
    }

    async isBoldTextDisplayedInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return element(by.cssContainingText(this.selectors.boldTextCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) {
                return element(by.cssContainingText(this.selectors.boldTextCkEditorTextArea, bodyText)).isDisplayed();
            } else return false;
        });
    }

    async isItalicTextDisplayedInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return element(by.cssContainingText(this.selectors.italicTextCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) {
                return element(by.cssContainingText(this.selectors.italicTextCkEditorTextArea, bodyText)).isDisplayed();
            } else return false;
        });
    }

    async isUnderlineTextDisplayedInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return element(by.cssContainingText(this.selectors.underlineTextCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) {
                return element(by.cssContainingText(this.selectors.underlineTextCkEditorTextArea, bodyText)).isDisplayed();
            } else return false;
        });
    }

    async isColorTextDisplayedInCkEditorTextArea(colorCode: string, bodyText: string): Promise<boolean> {
        return await $(`.cke_enable_context_menu span[style="${colorCode}"]`).isPresent().then(async (link) => {
            if (link) {
                return element(by.cssContainingText(this.selectors.colorTextCkEditorTextArea, bodyText)).isDisplayed();
            } else return false;
        });
    }

    async isTextLeftAlignInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return element(by.cssContainingText(this.selectors.alignmentTextCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) {
                return element(by.cssContainingText(this.selectors.alignmentTextCkEditorTextArea, bodyText)).isDisplayed();
            } else return false;
        });
    }

    async isTextRightAlignInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return element(by.cssContainingText(this.selectors.alignmentTextCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) {
                let colorcodeAttribute = await $(this.selectors.alignmentTextCkEditorTextArea).getAttribute('style') == 'text-align: right;' ? true : false;
                if (colorcodeAttribute == true) {
                    return element(by.cssContainingText(this.selectors.alignmentTextCkEditorTextArea, bodyText)).isDisplayed();
                }
            } else return false;
        });
    }

    async isTextCenterAlignInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return element(by.cssContainingText(this.selectors.alignmentTextCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) {
                let colorcodeAttribute = await $(this.selectors.alignmentTextCkEditorTextArea).getAttribute('style') == 'text-align: center;' ? true : false;
                if (colorcodeAttribute == true) {
                    return element(by.cssContainingText(this.selectors.alignmentTextCkEditorTextArea, bodyText)).isDisplayed();
                }
            } else return false;
        });
    }

    async isNumberListDisplayedInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return element(by.cssContainingText(this.selectors.numberListCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) {
                return element(by.cssContainingText(this.selectors.numberListCkEditorTextArea, bodyText)).isDisplayed();
            } else return false;
        });
    }

    async isBulletListDisplayedInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return element(by.cssContainingText(this.selectors.bulletListTextCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) {
                return element(by.cssContainingText(this.selectors.bulletListTextCkEditorTextArea, bodyText)).isDisplayed();
            } else return false;
        });
    }

    async isLinkDisplayedInCkEditorTextArea(bodyText: string): Promise<boolean> {
        return element(by.cssContainingText(this.selectors.linkTextCkEditorTextArea, bodyText)).isPresent().then(async (link) => {
            if (link) {
                return element(by.cssContainingText(this.selectors.linkTextCkEditorTextArea, bodyText)).isDisplayed();
            } else return false;
        });
    }

    async getTextCkEditorMinimizeOrMiximize(): Promise<string> {
        return await $(this.selectors.maximizeMinimizeWindow).getAttribute('title');
    }
}

export default new ActivityTabPage();