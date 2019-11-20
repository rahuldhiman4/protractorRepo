import { $, ProtractorExpectedConditions, browser, protractor, element, by, $$ } from "protractor";


class ActivityTabPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addNoteBox: 'ux-activity-feed-add-note input[placeholder]',
        addNoteBoxEdit: '.activity-feed-note-text',
        personPopup: '.popup-person',
        addNotePostButton: '.activity-feed-note-buttons__right .d-button.d-button_primary',
        addNoteCancelButton: '.activity-feed-note-buttons__right .d-button.d-button_secondary',
        addNoteAttachLink: '.ux-document-library .d-button',
        addNoteNotesTemplate: '.d-button.d-button_link.d-icon-note_pencil.social-attach-template.ac-template-button',
        activityLog: '//*[@class="log-item__body"]//div[@class="title" or "to-list" or "subject"]',
        personLink: '.title a',
        filterButton: 'd-icon-filter',
        filterCheckbox: '.d-checkbox__item',
        filterAuthor: '.person-input',
        filterPopupApplyOrClearButton: '.d-button',
    }

    async addActivityNote(addNoteText: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBox)));
        await $(this.selectors.addNoteBox).click();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBoxEdit)));
        await $(this.selectors.addNoteBoxEdit).sendKeys(addNoteText);
    }

    async addPersonInActivityNote(tagPerson: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBoxEdit)));
        await $(this.selectors.addNoteBoxEdit).sendKeys(`@${tagPerson}`);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.personPopup)));
        await $(this.selectors.personPopup).click();
    }

    async getPersonCount(tagPerson: string): Promise<number> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBox)));
        await $(this.selectors.addNoteBox).click();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addNoteBoxEdit)));
        await $(this.selectors.addNoteBoxEdit).sendKeys(tagPerson);
        await browser.wait(this.EC.visibilityOf($(this.selectors.personPopup)));
        var num: number = await $$(this.selectors.personPopup).count();
        return num;
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

}
export default new ActivityTabPage();
