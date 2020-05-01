import { resolve } from "path";
import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class ActivityTabPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addNoteBox: '.textfield__wrapper .form-control',
        addNoteBoxEdit: '.bwf-activity-add-note textarea',
        personPopup: '.popup-person',
        addNotePostButton: '.activity-feed-note-buttons__right .btn-primary',
        addNoteCancelButton: '.activity-feed-note-buttons__right .btn-secondary',
        addNoteAttachLink: '.activity-note .bwf-button-link',
        addNoteNotesTemplate: '.activity-note .d-icon-note_pencil',
        activityLog: '.activity__body .activity-title, .activity__body [style="position: relative;"], .activity__body .field, .activity__body .value',
        personLink: 'bwf-activity-title a[href].ng-star-inserted',
        filterButton: '.d-icon-filter',
        filterCheckbox: '.checkbox__label span',
        filterAuthor: '.dropdown input[placeholder="Enter name, email, or login ID"]',
        filterPopupApplyOrClearButton: '.filter-options button span',
        // activityText: '[rx-view-component-id="34167059-11d4-4e85-8a58-e501544e2461"] [title="Activity"]',
        // FilterTask: '[rx-view-component-id="972e87ef-cfa0-469e-9eda-a5e2d679d9d2"] .d-tag-label',
        FilterPopUp: '.bwf-activity-log-filter button[aria-expanded]',

        filterApplyButtonEnableDisabled: '.filter-options .btn-primary[disabled="disabled"]',
        filterLists: '.a-tag-active .bwf-text-overflow-ellipsis',
        nMoreButton: '.bwf-show-more .dropdown-toggle span',
        // closeNmoreLink: '.activity-log-filter',
        removeIconFilterList: '.d-flex .close-inverse',
        activityTab: '.nav-link-wrapper',
        appliedActivityFilter: '.a-tag .bwf-text-overflow-ellipsis',
        authorCloseButton: '.bwf-flexi-type-ahead .d-icon-cross',
        imgPersonProfilePopUp: '.person-image img[src]',
        namePersonProfilePopUp: '.popup-info .popup-person',
        companyPersonProfilePopUp: '.popup-info .popup-organization',
        emailPersonProfilePopUp: '.popup-info .popup-email',
        phoneNumberPersonProfilePopUp: '.popup-info .popup-phone-number',
        // authorFieldEmpty: '.d-textfield__label .ng-not-empty',
        attachmentLink: '.bwf-attachment-button button',

        // emailContent: '.log-item__content email',
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
        // body: '.log-item__body .body',

        AttachedfileName: '.activity__wrapper .bwf-attachment-container__file-name',
        refreshButton: '.tab-content .bwf-button-link[aria-label="Refresh"]',
        attachmentField: '.attachment-button input[type="file"]',
        showMoreEmailActivity: '.activity__wrapper button[aria-label="Show more"]',
        expandAllAttachmentActivity : '.activity__wrapper .d-icon-plus',
        allTaskActivity: '[rx-view-component-id="972e87ef-cfa0-469e-9eda-a5e2d679d9d2"] .fields .value',
        taskActivity: '.fields .value',
        showMoreLink: 'button[aria-label="Show more"]',
        emailBodyImage: '.email-body img',
        publicCheckbox: '.bwf-activity-add-note .checkbox__input',
        logTitle: '.activity-title',
        showLessLink: 'button[aria-label="Show less"]',
        showMoreLinkForAttachment: '.rx-attachment-show-text[aria-label="Show more attachments"]',
        showLessLinkForAttachment: '.rx-attachment-show-text[aria-label="Show less attachments"]',
        lockIcon: '.d-icon-lock',
        activityLogList: '.activity__wrapper',
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
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).element(by.cssContainingText('.collapse-block div div[style="position: relative;"]', bodyText)).isDisplayed().then(async (result) => {
            if (result) return true;
            else return false;
        });
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
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.showMoreLink).isDisplayed().then(async (link) => {
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
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.activity__wrapper .flex-wrap button span').isPresent().then(async (link) => {
            if (link) {
                let showMoreTextName = await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.activity__wrapper .flex-wrap button span').getText();
                if (showMoreTextName.trim() == '1 more') {
                    await $$(this.selectors.activityLogList).get(activityNumber - 1).$('.activity__wrapper .flex-wrap button span').click();
                    return true;
                }

            } else return false;
        });
    }


    async clickShowLessLinkInAttachmentActivity(activityNumber: number): Promise<boolean> {
        return await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.showLessLinkForAttachment).isPresent().then(async (link) => {
            if (link) {
                await $$(this.selectors.activityLogList).get(activityNumber - 1).$(this.selectors.showLessLinkForAttachment).click();
                return true;
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

    async getTextOnActivityTable(rowNumber:number, columnNumber: number): Promise<string>{
        let row = await $$('.activity .email-body table tr').get(rowNumber-1);
        let cellText = await row.$$('td').get(columnNumber-1).getText();
        return cellText;
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
        //        browser.sleep(3000);
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBox)));
        await $(this.selectors.addNoteBox).click();
    }

    async addActivityNote(addNoteText: string): Promise<void> {
        await this.clickActivityNoteTextBox();
        await browser.waitForAngularEnabled(false);
        await browser.sleep(10000);
        await browser.switchTo().frame(await $('iframe.cke_wysiwyg_frame').getWebElement());
        await $('.cke_editable_themed').sendKeys(addNoteText);
        await browser.switchTo().defaultContent();
        await browser.waitForAngularEnabled(true);
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
        try {
            return await element(by.cssContainingText(this.selectors.activityLog, caseActivityLogText)).isDisplayed();
        }
        catch (e) {
            return false;
        }
    }

    async isTextPresentInNote(bodyText: string): Promise<boolean> {
        let activityText = await $$('.activity .pt-2 [style="position: relative;"] .ng-star-inserted').first();
        let value = await activityText.getText();
        return value.includes(bodyText) ? true:false;
    }

    async getCaseViewCount(TitleText: string): Promise<number> {
        return await element.all(by.cssContainingText(this.selectors.logTitle, TitleText)).count();
    }

    async clickOnHyperlinkFromActivity(bodyText: string, authorText: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personLink)));
        //        browser.sleep(3000);
        let  customXpath = `//*[text()="${bodyText}"]//ancestor::div[@class='activity__body']//a[text()="${authorText}"]`;
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
        return value.includes(bodyText) ? true:false;
    }
}

export default new ActivityTabPage();
