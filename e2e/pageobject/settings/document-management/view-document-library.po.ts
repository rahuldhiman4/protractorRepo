import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class ViewDocumentLibraryPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        editDocumentLibrary: '[rx-view-component-id="a1b9759b-8b91-4839-b181-b94fa6933324"] button',
        editReadAccess: '[rx-view-component-id="3796853b-2bf5-4607-8574-270004b8e34d"] button',
    }

    async clickOnEditDocument(): Promise<void> {
        await $(this.selectors.editDocumentLibrary).click();
    }

    async clickOnEditReadAccess(): Promise<void> {
        await $(this.selectors.editReadAccess).click();
    }
}

export default new ViewDocumentLibraryPage();