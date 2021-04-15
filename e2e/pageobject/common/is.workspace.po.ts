import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class WorkspacePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        Libraries: '.is-checked',
        allLink: '.ui-grid__link',
    }
    async clickOnLibrariesButton():Promise<void>{
        await $(this.selectors.Libraries).click();
    }

    async clickOnLink(library:string):Promise<void>{
        await element(by.cssContainingText(this.selectors.allLink,library));
    }
}

export default new WorkspacePage();