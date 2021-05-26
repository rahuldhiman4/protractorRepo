import { $, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilityGrid from '../../utils/utility.grid';
import activityTab from './activity-tab.po';

class notesTemplateUsage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        notesTemplateButton: '.note-template button',
        applyButton: '[rx-view-component-id="7aeb3ea6-abed-42d7-9476-52f45fed3e78"] button',
        cancelButton: '[rx-view-component-id="aed9afb3-f45a-4eb8-93f0-ba162244856e"] button',
        gridTableData: '.ui-table-tbody td.at-tooltip-el'
    }

    async clickAddNoteAndAddNoteTemplate(notesTemplate: string) {
        await activityTab.clickActivityNoteTextBox();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.notesTemplateButton)),5000);
        await $(this.selectors.notesTemplateButton).click();
        await utilityGrid.searchAndSelectGridRecord(notesTemplate);
        await $(this.selectors.applyButton).click();
    }

    async isTemplatePresent(templateName: string): Promise<boolean> {
        await utilityGrid.searchRecord(templateName);
        let isPresent: boolean = await $(this.selectors.gridTableData).isPresent().then(async (result) => {
            if(result) return await $(this.selectors.gridTableData).isDisplayed();
            else return false;
        })
        return isPresent;
    }

    async clickOnCancelBtn(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

}

export default new notesTemplateUsage();
