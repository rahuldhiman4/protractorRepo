import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../utils/utility.grid';
import activityTab from './activity-tab.po';
import utilityCommon from 'e2e/utils/utility.common';

class notesTemplateUsage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        notesTemplateButton: '.note-template button',
        applyButton: '[rx-view-component-id="7aeb3ea6-abed-42d7-9476-52f45fed3e78"] button',
    }

    async clickAddNoteAndAddNoteTemplate(notesTemplate: string) {
        await activityTab.clickActivityNoteTextBox();
        await $(this.selectors.notesTemplateButton).click();
        await utilityGrid.searchAndSelectGridRecord(notesTemplate);
        await $(this.selectors.applyButton).click();
    }
}

export default new notesTemplateUsage();
