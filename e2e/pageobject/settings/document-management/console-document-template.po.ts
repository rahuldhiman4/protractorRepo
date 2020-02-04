import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class DocumentTemplateConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createDocumentTemplate: '[rx-view-component-id="3acdcc85-9981-433a-84dd-6891fedcc243"] button',
    }

    async clickOnCreateDocumentTemplate():Promise<void>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.createDocumentTemplate)));
        await $(this.selectors.createDocumentTemplate).click();
    }

}

export default new DocumentTemplateConsole();