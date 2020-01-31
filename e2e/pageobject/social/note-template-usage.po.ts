import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilGrid from '../../utils/util.grid';
import activityTab from './activity-tab.po';
import utilCommon from '../../utils/util.common';

class notesTemplateUsage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        notesTemplateButton: '.ac-template-button',
        searchTextBox: '[rx-id="search-text-input"]',
        settingsButton: 'rx-shell .d-n-action__settings',
        searchGuid: '3de376e6-d88f-4e6a-a4d0-57b24484a885',
        requesterName: '[rx-view-component-id="7e0f6b41-30fd-494e-822b-2e7d4aac9fb8"] .person-name a',
        postButton: '.activity-feed-note-buttons__right .d-button_primary',
        applyButton: '[rx-view-component-id="7aeb3ea6-abed-42d7-9476-52f45fed3e78"] button',
        cancelButton: '[rx-view-component-id="aed9afb3-f45a-4eb8-93f0-ba162244856e"] button'
    }

    async clickOnPostButton() {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.postButton)));
        await $(this.selectors.postButton).click();
    }

    async clickOnRequsterName() {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.requesterName)));
        await $(this.selectors.requesterName).click();
    }

    async clickOnAddNoteAndAddNoteTemplate(notesTemplate: string) {
        await activityTab.clickActivityNoteTextBox();
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.notesTemplateButton)));
        await $(this.selectors.notesTemplateButton).click();
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchTextBox)));
        await utilGrid.searchAndSelectFirstCheckBox(this.selectors.searchGuid, notesTemplate);
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.applyButton)));
        await $(this.selectors.applyButton).click();
//        await utilCommon.waitUntilSpinnerToHide();
//        await browser.wait(this.EC.visibilityOf($(this.selectors.settingsButton)));
//        await browser.wait(this.EC.elementToBeClickable($('.activity-feed-note-buttons__right .d-button.d-button_primary')));
    }

}

export default new notesTemplateUsage();
