import { resolve } from "path";
import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class ActivityTabPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addNoteBox: 'ux-activity-feed-add-note input[placeholder]',
        addNoteBoxEdit: '.activity-feed-note-text',
        personPopup: '.popup-person',
        addNotePostButton: '.activity-feed-note-buttons__right .d-button.d-button_primary',
        addNoteCancelButton: '.activity-feed-note-buttons__right .d-button_secondary',
        addNoteAttachLink: '.ux-document-library .d-button',
        addNoteNotesTemplate: '.d-button.d-button_link.d-icon-note_pencil.social-attach-template.ac-template-button',
        activityLog: '.log-item__body div[class]',
        personLink: '.title a',
        filterButton: '.d-icon-filter',
        filterCheckbox: '.filter-content-box .d-checkbox__item',
        filterAuthor: '.person-input[placeholder="Enter name, email, or login ID"]',
        filterPopupApplyOrClearButton: '.filter-options .d-button',
        activityText: '[rx-view-component-id="34167059-11d4-4e85-8a58-e501544e2461"] [title="Activity"]',
        FilterTask: '[rx-view-component-id="972e87ef-cfa0-469e-9eda-a5e2d679d9d2"] .d-tag-label',
        FilterPopUp: '.filter-button button',
        filterApplyButtonEnableDisabled: '.filter-options button[disabled="disabled"]',
        filterLists: '.d-tag-label',
        nMoreButton: '.show__more-toggle',
        closeNmoreLink: '.activity-log-filter',
        removeIconFilterList: '.tag-pill-item .d-tag-remove-button',
        activityTab: '.ui-tab-wrapper',
        appliedActivityFilter: '.tag-pill-item',
        authorCloseButton: '.d-textfield__action[aria-hidden="false"]',
        imgPersonProfilePopUp: '.dropdown-menu img[ng-src]',
        namePersonProfilePopUp: '.popup-info .popup-person',
        companyPersonProfilePopUp: '.popup-info .popup-organization',
        emailPersonProfilePopUp: '.popup-info .popup-email',
        phoneNumberPersonProfilePopUp: '.popup-info .popup-phone-number',
        authorFieldEmpty: '.d-textfield__label .ng-not-empty',
        attachmentLink: '.ac-attachment-button',
        emailContent: '.log-item__content email',
        emailAttachmentFileName: '.log-item__content email .rx-attachment-view-name',
        emailReply: '.log-item__content email .d-icon-reply',
        emailReplyAll: '.log-item__content email .d-icon-arrow_u',
        dwpSurveyText: '.dwp_survey .log-item__body div',
        viewSurveyBtn: '.dwp_survey .d-button_link',
        dwpQuestions: '.dwp_question',
        dwpAnswers: '.dwp_answer',
        closeButton: '.modal-dialog button',
        dwpIcon: '.dwp_survey .log-item__icon',
        dwpFeedback: '.rx-content.dwp-comment',
        logItems: '.log-item__body',
        body: '.log-item__body .body',
        AttachedfileName: '.log-item__body .rx-attachment-view-name',
        refreshButton: '.activity-log-wrapper .d-icon-left-refresh',
        attachmentField: '.activity-feed-note-buttons__left input[type="file"]',
        showMoreEmailActivity: '.email .more',
        allTaskActivity: '[rx-view-component-id="972e87ef-cfa0-469e-9eda-a5e2d679d9d2"] .fields .value',
        taskActivity: '.fields .value',
        showMoreLink: '.log-item__content .more',
        emailBodyImage: '.email-body img',
        publicCheckbox: '.activity-feed-note-external .d-checkbox__item',
        logTitle: '.title[ux-bind-html="title"]',
        showLessLink: '.general-notes .less',
        showMoreLinkForAttachment: '.rx-attachment-show-text[aria-label="Show more attachments"]',
        showLessLinkForAttachment: '.rx-attachment-show-text[aria-label="Show less attachments"]',
    }

    async isaddNoteTextDisplayedInFirstActivity(bodyText: string): Promise<boolean> {
        return await $$('.content-wrapper').get(0).element(by.cssContainingText('.activity-general-note', bodyText)).isDisplayed().then(async (result) => {
            if (result) return true;
            else return false;
        });
    }

    async isShowMoreLinkDisplayedForNoteTextInFirstActivity(): Promise<boolean> {
        return await $$('.content-wrapper').get(0).$$(this.selectors.showMoreLink).first().isDisplayed().then(async (result) => {
            if (result) return true;
            else return false;
        });
    }

    async isShowMoreLinkForAttachmentDisplayedInFirstActivity(): Promise<boolean> {
        try {
            let showMoreLink = await $$('.content-wrapper').get(0).$(this.selectors.showMoreLinkForAttachment).isDisplayed()
            if (showMoreLink == true) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    async isShowLessLinkDisplayedForNoteTextInFirstActivity(): Promise<boolean> {
        try {
            let showMoreLink = await $$('.content-wrapper').get(0).$$(this.selectors.showLessLink).first().isDisplayed();
            if (showMoreLink == true) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    async clickOnShowMoreLinkForNoteTextInFirstActivity(): Promise<void> {
        return await $$('.content-wrapper').get(0).$$(this.selectors.showMoreLink).first().click();
    }

    async clickOnShowLessLinkForNoteTextInFirstActivity(): Promise<void> {
        return await $$('.content-wrapper').get(0).$$(this.selectors.showLessLink).first().click();
    }

    async clickOnShowMoreLinkForAttachmentInFirstActivity(): Promise<void> {
        return await $$('.content-wrapper').get(0).$(this.selectors.showMoreLinkForAttachment).click();
    }

    async clickOnShowLessLinkForAttachmentInFirstActivity(): Promise<void> {
        return await $$('.content-wrapper').get(0).$(this.selectors.showLessLinkForAttachment).click();
    }


    async clickOnShowMore(): Promise<void> {
        await $$(this.selectors.showMoreLink).first().click();
    }

    async isImageDisplayedInActivity(value: string): Promise<boolean> {
        return await $(`img[src='${value}']`).isDisplayed();
    }

    async isLinkDisplayedInActivity(value: string): Promise<boolean> {
        return await $(`a[href='${value}']`).isDisplayed();
    }

    async getTextOfAlignment(value: string): Promise<string> {
        return await $(`td[style="${value}"]`).getText();
    }

    async clickOnHyperlink(value: string): Promise<void> {
        let locator = `a[href='${value}']`;
        await $(locator).click();
    }

    async getColorOrFontOfText(value: string): Promise<string> {
        let locator = `td span[style='${value}']`;
        return await $(locator).getText();
    }

    async getTextOfTD(summary: string, tabValue: string): Promise<string> {
        let locator = `[summary='${summary}'] td ${tabValue}`;
        return await $(locator).getText();
    }

    async addAttachment(fileToUpload: string): Promise<void> {
        const absolutePath = resolve(__dirname, fileToUpload);
        console.log(absolutePath);
        await $(this.selectors.attachmentField).sendKeys(absolutePath);
    }

    async isFileAttachedOnActivity(): Promise<boolean> {
        return $(this.selectors.AttachedfileName).isPresent();
    }

    async isAttachedFileNameDisplayed(fileName: string): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.AttachedfileName)), 3000);
        return await element(by.cssContainingText(this.selectors.AttachedfileName, fileName)).isDisplayed().then(async (result) => {
            if (result) return true;
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
        return await element(by.cssContainingText(this.selectors.taskActivity, fileName)).getText();
    }

    async clickOnReply(): Promise<void> {
        //        await utilCommon.waitUntilSpinnerToHide();
        await element(by.xpath("(//div[contains(@class,'d-icon-reply')])[1]")).click();
    }

    async clickOnReplyAll(): Promise<void> {
        //        await utilCommon.waitUntilSpinnerToHide();
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailReplyAll)));
        await $(this.selectors.emailReplyAll).click();
    }

    async getFirstPostContent(): Promise<string> {
        //        await utilCommon.waitUntilSpinnerToHide();
        return await $$(this.selectors.logItems).first().getText();
    }

    async clickOnRefreshButton(): Promise<void> {
        await $(this.selectors.refreshButton).click();
    }

    async getemailContent(): Promise<string> {
        //        await browser.sleep(2000);
        //        await utilCommon.waitUntilSpinnerToHide();
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailContent)), 5000);
        let emailBody = await element(by.xpath('(//div[@class="log-item__content"]/email)[1]')).getText();
        return emailBody;
    }

    async getAttachmentCount(): Promise<number> {
        return await $$(this.selectors.AttachedfileName).count();
    }

    async clickShowMoreForEmailActivity(): Promise<void> {
        await $(this.selectors.showMoreEmailActivity).click();
    }

    async getemailAttachmentFileName(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailAttachmentFileName)), 5000);
        let fileName = await $(this.selectors.emailAttachmentFileName).getText();
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
        //        browser.sleep(3000);
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBox)));
        await $(this.selectors.addNoteBox).click();
    }

    async addActivityNote(addNoteText: string): Promise<void> {
        await this.clickActivityNoteTextBox();
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBoxEdit)));
        await $(this.selectors.addNoteBoxEdit).sendKeys(addNoteText);
    }

    async addPersonInActivityNote(tagPerson: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBoxEdit)));
        await $(this.selectors.addNoteBoxEdit).sendKeys(`@${tagPerson}`);
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personPopup)));
        await $(this.selectors.personPopup).click();
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async clearActivityNote(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBoxEdit)));
        await $(this.selectors.addNoteBoxEdit).clear();
        //        await browser.wait(this.EC.visibilityOf($(`${this.selectors.addNotePostButton}[disabled]`)));
    }

    async getPersonCount(tagPerson: string): Promise<number> {
        await this.clickActivityNoteTextBox();
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBoxEdit)));
        await $(this.selectors.addNoteBoxEdit).sendKeys(tagPerson);
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.personPopup)));
        return await $$(this.selectors.personPopup).count();
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
        return await element(by.cssContainingText(this.selectors.filterCheckbox, filterCheckBox)).getText();
    }

    async isAuthorSearchBoxVisible(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterAuthor)));
        return $(this.selectors.filterAuthor).isDisplayed();
    }

    async getTextOfFilterTaskOptions(filterCheckBoxText: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.filterCheckbox)));
        return await element(by.cssContainingText(this.selectors.filterCheckbox, filterCheckBoxText)).getText();
    }

    async selectFilterCheckBox(filterCheckBoxText: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterCheckbox)));
        await element(by.cssContainingText(this.selectors.filterCheckbox, filterCheckBoxText)).click();
    }

    async addAuthorOnFilter(AuthorName: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterAuthor)));
        await $(this.selectors.filterAuthor).click();
        await $(this.selectors.filterAuthor).sendKeys(AuthorName);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personPopup)), 2000);
        await $(this.selectors.personPopup).click();
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
        try {
            return await element(by.cssContainingText(this.selectors.activityLog, caseActivityLogText)).isDisplayed();
        }
        catch (e) {
            return false;
        }
    }

    async isTextPresentInNote(bodyText: string): Promise<boolean> {
        return await element(by.cssContainingText('.activity-general-note', bodyText)).isDisplayed().then(async (result) => {
            if (result) return true;
            else return false;
        });
    }

    async getBodyTextRowsCount(bodyText: string): Promise<number> {
        let getTextOfBody: string = await element(by.cssContainingText('[.activity-general-note]', bodyText)).getText();
        let splitbodyText = getTextOfBody.split('\n');
        let boodyTextRows = splitbodyText.length;
        return boodyTextRows;
    }



    async getCaseViewCount(TitleText: string): Promise<number> {
        return await element.all(by.cssContainingText(this.selectors.logTitle, TitleText)).count();
    }

    async clickOnHyperlinkFromActivity(bodyText: string, authorText: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personLink)));
        //        browser.sleep(3000);
        var customXpath = `//*[text()="${bodyText}"]//ancestor::div[@class='log-item__body']//a[text()="${authorText}"]`;
        //        await browser.wait(this.EC.elementToBeClickable(element(by.xpath(customXpath))));
        await element(by.xpath(customXpath)).click();
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async isHyperlinkOfActivityDisplay(bodyText: string, authorText: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personLink)));
        var customXpath = `//*[text()="${bodyText}"]//ancestor::div[@class='log-item__body']//a[text()="${authorText}"]`;
        //        await browser.wait(this.EC.elementToBeClickable(element(by.xpath(customXpath))));
        return await element(by.xpath(customXpath)).isDisplayed();
    }

    async clickOnAttachLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachmentLink)));
        await $(this.selectors.attachmentLink).click();
    }

    async isPersonLinkPresent(): Promise<boolean> {
        return await $(this.selectors.activityLog).isDisplayed();
    }

    async getIconOfActivity(caseActivityLogText: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($('.activity_logs [role="listitem"] .log-item__icon')));
        return $('.activity_logs [role="listitem"] .log-item__icon').getAttribute('class');
    }

    async getAuthorOfActivity(caseActivityLogText: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($('.activity_logs [role="listitem"] .title a')));
        return $('.activity_logs [role="listitem"] .title a').getText();
    }

    async getTitleTextOfActivity(caseActivityLogText: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($('.activity_logs [role="listitem"] .title')));
        return $('.activity_logs [role="listitem"] .title').getText();
    }

    async getLinkedTextFromBodyOfActivity(caseActivityLogText: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($('.activity_logs [role="listitem"] .body')));
        return $('.activity_logs [role="listitem"] .body a[title]').getText();
    }

    async getTimeOfActivity(caseActivityLogText: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($('.activity_logs [role="listitem"] .time-ago')));
        return $('.activity_logs [role="listitem"] .time-ago').getAttribute('title');
    }

    async isLinkedTextPresentInBodyOfFirstActivity(value: string): Promise<boolean> {
        var firstActivity = await $$('.activity_logs [role="listitem"]').first();
        //        await browser.wait(this.EC.visibilityOf(firstActivity));
        //        await browser.wait(this.EC.elementToBeClickable(firstActivity.$('.body a[title]')));
        return await element(by.cssContainingText('.activity_logs [role="listitem"] .body a[title]', value)).isDisplayed();
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
        let surveyXpath = await $$(this.selectors.dwpSurveyText).get(0);
        //        await browser.wait(this.EC.visibilityOf(surveyXpath));
        return surveyXpath.getText();
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
        return await $('.modal-title').getText();
    }

    async getRatingText(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($('.rating')));
        return await $('.rating').getText();
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
        let activityLog = await $$('.log-item__content').get(2);
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
        return await element(by.cssContainingText('.rx-attachment-view-name', bodyText)).isDisplayed().then(async (result) => {
            if (result) return true;
            else return false;
        });
    }
}

export default new ActivityTabPage();
