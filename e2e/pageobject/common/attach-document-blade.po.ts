import { $, protractor, ProtractorExpectedConditions, element, by, browser } from "protractor";

class AttachDocumentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        advanceSearchButton: '.km-group__header .d-icon-left-search',
        searchBox: '[rx-view-component-id="6b6c2401-1732-4a8f-b746-0b3ab3d9df8a"] .rx-adv-search-textField',
        iconCircle: '.icon-circle_thin_o',
        attachButton: '[rx-view-component-id="9d41c65a-85a9-4316-bd64-8fa8ed68dfde"] button',
    }

    async searchAndAttachDocument(documentName:string): Promise<void> {
        await this.clickOnAdvanceSearchButton();
        await this.searchRecord(documentName);
        await this.selectDocument();
        await this.clickOnAttachButton();
    }

    async clickOnAdvanceSearchButton(): Promise<void> {
        await element(by.cssContainingText(this.selectors.advanceSearchButton,'Advanced search options')).click();
    }

    async searchRecord(documentName:string): Promise<void> {
        await $(this.selectors.searchBox).clear();
        await $(this.selectors.searchBox).sendKeys(documentName + protractor.Key.ENTER);
        let i: number;
        for (i = 0; i <= 10; i++) {
            let bolnVal: boolean = await $(this.selectors.iconCircle).isPresent();
            if (bolnVal == false) {
                await browser.sleep(3000);
                await $(this.selectors.searchBox).clear();
                await $(this.selectors.searchBox).sendKeys(documentName + protractor.Key.ENTER);
            } else {
                break;
            }
        }
    }

    async selectDocument(): Promise<void> {
        await $(this.selectors.iconCircle).click();
    }

    async clickOnAttachButton(): Promise<void> {
        await $(this.selectors.attachButton).click();
    }
}

export default new AttachDocumentBlade();