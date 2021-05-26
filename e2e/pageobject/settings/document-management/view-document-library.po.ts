import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class ViewDocumentLibraryPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        editDocumentLibrary: '[rx-view-component-id="a1b9759b-8b91-4839-b181-b94fa6933324"] button',
        editReadAccess: '[rx-view-component-id="3796853b-2bf5-4607-8574-270004b8e34d"] button',
        categoryTier4: '[rx-view-component-id="4abcb2f3-a730-4e34-8126-52ff2c2888c2"] .read-only-content',
        cancelButton: '[rx-view-component-id="61a48596-d3c0-462d-825b-4d6172e351b3"] button',
    }

    async clickOnEditDocument(): Promise<void> {
        await $(this.selectors.editDocumentLibrary).isPresent().then(async (present) => {
            if (present) {
                await $(this.selectors.editDocumentLibrary).isDisplayed().then(async (displayed) => {
                    if (displayed) await $(this.selectors.editDocumentLibrary).click();
                });
            }
            else {
                await browser.sleep(1000);
                await $(this.selectors.editDocumentLibrary).click();
            }
        });
    }

    async clickOnEditReadAccess(): Promise<void> {
        await $(this.selectors.editReadAccess).click();
    }

    async getCategoryTier4(): Promise<string> {
        return await $(this.selectors.categoryTier4).getText();
    }

    async clickOnCancelButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }
}

export default new ViewDocumentLibraryPage();