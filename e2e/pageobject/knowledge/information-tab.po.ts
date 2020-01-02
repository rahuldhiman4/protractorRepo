import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class InformationTabPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        editKnowledgeMetadata: '[rx-view-component-id="56cc9627-6ef9-46f8-9b76-728349193ed2"] .edit-link',
        attachmentField: '[rx-view-component-id="1f42f6d7-99cc-4c07-9249-94172d98d526"] .d-icon-paperclip',
    }

    async clickOnEditButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editKnowledgeMetadata)));
        await $(this.selectors.editKnowledgeMetadata).click();
    }

    async isAttachDocumentBladeDisplayed(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachmentField)));
        let attartibute= await $(this.selectors.attachmentField).getAttribute('ng-disabled');
        if(attartibute=='openDocumentLibrary()'){return true;}
        if(attartibute=='showFileUploadDialog()'){return false;}
    }
}
export default new InformationTabPage();