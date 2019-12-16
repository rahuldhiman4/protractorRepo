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
        FilterPopUp: '.activity-log-filter-trigger',
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
    }

    async removeFilterList(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.removeIconFilterList)));
        await $(this.selectors.removeIconFilterList).click();
    }

    async isfilterPresent(): Promise<boolean> {
        return await $(this.selectors.appliedActivityFilter).isPresent();
    }

    async isfilterListDisplayed(filterList: string): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterLists)));
        return await element(by.cssContainingText(this.selectors.filterLists, filterList)).isPresent();
    }

    async getTextFromFilterList(filterList: string): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterLists)));
        return await element(by.cssContainingText(this.selectors.filterLists, filterList)).getText();
    }

    async clickOnNmoreLink(): Promise<void> {
        await browser.sleep(1000);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.nMoreButton)));
        await $(this.selectors.nMoreButton).click();
    }

    async closeNmoreLink(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.activityTab)));
        await element(by.cssContainingText(this.selectors.activityTab, 'Activity')).click();
        utilCommon.waitUntilSpinnerToHide();
    }

    async getTextOfNmoreLink(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.nMoreButton)));
        return await $(this.selectors.nMoreButton).getText();
    }

    async isFilterPopUpDisplayed(): Promise<string> {
        return await $(this.selectors.FilterPopUp).getAttribute('aria-expanded');
    }

    async clickActivityNoteTextBox(): Promise<void> {
        browser.sleep(3000);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBox)));
        await $(this.selectors.addNoteBox).click();
    }

    async addActivityNote(addNoteText: string): Promise<void> {
        await this.clickActivityNoteTextBox();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBoxEdit)));
        await $(this.selectors.addNoteBoxEdit).sendKeys(addNoteText);
    }

    async addPersonInActivityNote(tagPerson: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBoxEdit)));
        await $(this.selectors.addNoteBoxEdit).sendKeys(`@${tagPerson}`);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personPopup)));
        await $(this.selectors.personPopup).click();
        await utilCommon.waitUntilSpinnerToHide();
    }

    async clearActivityNote(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBoxEdit)));
        await $(this.selectors.addNoteBoxEdit).clear();
        await browser.wait(this.EC.visibilityOf($(`${this.selectors.addNotePostButton}[disabled]`)));
    }

    async getPersonCount(tagPerson: string): Promise<number> {
        await this.clickActivityNoteTextBox();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBoxEdit)));
        await $(this.selectors.addNoteBoxEdit).sendKeys(tagPerson);
        await browser.wait(this.EC.visibilityOf($(this.selectors.personPopup)));
        return await $$(this.selectors.personPopup).count();
    }

    async clickOnPostButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNotePostButton)));
        await $(this.selectors.addNotePostButton).click();
        await utilCommon.waitUntilSpinnerToHide();
    }

    async clickOnCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteCancelButton)));
        await $(this.selectors.addNoteCancelButton).click();
    }

    async clickOneAttachLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteAttachLink)));
        await $(this.selectors.addNoteAttachLink).click();
    }

    async clickOnNotesTemplate(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteNotesTemplate)));
        await $(this.selectors.addNoteNotesTemplate).click();
    }

    async clickOnFilterButton(): Promise<void> {
        await browser.sleep(5000);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterButton)));
        await $(this.selectors.filterButton).click();
    }

    async checkFilterApplyButtonIsDisabledOrEnabled(): Promise<number> {
        return await $$(this.selectors.filterApplyButtonEnableDisabled).count();
    }

    async getTextTaskFilterOption(filterCheckBox: string): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterCheckbox)));
        return await element(by.cssContainingText(this.selectors.filterCheckbox, filterCheckBox)).getText();
    }

    async isAuthorSearchBoxVisible(): Promise<boolean> {
        return await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterAuthor)));
    }

    async getTextOfFilterTaskOptions(filterCheckBoxText: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.filterCheckbox)));
        return await element(by.cssContainingText(this.selectors.filterCheckbox, filterCheckBoxText)).getText();
    }

    async selectFilterCheckBox(filterCheckBoxText: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterCheckbox)));
        await element(by.cssContainingText(this.selectors.filterCheckbox, filterCheckBoxText)).click();
    }

    async addAuthorOnFilter(AuthorName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterAuthor)));
        await $(this.selectors.filterAuthor).click();
        await $(this.selectors.filterAuthor).sendKeys(AuthorName);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personPopup)));
        await $(this.selectors.personPopup).click();
    }

    async removeAuthorFromFilter(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.authorCloseButton)));
        await $(this.selectors.authorCloseButton).click();
    }



    async isAuthorBoxEmpty(): Promise<boolean> {
        browser.sleep(2000);
        return await $(this.selectors.authorFieldEmpty).isPresent();
    }

    async searchAuthorOnFilter(AuthorName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterAuthor)));
        await $(this.selectors.filterAuthor).click();
        await $(this.selectors.filterAuthor).sendKeys(AuthorName);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personPopup)));
    }

    async isImgPresentOnUserPopUp(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.imgPersonProfilePopUp)));
        return await $(this.selectors.imgPersonProfilePopUp).isPresent();
    }
    async isPersonNamePresentOnUserPopUp(personName: string): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.namePersonProfilePopUp)));
        return await element(by.cssContainingText(this.selectors.namePersonProfilePopUp, personName)).isPresent();
    }

    async isEmailPresentOnUserPopUp(email: string): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailPersonProfilePopUp)));
        return await element(by.cssContainingText(this.selectors.emailPersonProfilePopUp, email)).isPresent();
    }

    async isCompanyPresentOnUserPopUp(company: string): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.companyPersonProfilePopUp)));
        return await element(by.cssContainingText(this.selectors.companyPersonProfilePopUp, company)).isPresent();
    }

    async isPhoneNumberPresentOnUserPopUp(phoneNumber: string): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.phoneNumberPersonProfilePopUp)));
        return await element(by.cssContainingText(this.selectors.phoneNumberPersonProfilePopUp, phoneNumber)).isPresent();
    }

    async clickOnFilterApplyButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterPopupApplyOrClearButton)));
        await element(by.cssContainingText(this.selectors.filterPopupApplyOrClearButton, 'Apply')).click();
        utilCommon.waitUntilSpinnerToHide();
    }

    async clickOnFilterClearButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterPopupApplyOrClearButton)));
        await element(by.cssContainingText(this.selectors.filterPopupApplyOrClearButton, 'Clear')).click();
        await browser.wait(this.EC.or(async () => {
            await $$(this.selectors.appliedActivityFilter).count() == 0;
        }));
    }

    async getTextOfFilterTask(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.FilterTask)));
        return await $(this.selectors.filterAuthor).getText();
    }

    async isTextPresentInActivityLog(caseActivityLogText: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.activityLog, caseActivityLogText)).isDisplayed();
    }

    async isTextPresentInNote(bodyText: string): Promise<boolean> {
        browser.sleep(3000);
        try {
            await element(by.cssContainingText('.activity-general-note', bodyText)).isDisplayed();
            return true;
        }
        catch (e) {
            return false;
        }
    }

    async clickOnHyperlinkFromActivity(bodyText: string, authorText: string): Promise<void> {
        //await browser.wait(this.EC.elementToBeClickable($(this.selectors.personLink)));
        browser.sleep(3000);
        var customXpath = `//*[text()="${bodyText}"]//ancestor::div[@class='log-item__body']//a[text()="${authorText}"]`;
        await browser.wait(this.EC.elementToBeClickable(element(by.xpath(customXpath))));
        await element(by.xpath(customXpath)).click();
        await utilCommon.waitUntilSpinnerToHide();
    }

    async isHyperlinkOfActivityDisplay(bodyText: string, authorText: string): Promise<boolean> {
        //await browser.wait(this.EC.elementToBeClickable($(this.selectors.personLink)));
        var customXpath = `//*[text()="${bodyText}"]//ancestor::div[@class='log-item__body']//a[text()="${authorText}"]`;
        await browser.wait(this.EC.elementToBeClickable(element(by.xpath(customXpath))));
        return await element(by.xpath(customXpath)).isDisplayed();
    }

    async isPersonLinkPresent(): Promise<boolean> {
        return await element($(this.selectors.activityLog)).isDisplayed();
    }

    async isActivityTextPresent(): Promise<boolean> {
        return await element($(this.selectors.activityText)).isDisplayed();
    }

    async getIconOfActivity(caseActivityLogText: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($('.activity_logs [role="listitem"] .log-item__icon')));
        return $('.activity_logs [role="listitem"] .log-item__icon').getAttribute('class');
    }

    async getAuthorOfActivity(caseActivityLogText: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($('.activity_logs [role="listitem"] .title a')));
        return $('.activity_logs [role="listitem"] .title a').getText();
    }

    async getTitleTextOfActivity(caseActivityLogText: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($('.activity_logs [role="listitem"] .title')));
        return $('.activity_logs [role="listitem"] .title').getText();
    }

    async getLinkedTextFromBodyOfActivity(caseActivityLogText: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($('.activity_logs [role="listitem"] .body')));
        return $('.activity_logs [role="listitem"] .body a[title]').getText();
    }

    async getTimeOfActivity(caseActivityLogText: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($('.activity_logs [role="listitem"] .time-ago')));
        return $('.activity_logs [role="listitem"] .time-ago').getAttribute('title');
    }

    async isLinkedTextPresentInBodyOfFirstActivity(value: string): Promise<boolean> {
        var firstActivity = await $$('.activity_logs [role="listitem"]').first();
        await browser.wait(this.EC.visibilityOf(firstActivity));
        await browser.wait(this.EC.elementToBeClickable(firstActivity.$('.body a[title]')));
        return await element(by.cssContainingText('.activity_logs [role="listitem"] .body a[title]', value)).isDisplayed();
    }
}

export default new ActivityTabPage();