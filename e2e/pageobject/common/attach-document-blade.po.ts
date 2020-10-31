import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class AttachDocumentBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        bladeTitle: '.dp-header .dp-title',
        advanceSearchButton: '[rx-view-component-id="6b6c2401-1732-4a8f-b746-0b3ab3d9df8a"] button',
        searchBox: '[rx-view-component-id="6b6c2401-1732-4a8f-b746-0b3ab3d9df8a"] input',
        iconCircle: '[rx-view-component-id="6b6c2401-1732-4a8f-b746-0b3ab3d9df8a"] [role="checkbox"]',
        documentSearchResults: '[rx-view-component-id="6b6c2401-1732-4a8f-b746-0b3ab3d9df8a"] [role="listitem"]',
        attachButton: '[rx-view-component-id="9d41c65a-85a9-4316-bd64-8fa8ed68dfde"] button',
        cancelButton: '[rx-view-component-id="0a24a406-071f-4818-ab29-7b8fb80a202e"] button',
        attachFromLocalDriveButton: '[rx-view-component-id="703c693f-068a-4cd3-9283-dd9b9cdf2714"] button',
        listHeading: '[rx-view-component-id="6b6c2401-1732-4a8f-b746-0b3ab3d9df8a"] .bwf-search-result h2',
        pagination: '.content-outlet .justify-content-center nav[aria-label="Page navigation"]',
        filterApplyButton: '.justify-content-end .btn-primary',
    }

    async getTextOfDocumentListHeading(): Promise<string> {
        return await $(this.selectors.listHeading).getText();
    }

    async isDocumentInfoDisplayed(documentInfo: string): Promise<boolean> {
        return await $(this.selectors.documentSearchResults + ` [title="${documentInfo}"]`).isPresent().then(async (present) => {
            if (present) return await $(this.selectors.documentSearchResults + ` [title="${documentInfo}"]`).isDisplayed();
            else return false;
        });
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
        await this.selectDocument(documentName);
        await this.clickOnAttachButton();
    }

    async clickOnAdvanceSearchButton(): Promise<void> {
        await element(by.cssContainingText(this.selectors.advanceSearchButton, 'Advanced search options')).click();
    }

    async searchRecord(documentName: string): Promise<void> {
        await browser.sleep(30000); // workaround for performance issue
        await $(this.selectors.searchBox).clear();
        await $(this.selectors.searchBox).sendKeys(documentName + protractor.Key.ENTER);
        let i: number;
        for (i = 0; i <= 5; i++) {
            console.log(documentName, "search doc lib count: ", i);
            let bolnVal: boolean = await this.isDocumentInfoDisplayed(documentName);
            if (bolnVal == false) {
                await browser.sleep(3000); // To Wait For Document Libarary Record Gets Display On Blade.
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

    async selectDocument(documentName?: string): Promise<void> {
        if (documentName) {
            let numberOfDocs = await $$(this.selectors.documentSearchResults).count();
            for (let i: number = 0; i < numberOfDocs; i++) {
                await $$(this.selectors.documentSearchResults).get(i).$(`[title="${documentName}"]`).isPresent().then(async (present) => {
                    if (present) await $$(this.selectors.documentSearchResults).get(i).$('[role="checkbox"]').click();
                });
            }
        } else {
            await $(this.selectors.iconCircle).isPresent().then(async () => {
                await $(this.selectors.iconCircle).click();
            });
        }
    }

    async clickOnAttachButton(): Promise<void> {
        await $(this.selectors.attachButton).click();
    }
}

export default new AttachDocumentBlade();