import { ProtractorExpectedConditions, protractor, browser, $, $$ } from "protractor"

class EditCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        editLink: '.edit-link'
    }

    async clickEditCase(): Promise<void> {
        await $(this.selectors.editLink).click();
    }
}