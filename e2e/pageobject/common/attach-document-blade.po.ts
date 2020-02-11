import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class AttachDocumentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        title: '.modal-dialog .modal-title',
    }

    async isTitlePresent(titleText:string): Promise<boolean> {
    return await element(by.cssContainingText((this.selectors.title), titleText)).isPresent();
}
}
    export default new AttachDocumentBlade();