import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class EditDocumentLibraryPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        statusGuid: '0a8b7179-dd0a-47f9-8515-7c7aceda3118',
        saveButton: '[rx-view-component-id="8035353f-acb0-4bb5-a5c5-fe7626c01b3e"] button',
        deleteButton: '[rx-view-component-id="6e44c878-cc4a-4de1-8626-c786b5d309d7"] button',
        cancelButton: 'rx-view-component-id="61a48596-d3c0-462d-825b-4d6172e351b3"',
        deleteDocWarningMsg: '[rx-view-component-id="c652354a-1524-4235-b1db-6b397fc9699a"] span',
        deleteDocWarningMsgYesButton: '[rx-view-component-id="e40ad54c-ad9a-480a-aa63-a8b399caf20e"] button',
    }

    async getTextWarningPopUpMessageForDeleteDocuement(message: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteDocWarningMsg)));
        return await element(by.cssContainingText((this.selectors.deleteDocWarningMsg), message)).getText();
    }

    async clickOnYesButtonOfWarningPopUpMessageForDeleteDocument(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.deleteDocWarningMsgYesButton)));
        await $(this.selectors.deleteDocWarningMsgYesButton).click();
    }

    async selectStatus(status: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.statusGuid, status);
    }

    async clickOnsaveButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnDeleteButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.deleteButton)));
        await $(this.selectors.deleteButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async isDeleteButtonEnabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.deleteButton)));
        return await $(this.selectors.deleteButton).isEnabled();
    }
}

export default new EditDocumentLibraryPage();