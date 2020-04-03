import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class InformationTabPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        editKnowledgeMetadata: '[rx-view-component-id="cbdd812c-4899-4503-84ab-412020d820df"] button',
        attachmentField: '[rx-view-component-id="1f42f6d7-99cc-4c07-9249-94172d98d526"] .d-icon-paperclip',
    }

    async clickOnEditButton(): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editKnowledgeMetadata)));
        await $(this.selectors.editKnowledgeMetadata).click();
    }

    async isAttachDocumentBladeDisplayed(): Promise<boolean> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachmentField)));
        let attribute= await $(this.selectors.attachmentField).getAttribute('ng-click');
        return attribute =='openDocumentLibrary()' ? true : false
    }
}
export default new InformationTabPage();