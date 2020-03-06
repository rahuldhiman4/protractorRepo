import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class AttachDocumentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        bladeTitle: '.modal-title',
        advanceSearchButton: '.km-group__header .d-icon-left-search',
        searchBox: '[rx-view-component-id="6b6c2401-1732-4a8f-b746-0b3ab3d9df8a"] .rx-adv-search-textField',
        iconCircle: '.icon-circle_thin_o',
        attachButton: '[rx-view-component-id="9d41c65a-85a9-4316-bd64-8fa8ed68dfde"] button',
        cancelButton: '[rx-view-component-id="0a24a406-071f-4818-ab29-7b8fb80a202e"] button',
        attachFromLocalDriveButton: '[rx-view-component-id="703c693f-068a-4cd3-9283-dd9b9cdf2714"] button',
        documentLibTitle: '.km-group-list-item__description',
        docDetails: '.padding-top-4 span',
        headerName: '.km-group__header',
        listHeading: '.km-group__header[id="km-group__knowledge-header"]',
        pagination: '.rkm-pagination',
        filterApplyButton: '.padding-top-10  .d-button_primary',

    }

    async getTextOfDocumentListHeading(): Promise<string> {
        return await $$(this.selectors.listHeading).get(0).getText();
    }

    async isDocumentTitleDisplayed(documentTitle: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.documentLibTitle, documentTitle)).isDisplayed();
    }

    async isUpdatedDateDisplayed(upatedDate: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.docDetails, upatedDate)).isDisplayed();
    }

    async isDocumentAttachmentNameDisplayed(fileName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.docDetails, fileName)).isDisplayed();
    }

    async isAttachButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.attachButton).isDisplayed();
    }

    async isCancelButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.cancelButton).isDisplayed();
    }

    async isAttachFromLocalDriveButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.attachFromLocalDriveButton).isDisplayed();
    }

    async isBladeTitleDisplayed(): Promise<boolean> {
        return await $(this.selectors.bladeTitle).getText() == 'Attach Document' ? true : false;
    }

    async isPaginationPresent(): Promise<boolean> {
        return await $(this.selectors.pagination).isPresent();
    }

    async clickOnFilterApplyButton(): Promise<void> {
        await $(this.selectors.filterApplyButton).click();
    }



    async searchAndAttachDocument(documentName: string): Promise<void> {
        await this.clickOnAdvanceSearchButton();
        await this.searchRecord(documentName);
        await this.selectDocument();
        await this.clickOnAttachButton();
    }

    async clickOnAdvanceSearchButton(): Promise<void> {
        await element(by.cssContainingText(this.selectors.advanceSearchButton, 'Advanced search options')).click();
    }

    async searchRecord(documentName: string): Promise<void> {
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


    async isDocumentLibaryPresent(documentName: string): Promise<boolean> {
        return await $(`.km-group-list-item__description[title="${documentName}"]`).isPresent();
    }

    async selectDocument(): Promise<void> {
        await $(this.selectors.iconCircle).click();
    }

    async clickOnAttachButton(): Promise<void> {
        await $(this.selectors.attachButton).click();
    }
}

export default new AttachDocumentBlade();