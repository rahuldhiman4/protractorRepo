import { $, ProtractorExpectedConditions, browser, protractor, element, by, $$ } from "protractor";

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
        filterCheckbox: '.d-checkbox__item',
        filterAuthor: '.person-input',
        filterPopupApplyOrClearButton: '.filter-options .d-button',
        activityText: '[rx-view-component-id="34167059-11d4-4e85-8a58-e501544e2461"] [title="Activity"]',
    }

    async clickActivityNoteTextBox(): Promise<void> {
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
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterButton)));
        await $(this.selectors.filterButton).click();
    }

    async selectFilterCheckBox(filterCheckBox: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterCheckbox)));
        await element(by.cssContainingText(this.selectors.filterCheckbox, filterCheckBox)).click();
        await element(this.selectors.filterCheckbox).isSelected();
    }

    async searchAuthorOnFilter(AuthorName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterAuthor)));
        await $(this.selectors.filterAuthor).click();
        await $(this.selectors.filterAuthor).sendKeys(AuthorName);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personPopup)));
        await $(this.selectors.personPopup).click();
    }

    async clickOnFilterApplyButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterPopupApplyOrClearButton)));
        await element(by.cssContainingText(this.selectors.filterPopupApplyOrClearButton, 'Apply')).click();
    }

    async clickOnFilterClearButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.filterPopupApplyOrClearButton)));
        await element(by.cssContainingText(this.selectors.filterPopupApplyOrClearButton, 'clear')).click();
    }

    async isTextPresentInActivityLog(caseActivityLogText: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.activityLog, caseActivityLogText)).isDisplayed();
    }

    async clickOnPersonInActivityLog(caseActivityLogText: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.personLink, caseActivityLogText)).click();
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

    async isLinkedTextPresentInBodyOfFirstActivity(value:string): Promise<boolean> {
        var firstActivity = await $$('.activity_logs [role="listitem"]').first();
        await browser.wait(this.EC.visibilityOf(firstActivity));
        await browser.wait(this.EC.elementToBeClickable(firstActivity.$('.body a[title]')));
        return await element(by.cssContainingText('.activity_logs [role="listitem"] .body a[title]', value)).isDisplayed();
    }
}

export default new ActivityTabPage();
