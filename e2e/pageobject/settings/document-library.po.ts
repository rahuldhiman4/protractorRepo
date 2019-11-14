import { element, by, ProtractorExpectedConditions, protractor, browser, $, $$ } from "protractor"
import { resolve } from "path";

class DocumentLibraryPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        addDocumentButton: '[rx-view-component-id="c2df3218-8ef7-402c-bdc2-721e891346bb"] button',
        titleField: '[rx-view-component-id="f7b3ab85-7c96-4d90-8c9d-06b4a761b090"] input',
        attachmentField: '[rx-view-component-id="d9a66a3a-d637-45d7-bb1c-bd60a50c5914"] input',
        companyField: '[rx-view-component-id="cc6775d9-040f-4fde-bddf-7ab2334d6881"]',
        selectOptionList: 'ul.ui-select-choices',
        ownerGroupField: '[rx-view-component-id="001ddea2-b59d-49dc-ac5e-628f3a75e9fa"]',
        saveButton: '[rx-view-component-id="2ddf1845-1e5a-48f9-b6fd-1497f9be0daf"] button',
        documentGrid: '[rx-view-component-id="5d1f94a9-693e-4dbf-896f-3b9689f95a42"]',
        gridRow: '.ui-grid-row',
        gridSearchText: 'input[rx-id="search-text-input"]',
        gridCell: '.ui-grid-cell',
        gridCellLink: '.ui-grid__link',
        alert: '.rx-growl-item__message',
        busyLoading: '.ui-grid .cg-busy__cover'
    }

    async addAttachment(): Promise<void> {
        const fileToUpload = '../mock/files/SFTBR-04U.PDF';
        const absolutePath = resolve(__dirname, fileToUpload);
        console.log(absolutePath);
        await $(this.selectors.attachmentField).sendKeys(absolutePath);
    }

    async openAddNewDocumentBlade(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addDocumentButton)));
        await $(this.selectors.addDocumentButton).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.titleField)));
    }

    async enterTitle(title: string): Promise<void> {
        await $(this.selectors.titleField).sendKeys(title);
    }

    async selectCompany(companyName: string): Promise<void> {
        const companyField = $(this.selectors.companyField);
        await companyField.$('.ui-select-toggle').click();
        await browser.wait(this.EC.visibilityOf(companyField.$(this.selectors.selectOptionList)));
        await element(by.css(`${this.selectors.selectOptionList} li span[title="${companyName}"]`)).click();
    }

    async selectOwnerGroup(ownerGroupName: string = "Workforce Administration"): Promise<void> {
        const ownerGroupField = $(this.selectors.ownerGroupField);
        await ownerGroupField.$('.ui-select-toggle').click();
        await browser.wait(this.EC.visibilityOf(ownerGroupField.$(this.selectors.selectOptionList)));
        await element(by.css(`${this.selectors.selectOptionList} li span[title="${ownerGroupName}"]`)).click();
    }

    async saveNewDocument(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        $(this.selectors.saveButton).click();
    }

    async getAlertText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.alert)));
        return await $(this.selectors.alert).getText();
    }

    async searchGrid(searchText: string): Promise<void> {
        await $(this.selectors.documentGrid).$(this.selectors.gridSearchText).sendKeys(searchText);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
        await browser.wait(this.EC.and(async () => {
            const count = await $(this.selectors.documentGrid).$$(this.selectors.gridRow).count();
            return count == 1;
        }));
    }

    async getRowCount(): Promise<number> {
        return await $(this.selectors.documentGrid).$$(this.selectors.gridRow).count();
    }

    async getFirstCellText(): Promise<string> {
        return await $(this.selectors.documentGrid).$$(this.selectors.gridRow).first()
            .$$(this.selectors.gridCell).first()
            .$(this.selectors.gridCellLink).getText();
    }
}

export default new DocumentLibraryPage();